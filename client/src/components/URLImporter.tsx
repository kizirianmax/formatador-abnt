import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Loader2, Check, AlertCircle, Copy } from "lucide-react";

interface ExtractedData {
  title: string;
  author: string;
  publishedDate: string;
  description: string;
  siteName: string;
  url: string;
  accessDate: string;
}

interface URLImporterProps {
  onReferenceGenerated?: (reference: string) => void;
}

export default function URLImporter({ onReferenceGenerated }: URLImporterProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [abntReference, setAbntReference] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError("Digite uma URL válida");
      return;
    }

    // Validar URL
    try {
      new URL(url);
    } catch {
      setError("URL inválida. Certifique-se de incluir http:// ou https://");
      return;
    }

    setIsLoading(true);
    setError("");
    setExtractedData(null);
    setAbntReference("");

    try {
      const response = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);
        setAbntReference(result.abntReference);
      } else {
        setError(result.error || "Erro ao extrair dados da URL");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(abntReference.replace(/\*\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddReference = () => {
    if (onReferenceGenerated && abntReference) {
      onReferenceGenerated(abntReference.replace(/\*\*/g, ''));
      // Limpar após adicionar
      setUrl("");
      setExtractedData(null);
      setAbntReference("");
    }
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="h-5 w-5 text-indigo-600" />
          Importar de URL
        </CardTitle>
        <CardDescription>
          Cole o link de um site e extraia automaticamente os dados para a referência ABNT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input de URL */}
        <div className="flex gap-2">
          <Input
            placeholder="https://exemplo.com/artigo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            className="flex-1"
          />
          <Button 
            onClick={handleExtract} 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Extrair"
            )}
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Dados extraídos */}
        {extractedData && (
          <div className="space-y-3 bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-sm text-gray-700">Dados Extraídos:</h4>
            <div className="grid gap-2 text-sm">
              {extractedData.title && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[80px]">Título:</span>
                  <span className="text-gray-900">{extractedData.title}</span>
                </div>
              )}
              {extractedData.author && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[80px]">Autor:</span>
                  <span className="text-gray-900">{extractedData.author}</span>
                </div>
              )}
              {extractedData.siteName && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[80px]">Site:</span>
                  <span className="text-gray-900">{extractedData.siteName}</span>
                </div>
              )}
              {extractedData.publishedDate && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[80px]">Data:</span>
                  <span className="text-gray-900">{extractedData.publishedDate}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-500 min-w-[80px]">Acesso:</span>
                <span className="text-gray-900">{extractedData.accessDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Referência ABNT gerada */}
        {abntReference && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Referência ABNT:</h4>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-800 font-mono leading-relaxed">
                {abntReference.replace(/\*\*/g, '')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
              {onReferenceGenerated && (
                <Button
                  size="sm"
                  onClick={handleAddReference}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Adicionar às Referências
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Dica */}
        <p className="text-xs text-gray-500">
          💡 Funciona melhor com sites de notícias, blogs e artigos que possuem metadados bem estruturados.
        </p>
      </CardContent>
    </Card>
  );
}

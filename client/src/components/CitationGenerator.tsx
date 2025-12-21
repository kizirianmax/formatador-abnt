import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Quote, 
  Copy, 
  Check, 
  BookOpen,
  FileText,
  Globe,
  GraduationCap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitationGeneratorProps {
  onInsertCitation?: (citation: string) => void;
}

type SourceType = "livro" | "artigo" | "site" | "tese";

interface CitationData {
  author: string;
  year: string;
  page?: string;
  quote?: string;
}

export default function CitationGenerator({ onInsertCitation }: CitationGeneratorProps) {
  const [sourceType, setSourceType] = useState<SourceType>("livro");
  const [citationData, setCitationData] = useState<CitationData>({
    author: "",
    year: "",
    page: "",
    quote: ""
  });
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof CitationData, value: string) => {
    setCitationData(prev => ({ ...prev, [field]: value }));
  };

  // Formatar autor para citação (SOBRENOME em maiúsculas)
  const formatAuthorForCitation = (author: string): string => {
    if (!author) return "";
    
    const parts = author.split(" ");
    if (parts.length === 1) return author.toUpperCase();
    
    // Pegar o último sobrenome
    const lastName = parts[parts.length - 1].toUpperCase();
    return lastName;
  };

  // Gerar citação direta curta (até 3 linhas)
  const generateDirectShort = (): string => {
    const authorFormatted = formatAuthorForCitation(citationData.author);
    const { year, page, quote } = citationData;
    
    if (!authorFormatted || !year) return "";
    
    const pageRef = page ? `, p. ${page}` : "";
    
    if (quote) {
      return `"${quote}" (${authorFormatted}, ${year}${pageRef}).`;
    }
    
    return `(${authorFormatted}, ${year}${pageRef})`;
  };

  // Gerar citação direta longa (mais de 3 linhas)
  const generateDirectLong = (): string => {
    const authorFormatted = formatAuthorForCitation(citationData.author);
    const { year, page, quote } = citationData;
    
    if (!authorFormatted || !year) return "";
    
    const pageRef = page ? `, p. ${page}` : "";
    
    if (quote) {
      return `${quote} (${authorFormatted}, ${year}${pageRef}).`;
    }
    
    return `(${authorFormatted}, ${year}${pageRef})`;
  };

  // Gerar citação indireta (paráfrase)
  const generateIndirect = (): string => {
    const authorFormatted = formatAuthorForCitation(citationData.author);
    const { year } = citationData;
    
    if (!authorFormatted || !year) return "";
    
    return `(${authorFormatted}, ${year})`;
  };

  // Gerar citação com autor no texto
  const generateAuthorInText = (): string => {
    const authorFormatted = formatAuthorForCitation(citationData.author);
    const { year, page } = citationData;
    
    if (!authorFormatted || !year) return "";
    
    const pageRef = page ? `, p. ${page}` : "";
    
    // Primeira letra maiúscula, resto minúscula
    const authorCapitalized = authorFormatted.charAt(0) + authorFormatted.slice(1).toLowerCase();
    
    return `Segundo ${authorCapitalized} (${year}${pageRef}),`;
  };

  // Gerar apud (citação de citação)
  const generateApud = (): string => {
    const authorFormatted = formatAuthorForCitation(citationData.author);
    const { year, page } = citationData;
    
    if (!authorFormatted || !year) return "";
    
    const pageRef = page ? `, p. ${page}` : "";
    
    return `(${authorFormatted}, ${year}${pageRef} apud AUTOR_SECUNDÁRIO, ANO)`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleInsert = (text: string) => {
    if (onInsertCitation) {
      onInsertCitation(text);
    }
  };

  const sourceIcons: Record<SourceType, React.ReactNode> = {
    livro: <BookOpen className="h-4 w-4" />,
    artigo: <FileText className="h-4 w-4" />,
    site: <Globe className="h-4 w-4" />,
    tese: <GraduationCap className="h-4 w-4" />
  };

  const citations = [
    { 
      type: "direct-short", 
      label: "Citação Direta Curta", 
      description: "Até 3 linhas, entre aspas",
      text: generateDirectShort(),
      example: '"Texto citado" (SILVA, 2023, p. 45).'
    },
    { 
      type: "direct-long", 
      label: "Citação Direta Longa", 
      description: "Mais de 3 linhas, recuo 4cm",
      text: generateDirectLong(),
      example: 'Texto citado com recuo de 4cm, fonte menor, sem aspas (SILVA, 2023, p. 45).'
    },
    { 
      type: "indirect", 
      label: "Citação Indireta", 
      description: "Paráfrase do autor",
      text: generateIndirect(),
      example: '(SILVA, 2023)'
    },
    { 
      type: "author-text", 
      label: "Autor no Texto", 
      description: "Nome do autor na frase",
      text: generateAuthorInText(),
      example: 'Segundo Silva (2023, p. 45),'
    },
    { 
      type: "apud", 
      label: "Apud (Citação de Citação)", 
      description: "Citar autor através de outro",
      text: generateApud(),
      example: '(SILVA, 2023, p. 45 apud SANTOS, 2024)'
    }
  ];

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Quote className="h-5 w-5 text-purple-600" />
              Gerador de Citações ABNT
            </CardTitle>
            <CardDescription>
              Gere citações diretas e indiretas formatadas corretamente
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Recolher" : "Expandir"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Formulário de dados */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="citation-author">Autor *</Label>
              <Input
                id="citation-author"
                placeholder="Ex: João Silva"
                value={citationData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="citation-year">Ano *</Label>
              <Input
                id="citation-year"
                placeholder="Ex: 2023"
                value={citationData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="citation-page">Página (opcional)</Label>
              <Input
                id="citation-page"
                placeholder="Ex: 45"
                value={citationData.page}
                onChange={(e) => handleInputChange("page", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Fonte</Label>
              <Select
                value={sourceType}
                onValueChange={(v) => setSourceType(v as SourceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="livro">📚 Livro</SelectItem>
                  <SelectItem value="artigo">📄 Artigo</SelectItem>
                  <SelectItem value="site">🌐 Site</SelectItem>
                  <SelectItem value="tese">🎓 Tese/Dissertação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="citation-quote">Texto da Citação (para citação direta)</Label>
            <Input
              id="citation-quote"
              placeholder="Cole o texto que deseja citar..."
              value={citationData.quote}
              onChange={(e) => handleInputChange("quote", e.target.value)}
            />
          </div>

          {/* Lista de citações geradas */}
          {citationData.author && citationData.year && (
            <div className="space-y-3 mt-4">
              <h4 className="font-medium text-sm text-gray-700">Citações Geradas:</h4>
              
              {citations.map((citation) => (
                <div
                  key={citation.type}
                  className="p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">
                        {citation.label}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {citation.description}
                      </p>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                        {citation.text || <span className="text-gray-400 italic">Preencha autor e ano</span>}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCopy(citation.text, citation.type)}
                        disabled={!citation.text}
                      >
                        {copiedType === citation.type ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      {onInsertCitation && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-purple-600"
                          onClick={() => handleInsert(citation.text)}
                          disabled={!citation.text}
                        >
                          Inserir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dicas */}
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm">
            <p className="font-medium text-purple-800 mb-1">💡 Dicas ABNT:</p>
            <ul className="text-purple-700 space-y-1 text-xs">
              <li>• Citação direta curta: até 3 linhas, entre aspas, no corpo do texto</li>
              <li>• Citação direta longa: mais de 3 linhas, recuo 4cm, fonte menor, sem aspas</li>
              <li>• Citação indireta: paráfrase, não precisa de aspas nem página</li>
              <li>• Apud: use apenas quando não tiver acesso à obra original</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

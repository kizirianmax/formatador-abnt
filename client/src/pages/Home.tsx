import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, BookOpen, Calendar, Search, Library as LibraryIcon, Save } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import URLImporter from "@/components/URLImporter";
import ReferenceLibrary from "@/components/ReferenceLibrary";
import CitationGenerator from "@/components/CitationGenerator";
import DocumentExporter from "@/components/DocumentExporter";
import CloudSync from "@/components/CloudSync";
import { useReferenceLibrary } from "@/hooks/useReferenceLibrary";


export default function Home() {
  const { addReference } = useReferenceLibrary();
  const [workData, setWorkData] = useState({
    title: "",
    author: "",
    institution: "",
    course: "",
    city: "",
    year: new Date().getFullYear().toString(),
    abstract: "",
    keywords: "",
    introduction: "",
    development: "",
    conclusion: "",
    references: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setWorkData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = () => {
    // Aqui será implementada a geração do PDF
    alert("Gerando PDF com formatação ABNT...");
  };

  const handleAddReference = (reference: string) => {
    setWorkData(prev => ({
      ...prev,
      references: prev.references ? prev.references + "\n\n" + reference : reference
    }));
  };

  const handleSaveToLibrary = (reference: string, type: "site" | "livro" | "artigo" | "tese" | "outro" = "outro") => {
    addReference(reference, type);
  };

  const handleSelectFromLibrary = (reference: string) => {
    handleAddReference(reference);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Formatador ABNT Online</h1>
              <p className="text-sm text-gray-600">Formate seus trabalhos acadêmicos automaticamente</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Editor */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados do Trabalho
                </CardTitle>
                <CardDescription>
                  Preencha as informações do seu trabalho acadêmico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="capa" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="capa">Capa</TabsTrigger>
                    <TabsTrigger value="resumo">Resumo</TabsTrigger>
                    <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                    <TabsTrigger value="referencias">Referências</TabsTrigger>
                  </TabsList>

                  {/* Aba Capa */}
                  <TabsContent value="capa" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título do Trabalho *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: A Importância da Tecnologia na Educação"
                        value={workData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Autor *</Label>
                      <Input
                        id="author"
                        placeholder="Seu nome completo"
                        value={workData.author}
                        onChange={(e) => handleInputChange("author", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="institution">Instituição *</Label>
                        <Input
                          id="institution"
                          placeholder="Nome da universidade"
                          value={workData.institution}
                          onChange={(e) => handleInputChange("institution", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course">Curso *</Label>
                        <Input
                          id="course"
                          placeholder="Ex: Engenharia de Software"
                          value={workData.course}
                          onChange={(e) => handleInputChange("course", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="Ex: São Paulo"
                          value={workData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Ano *</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2025"
                          value={workData.year}
                          onChange={(e) => handleInputChange("year", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Aba Resumo */}
                  <TabsContent value="resumo" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="abstract">Resumo</Label>
                      <Textarea
                        id="abstract"
                        placeholder="Escreva um resumo do seu trabalho (150-500 palavras)"
                        className="min-h-[200px]"
                        value={workData.abstract}
                        onChange={(e) => handleInputChange("abstract", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Palavras: {workData.abstract.split(/\s+/).filter(Boolean).length}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywords">Palavras-chave</Label>
                      <Input
                        id="keywords"
                        placeholder="Separe por vírgula. Ex: Tecnologia, Educação, Inovação"
                        value={workData.keywords}
                        onChange={(e) => handleInputChange("keywords", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Aba Conteúdo */}
                  <TabsContent value="conteudo" className="space-y-4">
                    {/* Gerador de Citações */}
                    <CitationGenerator 
                      onInsertCitation={(citation) => {
                        // Inserir citação no campo de desenvolvimento
                        setWorkData(prev => ({
                          ...prev,
                          development: prev.development ? prev.development + " " + citation : citation
                        }));
                      }}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="introduction">1. Introdução</Label>
                      <Textarea
                        id="introduction"
                        placeholder="Escreva a introdução do seu trabalho"
                        className="min-h-[150px]"
                        value={workData.introduction}
                        onChange={(e) => handleInputChange("introduction", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="development">2. Desenvolvimento</Label>
                      <Textarea
                        id="development"
                        placeholder="Escreva o desenvolvimento do seu trabalho"
                        className="min-h-[200px]"
                        value={workData.development}
                        onChange={(e) => handleInputChange("development", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conclusion">3. Conclusão</Label>
                      <Textarea
                        id="conclusion"
                        placeholder="Escreva a conclusão do seu trabalho"
                        className="min-h-[150px]"
                        value={workData.conclusion}
                        onChange={(e) => handleInputChange("conclusion", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Aba Referências */}
                  <TabsContent value="referencias" className="space-y-4">
                    {/* Importar de URL */}
                    <URLImporter 
                      onReferenceGenerated={(ref) => {
                        handleAddReference(ref);
                        // Salvar automaticamente na biblioteca como site
                        handleSaveToLibrary(ref, "site");
                      }} 
                    />

                    {/* Biblioteca de Referências */}
                    <ReferenceLibrary onSelectReference={handleSelectFromLibrary} />

                    <div className="space-y-2">
                      <Label htmlFor="references">Referências Bibliográficas</Label>
                      <Textarea
                        id="references"
                        placeholder="Cole suas referências aqui (uma por linha)&#10;&#10;Exemplo:&#10;SOBRENOME, Nome. Título do livro. Cidade: Editora, Ano.&#10;AUTOR, Nome. Título do artigo. Nome da Revista, v. X, n. Y, p. Z-W, Ano."
                        className="min-h-[250px] font-mono text-sm"
                        value={workData.references}
                        onChange={(e) => handleInputChange("references", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        {workData.references.split('\n').filter(Boolean).length} referência(s)
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exportar Documento */}
            <DocumentExporter workData={workData} />

            {/* Sincronização na Nuvem */}
            <CloudSync />

            {/* Normas ABNT */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Normas ABNT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                  <p>Margens: 3cm superior e esquerda, 2cm inferior e direita</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                  <p>Fonte: Arial ou Times New Roman, tamanho 12</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                  <p>Espaçamento: 1,5 entre linhas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                  <p>Numeração: a partir da introdução</p>
                </div>
              </CardContent>
            </Card>

            {/* Outras Ferramentas */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-lg">Outras Ferramentas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/cronograma">
                  <div className="p-3 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Gerador de Cronogramas</span>
                          <Badge className="bg-green-500 text-xs">Novo</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Crie planos de estudo personalizados</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="p-3 bg-white/50 rounded-lg border border-dashed opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">Source-Proof</span>
                        <Badge variant="outline" className="text-xs">Em breve</Badge>
                      </div>
                      <p className="text-xs text-gray-400">Valide fontes acadêmicas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ajuda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Precisa de ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>
                  Este formatador segue as normas ABNT NBR 14724:2011 para trabalhos acadêmicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto py-6 text-center text-sm text-gray-600">
          <p>Formatador ABNT Online - Desenvolvido para facilitar sua vida acadêmica</p>
        </div>
      </footer>
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Library, 
  Search, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  BookOpen, 
  Globe, 
  FileText, 
  GraduationCap,
  FolderPlus,
  Folder,
  X
} from "lucide-react";
import { useReferenceLibrary, Reference } from "@/hooks/useReferenceLibrary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReferenceLibraryProps {
  onSelectReference?: (reference: string) => void;
}

const typeIcons: Record<Reference["type"], React.ReactNode> = {
  site: <Globe className="h-4 w-4 text-blue-500" />,
  livro: <BookOpen className="h-4 w-4 text-green-500" />,
  artigo: <FileText className="h-4 w-4 text-orange-500" />,
  tese: <GraduationCap className="h-4 w-4 text-purple-500" />,
  outro: <FileText className="h-4 w-4 text-gray-500" />
};

const typeLabels: Record<Reference["type"], string> = {
  site: "Site",
  livro: "Livro",
  artigo: "Artigo",
  tese: "Tese/Dissertação",
  outro: "Outro"
};

export default function ReferenceLibrary({ onSelectReference }: ReferenceLibraryProps) {
  const {
    references,
    projects,
    addReference,
    removeReference,
    addProject,
    removeProject,
    searchReferences,
    getByProject,
    exportAsText,
    totalCount
  } = useReferenceLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newRefText, setNewRefText] = useState("");
  const [newRefType, setNewRefType] = useState<Reference["type"]>("outro");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrar referências
  const filteredRefs = searchQuery 
    ? searchReferences(searchQuery)
    : getByProject(selectedProject);

  const handleCopy = (ref: Reference) => {
    navigator.clipboard.writeText(ref.text);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddReference = () => {
    if (!newRefText.trim()) return;
    
    addReference(
      newRefText.trim(),
      newRefType,
      undefined,
      undefined,
      selectedProject || undefined
    );
    
    setNewRefText("");
    setShowAddForm(false);
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    addProject(newProjectName.trim());
    setNewProjectName("");
    setShowProjectForm(false);
  };

  const handleExportAll = () => {
    const text = exportAsText();
    navigator.clipboard.writeText(text);
    alert(`${totalCount} referência(s) copiada(s) para a área de transferência!`);
  };

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Library className="h-5 w-5 text-emerald-600" />
              Biblioteca de Referências
              {totalCount > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({totalCount})
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Salve e reutilize suas referências em diferentes trabalhos
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
          {/* Barra de busca e filtros */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar referências..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedProject || "all"}
              onValueChange={(v) => setSelectedProject(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ações */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-emerald-700 border-emerald-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="text-blue-700 border-blue-300"
            >
              <FolderPlus className="h-4 w-4 mr-1" />
              Novo Projeto
            </Button>
            {totalCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAll}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar Todas
              </Button>
            )}
          </div>

          {/* Formulário de novo projeto */}
          {showProjectForm && (
            <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Input
                placeholder="Nome do projeto (ex: TCC, Monografia)"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddProject}>
                Criar
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowProjectForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Formulário de adicionar referência */}
          {showAddForm && (
            <div className="space-y-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex gap-2">
                <Select
                  value={newRefType}
                  onValueChange={(v) => setNewRefType(v as Reference["type"])}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="livro">📚 Livro</SelectItem>
                    <SelectItem value="artigo">📄 Artigo</SelectItem>
                    <SelectItem value="site">🌐 Site</SelectItem>
                    <SelectItem value="tese">🎓 Tese</SelectItem>
                    <SelectItem value="outro">📝 Outro</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Cole a referência ABNT completa..."
                  value={newRefText}
                  onChange={(e) => setNewRefText(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddReference}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Salvar na Biblioteca
                </Button>
              </div>
            </div>
          )}

          {/* Lista de projetos */}
          {projects.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                    selectedProject === p.id
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedProject(
                    selectedProject === p.id ? null : p.id
                  )}
                >
                  <Folder className="h-3 w-3" />
                  {p.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remover projeto "${p.name}"?`)) {
                        removeProject(p.id);
                      }
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Lista de referências */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredRefs.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                {searchQuery 
                  ? "Nenhuma referência encontrada" 
                  : "Sua biblioteca está vazia. Adicione referências para reutilizá-las!"}
              </div>
            ) : (
              filteredRefs.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-start gap-2 p-3 bg-white rounded-lg border hover:border-emerald-300 transition-colors group"
                >
                  <div className="mt-0.5">{typeIcons[ref.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {ref.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {typeLabels[ref.type]} • {new Date(ref.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCopy(ref)}
                    >
                      {copiedId === ref.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {onSelectReference && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-emerald-600"
                        onClick={() => onSelectReference(ref.text)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => {
                        if (confirm("Remover esta referência?")) {
                          removeReference(ref.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dica */}
          <p className="text-xs text-gray-500">
            💡 Organize suas referências por projeto para encontrá-las facilmente em trabalhos futuros.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, BookOpen, Sparkles, Download, Plus, X, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

// Matérias pré-definidas por categoria
const MATERIAS_CATEGORIAS = {
  "Exatas": ["Matemática", "Física", "Química", "Estatística", "Raciocínio Lógico"],
  "Humanas": ["Português", "História", "Geografia", "Filosofia", "Sociologia", "Atualidades"],
  "Línguas": ["Inglês", "Espanhol", "Redação"],
  "Específicas": ["Direito Constitucional", "Direito Administrativo", "Informática", "Contabilidade", "Economia"],
};

// Tipos de objetivo
const TIPOS_OBJETIVO = [
  { value: "concurso", label: "Concurso Público" },
  { value: "vestibular", label: "Vestibular/ENEM" },
  { value: "prova", label: "Prova/Exame" },
  { value: "certificacao", label: "Certificação" },
  { value: "outro", label: "Outro" },
];

interface MateriaConfig {
  nome: string;
  prioridade: "alta" | "media" | "baixa";
  horasSemanais?: number;
}

interface CronogramaGerado {
  semanas: SemanaEstudo[];
  totalHoras: number;
  recomendacoes: string[];
}

interface SemanaEstudo {
  numero: number;
  dias: DiaEstudo[];
}

interface DiaEstudo {
  dia: string;
  blocos: BlocoEstudo[];
}

interface BlocoEstudo {
  materia: string;
  duracao: number; // em minutos
  tipo: "teoria" | "exercicios" | "revisao";
}

export default function Cronograma() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cronogramaGerado, setCronogramaGerado] = useState<CronogramaGerado | null>(null);
  
  // Dados do formulário
  const [objetivo, setObjetivo] = useState("");
  const [tipoObjetivo, setTipoObjetivo] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [horasPorDia, setHorasPorDia] = useState("3");
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [materias, setMaterias] = useState<MateriaConfig[]>([]);
  const [materiaCustom, setMateriaCustom] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const diasSemana = [
    { value: "seg", label: "Seg" },
    { value: "ter", label: "Ter" },
    { value: "qua", label: "Qua" },
    { value: "qui", label: "Qui" },
    { value: "sex", label: "Sex" },
    { value: "sab", label: "Sáb" },
    { value: "dom", label: "Dom" },
  ];

  const toggleDia = (dia: string) => {
    setDiasDisponiveis(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const addMateria = (nome: string) => {
    if (!materias.find(m => m.nome === nome)) {
      setMaterias(prev => [...prev, { nome, prioridade: "media" }]);
    }
  };

  const removeMateria = (nome: string) => {
    setMaterias(prev => prev.filter(m => m.nome !== nome));
  };

  const updateMateriaPrioridade = (nome: string, prioridade: "alta" | "media" | "baixa") => {
    setMaterias(prev => prev.map(m => 
      m.nome === nome ? { ...m, prioridade } : m
    ));
  };

  const addMateriaCustom = () => {
    if (materiaCustom.trim()) {
      addMateria(materiaCustom.trim());
      setMateriaCustom("");
    }
  };

  const calcularSemanasAteData = () => {
    if (!dataLimite || dataLimite.length < 10) return 0;
    // Converter DD/MM/AAAA para Date
    const partes = dataLimite.split('/');
    if (partes.length !== 3) return 0;
    const [dia, mes, ano] = partes;
    const limite = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const hoje = new Date();
    const diffTime = limite.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  };

  const gerarCronograma = async () => {
    setIsGenerating(true);
    
    // Simular geração com IA (em produção, chamaria a API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const semanas = calcularSemanasAteData();
    const horasTotal = semanas * diasDisponiveis.length * parseInt(horasPorDia);
    
    // Distribuir matérias por prioridade
    const materiasAlta = materias.filter(m => m.prioridade === "alta");
    const materiasMedia = materias.filter(m => m.prioridade === "media");
    const materiasBaixa = materias.filter(m => m.prioridade === "baixa");
    
    // Gerar cronograma exemplo
    const cronograma: CronogramaGerado = {
      semanas: Array.from({ length: Math.min(semanas, 4) }, (_, i) => ({
        numero: i + 1,
        dias: diasDisponiveis.map(dia => ({
          dia,
          blocos: gerarBlocosDia(materiasAlta, materiasMedia, materiasBaixa, parseInt(horasPorDia))
        }))
      })),
      totalHoras: horasTotal,
      recomendacoes: [
        "Comece sempre pelas matérias de maior dificuldade quando estiver mais descansado",
        "Faça pausas de 10-15 minutos a cada 50 minutos de estudo",
        "Revise o conteúdo do dia anterior antes de começar novos tópicos",
        "Reserve pelo menos 30% do tempo para exercícios práticos",
        "Mantenha um caderno de erros para revisar antes da prova"
      ]
    };
    
    setCronogramaGerado(cronograma);
    setIsGenerating(false);
    setStep(4);
  };

  const gerarBlocosDia = (
    alta: MateriaConfig[], 
    media: MateriaConfig[], 
    baixa: MateriaConfig[],
    horas: number
  ): BlocoEstudo[] => {
    const blocos: BlocoEstudo[] = [];
    let minutosRestantes = horas * 60;
    
    // Prioridade alta: 50% do tempo
    const minutosAlta = Math.floor(minutosRestantes * 0.5);
    // Prioridade média: 35% do tempo
    const minutosMedia = Math.floor(minutosRestantes * 0.35);
    // Prioridade baixa: 15% do tempo
    const minutosBaixa = minutosRestantes - minutosAlta - minutosMedia;
    
    // Distribuir matérias de alta prioridade
    if (alta.length > 0) {
      const tempoPorMateria = Math.floor(minutosAlta / alta.length);
      alta.forEach(m => {
        blocos.push({
          materia: m.nome,
          duracao: Math.min(tempoPorMateria, 90), // máximo 90 min por bloco
          tipo: Math.random() > 0.5 ? "teoria" : "exercicios"
        });
      });
    }
    
    // Distribuir matérias de média prioridade
    if (media.length > 0) {
      const tempoPorMateria = Math.floor(minutosMedia / media.length);
      media.forEach(m => {
        blocos.push({
          materia: m.nome,
          duracao: Math.min(tempoPorMateria, 60),
          tipo: Math.random() > 0.5 ? "teoria" : "exercicios"
        });
      });
    }
    
    // Distribuir matérias de baixa prioridade
    if (baixa.length > 0) {
      const tempoPorMateria = Math.floor(minutosBaixa / baixa.length);
      baixa.forEach(m => {
        blocos.push({
          materia: m.nome,
          duracao: Math.min(tempoPorMateria, 45),
          tipo: "revisao"
        });
      });
    }
    
    return blocos.slice(0, 4); // máximo 4 blocos por dia
  };

  const formatarDuracao = (minutos: number) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0 && m > 0) return `${h}h${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  };

  const exportarPDF = () => {
    alert("Exportando cronograma como PDF...");
    // Em produção, geraria o PDF real
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "teoria": return "bg-blue-500";
      case "exercicios": return "bg-purple-500";
      case "revisao": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gerador de Cronogramas</h1>
                  <p className="text-xs text-gray-600">Crie seu plano de estudos personalizado</p>
                </div>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s 
                      ? "bg-indigo-600 text-white" 
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`w-8 h-0.5 ${step > s ? "bg-indigo-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Step 1: Objetivo */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-3 bg-indigo-100 rounded-full w-fit mb-4">
                  <Target className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl">Qual é seu objetivo?</CardTitle>
                <CardDescription>
                  Conte-nos sobre o que você está estudando
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoObjetivo">Tipo de Objetivo</Label>
                  <Select value={tipoObjetivo} onValueChange={setTipoObjetivo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_OBJETIVO.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivo">Descreva seu objetivo</Label>
                  <Textarea
                    id="objetivo"
                    placeholder="Ex: Passar no concurso do Banco do Brasil, Aprovação no ENEM com nota acima de 800..."
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataLimite">Data da Prova/Limite</Label>
                  <Input
                    id="dataLimite"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={dataLimite}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
                      if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5);
                      if (value.length > 10) value = value.slice(0, 10);
                      setDataLimite(value);
                    }}
                    maxLength={10}
                  />
                  {dataLimite && (
                    <p className="text-sm text-indigo-600">
                      📅 {calcularSemanasAteData()} semanas até a data limite
                    </p>
                  )}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!tipoObjetivo || !objetivo || !dataLimite}
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Matérias */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Quais matérias você precisa estudar?</CardTitle>
                <CardDescription>
                  Selecione as matérias e defina a prioridade de cada uma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {/* Matérias por categoria */}
                {Object.entries(MATERIAS_CATEGORIAS).map(([categoria, lista]) => (
                  <div key={categoria} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">{categoria}</Label>
                    <div className="flex flex-wrap gap-2">
                      {lista.map(materia => (
                        <Badge
                          key={materia}
                          variant={materias.find(m => m.nome === materia) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            materias.find(m => m.nome === materia) 
                              ? "bg-indigo-600 hover:bg-indigo-700" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => 
                            materias.find(m => m.nome === materia) 
                              ? removeMateria(materia) 
                              : addMateria(materia)
                          }
                        >
                          {materia}
                          {materias.find(m => m.nome === materia) && (
                            <X className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Adicionar matéria customizada */}
                <div className="space-y-2">
                  <Label>Adicionar outra matéria</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da matéria"
                      value={materiaCustom}
                      onChange={(e) => setMateriaCustom(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addMateriaCustom()}
                    />
                    <Button variant="outline" onClick={addMateriaCustom}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Matérias selecionadas com prioridade */}
                {materias.length > 0 && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Defina a prioridade de cada matéria:</Label>
                    {materias.map(materia => (
                      <div key={materia.nome} className="flex items-center justify-between gap-4 p-2 bg-white rounded-lg border">
                        <span className="font-medium">{materia.nome}</span>
                        <div className="flex gap-1">
                          {(["alta", "media", "baixa"] as const).map(p => (
                            <Button
                              key={p}
                              size="sm"
                              variant="outline"
                              className={`text-xs ${materia.prioridade === p ? getPrioridadeColor(p) : ""}`}
                              onClick={() => updateMateriaPrioridade(materia.nome, p)}
                            >
                              {p === "alta" ? "Alta" : p === "media" ? "Média" : "Baixa"}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={() => setStep(3)}
                    disabled={materias.length === 0}
                  >
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Disponibilidade */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Qual sua disponibilidade?</CardTitle>
                <CardDescription>
                  Informe quanto tempo você pode dedicar aos estudos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label>Dias disponíveis para estudo</Label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map(dia => (
                      <Button
                        key={dia.value}
                        variant={diasDisponiveis.includes(dia.value) ? "default" : "outline"}
                        className={diasDisponiveis.includes(dia.value) ? "bg-indigo-600" : ""}
                        onClick={() => toggleDia(dia.value)}
                      >
                        {dia.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horasPorDia">Horas de estudo por dia</Label>
                  <Select value={horasPorDia} onValueChange={setHorasPorDia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                        <SelectItem key={h} value={h.toString()}>
                          {h} hora{h > 1 ? "s" : ""} por dia
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Resumo:</strong> {diasDisponiveis.length} dias por semana × {horasPorDia}h = {" "}
                    <strong>{diasDisponiveis.length * parseInt(horasPorDia)}h semanais</strong> de estudo
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Ex: Tenho mais dificuldade em matemática, prefiro estudar de manhã..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    onClick={gerarCronograma}
                    disabled={diasDisponiveis.length === 0 || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar Cronograma
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Cronograma Gerado */}
        {step === 4 && cronogramaGerado && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header do resultado */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                Cronograma gerado com sucesso!
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{objetivo}</h2>
              <p className="text-gray-600">
                {cronogramaGerado.totalHoras}h de estudo planejadas até {dataLimite}
              </p>
            </div>

            {/* Ações */}
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Novo Cronograma
              </Button>
              <Button onClick={exportarPDF} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>

            {/* Legenda */}
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>Teoria</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span>Exercícios</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Revisão</span>
              </div>
            </div>

            {/* Cronograma por semana */}
            {cronogramaGerado.semanas.map(semana => (
              <Card key={semana.numero} className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    Semana {semana.numero}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {semana.dias.map((dia, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-center font-medium text-gray-700 pb-2 border-b">
                          {diasSemana.find(d => d.value === dia.dia)?.label || dia.dia}
                        </div>
                        <div className="space-y-2">
                          {dia.blocos.map((bloco, bidx) => (
                            <div 
                              key={bidx}
                              className={`p-2 rounded-lg text-white text-sm ${getTipoColor(bloco.tipo)}`}
                            >
                              <div className="font-medium truncate">{bloco.materia}</div>
                              <div className="text-xs opacity-90">
                                {formatarDuracao(bloco.duracao)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Recomendações */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Dicas para seu estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {cronogramaGerado.recomendacoes.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

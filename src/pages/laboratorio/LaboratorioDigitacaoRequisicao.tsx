import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  MoreVertical,
  AlertTriangle,
  History,
  Ban,
  RotateCcw,
  Info,
  Check,
  AlertCircle,
  XCircle,
  Calculator,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types for validation states
type ValidationStatus = "pendente" | "validado" | "critico" | "absurdo" | "calculado";

interface Parametro {
  id: string;
  nome: string;
  tipo: "numerico" | "texto" | "combo" | "multilinhas";
  valor: string;
  unidade?: string;
  referencia?: string;
  opcoes?: string[];
  minRef?: number;
  maxRef?: number;
  minAbsurdo?: number;
  maxAbsurdo?: number;
  isCalculado?: boolean;
  formulaTooltip?: string;
  validationStatus?: ValidationStatus;
}

interface Exame {
  id: string;
  codigo: string;
  nome: string;
  parametros: Parametro[];
  validado: boolean;
  liberado: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  tipo: "validacao" | "critico" | "absurdo" | "calculado" | "liberacao" | "sistema";
  titulo: string;
  descricao: string;
  origem: string;
}

// Reference ranges and absurd limits for validation
const VALIDATION_RULES: Record<string, { minRef: number; maxRef: number; minAbsurdo: number; maxAbsurdo: number }> = {
  "Glicose": { minRef: 70, maxRef: 99, minAbsurdo: 10, maxAbsurdo: 800 },
  "Colesterol Total": { minRef: 0, maxRef: 200, minAbsurdo: 50, maxAbsurdo: 600 },
  "TGO (AST)": { minRef: 10, maxRef: 40, minAbsurdo: 0, maxAbsurdo: 5000 },
  "Triglicerídeos": { minRef: 0, maxRef: 150, minAbsurdo: 10, maxAbsurdo: 3000 },
  "VLDL": { minRef: 0, maxRef: 30, minAbsurdo: 0, maxAbsurdo: 600 },
  "Hemácias": { minRef: 4.5, maxRef: 5.5, minAbsurdo: 1, maxAbsurdo: 10 },
  "Hemoglobina": { minRef: 12, maxRef: 16, minAbsurdo: 3, maxAbsurdo: 25 },
  "Hematócrito": { minRef: 36, maxRef: 46, minAbsurdo: 10, maxAbsurdo: 70 },
  "Leucócitos": { minRef: 4000, maxRef: 11000, minAbsurdo: 500, maxAbsurdo: 100000 },
};

const mockExamesBioquimica: Exame[] = [
  {
    id: "1",
    codigo: "GLI",
    nome: "Glicose",
    validado: false,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Resultado", 
        tipo: "numerico", 
        valor: "", 
        unidade: "mg/dL", 
        referencia: "70-99",
        minRef: 70,
        maxRef: 99,
        minAbsurdo: 10,
        maxAbsurdo: 800,
        validationStatus: "pendente"
      },
    ],
  },
  {
    id: "2",
    codigo: "COL",
    nome: "Colesterol Total",
    validado: true,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Resultado", 
        tipo: "numerico", 
        valor: "185", 
        unidade: "mg/dL", 
        referencia: "<200",
        minRef: 0,
        maxRef: 200,
        minAbsurdo: 50,
        maxAbsurdo: 600,
        validationStatus: "validado"
      },
    ],
  },
  {
    id: "3",
    codigo: "TGO",
    nome: "TGO (AST)",
    validado: false,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Resultado", 
        tipo: "numerico", 
        valor: "", 
        unidade: "U/L", 
        referencia: "10-40",
        minRef: 10,
        maxRef: 40,
        minAbsurdo: 0,
        maxAbsurdo: 5000,
        validationStatus: "pendente"
      },
    ],
  },
  {
    id: "4",
    codigo: "TRI",
    nome: "Triglicerídeos",
    validado: false,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Resultado", 
        tipo: "numerico", 
        valor: "", 
        unidade: "mg/dL", 
        referencia: "<150",
        minRef: 0,
        maxRef: 150,
        minAbsurdo: 10,
        maxAbsurdo: 3000,
        validationStatus: "pendente"
      },
    ],
  },
  {
    id: "5",
    codigo: "VLDL",
    nome: "VLDL",
    validado: false,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Resultado", 
        tipo: "numerico", 
        valor: "", 
        unidade: "mg/dL", 
        referencia: "<30",
        minRef: 0,
        maxRef: 30,
        minAbsurdo: 0,
        maxAbsurdo: 600,
        isCalculado: true,
        formulaTooltip: "VLDL = Triglicerídeos ÷ 5",
        validationStatus: "pendente"
      },
    ],
  },
];

const mockExamesHematologia: Exame[] = [
  {
    id: "6",
    codigo: "HEM",
    nome: "Hemograma Completo",
    validado: false,
    liberado: false,
    parametros: [
      { 
        id: "1", 
        nome: "Hemácias", 
        tipo: "numerico", 
        valor: "", 
        unidade: "milhões/mm³", 
        referencia: "4.5-5.5",
        minRef: 4.5,
        maxRef: 5.5,
        minAbsurdo: 1,
        maxAbsurdo: 10,
        validationStatus: "pendente"
      },
      { 
        id: "2", 
        nome: "Hemoglobina", 
        tipo: "numerico", 
        valor: "", 
        unidade: "g/dL", 
        referencia: "12-16",
        minRef: 12,
        maxRef: 16,
        minAbsurdo: 3,
        maxAbsurdo: 25,
        validationStatus: "pendente"
      },
      { 
        id: "3", 
        nome: "Hematócrito", 
        tipo: "numerico", 
        valor: "", 
        unidade: "%", 
        referencia: "36-46",
        minRef: 36,
        maxRef: 46,
        minAbsurdo: 10,
        maxAbsurdo: 70,
        validationStatus: "pendente"
      },
      { 
        id: "4", 
        nome: "Leucócitos", 
        tipo: "numerico", 
        valor: "", 
        unidade: "/mm³", 
        referencia: "4000-11000",
        minRef: 4000,
        maxRef: 11000,
        minAbsurdo: 500,
        maxAbsurdo: 100000,
        validationStatus: "pendente"
      },
      { 
        id: "5", 
        nome: "Observações", 
        tipo: "multilinhas", 
        valor: "", 
        opcoes: ["Anisocitose discreta", "Poiquilocitose discreta", "Sem alterações morfológicas"],
        validationStatus: "pendente"
      },
    ],
  },
];

const LaboratorioDigitacaoRequisicao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("bioquimica");
  const [examesBioquimica, setExamesBioquimica] = useState(mockExamesBioquimica);
  const [examesHematologia, setExamesHematologia] = useState(mockExamesHematologia);
  const [repeticaoDialogOpen, setRepeticaoDialogOpen] = useState(false);
  const [repeticaoTipo, setRepeticaoTipo] = useState<"interna" | "externa">("interna");
  const [repeticaoMotivo, setRepeticaoMotivo] = useState("");
  const [selectedExameId, setSelectedExameId] = useState<string | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [confirmLiberacaoOpen, setConfirmLiberacaoOpen] = useState(false);
  const [confirmLiberacaoType, setConfirmLiberacaoType] = useState<"aba" | "requisicao">("aba");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      tipo: "sistema",
      titulo: "Requisição recebida",
      descricao: "Amostras distribuídas para análise",
      origem: "Sistema"
    }
  ]);

  // Function to add timeline event
  const addTimelineEvent = (tipo: TimelineEvent["tipo"], titulo: string, descricao: string) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      tipo,
      titulo,
      descricao,
      origem: tipo === "calculado" || tipo === "sistema" ? "Sistema" : "Operador"
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  };

  // Function to validate a numeric value
  const validateNumericValue = (valor: string, param: Parametro): ValidationStatus => {
    if (!valor || valor.trim() === "") return "pendente";
    
    const numVal = parseFloat(valor.replace(",", "."));
    if (isNaN(numVal)) return "pendente";
    
    if (param.isCalculado) return "calculado";
    
    // Check absurd limits first
    if (param.minAbsurdo !== undefined && param.maxAbsurdo !== undefined) {
      if (numVal < param.minAbsurdo || numVal > param.maxAbsurdo) {
        return "absurdo";
      }
    }
    
    // Check reference ranges
    if (param.minRef !== undefined && param.maxRef !== undefined) {
      if (numVal >= param.minRef && numVal <= param.maxRef) {
        return "validado";
      } else {
        return "critico";
      }
    }
    
    return "validado";
  };

  // Calculate VLDL based on TRI
  useEffect(() => {
    const triExame = examesBioquimica.find(e => e.codigo === "TRI");
    const vldlExame = examesBioquimica.find(e => e.codigo === "VLDL");
    
    if (triExame && vldlExame) {
      const triValor = triExame.parametros[0]?.valor;
      if (triValor) {
        const triNum = parseFloat(triValor.replace(",", "."));
        if (!isNaN(triNum) && triNum > 0) {
          const vldlCalculado = (triNum / 5).toFixed(1);
          const currentVldl = vldlExame.parametros[0]?.valor;
          
          if (currentVldl !== vldlCalculado) {
            setExamesBioquimica(prev => 
              prev.map(e => 
                e.codigo === "VLDL" 
                  ? {
                      ...e,
                      parametros: e.parametros.map(p => ({
                        ...p,
                        valor: vldlCalculado,
                        validationStatus: "calculado" as ValidationStatus
                      }))
                    }
                  : e
              )
            );
            addTimelineEvent("calculado", "Resultado calculado automaticamente (VLDL)", `VLDL = ${vldlCalculado} mg/dL (TRI ÷ 5)`);
          }
        }
      }
    }
  }, [examesBioquimica.find(e => e.codigo === "TRI")?.parametros[0]?.valor]);

  const handleParametroChange = (exameId: string, parametroId: string, valor: string, bancada: string) => {
    const updateExames = (prev: Exame[]) =>
      prev.map((e) =>
        e.id === exameId
          ? {
              ...e,
              parametros: e.parametros.map((p) =>
                p.id === parametroId ? { ...p, valor } : p
              ),
            }
          : e
      );

    if (bancada === "bioquimica") {
      setExamesBioquimica(updateExames);
    } else {
      setExamesHematologia(updateExames);
    }
  };

  const handleParametroBlur = (exameId: string, parametroId: string, valor: string, param: Parametro, bancada: string) => {
    if (param.tipo !== "numerico" || param.isCalculado) return;
    
    const status = validateNumericValue(valor, param);
    
    const updateExames = (prev: Exame[]) =>
      prev.map((e) =>
        e.id === exameId
          ? {
              ...e,
              parametros: e.parametros.map((p) =>
                p.id === parametroId ? { ...p, validationStatus: status } : p
              ),
              validado: status === "validado" || status === "critico"
            }
          : e
      );

    if (bancada === "bioquimica") {
      setExamesBioquimica(updateExames);
    } else {
      setExamesHematologia(updateExames);
    }

    // Add timeline events based on status
    if (status === "validado") {
      addTimelineEvent("validacao", "Resultado validado automaticamente", `Parâmetro ${param.nome}: ${valor} ${param.unidade || ""}`);
    } else if (status === "critico") {
      addTimelineEvent("critico", "Resultado marcado como valor crítico", `Parâmetro ${param.nome}: ${valor} ${param.unidade || ""} - Fora do intervalo de referência`);
      toast.warning("Valor crítico detectado", { description: "Valor fora do intervalo de referência" });
    } else if (status === "absurdo") {
      addTimelineEvent("absurdo", "Resultado bloqueado por valor absurdo", `Parâmetro ${param.nome}: ${valor} ${param.unidade || ""} - Possível erro de digitação`);
      toast.error("Valor absurdo detectado", { description: "Possível erro de digitação. Corrija antes de liberar." });
    }
  };

  const handleValidar = (exameId: string, bancada: string) => {
    const exames = bancada === "bioquimica" ? examesBioquimica : examesHematologia;
    const exame = exames.find(e => e.id === exameId);
    
    if (exame) {
      const hasAbsurdo = exame.parametros.some(p => p.validationStatus === "absurdo");
      if (hasAbsurdo) {
        toast.error("Não é possível validar", { description: "Corrija os valores absurdos antes de validar." });
        return;
      }
    }
    
    if (bancada === "bioquimica") {
      setExamesBioquimica((prev) =>
        prev.map((e) => (e.id === exameId ? { ...e, validado: true } : e))
      );
    } else {
      setExamesHematologia((prev) =>
        prev.map((e) => (e.id === exameId ? { ...e, validado: true } : e))
      );
    }
    toast.success("Exame validado");
  };

  // Check for absurd and critical values in current tab
  const checkValuesInTab = (bancada: string) => {
    const exames = bancada === "bioquimica" ? examesBioquimica : examesHematologia;
    let hasAbsurdo = false;
    let hasCritico = false;
    
    exames.forEach(exame => {
      exame.parametros.forEach(param => {
        if (param.validationStatus === "absurdo") hasAbsurdo = true;
        if (param.validationStatus === "critico") hasCritico = true;
      });
    });
    
    return { hasAbsurdo, hasCritico };
  };

  // Check for absurd and critical values in all exams
  const checkAllValues = () => {
    const allExames = [...examesBioquimica, ...examesHematologia];
    let hasAbsurdo = false;
    let hasCritico = false;
    
    allExames.forEach(exame => {
      exame.parametros.forEach(param => {
        if (param.validationStatus === "absurdo") hasAbsurdo = true;
        if (param.validationStatus === "critico") hasCritico = true;
      });
    });
    
    return { hasAbsurdo, hasCritico };
  };

  const handleLiberarAba = () => {
    const { hasAbsurdo, hasCritico } = checkValuesInTab(activeTab);
    
    if (hasAbsurdo) {
      toast.error("Não é possível liberar", { 
        description: "Existem valores absurdos que precisam ser corrigidos." 
      });
      return;
    }
    
    if (hasCritico) {
      setConfirmLiberacaoType("aba");
      setConfirmLiberacaoOpen(true);
      return;
    }
    
    performLiberarAba();
  };

  const performLiberarAba = () => {
    addTimelineEvent("liberacao", "Exames da aba liberados", `Aba ${activeTab === "bioquimica" ? "Bioquímica" : "Hematologia"}`);
    toast.success("Exames da aba liberados com sucesso!");
    setConfirmLiberacaoOpen(false);
  };

  const handleLiberarRequisicao = () => {
    const { hasAbsurdo, hasCritico } = checkAllValues();
    
    if (hasAbsurdo) {
      toast.error("Não é possível liberar", { 
        description: "Existem valores absurdos que precisam ser corrigidos." 
      });
      return;
    }
    
    if (hasCritico) {
      setConfirmLiberacaoType("requisicao");
      setConfirmLiberacaoOpen(true);
      return;
    }
    
    performLiberarRequisicao();
  };

  const performLiberarRequisicao = () => {
    addTimelineEvent("liberacao", "Todos os exames da requisição liberados", "REQ-2024-045678");
    toast.success("Todos os exames da requisição foram liberados!");
    setConfirmLiberacaoOpen(false);
  };

  const handleRepeticao = () => {
    if (!repeticaoMotivo) {
      toast.error("Informe o motivo da repetição");
      return;
    }
    toast.success(
      repeticaoTipo === "externa"
        ? "Marcado para repetição externa. Nova amostra poderá ser recebida no Atendimento."
        : "Marcado para repetição interna."
    );
    setRepeticaoDialogOpen(false);
    setRepeticaoMotivo("");
  };

  // Get validation badge for a parameter
  const getValidationBadge = (param: Parametro) => {
    const status = param.validationStatus;
    
    switch (status) {
      case "validado":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-accent border-accent bg-accent/10">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Validado
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Valor dentro do intervalo de referência</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "critico":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-warning border-warning bg-warning/10">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Crítico
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Valor fora do intervalo de referência</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "absurdo":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-destructive border-destructive bg-destructive/10">
                  <XCircle className="h-3 w-3 mr-1" />
                  Valor Absurdo
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Possível erro de digitação. Corrija antes de liberar.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "calculado":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-primary border-primary bg-primary/10">
                  <Calculator className="h-3 w-3 mr-1" />
                  Calculado
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{param.formulaTooltip || "Valor calculado automaticamente"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  // Get exame card status badge
  const getExameStatusBadge = (exame: Exame) => {
    const hasAbsurdo = exame.parametros.some(p => p.validationStatus === "absurdo");
    const hasCritico = exame.parametros.some(p => p.validationStatus === "critico");
    const allValidado = exame.parametros.every(p => 
      p.validationStatus === "validado" || 
      p.validationStatus === "calculado" ||
      p.tipo !== "numerico"
    );
    
    if (hasAbsurdo) {
      return (
        <Badge variant="outline" className="text-destructive border-destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Valor Absurdo
        </Badge>
      );
    }
    
    if (hasCritico) {
      return (
        <Badge variant="outline" className="text-warning border-warning">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Valor Crítico
        </Badge>
      );
    }
    
    if (exame.liberado) {
      return (
        <Badge className="bg-accent text-accent-foreground">
          Liberado
        </Badge>
      );
    }
    
    if (exame.validado || allValidado) {
      return (
        <Badge variant="outline" className="text-accent border-accent">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Validado
        </Badge>
      );
    }
    
    return null;
  };

  // Get input class based on validation status
  const getInputClass = (param: Parametro) => {
    const baseClass = "w-24 text-center";
    
    switch (param.validationStatus) {
      case "validado":
        return `${baseClass} border-accent/50 bg-accent/5 focus:border-accent`;
      case "critico":
        return `${baseClass} border-warning/50 bg-warning/5 focus:border-warning`;
      case "absurdo":
        return `${baseClass} border-destructive/50 bg-destructive/5 focus:border-destructive`;
      case "calculado":
        return `${baseClass} border-primary/50 bg-primary/5 cursor-not-allowed`;
      default:
        return baseClass;
    }
  };

  const renderParametro = (exame: Exame, param: Parametro, bancada: string) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.altKey) {
        e.preventDefault();
        handleValidar(exame.id, bancada);
      }
    };

    switch (param.tipo) {
      case "numerico":
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              value={param.valor}
              onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
              onBlur={(e) => handleParametroBlur(exame.id, param.id, e.target.value, param, bancada)}
              onKeyDown={handleKeyDown}
              className={getInputClass(param)}
              placeholder="0.00"
              disabled={param.isCalculado}
              readOnly={param.isCalculado}
            />
            <span className="text-sm text-muted-foreground">{param.unidade}</span>
            <span className="text-xs text-muted-foreground/70">Ref: {param.referencia}</span>
            {getValidationBadge(param)}
          </div>
        );
      case "texto":
        return (
          <Input
            value={param.valor}
            onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
            onKeyDown={handleKeyDown}
            className="w-48"
          />
        );
      case "combo":
        return (
          <Select
            value={param.valor}
            onValueChange={(v) => handleParametroChange(exame.id, param.id, v, bancada)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {param.opcoes?.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multilinhas":
        return (
          <div className="w-full max-w-md">
            <Textarea
              value={param.valor}
              onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
              className="resize-none"
              rows={2}
              placeholder="CTRL+↓ para lista de respostas • ALT+Enter para confirmar"
            />
            {param.opcoes && (
              <div className="flex flex-wrap gap-1 mt-1">
                {param.opcoes.map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      const newVal = param.valor ? `${param.valor}\n${op}` : op;
                      handleParametroChange(exame.id, param.id, newVal, bancada);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    + {op}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderExame = (exame: Exame, bancada: string) => {
    const hasAbsurdo = exame.parametros.some(p => p.validationStatus === "absurdo");
    const hasCritico = exame.parametros.some(p => p.validationStatus === "critico");
    
    let borderClass = "bg-card";
    if (hasAbsurdo) {
      borderClass = "bg-destructive/5 border-destructive/30";
    } else if (hasCritico) {
      borderClass = "bg-warning/5 border-warning/30";
    } else if (exame.validado) {
      borderClass = "bg-accent/5 border-accent/30";
    }
    
    return (
      <div
        key={exame.id}
        className={`border rounded-lg p-4 transition-colors ${borderClass} ${exame.liberado ? "opacity-60" : ""}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{exame.codigo}</span>
            <span className="font-medium">{exame.nome}</span>
            {getExameStatusBadge(exame)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Abrindo para digitação...")}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Abrir para Digitação
                <span className="ml-auto text-xs text-muted-foreground">F4</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Marcado como executado")}>
                <Check className="h-4 w-4 mr-2" />
                Marcar Executado
                <span className="ml-auto text-xs text-muted-foreground">Alt+F2</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleValidar(exame.id, bancada)}
                disabled={hasAbsurdo}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Liberar Exame
                <span className="ml-auto text-xs text-muted-foreground">F2</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedExameId(exame.id);
                  setRepeticaoDialogOpen(true);
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Marcar para Repetição
                <span className="ml-auto text-xs text-muted-foreground">Alt+F3</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.warning("Marcado como não executado")}>
                <Ban className="h-4 w-4 mr-2" />
                Não Executado
                <span className="ml-auto text-xs text-muted-foreground">Ctrl+F4</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setHistoricoOpen(true)}>
                <History className="h-4 w-4 mr-2" />
                Histórico de Resultados
                <span className="ml-auto text-xs text-muted-foreground">F3</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Abrindo detalhes...")}>
                <Info className="h-4 w-4 mr-2" />
                Mostrar Dados do Exame
                <span className="ml-auto text-xs text-muted-foreground">Alt+F10</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          {exame.parametros.map((param) => (
            <div key={param.id} className="flex items-center gap-4">
              <Label className="w-32 text-sm text-muted-foreground">{param.nome}</Label>
              {renderParametro(exame, param, bancada)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get timeline event icon
  const getTimelineIcon = (tipo: TimelineEvent["tipo"]) => {
    switch (tipo) {
      case "validacao":
        return <CheckCircle2 className="h-4 w-4 text-accent" />;
      case "critico":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "absurdo":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "calculado":
        return <Calculator className="h-4 w-4 text-primary" />;
      case "liberacao":
        return <Check className="h-4 w-4 text-accent" />;
      case "sistema":
        return <Activity className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Count critical values
  const criticalCount = useMemo(() => {
    let count = 0;
    [...examesBioquimica, ...examesHematologia].forEach(e => {
      e.parametros.forEach(p => {
        if (p.validationStatus === "critico") count++;
      });
    });
    return count;
  }, [examesBioquimica, examesHematologia]);

  // Count absurd values
  const absurdCount = useMemo(() => {
    let count = 0;
    [...examesBioquimica, ...examesHematologia].forEach(e => {
      e.parametros.forEach(p => {
        if (p.validationStatus === "absurdo") count++;
      });
    });
    return count;
  }, [examesBioquimica, examesHematologia]);

  return (
    <LaboratorioLayout title="Digitação/Liberação">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/laboratorio/digitacao-paciente")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Digitação/Liberação – Requisição</h1>
            <p className="text-muted-foreground mt-1">REQ-2024-045678</p>
          </div>
          {(criticalCount > 0 || absurdCount > 0) && (
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <Badge variant="outline" className="text-warning border-warning">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {criticalCount} Crítico{criticalCount > 1 ? "s" : ""}
                </Badge>
              )}
              {absurdCount > 0 && (
                <Badge variant="outline" className="text-destructive border-destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  {absurdCount} Absurdo{absurdCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Resumo do Paciente */}
        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium">Maria Silva Santos</p>
                  <p className="text-xs text-muted-foreground">45 anos • Feminino</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contato</p>
                  <p className="font-medium">(11) 99999-8888</p>
                  <p className="text-xs text-muted-foreground">(11) 3333-4444</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requisição</p>
                  <p className="font-medium">Unidade Central</p>
                  <p className="text-xs text-muted-foreground">Atendente: Carlos Silva</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo de Entrega</p>
                  <p className="font-medium text-warning">17/12/2024 14:00</p>
                  <p className="text-xs text-muted-foreground">Em 28 horas</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <FileText className="h-4 w-4 inline mr-1" />
                Observações/Dados clínicos: Paciente em jejum de 12h. Investigação de diabetes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info de atalhos */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm flex items-center gap-4 flex-wrap">
          <span className="font-medium">Atalhos:</span>
          <span className="text-muted-foreground">ENTER = Validar • TAB = Navegar • F2 = Liberar • F3 = Histórico • F4 = Reabrir</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Abas por Bancada */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="bioquimica">Bioquímica ({examesBioquimica.length})</TabsTrigger>
                <TabsTrigger value="hematologia">Hematologia ({examesHematologia.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="bioquimica" className="mt-4 space-y-4">
                {examesBioquimica.map((exame) => renderExame(exame, "bioquimica"))}
              </TabsContent>

              <TabsContent value="hematologia" className="mt-4 space-y-4">
                {examesHematologia.map((exame) => renderExame(exame, "hematologia"))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Timeline / Histórico */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico / Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {timelineEvents.map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.tipo === "absurdo" ? "bg-destructive/10" :
                            event.tipo === "critico" ? "bg-warning/10" :
                            event.tipo === "validacao" || event.tipo === "liberacao" ? "bg-accent/10" :
                            event.tipo === "calculado" ? "bg-primary/10" :
                            "bg-muted"
                          }`}>
                            {getTimelineIcon(event.tipo)}
                          </div>
                          <div className="w-px h-full bg-border flex-1 mt-2" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{event.titulo}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.descricao}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{event.origem}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleLiberarAba}>
            Liberar Exames da Aba
          </Button>
          <Button onClick={handleLiberarRequisicao} className="btn-primary-premium">
            Liberar Exames da Requisição
          </Button>
        </div>

        {/* Dialog Confirmação de Liberação com Valores Críticos */}
        <AlertDialog open={confirmLiberacaoOpen} onOpenChange={setConfirmLiberacaoOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Atenção: Valores Críticos Detectados
              </AlertDialogTitle>
              <AlertDialogDescription>
                Existem valores fora do intervalo de referência. Deseja continuar com a liberação?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmLiberacaoType === "aba" ? performLiberarAba : performLiberarRequisicao}
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                Confirmar Liberação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog Repetição */}
        <Dialog open={repeticaoDialogOpen} onOpenChange={setRepeticaoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Marcar para Repetição</DialogTitle>
              <DialogDescription>
                Selecione o tipo de repetição e informe o motivo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={repeticaoTipo} onValueChange={(v) => setRepeticaoTipo(v as "interna" | "externa")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interna" id="interna" />
                  <Label htmlFor="interna">Interna (mesma amostra)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="externa" id="externa" />
                  <Label htmlFor="externa">Externa (nova amostra)</Label>
                </div>
              </RadioGroup>
              {repeticaoTipo === "externa" && (
                <div className="bg-warning/10 text-warning text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    A repetição externa mudará o status para "repetição" e disponibilizará o exame para o Atendimento receber nova amostra.
                  </span>
                </div>
              )}
              <div>
                <Label>Motivo</Label>
                <Textarea
                  value={repeticaoMotivo}
                  onChange={(e) => setRepeticaoMotivo(e.target.value)}
                  placeholder="Informe o motivo da repetição..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRepeticaoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRepeticao}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Histórico */}
        <Dialog open={historicoOpen} onOpenChange={setHistoricoOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Histórico de Resultados</DialogTitle>
              <DialogDescription>Resultados anteriores do paciente para este exame.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">10/11/2024</span>
                <span className="font-medium">92 mg/dL</span>
                <Badge variant="outline">Normal</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">15/08/2024</span>
                <span className="font-medium">105 mg/dL</span>
                <Badge variant="outline" className="text-warning border-warning">Alterado</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">20/05/2024</span>
                <span className="font-medium">88 mg/dL</span>
                <Badge variant="outline">Normal</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoricoOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioDigitacaoRequisicao;

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Calculator,
  History,
  Check,
  Keyboard,
  FlaskConical,
  Microscope,
  Beaker,
  Activity,
  Truck,
  Package,
  ClipboardCheck,
  Play,
  Pause,
  RotateCcw,
  Ban,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";

// Types
type ValidationStatus = "pendente" | "validado" | "critico" | "absurdo" | "calculado";

interface Parametro {
  id: string;
  nome: string;
  tipo: "numerico" | "texto" | "combo" | "multilinhas";
  valor: string;
  unidade?: string;
  referencia?: string;
  minRef?: number;
  maxRef?: number;
  minAbsurdo?: number;
  maxAbsurdo?: number;
  isCalculado?: boolean;
  formulaTooltip?: string;
  validationStatus: ValidationStatus;
  confirmado?: boolean;
}

interface Exame {
  id: string;
  codigo: string;
  nome: string;
  parametros: Parametro[];
  validado: boolean;
  liberado: boolean;
}

interface Requisicao {
  id: string;
  numeroAtendimento: string;
  paciente: string;
  idade: string;
  sexo: string;
  medicoSolicitante: string;
  exames: Exame[];
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  tipo: "coleta" | "transito" | "triagem" | "analise" | "digitacao" | "validacao" | "critico" | "absurdo" | "calculado" | "liberacao" | "sistema";
  titulo: string;
  descricao: string;
  origem: string;
}

// Mock data for map
const mockMapaInfo = {
  id: "1",
  numeroMapa: "M-2024-001234",
  dataHoraGeracao: "16/12/2024 08:30",
  totalFolhas: 3,
  bancada: "Bioquímica / Bancada 01",
  unidade: "Unidade Central",
  setor: "Bioquímica"
};

// Mock requisitions for the map (each "folha" is a requisition)
const mockRequisicoes: Requisicao[] = [
  {
    id: "1",
    numeroAtendimento: "ATD-2024-001234",
    paciente: "Maria Silva Santos",
    idade: "45 anos",
    sexo: "F",
    medicoSolicitante: "Dr. Carlos Mendes",
    exames: [
      {
        id: "1",
        codigo: "GLI",
        nome: "Glicose",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "70-99", minRef: 70, maxRef: 99, minAbsurdo: 10, maxAbsurdo: 800, validationStatus: "pendente" },
        ],
      },
      {
        id: "2",
        codigo: "COL",
        nome: "Colesterol Total",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<200", minRef: 0, maxRef: 200, minAbsurdo: 50, maxAbsurdo: 600, validationStatus: "pendente" },
        ],
      },
      {
        id: "3",
        codigo: "TRI",
        nome: "Triglicerídeos",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<150", minRef: 0, maxRef: 150, minAbsurdo: 10, maxAbsurdo: 3000, validationStatus: "pendente" },
        ],
      },
      {
        id: "4",
        codigo: "VLDL",
        nome: "VLDL",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<30", minRef: 0, maxRef: 30, minAbsurdo: 0, maxAbsurdo: 600, isCalculado: true, formulaTooltip: "VLDL = Triglicerídeos ÷ 5", validationStatus: "pendente" },
        ],
      },
    ],
  },
  {
    id: "2",
    numeroAtendimento: "ATD-2024-001235",
    paciente: "João Pedro Oliveira",
    idade: "62 anos",
    sexo: "M",
    medicoSolicitante: "Dra. Ana Beatriz Lima",
    exames: [
      {
        id: "5",
        codigo: "GLI",
        nome: "Glicose",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "70-99", minRef: 70, maxRef: 99, minAbsurdo: 10, maxAbsurdo: 800, validationStatus: "pendente" },
        ],
      },
      {
        id: "6",
        codigo: "TGO",
        nome: "TGO (AST)",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "U/L", referencia: "10-40", minRef: 10, maxRef: 40, minAbsurdo: 0, maxAbsurdo: 5000, validationStatus: "pendente" },
        ],
      },
      {
        id: "7",
        codigo: "TGP",
        nome: "TGP (ALT)",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "U/L", referencia: "10-45", minRef: 10, maxRef: 45, minAbsurdo: 0, maxAbsurdo: 5000, validationStatus: "pendente" },
        ],
      },
    ],
  },
  {
    id: "3",
    numeroAtendimento: "ATD-2024-001236",
    paciente: "Ana Clara Ferreira",
    idade: "28 anos",
    sexo: "F",
    medicoSolicitante: "Dr. Roberto Santos",
    exames: [
      {
        id: "8",
        codigo: "COL",
        nome: "Colesterol Total",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<200", minRef: 0, maxRef: 200, minAbsurdo: 50, maxAbsurdo: 600, validationStatus: "pendente" },
        ],
      },
      {
        id: "9",
        codigo: "HDL",
        nome: "HDL Colesterol",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: ">40", minRef: 40, maxRef: 100, minAbsurdo: 5, maxAbsurdo: 200, validationStatus: "pendente" },
        ],
      },
      {
        id: "10",
        codigo: "TRI",
        nome: "Triglicerídeos",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<150", minRef: 0, maxRef: 150, minAbsurdo: 10, maxAbsurdo: 3000, validationStatus: "pendente" },
        ],
      },
      {
        id: "11",
        codigo: "VLDL",
        nome: "VLDL",
        validado: false,
        liberado: false,
        parametros: [
          { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "<30", minRef: 0, maxRef: 30, minAbsurdo: 0, maxAbsurdo: 600, isCalculado: true, formulaTooltip: "VLDL = Triglicerídeos ÷ 5", validationStatus: "pendente" },
        ],
      },
    ],
  },
];

const LaboratorioDigitacaoMapaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(mockRequisicoes);
  const [currentFolhaIndex, setCurrentFolhaIndex] = useState(0);
  const [focusedInputIndex, setFocusedInputIndex] = useState(0);
  const [confirmCriticoOpen, setConfirmCriticoOpen] = useState(false);
  const [confirmAbsurdoOpen, setConfirmAbsurdoOpen] = useState(false);
  const [pendingCriticoParam, setPendingCriticoParam] = useState<{ exameId: string; paramId: string } | null>(null);
  const [pendingAbsurdoParam, setPendingAbsurdoParam] = useState<{ exameId: string; paramId: string } | null>(null);
  const [confirmLiberarExameOpen, setConfirmLiberarExameOpen] = useState(false);
  const [confirmLiberarRequisicaoOpen, setConfirmLiberarRequisicaoOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { id: "1", timestamp: new Date(Date.now() - 7200000), tipo: "coleta", titulo: "Amostra Coletada", descricao: "Coleta realizada com sucesso", origem: "Coletador: Maria" },
    { id: "2", timestamp: new Date(Date.now() - 5400000), tipo: "transito", titulo: "Em Trânsito para Triagem", descricao: "Amostra enviada para laboratório central", origem: "Sistema" },
    { id: "3", timestamp: new Date(Date.now() - 3600000), tipo: "triagem", titulo: "Recebida na Triagem", descricao: "Amostra conferida e protocolada", origem: "Triagem: João" },
    { id: "4", timestamp: new Date(Date.now() - 1800000), tipo: "analise", titulo: "Distribuída para Setor", descricao: "Enviada para Bioquímica - Bancada 01", origem: "Sistema" },
    { id: "5", timestamp: new Date(Date.now() - 900000), tipo: "analise", titulo: "Início da Análise", descricao: "Processamento iniciado", origem: "Sistema" },
  ]);

  const currentRequisicao = requisicoes[currentFolhaIndex];

  // Add timeline event
  const addTimelineEvent = useCallback((tipo: TimelineEvent["tipo"], titulo: string, descricao: string, origem?: string) => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      tipo,
      titulo,
      descricao,
      origem: origem || (tipo === "calculado" || tipo === "sistema" ? "Sistema" : "Operador")
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  }, []);

  // Validate numeric value
  const validateNumericValue = useCallback((valor: string, param: Parametro): ValidationStatus => {
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
  }, []);

  // Calculate VLDL based on TRI
  useEffect(() => {
    const updatedRequisicoes = requisicoes.map((req, idx) => {
      if (idx !== currentFolhaIndex) return req;
      
      const triExame = req.exames.find(e => e.codigo === "TRI");
      const vldlExame = req.exames.find(e => e.codigo === "VLDL");
      
      if (triExame && vldlExame) {
        const triValor = triExame.parametros[0]?.valor;
        if (triValor) {
          const triNum = parseFloat(triValor.replace(",", "."));
          if (!isNaN(triNum) && triNum > 0) {
            const vldlCalculado = (triNum / 5).toFixed(1);
            const currentVldl = vldlExame.parametros[0]?.valor;
            
            if (currentVldl !== vldlCalculado) {
              return {
                ...req,
                exames: req.exames.map(e => 
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
              };
            }
          }
        }
      }
      return req;
    });
    
    if (JSON.stringify(updatedRequisicoes) !== JSON.stringify(requisicoes)) {
      setRequisicoes(updatedRequisicoes);
      const triExame = currentRequisicao?.exames.find(e => e.codigo === "TRI");
      const triValor = triExame?.parametros[0]?.valor;
      if (triValor) {
        const vldlCalculado = (parseFloat(triValor.replace(",", ".")) / 5).toFixed(1);
        addTimelineEvent("calculado", "Resultado calculado automaticamente (VLDL)", `VLDL = ${vldlCalculado} mg/dL (TRI ÷ 5)`);
      }
    }
  }, [requisicoes, currentFolhaIndex, addTimelineEvent]);

  // Handle parameter change
  const handleParametroChange = useCallback((exameId: string, parametroId: string, valor: string) => {
    setRequisicoes(prev => prev.map((req, idx) => {
      if (idx !== currentFolhaIndex) return req;
      return {
        ...req,
        exames: req.exames.map(e => 
          e.id === exameId
            ? { ...e, parametros: e.parametros.map(p => p.id === parametroId ? { ...p, valor } : p) }
            : e
        )
      };
    }));
  }, [currentFolhaIndex]);

  // Handle blur validation
  const handleParametroBlur = useCallback((exameId: string, parametroId: string, valor: string, param: Parametro) => {
    if (param.tipo !== "numerico" || param.isCalculado) return;
    
    const status = validateNumericValue(valor, param);
    
    setRequisicoes(prev => prev.map((req, idx) => {
      if (idx !== currentFolhaIndex) return req;
      return {
        ...req,
        exames: req.exames.map(e => 
          e.id === exameId
            ? { 
                ...e, 
                parametros: e.parametros.map(p => 
                  p.id === parametroId ? { ...p, validationStatus: status } : p
                ),
                validado: status === "validado"
              }
            : e
        )
      };
    }));

    // Add timeline events
    if (status === "validado") {
      addTimelineEvent("validacao", "Resultado validado", `${param.nome}: ${valor} ${param.unidade || ""}`);
    } else if (status === "critico") {
      addTimelineEvent("critico", "Valor crítico detectado", `${param.nome}: ${valor} ${param.unidade || ""}`);
      toast.warning("Valor crítico", { description: "Pressione ENTER para confirmar ou corrija o valor" });
    } else if (status === "absurdo") {
      addTimelineEvent("absurdo", "Valor absurdo bloqueado", `${param.nome}: ${valor} ${param.unidade || ""} - Possível erro de digitação`);
      toast.error("Valor absurdo", { description: "Corrija o valor antes de continuar" });
    }
  }, [currentFolhaIndex, validateNumericValue, addTimelineEvent]);

  // Get all input fields for navigation
  const getAllInputFields = useCallback(() => {
    if (!currentRequisicao) return [];
    const fields: { exameId: string; paramId: string; isCalculado: boolean }[] = [];
    currentRequisicao.exames.forEach(exame => {
      exame.parametros.forEach(param => {
        if (param.tipo === "numerico") {
          fields.push({ exameId: exame.id, paramId: param.id, isCalculado: !!param.isCalculado });
        }
      });
    });
    return fields;
  }, [currentRequisicao]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const fields = getAllInputFields().filter(f => !f.isCalculado);
      
      if (e.key === "Enter") {
        e.preventDefault();
        // Move to next field
        const nextIndex = Math.min(focusedInputIndex + 1, fields.length - 1);
        setFocusedInputIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
      } else if (e.key === "Tab" && !e.shiftKey) {
        // TAB navigates without validation
        const nextIndex = Math.min(focusedInputIndex + 1, fields.length - 1);
        setFocusedInputIndex(nextIndex);
      } else if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        // Next requisition
        if (currentFolhaIndex < requisicoes.length - 1) {
          setCurrentFolhaIndex(prev => prev + 1);
          setFocusedInputIndex(0);
          toast.info(`Folha ${currentFolhaIndex + 2} de ${requisicoes.length}`);
        }
      } else if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        // Previous requisition
        if (currentFolhaIndex > 0) {
          setCurrentFolhaIndex(prev => prev - 1);
          setFocusedInputIndex(0);
          toast.info(`Folha ${currentFolhaIndex} de ${requisicoes.length}`);
        }
      } else if (e.key === "F2") {
        e.preventDefault();
        // Release exam
        setConfirmLiberarExameOpen(true);
      } else if (e.key === "F3") {
        e.preventDefault();
        // Show history
        setHistoricoOpen(true);
      } else if (e.key === "F4") {
        e.preventDefault();
        // Reopen exam - toast only
        toast.info("Função Reabrir Exame", { description: "Esta função reabre um exame já liberado" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedInputIndex, currentFolhaIndex, requisicoes.length, getAllInputFields]);

  // Check for absurd values in current requisition
  const hasAbsurdoValues = useCallback(() => {
    if (!currentRequisicao) return false;
    return currentRequisicao.exames.some(e => 
      e.parametros.some(p => p.validationStatus === "absurdo" && !p.confirmado)
    );
  }, [currentRequisicao]);

  // Check for critical values needing confirmation
  const hasCriticoValues = useCallback(() => {
    if (!currentRequisicao) return false;
    return currentRequisicao.exames.some(e => 
      e.parametros.some(p => p.validationStatus === "critico" && !p.confirmado)
    );
  }, [currentRequisicao]);

  // Handle release exam
  const handleLiberarExame = useCallback(() => {
    if (hasAbsurdoValues()) {
      toast.error("Não é possível liberar", { description: "Corrija os valores absurdos antes de liberar" });
      return;
    }
    if (hasCriticoValues()) {
      setConfirmLiberarExameOpen(true);
      return;
    }
    
    // Release current exam
    toast.success("Exame liberado com sucesso");
    addTimelineEvent("liberacao", "Exame Liberado", "Resultado liberado para laudo", "Operador");
    setConfirmLiberarExameOpen(false);
  }, [hasAbsurdoValues, hasCriticoValues, addTimelineEvent]);

  // Handle release requisition
  const handleLiberarRequisicao = useCallback(() => {
    if (hasAbsurdoValues()) {
      toast.error("Não é possível liberar", { description: "Corrija os valores absurdos antes de liberar" });
      return;
    }
    if (hasCriticoValues()) {
      setConfirmLiberarRequisicaoOpen(true);
      return;
    }
    
    toast.success("Requisição liberada com sucesso");
    addTimelineEvent("liberacao", "Requisição Liberada", "Todos os exames liberados para laudo", "Operador");
    setConfirmLiberarRequisicaoOpen(false);
  }, [hasAbsurdoValues, hasCriticoValues, addTimelineEvent]);

  // Get validation badge
  const getValidationBadge = (status: ValidationStatus, isCalculado?: boolean) => {
    if (isCalculado) {
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
          <Calculator className="h-3 w-3" />
          Calculado
        </Badge>
      );
    }
    
    switch (status) {
      case "validado":
        return (
          <Badge className="bg-success/10 text-success border-success/20 gap-1">
            <Check className="h-3 w-3" />
            Validado
          </Badge>
        );
      case "critico":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Valor Crítico
          </Badge>
        );
      case "absurdo":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
            <XCircle className="h-3 w-3" />
            Valor Absurdo
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get input class based on validation status
  const getInputClass = (status: ValidationStatus) => {
    switch (status) {
      case "validado":
        return "border-success bg-success/5 focus:ring-success/20";
      case "critico":
        return "border-warning bg-warning/5 focus:ring-warning/20";
      case "absurdo":
        return "border-destructive bg-destructive/5 focus:ring-destructive/20";
      case "calculado":
        return "border-primary bg-primary/5 cursor-not-allowed";
      default:
        return "";
    }
  };

  // Get timeline icon
  const getTimelineIcon = (tipo: TimelineEvent["tipo"]) => {
    const iconClass = "h-4 w-4";
    switch (tipo) {
      case "coleta":
        return <FlaskConical className={iconClass} />;
      case "transito":
        return <Truck className={iconClass} />;
      case "triagem":
        return <Package className={iconClass} />;
      case "analise":
        return <Microscope className={iconClass} />;
      case "digitacao":
        return <Keyboard className={iconClass} />;
      case "validacao":
        return <CheckCircle2 className={iconClass} />;
      case "critico":
        return <AlertTriangle className={iconClass} />;
      case "absurdo":
        return <XCircle className={iconClass} />;
      case "calculado":
        return <Calculator className={iconClass} />;
      case "liberacao":
        return <Unlock className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  // Get timeline icon color
  const getTimelineIconColor = (tipo: TimelineEvent["tipo"]) => {
    switch (tipo) {
      case "validacao":
      case "liberacao":
        return "text-success bg-success/10";
      case "critico":
        return "text-warning bg-warning/10";
      case "absurdo":
        return "text-destructive bg-destructive/10";
      case "calculado":
        return "text-primary bg-primary/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  // Count critical and absurd values
  const countValues = useCallback(() => {
    let criticos = 0;
    let absurdos = 0;
    if (currentRequisicao) {
      currentRequisicao.exames.forEach(e => {
        e.parametros.forEach(p => {
          if (p.validationStatus === "critico") criticos++;
          if (p.validationStatus === "absurdo") absurdos++;
        });
      });
    }
    return { criticos, absurdos };
  }, [currentRequisicao]);

  const { criticos, absurdos } = countValues();
  let inputIndex = 0;

  return (
    <LaboratorioLayout title="Digitação por Mapa">
      <TooltipProvider>
        <div className="space-y-4 animate-fade-in">
          {/* Fixed Header - Map Context */}
          <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4">
            <div className="bg-primary text-primary-foreground px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => navigate("/laboratorio/digitacao-mapa")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Mapa</p>
                      <p className="text-lg font-bold font-mono">{mockMapaInfo.numeroMapa}</p>
                    </div>
                    <div className="h-10 w-px bg-primary-foreground/20" />
                    <div>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Folha</p>
                      <p className="text-lg font-bold">{currentFolhaIndex + 1} de {requisicoes.length}</p>
                    </div>
                    <div className="h-10 w-px bg-primary-foreground/20" />
                    <div>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Bancada</p>
                      <p className="text-lg font-bold">{mockMapaInfo.bancada}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {absurdos > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      {absurdos} absurdo{absurdos > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {criticos > 0 && (
                    <Badge className="bg-warning text-warning-foreground gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {criticos} crítico{criticos > 1 ? "s" : ""}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => {
                        if (currentFolhaIndex > 0) {
                          setCurrentFolhaIndex(prev => prev - 1);
                          setFocusedInputIndex(0);
                        }
                      }}
                      disabled={currentFolhaIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => {
                        if (currentFolhaIndex < requisicoes.length - 1) {
                          setCurrentFolhaIndex(prev => prev + 1);
                          setFocusedInputIndex(0);
                        }
                      }}
                      disabled={currentFolhaIndex === requisicoes.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Keyboard shortcuts bar */}
            <div className="bg-muted/80 backdrop-blur border-b px-6 py-2 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">ENTER</kbd>
                <span>Confirmar/Avançar</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">TAB</kbd>
                <span>Próximo campo</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">CTRL</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">→</kbd>
                <span>Próxima folha</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">CTRL</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">←</kbd>
                <span>Folha anterior</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">F2</kbd>
                <span>Liberar</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px] font-mono">F3</kbd>
                <span>Histórico</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Exams */}
            <div className="lg:col-span-2 space-y-4">
              {/* Patient Info Card */}
              {currentRequisicao && (
                <Card className="card-premium">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Paciente
                      </CardTitle>
                      <Badge variant="outline" className="font-mono">
                        {currentRequisicao.numeroAtendimento}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Nome</p>
                        <p className="font-medium">{currentRequisicao.paciente}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Idade/Sexo</p>
                        <p className="font-medium">{currentRequisicao.idade} - {currentRequisicao.sexo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Médico Solicitante</p>
                        <p className="font-medium">{currentRequisicao.medicoSolicitante}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Exames</p>
                        <p className="font-medium">{currentRequisicao.exames.length} exame{currentRequisicao.exames.length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Exams Cards */}
              {currentRequisicao?.exames.map((exame) => (
                <Card key={exame.id} className="card-premium">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-primary" />
                        <span className="font-mono text-primary">{exame.codigo}</span>
                        <span className="text-muted-foreground font-normal">-</span>
                        <span>{exame.nome}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {exame.validado && (
                          <Badge className="bg-success/10 text-success gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Validado
                          </Badge>
                        )}
                        {exame.liberado && (
                          <Badge className="bg-primary/10 text-primary gap-1">
                            <Unlock className="h-3 w-3" />
                            Liberado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {exame.parametros.map((param) => {
                        const currentInputIndex = param.tipo === "numerico" && !param.isCalculado ? inputIndex++ : -1;
                        
                        return (
                          <div key={param.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-3">
                              <Label className="text-sm font-medium">{param.nome}</Label>
                            </div>
                            <div className="col-span-4">
                              <div className="relative">
                                <Input
                                  ref={(el) => {
                                    if (currentInputIndex >= 0) {
                                      inputRefs.current[currentInputIndex] = el;
                                    }
                                  }}
                                  type="text"
                                  value={param.valor}
                                  onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value)}
                                  onBlur={() => handleParametroBlur(exame.id, param.id, param.valor, param)}
                                  onFocus={() => currentInputIndex >= 0 && setFocusedInputIndex(currentInputIndex)}
                                  disabled={param.isCalculado}
                                  className={`pr-14 ${getInputClass(param.validationStatus)}`}
                                  placeholder={param.isCalculado ? "Auto" : "0.00"}
                                />
                                {param.unidade && (
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    {param.unidade}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-xs text-muted-foreground">Ref: {param.referencia}</span>
                            </div>
                            <div className="col-span-3 flex items-center justify-end gap-2">
                              {getValidationBadge(param.validationStatus, param.isCalculado)}
                              {param.isCalculado && param.formulaTooltip && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{param.formulaTooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={() => navigate("/laboratorio/digitacao-mapa")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Lista
                </Button>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleLiberarExame}
                    disabled={hasAbsurdoValues()}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Liberar Exame Atual
                  </Button>
                  <Button 
                    onClick={handleLiberarRequisicao}
                    disabled={hasAbsurdoValues()}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Liberar Requisição
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Timeline */}
            <div className="lg:col-span-1">
              <Card className="card-premium sticky top-48">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Histórico / Linha do Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-4">
                      {timelineEvents.map((event, idx) => (
                        <div key={event.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-full ${getTimelineIconColor(event.tipo)}`}>
                              {getTimelineIcon(event.tipo)}
                            </div>
                            {idx < timelineEvents.length - 1 && (
                              <div className="w-px h-full bg-border flex-1 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm">{event.titulo}</p>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {event.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.descricao}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1">{event.origem}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Confirm Critical Value Dialog */}
        <AlertDialog open={confirmLiberarExameOpen} onOpenChange={setConfirmLiberarExameOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Confirmar Liberação com Valores Críticos
              </AlertDialogTitle>
              <AlertDialogDescription>
                Existem valores críticos neste exame que estão fora do intervalo de referência. 
                Deseja confirmar a liberação mesmo assim?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLiberarExame}>
                Confirmar Liberação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirm Requisition Release Dialog */}
        <AlertDialog open={confirmLiberarRequisicaoOpen} onOpenChange={setConfirmLiberarRequisicaoOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Confirmar Liberação da Requisição
              </AlertDialogTitle>
              <AlertDialogDescription>
                Existem valores críticos nesta requisição. Deseja confirmar a liberação de todos os exames?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLiberarRequisicao}>
                Confirmar Liberação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* History Modal */}
        <Dialog open={historicoOpen} onOpenChange={setHistoricoOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico Completo
              </DialogTitle>
              <DialogDescription>
                Todos os eventos registrados para esta requisição
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="space-y-4 pr-4">
                {timelineEvents.map((event, idx) => (
                  <div key={event.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`p-2 rounded-full ${getTimelineIconColor(event.tipo)} shrink-0`}>
                      {getTimelineIcon(event.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{event.titulo}</p>
                        <span className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleDateString("pt-BR")} às {event.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.descricao}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Origem: {event.origem}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </LaboratorioLayout>
  );
};

export default LaboratorioDigitacaoMapaDetalhe;

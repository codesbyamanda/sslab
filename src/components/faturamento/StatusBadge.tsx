import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Ban,
  RefreshCw,
  DollarSign,
  XCircle,
  Send,
  Lock,
  FileArchive,
  CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==============================
// 1. SITUAÇÃO DOS VALORES DE EXAMES / PARÂMETROS
// ==============================
export type ResultadoStatus = "normal" | "critico" | "absurdo";

const resultadoConfig: Record<ResultadoStatus, { 
  label: string; 
  tooltip: string; 
  className: string;
  icon: React.ElementType;
}> = {
  normal: {
    label: "Normal",
    tooltip: "Valor dentro do intervalo de referência",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  critico: {
    label: "Crítico",
    tooltip: "Valor fora do intervalo de referência. Requer confirmação.",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: AlertTriangle,
  },
  absurdo: {
    label: "Absurdo",
    tooltip: "Valor biologicamente incompatível. Possível erro de digitação.",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertCircle,
  },
};

export const ResultadoBadge = ({ status }: { status: ResultadoStatus }) => {
  const config = resultadoConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn("gap-1 font-medium", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ==============================
// 3. SITUAÇÃO DOS ITENS DE GUIA (NÚCLEO DO FATURAMENTO)
// ==============================
export type ItemGuiaStatus = 
  | "aberto"      // AB
  | "pendente"    // PD
  | "pre_faturado" // PF
  | "em_faturamento" // FT
  | "recebido"    // RC
  | "glosado"     // GT
  | "glosa_acatada" // GA
  | "reapresentado" // RP
  | "em_refaturamento" // RF
  | "cancelado";  // CN

const itemGuiaConfig: Record<ItemGuiaStatus, {
  label: string;
  sigla: string;
  tooltip: string;
  className: string;
  icon: React.ElementType;
}> = {
  aberto: {
    label: "Aberto",
    sigla: "AB",
    tooltip: "Item disponível para inclusão em pré-faturamento",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: CircleDot,
  },
  pendente: {
    label: "Pendente",
    sigla: "PD",
    tooltip: "Item com pendência que precisa ser resolvida antes do faturamento",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  pre_faturado: {
    label: "Pré-Faturado",
    sigla: "PF",
    tooltip: "Item incluído em lote de pré-faturamento",
    className: "bg-petroleo/15 text-petroleo border-petroleo/30",
    icon: FileText,
  },
  em_faturamento: {
    label: "Em Faturamento",
    sigla: "FT",
    tooltip: "Item incluído em fatura aguardando envio ao convênio",
    className: "bg-accent/15 text-accent border-accent/30",
    icon: Send,
  },
  recebido: {
    label: "Recebido",
    sigla: "RC",
    tooltip: "Item faturado e recebido pelo convênio",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  glosado: {
    label: "Glosado",
    sigla: "GT",
    tooltip: "Item glosado pelo convênio. Requer tratamento de glosa.",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
  },
  glosa_acatada: {
    label: "Glosa Acatada",
    sigla: "GA",
    tooltip: "Glosa aceita. Item não será cobrado.",
    className: "bg-muted text-muted-foreground border-border",
    icon: Ban,
  },
  reapresentado: {
    label: "Reapresentado",
    sigla: "RP",
    tooltip: "Item reapresentado ao convênio após recurso de glosa",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: RefreshCw,
  },
  em_refaturamento: {
    label: "Em Refaturamento",
    sigla: "RF",
    tooltip: "Item em processo de refaturamento após recurso",
    className: "bg-petroleo/15 text-petroleo border-petroleo/30",
    icon: RefreshCw,
  },
  cancelado: {
    label: "Cancelado",
    sigla: "CN",
    tooltip: "Item cancelado. Não será faturado.",
    className: "bg-muted text-muted-foreground border-border",
    icon: Ban,
  },
};

export const ItemGuiaBadge = ({ 
  status, 
  showSigla = false,
  size = "default"
}: { 
  status: ItemGuiaStatus; 
  showSigla?: boolean;
  size?: "sm" | "default";
}) => {
  const config = itemGuiaConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn(
          "gap-1 font-medium",
          config.className,
          size === "sm" && "text-[10px] px-1.5 py-0"
        )}>
          <Icon className={cn("h-3 w-3", size === "sm" && "h-2.5 w-2.5")} />
          {showSigla ? config.sigla : config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{config.label} ({config.sigla})</p>
        <p className="text-xs text-muted-foreground">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Ações disponíveis por status
export const getItemGuiaActions = (status: ItemGuiaStatus): string[] => {
  switch (status) {
    case "aberto":
      return ["incluir_pre_faturamento"];
    case "pendente":
      return ["resolver_pendencia", "cancelar"];
    case "pre_faturado":
      return ["remover_pre_faturamento"];
    case "glosado":
      return ["tratar_glosa", "acatar_glosa", "reapresentar"];
    case "reapresentado":
      return ["acompanhar_retorno"];
    case "recebido":
    case "glosa_acatada":
    case "cancelado":
      return []; // Somente leitura
    default:
      return [];
  }
};

// ==============================
// 4. SITUAÇÃO DO LOTE DE PRÉ-FATURAMENTO
// ==============================
export type LotePreFaturamentoStatus = "transicao" | "fechado" | "faturado";

const lotePreFaturamentoConfig: Record<LotePreFaturamentoStatus, {
  label: string;
  sigla: string;
  tooltip: string;
  className: string;
  icon: React.ElementType;
}> = {
  transicao: {
    label: "Em Transição",
    sigla: "TR",
    tooltip: "Lote em edição. Permite inclusão e remoção de guias.",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  fechado: {
    label: "Fechado",
    sigla: "FD",
    tooltip: "Lote fechado. Pronto para inclusão em fatura.",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: Lock,
  },
  faturado: {
    label: "Faturado",
    sigla: "FT",
    tooltip: "Lote já incluído em uma fatura. Somente leitura.",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
};

export const LotePreFaturamentoBadge = ({ status }: { status: LotePreFaturamentoStatus }) => {
  const config = lotePreFaturamentoConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn("gap-1 font-medium", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{config.label} ({config.sigla})</p>
        <p className="text-xs text-muted-foreground">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ==============================
// 5. SITUAÇÃO DO LOTE DE FATURAMENTO (FATURA)
// ==============================
export type FaturaStatus = "aberto" | "fechado" | "arquivo_gerado" | "enviado";

const faturaConfig: Record<FaturaStatus, {
  label: string;
  sigla: string;
  tooltip: string;
  className: string;
  icon: React.ElementType;
}> = {
  aberto: {
    label: "Aberto",
    sigla: "AB",
    tooltip: "Fatura em edição. Permite alterações.",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  fechado: {
    label: "Fechado",
    sigla: "FD",
    tooltip: "Fatura fechada. Pronta para geração de arquivo.",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: Lock,
  },
  arquivo_gerado: {
    label: "Arquivo Gerado",
    sigla: "AR",
    tooltip: "Arquivo magnético gerado. Pronto para envio.",
    className: "bg-accent/15 text-accent border-accent/30",
    icon: FileArchive,
  },
  enviado: {
    label: "Enviado ao Convênio",
    sigla: "PC",
    tooltip: "Fatura enviada ao convênio. Aguardando retorno.",
    className: "bg-success/15 text-success border-success/30",
    icon: Send,
  },
};

export const FaturaBadge = ({ status }: { status: FaturaStatus }) => {
  const config = faturaConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn("gap-1 font-medium", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{config.label} ({config.sigla})</p>
        <p className="text-xs text-muted-foreground">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ==============================
// GUIA STATUS (para compatibilidade com tela existente)
// ==============================
export type GuiaStatus = "aberta" | "pendente" | "cancelada" | "faturada";

const guiaConfig: Record<GuiaStatus, {
  label: string;
  tooltip: string;
  className: string;
  icon: React.ElementType;
}> = {
  aberta: {
    label: "Aberta",
    tooltip: "Guia disponível para faturamento",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: CircleDot,
  },
  pendente: {
    label: "Pendente",
    tooltip: "Guia com itens pendentes que precisam ser resolvidos",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  cancelada: {
    label: "Cancelada",
    tooltip: "Guia cancelada. Não será faturada.",
    className: "bg-muted text-muted-foreground border-border",
    icon: Ban,
  },
  faturada: {
    label: "Faturada",
    tooltip: "Guia já incluída em uma fatura",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
};

export const GuiaBadge = ({ status }: { status: GuiaStatus }) => {
  const config = guiaConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn("gap-1 font-medium", config.className)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

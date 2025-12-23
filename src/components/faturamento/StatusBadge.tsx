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
  CircleDot,
  RotateCcw,
  Percent,
  CheckCheck
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
    tooltip: "Valor biologicamente incompatível. Possível erro de digitação. Requer confirmação obrigatória.",
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
// CONFORME ESPECIFICAÇÃO COMPLETA
// ==============================
export type ItemGuiaStatus = 
  | "aberto"              // AB - Aberto
  | "pendente"            // PD - Pendente
  | "pre_faturado"        // PF - Pré-faturado
  | "em_faturamento"      // FT - Em Faturamento
  | "recebido"            // RC - Recebido
  | "glosa_parcial"       // GP - Glosa Parcial
  | "glosa_total"         // GT - Glosa Total
  | "glosa_acatada"       // GA - Glosa Acatada
  | "reapresentado"       // RP - Reapresentado
  | "em_refaturamento"    // RF - Em Refaturamento
  | "refaturamento_parcial" // RP - Em Refaturamento Parcial
  | "recebimento_parcial" // PR - Recebimento Parcial
  | "cancelado"           // CN - Cancelado
  | "processado";         // PC - Processado

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
    tooltip: "Item faturado e recebido pelo convênio - pagamento confirmado",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  glosa_parcial: {
    label: "Glosa Parcial",
    sigla: "GP",
    tooltip: "Item glosado parcialmente. Valor ajustado pelo convênio. Requer análise.",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400",
    icon: Percent,
  },
  glosa_total: {
    label: "Glosa Total",
    sigla: "GT",
    tooltip: "Item glosado totalmente pelo convênio. Requer tratamento de glosa.",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
  },
  glosa_acatada: {
    label: "Glosa Acatada",
    sigla: "GA",
    tooltip: "Glosa aceita. Item não será cobrado ou valor ajustado aceito.",
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
    icon: RotateCcw,
  },
  refaturamento_parcial: {
    label: "Refaturamento Parcial",
    sigla: "RP",
    tooltip: "Item em processo de refaturamento com valor parcial",
    className: "bg-petroleo/15 text-petroleo border-petroleo/30",
    icon: RotateCcw,
  },
  recebimento_parcial: {
    label: "Recebimento Parcial",
    sigla: "PR",
    tooltip: "Item com recebimento parcial confirmado pelo convênio",
    className: "bg-success/15 text-success border-success/30",
    icon: DollarSign,
  },
  cancelado: {
    label: "Cancelado",
    sigla: "CN",
    tooltip: "Item cancelado. Não será faturado.",
    className: "bg-muted text-muted-foreground border-border",
    icon: Ban,
  },
  processado: {
    label: "Processado",
    sigla: "PC",
    tooltip: "Item processado e finalizado no sistema",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCheck,
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
  if (!config) return null;
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
    case "glosa_total":
      return ["aceitar_glosa", "reapresentar", "cancelar"];
    case "glosa_parcial":
      return ["aceitar_glosa", "reapresentar", "cancelar"];
    case "reapresentado":
      return ["acompanhar_retorno"];
    case "em_refaturamento":
      return ["acompanhar_retorno"];
    case "refaturamento_parcial":
      return ["acompanhar_retorno"];
    case "recebimento_parcial":
      return []; // Somente leitura
    case "recebido":
    case "glosa_acatada":
    case "cancelado":
    case "processado":
      return []; // Somente leitura
    default:
      return [];
  }
};

// Helper para verificar se um item está glosado (total ou parcial)
export const isGlosado = (status: ItemGuiaStatus): boolean => {
  return status === "glosa_total" || status === "glosa_parcial";
};

// Helper para verificar se um item pode ser editado
export const isItemEditavel = (status: ItemGuiaStatus): boolean => {
  return !["recebido", "glosa_acatada", "cancelado", "processado", "recebimento_parcial"].includes(status);
};

// Helper para obter a configuração do status
export const getItemGuiaConfig = (status: ItemGuiaStatus) => {
  return itemGuiaConfig[status];
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

// Helper para legenda de status do lote
export const getLotePreFaturamentoLegenda = () => {
  return Object.entries(lotePreFaturamentoConfig).map(([key, config]) => ({
    status: key as LotePreFaturamentoStatus,
    ...config
  }));
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

// ==============================
// LEGENDA DE STATUS DOS ITENS DE GUIA
// ==============================
export const getItemGuiaLegenda = () => {
  return Object.entries(itemGuiaConfig).map(([key, config]) => ({
    status: key as ItemGuiaStatus,
    ...config
  }));
};

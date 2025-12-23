import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  DollarSign,
  AlertCircle,
  RefreshCw,
  XCircle,
  Package,
  Truck,
  FlaskConical,
  FileCheck,
  Lock,
  FileArchive,
  User,
  Settings
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// ==============================
// TIPOS DE EVENTOS
// ==============================
export type TimelineEventType = 
  // Eventos de Amostra
  | "amostra_coletada"
  | "amostra_transito"
  | "amostra_recebida"
  | "amostra_analise"
  | "amostra_processada"
  | "amostra_repetida"
  | "amostra_descartada"
  // Eventos de Guia/Faturamento
  | "guia_criada"
  | "guia_pendente"
  | "guia_corrigida"
  | "item_incluido"
  | "item_removido"
  | "item_corrigido"
  | "lote_fechado"
  | "lote_aberto"
  | "fatura_gerada"
  | "fatura_fechada"
  | "arquivo_gerado"
  | "fatura_enviada"
  | "retorno_recebido"
  | "glosa_identificada"
  | "glosa_tratada"
  | "glosa_acatada"
  | "item_reapresentado"
  | "pagamento_recebido"
  // Eventos genéricos
  | "observacao"
  | "alteracao";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  origem: "sistema" | "usuario";
}

const eventConfig: Record<TimelineEventType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  // Amostra
  amostra_coletada: { icon: FlaskConical, color: "text-primary", bgColor: "bg-primary/10" },
  amostra_transito: { icon: Truck, color: "text-warning", bgColor: "bg-warning/10" },
  amostra_recebida: { icon: Package, color: "text-accent", bgColor: "bg-accent/10" },
  amostra_analise: { icon: FlaskConical, color: "text-petroleo", bgColor: "bg-petroleo/10" },
  amostra_processada: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  amostra_repetida: { icon: RefreshCw, color: "text-warning", bgColor: "bg-warning/10" },
  amostra_descartada: { icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  // Guia/Faturamento
  guia_criada: { icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
  guia_pendente: { icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  guia_corrigida: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  item_incluido: { icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
  item_removido: { icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  item_corrigido: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  lote_fechado: { icon: Lock, color: "text-primary", bgColor: "bg-primary/10" },
  lote_aberto: { icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  fatura_gerada: { icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
  fatura_fechada: { icon: Lock, color: "text-primary", bgColor: "bg-primary/10" },
  arquivo_gerado: { icon: FileArchive, color: "text-accent", bgColor: "bg-accent/10" },
  fatura_enviada: { icon: Send, color: "text-accent", bgColor: "bg-accent/10" },
  retorno_recebido: { icon: FileCheck, color: "text-primary", bgColor: "bg-primary/10" },
  glosa_identificada: { icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  glosa_tratada: { icon: RefreshCw, color: "text-warning", bgColor: "bg-warning/10" },
  glosa_acatada: { icon: XCircle, color: "text-muted-foreground", bgColor: "bg-muted" },
  item_reapresentado: { icon: RefreshCw, color: "text-warning", bgColor: "bg-warning/10" },
  pagamento_recebido: { icon: DollarSign, color: "text-success", bgColor: "bg-success/10" },
  // Genéricos
  observacao: { icon: FileText, color: "text-muted-foreground", bgColor: "bg-muted" },
  alteracao: { icon: Settings, color: "text-muted-foreground", bgColor: "bg-muted" },
};

interface FaturamentoTimelineProps {
  events: TimelineEvent[];
  title?: string;
  maxHeight?: string;
  compact?: boolean;
}

export const FaturamentoTimeline = ({ 
  events, 
  title = "Histórico / Linha do Tempo",
  maxHeight = "400px",
  compact = false
}: FaturamentoTimelineProps) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {title}
        </h3>
      </div>
      <ScrollArea className={`p-4`} style={{ maxHeight }}>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
          
          {/* Events */}
          <div className="space-y-4">
            {events.map((event, index) => {
              const config = eventConfig[event.type];
              const Icon = config.icon;
              
              return (
                <div key={event.id} className="relative flex gap-3">
                  {/* Icon */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "relative z-10 flex items-center justify-center w-6 h-6 rounded-full shrink-0",
                        config.bgColor
                      )}>
                        <Icon className={cn("h-3 w-3", config.color)} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{event.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Content */}
                  <div className={cn("flex-1 min-w-0", compact ? "pb-2" : "pb-3")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "font-medium text-foreground leading-tight",
                        compact ? "text-xs" : "text-sm"
                      )}>
                        {event.title}
                      </p>
                      <span className={cn(
                        "text-muted-foreground shrink-0",
                        compact ? "text-[10px]" : "text-xs"
                      )}>
                        {event.timestamp}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className={cn(
                        "text-muted-foreground mt-0.5",
                        compact ? "text-[10px]" : "text-xs"
                      )}>
                        {event.description}
                      </p>
                    )}
                    
                    {event.user && (
                      <p className={cn(
                        "text-muted-foreground mt-1 flex items-center gap-1",
                        compact ? "text-[10px]" : "text-xs"
                      )}>
                        <User className="h-2.5 w-2.5" />
                        {event.user}
                        {event.origem === "sistema" && (
                          <span className="text-muted-foreground/60">(Sistema)</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Helper para criar eventos com type inferido
export const createTimelineEvent = (
  type: TimelineEventType,
  title: string,
  options?: {
    description?: string;
    user?: string;
    origem?: "sistema" | "usuario";
  }
): TimelineEvent => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  title,
  timestamp: new Date().toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  description: options?.description,
  user: options?.user,
  origem: options?.origem || "usuario",
});

// Helper simplificado para criar eventos de fatura
export const createFaturaTimelineEvent = (
  type: TimelineEventType,
  user?: string,
  description?: string
): TimelineEvent => createTimelineEvent(type, getEventTitle(type), { user, description, origem: user ? "usuario" : "sistema" });

const getEventTitle = (type: TimelineEventType): string => {
  const titles: Record<TimelineEventType, string> = {
    amostra_coletada: "Amostra coletada",
    amostra_transito: "Amostra em trânsito",
    amostra_recebida: "Amostra recebida",
    amostra_analise: "Amostra em análise",
    amostra_processada: "Amostra processada",
    amostra_repetida: "Amostra repetida",
    amostra_descartada: "Amostra descartada",
    guia_criada: "Guia criada",
    guia_pendente: "Guia pendente",
    guia_corrigida: "Guia corrigida",
    item_incluido: "Item incluído",
    item_removido: "Item removido",
    item_corrigido: "Item corrigido",
    lote_fechado: "Lote fechado",
    lote_aberto: "Lote aberto",
    fatura_gerada: "Fatura gerada",
    fatura_fechada: "Fatura fechada",
    arquivo_gerado: "Arquivo magnético gerado",
    fatura_enviada: "Fatura enviada ao convênio",
    retorno_recebido: "Retorno recebido",
    glosa_identificada: "Glosa identificada",
    glosa_tratada: "Glosa tratada",
    glosa_acatada: "Glosa acatada",
    item_reapresentado: "Item reapresentado",
    pagamento_recebido: "Pagamento recebido",
    observacao: "Observação",
    alteracao: "Alteração",
  };
  return titles[type] || type;
};

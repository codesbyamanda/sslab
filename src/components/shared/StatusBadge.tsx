import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "active" | "inactive" | "pending" | "success" | "error" | "warning";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" | "active" | "inactive" | "pending" }> = {
  active: { label: "Ativo", variant: "active" },
  ativo: { label: "Ativo", variant: "active" },
  inactive: { label: "Inativo", variant: "inactive" },
  inativo: { label: "Inativo", variant: "inactive" },
  pending: { label: "Pendente", variant: "pending" },
  pendente: { label: "Pendente", variant: "pending" },
  success: { label: "Sucesso", variant: "success" },
  sucesso: { label: "Sucesso", variant: "success" },
  error: { label: "Erro", variant: "error" },
  erro: { label: "Erro", variant: "error" },
  warning: { label: "Atenção", variant: "warning" },
  atencao: { label: "Atenção", variant: "warning" },
  concluido: { label: "Concluído", variant: "success" },
  cancelado: { label: "Cancelado", variant: "error" },
  aguardando: { label: "Aguardando", variant: "pending" },
  em_andamento: { label: "Em Andamento", variant: "warning" },
  aprovado: { label: "Aprovado", variant: "success" },
  rejeitado: { label: "Rejeitado", variant: "error" },
  pago: { label: "Pago", variant: "success" },
  vencido: { label: "Vencido", variant: "error" },
  aberto: { label: "Aberto", variant: "warning" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s/g, "_");
  const config = statusConfig[normalizedStatus] || { label: status, variant: "neutral" as const };
  
  return (
    <Badge 
      variant={config.variant} 
      className={cn("capitalize", className)}
    >
      {label || config.label}
    </Badge>
  );
}

export default StatusBadge;

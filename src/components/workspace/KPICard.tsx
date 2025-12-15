import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const KPICard = ({ title, value, subtitle, icon: Icon, trend, className }: KPICardProps) => {
  return (
    <div className={cn("card-premium p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.positive 
              ? "bg-verde-clinico/10 text-verde-clinico" 
              : "bg-vermelho-moderno/10 text-vermelho-moderno"
          )}>
            {trend.positive ? "+" : ""}{trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
};

export default KPICard;

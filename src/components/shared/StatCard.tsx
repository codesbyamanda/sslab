import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-verde-clinico/5 border-verde-clinico/20",
  warning: "bg-ambar-suave/5 border-ambar-suave/20",
  error: "bg-vermelho-moderno/5 border-vermelho-moderno/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-verde-clinico/10 text-verde-clinico",
  warning: "bg-ambar-suave/10 text-ambar-suave",
  error: "bg-vermelho-moderno/10 text-vermelho-moderno",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-verde-clinico" : "text-vermelho-moderno"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%{" "}
              <span className="text-muted-foreground font-normal">vs período anterior</span>
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              iconVariantStyles[variant]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;

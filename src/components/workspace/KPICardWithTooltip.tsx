import { LucideIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPICardWithTooltipProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  tooltip?: {
    description: string;
    calculation?: string;
    type?: string;
  };
  className?: string;
}

const KPICardWithTooltip = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  tooltip,
  className 
}: KPICardWithTooltipProps) => {
  return (
    <div className={cn("card-premium p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-muted transition-colors">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium">{tooltip.description}</p>
                    {tooltip.calculation && (
                      <p className="text-xs text-muted-foreground">
                        Cálculo: {tooltip.calculation}
                      </p>
                    )}
                    {tooltip.type && (
                      <p className="text-xs text-muted-foreground italic">
                        Tipo: {tooltip.type}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
};

export default KPICardWithTooltip;

import { LucideIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  delay?: number;
  enabled?: boolean;
  isStrategic?: boolean;
}

const ServiceCard = ({ title, description, icon: Icon, onClick, delay = 0, enabled = true, isStrategic = false }: ServiceCardProps) => {
  const cardContent = (
    <button
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={cn(
        "group relative flex flex-col items-center text-center p-8 rounded-2xl border border-transparent",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "animate-fade-in-up",
        enabled 
          ? "bg-card hover:border-primary/20 hover:shadow-premium-hover hover:-translate-y-1 cursor-pointer"
          : "bg-muted/50 cursor-not-allowed opacity-60"
      )}
      style={{ 
        boxShadow: enabled ? "0 4px 18px rgba(0,0,0,0.06)" : "none",
        animationDelay: `${delay}ms`,
        animationFillMode: "both"
      }}
    >
      {/* Lock Icon for disabled */}
      {!enabled && (
        <div className="absolute top-3 right-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Icon Container */}
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-200",
        enabled 
          ? "bg-[#F1F6F9] group-hover:bg-primary/10" 
          : "bg-muted"
      )}>
        <Icon className={cn(
          "h-7 w-7",
          enabled ? "text-primary" : "text-muted-foreground"
        )} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className={cn(
        "text-base font-semibold mb-2 transition-colors duration-200",
        enabled 
          ? "text-foreground group-hover:text-primary" 
          : "text-muted-foreground"
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm font-normal text-muted-foreground leading-relaxed max-w-[200px]">
        {description}
      </p>

      {/* Hover Accent Line */}
      {enabled && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-dourado-sutil rounded-full group-hover:w-12 transition-all duration-300" />
      )}
    </button>
  );

  if (!enabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>Módulo em andamento</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
};

export default ServiceCard;

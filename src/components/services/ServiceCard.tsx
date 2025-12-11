import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  delay?: number;
}

const ServiceCard = ({ title, description, icon: Icon, onClick, delay = 0 }: ServiceCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-transparent",
        "transition-all duration-200 ease-out",
        "hover:border-primary/20 hover:shadow-premium-hover hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "animate-fade-in-up"
      )}
      style={{ 
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        animationDelay: `${delay}ms`,
        animationFillMode: "both"
      }}
    >
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-[#F1F6F9] flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-200">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm font-normal text-muted-foreground leading-relaxed max-w-[200px]">
        {description}
      </p>

      {/* Hover Accent Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-dourado-sutil rounded-full group-hover:w-12 transition-all duration-300" />
    </button>
  );
};

export default ServiceCard;

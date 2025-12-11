import { TrendingUp, TrendingDown, Handshake, ClipboardCheck, DollarSign, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconBg?: string;
  delay?: number;
}

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconBg = "bg-primary/10",
  delay = 0
}: KPICardProps) => {
  return (
    <div 
      className="card-premium-hover p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              changeType === "positive" && "text-verde-clinico",
              changeType === "negative" && "text-vermelho-moderno",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "positive" && <TrendingUp className="h-3.5 w-3.5" />}
              {changeType === "negative" && <TrendingDown className="h-3.5 w-3.5" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0", iconBg)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total de Convênios"
        value="5"
        icon={Handshake}
        iconBg="bg-primary/10"
        delay={0}
      />
      <KPICard
        title="Total de Atendimentos"
        value="514"
        change="+8.5% vs. período anterior"
        changeType="positive"
        icon={ClipboardCheck}
        iconBg="bg-verde-clinico/10"
        delay={50}
      />
      <KPICard
        title="Valor Total"
        value="R$ 159.2k"
        change="+12.3% vs. período anterior"
        changeType="positive"
        icon={DollarSign}
        iconBg="bg-ambar-suave/10"
        delay={100}
      />
      <KPICard
        title="Ticket Médio"
        value="R$ 31.8k"
        icon={Receipt}
        iconBg="bg-petroleo-light/10"
        delay={150}
      />
    </div>
  );
};

export default KPICards;

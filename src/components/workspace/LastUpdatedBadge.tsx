import { Clock } from "lucide-react";

interface LastUpdatedBadgeProps {
  timestamp?: string;
  relative?: string;
}

const LastUpdatedBadge = ({ timestamp, relative = "há 5 minutos" }: LastUpdatedBadgeProps) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="h-3 w-3" />
      <span>
        {timestamp ? `Atualizado em ${timestamp}` : `Última atualização: ${relative}`}
      </span>
    </div>
  );
};

export default LastUpdatedBadge;

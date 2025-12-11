import { Activity } from "lucide-react";

const SaudeLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Activity className="h-8 w-8 text-primary" strokeWidth={2.5} />
      <span className="text-2xl font-bold text-primary italic">
        Saúde Systems
      </span>
    </div>
  );
};

export default SaudeLogo;

import { Calendar, Building2, MapPin, ChevronDown } from "lucide-react";

const DashboardFilters = () => {
  return (
    <div className="card-premium p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-primary rounded-full" />
        <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Período */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Período</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
              <option>Mês anterior</option>
              <option>Personalizado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Empresa */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Empresa</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150">
              <option>Todas</option>
              <option>Matriz</option>
              <option>Filial SP</option>
              <option>Filial RJ</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Unidade */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Unidade</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150">
              <option>Todas</option>
              <option>Unidade Central</option>
              <option>Unidade Norte</option>
              <option>Unidade Sul</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;

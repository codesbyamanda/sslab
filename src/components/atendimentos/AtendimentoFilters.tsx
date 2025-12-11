import { Search, Filter, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AtendimentoFiltersProps {
  onFilter: (filters: { search: string; showPending: boolean }) => void;
}

const AtendimentoFilters = ({ onFilter }: AtendimentoFiltersProps) => {
  const [search, setSearch] = useState("");
  const [showPending, setShowPending] = useState(false);

  const handleFilter = () => {
    onFilter({ search, showPending });
  };

  const handleClear = () => {
    setSearch("");
    setShowPending(false);
    onFilter({ search: "", showPending: false });
  };

  return (
    <div className="card-premium p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por Nome ou Nº de Requisição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-premium"
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showPending"
            checked={showPending}
            onCheckedChange={(checked) => setShowPending(checked === true)}
          />
          <Label htmlFor="showPending" className="text-sm text-muted-foreground cursor-pointer">
            Mostrar apenas pendentes
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleFilter} className="btn-primary-premium">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button onClick={handleClear} variant="outline" className="btn-secondary-premium">
            <RotateCcw className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoFilters;

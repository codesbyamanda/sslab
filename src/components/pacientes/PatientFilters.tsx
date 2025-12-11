import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PatientFiltersProps {
  onSearch: (filters: {
    search: string;
    showInactive: boolean;
    anyPart: boolean;
  }) => void;
}

const PatientFilters = ({ onSearch }: PatientFiltersProps) => {
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [anyPart, setAnyPart] = useState(true);

  const handleFilter = () => {
    onSearch({ search, showInactive, anyPart });
  };

  const handleClear = () => {
    setSearch("");
    setShowInactive(false);
    setAnyPart(true);
    onSearch({ search: "", showInactive: false, anyPart: true });
  };

  return (
    <div className="card-premium p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium text-muted-foreground mb-2 block">
            Buscar Paciente
          </Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nome, CPF, Código ou Telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium pl-11"
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row gap-4 lg:items-end">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showInactive"
              checked={showInactive}
              onCheckedChange={(checked) => setShowInactive(checked === true)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="showInactive" className="text-sm font-medium cursor-pointer">
              Mostrar cadastrados e inativos
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anyPart"
              checked={anyPart}
              onCheckedChange={(checked) => setAnyPart(checked === true)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="anyPart" className="text-sm font-medium cursor-pointer">
              Qualquer parte do registro
            </Label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 lg:items-end">
          <Button onClick={handleFilter} className="btn-primary-premium">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button onClick={handleClear} variant="outline" className="btn-secondary-premium">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientFilters;

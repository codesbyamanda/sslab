import { Calendar, Building2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GlobalFilters = () => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="30d">
          <SelectTrigger className="border-0 h-auto p-0 w-auto shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="all">
          <SelectTrigger className="border-0 h-auto p-0 w-auto shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as unidades</SelectItem>
            <SelectItem value="matriz">Matriz</SelectItem>
            <SelectItem value="filial1">Filial Centro</SelectItem>
            <SelectItem value="filial2">Filial Norte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <FileCheck className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="all">
          <SelectTrigger className="border-0 h-auto p-0 w-auto shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os convênios</SelectItem>
            <SelectItem value="particular">Particular</SelectItem>
            <SelectItem value="unimed">Unimed</SelectItem>
            <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
            <SelectItem value="sulamerica">SulAmérica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" className="ml-auto">
        Exportar relatório
      </Button>
    </div>
  );
};

export default GlobalFilters;

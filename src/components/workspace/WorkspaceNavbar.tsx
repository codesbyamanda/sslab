import { Bell, Search, User, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkspaceNavbarProps {
  title?: string;
}

const WorkspaceNavbar = ({ title = "Visão Geral" }: WorkspaceNavbarProps) => {
  return (
    <header className="navbar-premium">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar indicadores..."
            className="pl-9 w-64 h-9 text-sm"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exportar dados em PDF ou Excel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <User className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default WorkspaceNavbar;

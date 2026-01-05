import { Activity, LogOut, User, Bell, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkspaceNavbarProps {
  title?: string;
  showExport?: boolean;
  userName?: string;
}

const WorkspaceNavbar = ({ title = "Visão Geral", showExport = true, userName = "Ednaldo" }: WorkspaceNavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold text-primary italic">
            Saúde Systems
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <h1 className="text-base font-semibold text-foreground">{title}</h1>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar painel, KPI ou indicador…"
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {showExport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar dados em PDF ou Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium text-foreground">Olá, {userName}</span>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/perfil")}>
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/")}
              className="text-vermelho-moderno focus:text-vermelho-moderno"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default WorkspaceNavbar;

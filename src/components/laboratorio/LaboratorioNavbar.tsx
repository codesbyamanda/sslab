import { Activity, LogOut, User, Bell, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface LaboratorioNavbarProps {
  title?: string;
  showSearch?: boolean;
  userName?: string;
}

const routeTitles: Record<string, string> = {
  "/laboratorio": "Tela Principal",
  "/laboratorio/lotes-amostras": "Lotes de Amostras",
  "/laboratorio/amostras": "Amostras",
  "/laboratorio/filtro-mapa": "Filtro do Mapa",
  "/laboratorio/mapa-trabalho": "Mapa de Trabalho",
  "/laboratorio/digitacao-paciente": "Digitação por Paciente",
  "/laboratorio/digitacao-mapa": "Digitação por Mapa",
  "/laboratorio/impressao-laudo": "Impressão Laudo",
  "/laboratorio/gerar-laudos-lote": "Gerar Laudos Lote",
  "/laboratorio/relatorios": "Relatórios",
  "/laboratorio/config-geral": "Configurações Geral",
  "/laboratorio/config-impressao": "Configurações Impressão",
  "/laboratorio/config-laudo-internet": "Laudo de Internet",
};

const LaboratorioNavbar = ({ title, showSearch = false, userName = "Ednaldo" }: LaboratorioNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTitle = title || routeTitles[location.pathname] || "Saúde Laboratório";

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Left side - Logo and Breadcrumb */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold text-primary italic">
            Saúde Systems
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/services")}
                className="cursor-pointer text-muted-foreground hover:text-foreground text-sm"
              >
                Módulos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/laboratorio")}
                className="cursor-pointer text-muted-foreground hover:text-foreground text-sm"
              >
                Laboratório
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== "/laboratorio" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm">{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search */}
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 h-9 bg-muted/50 border-0"
            />
          </div>
        )}
      </div>

      {/* Right side - User Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
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

export default LaboratorioNavbar;

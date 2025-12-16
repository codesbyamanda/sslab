import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const LaboratorioNavbar = ({ title, showSearch = false }: LaboratorioNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTitle = title || routeTitles[location.pathname] || "Saúde Laboratório";

  return (
    <header className="navbar-premium">
      <div className="flex items-center gap-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/services")}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Módulos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/laboratorio")}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Saúde Laboratório
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== "/laboratorio" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
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

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Olá, Ednaldo</p>
            <p className="text-xs text-muted-foreground">Laboratório</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LaboratorioNavbar;

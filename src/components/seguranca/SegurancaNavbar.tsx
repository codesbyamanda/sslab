import { Activity, LogOut, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

interface SegurancaNavbarProps {
  userName?: string;
}

export function SegurancaNavbar({ userName = "Ednaldo" }: SegurancaNavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo and Breadcrumb */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold text-primary italic">
            Saúde Systems
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

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
              <BreadcrumbPage className="text-sm">Segurança</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
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
}

export default SegurancaNavbar;

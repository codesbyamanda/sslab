import { Activity, LogOut, User, Bell, Search } from "lucide-react";
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

interface TransferenciaNavbarProps {
  title?: string;
  userName?: string;
}

const TransferenciaNavbar = ({ title = "Transferência", userName = "Ednaldo" }: TransferenciaNavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold text-primary italic">
            Saúde Systems
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente ou transferência..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
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
};

export default TransferenciaNavbar;

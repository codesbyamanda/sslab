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

interface ModuleNavbarProps {
  userName?: string;
  showNotifications?: boolean;
}

export function ModuleNavbar({ 
  userName = "Ednaldo",
  showNotifications = true 
}: ModuleNavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
        <span className="text-lg font-bold text-primary italic">
          Saúde Systems
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {showNotifications && (
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
        )}

        {/* User Dropdown */}
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

export default ModuleNavbar;

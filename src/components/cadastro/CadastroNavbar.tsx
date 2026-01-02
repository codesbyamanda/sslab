import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Settings, Bell, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CadastroNavbar() {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/services")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/cadastro")}
          className="text-muted-foreground hover:text-foreground"
        >
          <Home className="h-5 w-5" />
        </Button>
        <span className="text-lg font-medium text-foreground ml-2">Saúde Cadastro</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export default CadastroNavbar;

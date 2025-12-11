import { Activity, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-8 shadow-navbar">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-petroleo flex items-center justify-center">
          <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-primary italic">
          Saúde Systems
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Olá, Ednaldo</span>
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-vermelho-moderno transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};

export default ServicesNavbar;

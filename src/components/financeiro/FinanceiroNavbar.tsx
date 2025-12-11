import { DollarSign, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinanceiroNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 shadow-navbar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <DollarSign className="h-5 w-5 text-primary" strokeWidth={2.5} />
        <span className="text-lg font-bold text-primary italic">
          Saúde Systems
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-foreground">Olá, Ednaldo</span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-vermelho-moderno transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};

export default FinanceiroNavbar;

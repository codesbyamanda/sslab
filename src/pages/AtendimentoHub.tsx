import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

const AtendimentoHub = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />
      
      {/* Main content with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-60">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Serviços</span>
          </button>

          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              Módulo de Atendimento
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Utilize o menu lateral para acessar as funcionalidades do módulo de atendimento.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AtendimentoHub;

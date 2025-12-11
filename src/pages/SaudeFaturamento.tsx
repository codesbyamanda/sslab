import { FolderOpen, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";

const SaudeFaturamento = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the main faturamento page (no specific sub-route)
  const isMainPage = location.pathname === "/faturamento";

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Serviços</span>
          </button>

          {isMainPage ? (
            /* Placeholder Content */
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center animate-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <FolderOpen className="h-10 w-10 text-azul-acinzentado/60" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Selecione uma opção no menu ao lado
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Escolha uma das opções do menu lateral para iniciar o processo de faturamento.
              </p>
            </div>
          ) : (
            /* Sub-page Content Placeholder */
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Página em Desenvolvimento
                </h2>
                <p className="text-sm text-muted-foreground">
                  Esta funcionalidade será implementada em breve.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SaudeFaturamento;

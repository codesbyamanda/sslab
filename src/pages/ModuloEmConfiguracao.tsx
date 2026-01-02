import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";

const ModuloEmConfiguracao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Settings className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Módulo em Configuração
        </h1>
        <p className="text-muted-foreground mb-8">
          Este módulo está sendo preparado e estará disponível em breve.
        </p>
        <Button onClick={() => navigate("/services")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Módulos
        </Button>
      </div>
    </div>
  );
};

export default ModuloEmConfiguracao;

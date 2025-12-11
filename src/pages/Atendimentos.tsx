import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, FileText, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoFilters from "@/components/atendimentos/AtendimentoFilters";
import AtendimentoListTable from "@/components/atendimentos/AtendimentoListTable";

const Atendimentos = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", showPending: false });

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Dashboard</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Atendimentos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gerenciamento e consulta das requisições de atendimento.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pagamentos</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Laudos</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exibir Guias</TooltipContent>
              </Tooltip>

              <Button
                onClick={() => navigate("/atendimento/requisicao/novo")}
                className="btn-primary-premium"
              >
                <Plus className="h-4 w-4" />
                Novo Atendimento
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <AtendimentoFilters onFilter={setFilters} />
          </div>

          {/* Table */}
          <AtendimentoListTable filters={filters} />
        </main>
      </div>
    </div>
  );
};

export default Atendimentos;

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import DashboardFilters from "@/components/atendimento/DashboardFilters";
import KPICards from "@/components/atendimento/KPICards";
import ValorConvenioChart from "@/components/atendimento/ValorConvenioChart";
import ParticipacaoConvenioChart from "@/components/atendimento/ParticipacaoConvenioChart";
import AtendimentosTable from "@/components/atendimento/AtendimentosTable";
const SaudeAtendimento = () => {
  const navigate = useNavigate();
  return <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard – Saúde Atendimento
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão consolidada dos atendimentos por convênio
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <DashboardFilters />
          </div>

          {/* KPI Cards */}
          <div className="mb-6">
            <KPICards />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ValorConvenioChart />
            <ParticipacaoConvenioChart />
          </div>

          {/* Table */}
          <AtendimentosTable />
        </main>
      </div>
    </div>;
};
export default SaudeAtendimento;
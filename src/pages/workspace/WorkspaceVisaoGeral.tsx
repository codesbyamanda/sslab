import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICardWithTooltip from "@/components/workspace/KPICardWithTooltip";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import LastUpdatedBadge from "@/components/workspace/LastUpdatedBadge";
import { 
  Users, 
  DollarSign, 
  FlaskConical, 
  Clock, 
  TrendingUp,
  Activity,
  ExternalLink
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const atendimentoReceitaData = [
  { mes: "Jan", atendimentos: 320, receita: 45000 },
  { mes: "Fev", atendimentos: 380, receita: 52000 },
  { mes: "Mar", atendimentos: 420, receita: 58000 },
  { mes: "Abr", atendimentos: 390, receita: 54000 },
  { mes: "Mai", atendimentos: 450, receita: 62000 },
  { mes: "Jun", atendimentos: 480, receita: 68000 },
];

const producaoPrazoData = [
  { dia: "Seg", producao: 85, sla: 92 },
  { dia: "Ter", producao: 78, sla: 88 },
  { dia: "Qua", producao: 92, sla: 95 },
  { dia: "Qui", producao: 88, sla: 90 },
  { dia: "Sex", producao: 95, sla: 94 },
  { dia: "Sáb", producao: 72, sla: 85 },
];

const WorkspaceVisaoGeral = () => {
  const navigate = useNavigate();

  return (
    <WorkspaceLayout title="Visão Geral">
      <div className="space-y-6">
        {/* Header with filters and update badge */}
        <div className="flex items-center justify-between">
          <GlobalFilters />
          <LastUpdatedBadge relative="há 5 minutos" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICardWithTooltip
            title="Atendimentos"
            value="2.847"
            subtitle="No período selecionado"
            icon={Users}
            trend={{ value: "12%", positive: true }}
            tooltip={{
              description: "Total de atendimentos realizados no período.",
              calculation: "Soma de todos os atendimentos registrados",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Receita Total"
            value="R$ 389.420"
            subtitle="Faturamento bruto"
            icon={DollarSign}
            trend={{ value: "8.5%", positive: true }}
            tooltip={{
              description: "Valor total faturado no período.",
              calculation: "Soma de todos os valores de atendimentos",
              type: "Valor bruto (R$)"
            }}
          />
          <KPICardWithTooltip
            title="Exames Realizados"
            value="8.234"
            subtitle="No período selecionado"
            icon={FlaskConical}
            trend={{ value: "15%", positive: true }}
            tooltip={{
              description: "Quantidade de exames concluídos.",
              calculation: "Total de exames com laudo liberado",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Exames Pendentes"
            value="127"
            subtitle="Aguardando processamento"
            icon={Clock}
            trend={{ value: "5%", positive: false }}
            tooltip={{
              description: "Exames aguardando realização ou liberação.",
              calculation: "Exames coletados - Exames liberados",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Ticket Médio"
            value="R$ 136,78"
            subtitle="Por atendimento"
            icon={TrendingUp}
            trend={{ value: "3.2%", positive: true }}
            tooltip={{
              description: "Valor médio por atendimento realizado.",
              calculation: "Receita total ÷ Número de atendimentos",
              type: "Média (R$)"
            }}
          />
          <KPICardWithTooltip
            title="Taxa de Ocupação"
            value="78%"
            subtitle="Capacidade utilizada"
            icon={Activity}
            tooltip={{
              description: "Percentual de ocupação da capacidade operacional.",
              calculation: "Atendimentos realizados ÷ Capacidade máxima × 100",
              type: "Percentual (%)"
            }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atendimento x Receita */}
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Atendimento x Receita
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Correlação entre volume de atendimentos e faturamento
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={atendimentoReceitaData}>
                  <defs>
                    <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 56%, 25%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(200, 56%, 25%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(161, 51%, 43%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(161, 51%, 43%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                  <XAxis dataKey="mes" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <YAxis yAxisId="left" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="atendimentos"
                    stroke="hsl(200, 56%, 25%)"
                    fillOpacity={1}
                    fill="url(#colorAtendimentos)"
                    name="Atendimentos"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="receita"
                    stroke="hsl(161, 51%, 43%)"
                    fillOpacity={1}
                    fill="url(#colorReceita)"
                    name="Receita (R$)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Produção x Prazo */}
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Produção x SLA
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Comparativo de produtividade e cumprimento de prazos
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producaoPrazoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                  <XAxis dataKey="dia" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <YAxis fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="producao" 
                    fill="hsl(200, 56%, 25%)" 
                    name="Produção (%)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="sla" 
                    fill="hsl(38, 52%, 58%)" 
                    name="SLA (%)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Top Convênios</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => navigate("/workspace/atendimento")}
              >
                Ver detalhes
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Unimed</span>
                <span className="text-sm font-medium text-primary">R$ 125.430</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Particular</span>
                <span className="text-sm font-medium text-primary">R$ 98.200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Bradesco Saúde</span>
                <span className="text-sm font-medium text-primary">R$ 76.890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">SulAmérica</span>
                <span className="text-sm font-medium text-primary">R$ 45.320</span>
              </div>
            </div>
          </div>

          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Exames Mais Solicitados</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => navigate("/workspace/laboratorio")}
              >
                Ver detalhes
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Hemograma Completo</span>
                <span className="text-sm font-medium">1.234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Glicemia</span>
                <span className="text-sm font-medium">987</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">TSH</span>
                <span className="text-sm font-medium">756</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Creatinina</span>
                <span className="text-sm font-medium">654</span>
              </div>
            </div>
          </div>

          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Alertas Operacionais</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => navigate("/workspace/laboratorio")}
              >
                Ver todos
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-ambar-suave/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-ambar-suave shrink-0" />
                <span className="text-sm text-foreground">32 laudos aguardando liberação</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-vermelho-moderno/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-vermelho-moderno shrink-0" />
                <span className="text-sm text-foreground">5 exames com prazo crítico</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-verde-clinico/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-verde-clinico shrink-0" />
                <span className="text-sm text-foreground">Meta mensal: 85% atingida</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm text-foreground">12 coletas pendentes hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceVisaoGeral;
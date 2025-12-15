import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICardWithTooltip from "@/components/workspace/KPICardWithTooltip";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import LastUpdatedBadge from "@/components/workspace/LastUpdatedBadge";
import { Users, DollarSign, TrendingUp, ArrowRightLeft, Target, BarChart3, Info } from "lucide-react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const correlacaoData = [
  { mes: "Jan", atendimentos: 320, receita: 45000, ticketMedio: 140 },
  { mes: "Fev", atendimentos: 380, receita: 52000, ticketMedio: 137 },
  { mes: "Mar", atendimentos: 420, receita: 58000, ticketMedio: 138 },
  { mes: "Abr", atendimentos: 390, receita: 54000, ticketMedio: 138 },
  { mes: "Mai", atendimentos: 450, receita: 62000, ticketMedio: 138 },
  { mes: "Jun", atendimentos: 480, receita: 68000, ticketMedio: 142 },
];

const scatterData = [
  { x: 100, y: 15000, z: 150 },
  { x: 150, y: 22000, z: 147 },
  { x: 200, y: 28000, z: 140 },
  { x: 250, y: 35000, z: 140 },
  { x: 300, y: 42000, z: 140 },
  { x: 350, y: 48000, z: 137 },
  { x: 400, y: 55000, z: 138 },
  { x: 450, y: 62000, z: 138 },
  { x: 500, y: 70000, z: 140 },
];

const WorkspaceAtendimentoFinanceiro = () => {
  return (
    <WorkspaceLayout title="Atendimento x Financeiro">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <GlobalFilters />
          <LastUpdatedBadge relative="há 10 minutos" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICardWithTooltip
            title="Total de Atendimentos"
            value="2.847"
            subtitle="No período"
            icon={Users}
            trend={{ value: "12%", positive: true }}
            tooltip={{
              description: "Quantidade total de atendimentos realizados.",
              calculation: "Soma de todos os atendimentos",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Receita Gerada"
            value="R$ 389.420"
            subtitle="Faturamento bruto"
            icon={DollarSign}
            trend={{ value: "8%", positive: true }}
            tooltip={{
              description: "Valor total faturado pelos atendimentos.",
              calculation: "Soma dos valores de atendimento",
              type: "Valor bruto (R$)"
            }}
          />
          <KPICardWithTooltip
            title="Ticket Médio"
            value="R$ 136,78"
            subtitle="Por atendimento"
            icon={TrendingUp}
            trend={{ value: "3%", positive: true }}
            tooltip={{
              description: "Valor médio gerado por atendimento.",
              calculation: "Receita total ÷ Número de atendimentos",
              type: "Média (R$)"
            }}
          />
          <KPICardWithTooltip
            title="Conversão"
            value="94.2%"
            subtitle="Atend. para Receita"
            icon={ArrowRightLeft}
            tooltip={{
              description: "Percentual de atendimentos que geraram receita.",
              calculation: "Atend. faturados ÷ Total atend. × 100",
              type: "Percentual (%)"
            }}
          />
          <KPICardWithTooltip
            title="Meta Atingida"
            value="87%"
            subtitle="Meta mensal: R$ 450k"
            icon={Target}
            tooltip={{
              description: "Percentual da meta mensal de receita atingido.",
              calculation: "Receita atual ÷ Meta definida × 100",
              type: "Percentual (%)"
            }}
          />
          <KPICardWithTooltip
            title="Eficiência"
            value="92%"
            subtitle="Produtividade operacional"
            icon={BarChart3}
            tooltip={{
              description: "Índice de produtividade da operação.",
              calculation: "Atend. realizados ÷ Capacidade × Qualidade",
              type: "Índice (%)"
            }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Correlação: Atendimentos x Receita
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Análise combinada de volume e faturamento
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={correlacaoData}>
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
                  <Bar 
                    yAxisId="left"
                    dataKey="atendimentos" 
                    fill="hsl(200, 56%, 25%)" 
                    name="Atendimentos"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="receita" 
                    stroke="hsl(161, 51%, 43%)" 
                    strokeWidth={3}
                    name="Receita (R$)"
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Dispersão: Volume x Faturamento
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Relação entre quantidade de atendimentos e receita
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Atendimentos" 
                    fontSize={12} 
                    stroke="hsl(215, 10%, 50%)"
                    label={{ value: 'Atendimentos', position: 'bottom', fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Receita" 
                    fontSize={12} 
                    stroke="hsl(215, 10%, 50%)"
                    label={{ value: 'Receita (R$)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Ticket Médio" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'Receita' ? `R$ ${value.toLocaleString()}` : value,
                      name
                    ]}
                  />
                  <Scatter 
                    name="Correlação" 
                    data={scatterData} 
                    fill="hsl(200, 56%, 25%)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-foreground">Insights Analíticos</h3>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full flex items-center gap-1">
              <Info className="h-3 w-3" />
              Baseado em conversão e ticket médio
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-verde-clinico/5 rounded-xl border border-verde-clinico/20">
              <div className="w-8 h-8 rounded-lg bg-verde-clinico/10 flex items-center justify-center mb-3">
                <TrendingUp className="h-4 w-4 text-verde-clinico" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">Crescimento Consistente</h4>
              <p className="text-xs text-muted-foreground">
                A receita acompanha o aumento de atendimentos com correlação de 0.94, indicando boa conversão.
              </p>
            </div>
            <div className="p-4 bg-ambar-suave/5 rounded-xl border border-ambar-suave/20">
              <div className="w-8 h-8 rounded-lg bg-ambar-suave/10 flex items-center justify-center mb-3">
                <Target className="h-4 w-4 text-ambar-suave" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">Oportunidade de Ticket</h4>
              <p className="text-xs text-muted-foreground">
                O ticket médio pode ser otimizado em 8% através de upsell em exames complementares.
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">Projeção Positiva</h4>
              <p className="text-xs text-muted-foreground">
                Mantendo a tendência atual, a receita pode atingir R$ 480.000 no próximo trimestre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceAtendimentoFinanceiro;
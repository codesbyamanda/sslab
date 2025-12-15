import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICard from "@/components/workspace/KPICard";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const receitaMensal = [
  { mes: "Jan", receita: 45000, despesa: 32000 },
  { mes: "Fev", receita: 52000, despesa: 35000 },
  { mes: "Mar", receita: 58000, despesa: 38000 },
  { mes: "Abr", receita: 54000, despesa: 36000 },
  { mes: "Mai", receita: 62000, despesa: 40000 },
  { mes: "Jun", receita: 68000, despesa: 42000 },
];

const meiosPagamento = [
  { name: "Cartão Crédito", value: 40 },
  { name: "Cartão Débito", value: 25 },
  { name: "Dinheiro", value: 15 },
  { name: "PIX", value: 15 },
  { name: "Convênio", value: 5 },
];

const COLORS = ["hsl(200, 56%, 25%)", "hsl(161, 51%, 43%)", "hsl(38, 52%, 58%)", "hsl(280, 50%, 50%)", "hsl(215, 10%, 50%)"];

const WorkspaceFinanceiro = () => {
  return (
    <WorkspaceLayout title="Dashboard Financeiro">
      <div className="space-y-6">
        <GlobalFilters />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Receita Total"
            value="R$ 389.420"
            icon={DollarSign}
            trend={{ value: "12%", positive: true }}
          />
          <KPICard
            title="Lucro Líquido"
            value="R$ 166.180"
            icon={TrendingUp}
            trend={{ value: "8%", positive: true }}
          />
          <KPICard
            title="Despesas"
            value="R$ 223.240"
            icon={TrendingDown}
            trend={{ value: "3%", positive: false }}
          />
          <KPICard
            title="A Receber"
            value="R$ 45.670"
            icon={Wallet}
          />
          <KPICard
            title="Ticket Médio"
            value="R$ 136,78"
            icon={CreditCard}
            trend={{ value: "5%", positive: true }}
          />
          <KPICard
            title="Inadimplência"
            value="3.2%"
            icon={AlertTriangle}
            trend={{ value: "0.5%", positive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Receita x Despesa
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Comparativo mensal
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                  <XAxis dataKey="mes" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <YAxis fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="hsl(161, 51%, 43%)" 
                    strokeWidth={2}
                    name="Receita"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="despesa" 
                    stroke="hsl(0, 70%, 60%)" 
                    strokeWidth={2}
                    name="Despesa"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Meios de Pagamento
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Distribuição por forma de pagamento
            </p>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meiosPagamento}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {meiosPagamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Evolução Mensal */}
        <div className="card-premium p-6">
          <h3 className="text-base font-semibold text-foreground mb-1">
            Evolução Mensal
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Resumo financeiro dos últimos meses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {receitaMensal.map((item) => (
              <div key={item.mes} className="p-4 bg-muted/30 rounded-xl text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">{item.mes}</p>
                <p className="text-lg font-bold text-verde-clinico">R$ {(item.receita / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Receita</p>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">R$ {((item.receita - item.despesa) / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-muted-foreground">Lucro</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceFinanceiro;

import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICard from "@/components/workspace/KPICard";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import { Users, UserPlus, Clock, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
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

const atendimentosPorDia = [
  { dia: "Seg", valor: 45 },
  { dia: "Ter", valor: 52 },
  { dia: "Qua", valor: 48 },
  { dia: "Qui", valor: 61 },
  { dia: "Sex", valor: 55 },
  { dia: "Sáb", valor: 32 },
];

const tipoAtendimento = [
  { name: "Consulta", value: 45 },
  { name: "Exame", value: 35 },
  { name: "Retorno", value: 15 },
  { name: "Procedimento", value: 5 },
];

const COLORS = ["hsl(200, 56%, 25%)", "hsl(161, 51%, 43%)", "hsl(38, 52%, 58%)", "hsl(215, 10%, 50%)"];

const WorkspaceAtendimento = () => {
  return (
    <WorkspaceLayout title="Dashboard Atendimento">
      <div className="space-y-6">
        <GlobalFilters />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Total de Atendimentos"
            value="2.847"
            icon={Users}
            trend={{ value: "12%", positive: true }}
          />
          <KPICard
            title="Novos Pacientes"
            value="234"
            icon={UserPlus}
            trend={{ value: "8%", positive: true }}
          />
          <KPICard
            title="Tempo Médio Espera"
            value="18 min"
            icon={Clock}
            trend={{ value: "5%", positive: false }}
          />
          <KPICard
            title="Atend. Concluídos"
            value="2.654"
            icon={CheckCircle}
            trend={{ value: "15%", positive: true }}
          />
          <KPICard
            title="Taxa Ocupação"
            value="78%"
            icon={TrendingUp}
          />
          <KPICard
            title="Agendamentos"
            value="156"
            subtitle="Próximos 7 dias"
            icon={Calendar}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Atendimentos por Dia
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Volume de atendimentos na última semana
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={atendimentosPorDia}>
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
                  <Bar 
                    dataKey="valor" 
                    fill="hsl(200, 56%, 25%)" 
                    name="Atendimentos" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Tipos de Atendimento
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Distribuição por categoria
            </p>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipoAtendimento}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tipoAtendimento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceAtendimento;

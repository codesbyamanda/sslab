import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICard from "@/components/workspace/KPICard";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import { FlaskConical, Clock, CheckCircle, AlertTriangle, Timer, FileCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const producaoDiaria = [
  { dia: "Seg", realizados: 145, pendentes: 12 },
  { dia: "Ter", realizados: 168, pendentes: 8 },
  { dia: "Qua", realizados: 152, pendentes: 15 },
  { dia: "Qui", realizados: 178, pendentes: 6 },
  { dia: "Sex", realizados: 165, pendentes: 10 },
  { dia: "Sáb", realizados: 98, pendentes: 4 },
];

const slaData = [
  { hora: "08h", cumprido: 95, meta: 90 },
  { hora: "10h", cumprido: 92, meta: 90 },
  { hora: "12h", cumprido: 88, meta: 90 },
  { hora: "14h", cumprido: 91, meta: 90 },
  { hora: "16h", cumprido: 94, meta: 90 },
  { hora: "18h", cumprido: 89, meta: 90 },
];

const WorkspaceLaboratorio = () => {
  return (
    <WorkspaceLayout title="Dashboard Laboratório">
      <div className="space-y-6">
        <GlobalFilters />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Exames Realizados"
            value="8.234"
            icon={FlaskConical}
            trend={{ value: "15%", positive: true }}
          />
          <KPICard
            title="Exames Pendentes"
            value="127"
            icon={Clock}
            trend={{ value: "5%", positive: false }}
          />
          <KPICard
            title="Laudos Liberados"
            value="7.986"
            icon={CheckCircle}
            trend={{ value: "12%", positive: true }}
          />
          <KPICard
            title="Prazo Crítico"
            value="23"
            subtitle="Urgentes"
            icon={AlertTriangle}
          />
          <KPICard
            title="SLA Geral"
            value="91.2%"
            icon={Timer}
            trend={{ value: "2%", positive: true }}
          />
          <KPICard
            title="Taxa Aprovação"
            value="98.5%"
            icon={FileCheck}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Produção Diária
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Exames realizados vs pendentes por dia
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producaoDiaria}>
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
                    dataKey="realizados" 
                    fill="hsl(161, 51%, 43%)" 
                    name="Realizados"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="pendentes" 
                    fill="hsl(0, 70%, 60%)" 
                    name="Pendentes"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Cumprimento de SLA
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Acompanhamento ao longo do dia
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                  <XAxis dataKey="hora" fontSize={12} stroke="hsl(215, 10%, 50%)" />
                  <YAxis fontSize={12} stroke="hsl(215, 10%, 50%)" domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(0, 0%, 100%)", 
                      border: "1px solid hsl(220, 10%, 88%)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cumprido" 
                    stroke="hsl(161, 51%, 43%)" 
                    strokeWidth={2}
                    name="SLA Cumprido (%)"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="hsl(38, 52%, 58%)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Meta (%)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pendências por Setor */}
        <div className="card-premium p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Exames Pendentes por Setor</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-foreground">42</p>
                <span className="px-2 py-0.5 bg-ambar-suave/10 text-ambar-suave text-xs font-medium rounded-full">Atenção</span>
              </div>
              <p className="text-sm text-muted-foreground">Bioquímica</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-ambar-suave w-[65%]" />
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-foreground">28</p>
                <span className="px-2 py-0.5 bg-verde-clinico/10 text-verde-clinico text-xs font-medium rounded-full">Normal</span>
              </div>
              <p className="text-sm text-muted-foreground">Hematologia</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-verde-clinico w-[45%]" />
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-foreground">35</p>
                <span className="px-2 py-0.5 bg-ambar-suave/10 text-ambar-suave text-xs font-medium rounded-full">Atenção</span>
              </div>
              <p className="text-sm text-muted-foreground">Microbiologia</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-ambar-suave w-[55%]" />
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold text-foreground">22</p>
                <span className="px-2 py-0.5 bg-verde-clinico/10 text-verde-clinico text-xs font-medium rounded-full">Normal</span>
              </div>
              <p className="text-sm text-muted-foreground">Imunologia</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-verde-clinico w-[35%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Riscos e Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Prazos Críticos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-vermelho-moderno/5 rounded-lg border border-vermelho-moderno/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-vermelho-moderno" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Cultura de Urina</p>
                    <p className="text-xs text-muted-foreground">Req. #4521 • Prazo: 14:00</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-vermelho-moderno">Atrasado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ambar-suave/5 rounded-lg border border-ambar-suave/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-ambar-suave" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Antibiograma</p>
                    <p className="text-xs text-muted-foreground">Req. #4518 • Prazo: 16:00</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-ambar-suave">2h restantes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ambar-suave/5 rounded-lg border border-ambar-suave/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-ambar-suave" />
                  <div>
                    <p className="text-sm font-medium text-foreground">TSH Ultra-sensível</p>
                    <p className="text-xs text-muted-foreground">Req. #4515 • Prazo: 17:30</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-ambar-suave">3h restantes</span>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Métricas de Qualidade</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Taxa de Recoleta</span>
                  <span className="text-sm font-medium text-verde-clinico">1.2%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-verde-clinico w-[12%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Amostras Rejeitadas</span>
                  <span className="text-sm font-medium text-verde-clinico">0.8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-verde-clinico w-[8%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Tempo Médio de Liberação</span>
                  <span className="text-sm font-medium text-foreground">4.2h</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[70%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Satisfação do Cliente</span>
                  <span className="text-sm font-medium text-verde-clinico">96%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-verde-clinico w-[96%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceLaboratorio;

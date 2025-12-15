import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICardWithTooltip from "@/components/workspace/KPICardWithTooltip";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import LastUpdatedBadge from "@/components/workspace/LastUpdatedBadge";
import { FlaskConical, Clock, CheckCircle, AlertTriangle, Timer, FileCheck, Info } from "lucide-react";
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const setoresPendentes = [
  { setor: "Bioquímica", pendentes: 42, capacidade: 65, status: "atenção" as const },
  { setor: "Hematologia", pendentes: 28, capacidade: 60, status: "normal" as const },
  { setor: "Microbiologia", pendentes: 35, capacidade: 55, status: "atenção" as const },
  { setor: "Imunologia", pendentes: 22, capacidade: 60, status: "normal" as const },
];

const getStatusConfig = (status: "normal" | "atenção" | "atrasado") => {
  switch (status) {
    case "normal":
      return { bg: "bg-verde-clinico/10", text: "text-verde-clinico", bar: "bg-verde-clinico", label: "Normal" };
    case "atenção":
      return { bg: "bg-ambar-suave/10", text: "text-ambar-suave", bar: "bg-ambar-suave", label: "Atenção" };
    case "atrasado":
      return { bg: "bg-vermelho-moderno/10", text: "text-vermelho-moderno", bar: "bg-vermelho-moderno", label: "Atrasado" };
  }
};

const WorkspaceLaboratorio = () => {
  return (
    <WorkspaceLayout title="Dashboard Laboratório">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <GlobalFilters />
          <LastUpdatedBadge relative="há 2 minutos" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICardWithTooltip
            title="Exames Realizados"
            value="8.234"
            subtitle="No período"
            icon={FlaskConical}
            trend={{ value: "15%", positive: true }}
            tooltip={{
              description: "Quantidade de exames concluídos.",
              calculation: "Total de exames com resultado liberado",
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
              description: "Exames aguardando análise ou liberação.",
              calculation: "Exames coletados - Exames liberados",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Laudos Liberados"
            value="7.986"
            subtitle="Finalizados"
            icon={CheckCircle}
            trend={{ value: "12%", positive: true }}
            tooltip={{
              description: "Laudos assinados e disponíveis.",
              calculation: "Total de laudos com status 'liberado'",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Prazo Crítico"
            value="23"
            subtitle="Urgentes (< 2h)"
            icon={AlertTriangle}
            tooltip={{
              description: "Exames com menos de 2 horas para o prazo.",
              calculation: "Exames onde prazo - hora atual < 2h",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="SLA Geral"
            value="91.2%"
            subtitle="Meta: 90%"
            icon={Timer}
            trend={{ value: "2%", positive: true }}
            tooltip={{
              description: "Percentual de exames liberados dentro do prazo.",
              calculation: "Exames no prazo ÷ Total exames × 100",
              type: "Percentual (%)"
            }}
          />
          <KPICardWithTooltip
            title="Taxa de Aprovação"
            value="98.5%"
            subtitle="Controle de qualidade"
            icon={FileCheck}
            tooltip={{
              description: "Percentual de amostras aprovadas.",
              calculation: "Amostras aprovadas ÷ Total amostras × 100",
              type: "Percentual (%)"
            }}
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
              Acompanhamento ao longo do dia (horário atual)
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
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-foreground">Exames Pendentes por Setor</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p><span className="text-verde-clinico font-medium">Normal:</span> &lt; 50% da capacidade</p>
                    <p><span className="text-ambar-suave font-medium">Atenção:</span> 50-80% da capacidade</p>
                    <p><span className="text-vermelho-moderno font-medium">Atrasado:</span> &gt; 80% da capacidade</p>
                  </div>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {setoresPendentes.map((setor) => {
              const config = getStatusConfig(setor.status);
              const percentage = Math.round((setor.pendentes / setor.capacidade) * 100);
              
              return (
                <div key={setor.setor} className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-2xl font-bold text-foreground">{setor.pendentes}</p>
                    <span className={`px-2 py-0.5 ${config.bg} ${config.text} text-xs font-medium rounded-full`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{setor.setor}</p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${config.bar}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{percentage}% da capacidade</p>
                </div>
              );
            })}
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
                <span className="px-2 py-0.5 bg-vermelho-moderno/10 text-vermelho-moderno text-xs font-medium rounded-full">
                  Atrasado
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ambar-suave/5 rounded-lg border border-ambar-suave/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-ambar-suave" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Antibiograma</p>
                    <p className="text-xs text-muted-foreground">Req. #4518 • Prazo: 16:00</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-ambar-suave/10 text-ambar-suave text-xs font-medium rounded-full">
                  Atenção
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-verde-clinico/5 rounded-lg border border-verde-clinico/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-verde-clinico" />
                  <div>
                    <p className="text-sm font-medium text-foreground">TSH Ultra-sensível</p>
                    <p className="text-xs text-muted-foreground">Req. #4515 • Prazo: 17:30</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-verde-clinico/10 text-verde-clinico text-xs font-medium rounded-full">
                  Normal
                </span>
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
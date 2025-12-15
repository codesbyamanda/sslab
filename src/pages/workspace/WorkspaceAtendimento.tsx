import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import KPICardWithTooltip from "@/components/workspace/KPICardWithTooltip";
import GlobalFilters from "@/components/workspace/GlobalFilters";
import LastUpdatedBadge from "@/components/workspace/LastUpdatedBadge";
import { Users, UserPlus, Clock, CheckCircle, TrendingUp, Calendar, Building2, Info, ArrowUpDown } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const atendimentosPorConvenio = [
  { name: "Unimed", value: 35 },
  { name: "Particular", value: 25 },
  { name: "Bradesco", value: 20 },
  { name: "SulAmérica", value: 12 },
  { name: "Outros", value: 8 },
];

const tabelaConvenios = [
  { convenio: "Unimed", atendimentos: 428, exames: 1284, valor: 125430, participacao: 32.2 },
  { convenio: "Particular", atendimentos: 312, exames: 936, valor: 98200, participacao: 25.2 },
  { convenio: "Bradesco Saúde", atendimentos: 256, exames: 768, valor: 76890, participacao: 19.7 },
  { convenio: "SulAmérica", atendimentos: 148, exames: 444, valor: 45320, participacao: 11.6 },
  { convenio: "Amil", atendimentos: 98, exames: 294, valor: 28450, participacao: 7.3 },
  { convenio: "Outros", atendimentos: 65, exames: 195, valor: 15130, participacao: 3.9 },
];

const COLORS = ["hsl(200, 56%, 25%)", "hsl(161, 51%, 43%)", "hsl(38, 52%, 58%)", "hsl(280, 50%, 50%)", "hsl(215, 10%, 50%)"];

const WorkspaceAtendimento = () => {
  return (
    <WorkspaceLayout title="Dashboard Atendimento">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <GlobalFilters />
          <LastUpdatedBadge relative="há 3 minutos" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICardWithTooltip
            title="Total de Atendimentos"
            value="2.847"
            subtitle="No período selecionado"
            icon={Users}
            trend={{ value: "12%", positive: true }}
            tooltip={{
              description: "Quantidade total de atendimentos no período.",
              calculation: "Soma de todos os atendimentos registrados",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Novos Pacientes"
            value="234"
            subtitle="Primeira consulta"
            icon={UserPlus}
            trend={{ value: "8%", positive: true }}
            tooltip={{
              description: "Pacientes que realizaram primeira consulta.",
              calculation: "Atendimentos com flag 'primeiro atendimento'",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Tempo Médio de Espera"
            value="18 min"
            subtitle="Meta: ≤ 15 min"
            icon={Clock}
            trend={{ value: "5%", positive: false }}
            tooltip={{
              description: "Tempo médio entre chegada e início do atendimento.",
              calculation: "Média do tempo de espera de todos os atendimentos",
              type: "Média (minutos)"
            }}
          />
          <KPICardWithTooltip
            title="Atend. Concluídos"
            value="2.654"
            subtitle="Finalizados com sucesso"
            icon={CheckCircle}
            trend={{ value: "15%", positive: true }}
            tooltip={{
              description: "Atendimentos finalizados no período.",
              calculation: "Atendimentos com status 'concluído'",
              type: "Valor absoluto"
            }}
          />
          <KPICardWithTooltip
            title="Taxa de Ocupação"
            value="78%"
            subtitle="Capacidade utilizada"
            icon={TrendingUp}
            tooltip={{
              description: "Percentual de utilização da capacidade.",
              calculation: "Atendimentos realizados ÷ Capacidade × 100",
              type: "Percentual (%)"
            }}
          />
          <KPICardWithTooltip
            title="Agendamentos"
            value="156"
            subtitle="Próximos 7 dias (fixo)"
            icon={Calendar}
            tooltip={{
              description: "Agendamentos confirmados para os próximos 7 dias.",
              calculation: "Janela fixa, não afetada pelos filtros de período",
              type: "Valor absoluto"
            }}
          />
        </div>

        {/* Charts Row 1 */}
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

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-premium p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Atendimentos por Convênio (Volume)
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Distribuição percentual por quantidade de atendimentos
            </p>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={atendimentosPorConvenio}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {atendimentosPorConvenio.map((entry, index) => (
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

          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">
                Participação por Convênio (R$)
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Valor faturado por fonte pagadora
            </p>
            <div className="space-y-3">
              {tabelaConvenios.slice(0, 4).map((item) => (
                <div key={item.convenio} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.convenio}</p>
                    <p className="text-xs text-muted-foreground">{item.atendimentos} atendimentos • {item.exames} exames</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">R$ {item.valor.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.participacao}% do total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela Analítica */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">
              Tabela Analítica por Convênio
            </h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    "Atendimentos" representa o número de requisições abertas. 
                    "Valor Total" corresponde ao faturamento bruto (R$).
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Detalhamento completo de atendimentos, exames e valores
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:text-foreground transition-colors">
                    <div className="flex items-center gap-1">
                      Convênio
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-foreground transition-colors">
                    <div className="flex items-center justify-end gap-1">
                      Atendimentos
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-foreground transition-colors">
                    <div className="flex items-center justify-end gap-1">
                      Exames
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-foreground transition-colors">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <div className="flex items-center justify-end gap-1">
                            Valor Total (R$)
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Valor bruto faturado</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:text-foreground transition-colors">
                    <div className="flex items-center justify-end gap-1">
                      Participação
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabelaConvenios.map((item) => (
                  <TableRow key={item.convenio} className="hover:bg-muted/30 cursor-pointer">
                    <TableCell className="font-medium">{item.convenio}</TableCell>
                    <TableCell className="text-right">{item.atendimentos}</TableCell>
                    <TableCell className="text-right">{item.exames}</TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      R$ {item.valor.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.participacao}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspaceAtendimento;
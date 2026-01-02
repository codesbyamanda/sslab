import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const kpiData = [
  {
    title: "Pendentes",
    value: "12",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    title: "Concluídas",
    value: "148",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  },
  {
    title: "Canceladas",
    value: "8",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    title: "Este Mês",
    value: "45",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  }
];

const chartData = [
  { mes: "Jan", transferencias: 32 },
  { mes: "Fev", transferencias: 28 },
  { mes: "Mar", transferencias: 45 },
  { mes: "Abr", transferencias: 38 },
  { mes: "Mai", transferencias: 52 },
  { mes: "Jun", transferencias: 45 }
];

const recentTransfers = [
  {
    id: "1",
    data: "02/01/2026",
    paciente: "Maria Silva Santos",
    origem: "UTI Adulto",
    destino: "Enfermaria 3",
    tipo: "Interna",
    situacao: "Concluída"
  },
  {
    id: "2",
    data: "02/01/2026",
    paciente: "João Pedro Oliveira",
    origem: "Emergência",
    destino: "Centro Cirúrgico",
    tipo: "Interna",
    situacao: "Em andamento"
  },
  {
    id: "3",
    data: "01/01/2026",
    paciente: "Ana Carolina Lima",
    origem: "Hospital Central",
    destino: "Hospital Regional",
    tipo: "Externa",
    situacao: "Pendente"
  },
  {
    id: "4",
    data: "01/01/2026",
    paciente: "Carlos Alberto Souza",
    origem: "Enfermaria 2",
    destino: "UTI Coronariana",
    tipo: "Interna",
    situacao: "Concluída"
  },
  {
    id: "5",
    data: "31/12/2025",
    paciente: "Fernanda Costa",
    origem: "Ambulatório",
    destino: "Internação",
    tipo: "Interna",
    situacao: "Cancelada"
  }
];

const getSituacaoBadge = (situacao: string) => {
  switch (situacao) {
    case "Concluída":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Concluída</Badge>;
    case "Pendente":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>;
    case "Em andamento":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Em andamento</Badge>;
    case "Cancelada":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelada</Badge>;
    default:
      return <Badge variant="secondary">{situacao}</Badge>;
  }
};

const TransferenciaDashboard = () => {
  const navigate = useNavigate();

  return (
    <TransferenciaLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard de Transferências</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Visão geral das transferências de pacientes e prontuários
            </p>
          </div>
          <Button onClick={() => navigate("/transferencia/nova")}>
            Nova Transferência
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className={`${kpi.bgColor} ${kpi.borderColor} border`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart and Recent Transfers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transferências por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="transferencias" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transfers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Últimas Transferências</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => navigate("/transferencia/lista")}
              >
                Ver todas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransfers.slice(0, 5).map((transfer) => (
                    <TableRow 
                      key={transfer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/transferencia/${transfer.id}`)}
                    >
                      <TableCell className="font-medium text-sm">
                        {transfer.paciente}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transfer.destino}
                      </TableCell>
                      <TableCell>
                        {getSituacaoBadge(transfer.situacao)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaDashboard;

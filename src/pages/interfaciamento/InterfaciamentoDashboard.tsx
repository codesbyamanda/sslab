import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  WifiOff, 
  FlaskConical, 
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const kpiCards = [
  { 
    title: "Equipamentos Ativos", 
    value: "12", 
    icon: Monitor, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    title: "Equipamentos Offline", 
    value: "2", 
    icon: WifiOff, 
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  { 
    title: "Exames Processados Hoje", 
    value: "347", 
    icon: FlaskConical, 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    title: "Erros de Comunicação", 
    value: "5", 
    icon: AlertTriangle, 
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
];

const alertasOffline = [
  { equipamento: "Analisador Hematológico XN-1000", setor: "Hematologia", ultimaComunicacao: "Há 2 horas" },
  { equipamento: "Centrífuga Automática C-500", setor: "Bioquímica", ultimaComunicacao: "Há 45 min" },
];

const falhasRecentes = [
  { equipamento: "Analisador Bioquímico AU-680", erro: "Timeout na comunicação", horario: "14:32" },
  { equipamento: "Coagulômetro CS-2500", erro: "Erro de checksum", horario: "13:15" },
  { equipamento: "Analisador de Urina UF-5000", erro: "Resposta inválida", horario: "11:48" },
];

export default function InterfaciamentoDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard - Interfaciamento</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da comunicação com equipamentos laboratoriais
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas - Equipamentos Offline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-red-600" />
              Equipamentos sem Comunicação
            </CardTitle>
            <Link to="/interfaciamento/equipamentos">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {alertasOffline.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Todos os equipamentos estão online</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertasOffline.map((alerta, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{alerta.equipamento}</p>
                        <p className="text-sm text-muted-foreground">{alerta.setor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Offline</Badge>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alerta.ultimaComunicacao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Falhas Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Falhas Recentes de Protocolo
            </CardTitle>
            <Link to="/interfaciamento/logs">
              <Button variant="ghost" size="sm">
                Ver logs
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {falhasRecentes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhuma falha recente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {falhasRecentes.map((falha, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{falha.equipamento}</p>
                        <p className="text-sm text-red-600">{falha.erro}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        Erro
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{falha.horario}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Map, 
  Package, 
  TestTube2, 
  Filter, 
  UserCheck, 
  FileText, 
  Printer, 
  Files, 
  Settings, 
  FileBarChart,
  ArrowRight,
  FlaskConical,
  Clock,
  FileCheck2,
  AlertTriangle,
  Cog,
  Send,
  SendHorizonal
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
}

interface KPIBadgeProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
  delay?: number;
}

const KPIBadge = ({
  title,
  value,
  icon: Icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  valueColor = "text-foreground",
  delay = 0
}: KPIBadgeProps) => {
  return (
    <Card 
      className="card-premium animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const mapaTrabalhoActions: QuickAction[] = [
  { title: "Lotes de Amostras", description: "Gerenciar lotes", icon: Package, path: "/laboratorio/lotes-amostras" },
  { title: "Amostras", description: "Lista de amostras", icon: TestTube2, path: "/laboratorio/amostras" },
  { title: "Filtro do Mapa", description: "Configurar filtros", icon: Filter, path: "/laboratorio/filtro-mapa" },
  { title: "Mapa de Trabalho", description: "Gerar mapas", icon: Map, path: "/laboratorio/mapa-trabalho" },
];

const laudoActions: QuickAction[] = [
  { title: "Digitação por Paciente", description: "Por requisição", icon: UserCheck, path: "/laboratorio/digitacao-paciente" },
  { title: "Digitação por Mapa", description: "Por lote de mapa", icon: FileText, path: "/laboratorio/digitacao-mapa" },
  { title: "Impressão Laudo", description: "Imprimir laudos", icon: Printer, path: "/laboratorio/impressao-laudo" },
  { title: "Gerar Laudos Lote", description: "Emissão em lote", icon: Files, path: "/laboratorio/gerar-laudos-lote" },
];

const kpiBadges = [
  { 
    title: "Amostras hoje", 
    value: "127", 
    icon: FlaskConical, 
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    valueColor: "text-foreground"
  },
  { 
    title: "Laudos pendentes", 
    value: "42", 
    icon: Clock, 
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    valueColor: "text-foreground"
  },
  { 
    title: "Laudos liberados", 
    value: "89", 
    icon: FileCheck2, 
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    valueColor: "text-accent"
  },
  { 
    title: "Itens urgentes", 
    value: "5", 
    icon: AlertTriangle, 
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    valueColor: "text-warning"
  },
  { 
    title: "Amostras em produção", 
    value: "34", 
    icon: Cog, 
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    valueColor: "text-blue-500"
  },
  { 
    title: "Amostras enviadas", 
    value: "78", 
    icon: Send, 
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    valueColor: "text-green-500"
  },
  { 
    title: "Amostras não enviadas", 
    value: "15", 
    icon: SendHorizonal, 
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    valueColor: "text-red-500"
  },
];

const LaboratorioHome = () => {
  const navigate = useNavigate();

  return (
    <LaboratorioLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saúde Laboratório</h1>
          <p className="text-muted-foreground mt-1">
            Controle das rotinas técnicas: do recebimento do material até digitação e emissão do laudo.
          </p>
        </div>

        {/* KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {kpiBadges.map((badge, index) => (
            <KPIBadge
              key={badge.title}
              title={badge.title}
              value={badge.value}
              icon={badge.icon}
              iconBg={badge.iconBg}
              iconColor={badge.iconColor}
              valueColor={badge.valueColor}
              delay={index * 50}
            />
          ))}
        </div>

        {/* Main Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mapa de Trabalho */}
          <Card className="card-premium">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mapa de Trabalho</CardTitle>
                  <CardDescription>Gestão de amostras e geração de mapas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {mapaTrabalhoActions.map((action) => (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                  >
                    <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Laudo */}
          <Card className="card-premium">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Laudo</CardTitle>
                  <CardDescription>Digitação, liberação e impressão de laudos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {laudoActions.map((action) => (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                  >
                    <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relatórios */}
          <Card className="card-premium-hover cursor-pointer" onClick={() => navigate("/laboratorio/relatorios")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileBarChart className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Relatórios</h3>
                  <p className="text-sm text-muted-foreground">Relatórios e análises do laboratório</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="card-premium-hover cursor-pointer" onClick={() => navigate("/laboratorio/config-geral")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Configurações</h3>
                  <p className="text-sm text-muted-foreground">Geral, impressão e laudo de internet</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioHome;

import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
}

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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">127</p>
              <p className="text-sm text-muted-foreground">Amostras hoje</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-sm text-muted-foreground">Laudos pendentes</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-accent">89</p>
              <p className="text-sm text-muted-foreground">Laudos liberados</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-warning">5</p>
              <p className="text-sm text-muted-foreground">Itens urgentes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioHome;

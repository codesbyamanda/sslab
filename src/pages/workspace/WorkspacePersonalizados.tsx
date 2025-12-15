import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import { Plus, BarChart3, PieChart, LineChart, LayoutGrid, Star, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const dashboardsPersonalizados = [
  {
    id: 1,
    title: "Análise de Convênios",
    description: "Comparativo de faturamento por convênio",
    icon: PieChart,
    favorite: true,
    lastUpdated: "Há 2 horas",
  },
  {
    id: 2,
    title: "Performance Semanal",
    description: "KPIs consolidados da semana",
    icon: BarChart3,
    favorite: true,
    lastUpdated: "Há 5 horas",
  },
  {
    id: 3,
    title: "Tendência Anual",
    description: "Evolução mensal de atendimentos",
    icon: LineChart,
    favorite: false,
    lastUpdated: "Ontem",
  },
  {
    id: 4,
    title: "Painel Executivo",
    description: "Visão gerencial consolidada",
    icon: LayoutGrid,
    favorite: false,
    lastUpdated: "Há 3 dias",
  },
];

const WorkspacePersonalizados = () => {
  return (
    <WorkspaceLayout title="Dashboards Personalizados">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Crie e gerencie seus próprios painéis de análise
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Dashboard
          </Button>
        </div>

        {/* Favoritos */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-ambar-suave" />
            Favoritos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardsPersonalizados
              .filter((d) => d.favorite)
              .map((dashboard) => (
                <div
                  key={dashboard.id}
                  className="card-premium-hover p-5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <dashboard.icon className="h-5 w-5 text-primary" />
                    </div>
                    <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {dashboard.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {dashboard.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Atualizado {dashboard.lastUpdated}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Todos os Dashboards */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Todos os Dashboards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dashboardsPersonalizados.map((dashboard) => (
              <div
                key={dashboard.id}
                className="card-premium-hover p-5 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <dashboard.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    {dashboard.favorite && (
                      <Star className="h-4 w-4 text-ambar-suave fill-ambar-suave" />
                    )}
                    <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {dashboard.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {dashboard.description}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Atualizado {dashboard.lastUpdated}
                </p>
              </div>
            ))}

            {/* Card de criar novo */}
            <button className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-all min-h-[180px]">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Criar Dashboard
              </span>
            </button>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default WorkspacePersonalizados;

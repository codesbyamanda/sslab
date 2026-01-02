import { useNavigate } from "react-router-dom";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileBarChart, Users, ClipboardList, ArrowRight } from "lucide-react";

const relatorios = [
  {
    title: "Faturamento Clínica / Médico – Sintético",
    description: "Visão consolidada do faturamento por médico e clínica, com totais de guias, exames e valores.",
    icon: BarChart3,
    url: "/faturamento/relatorios/clinica-sintetico",
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Faturamento Clínica – Analítico",
    description: "Detalhamento completo por guia e procedimento, com opção de agrupamento e expansão.",
    icon: FileBarChart,
    url: "/faturamento/relatorios/clinica-analitico",
    color: "bg-verde-clinico/10 text-verde-clinico"
  },
  {
    title: "Rendimentos por Solicitantes",
    description: "Análise de faturamento e glosas por médico solicitante, com ranking visual.",
    icon: Users,
    url: "/faturamento/relatorios/rendimentos-solicitantes",
    color: "bg-ambar-suave/10 text-ambar-suave"
  },
  {
    title: "Quantidade de Exames por Serviços",
    description: "Volume de exames realizados por tipo de serviço/setor, com análise temporal.",
    icon: ClipboardList,
    url: "/faturamento/relatorios/exames-servicos",
    color: "bg-petroleo/10 text-petroleo"
  }
];

const RelatoriosLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <FaturamentoSidebar />
      <div className="flex-1 flex flex-col">
        <FaturamentoNavbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Relatórios de Faturamento</h1>
            <p className="text-muted-foreground mt-1">
              Selecione um relatório para visualizar dados consolidados e analíticos
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatorios.map((relatorio) => (
              <Card 
                key={relatorio.url}
                className="card-premium-hover cursor-pointer group"
                onClick={() => navigate(relatorio.url)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${relatorio.color}`}>
                      <relatorio.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-lg mt-4">{relatorio.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {relatorio.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-primary font-medium">
                    Acessar relatório
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RelatoriosLanding;

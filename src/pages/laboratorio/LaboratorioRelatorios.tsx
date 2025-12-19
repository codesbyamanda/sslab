import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileBarChart, FileText, BarChart3, Clock, Users, Layers } from "lucide-react";

const relatorios = [
  { titulo: "Produção por Setor", icon: Layers },
  { titulo: "Amostras por Período", icon: FileBarChart },
  { titulo: "Laudos Emitidos", icon: FileText },
  { titulo: "Exames por Convênio", icon: Users },
  { titulo: "TAT (Turnaround Time)", icon: Clock },
  { titulo: "Produtividade por Bancada", icon: BarChart3 },
];

const LaboratorioRelatorios = () => {
  return (
    <LaboratorioLayout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Módulos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/laboratorio">Saúde Laboratório</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Relatórios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Relatórios e análises do laboratório.
          </p>
        </div>

        {/* Em Breve */}
        <Card className="card-premium border-dashed">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FileBarChart className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Em Breve</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                A seção de relatórios está em desenvolvimento. Em breve você terá acesso a relatórios detalhados sobre as operações do laboratório.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Relatórios (desabilitados) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatorios.map(({ titulo, icon: Icon }) => (
            <Card 
              key={titulo} 
              className="card-premium opacity-50 pointer-events-none select-none"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm text-muted-foreground">{titulo}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioRelatorios;

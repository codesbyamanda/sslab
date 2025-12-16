import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart, Construction } from "lucide-react";

const LaboratorioRelatorios = () => {
  return (
    <LaboratorioLayout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Relatórios e análises do laboratório.
          </p>
        </div>

        {/* Em Breve */}
        <Card className="card-premium">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Construction className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Em Breve</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                A seção de relatórios está em desenvolvimento. Em breve você terá acesso a relatórios detalhados sobre as operações do laboratório.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
          {[
            "Produção por Setor",
            "Amostras por Período",
            "Laudos Emitidos",
            "Exames por Convênio",
            "TAT (Turnaround Time)",
            "Produtividade por Bancada",
          ].map((titulo) => (
            <Card key={titulo} className="card-premium cursor-not-allowed">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileBarChart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">{titulo}</CardTitle>
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

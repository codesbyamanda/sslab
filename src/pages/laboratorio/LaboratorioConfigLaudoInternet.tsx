import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, FolderOpen, Info } from "lucide-react";
import { toast } from "sonner";

const LaboratorioConfigLaudoInternet = () => {
  const [pastaLaudos, setPastaLaudos] = useState("C:\\SaudeSystems\\Laudos\\Internet");

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <LaboratorioLayout title="Laudo de Internet">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações de Laudo de Internet</h1>
          <p className="text-muted-foreground mt-1">
            Configure o local de armazenamento dos laudos para envio via internet.
          </p>
        </div>

        {/* Configurações */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Pasta de Laudos</CardTitle>
            </div>
            <CardDescription>
              Defina o local onde os laudos para internet serão armazenados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Pasta de Laudos</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  value={pastaLaudos}
                  onChange={(e) => setPastaLaudos(e.target.value)}
                  placeholder="Caminho da pasta de laudos"
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => toast.info("Selecionando pasta...")}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Selecionar
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Importante</p>
                <p>
                  Se houver mais de um computador gerando laudos para internet, utilize a mesma pasta configurada para o envio ao Data-center. Isso garantirá que todos os laudos sejam armazenados no mesmo local e estejam disponíveis para consulta online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave} className="btn-primary-premium">
            Salvar
          </Button>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioConfigLaudoInternet;

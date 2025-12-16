import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Info } from "lucide-react";
import { toast } from "sonner";

const LaboratorioConfigImpressao = () => {
  const [impressoraLaudos, setImpressoraLaudos] = useState("");
  const [impressoraMapas, setImpressoraMapas] = useState("");
  const [impressoraRelatorios, setImpressoraRelatorios] = useState("");

  const handleSave = () => {
    toast.success("Configurações de impressão salvas com sucesso!");
  };

  return (
    <LaboratorioLayout title="Configurações Impressão">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações de Impressão</h1>
          <p className="text-muted-foreground mt-1">
            Configure as impressoras padrão para cada tipo de documento.
          </p>
        </div>

        {/* Configurações */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Impressoras Padrão</CardTitle>
            </div>
            <CardDescription>
              Selecione as impressoras que serão utilizadas por padrão.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Impressora Laudos</Label>
                <Select value={impressoraLaudos} onValueChange={setImpressoraLaudos}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a impressora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="hp-laserjet-p1102">HP LaserJet P1102</SelectItem>
                    <SelectItem value="epson-l3150">Epson L3150</SelectItem>
                    <SelectItem value="brother-hl-l2320d">Brother HL-L2320D</SelectItem>
                    <SelectItem value="pdf">Imprimir como PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Impressora Mapas</Label>
                <Select value={impressoraMapas} onValueChange={setImpressoraMapas}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a impressora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="hp-laserjet-p1102">HP LaserJet P1102</SelectItem>
                    <SelectItem value="epson-l3150">Epson L3150</SelectItem>
                    <SelectItem value="brother-hl-l2320d">Brother HL-L2320D</SelectItem>
                    <SelectItem value="pdf">Imprimir como PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Impressora Relatórios</Label>
                <Select value={impressoraRelatorios} onValueChange={setImpressoraRelatorios}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a impressora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="hp-laserjet-p1102">HP LaserJet P1102</SelectItem>
                    <SelectItem value="epson-l3150">Epson L3150</SelectItem>
                    <SelectItem value="brother-hl-l2320d">Brother HL-L2320D</SelectItem>
                    <SelectItem value="pdf">Imprimir como PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Observação</p>
                <p>
                  Estas configurações definem as impressoras padrão. Você poderá alterá-las no momento da impressão, se necessário.
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

export default LaboratorioConfigImpressao;

import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Map, Printer, FileDown, X, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const mockFiltros = [
  { id: "1", nome: "Bioquímica Geral" },
  { id: "2", nome: "Hematologia" },
  { id: "3", nome: "Microbiologia" },
];

const mockModelos = [
  { id: "1", nome: "Modelo Padrão" },
  { id: "2", nome: "Modelo Resumido" },
  { id: "3", nome: "Modelo Detalhado" },
];

const mockEmpresas = [
  { id: "1", nome: "Laboratório Central" },
  { id: "2", nome: "Laboratório Norte" },
];

const mockUnidades = [
  { id: "all", nome: "Todas as unidades" },
  { id: "1", nome: "Unidade Central" },
  { id: "2", nome: "Unidade Norte" },
  { id: "3", nome: "Unidade Sul" },
];

const LaboratorioMapaTrabalho = () => {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [unidade, setUnidade] = useState("");
  const [somenteUrgentes, setSomenteUrgentes] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleGerar = () => {
    if (!dataInicial || !dataFinal || !filtro || !modelo || !empresa) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setPreviewOpen(true);
    toast.success("Mapa de trabalho gerado com sucesso!");
  };

  const handlePrint = () => {
    toast.success("Enviando para impressão...");
  };

  const handleSavePDF = () => {
    toast.success("PDF gerado com sucesso!");
  };

  return (
    <LaboratorioLayout title="Mapa de Trabalho">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapa de Trabalho</h1>
          <p className="text-muted-foreground mt-1">
            Gere mapas de trabalho por filtros pré-definidos para organização das bancadas.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Parâmetros de Geração</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataInicial">Data Inicial *</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFinal">Data Final *</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="filtro">Filtro *</Label>
                <Select value={filtro} onValueChange={setFiltro}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFiltros.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="modelo">Modelo *</Label>
                <Select value={modelo} onValueChange={setModelo}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockModelos.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="empresa">Empresa *</Label>
                <Select value={empresa} onValueChange={setEmpresa}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmpresas.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unidade">
                  Unidade de Coleta
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 inline ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Se vazio, imprime todas as unidades</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas as unidades" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUnidades.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgentes"
                checked={somenteUrgentes}
                onCheckedChange={(checked) => setSomenteUrgentes(checked as boolean)}
              />
              <Label htmlFor="urgentes" className="text-sm font-normal cursor-pointer">
                Somente Itens Urgentes
              </Label>
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Informações sobre o Mapa
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• O mapa é separado por setor/bancada/paciente/amostra/exames</li>
                <li>• Quebra de folha por Unidade e Bancada</li>
                <li>• Só gera para exames com status "colhido"</li>
                <li>• Ao gerar, serão criados lotes de mapas com numeração sequencial</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGerar} className="btn-primary-premium">
                <Map className="h-4 w-4 mr-2" />
                Gerar Mapa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview do Mapa de Trabalho</DialogTitle>
              <DialogDescription>
                Mapa #1234 • 3 folhas • Gerado em 16/12/2024 às 10:30
              </DialogDescription>
            </DialogHeader>

            {/* Mock Preview */}
            <div className="border rounded-lg bg-muted/30 p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Preview do mapa de trabalho</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Bioquímica Geral • Unidade Central • Bancada 01-02
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>5 itens urgentes incluídos</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
                <Button variant="outline" onClick={handleSavePDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Salvar PDF
                </Button>
                <Button onClick={handlePrint} className="btn-primary-premium">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioMapaTrabalho;

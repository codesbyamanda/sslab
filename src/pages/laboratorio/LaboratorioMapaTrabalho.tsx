import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Map, Printer, FileDown, X, Info, AlertTriangle, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock data - em produção viria do backend
const mockFiltros = [
  { id: "1", nome: "Bioquímica Geral" },
  { id: "2", nome: "Hematologia" },
  { id: "3", nome: "Microbiologia" },
];

const mockModelos = [
  { id: "padrao", nome: "Modelo Padrão" },
  { id: "resumido", nome: "Modelo Resumido" },
  { id: "detalhado", nome: "Modelo Detalhado" },
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
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [unidade, setUnidade] = useState("");
  const [somenteUrgentes, setSomenteUrgentes] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Validação de datas
  const dateError = useMemo(() => {
    if (dataInicial && dataFinal) {
      const inicio = new Date(dataInicial);
      const fim = new Date(dataFinal);
      if (fim < inicio) {
        return "Data Final não pode ser menor que Data Inicial";
      }
    }
    return null;
  }, [dataInicial, dataFinal]);

  // Verificar se todos os campos obrigatórios estão preenchidos
  const isFormValid = useMemo(() => {
    return (
      dataInicial !== "" &&
      dataFinal !== "" &&
      filtro !== "" &&
      modelo !== "" &&
      empresa !== "" &&
      !dateError
    );
  }, [dataInicial, dataFinal, filtro, modelo, empresa, dateError]);

  // Verificar se existem filtros cadastrados
  const hasFiltros = mockFiltros.length > 0;

  const handleGerar = () => {
    if (!isFormValid) return;
    setPreviewOpen(true);
    toast.success("Mapa de trabalho gerado com sucesso!");
  };

  const handlePrint = () => {
    toast.success("Enviando para impressão...");
  };

  const handleSavePDF = () => {
    toast.success("PDF gerado com sucesso!");
  };

  const handleGoToFiltros = () => {
    navigate("/laboratorio/filtro-mapa");
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

        {/* Parâmetros de Geração */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Parâmetros de Geração</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Data Inicial */}
              <div className="space-y-1.5">
                <Label htmlFor="dataInicial">
                  Data Inicial<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className={!dataInicial ? "border-muted-foreground/30" : ""}
                />
              </div>

              {/* Data Final */}
              <div className="space-y-1.5">
                <Label htmlFor="dataFinal">
                  Data Final<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className={dateError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {dateError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {dateError}
                  </p>
                )}
              </div>

              {/* Filtro */}
              <div className="space-y-1.5">
                <Label htmlFor="filtro">
                  Filtro<span className="text-destructive ml-0.5">*</span>
                </Label>
                {hasFiltros ? (
                  <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger>
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
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="h-10 px-3 py-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 flex items-center text-sm text-muted-foreground">
                      Nenhum filtro cadastrado
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 justify-start text-primary"
                      onClick={handleGoToFiltros}
                    >
                      Cadastrar filtro em "Filtro do Mapa" →
                    </Button>
                  </div>
                )}
              </div>

              {/* Modelo */}
              <div className="space-y-1.5">
                <Label htmlFor="modelo">
                  Modelo<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select value={modelo} onValueChange={setModelo}>
                  <SelectTrigger>
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

              {/* Empresa */}
              <div className="space-y-1.5">
                <Label htmlFor="empresa">
                  Empresa<span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select value={empresa} onValueChange={setEmpresa}>
                  <SelectTrigger>
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

              {/* Unidade de Coleta */}
              <div className="space-y-1.5">
                <Label htmlFor="unidade" className="flex items-center gap-1">
                  Unidade de Coleta
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Campo opcional. Se vazio, considera todas as unidades.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger>
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

            {/* Checkbox Somente Urgentes */}
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
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• O mapa é separado por setor/bancada/paciente/amostra/exames</li>
                <li>• Quebra de folha por Unidade e Bancada</li>
                <li>• Só gera para exames/amostras com status elegível (ex.: "Colhido")</li>
                <li>• Ao gerar, serão criados lotes de mapas com numeração sequencial</li>
              </ul>
            </div>

            {/* Botão Gerar */}
            <div className="flex justify-end">
              <Button
                onClick={handleGerar}
                disabled={!isFormValid}
                className="btn-primary-premium"
              >
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
              <DialogTitle className="text-lg">Preview do Mapa de Trabalho</DialogTitle>
              <DialogDescription className="text-sm">
                Mapa #1234 • 3 folhas • Gerado em 16/12/2024 às 10:30
              </DialogDescription>
            </DialogHeader>

            {/* PDF Preview Placeholder */}
            <div className="border rounded-lg bg-muted/30 min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <FileText className="h-10 w-10 text-muted-foreground/60" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Preview do mapa de trabalho</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {mockFiltros.find(f => f.id === filtro)?.nome || "Filtro"} • {mockEmpresas.find(e => e.id === empresa)?.nome || "Empresa"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-warning" />
                {somenteUrgentes ? (
                  <span>Somente itens urgentes incluídos</span>
                ) : (
                  <span>5 itens urgentes incluídos</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
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

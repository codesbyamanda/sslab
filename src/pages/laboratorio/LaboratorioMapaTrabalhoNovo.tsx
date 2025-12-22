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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Map, Info, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
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

const LaboratorioMapaTrabalhoNovo = () => {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modelo, setModelo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [unidade, setUnidade] = useState("");
  const [somenteUrgentes, setSomenteUrgentes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGerar = async () => {
    if (!isFormValid) return;

    setIsGenerating(true);
    
    try {
      // Simular processamento demorado
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("Mapa de trabalho gerado com sucesso!", {
        description: "O mapa foi salvo e está disponível na listagem.",
      });
      
      // Redirecionar para a listagem de mapas
      navigate("/laboratorio/mapa-trabalho");
    } catch {
      toast.error("Erro ao gerar mapa de trabalho", {
        description: "Não foi possível gerar o mapa. Tente novamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoToFiltros = () => {
    navigate("/laboratorio/filtro-mapa");
  };

  const handleVoltar = () => {
    navigate("/laboratorio/mapa-trabalho");
  };

  return (
    <LaboratorioLayout title="Gerar Mapa de Trabalho">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoltar}
            className="shrink-0 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gerar Mapa de Trabalho</h1>
            <p className="text-muted-foreground mt-1">
              Informe os parâmetros para gerar um novo mapa de trabalho.
            </p>
          </div>
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
                  disabled={isGenerating}
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
                  disabled={isGenerating}
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
                  <Select value={filtro} onValueChange={setFiltro} disabled={isGenerating}>
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
                <Select value={modelo} onValueChange={setModelo} disabled={isGenerating}>
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
                <Select value={empresa} onValueChange={setEmpresa} disabled={isGenerating}>
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
                <Select value={unidade} onValueChange={setUnidade} disabled={isGenerating}>
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
                disabled={isGenerating}
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
                <li>• Bancadas com mais de 6 exames geram complemento automático</li>
                <li>• Ao gerar, o mapa será salvo e disponível na listagem</li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleVoltar}
                disabled={isGenerating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGerar}
                disabled={!isFormValid || isGenerating}
                className="btn-primary-premium min-w-[180px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando Mapa...
                  </>
                ) : (
                  <>
                    <Map className="h-4 w-4 mr-2" />
                    Gerar Mapa
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioMapaTrabalhoNovo;

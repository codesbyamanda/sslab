import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TestTube2, Search, Filter, Eye, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Status de condição da amostra (condição física)
type StatusCondicao = "normal" | "nao_localizada" | "acidentada" | "inadequada" | "insuficiente" | "descartada";

interface Amostra {
  id: string;
  numeroAmostra: string;
  paciente: string;
  dataColeta: string;
  setorBancada: string;
  statusCondicao: StatusCondicao;
  servicos: string[];
}

const mockAmostras: Amostra[] = [
  { id: "1", numeroAmostra: "A-2024-089234", paciente: "Maria Silva Santos", dataColeta: "16/12/2024 08:15", setorBancada: "Bioquímica / Bancada 01", statusCondicao: "normal", servicos: ["HMG", "GLI", "HB1AC", "CREA", "UREIA"] },
  { id: "2", numeroAmostra: "A-2024-089233", paciente: "João Pedro Oliveira", dataColeta: "16/12/2024 08:00", setorBancada: "Hematologia / Bancada 01", statusCondicao: "normal", servicos: ["HMG", "COL", "TRI"] },
  { id: "3", numeroAmostra: "A-2024-089232", paciente: "Ana Carolina Lima", dataColeta: "16/12/2024 07:45", setorBancada: "Bioquímica / Bancada 02", statusCondicao: "nao_localizada", servicos: ["GLI", "TGO"] },
  { id: "4", numeroAmostra: "A-2024-089231", paciente: "Carlos Eduardo Souza", dataColeta: "16/12/2024 07:30", setorBancada: "Microbiologia / Bancada 01", statusCondicao: "inadequada", servicos: ["URO"] },
  { id: "5", numeroAmostra: "A-2024-089230", paciente: "Fernanda Costa", dataColeta: "15/12/2024 17:00", setorBancada: "Urinálise / Bancada 01", statusCondicao: "acidentada", servicos: ["EAS", "URO", "CRE", "GLI", "HMG", "COL"] },
];

// Configuração visual para status de condição da amostra
const statusCondicaoConfig: Record<StatusCondicao, { label: string; class: string }> = {
  normal: { label: "Normal", class: "badge-success" },
  nao_localizada: { label: "Não localizada", class: "badge-warning" },
  acidentada: { label: "Acidentada", class: "badge-error" },
  inadequada: { label: "Inadequada", class: "badge-error" },
  insuficiente: { label: "Insuficiente", class: "badge-warning" },
  descartada: { label: "Descartada", class: "badge-neutral" },
};

const ServicosCell = ({ servicos }: { servicos: string[] }) => {
  const maxVisible = 3;
  const visibleServicos = servicos.slice(0, maxVisible);
  const hiddenServicos = servicos.slice(maxVisible);
  const hasMore = hiddenServicos.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleServicos.map((servico) => (
        <span
          key={servico}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          {servico}
        </span>
      ))}
      {hasMore && (
        <TooltipProvider>
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border hover:bg-muted/80 cursor-pointer transition-colors">
                    +{hiddenServicos.length}
                  </button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Todos os serviços ({servicos.length})
                </p>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {servicos.map((servico) => (
                    <span
                      key={servico}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {servico}
                    </span>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent side="top">
              <p>{hiddenServicos.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

const LaboratorioAmostras = () => {
  const navigate = useNavigate();
  const [numeroAmostra, setNumeroAmostra] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [setor, setSetor] = useState("");
  const [statusCondicao, setStatusCondicao] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (mockAmostras.length === 0) {
      toast({
        title: "Não há amostras para exportar",
        description: "Não há amostras para exportar com os filtros atuais.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    // Simular geração do PDF
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "PDF gerado com sucesso",
        description: `Lista de ${mockAmostras.length} amostras exportada.`,
      });
    } catch {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <LaboratorioLayout title="Amostras">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Amostras</h1>
          <p className="text-muted-foreground mt-1">
            Lista e gestão de amostras do laboratório.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="numeroAmostra">Nº Amostra</Label>
                <Input
                  id="numeroAmostra"
                  value={numeroAmostra}
                  onChange={(e) => setNumeroAmostra(e.target.value)}
                  placeholder="A-2024-..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="paciente">Paciente</Label>
                <Input
                  id="paciente"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  placeholder="Nome do paciente"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataColeta">Data Coleta</Label>
                <Input
                  id="dataColeta"
                  type="date"
                  value={dataColeta}
                  onChange={(e) => setDataColeta(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Setor/Bancada</Label>
                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="bioquimica">Bioquímica</SelectItem>
                    <SelectItem value="hematologia">Hematologia</SelectItem>
                    <SelectItem value="microbiologia">Microbiologia</SelectItem>
                    <SelectItem value="urinalise">Urinálise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condição</Label>
                <Select value={statusCondicao} onValueChange={setStatusCondicao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="nao_localizada">Não localizada</SelectItem>
                    <SelectItem value="acidentada">Acidentada</SelectItem>
                    <SelectItem value="inadequada">Inadequada</SelectItem>
                    <SelectItem value="insuficiente">Insuficiente</SelectItem>
                    <SelectItem value="descartada">Descartada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost">Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TestTube2 className="h-4 w-4" />
                Amostras Encontradas
              </CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{mockAmostras.length} amostras</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting || mockAmostras.length === 0}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Salvar como PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Amostra</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data Coleta</TableHead>
                  <TableHead>Setor / Bancada</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAmostras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <TestTube2 className="h-10 w-10 mb-2 opacity-50" />
                        <p>Nenhuma amostra encontrada com os filtros aplicados.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  mockAmostras.map((amostra) => (
                    <TableRow key={amostra.id}>
                      <TableCell className="font-medium font-mono">{amostra.numeroAmostra}</TableCell>
                      <TableCell>{amostra.paciente}</TableCell>
                      <TableCell>{amostra.dataColeta}</TableCell>
                      <TableCell>{amostra.setorBancada}</TableCell>
                      <TableCell>
                        <ServicosCell servicos={amostra.servicos} />
                      </TableCell>
                      <TableCell>
                        <span className={statusCondicaoConfig[amostra.statusCondicao].class}>
                          {statusCondicaoConfig[amostra.statusCondicao].label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => navigate(`/laboratorio/amostras/${amostra.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Visualizar detalhes</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioAmostras;

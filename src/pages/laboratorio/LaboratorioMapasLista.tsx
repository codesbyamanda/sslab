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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Map,
  Search,
  Filter,
  Eye,
  FileDown,
  Printer,
  Plus,
  AlertTriangle,
  FileText,
  Loader2,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import MapaTrabalhoPreview from "@/components/laboratorio/MapaTrabalhoPreview";

interface MapaGerado {
  id: string;
  numeroMapa: string;
  dataHoraGeracao: string;
  periodoInicio: string;
  periodoFim: string;
  setorBancada: string;
  unidade: string;
  modelo: string;
  qtdePacientes: number;
  qtdeExames: number;
  itensUrgentes: boolean;
  qtdeUrgentes: number;
  status: "gerado" | "impresso" | "reimpresso";
}

const mockMapas: MapaGerado[] = [
  {
    id: "1",
    numeroMapa: "MAP-2024-001234",
    dataHoraGeracao: "22/12/2024 08:30",
    periodoInicio: "22/12/2024",
    periodoFim: "22/12/2024",
    setorBancada: "Bioquímica / Bancada 01",
    unidade: "Unidade Central",
    modelo: "Modelo Padrão",
    qtdePacientes: 45,
    qtdeExames: 187,
    itensUrgentes: true,
    qtdeUrgentes: 5,
    status: "gerado",
  },
  {
    id: "2",
    numeroMapa: "MAP-2024-001233",
    dataHoraGeracao: "22/12/2024 07:15",
    periodoInicio: "21/12/2024",
    periodoFim: "22/12/2024",
    setorBancada: "Hematologia / Bancada 01",
    unidade: "Unidade Central",
    modelo: "Modelo Detalhado",
    qtdePacientes: 32,
    qtdeExames: 96,
    itensUrgentes: false,
    qtdeUrgentes: 0,
    status: "impresso",
  },
  {
    id: "3",
    numeroMapa: "MAP-2024-001232",
    dataHoraGeracao: "21/12/2024 16:45",
    periodoInicio: "21/12/2024",
    periodoFim: "21/12/2024",
    setorBancada: "Microbiologia / Bancada 02",
    unidade: "Unidade Norte",
    modelo: "Modelo Resumido",
    qtdePacientes: 18,
    qtdeExames: 42,
    itensUrgentes: true,
    qtdeUrgentes: 2,
    status: "reimpresso",
  },
  {
    id: "4",
    numeroMapa: "MAP-2024-001231",
    dataHoraGeracao: "21/12/2024 14:20",
    periodoInicio: "20/12/2024",
    periodoFim: "21/12/2024",
    setorBancada: "Urinálise / Bancada 01",
    unidade: "Unidade Central",
    modelo: "Modelo Padrão",
    qtdePacientes: 28,
    qtdeExames: 56,
    itensUrgentes: false,
    qtdeUrgentes: 0,
    status: "impresso",
  },
  {
    id: "5",
    numeroMapa: "MAP-2024-001230",
    dataHoraGeracao: "21/12/2024 08:00",
    periodoInicio: "21/12/2024",
    periodoFim: "21/12/2024",
    setorBancada: "Bioquímica / Bancada 02",
    unidade: "Unidade Sul",
    modelo: "Modelo Padrão",
    qtdePacientes: 52,
    qtdeExames: 234,
    itensUrgentes: true,
    qtdeUrgentes: 8,
    status: "gerado",
  },
];

const statusConfig = {
  gerado: { label: "Gerado", class: "badge-neutral", icon: FileText },
  impresso: { label: "Impresso", class: "badge-success", icon: CheckCircle2 },
  reimpresso: { label: "Reimpresso", class: "badge-warning", icon: RefreshCcw },
};

const LaboratorioMapasLista = () => {
  const navigate = useNavigate();
  const [numeroMapa, setNumeroMapa] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [setor, setSetor] = useState("");
  const [unidade, setUnidade] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMapa, setSelectedMapa] = useState<MapaGerado | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<string | null>(null);

  const handleViewMapa = (mapa: MapaGerado) => {
    setSelectedMapa(mapa);
    setPreviewOpen(true);
  };

  const handleExportPDF = async (mapa: MapaGerado) => {
    setIsExporting(mapa.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("PDF gerado com sucesso!", {
        description: `Mapa ${mapa.numeroMapa} exportado.`,
      });
    } catch {
      toast.error("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = async (mapa: MapaGerado) => {
    setIsPrinting(mapa.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Enviado para impressão!", {
        description: `Mapa ${mapa.numeroMapa}`,
      });
    } catch {
      toast.error("Não foi possível imprimir. Tente novamente.");
    } finally {
      setIsPrinting(null);
    }
  };

  const handleClearFilters = () => {
    setNumeroMapa("");
    setDataInicial("");
    setDataFinal("");
    setSetor("");
    setUnidade("");
    setStatusFilter("");
  };

  return (
    <LaboratorioLayout title="Mapas de Trabalho">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mapas de Trabalho</h1>
            <p className="text-muted-foreground mt-1">
              Listagem e gestão dos mapas de trabalho gerados.
            </p>
          </div>
          <Button
            onClick={() => navigate("/laboratorio/mapa-trabalho/novo")}
            className="btn-primary-premium shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Gerar Novo Mapa
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="numeroMapa">Nº do Mapa</Label>
                <Input
                  id="numeroMapa"
                  value={numeroMapa}
                  onChange={(e) => setNumeroMapa(e.target.value)}
                  placeholder="MAP-2024-..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataInicial">Data Geração (De)</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFinal">Data Geração (Até)</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
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
                <Label>Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="central">Unidade Central</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="gerado">Gerado</SelectItem>
                    <SelectItem value="impresso">Impresso</SelectItem>
                    <SelectItem value="reimpresso">Reimpresso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="ghost" onClick={handleClearFilters}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="h-4 w-4" />
                Mapas Gerados
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {mockMapas.length} mapas encontrados
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº do Mapa</TableHead>
                  <TableHead>Data/Hora Geração</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Setor / Bancada</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="text-right">Pacientes</TableHead>
                  <TableHead className="text-right">Exames</TableHead>
                  <TableHead className="text-center">Urgentes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMapas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Map className="h-10 w-10 mb-2 opacity-50" />
                        <p>Nenhum mapa encontrado.</p>
                        <p className="text-sm">Gere um novo mapa de trabalho para começar.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  mockMapas.map((mapa) => {
                    const StatusIcon = statusConfig[mapa.status].icon;
                    return (
                      <TableRow key={mapa.id}>
                        <TableCell className="font-medium font-mono">
                          {mapa.numeroMapa}
                        </TableCell>
                        <TableCell>{mapa.dataHoraGeracao}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {mapa.periodoInicio === mapa.periodoFim
                              ? mapa.periodoInicio
                              : `${mapa.periodoInicio} - ${mapa.periodoFim}`}
                          </span>
                        </TableCell>
                        <TableCell>{mapa.setorBancada}</TableCell>
                        <TableCell>{mapa.unidade}</TableCell>
                        <TableCell>{mapa.modelo}</TableCell>
                        <TableCell className="text-right font-medium">
                          {mapa.qtdePacientes}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {mapa.qtdeExames}
                        </TableCell>
                        <TableCell className="text-center">
                          {mapa.itensUrgentes ? (
                            <span className="badge-error flex items-center gap-1 justify-center">
                              <AlertTriangle className="h-3 w-3" />
                              {mapa.qtdeUrgentes}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`${statusConfig[mapa.status].class} flex items-center gap-1.5`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[mapa.status].label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleViewMapa(mapa)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Visualizar Mapa</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleExportPDF(mapa)}
                                    disabled={isExporting === mapa.id}
                                  >
                                    {isExporting === mapa.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <FileDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Salvar PDF</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePrint(mapa)}
                                    disabled={isPrinting === mapa.id}
                                  >
                                    {isPrinting === mapa.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Printer className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Imprimir</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      {selectedMapa && (
        <MapaTrabalhoPreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          mapa={selectedMapa}
        />
      )}
    </LaboratorioLayout>
  );
};

export default LaboratorioMapasLista;

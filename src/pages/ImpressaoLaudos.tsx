import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, FileText, Search, X, Globe, Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import ExameSelectionModal from "@/components/laudos/ExameSelectionModal";
import GerarLaudoInternetModal from "@/components/laudos/GerarLaudoInternetModal";
import GerarLaudoArquivoModal from "@/components/laudos/GerarLaudoArquivoModal";
import HistoricoEmissoesModal from "@/components/laudos/HistoricoEmissoesModal";

export interface Requisicao {
  id: string;
  numero: string;
  paciente: string;
  convenio: string;
  dataAtendimento: string;
  situacao: "Aberto" | "Executado" | "Liberado" | "Impresso" | "Entregue";
  examesPendentes: number;
  examesFinalizados: number;
  medicoSolicitante: string;
  unidade: string;
}

const mockRequisicoes: Requisicao[] = [
  {
    id: "1",
    numero: "REQ-2024-001234",
    paciente: "Maria Silva Santos",
    convenio: "Unimed",
    dataAtendimento: "2024-01-15",
    situacao: "Liberado",
    examesPendentes: 0,
    examesFinalizados: 5,
    medicoSolicitante: "Dr. Carlos Oliveira",
    unidade: "Matriz",
  },
  {
    id: "2",
    numero: "REQ-2024-001235",
    paciente: "João Pedro Oliveira",
    convenio: "Particular",
    dataAtendimento: "2024-01-15",
    situacao: "Executado",
    examesPendentes: 2,
    examesFinalizados: 3,
    medicoSolicitante: "Dra. Ana Paula Ferreira",
    unidade: "Matriz",
  },
  {
    id: "3",
    numero: "REQ-2024-001236",
    paciente: "Ana Carolina Ferreira",
    convenio: "Bradesco Saúde",
    dataAtendimento: "2024-01-14",
    situacao: "Impresso",
    examesPendentes: 0,
    examesFinalizados: 4,
    medicoSolicitante: "Dr. Roberto Lima",
    unidade: "Filial Centro",
  },
  {
    id: "4",
    numero: "REQ-2024-001237",
    paciente: "Carlos Eduardo Lima",
    convenio: "SulAmérica",
    dataAtendimento: "2024-01-14",
    situacao: "Aberto",
    examesPendentes: 3,
    examesFinalizados: 0,
    medicoSolicitante: "Dra. Fernanda Costa",
    unidade: "Matriz",
  },
  {
    id: "5",
    numero: "REQ-2024-001238",
    paciente: "Fernanda Costa Silva",
    convenio: "Amil",
    dataAtendimento: "2024-01-13",
    situacao: "Entregue",
    examesPendentes: 0,
    examesFinalizados: 6,
    medicoSolicitante: "Dr. Paulo Mendes",
    unidade: "Filial Norte",
  },
];

const ImpressaoLaudos = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    requisicao: "",
    paciente: "",
    data: "",
    convenio: "",
    situacao: "",
  });
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(mockRequisicoes);
  const [selectedRequisicao, setSelectedRequisicao] = useState<Requisicao | null>(null);
  
  // Modal states
  const [showExameSelection, setShowExameSelection] = useState(false);
  const [showGerarInternet, setShowGerarInternet] = useState(false);
  const [showGerarArquivo, setShowGerarArquivo] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);

  const handleFilter = () => {
    let filtered = mockRequisicoes;

    if (filters.requisicao) {
      filtered = filtered.filter((r) =>
        r.numero.toLowerCase().includes(filters.requisicao.toLowerCase())
      );
    }
    if (filters.paciente) {
      filtered = filtered.filter((r) =>
        r.paciente.toLowerCase().includes(filters.paciente.toLowerCase())
      );
    }
    if (filters.data) {
      filtered = filtered.filter((r) => r.dataAtendimento === filters.data);
    }
    if (filters.convenio) {
      filtered = filtered.filter((r) =>
        r.convenio.toLowerCase().includes(filters.convenio.toLowerCase())
      );
    }
    if (filters.situacao) {
      filtered = filtered.filter((r) => r.situacao === filters.situacao);
    }

    setRequisicoes(filtered);
  };

  const handleClear = () => {
    setFilters({ requisicao: "", paciente: "", data: "", convenio: "", situacao: "" });
    setRequisicoes(mockRequisicoes);
  };

  const handleOpenExameSelection = (requisicao: Requisicao) => {
    setSelectedRequisicao(requisicao);
    setShowExameSelection(true);
  };

  const handleOpenGerarInternet = (requisicao: Requisicao) => {
    setSelectedRequisicao(requisicao);
    setShowGerarInternet(true);
  };

  const handleOpenGerarArquivo = (requisicao: Requisicao) => {
    setSelectedRequisicao(requisicao);
    setShowGerarArquivo(true);
  };

  const handleOpenHistorico = (requisicao: Requisicao) => {
    setSelectedRequisicao(requisicao);
    setShowHistorico(true);
  };

  const getSituacaoBadge = (situacao: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
      Aberto: { variant: "outline", className: "border-amber-500 text-amber-600" },
      Executado: { variant: "secondary" },
      Liberado: { variant: "default", className: "bg-verde-sucesso hover:bg-verde-sucesso/90" },
      Impresso: { variant: "default", className: "bg-primary" },
      Entregue: { variant: "outline", className: "border-muted-foreground text-muted-foreground" },
    };
    const config = variants[situacao] || { variant: "outline" as const };
    return <Badge variant={config.variant} className={config.className}>{situacao}</Badge>;
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Dashboard</span>
          </button>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Printer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Impressão de Laudos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Consulte, gere e envie laudos para pacientes e convênios.
                </p>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Filtros de Pesquisa
              </CardTitle>
              <CardDescription>
                Utilize os campos abaixo para localizar requisições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nº da Requisição
                  </label>
                  <Input
                    placeholder="Ex: REQ-2024-001234"
                    value={filters.requisicao}
                    onChange={(e) => setFilters({ ...filters, requisicao: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome do Paciente
                  </label>
                  <Input
                    placeholder="Buscar por nome..."
                    value={filters.paciente}
                    onChange={(e) => setFilters({ ...filters, paciente: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Data do Atendimento
                  </label>
                  <Input
                    type="date"
                    value={filters.data}
                    onChange={(e) => setFilters({ ...filters, data: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Convênio
                  </label>
                  <Input
                    placeholder="Nome do convênio..."
                    value={filters.convenio}
                    onChange={(e) => setFilters({ ...filters, convenio: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Situação
                  </label>
                  <Select
                    value={filters.situacao}
                    onValueChange={(value) => setFilters({ ...filters, situacao: value })}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Aberto">Aberto</SelectItem>
                      <SelectItem value="Executado">Executado</SelectItem>
                      <SelectItem value="Liberado">Liberado</SelectItem>
                      <SelectItem value="Impresso">Impresso</SelectItem>
                      <SelectItem value="Entregue">Entregue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleFilter} className="btn-primary-premium flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" onClick={handleClear} size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card className="card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Requisições
                </CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {requisicoes.length} encontrada(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nº Requisição</TableHead>
                      <TableHead className="font-semibold">Paciente</TableHead>
                      <TableHead className="font-semibold">Convênio</TableHead>
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold text-center">Situação</TableHead>
                      <TableHead className="font-semibold text-center">Exames</TableHead>
                      <TableHead className="font-semibold">Médico Solicitante</TableHead>
                      <TableHead className="font-semibold">Unidade</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisicoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>Nenhuma requisição encontrada</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      requisicoes.map((requisicao) => (
                        <TableRow
                          key={requisicao.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onDoubleClick={() => handleOpenExameSelection(requisicao)}
                        >
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            {requisicao.numero}
                          </TableCell>
                          <TableCell className="font-medium">{requisicao.paciente}</TableCell>
                          <TableCell>{requisicao.convenio}</TableCell>
                          <TableCell>
                            {new Date(requisicao.dataAtendimento).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-center">
                            {getSituacaoBadge(requisicao.situacao)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {requisicao.examesPendentes > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {requisicao.examesPendentes} pend.
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {requisicao.examesFinalizados} fin.
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{requisicao.medicoSolicitante}</TableCell>
                          <TableCell>{requisicao.unidade}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenExameSelection(requisicao);
                                    }}
                                    disabled={requisicao.examesFinalizados === 0}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Imprimir Laudos</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-verde-sucesso/10 hover:text-verde-sucesso"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenGerarInternet(requisicao);
                                    }}
                                    disabled={requisicao.examesFinalizados === 0}
                                  >
                                    <Globe className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Gerar Laudo Internet (F6)</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenGerarArquivo(requisicao);
                                    }}
                                    disabled={requisicao.examesFinalizados === 0}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Gerar Laudo Arquivo (F7)</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenHistorico(requisicao);
                                    }}
                                  >
                                    <History className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Histórico de Emissões (F8)</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      {selectedRequisicao && (
        <>
          <ExameSelectionModal
            open={showExameSelection}
            onClose={() => setShowExameSelection(false)}
            requisicao={selectedRequisicao}
          />
          <GerarLaudoInternetModal
            open={showGerarInternet}
            onClose={() => setShowGerarInternet(false)}
            requisicao={selectedRequisicao}
          />
          <GerarLaudoArquivoModal
            open={showGerarArquivo}
            onClose={() => setShowGerarArquivo(false)}
            requisicao={selectedRequisicao}
          />
          <HistoricoEmissoesModal
            open={showHistorico}
            onClose={() => setShowHistorico(false)}
            requisicao={selectedRequisicao}
          />
        </>
      )}
    </div>
  );
};

export default ImpressaoLaudos;

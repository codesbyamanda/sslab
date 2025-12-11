import { useState } from "react";
import { 
  ArrowLeft, 
  FileSearch, 
  Plus, 
  FileText, 
  Filter, 
  X, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp, 
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
  Eye,
  Trash2,
  RefreshCcw,
  Lock,
  Unlock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data for lotes
const mockLotes = [
  { id: 1, codigo: "PF-2024-001", convenio: "Unimed", usuario: "Maria Silva", dataCriacao: "2024-01-15", dataFechamento: null, qtdGuias: 45, total: 12500.00, status: "transicao" },
  { id: 2, codigo: "PF-2024-002", convenio: "Bradesco Saúde", usuario: "João Santos", dataCriacao: "2024-01-14", dataFechamento: "2024-01-16", qtdGuias: 32, total: 8750.50, status: "fechado" },
  { id: 3, codigo: "PF-2024-003", convenio: "SulAmérica", usuario: "Ana Costa", dataCriacao: "2024-01-13", dataFechamento: "2024-01-15", qtdGuias: 28, total: 6200.00, status: "fechado" },
  { id: 4, codigo: "PF-2024-004", convenio: "Amil", usuario: "Pedro Lima", dataCriacao: "2024-01-12", dataFechamento: null, qtdGuias: 15, total: 4100.75, status: "transicao" },
  { id: 5, codigo: "PF-2024-005", convenio: "Porto Seguro", usuario: "Carla Dias", dataCriacao: "2024-01-10", dataFechamento: "2024-01-12", qtdGuias: 52, total: 15800.00, status: "faturado" },
];

// Mock data for guias
const mockGuias = [
  { id: 1, codigo: "REQ-2024-0001", paciente: "José da Silva", convenio: "Unimed", plano: "Nacional", dataAtendimento: "2024-01-15", valor: 350.00, status: "aberta", pendencias: null, selected: true },
  { id: 2, codigo: "REQ-2024-0002", paciente: "Maria Oliveira", convenio: "Unimed", plano: "Estadual", dataAtendimento: "2024-01-15", valor: 420.00, status: "pendente", pendencias: "Código do CID não preenchido", selected: true },
  { id: 3, codigo: "REQ-2024-0003", paciente: "Carlos Santos", convenio: "Unimed", plano: "Nacional", dataAtendimento: "2024-01-14", valor: 280.00, status: "aberta", pendencias: null, selected: true },
  { id: 4, codigo: "REQ-2024-0004", paciente: "Ana Paula Costa", convenio: "Unimed", plano: "Empresarial", dataAtendimento: "2024-01-14", valor: 550.00, status: "pendente", pendencias: "Data da solicitação não informada; Número da carteira inválido", selected: false },
  { id: 5, codigo: "REQ-2024-0005", paciente: "Roberto Lima", convenio: "Unimed", plano: "Nacional", dataAtendimento: "2024-01-13", valor: 190.00, status: "cancelada", pendencias: null, selected: false },
  { id: 6, codigo: "REQ-2024-0006", paciente: "Fernanda Dias", convenio: "Unimed", plano: "Estadual", dataAtendimento: "2024-01-13", valor: 620.00, status: "aberta", pendencias: null, selected: true },
  { id: 7, codigo: "REQ-2024-0007", paciente: "Lucas Mendes", convenio: "Unimed", plano: "Nacional", dataAtendimento: "2024-01-12", valor: 380.00, status: "pendente", pendencias: "Procedimento não autorizado pelo convênio", selected: true },
  { id: 8, codigo: "REQ-2024-0008", paciente: "Patricia Souza", convenio: "Unimed", plano: "Empresarial", dataAtendimento: "2024-01-12", valor: 450.00, status: "aberta", pendencias: null, selected: true },
];

const convenios = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Porto Seguro", "Hapvida", "NotreDame"];

type ViewMode = "list" | "detail";
type LoteStatus = "transicao" | "fechado" | "faturado";
type GuiaStatus = "aberta" | "pendente" | "cancelada";

const PreFaturamento = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedLote, setSelectedLote] = useState<typeof mockLotes[0] | null>(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  // List filters
  const [filterConvenio, setFilterConvenio] = useState("");
  const [filterCodigo, setFilterCodigo] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Detail filters
  const [detailConvenio, setDetailConvenio] = useState("Unimed");
  const [detailDataInicio, setDetailDataInicio] = useState("");
  const [detailDataFim, setDetailDataFim] = useState("");
  const [detailStatusGuias, setDetailStatusGuias] = useState<string[]>(["aberta", "pendente"]);
  
  // Guias state
  const [guias, setGuias] = useState(mockGuias);
  
  // Alert dialogs
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [showReopenAlert, setShowReopenAlert] = useState(false);
  const [showFaturaAlert, setShowFaturaAlert] = useState(false);

  const handleOpenLote = (lote: typeof mockLotes[0]) => {
    setSelectedLote(lote);
    setViewMode("detail");
    setDetailConvenio(lote.convenio);
  };

  const handleNewLote = () => {
    setSelectedLote({
      id: 0,
      codigo: "Novo Lote",
      convenio: "",
      usuario: "Ednaldo",
      dataCriacao: new Date().toISOString().split('T')[0],
      dataFechamento: null,
      qtdGuias: 0,
      total: 0,
      status: "transicao"
    });
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedLote(null);
  };

  const handleGuiaSelect = (guiaId: number, checked: boolean) => {
    setGuias(guias.map(g => g.id === guiaId ? { ...g, selected: checked } : g));
  };

  const handleSelectAll = (checked: boolean) => {
    setGuias(guias.map(g => ({ ...g, selected: checked })));
  };

  const handleSaveLote = () => {
    toast({
      title: "Lote salvo com sucesso",
      description: `Lote de Pré-Fatura ${selectedLote?.codigo} foi salvo.`,
    });
  };

  const handleCloseLote = () => {
    const pendentes = guias.filter(g => g.selected && g.status === "pendente").length;
    if (pendentes > 0) {
      setShowCloseAlert(true);
    } else {
      confirmCloseLote();
    }
  };

  const confirmCloseLote = () => {
    setShowCloseAlert(false);
    if (selectedLote) {
      setSelectedLote({ ...selectedLote, status: "fechado", dataFechamento: new Date().toISOString().split('T')[0] });
    }
    toast({
      title: "Lote fechado com sucesso",
      description: `Lote ${selectedLote?.codigo} está disponível para faturamento.`,
    });
  };

  const handleReopenLote = () => {
    if (selectedLote?.status === "faturado") {
      setShowFaturaAlert(true);
    } else {
      setShowReopenAlert(true);
    }
  };

  const confirmReopenLote = () => {
    setShowReopenAlert(false);
    if (selectedLote) {
      setSelectedLote({ ...selectedLote, status: "transicao", dataFechamento: null });
    }
    toast({
      title: "Lote reaberto",
      description: `Lote ${selectedLote?.codigo} está em transição novamente.`,
    });
  };

  const handleRemoveSelected = () => {
    const removedCount = guias.filter(g => g.selected).length;
    setGuias(guias.filter(g => !g.selected));
    toast({
      title: "Guias removidas",
      description: `${removedCount} guia(s) removida(s) do lote.`,
    });
  };

  const getStatusBadge = (status: LoteStatus) => {
    switch (status) {
      case "transicao":
        return <Badge className="bg-amarelo-alerta/20 text-amarelo-alerta border-amarelo-alerta/30">Em Transição</Badge>;
      case "fechado":
        return <Badge className="bg-azul-claro/20 text-azul-escuro border-azul-claro/30">Fechado</Badge>;
      case "faturado":
        return <Badge className="bg-verde-ativo/20 text-verde-ativo border-verde-ativo/30">Faturado</Badge>;
    }
  };

  const getGuiaStatusBadge = (status: GuiaStatus) => {
    switch (status) {
      case "aberta":
        return <Badge className="bg-azul-claro/20 text-azul-escuro border-azul-claro/30">Aberta</Badge>;
      case "pendente":
        return <Badge className="bg-vermelho-moderno/20 text-vermelho-moderno border-vermelho-moderno/30">Pendente</Badge>;
      case "cancelada":
        return <Badge className="bg-muted text-muted-foreground border-border">Cancelada</Badge>;
    }
  };

  const selectedGuias = guias.filter(g => g.selected);
  const totalSelecionado = selectedGuias.reduce((sum, g) => sum + g.valor, 0);
  const pendentesCount = guias.filter(g => g.status === "pendente").length;
  const canceladasCount = guias.filter(g => g.status === "cancelada").length;

  const clearListFilters = () => {
    setFilterConvenio("");
    setFilterCodigo("");
    setFilterDataInicio("");
    setFilterDataFim("");
  };

  const clearDetailFilters = () => {
    setDetailConvenio("");
    setDetailDataInicio("");
    setDetailDataFim("");
    setDetailStatusGuias(["aberta", "pendente"]);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => viewMode === "detail" ? handleBackToList() : navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{viewMode === "detail" ? "Voltar para Pré-Faturamento" : "Voltar para Serviços"}</span>
          </button>

          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">
              {viewMode === "list" ? "Pré-Faturamento" : `Lote de Pré-Fatura ${selectedLote?.codigo !== "Novo Lote" ? `#${selectedLote?.codigo}` : "(Novo)"}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {viewMode === "list" 
                ? "Conferência de guias antes do envio ao convênio." 
                : "Seleção e conferência de guias do convênio."}
            </p>
          </div>

          {/* Info Card - Collapsible */}
          {viewMode === "list" && (
            <Collapsible open={isInfoExpanded} onOpenChange={setIsInfoExpanded} className="mb-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileSearch className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Definição e Etapas da Pré-Fatura</h3>
                      <p className="text-xs text-muted-foreground">Clique para {isInfoExpanded ? "recolher" : "expandir"} as informações</p>
                    </div>
                  </div>
                  {isInfoExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mt-4 mb-4">
                      A Pré-fatura é um meio utilizado para conferência de guias a serem enviadas ao convênio. 
                      Ela está diretamente ligada às regras informadas no cadastro do convênio/plano, facilitando 
                      o processo de conferência através do status de alguns campos exigidos.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Etapas do processo:</p>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 pl-2">
                        <li>Criação de novo lote</li>
                        <li>Emissão de relatório de conferência</li>
                        <li>Inclusão ou exclusão de guias do lote</li>
                        <li>Fechamento do lote</li>
                      </ol>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Card - Lotes */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/50">
                  <h2 className="text-lg font-semibold text-foreground">Lotes de Pré-Fatura</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Emitir Relatório de Conferência
                    </Button>
                    <Button size="sm" onClick={handleNewLote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Lote de Pré-Fatura
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-5 border-b border-border/50 bg-muted/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Convênio</Label>
                      <Select value={filterConvenio} onValueChange={setFilterConvenio}>
                        <SelectTrigger className="h-9 bg-background">
                          <SelectValue placeholder="Todos os convênios" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="all">Todos os convênios</SelectItem>
                          {convenios.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Código do Lote</Label>
                      <Input 
                        placeholder="Ex: PF-2024-001" 
                        value={filterCodigo}
                        onChange={(e) => setFilterCodigo(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Inicial</Label>
                      <Input 
                        type="date" 
                        value={filterDataInicio}
                        onChange={(e) => setFilterDataInicio(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Final</Label>
                      <Input 
                        type="date" 
                        value={filterDataFim}
                        onChange={(e) => setFilterDataFim(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={clearListFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Limpar filtros
                    </Button>
                    <Button size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-border/50">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por código da requisição/guia..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 bg-background"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Código</TableHead>
                        <TableHead className="font-semibold">Convênio</TableHead>
                        <TableHead className="font-semibold">Usuário</TableHead>
                        <TableHead className="font-semibold">Data Criação</TableHead>
                        <TableHead className="font-semibold">Data Fechamento</TableHead>
                        <TableHead className="font-semibold text-center">Qtd. Guias</TableHead>
                        <TableHead className="font-semibold text-right">Total (R$)</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-center w-12">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLotes.map((lote) => (
                        <TableRow key={lote.id} className="cursor-pointer" onClick={() => handleOpenLote(lote)}>
                          <TableCell className="font-medium text-primary">{lote.codigo}</TableCell>
                          <TableCell>{lote.convenio}</TableCell>
                          <TableCell>{lote.usuario}</TableCell>
                          <TableCell>{new Date(lote.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{lote.dataFechamento ? new Date(lote.dataFechamento).toLocaleDateString('pt-BR') : "—"}</TableCell>
                          <TableCell className="text-center">{lote.qtdGuias}</TableCell>
                          <TableCell className="text-right font-medium">{lote.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell>{getStatusBadge(lote.status as LoteStatus)}</TableCell>
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border-border">
                                <DropdownMenuItem onClick={() => handleOpenLote(lote)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Abrir lote
                                </DropdownMenuItem>
                                {lote.status === "transicao" && (
                                  <DropdownMenuItem>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Fechar lote
                                  </DropdownMenuItem>
                                )}
                                {lote.status === "fechado" && (
                                  <DropdownMenuItem>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Reabrir lote
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Emitir relatório do lote
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Status Legend */}
                <div className="p-4 border-t border-border/50 bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Legenda de Status:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-verde-ativo" />
                      <span className="text-xs text-muted-foreground">Lote Faturado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-azul-claro" />
                      <span className="text-xs text-muted-foreground">Lote Pré-Faturado (Fechado)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amarelo-alerta" />
                      <span className="text-xs text-muted-foreground">Guias Pendentes / Em Transição</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Guia Cancelada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL VIEW */}
          {viewMode === "detail" && selectedLote && (
            <div className="space-y-6 animate-fade-in">
              {/* Lote Status Bar */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Status do Lote:</span>
                      {getStatusBadge(selectedLote.status as LoteStatus)}
                    </div>
                    {selectedLote.status !== "transicao" && selectedLote.dataFechamento && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Fechado em:</span>
                        <span className="text-sm font-medium">{new Date(selectedLote.dataFechamento).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedLote.status === "transicao" ? (
                      <Button onClick={handleCloseLote}>
                        <Lock className="h-4 w-4 mr-2" />
                        Fechar Lote
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={handleReopenLote}>
                        <Unlock className="h-4 w-4 mr-2" />
                        Reabrir Lote
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Filters Card */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold text-foreground">Filtros do Lote</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Convênio *</Label>
                      <Select value={detailConvenio} onValueChange={setDetailConvenio}>
                        <SelectTrigger className="h-9 bg-background">
                          <SelectValue placeholder="Selecione o convênio" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {convenios.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Inicial do Atendimento</Label>
                      <Input 
                        type="date" 
                        value={detailDataInicio}
                        onChange={(e) => setDetailDataInicio(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Final do Atendimento</Label>
                      <Input 
                        type="date" 
                        value={detailDataFim}
                        onChange={(e) => setDetailDataFim(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Status das Guias</Label>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox 
                            checked={detailStatusGuias.includes("aberta")}
                            onCheckedChange={(checked) => {
                              if (checked) setDetailStatusGuias([...detailStatusGuias, "aberta"]);
                              else setDetailStatusGuias(detailStatusGuias.filter(s => s !== "aberta"));
                            }}
                          />
                          <span className="text-sm">Abertas</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox 
                            checked={detailStatusGuias.includes("pendente")}
                            onCheckedChange={(checked) => {
                              if (checked) setDetailStatusGuias([...detailStatusGuias, "pendente"]);
                              else setDetailStatusGuias(detailStatusGuias.filter(s => s !== "pendente"));
                            }}
                          />
                          <span className="text-sm">Pendentes</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox 
                            checked={detailStatusGuias.includes("cancelada")}
                            onCheckedChange={(checked) => {
                              if (checked) setDetailStatusGuias([...detailStatusGuias, "cancelada"]);
                              else setDetailStatusGuias(detailStatusGuias.filter(s => s !== "cancelada"));
                            }}
                          />
                          <span className="text-sm">Canceladas</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={clearDetailFilters}>
                      Limpar
                    </Button>
                    <Button size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar guias
                    </Button>
                  </div>
                </div>
              </div>

              {/* Guias Table Card */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/50">
                  <h3 className="font-semibold text-foreground">Guias do Lote de Pré-Fatura</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Qtd. Selecionadas:</span>
                      <span className="font-semibold text-primary">{selectedGuias.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold text-verde-ativo">{totalSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                {selectedLote.status === "transicao" && (
                  <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={handleSaveLote}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar lote de Pré-Faturamento
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBackToList}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar inclusão de guias
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRemoveSelected} disabled={selectedGuias.length === 0}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover guias selecionadas
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar Relatório de Guias
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Cancelar itens não executados
                    </Button>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        {selectedLote.status === "transicao" && (
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={guias.length > 0 && guias.every(g => g.selected)}
                              onCheckedChange={(checked) => handleSelectAll(!!checked)}
                            />
                          </TableHead>
                        )}
                        <TableHead className="font-semibold">Código</TableHead>
                        <TableHead className="font-semibold">Paciente</TableHead>
                        <TableHead className="font-semibold">Convênio / Plano</TableHead>
                        <TableHead className="font-semibold">Data Atendimento</TableHead>
                        <TableHead className="font-semibold text-right">Valor (R$)</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Motivo(s) Pendência</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guias.map((guia) => (
                        <TableRow 
                          key={guia.id} 
                          className={cn(
                            guia.status === "pendente" && "bg-vermelho-moderno/5",
                            guia.status === "cancelada" && "bg-muted/50 opacity-60"
                          )}
                        >
                          {selectedLote.status === "transicao" && (
                            <TableCell>
                              <Checkbox 
                                checked={guia.selected}
                                onCheckedChange={(checked) => handleGuiaSelect(guia.id, !!checked)}
                                disabled={guia.status === "cancelada"}
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium text-primary">{guia.codigo}</TableCell>
                          <TableCell>{guia.paciente}</TableCell>
                          <TableCell>{guia.convenio} / {guia.plano}</TableCell>
                          <TableCell>{new Date(guia.dataAtendimento).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right font-medium">{guia.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell>{getGuiaStatusBadge(guia.status as GuiaStatus)}</TableCell>
                          <TableCell className="max-w-xs">
                            {guia.pendencias ? (
                              <div className="flex items-start gap-1.5">
                                <AlertCircle className="h-4 w-4 text-vermelho-moderno flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-vermelho-moderno">{guia.pendencias}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Footer Summary */}
                <div className="p-4 border-t border-border/50 bg-muted/20">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-azul-claro" />
                        <span className="text-muted-foreground">Total de guias:</span>
                        <span className="font-semibold">{guias.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amarelo-alerta" />
                        <span className="text-muted-foreground">Pendentes:</span>
                        <span className="font-semibold text-vermelho-moderno">{pendentesCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Canceladas:</span>
                        <span className="font-semibold">{canceladasCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Total do lote:</span>
                      <span className="text-lg font-bold text-verde-ativo">
                        {totalSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Alert Dialogs */}
      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar lote com guias pendentes?</AlertDialogTitle>
            <AlertDialogDescription>
              Existem guias com pendências neste lote. Deseja prosseguir com o fechamento ou prefere corrigir as pendências primeiro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Corrigir pendências</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseLote}>Fechar mesmo assim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showReopenAlert} onOpenChange={setShowReopenAlert}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Reabrir lote de pré-fatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao reabrir este lote, você poderá adicionar ou remover guias novamente. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReopenLote}>Reabrir lote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFaturaAlert} onOpenChange={setShowFaturaAlert}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Lote vinculado a uma fatura</AlertDialogTitle>
            <AlertDialogDescription>
              Este lote já está compondo uma fatura. Para alterá-lo, é necessário abrir a fatura correspondente primeiro, preservando assim a integridade dos dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowFaturaAlert(false)}>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreFaturamento;

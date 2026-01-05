import { useState } from "react";
import { ArrowLeft, FileText, Filter, X, Search, MoreVertical, Eye, ClipboardList, History, XCircle, AlertCircle, CheckCircle2, Clock, FileX, Info, Download, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data for guias
const mockGuias = [{
  id: 1,
  codigo: "GUIA-2024-0001",
  paciente: "José da Silva",
  convenio: "Unimed",
  plano: "Nacional",
  dataAtendimento: "2024-01-15",
  valor: 350.00,
  status: "aberta",
  motivoPendencia: null,
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }, {
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }, {
    codigo: "40301117",
    nome: "TSH",
    valor: 45.00
  }, {
    codigo: "40301125",
    nome: "T4 Livre",
    valor: 45.00
  }],
  historico: [{
    data: "2024-01-15 08:30",
    usuario: "Maria Silva",
    acao: "Guia criada"
  }, {
    data: "2024-01-15 09:15",
    usuario: "João Santos",
    acao: "Serviços adicionados"
  }]
}, {
  id: 2,
  codigo: "GUIA-2024-0002",
  paciente: "Maria Oliveira",
  convenio: "Unimed",
  plano: "Estadual",
  dataAtendimento: "2024-01-15",
  valor: 420.00,
  status: "pendente",
  motivoPendencia: "Código do CID não preenchido",
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }, {
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }],
  historico: [{
    data: "2024-01-15 10:00",
    usuario: "Ana Costa",
    acao: "Guia criada"
  }, {
    data: "2024-01-15 10:30",
    usuario: "Sistema",
    acao: "Pendência detectada: CID ausente"
  }]
}, {
  id: 3,
  codigo: "GUIA-2024-0003",
  paciente: "Carlos Santos",
  convenio: "Bradesco Saúde",
  plano: "Empresarial",
  dataAtendimento: "2024-01-14",
  valor: 280.00,
  status: "aberta",
  motivoPendencia: null,
  servicos: [{
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }, {
    codigo: "40302059",
    nome: "Colesterol total",
    valor: 18.00
  }],
  historico: [{
    data: "2024-01-14 14:00",
    usuario: "Pedro Lima",
    acao: "Guia criada"
  }]
}, {
  id: 4,
  codigo: "GUIA-2024-0004",
  paciente: "Ana Paula Costa",
  convenio: "SulAmérica",
  plano: "Especial",
  dataAtendimento: "2024-01-14",
  valor: 550.00,
  status: "pendente",
  motivoPendencia: "Data da solicitação não informada; Número da carteira inválido",
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }, {
    codigo: "40301117",
    nome: "TSH",
    valor: 45.00
  }, {
    codigo: "40301125",
    nome: "T4 Livre",
    valor: 45.00
  }],
  historico: [{
    data: "2024-01-14 09:00",
    usuario: "Carla Dias",
    acao: "Guia criada"
  }, {
    data: "2024-01-14 09:30",
    usuario: "Sistema",
    acao: "Pendências detectadas"
  }]
}, {
  id: 5,
  codigo: "GUIA-2024-0005",
  paciente: "Roberto Lima",
  convenio: "Amil",
  plano: "Individual",
  dataAtendimento: "2024-01-13",
  valor: 190.00,
  status: "cancelada",
  motivoPendencia: null,
  servicos: [{
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }],
  historico: [{
    data: "2024-01-13 11:00",
    usuario: "Maria Silva",
    acao: "Guia criada"
  }, {
    data: "2024-01-13 14:00",
    usuario: "João Santos",
    acao: "Guia cancelada - Solicitação do paciente"
  }]
}, {
  id: 6,
  codigo: "GUIA-2024-0006",
  paciente: "Fernanda Dias",
  convenio: "Unimed",
  plano: "Nacional",
  dataAtendimento: "2024-01-13",
  valor: 620.00,
  status: "faturada",
  motivoPendencia: null,
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }, {
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }, {
    codigo: "40301117",
    nome: "TSH",
    valor: 45.00
  }],
  historico: [{
    data: "2024-01-13 08:00",
    usuario: "Ana Costa",
    acao: "Guia criada"
  }, {
    data: "2024-01-14 10:00",
    usuario: "Pedro Lima",
    acao: "Guia incluída no lote PF-2024-001"
  }, {
    data: "2024-01-15 09:00",
    usuario: "Carla Dias",
    acao: "Guia faturada - Lote FAT-2024-001"
  }]
}, {
  id: 7,
  codigo: "GUIA-2024-0007",
  paciente: "Lucas Mendes",
  convenio: "Porto Seguro",
  plano: "Completo",
  dataAtendimento: "2024-01-12",
  valor: 380.00,
  status: "pendente",
  motivoPendencia: "Procedimento não autorizado pelo convênio",
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }, {
    codigo: "40302040",
    nome: "Glicose",
    valor: 15.00
  }],
  historico: [{
    data: "2024-01-12 16:00",
    usuario: "Maria Silva",
    acao: "Guia criada"
  }, {
    data: "2024-01-12 16:30",
    usuario: "Sistema",
    acao: "Pendência: Procedimento não autorizado"
  }]
}, {
  id: 8,
  codigo: "GUIA-2024-0008",
  paciente: "Patricia Souza",
  convenio: "Hapvida",
  plano: "Básico",
  dataAtendimento: "2024-01-12",
  valor: 450.00,
  status: "aberta",
  motivoPendencia: null,
  servicos: [{
    codigo: "40301630",
    nome: "Hemograma completo",
    valor: 25.00
  }],
  historico: [{
    data: "2024-01-12 10:00",
    usuario: "João Santos",
    acao: "Guia criada"
  }]
}];
const convenios = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Porto Seguro", "Hapvida", "NotreDame"];
type GuiaStatus = "aberta" | "pendente" | "cancelada" | "faturada";
const Guias = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Filters state
  const [filterConvenio, setFilterConvenio] = useState("");
  const [filterNumeroGuia, setFilterNumeroGuia] = useState("");
  const [filterPaciente, setFilterPaciente] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // UI state
  const [hasFiltered, setHasFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guias, setGuias] = useState(mockGuias);

  // Modals state
  const [selectedGuia, setSelectedGuia] = useState<typeof mockGuias[0] | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showServicosModal, setShowServicosModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const handleFilter = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHasFiltered(true);
      setIsLoading(false);
      toast({
        title: "Filtro aplicado",
        description: `Exibindo ${guias.length} guias conforme os filtros aplicados.`
      });
    }, 500);
  };
  const clearFilters = () => {
    setFilterConvenio("");
    setFilterNumeroGuia("");
    setFilterPaciente("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setFilterStatus([]);
    setHasFiltered(false);
  };
  const handleStatusToggle = (status: string) => {
    setFilterStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };
  const handleViewDetails = (guia: typeof mockGuias[0]) => {
    setSelectedGuia(guia);
    setShowDetailSheet(true);
  };
  const handleViewServicos = (guia: typeof mockGuias[0]) => {
    setSelectedGuia(guia);
    setShowServicosModal(true);
  };
  const handleViewHistorico = (guia: typeof mockGuias[0]) => {
    setSelectedGuia(guia);
    setShowHistoricoModal(true);
  };
  const handleCancelGuia = (guia: typeof mockGuias[0]) => {
    if (guia.status === "faturada" || guia.status === "cancelada") {
      toast({
        title: "Ação não permitida",
        description: "Não é possível cancelar uma guia já faturada ou cancelada.",
        variant: "destructive"
      });
      return;
    }
    setSelectedGuia(guia);
    setShowCancelDialog(true);
  };
  const confirmCancelGuia = () => {
    if (!selectedGuia) return;
    setGuias(prev => prev.map(g => g.id === selectedGuia.id ? {
      ...g,
      status: "cancelada" as GuiaStatus
    } : g));
    setShowCancelDialog(false);
    toast({
      title: "Guia cancelada",
      description: `Guia ${selectedGuia.codigo} foi cancelada com sucesso.`
    });
    setSelectedGuia(null);
  };
  const getStatusBadge = (status: GuiaStatus) => {
    switch (status) {
      case "aberta":
        return <Badge className="bg-azul-claro/20 text-azul-escuro border-azul-claro/30 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Aberta
          </Badge>;
      case "pendente":
        return <Badge className="bg-vermelho-moderno/20 text-vermelho-moderno border-vermelho-moderno/30 gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendente
          </Badge>;
      case "cancelada":
        return <Badge className="bg-muted text-muted-foreground border-border gap-1">
            <XCircle className="h-3 w-3" />
            Cancelada
          </Badge>;
      case "faturada":
        return <Badge className="bg-verde-ativo/20 text-verde-ativo border-verde-ativo/30 gap-1">
            <FileText className="h-3 w-3" />
            Faturada
          </Badge>;
    }
  };
  const filteredGuiasCount = guias.length;
  return <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          

          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">Guias</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Consulta e conferência de guias do faturamento
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6 animate-fade-in">
            {/* Filters Card */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm">
              {/* Card Header */}
              <div className="flex items-center gap-3 p-5 border-b border-border/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Filtros de Busca</h2>
                  <p className="text-xs text-muted-foreground">Utilize os filtros para localizar guias específicas</p>
                </div>
              </div>

              {/* Filters */}
              <div className="p-5 border-b border-border/50 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Convênio</Label>
                    <Select value={filterConvenio} onValueChange={setFilterConvenio}>
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue placeholder="Todos os convênios" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="all">Todos os convênios</SelectItem>
                        {convenios.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Número da Guia</Label>
                    <Input placeholder="Ex: GUIA-2024-0001" value={filterNumeroGuia} onChange={e => setFilterNumeroGuia(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Paciente</Label>
                    <Input placeholder="Nome do paciente" value={filterPaciente} onChange={e => setFilterPaciente(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Data Atendimento (Inicial)</Label>
                    <Input type="date" value={filterDataInicio} onChange={e => setFilterDataInicio(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Data Atendimento (Final)</Label>
                    <Input type="date" value={filterDataFim} onChange={e => setFilterDataFim(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground">Status da Guia</Label>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <Checkbox id="status-aberta" checked={filterStatus.includes("aberta")} onCheckedChange={() => handleStatusToggle("aberta")} />
                        <label htmlFor="status-aberta" className="text-sm text-foreground cursor-pointer">Aberta</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="status-pendente" checked={filterStatus.includes("pendente")} onCheckedChange={() => handleStatusToggle("pendente")} />
                        <label htmlFor="status-pendente" className="text-sm text-foreground cursor-pointer">Pendente</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="status-cancelada" checked={filterStatus.includes("cancelada")} onCheckedChange={() => handleStatusToggle("cancelada")} />
                        <label htmlFor="status-cancelada" className="text-sm text-foreground cursor-pointer">Cancelada</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="status-faturada" checked={filterStatus.includes("faturada")} onCheckedChange={() => handleStatusToggle("faturada")} />
                        <label htmlFor="status-faturada" className="text-sm text-foreground cursor-pointer">Faturada</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar filtros
                  </Button>
                  <Button size="sm" onClick={handleFilter} disabled={isLoading}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              {/* Results feedback */}
              {hasFiltered && !isLoading && <div className="px-5 py-3 bg-muted/10 border-b border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredGuiasCount}</span> guia(s) encontrada(s) conforme os filtros aplicados.
                  </p>
                </div>}

              {/* Loading state */}
              {isLoading && <div className="p-5 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>}

              {/* Table */}
              {hasFiltered && !isLoading && guias.length > 0 && <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Código da Guia</TableHead>
                        <TableHead className="font-semibold">Paciente</TableHead>
                        <TableHead className="font-semibold">Convênio / Plano</TableHead>
                        <TableHead className="font-semibold">Data Atendimento</TableHead>
                        <TableHead className="font-semibold text-right">Valor (R$)</TableHead>
                        <TableHead className="font-semibold text-center">Status</TableHead>
                        <TableHead className="font-semibold">Motivo da Pendência</TableHead>
                        <TableHead className="font-semibold text-center w-16">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guias.map(guia => <TableRow key={guia.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(guia)}>
                          <TableCell className="font-medium text-primary">{guia.codigo}</TableCell>
                          <TableCell className="font-medium">{guia.paciente}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{guia.convenio}</span>
                              <span className="text-xs text-muted-foreground">{guia.plano}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(guia.dataAtendimento).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right font-medium">
                            {guia.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(guia.status as GuiaStatus)}
                          </TableCell>
                          <TableCell>
                            {guia.motivoPendencia ? <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 text-vermelho-moderno">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm truncate max-w-[200px]">{guia.motivoPendencia}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="text-sm">{guia.motivoPendencia}</p>
                                </TooltipContent>
                              </Tooltip> : <span className="text-muted-foreground text-sm">—</span>}
                          </TableCell>
                          <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem onClick={() => handleViewDetails(guia)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewServicos(guia)}>
                                  <ClipboardList className="h-4 w-4 mr-2" />
                                  Visualizar serviços
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewHistorico(guia)}>
                                  <History className="h-4 w-4 mr-2" />
                                  Histórico da guia
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCancelGuia(guia)} disabled={guia.status === "faturada" || guia.status === "cancelada"} className={cn(guia.status !== "faturada" && guia.status !== "cancelada" && "text-vermelho-moderno focus:text-vermelho-moderno")}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancelar guia
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>}

              {/* Empty state after filter */}
              {hasFiltered && !isLoading && guias.length === 0 && <div className="p-8 text-center text-muted-foreground">
                  <FileX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-foreground mb-1">Nenhuma guia encontrada</p>
                  <p className="text-sm">Nenhuma guia encontrada com os filtros selecionados.</p>
                </div>}

              {/* Initial state - before filter */}
              {!hasFiltered && !isLoading && <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-foreground mb-1">Consulte as guias do faturamento</p>
                  <p className="text-sm">Utilize os filtros acima para localizar guias específicas.</p>
                </div>}
            </div>
          </div>
        </main>
      </div>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detalhes da Guia
            </SheetTitle>
            <SheetDescription>
              Visualização completa dos dados da guia
            </SheetDescription>
          </SheetHeader>
          
          {selectedGuia && <div className="py-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status atual:</span>
                {getStatusBadge(selectedGuia.status as GuiaStatus)}
              </div>

              {/* Dados da Guia */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Dados da Guia
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Código</p>
                    <p className="font-medium">{selectedGuia.codigo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Atendimento</p>
                    <p className="font-medium">{new Date(selectedGuia.dataAtendimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados do Paciente */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Dados do Paciente</h4>
                <div className="text-sm">
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedGuia.paciente}</p>
                </div>
              </div>

              <Separator />

              {/* Convênio */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Convênio</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Convênio</p>
                    <p className="font-medium">{selectedGuia.convenio}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plano</p>
                    <p className="font-medium">{selectedGuia.plano}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Serviços */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Serviços Vinculados</h4>
                  <Badge variant="secondary">{selectedGuia.servicos.length} itens</Badge>
                </div>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {selectedGuia.servicos.map((servico, idx) => <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{servico.nome}</p>
                          <p className="text-xs text-muted-foreground">Cód: {servico.codigo}</p>
                        </div>
                        <p className="font-medium">{servico.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</p>
                      </div>)}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Valores */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Valores</h4>
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <span className="text-sm text-muted-foreground">Valor Total</span>
                  <span className="text-lg font-bold text-primary">
                    {selectedGuia.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
                  </span>
                </div>
              </div>

              {/* Pendências */}
              {selectedGuia.motivoPendencia && <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-semibold text-vermelho-moderno flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Pendências
                    </h4>
                    <div className="p-3 bg-vermelho-moderno/10 border border-vermelho-moderno/20 rounded-lg">
                      <p className="text-sm text-vermelho-moderno">{selectedGuia.motivoPendencia}</p>
                    </div>
                  </div>
                </>}

              {/* Export Buttons */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>}
        </SheetContent>
      </Sheet>

      {/* Serviços Modal */}
      <Dialog open={showServicosModal} onOpenChange={setShowServicosModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Serviços da Guia
            </DialogTitle>
            <DialogDescription>
              {selectedGuia?.codigo} - {selectedGuia?.paciente}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGuia && <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedGuia.servicos.map((servico, idx) => <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{servico.codigo}</TableCell>
                      <TableCell>{servico.nome}</TableCell>
                      <TableCell className="text-right font-medium">
                        {servico.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-primary">
                  {selectedGuia.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
                </span>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Histórico Modal */}
      <Dialog open={showHistoricoModal} onOpenChange={setShowHistoricoModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Histórico da Guia
            </DialogTitle>
            <DialogDescription>
              {selectedGuia?.codigo} - Registro de alterações
            </DialogDescription>
          </DialogHeader>
          
          {selectedGuia && <div className="py-4">
              <div className="space-y-4">
                {selectedGuia.historico.map((item, idx) => <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {idx < selectedGuia.historico.length - 1 && <div className="w-0.5 h-full bg-border flex-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{item.acao}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.data}</span>
                        <span>•</span>
                        <span>{item.usuario}</span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Guia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a guia <span className="font-semibold">{selectedGuia?.codigo}</span>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelGuia} className="bg-vermelho-moderno hover:bg-vermelho-moderno/90">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Guias;
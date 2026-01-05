import { useState } from "react";
import { ArrowLeft, Filter, X, Search, MoreVertical, Eye, History, Printer, FileText, Send, Lock, CheckCircle2, Clock, AlertCircle, CalendarDays, Building2, Hash, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// ===============================
// TIPOS E STATUS DO LOTE DE FATURAMENTO
// ===============================

type LoteFaturamentoStatus = "AB" | "AR" | "PC" | "FD";
interface LoteFaturamentoStatusConfig {
  label: string;
  tooltip: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  className: string;
}
const loteFaturamentoStatusConfig: Record<LoteFaturamentoStatus, LoteFaturamentoStatusConfig> = {
  AB: {
    label: "Aberto",
    tooltip: "Lote aberto para edição e inclusão de guias",
    icon: Clock,
    className: "bg-azul-claro/20 text-azul-escuro border-azul-claro/30"
  },
  AR: {
    label: "Arquivo Gerado",
    tooltip: "Arquivo magnético gerado, aguardando envio ao convênio",
    icon: FileText,
    className: "bg-amarelo-alerta/20 text-amarelo-alerta border-amarelo-alerta/30"
  },
  PC: {
    label: "Enviado ao Convênio",
    tooltip: "Lote enviado ao convênio e aguardando processamento",
    icon: Send,
    className: "bg-primary/20 text-primary border-primary/30"
  },
  FD: {
    label: "Fechado",
    tooltip: "Lote finalizado e fechado - não permite alterações",
    icon: Lock,
    className: "bg-verde-ativo/20 text-verde-ativo border-verde-ativo/30"
  }
};

// ===============================
// COMPONENTE BADGE DE STATUS
// ===============================

const LoteFaturamentoBadge = ({
  status
}: {
  status: LoteFaturamentoStatus;
}) => {
  const config = loteFaturamentoStatusConfig[status];
  const Icon = config.icon;
  return <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={cn("gap-1 cursor-help", config.className)}>
          <Icon className="h-3 w-3" />
          {status} - {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>;
};

// ===============================
// EVENTOS DO HISTÓRICO
// ===============================

interface HistoricoEvento {
  id: string;
  data: string;
  usuario: string;
  tipo: 'criacao' | 'guias_incluidas' | 'arquivo_gerado' | 'enviado_convenio' | 'fechamento' | 'glosa_identificada' | 'glosa_aceita' | 'glosa_reapresentada' | 'pendencia_identificada';
  descricao: string;
  detalhes?: string;
}
const eventoConfig: Record<HistoricoEvento['tipo'], {
  icon: React.ComponentType<{
    className?: string;
  }>;
  color: string;
}> = {
  criacao: {
    icon: CheckCircle2,
    color: "text-verde-ativo"
  },
  guias_incluidas: {
    icon: FileText,
    color: "text-azul-claro"
  },
  arquivo_gerado: {
    icon: FileText,
    color: "text-amarelo-alerta"
  },
  enviado_convenio: {
    icon: Send,
    color: "text-primary"
  },
  fechamento: {
    icon: Lock,
    color: "text-verde-ativo"
  },
  glosa_identificada: {
    icon: AlertCircle,
    color: "text-destructive"
  },
  glosa_aceita: {
    icon: CheckCircle2,
    color: "text-muted-foreground"
  },
  glosa_reapresentada: {
    icon: History,
    color: "text-primary"
  },
  pendencia_identificada: {
    icon: AlertCircle,
    color: "text-amarelo-alerta"
  }
};

// ===============================
// DADOS MOCK
// ===============================

const convenios = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Porto Seguro", "Hapvida", "NotreDame"];
interface LoteFaturamento {
  id: number;
  codigo: string;
  convenio: string;
  dataAtendimentoInicio: string;
  dataAtendimentoFim: string;
  dataGeracao: string;
  sequenciaLote: string;
  dataEnvioLote: string | null;
  status: LoteFaturamentoStatus;
  qtdGuias: number;
  valorTotal: number;
  historico: HistoricoEvento[];
}
const mockLotes: LoteFaturamento[] = [{
  id: 1,
  codigo: "FAT-2024-0001",
  convenio: "Unimed",
  dataAtendimentoInicio: "2024-01-01",
  dataAtendimentoFim: "2024-01-15",
  dataGeracao: "2024-01-16",
  sequenciaLote: "001/2024",
  dataEnvioLote: "2024-01-17",
  status: "FD",
  qtdGuias: 45,
  valorTotal: 12580.50,
  historico: [{
    id: "1",
    data: "2024-01-16 08:00",
    usuario: "Maria Silva",
    tipo: "criacao",
    descricao: "Lote de faturamento criado"
  }, {
    id: "2",
    data: "2024-01-16 08:15",
    usuario: "Maria Silva",
    tipo: "guias_incluidas",
    descricao: "45 guias incluídas no lote"
  }, {
    id: "3",
    data: "2024-01-16 10:00",
    usuario: "Sistema",
    tipo: "arquivo_gerado",
    descricao: "Arquivo TISS gerado com sucesso"
  }, {
    id: "4",
    data: "2024-01-17 09:00",
    usuario: "João Santos",
    tipo: "enviado_convenio",
    descricao: "Lote enviado ao convênio Unimed"
  }, {
    id: "5",
    data: "2024-01-20 14:00",
    usuario: "Sistema",
    tipo: "fechamento",
    descricao: "Lote fechado após confirmação do convênio"
  }]
}, {
  id: 2,
  codigo: "FAT-2024-0002",
  convenio: "Bradesco Saúde",
  dataAtendimentoInicio: "2024-01-01",
  dataAtendimentoFim: "2024-01-15",
  dataGeracao: "2024-01-16",
  sequenciaLote: "001/2024",
  dataEnvioLote: "2024-01-18",
  status: "PC",
  qtdGuias: 32,
  valorTotal: 8450.00,
  historico: [{
    id: "1",
    data: "2024-01-16 09:00",
    usuario: "Ana Costa",
    tipo: "criacao",
    descricao: "Lote de faturamento criado"
  }, {
    id: "2",
    data: "2024-01-16 09:30",
    usuario: "Ana Costa",
    tipo: "guias_incluidas",
    descricao: "32 guias incluídas no lote"
  }, {
    id: "3",
    data: "2024-01-17 11:00",
    usuario: "Sistema",
    tipo: "arquivo_gerado",
    descricao: "Arquivo XML gerado"
  }, {
    id: "4",
    data: "2024-01-18 08:00",
    usuario: "Pedro Lima",
    tipo: "enviado_convenio",
    descricao: "Lote enviado ao Bradesco Saúde"
  }, {
    id: "5",
    data: "2024-01-22 10:00",
    usuario: "Sistema",
    tipo: "glosa_identificada",
    descricao: "2 itens glosados identificados",
    detalhes: "Procedimentos duplicados"
  }]
}, {
  id: 3,
  codigo: "FAT-2024-0003",
  convenio: "SulAmérica",
  dataAtendimentoInicio: "2024-01-10",
  dataAtendimentoFim: "2024-01-20",
  dataGeracao: "2024-01-21",
  sequenciaLote: "002/2024",
  dataEnvioLote: null,
  status: "AR",
  qtdGuias: 28,
  valorTotal: 6320.75,
  historico: [{
    id: "1",
    data: "2024-01-21 08:00",
    usuario: "Carla Dias",
    tipo: "criacao",
    descricao: "Lote de faturamento criado"
  }, {
    id: "2",
    data: "2024-01-21 08:45",
    usuario: "Carla Dias",
    tipo: "guias_incluidas",
    descricao: "28 guias incluídas no lote"
  }, {
    id: "3",
    data: "2024-01-21 14:00",
    usuario: "Sistema",
    tipo: "pendencia_identificada",
    descricao: "1 guia com pendência",
    detalhes: "CID não preenchido"
  }, {
    id: "4",
    data: "2024-01-22 09:00",
    usuario: "Sistema",
    tipo: "arquivo_gerado",
    descricao: "Arquivo TISS gerado"
  }]
}, {
  id: 4,
  codigo: "FAT-2024-0004",
  convenio: "Amil",
  dataAtendimentoInicio: "2024-01-15",
  dataAtendimentoFim: "2024-01-25",
  dataGeracao: "2024-01-26",
  sequenciaLote: "001/2024",
  dataEnvioLote: null,
  status: "AB",
  qtdGuias: 15,
  valorTotal: 3890.00,
  historico: [{
    id: "1",
    data: "2024-01-26 10:00",
    usuario: "Roberto Lima",
    tipo: "criacao",
    descricao: "Lote de faturamento criado"
  }, {
    id: "2",
    data: "2024-01-26 10:30",
    usuario: "Roberto Lima",
    tipo: "guias_incluidas",
    descricao: "15 guias incluídas no lote"
  }]
}, {
  id: 5,
  codigo: "FAT-2024-0005",
  convenio: "Unimed",
  dataAtendimentoInicio: "2024-01-16",
  dataAtendimentoFim: "2024-01-31",
  dataGeracao: "2024-02-01",
  sequenciaLote: "002/2024",
  dataEnvioLote: null,
  status: "AB",
  qtdGuias: 52,
  valorTotal: 14250.25,
  historico: [{
    id: "1",
    data: "2024-02-01 08:00",
    usuario: "Fernanda Dias",
    tipo: "criacao",
    descricao: "Lote de faturamento criado"
  }, {
    id: "2",
    data: "2024-02-01 09:00",
    usuario: "Fernanda Dias",
    tipo: "guias_incluidas",
    descricao: "52 guias incluídas no lote"
  }, {
    id: "3",
    data: "2024-02-01 10:00",
    usuario: "Sistema",
    tipo: "glosa_identificada",
    descricao: "3 itens com glosa total identificados"
  }]
}];

// ===============================
// COMPONENTE PRINCIPAL
// ===============================

const ListagemFaturamentoGuias = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Filters state
  const [filterDataGeracaoInicio, setFilterDataGeracaoInicio] = useState("");
  const [filterDataGeracaoFim, setFilterDataGeracaoFim] = useState("");
  const [filterConvenio, setFilterConvenio] = useState("");
  const [filterNumeroFatura, setFilterNumeroFatura] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // UI state
  const [hasFiltered, setHasFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lotes, setLotes] = useState(mockLotes);

  // Sheet state
  const [selectedLote, setSelectedLote] = useState<LoteFaturamento | null>(null);
  const [showHistoricoSheet, setShowHistoricoSheet] = useState(false);
  const handleFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHasFiltered(true);
      setIsLoading(false);
      toast({
        title: "Filtro aplicado",
        description: `Exibindo ${lotes.length} lotes de faturamento.`
      });
    }, 500);
  };
  const clearFilters = () => {
    setFilterDataGeracaoInicio("");
    setFilterDataGeracaoFim("");
    setFilterConvenio("");
    setFilterNumeroFatura("");
    setFilterStatus("");
    setHasFiltered(false);
  };
  const handleViewHistorico = (lote: LoteFaturamento) => {
    setSelectedLote(lote);
    setShowHistoricoSheet(true);
  };
  const handlePrint = (lote: LoteFaturamento) => {
    toast({
      title: "Imprimindo...",
      description: `Gerando impressão do lote ${lote.codigo}`
    });
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  return <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          

          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">Listagem de Faturamento de Guias</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Consulta e acompanhamento de lotes de faturamento
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
                  <p className="text-xs text-muted-foreground">Localize lotes de faturamento por período, convênio ou situação</p>
                </div>
              </div>

              {/* Filters */}
              <div className="p-5 border-b border-border/50 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Data Geração (Inicial)
                    </Label>
                    <Input type="date" value={filterDataGeracaoInicio} onChange={e => setFilterDataGeracaoInicio(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Data Geração (Final)
                    </Label>
                    <Input type="date" value={filterDataGeracaoFim} onChange={e => setFilterDataGeracaoFim(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Convênio
                    </Label>
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
                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Número da Fatura
                    </Label>
                    <Input placeholder="Ex: FAT-2024-0001" value={filterNumeroFatura} onChange={e => setFilterNumeroFatura(e.target.value)} className="h-9 bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Situação
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="AB">Aberto (AB)</SelectItem>
                        <SelectItem value="AR">Arquivo Gerado (AR)</SelectItem>
                        <SelectItem value="PC">Enviado ao Convênio (PC)</SelectItem>
                        <SelectItem value="FD">Fechado (FD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between p-4 bg-muted/10">
                <p className="text-xs text-muted-foreground">
                  {hasFiltered ? `${lotes.length} lote(s) encontrado(s)` : "Aplique os filtros para buscar lotes"}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                  <Button size="sm" onClick={handleFilter} disabled={isLoading} className="gap-1.5">
                    <Search className="h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Código</TableHead>
                    <TableHead className="font-semibold">Convênio</TableHead>
                    <TableHead className="font-semibold">Atendimento (Início/Fim)</TableHead>
                    <TableHead className="font-semibold">Data Geração</TableHead>
                    <TableHead className="font-semibold">Seq. Lote</TableHead>
                    <TableHead className="font-semibold">Data Envio</TableHead>
                    <TableHead className="font-semibold">Qtd Guias</TableHead>
                    <TableHead className="font-semibold text-right">Valor Total</TableHead>
                    <TableHead className="font-semibold">Situação</TableHead>
                    <TableHead className="font-semibold text-center w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? Array(5).fill(0).map((_, i) => <TableRow key={i}>
                        <TableCell colSpan={10}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      </TableRow>) : lotes.map(lote => <TableRow key={lote.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-primary">{lote.codigo}</TableCell>
                      <TableCell>{lote.convenio}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(lote.dataAtendimentoInicio)} - {formatDate(lote.dataAtendimentoFim)}
                      </TableCell>
                      <TableCell>{formatDate(lote.dataGeracao)}</TableCell>
                      <TableCell className="font-mono text-sm">{lote.sequenciaLote}</TableCell>
                      <TableCell>
                        {lote.dataEnvioLote ? formatDate(lote.dataEnvioLote) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell className="text-center">{lote.qtdGuias}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(lote.valorTotal)}
                      </TableCell>
                      <TableCell>
                        <LoteFaturamentoBadge status={lote.status} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => navigate(`/faturamento/listagem-faturamento/${lote.id}`)} className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" />
                              Visualizar Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewHistorico(lote)} className="gap-2 cursor-pointer">
                              <History className="h-4 w-4" />
                              Histórico
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrint(lote)} className="gap-2 cursor-pointer">
                              <Printer className="h-4 w-4" />
                              Imprimir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>

              {/* Status Legend */}
              <div className="border-t border-border/50 bg-muted/10 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Legenda de Situações:</p>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(loteFaturamentoStatusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return <div key={key} className="flex items-center gap-1.5 text-xs">
                        <Badge className={cn("gap-1 text-[10px] px-1.5 py-0", config.className)}>
                          <Icon className="h-2.5 w-2.5" />
                          {key}
                        </Badge>
                        <span className="text-muted-foreground">{config.label}</span>
                      </div>;
                })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Histórico Sheet */}
      <Sheet open={showHistoricoSheet} onOpenChange={setShowHistoricoSheet}>
        <SheetContent className="w-[450px] sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Histórico do Lote
            </SheetTitle>
            <SheetDescription>
              {selectedLote && <span className="font-medium text-foreground">{selectedLote.codigo}</span>} — Linha do tempo de eventos
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-4" />

          <ScrollArea className="h-[calc(100vh-180px)]">
            {selectedLote && <div className="relative pl-6">
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

                {/* Timeline Events */}
                <div className="space-y-6">
                  {selectedLote.historico.map((evento, index) => {
                const config = eventoConfig[evento.tipo];
                const Icon = config.icon;
                return <div key={evento.id} className="relative">
                        {/* Timeline Dot */}
                        <div className={cn("absolute -left-6 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center", config.color === "text-verde-ativo" && "border-verde-ativo", config.color === "text-azul-claro" && "border-azul-claro", config.color === "text-amarelo-alerta" && "border-amarelo-alerta", config.color === "text-primary" && "border-primary", config.color === "text-destructive" && "border-destructive", config.color === "text-muted-foreground" && "border-muted-foreground")}>
                          <div className={cn("w-2 h-2 rounded-full", config.color === "text-verde-ativo" && "bg-verde-ativo", config.color === "text-azul-claro" && "bg-azul-claro", config.color === "text-amarelo-alerta" && "bg-amarelo-alerta", config.color === "text-primary" && "bg-primary", config.color === "text-destructive" && "bg-destructive", config.color === "text-muted-foreground" && "bg-muted-foreground")} />
                        </div>

                        {/* Event Content */}
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                          <div className="flex items-start gap-2">
                            <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{evento.descricao}</p>
                              {evento.detalhes && <p className="text-xs text-muted-foreground mt-1">{evento.detalhes}</p>}
                              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                                <span>{evento.data}</span>
                                <span>•</span>
                                <span>{evento.usuario}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>;
              })}
                </div>
              </div>}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>;
};
export default ListagemFaturamentoGuias;
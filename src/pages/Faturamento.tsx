import { useState } from "react";
import { ArrowLeft, FileText, Plus, Filter, X, ChevronDown, ChevronUp, Search, CheckCircle2, Download, Lock, FileArchive, Info, Send, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FaturaBadge, type FaturaStatus } from "@/components/faturamento/StatusBadge";
import { FaturamentoTimeline, type TimelineEvent, createFaturaTimelineEvent } from "@/components/faturamento/FaturamentoTimeline";

// Mock data for pre-faturas fechadas
const mockPreFaturas = [{
  id: 1,
  codigo: "PF-2024-002",
  convenio: "Unimed",
  dataFechamento: "2024-01-16",
  usuario: "João Santos",
  qtdGuias: 32,
  total: 8750.50,
  selected: true
}, {
  id: 2,
  codigo: "PF-2024-003",
  convenio: "Unimed",
  dataFechamento: "2024-01-15",
  usuario: "Ana Costa",
  qtdGuias: 28,
  total: 6200.00,
  selected: true
}, {
  id: 3,
  codigo: "PF-2024-006",
  convenio: "Unimed",
  dataFechamento: "2024-01-14",
  usuario: "Maria Silva",
  qtdGuias: 41,
  total: 11350.75,
  selected: true
}, {
  id: 4,
  codigo: "PF-2024-008",
  convenio: "Bradesco Saúde",
  dataFechamento: "2024-01-13",
  usuario: "Pedro Lima",
  qtdGuias: 19,
  total: 5420.00,
  selected: true
}, {
  id: 5,
  codigo: "PF-2024-009",
  convenio: "SulAmérica",
  dataFechamento: "2024-01-12",
  usuario: "Carla Dias",
  qtdGuias: 25,
  total: 7890.25,
  selected: true
}];
const convenios = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Porto Seguro", "Hapvida", "NotreDame"];
interface Fatura {
  codigo: string;
  convenio: string;
  dataCriacao: string;
  dataFechamento: string | null;
  dataEnvio: string | null;
  qtdPreLotes: number;
  qtdGuias: number;
  total: number;
  status: FaturaStatus;
  timeline: TimelineEvent[];
}
const Faturamento = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // States
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [filterConvenio, setFilterConvenio] = useState<string>("all");
  const [filterDataInicio, setFilterDataInicio] = useState<string>("");
  const [filterDataFim, setFilterDataFim] = useState<string>("");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [preFaturas, setPreFaturas] = useState(mockPreFaturas);
  const [faturaGerada, setFaturaGerada] = useState<Fatura | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
  const [showTimelineSheet, setShowTimelineSheet] = useState(false);

  // Computed values
  const selectedPreFaturas = preFaturas.filter(pf => pf.selected);
  const totalGuias = selectedPreFaturas.reduce((acc, pf) => acc + pf.qtdGuias, 0);
  const totalValor = selectedPreFaturas.reduce((acc, pf) => acc + pf.total, 0);

  // Handlers
  const handleFilter = () => {
    setHasFiltered(true);
    let filtered = [...mockPreFaturas];
    if (filterConvenio && filterConvenio !== "all") {
      filtered = filtered.filter(pf => pf.convenio === filterConvenio);
    }
    if (filterDataInicio) {
      filtered = filtered.filter(pf => pf.dataFechamento >= filterDataInicio);
    }
    if (filterDataFim) {
      filtered = filtered.filter(pf => pf.dataFechamento <= filterDataFim);
    }
    setPreFaturas(filtered);
  };
  const clearFilters = () => {
    setFilterConvenio("all");
    setFilterDataInicio("");
    setFilterDataFim("");
    setHasFiltered(false);
    setPreFaturas(mockPreFaturas);
    setFaturaGerada(null);
  };
  const handleSelectAll = (checked: boolean) => {
    setPreFaturas(preFaturas.map(pf => ({
      ...pf,
      selected: checked
    })));
  };
  const handlePreFaturaSelect = (id: number, checked: boolean) => {
    setPreFaturas(preFaturas.map(pf => pf.id === id ? {
      ...pf,
      selected: checked
    } : pf));
  };
  const handleGerarFatura = () => {
    if (selectedPreFaturas.length === 0) {
      toast({
        title: "Nenhuma pré-fatura selecionada",
        description: "Selecione ao menos uma pré-fatura para gerar a fatura.",
        variant: "destructive"
      });
      return;
    }
    const now = new Date().toISOString();
    const novaFatura: Fatura = {
      codigo: `FAT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      convenio: selectedPreFaturas[0].convenio,
      dataCriacao: now,
      dataFechamento: null,
      dataEnvio: null,
      qtdPreLotes: selectedPreFaturas.length,
      qtdGuias: totalGuias,
      total: totalValor,
      status: "aberto",
      timeline: [createFaturaTimelineEvent("fatura_gerada", "Sistema", `Fatura gerada a partir de ${selectedPreFaturas.length} pré-lote(s)`)]
    };
    setFaturaGerada(novaFatura);
    setShowSuccessModal(true);
  };
  const handleFecharFatura = () => {
    setShowCloseConfirmModal(true);
  };
  const confirmFecharFatura = () => {
    if (faturaGerada) {
      const now = new Date().toISOString();
      setFaturaGerada({
        ...faturaGerada,
        status: "fechado",
        dataFechamento: now,
        timeline: [...faturaGerada.timeline, createFaturaTimelineEvent("fatura_fechada", "Usuário", "Fatura fechada e pronta para geração de arquivo magnético")]
      });
      setShowCloseConfirmModal(false);
      toast({
        title: "Fatura fechada com sucesso",
        description: "Agora você pode gerar o arquivo magnético."
      });
    }
  };
  const handleGerarArquivoMagnetico = () => {
    if (faturaGerada && faturaGerada.status === "fechado") {
      setFaturaGerada({
        ...faturaGerada,
        status: "arquivo_gerado",
        timeline: [...faturaGerada.timeline, createFaturaTimelineEvent("arquivo_gerado", "Sistema", "Arquivo XML TISS gerado com sucesso")]
      });
      toast({
        title: "Arquivo magnético gerado",
        description: "O arquivo foi gerado e está pronto para download."
      });
    }
  };
  const handleEnviarConvenio = () => {
    if (faturaGerada && faturaGerada.status === "arquivo_gerado") {
      const now = new Date().toISOString();
      setFaturaGerada({
        ...faturaGerada,
        status: "enviado",
        dataEnvio: now,
        timeline: [...faturaGerada.timeline, createFaturaTimelineEvent("fatura_enviada", "Sistema", `Enviada para ${faturaGerada.convenio}`)]
      });
      toast({
        title: "Fatura enviada",
        description: `Fatura enviada para ${faturaGerada.convenio} com sucesso.`
      });
    }
  };
  const handleNovaFatura = () => {
    clearFilters();
  };
  return <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          

          {/* Page Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">Faturamento</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Geração de faturas a partir de pré-faturas fechadas.
            </p>
          </div>

          {/* Info Card - Collapsible */}
          <Collapsible open={isInfoExpanded} onOpenChange={setIsInfoExpanded} className="mb-6 animate-fade-in">
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">Sobre o Faturamento</h3>
                    <p className="text-xs text-muted-foreground">Clique para {isInfoExpanded ? "recolher" : "expandir"} as informações</p>
                  </div>
                </div>
                {isInfoExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mt-4 mb-4">
                    A Fatura é utilizada para envio das guias atendidas e já conferidas ao convênio, 
                    documentada por meio físico ou magnético, respeitando as exigências do Convênio.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">O processo possui 4 etapas:</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 pl-2">
                      <li>Localização de pré-faturas fechadas</li>
                      <li>Criação de nova fatura</li>
                      <li>Fechamento da fatura</li>
                      <li>Geração de arquivo em meio magnético</li>
                    </ol>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Main Content - Only show if no fatura generated */}
          {!faturaGerada && <div className="space-y-6 animate-fade-in">
              {/* Pre-Faturas Card */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/50">
                  <h2 className="text-lg font-semibold text-foreground">Pré-Faturas Fechadas Disponíveis para Faturamento</h2>
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
                          {convenios.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Fechamento Inicial</Label>
                      <Input type="date" value={filterDataInicio} onChange={e => setFilterDataInicio(e.target.value)} className="h-9 bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Fechamento Final</Label>
                      <Input type="date" value={filterDataFim} onChange={e => setFilterDataFim(e.target.value)} className="h-9 bg-background" />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button size="sm" onClick={handleFilter} className="flex-1">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Table - Only show after filtering */}
                {hasFiltered && <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12">
                              <Checkbox checked={preFaturas.length > 0 && preFaturas.every(pf => pf.selected)} onCheckedChange={checked => handleSelectAll(!!checked)} />
                            </TableHead>
                            <TableHead className="font-semibold">Código do Pré-Lote</TableHead>
                            <TableHead className="font-semibold">Convênio</TableHead>
                            <TableHead className="font-semibold">Data Fechamento</TableHead>
                            <TableHead className="font-semibold">Usuário</TableHead>
                            <TableHead className="font-semibold text-center">Qtd. Guias</TableHead>
                            <TableHead className="font-semibold text-right">Total (R$)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preFaturas.map(pf => <TableRow key={pf.id} className={cn(pf.selected && "bg-primary/5")}>
                              <TableCell>
                                <Checkbox checked={pf.selected} onCheckedChange={checked => handlePreFaturaSelect(pf.id, !!checked)} />
                              </TableCell>
                              <TableCell className="font-medium text-primary">{pf.codigo}</TableCell>
                              <TableCell>{pf.convenio}</TableCell>
                              <TableCell>{new Date(pf.dataFechamento).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>{pf.usuario}</TableCell>
                              <TableCell className="text-center">{pf.qtdGuias}</TableCell>
                              <TableCell className="text-right font-medium">{pf.total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}</TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Empty state */}
                    {preFaturas.length === 0 && <div className="p-8 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma pré-fatura fechada encontrada para os filtros aplicados.</p>
                      </div>}
                  </>}

                {/* Initial state - before filter */}
                {!hasFiltered && <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-foreground mb-1">Localize as pré-faturas fechadas</p>
                    <p className="text-sm">Utilize os filtros acima para encontrar as pré-faturas disponíveis para faturamento.</p>
                  </div>}
              </div>

              {/* Actions Card - Only show when has selected items */}
              {hasFiltered && selectedPreFaturas.length > 0 && <div className="bg-card rounded-xl border border-border/50 shadow-sm p-5 animate-fade-in">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Summary */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Pré-faturas selecionadas</p>
                        <p className="text-xl font-bold text-foreground">{selectedPreFaturas.length}</p>
                      </div>
                      <div className="h-10 w-px bg-border hidden lg:block" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total de guias</p>
                        <p className="text-xl font-bold text-foreground">{totalGuias}</p>
                      </div>
                      <div className="h-10 w-px bg-border hidden lg:block" />
                      <div>
                        <p className="text-xs text-muted-foreground">Valor total</p>
                        <p className="text-xl font-bold text-verde-ativo">{totalValor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={clearFilters}>
                        Cancelar
                      </Button>
                      <Button onClick={handleGerarFatura}>
                        <Plus className="h-4 w-4 mr-2" />
                        Gerar Fatura (F6)
                      </Button>
                    </div>
                  </div>
                </div>}
            </div>}

          {/* Fatura Generated - Show fatura details */}
          {faturaGerada && <div className="space-y-6 animate-fade-in">
              {/* Fatura Details Card */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-verde-ativo/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-verde-ativo" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Fatura {faturaGerada.codigo}</h2>
                      <p className="text-sm text-muted-foreground">Detalhes da fatura gerada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaturaBadge status={faturaGerada.status} />
                    <Button variant="outline" size="sm" onClick={() => setShowTimelineSheet(true)}>
                      <History className="h-4 w-4 mr-2" />
                      Histórico
                    </Button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Código</p>
                      <p className="font-semibold text-foreground">{faturaGerada.codigo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Convênio</p>
                      <p className="font-semibold text-foreground">{faturaGerada.convenio}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Data Criação</p>
                      <p className="font-semibold text-foreground">{new Date(faturaGerada.dataCriacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Qtd. Pré-lotes</p>
                      <p className="font-semibold text-foreground">{faturaGerada.qtdPreLotes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Qtd. Guias</p>
                      <p className="font-semibold text-foreground">{faturaGerada.qtdGuias}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="font-semibold text-verde-ativo">{faturaGerada.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</p>
                    </div>
                  </div>

                  {faturaGerada.dataFechamento && <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-verde-ativo" />
                        <span className="text-muted-foreground">Fechada em:</span>
                        <span className="font-medium">{new Date(faturaGerada.dataFechamento).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>}

                  {faturaGerada.dataEnvio && <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Send className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Enviada em:</span>
                        <span className="font-medium">{new Date(faturaGerada.dataEnvio).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>}
                </div>

                {/* Actions */}
                <div className="p-5 border-t border-border/50 bg-muted/20 flex flex-wrap gap-3">
                  {faturaGerada.status === "aberto" && <Button onClick={handleFecharFatura}>
                      <Lock className="h-4 w-4 mr-2" />
                      Fechar Fatura
                    </Button>}
                  
                  {faturaGerada.status === "fechado" && <Button onClick={handleGerarArquivoMagnetico}>
                      <FileArchive className="h-4 w-4 mr-2" />
                      Gerar Arquivo Magnético
                    </Button>}

                  {faturaGerada.status === "arquivo_gerado" && <>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Arquivo
                      </Button>
                      <Button onClick={handleEnviarConvenio}>
                        <Send className="h-4 w-4 mr-2" />
                        Marcar como Enviada
                      </Button>
                    </>}

                  <Button variant="ghost" onClick={handleNovaFatura}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fatura
                  </Button>
                </div>
              </div>

              {/* Help text for next steps */}
              {faturaGerada.status === "aberto" && <div className="bg-amarelo-alerta/10 border border-amarelo-alerta/30 rounded-xl p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amarelo-alerta flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Próximo passo: Fechar a fatura</p>
                    <p className="text-sm text-muted-foreground">
                      Para gerar o arquivo magnético e enviar ao convênio, primeiro feche a fatura clicando no botão "Fechar Fatura".
                    </p>
                  </div>
                </div>}

              {faturaGerada.status === "fechado" && <div className="bg-verde-ativo/10 border border-verde-ativo/30 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-verde-ativo flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Fatura pronta para geração de arquivo</p>
                    <p className="text-sm text-muted-foreground">
                      Agora você pode gerar o arquivo magnético para envio ao convênio clicando no botão "Gerar Arquivo Magnético".
                    </p>
                  </div>
                </div>}

              {faturaGerada.status === "arquivo_gerado" && <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
                  <FileArchive className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Arquivo gerado com sucesso</p>
                    <p className="text-sm text-muted-foreground">
                      Baixe o arquivo e envie ao convênio. Após o envio, clique em "Marcar como Enviada" para registrar.
                    </p>
                  </div>
                </div>}

              {faturaGerada.status === "enviado" && <div className="bg-verde-ativo/10 border border-verde-ativo/30 rounded-xl p-4 flex items-start gap-3">
                  <Send className="h-5 w-5 text-verde-ativo flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Fatura enviada ao convênio</p>
                    <p className="text-sm text-muted-foreground">
                      A fatura foi marcada como enviada. Aguarde o retorno do convênio para dar continuidade ao processo.
                    </p>
                  </div>
                </div>}
            </div>}
        </main>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-verde-ativo" />
              Fatura criada com sucesso!
            </DialogTitle>
            <DialogDescription>
              A fatura <span className="font-semibold text-foreground">{faturaGerada?.codigo}</span> foi gerada com {faturaGerada?.qtdPreLotes} pré-lote(s) e {faturaGerada?.qtdGuias} guia(s).
              <br /><br />
              Agora realize o fechamento da fatura para disponibilizar o arquivo magnético.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
            setShowSuccessModal(false);
            handleFecharFatura();
          }}>
              <Lock className="h-4 w-4 mr-2" />
              Fechar Fatura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Modal */}
      <Dialog open={showCloseConfirmModal} onOpenChange={setShowCloseConfirmModal}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Confirmar fechamento da fatura?</DialogTitle>
            <DialogDescription>
              Após o fechamento, não será possível editar a fatura. As guias serão marcadas como faturadas e você poderá gerar o arquivo magnético para envio ao convênio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCloseConfirmModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmFecharFatura}>
              <Lock className="h-4 w-4 mr-2" />
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Sheet */}
      <Sheet open={showTimelineSheet} onOpenChange={setShowTimelineSheet}>
        <SheetContent className="bg-background border-border w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Histórico da Fatura</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {faturaGerada && <FaturamentoTimeline events={faturaGerada.timeline} title="Linha do Tempo" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>;
};
export default Faturamento;
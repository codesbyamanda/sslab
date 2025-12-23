import { useState } from "react";
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Search,
  CheckCircle2,
  Download,
  Lock,
  FileArchive,
  Info,
  Send,
  History
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FaturaBadge, type FaturaStatus } from "@/components/faturamento/StatusBadge";
import { FaturamentoTimeline, type TimelineEvent, createTimelineEvent } from "@/components/faturamento/FaturamentoTimeline";

// Mock data for pre-faturas fechadas
const mockPreFaturas = [
  { id: 1, codigo: "PF-2024-002", convenio: "Unimed", dataFechamento: "2024-01-16", usuario: "João Santos", qtdGuias: 32, total: 8750.50, selected: true },
  { id: 2, codigo: "PF-2024-003", convenio: "Unimed", dataFechamento: "2024-01-15", usuario: "Ana Costa", qtdGuias: 28, total: 6200.00, selected: true },
  { id: 3, codigo: "PF-2024-006", convenio: "Unimed", dataFechamento: "2024-01-14", usuario: "Maria Silva", qtdGuias: 41, total: 11350.75, selected: true },
  { id: 4, codigo: "PF-2024-008", convenio: "Bradesco Saúde", dataFechamento: "2024-01-13", usuario: "Pedro Lima", qtdGuias: 19, total: 5420.00, selected: true },
  { id: 5, codigo: "PF-2024-009", convenio: "SulAmérica", dataFechamento: "2024-01-12", usuario: "Carla Dias", qtdGuias: 25, total: 7890.25, selected: true },
];

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

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Serviços</span>
          </button>

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
          {!faturaGerada && (
            <div className="space-y-6 animate-fade-in">
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
                          {convenios.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Fechamento Inicial</Label>
                      <Input 
                        type="date" 
                        value={filterDataInicio}
                        onChange={(e) => setFilterDataInicio(e.target.value)}
                        className="h-9 bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Data Fechamento Final</Label>
                      <Input 
                        type="date" 
                        value={filterDataFim}
                        onChange={(e) => setFilterDataFim(e.target.value)}
                        className="h-9 bg-background"
                      />
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
                {hasFiltered && (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12">
                              <Checkbox 
                                checked={preFaturas.length > 0 && preFaturas.every(pf => pf.selected)}
                                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                              />
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
                          {preFaturas.map((pf) => (
                            <TableRow key={pf.id} className={cn(pf.selected && "bg-primary/5")}>
                              <TableCell>
                                <Checkbox 
                                  checked={pf.selected}
                                  onCheckedChange={(checked) => handlePreFaturaSelect(pf.id, !!checked)}
                                />
                              </TableCell>
                              <TableCell className="font-medium text-primary">{pf.codigo}</TableCell>
                              <TableCell>{pf.convenio}</TableCell>
                              <TableCell>{new Date(pf.dataFechamento).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>{pf.usuario}</TableCell>
                              <TableCell className="text-center">{pf.qtdGuias}</TableCell>
                              <TableCell className="text-right font-medium">{pf.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Empty state */}
                    {preFaturas.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma pré-fatura fechada encontrada para os filtros aplicados.</p>
                      </div>
                    )}
                  </>
                )}

                {/* Initial state - before filter */}
                {!hasFiltered && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-foreground mb-1">Localize as pré-faturas fechadas</p>
                    <p className="text-sm">Utilize os filtros acima para encontrar as pré-faturas disponíveis para faturamento.</p>
                  </div>
                )}
              </div>

              {/* Actions Card - Only show when has selected items */}
              {hasFiltered && selectedPreFaturas.length > 0 && (
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-5 animate-fade-in">
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
                        <p className="text-xl font-bold text-verde-ativo">{totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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
                </div>
              )}
            </div>
          )}

          {/* Fatura Generated - Show fatura details */}
          {faturaGerada && (
            <div className="space-y-6 animate-fade-in">
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
                  {getStatusBadge(faturaGerada.status)}
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
                      <p className="font-semibold text-verde-ativo">{faturaGerada.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                  </div>

                  {faturaGerada.dataFechamento && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-verde-ativo" />
                        <span className="text-muted-foreground">Fechada em:</span>
                        <span className="font-medium">{new Date(faturaGerada.dataFechamento).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-5 border-t border-border/50 bg-muted/20 flex flex-wrap gap-3">
                  {faturaGerada.status === "aberta" && (
                    <Button onClick={handleFecharFatura}>
                      <Lock className="h-4 w-4 mr-2" />
                      Fechar Fatura
                    </Button>
                  )}
                  
                  <Button 
                    variant={faturaGerada.status === "fechada" ? "default" : "outline"}
                    onClick={handleGerarArquivoMagnetico}
                    disabled={faturaGerada.status !== "fechada"}
                  >
                    <FileArchive className="h-4 w-4 mr-2" />
                    Gerar Arquivo Magnético
                  </Button>

                  <Button variant="ghost" onClick={handleNovaFatura}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fatura
                  </Button>
                </div>
              </div>

              {/* Help text for next steps */}
              {faturaGerada.status === "aberta" && (
                <div className="bg-amarelo-alerta/10 border border-amarelo-alerta/30 rounded-xl p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amarelo-alerta flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Próximo passo: Fechar a fatura</p>
                    <p className="text-sm text-muted-foreground">
                      Para gerar o arquivo magnético e enviar ao convênio, primeiro feche a fatura clicando no botão "Fechar Fatura".
                    </p>
                  </div>
                </div>
              )}

              {faturaGerada.status === "fechada" && (
                <div className="bg-verde-ativo/10 border border-verde-ativo/30 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-verde-ativo flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Fatura pronta para envio</p>
                    <p className="text-sm text-muted-foreground">
                      Agora você pode gerar o arquivo magnético para envio ao convênio clicando no botão "Gerar Arquivo Magnético".
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
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
            <Button onClick={() => { setShowSuccessModal(false); handleFecharFatura(); }}>
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
    </div>
  );
};

export default Faturamento;

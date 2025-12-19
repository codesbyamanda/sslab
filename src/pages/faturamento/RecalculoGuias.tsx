import { useState } from "react";
import { 
  ArrowLeft, 
  RefreshCcw, 
  Filter, 
  X, 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertTriangle,
  Info,
  History,
  Download,
  FileSpreadsheet,
  User,
  CalendarDays
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data for guias
const mockGuias = [
  { 
    id: 1, 
    codigo: "GUIA-2024-0001", 
    paciente: "José da Silva", 
    convenio: "Unimed", 
    plano: "Nacional",
    dataAtendimento: "2024-01-15", 
    valorAtual: 350.00, 
    status: "aberta", 
    motivoPendencia: null,
    ultimoRecalculo: null,
  },
  { 
    id: 2, 
    codigo: "GUIA-2024-0002", 
    paciente: "Maria Oliveira", 
    convenio: "Unimed", 
    plano: "Estadual",
    dataAtendimento: "2024-01-15", 
    valorAtual: 420.00, 
    status: "pendente", 
    motivoPendencia: "Valor do procedimento divergente da tabela",
    ultimoRecalculo: "2024-01-14 10:30",
  },
  { 
    id: 3, 
    codigo: "GUIA-2024-0003", 
    paciente: "Carlos Santos", 
    convenio: "Bradesco Saúde", 
    plano: "Empresarial",
    dataAtendimento: "2024-01-14", 
    valorAtual: 280.00, 
    status: "aberta", 
    motivoPendencia: null,
    ultimoRecalculo: null,
  },
  { 
    id: 4, 
    codigo: "GUIA-2024-0004", 
    paciente: "Ana Paula Costa", 
    convenio: "SulAmérica", 
    plano: "Especial",
    dataAtendimento: "2024-01-14", 
    valorAtual: 550.00, 
    status: "pendente", 
    motivoPendencia: "Diferença de valor identificada; Regra de cobertura desatualizada",
    ultimoRecalculo: "2024-01-13 14:20",
  },
  { 
    id: 5, 
    codigo: "GUIA-2024-0005", 
    paciente: "Roberto Lima", 
    convenio: "Amil", 
    plano: "Individual",
    dataAtendimento: "2024-01-13", 
    valorAtual: 190.00, 
    status: "cancelada", 
    motivoPendencia: null,
    ultimoRecalculo: null,
  },
  { 
    id: 6, 
    codigo: "GUIA-2024-0006", 
    paciente: "Fernanda Dias", 
    convenio: "Unimed", 
    plano: "Nacional",
    dataAtendimento: "2024-01-13", 
    valorAtual: 620.00, 
    status: "faturada", 
    motivoPendencia: null,
    ultimoRecalculo: "2024-01-12 09:00",
  },
  { 
    id: 7, 
    codigo: "GUIA-2024-0007", 
    paciente: "Lucas Mendes", 
    convenio: "Porto Seguro", 
    plano: "Completo",
    dataAtendimento: "2024-01-12", 
    valorAtual: 380.00, 
    status: "pendente", 
    motivoPendencia: "Glosa por procedimento duplicado",
    ultimoRecalculo: null,
  },
  { 
    id: 8, 
    codigo: "GUIA-2024-0008", 
    paciente: "Patricia Souza", 
    convenio: "Hapvida", 
    plano: "Básico",
    dataAtendimento: "2024-01-12", 
    valorAtual: 450.00, 
    status: "aberta", 
    motivoPendencia: null,
    ultimoRecalculo: "2024-01-11 16:45",
  },
];

const convenios = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Porto Seguro", "Hapvida", "NotreDame"];

type GuiaStatus = "aberta" | "pendente" | "cancelada" | "faturada";

interface RecalculoResult {
  guiaId: number;
  codigo: string;
  success: boolean;
  valorAnterior: number;
  valorNovo: number;
  novoStatus: GuiaStatus;
  mensagem: string;
}

const RecalculoGuias = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filters state
  const [filterConvenio, setFilterConvenio] = useState("");
  const [filterNumeroGuia, setFilterNumeroGuia] = useState("");
  const [filterPaciente, setFilterPaciente] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterSituacao, setFilterSituacao] = useState("todas");
  
  // UI state
  const [hasFiltered, setHasFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [guias, setGuias] = useState(mockGuias);
  const [selectedGuias, setSelectedGuias] = useState<number[]>([]);
  
  // Modals state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [recalculoResults, setRecalculoResults] = useState<RecalculoResult[]>([]);

  const handleFilter = () => {
    setIsLoading(true);
    setSelectedGuias([]);
    setTimeout(() => {
      setHasFiltered(true);
      setIsLoading(false);
      toast({
        title: "Busca realizada",
        description: `Exibindo ${guias.length} guias disponíveis para recalculo.`,
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
    setFilterSituacao("todas");
    setHasFiltered(false);
    setSelectedGuias([]);
  };

  const handleStatusToggle = (status: string) => {
    setFilterStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSelectGuia = (guiaId: number, checked: boolean) => {
    const guia = guias.find(g => g.id === guiaId);
    if (guia?.status === "cancelada") return;
    
    setSelectedGuias(prev => 
      checked 
        ? [...prev, guiaId]
        : prev.filter(id => id !== guiaId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableGuias = guias.filter(g => g.status !== "cancelada").map(g => g.id);
      setSelectedGuias(selectableGuias);
    } else {
      setSelectedGuias([]);
    }
  };

  const handleRecalcularClick = () => {
    if (selectedGuias.length === 0) {
      toast({
        title: "Nenhuma guia selecionada",
        description: "Selecione ao menos uma guia para recalcular.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmRecalculo = () => {
    setShowConfirmDialog(false);
    setIsRecalculating(true);
    
    // Simulate recalculation
    setTimeout(() => {
      const results: RecalculoResult[] = selectedGuias.map(guiaId => {
        const guia = guias.find(g => g.id === guiaId);
        if (!guia) return null;
        
        // Simulate random success/failure
        const success = Math.random() > 0.2;
        const valorNovo = success ? guia.valorAtual * (1 + (Math.random() * 0.1 - 0.05)) : guia.valorAtual;
        
        return {
          guiaId: guia.id,
          codigo: guia.codigo,
          success,
          valorAnterior: guia.valorAtual,
          valorNovo: Math.round(valorNovo * 100) / 100,
          novoStatus: success ? "aberta" as GuiaStatus : guia.status as GuiaStatus,
          mensagem: success 
            ? "Recalculado com sucesso" 
            : "Erro ao recalcular: regra de convênio não localizada"
        };
      }).filter(Boolean) as RecalculoResult[];

      // Update guias with new values
      const now = new Date().toLocaleString('pt-BR');
      setGuias(prev => prev.map(g => {
        const result = results.find(r => r.guiaId === g.id);
        if (result && result.success) {
          return {
            ...g,
            valorAtual: result.valorNovo,
            status: result.novoStatus,
            motivoPendencia: null,
            ultimoRecalculo: now,
          };
        }
        return g;
      }));

      setRecalculoResults(results);
      setIsRecalculating(false);
      setSelectedGuias([]);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (failCount > 0) {
        setShowResultsModal(true);
      } else {
        toast({
          title: "Recalculo realizado com sucesso",
          description: `${successCount} guia(s) recalculada(s) com sucesso.`,
        });
      }
    }, 2000);
  };

  const getStatusBadge = (status: GuiaStatus) => {
    switch (status) {
      case "aberta":
        return (
          <Badge className="bg-azul-claro/20 text-azul-escuro border-azul-claro/30 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Aberta
          </Badge>
        );
      case "pendente":
        return (
          <Badge className="bg-vermelho-moderno/20 text-vermelho-moderno border-vermelho-moderno/30 gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case "cancelada":
        return (
          <Badge className="bg-muted text-muted-foreground border-border gap-1">
            <XCircle className="h-3 w-3" />
            Cancelada
          </Badge>
        );
      case "faturada":
        return (
          <Badge className="bg-verde-ativo/20 text-verde-ativo border-verde-ativo/30 gap-1">
            <FileText className="h-3 w-3" />
            Faturada
          </Badge>
        );
    }
  };

  const selectedGuiasData = guias.filter(g => selectedGuias.includes(g.id));
  const totalSelecionado = selectedGuiasData.reduce((sum, g) => sum + g.valorAtual, 0);
  const conveniosSelecionados = [...new Set(selectedGuiasData.map(g => g.convenio))];

  const filteredGuias = guias;
  const selectableGuias = filteredGuias.filter(g => g.status !== "cancelada");
  const allSelected = selectableGuias.length > 0 && selectableGuias.every(g => selectedGuias.includes(g.id));
  const someSelected = selectedGuias.length > 0 && !allSelected;

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
            <h1 className="text-2xl font-bold text-foreground">Recalculo de Guias</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Reprocessamento de guias conforme regras do convênio
            </p>
            {/* Alert */}
            <Alert className="mt-3 bg-amarelo-alerta/10 border-amarelo-alerta/30">
              <AlertTriangle className="h-4 w-4 text-amarelo-alerta" />
              <AlertDescription className="text-sm text-muted-foreground">
                O recalculo pode alterar valores e status das guias selecionadas.
              </AlertDescription>
            </Alert>
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
                  <p className="text-xs text-muted-foreground">Localize guias para recalculo</p>
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
                        {convenios.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Número da Guia</Label>
                    <Input 
                      placeholder="Ex: GUIA-2024-0001" 
                      value={filterNumeroGuia}
                      onChange={(e) => setFilterNumeroGuia(e.target.value)}
                      className="h-9 bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Paciente</Label>
                    <Input 
                      placeholder="Nome do paciente" 
                      value={filterPaciente}
                      onChange={(e) => setFilterPaciente(e.target.value)}
                      className="h-9 bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Data Atendimento (Inicial)</Label>
                    <Input 
                      type="date" 
                      value={filterDataInicio}
                      onChange={(e) => setFilterDataInicio(e.target.value)}
                      className="h-9 bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Data Atendimento (Final)</Label>
                    <Input 
                      type="date" 
                      value={filterDataFim}
                      onChange={(e) => setFilterDataFim(e.target.value)}
                      className="h-9 bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Situação para Recalculo</Label>
                    <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="pendencia">Com pendência</SelectItem>
                        <SelectItem value="divergencia">Com divergência de valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground">Status da Guia</Label>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="status-aberta"
                          checked={filterStatus.includes("aberta")}
                          onCheckedChange={() => handleStatusToggle("aberta")}
                        />
                        <label htmlFor="status-aberta" className="text-sm text-foreground cursor-pointer">Aberta</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="status-pendente"
                          checked={filterStatus.includes("pendente")}
                          onCheckedChange={() => handleStatusToggle("pendente")}
                        />
                        <label htmlFor="status-pendente" className="text-sm text-foreground cursor-pointer">Pendente</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="status-faturada"
                          checked={filterStatus.includes("faturada")}
                          onCheckedChange={() => handleStatusToggle("faturada")}
                        />
                        <label htmlFor="status-faturada" className="text-sm text-foreground cursor-pointer">Faturada</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="status-cancelada"
                          checked={filterStatus.includes("cancelada")}
                          onCheckedChange={() => handleStatusToggle("cancelada")}
                        />
                        <label htmlFor="status-cancelada" className="text-sm text-foreground cursor-pointer">Cancelada</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar filtros
                  </Button>
                  <Button size="sm" onClick={handleFilter}>
                    <Filter className="h-4 w-4 mr-2" />
                    Buscar Guias
                  </Button>
                </div>
              </div>

              {/* Filter results count */}
              {hasFiltered && !isLoading && (
                <div className="px-5 py-3 bg-muted/10 border-b border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Exibindo <span className="font-medium text-foreground">{filteredGuias.length}</span> guias disponíveis para recalculo.
                  </p>
                </div>
              )}
            </div>

            {/* Selection Summary & Actions */}
            {selectedGuias.length > 0 && (
              <div className="bg-card rounded-xl border border-primary/30 shadow-sm animate-fade-in">
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <RefreshCcw className="h-5 w-5 text-primary" />
                        Resumo do Recalculo
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Guias selecionadas:</span>
                          <span className="font-semibold text-foreground">{selectedGuias.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Valor total atual:</span>
                          <span className="font-semibold text-foreground">
                            {totalSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        {conveniosSelecionados.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Convênio(s):</span>
                            <span className="font-medium text-foreground">{conveniosSelecionados.join(", ")}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-amarelo-alerta flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Os valores poderão ser alterados após o recalculo.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedGuias([])}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleRecalcularClick}
                        disabled={isRecalculating}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <RefreshCcw className={cn("h-4 w-4 mr-2", isRecalculating && "animate-spin")} />
                        {isRecalculating ? "Recalculando..." : "Recalcular Guias Selecionadas"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm">
              {/* Table Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Guias para Recalculo</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                ) : !hasFiltered ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Utilize os filtros acima</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Aplique os filtros para localizar as guias que deseja recalcular.
                    </p>
                  </div>
                ) : filteredGuias.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma guia encontrada</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Nenhuma guia encontrada com os filtros selecionados. Tente ajustar os critérios de busca.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            className={cn(someSelected && "data-[state=checked]:bg-primary/50")}
                          />
                        </TableHead>
                        <TableHead className="font-semibold">Código da Guia</TableHead>
                        <TableHead className="font-semibold">Paciente</TableHead>
                        <TableHead className="font-semibold">Convênio / Plano</TableHead>
                        <TableHead className="font-semibold">Data Atendimento</TableHead>
                        <TableHead className="font-semibold text-right">Valor Atual (R$)</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Pendência / Divergência</TableHead>
                        <TableHead className="font-semibold">Último Recalculo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuias.map((guia) => (
                        <TableRow 
                          key={guia.id} 
                          className={cn(
                            "group transition-colors",
                            guia.status === "cancelada" && "opacity-50",
                            guia.motivoPendencia && guia.status !== "cancelada" && "bg-vermelho-moderno/5",
                            selectedGuias.includes(guia.id) && "bg-primary/5"
                          )}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedGuias.includes(guia.id)}
                              onCheckedChange={(checked) => handleSelectGuia(guia.id, !!checked)}
                              disabled={guia.status === "cancelada"}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-primary">{guia.codigo}</TableCell>
                          <TableCell className="font-medium">{guia.paciente}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{guia.convenio}</span>
                              <span className="text-xs text-muted-foreground">{guia.plano}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(guia.dataAtendimento).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {guia.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell>{getStatusBadge(guia.status as GuiaStatus)}</TableCell>
                          <TableCell className="max-w-[200px]">
                            {guia.motivoPendencia ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 text-vermelho-moderno">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm truncate">{guia.motivoPendencia.split(";")[0]}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-background border-border">
                                  <p className="text-sm">{guia.motivoPendencia}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {guia.ultimoRecalculo ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{guia.ultimoRecalculo.split(" ")[0]}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-background border-border">
                                  <p className="text-sm">{guia.ultimoRecalculo}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-muted-foreground text-sm">Nunca recalculada</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              Confirmar Recalculo de Guias
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="flex flex-col gap-2 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quantidade de guias selecionadas:</span>
                  <span className="font-semibold text-foreground">{selectedGuias.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Convênio(s) envolvido(s):</span>
                  <span className="font-medium text-foreground">{conveniosSelecionados.join(", ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor total atual:</span>
                  <span className="font-semibold text-foreground">
                    {totalSelecionado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
              <Alert className="bg-amarelo-alerta/10 border-amarelo-alerta/30">
                <AlertTriangle className="h-4 w-4 text-amarelo-alerta" />
                <AlertDescription className="text-sm">
                  Esta ação irá reprocessar as guias conforme as regras atuais do convênio. 
                  Os valores e status poderão ser alterados.
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRecalculo}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Confirmar Recalculo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="bg-background border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Resultado do Recalculo
            </DialogTitle>
            <DialogDescription>
              Algumas guias não puderam ser recalculadas. Verifique os detalhes abaixo.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3">
              {recalculoResults.map((result) => (
                <div 
                  key={result.guiaId}
                  className={cn(
                    "p-4 rounded-lg border",
                    result.success 
                      ? "bg-verde-ativo/10 border-verde-ativo/30" 
                      : "bg-vermelho-moderno/10 border-vermelho-moderno/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle2 className="h-5 w-5 text-verde-ativo mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-vermelho-moderno mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{result.codigo}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{result.mensagem}</p>
                      </div>
                    </div>
                    {result.success && result.valorAnterior !== result.valorNovo && (
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground line-through">
                          {result.valorAnterior.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="font-semibold text-verde-ativo">
                          {result.valorNovo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowResultsModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecalculoGuias;

import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Save,
  FileText,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Eye,
  Download,
  Info,
  Calculator,
  History,
  Gavel,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  LotePreFaturamentoBadge, 
  GuiaBadge, 
  ItemGuiaBadge,
  type LotePreFaturamentoStatus,
  type GuiaStatus,
  type ItemGuiaStatus
} from "@/components/faturamento/StatusBadge";
import { 
  FaturamentoTimeline, 
  type TimelineEvent,
  createTimelineEvent 
} from "@/components/faturamento/FaturamentoTimeline";

interface Item {
  id: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  situacao: ItemGuiaStatus;
  motivoPendencia: string | null;
}

interface Guia {
  id: number;
  codigo: string;
  paciente: string;
  convenio: string;
  plano: string;
  dataAtendimento: string;
  valorTotal: number;
  status: GuiaStatus;
  motivoPendencia: string | null;
  selected: boolean;
  itens: Item[];
  timeline: TimelineEvent[];
}

interface Lote {
  id: string;
  codigo: string;
  convenio: string;
  periodoInicio: string;
  periodoFim: string;
  status: LotePreFaturamentoStatus;
  guias: Guia[];
  timeline: TimelineEvent[];
}

// Mock data
const mockLote: Lote = {
  id: "1",
  codigo: "PF-2024-001",
  convenio: "Unimed",
  periodoInicio: "2024-01-01",
  periodoFim: "2024-01-15",
  status: "transicao",
  timeline: [
    { id: "1", type: "lote_aberto", title: "Lote criado", timestamp: "15/01 09:00", user: "Maria Silva", origem: "usuario" },
    { id: "2", type: "item_incluido", title: "6 guias incluídas", timestamp: "15/01 09:15", user: "Maria Silva", origem: "usuario" },
    { id: "3", type: "guia_pendente", title: "2 guias com pendência identificadas", timestamp: "15/01 09:15", origem: "sistema" },
  ],
  guias: [
    {
      id: 1,
      codigo: "REQ-2024-0001",
      paciente: "José da Silva",
      convenio: "Unimed",
      plano: "Nacional",
      dataAtendimento: "2024-01-15",
      valorTotal: 850.00,
      status: "aberta",
      motivoPendencia: null,
      selected: false,
      timeline: [
        { id: "g1-1", type: "guia_criada", title: "Guia criada", timestamp: "15/01 08:00", user: "Sistema", origem: "sistema" },
        { id: "g1-2", type: "item_incluido", title: "Incluída no lote PF-2024-001", timestamp: "15/01 09:15", user: "Maria Silva", origem: "usuario" },
      ],
      itens: [
        { id: 1, codigo: "40304361", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, situacao: "aberto", motivoPendencia: null },
        { id: 2, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "aberto", motivoPendencia: null },
        { id: 3, codigo: "40301630", descricao: "Colesterol Total e Frações", quantidade: 1, valorUnitario: 120.00, valorTotal: 120.00, situacao: "aberto", motivoPendencia: null },
        { id: 4, codigo: "40316521", descricao: "TSH", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
        { id: 5, codigo: "40316530", descricao: "T4 Livre", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
      ]
    },
    {
      id: 2,
      codigo: "REQ-2024-0002",
      paciente: "Maria Oliveira",
      convenio: "Unimed",
      plano: "Estadual",
      dataAtendimento: "2024-01-15",
      valorTotal: 420.00,
      status: "pendente",
      motivoPendencia: "Código do CID não preenchido",
      selected: false,
      timeline: [
        { id: "g2-1", type: "guia_criada", title: "Guia criada", timestamp: "15/01 08:30", user: "Sistema", origem: "sistema" },
        { id: "g2-2", type: "guia_pendente", title: "Pendência identificada: CID não preenchido", timestamp: "15/01 09:15", origem: "sistema" },
      ],
      itens: [
        { id: 6, codigo: "40301630", descricao: "Colesterol Total e Frações", quantidade: 1, valorUnitario: 120.00, valorTotal: 120.00, situacao: "pendente", motivoPendencia: "Código do CID não preenchido" },
        { id: 7, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "aberto", motivoPendencia: null },
        { id: 8, codigo: "40304361", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, situacao: "aberto", motivoPendencia: null },
      ]
    },
    {
      id: 3,
      codigo: "REQ-2024-0003",
      paciente: "Carlos Santos",
      convenio: "Unimed",
      plano: "Nacional",
      dataAtendimento: "2024-01-14",
      valorTotal: 580.00,
      status: "aberta",
      motivoPendencia: null,
      selected: false,
      timeline: [
        { id: "g3-1", type: "guia_criada", title: "Guia criada", timestamp: "14/01 10:00", user: "Sistema", origem: "sistema" },
      ],
      itens: [
        { id: 9, codigo: "40316521", descricao: "TSH", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
        { id: 10, codigo: "40316530", descricao: "T4 Livre", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
        { id: 11, codigo: "40302229", descricao: "Ácido Úrico", quantidade: 1, valorUnitario: 30.00, valorTotal: 30.00, situacao: "aberto", motivoPendencia: null },
        { id: 12, codigo: "40302318", descricao: "Creatinina", quantidade: 1, valorUnitario: 28.00, valorTotal: 28.00, situacao: "aberto", motivoPendencia: null },
      ]
    },
    {
      id: 4,
      codigo: "REQ-2024-0004",
      paciente: "Ana Paula Costa",
      convenio: "Unimed",
      plano: "Empresarial",
      dataAtendimento: "2024-01-14",
      valorTotal: 950.00,
      status: "pendente",
      motivoPendencia: "Data da solicitação não informada; Número da carteira inválido",
      selected: false,
      timeline: [
        { id: "g4-1", type: "guia_criada", title: "Guia criada", timestamp: "14/01 11:00", user: "Sistema", origem: "sistema" },
        { id: "g4-2", type: "guia_pendente", title: "Múltiplas pendências identificadas", timestamp: "15/01 09:15", origem: "sistema" },
      ],
      itens: [
        { id: 13, codigo: "40304361", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, situacao: "pendente", motivoPendencia: "Data da solicitação não informada" },
        { id: 14, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 2, valorUnitario: 25.00, valorTotal: 50.00, situacao: "pendente", motivoPendencia: "Número da carteira inválido" },
        { id: 15, codigo: "40301630", descricao: "Colesterol Total e Frações", quantidade: 1, valorUnitario: 120.00, valorTotal: 120.00, situacao: "aberto", motivoPendencia: null },
      ]
    },
    {
      id: 5,
      codigo: "REQ-2024-0005",
      paciente: "Roberto Lima",
      convenio: "Unimed",
      plano: "Nacional",
      dataAtendimento: "2024-01-13",
      valorTotal: 190.00,
      status: "cancelada",
      motivoPendencia: null,
      selected: false,
      timeline: [
        { id: "g5-1", type: "guia_criada", title: "Guia criada", timestamp: "13/01 14:00", user: "Sistema", origem: "sistema" },
        { id: "g5-2", type: "item_removido", title: "Guia cancelada pelo usuário", timestamp: "14/01 08:00", user: "João Santos", origem: "usuario" },
      ],
      itens: [
        { id: 16, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "cancelado", motivoPendencia: null },
        { id: 17, codigo: "40304361", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, situacao: "cancelado", motivoPendencia: null },
      ]
    },
    {
      id: 6,
      codigo: "REQ-2024-0006",
      paciente: "Fernanda Dias",
      convenio: "Unimed",
      plano: "Estadual",
      dataAtendimento: "2024-01-13",
      valorTotal: 620.00,
      status: "aberta",
      motivoPendencia: null,
      selected: false,
      timeline: [
        { id: "g6-1", type: "guia_criada", title: "Guia criada", timestamp: "13/01 15:00", user: "Sistema", origem: "sistema" },
      ],
      itens: [
        { id: 18, codigo: "40316521", descricao: "TSH", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
        { id: 19, codigo: "40316530", descricao: "T4 Livre", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "aberto", motivoPendencia: null },
        { id: 20, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "aberto", motivoPendencia: null },
      ]
    },
    // Adicionar guia com itens glosados para demonstrar fluxo completo
    {
      id: 7,
      codigo: "REQ-2024-0007",
      paciente: "Paulo Mendes",
      convenio: "Unimed",
      plano: "Empresarial",
      dataAtendimento: "2024-01-12",
      valorTotal: 245.00,
      status: "aberta",
      motivoPendencia: null,
      selected: false,
      timeline: [
        { id: "g7-1", type: "guia_criada", title: "Guia criada", timestamp: "12/01 09:00", user: "Sistema", origem: "sistema" },
        { id: "g7-2", type: "glosa_identificada", title: "Glosa identificada no retorno", timestamp: "20/01 14:00", origem: "sistema" },
        { id: "g7-3", type: "glosa_tratada", title: "Recurso de glosa enviado", timestamp: "21/01 10:00", user: "Ana Costa", origem: "usuario" },
      ],
      itens: [
        { id: 21, codigo: "40304361", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, situacao: "recebido", motivoPendencia: null },
        { id: 22, codigo: "40302504", descricao: "Glicemia de Jejum", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "glosado", motivoPendencia: "Procedimento não autorizado na guia" },
        { id: 23, codigo: "40301630", descricao: "Colesterol Total e Frações", quantidade: 1, valorUnitario: 120.00, valorTotal: 120.00, situacao: "reapresentado", motivoPendencia: null },
        { id: 24, codigo: "40316521", descricao: "TSH", quantidade: 1, valorUnitario: 85.00, valorTotal: 85.00, situacao: "glosa_acatada", motivoPendencia: "Glosa aceita - sem cobertura" },
      ]
    },
  ]
};

const PreFaturamentoLoteDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  // State
  const [lote, setLote] = useState<Lote>(mockLote);
  const [expandedGuias, setExpandedGuias] = useState<Set<number>>(new Set());
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedGuiaForTimeline, setSelectedGuiaForTimeline] = useState<Guia | null>(null);

  // Computed values
  const selectedGuias = useMemo(() => lote.guias.filter(g => g.selected), [lote.guias]);
  const pendentesCount = useMemo(() => lote.guias.filter(g => g.status === "pendente").length, [lote.guias]);
  const canceladasCount = useMemo(() => lote.guias.filter(g => g.status === "cancelada").length, [lote.guias]);
  const totalLote = useMemo(() => lote.guias.filter(g => g.status !== "cancelada").reduce((sum, g) => sum + g.valorTotal, 0), [lote.guias]);
  const hasPendencias = pendentesCount > 0;
  
  // Contagem de itens por status
  const itemStatusCounts = useMemo(() => {
    const counts: Record<ItemGuiaStatus, number> = {
      aberto: 0, pendente: 0, pre_faturado: 0, em_faturamento: 0,
      recebido: 0, glosado: 0, glosa_acatada: 0, reapresentado: 0,
      em_refaturamento: 0, cancelado: 0
    };
    lote.guias.forEach(g => {
      g.itens.forEach(item => {
        counts[item.situacao]++;
      });
    });
    return counts;
  }, [lote.guias]);

  // Toggle expand
  const toggleExpand = (guiaId: number) => {
    setExpandedGuias(prev => {
      const next = new Set(prev);
      if (next.has(guiaId)) {
        next.delete(guiaId);
      } else {
        next.add(guiaId);
      }
      return next;
    });
  };

  // Select handlers
  const handleGuiaSelect = (guiaId: number, checked: boolean) => {
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => g.id === guiaId ? { ...g, selected: checked } : g)
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => ({ ...g, selected: checked }))
    }));
  };

  // Inline editing handlers
  const handleItemQuantityChange = (guiaId: number, itemId: number, value: string) => {
    const qty = parseInt(value) || 0;
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => {
        if (g.id !== guiaId) return g;
        const updatedItens = g.itens.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            quantidade: qty,
            valorTotal: qty * item.valorUnitario
          };
        });
        const newTotal = updatedItens.reduce((sum, item) => sum + item.valorTotal, 0);
        return { ...g, itens: updatedItens, valorTotal: newTotal };
      })
    }));
    setHasChanges(true);
  };

  const handleItemValueChange = (guiaId: number, itemId: number, value: string) => {
    const val = parseFloat(value) || 0;
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => {
        if (g.id !== guiaId) return g;
        const updatedItens = g.itens.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            valorUnitario: val,
            valorTotal: val * item.quantidade
          };
        });
        const newTotal = updatedItens.reduce((sum, item) => sum + item.valorTotal, 0);
        return { ...g, itens: updatedItens, valorTotal: newTotal };
      })
    }));
    setHasChanges(true);
  };

  const handleRemoveItem = (guiaId: number, itemId: number) => {
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => {
        if (g.id !== guiaId) return g;
        const updatedItens = g.itens.filter(item => item.id !== itemId);
        const newTotal = updatedItens.reduce((sum, item) => sum + item.valorTotal, 0);
        return { 
          ...g, 
          itens: updatedItens, 
          valorTotal: newTotal,
          timeline: [...g.timeline, createTimelineEvent("item_removido", "Item removido da guia", { user: "Usuário Atual" })]
        };
      }),
      timeline: [...prev.timeline, createTimelineEvent("item_removido", `Item removido da guia`, { user: "Usuário Atual" })]
    }));
    setHasChanges(true);
    toast({
      title: "Item removido",
      description: "O item foi removido da guia.",
    });
  };

  const handleCorrectItem = (guiaId: number, itemId: number) => {
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => {
        if (g.id !== guiaId) return g;
        const updatedItens = g.itens.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, situacao: "aberto" as ItemGuiaStatus, motivoPendencia: null };
        });
        const hasPending = updatedItens.some(item => item.situacao === "pendente");
        return { 
          ...g, 
          itens: updatedItens,
          status: hasPending ? "pendente" : "aberta" as GuiaStatus,
          motivoPendencia: hasPending ? g.motivoPendencia : null,
          timeline: [...g.timeline, createTimelineEvent("item_corrigido", "Pendência do item corrigida", { user: "Usuário Atual" })]
        };
      }),
      timeline: [...prev.timeline, createTimelineEvent("item_corrigido", "Pendência corrigida", { user: "Usuário Atual" })]
    }));
    setHasChanges(true);
    toast({
      title: "Item corrigido",
      description: "A pendência do item foi removida.",
    });
  };

  const handleTratarGlosa = (guiaId: number, itemId: number) => {
    toast({
      title: "Tratar Glosa",
      description: "Abrindo tela de tratamento de glosa...",
    });
  };

  const handleReapresentar = (guiaId: number, itemId: number) => {
    setLote(prev => ({
      ...prev,
      guias: prev.guias.map(g => {
        if (g.id !== guiaId) return g;
        const updatedItens = g.itens.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, situacao: "reapresentado" as ItemGuiaStatus, motivoPendencia: null };
        });
        return { 
          ...g, 
          itens: updatedItens,
          timeline: [...g.timeline, createTimelineEvent("item_reapresentado", "Item reapresentado ao convênio", { user: "Usuário Atual" })]
        };
      }),
      timeline: [...prev.timeline, createTimelineEvent("item_reapresentado", "Item reapresentado", { user: "Usuário Atual" })]
    }));
    setHasChanges(true);
    toast({
      title: "Item reapresentado",
      description: "O item foi marcado para reapresentação.",
    });
  };

  // Actions
  const handleSave = () => {
    setHasChanges(false);
    setLote(prev => ({
      ...prev,
      timeline: [...prev.timeline, createTimelineEvent("alteracao", "Alterações salvas no lote", { user: "Usuário Atual" })]
    }));
    toast({
      title: "Alterações salvas",
      description: "As alterações do lote foram salvas com sucesso.",
    });
  };

  const handleRemoveSelected = () => {
    if (selectedGuias.length === 0) {
      toast({
        title: "Nenhuma guia selecionada",
        description: "Selecione ao menos uma guia para remover.",
        variant: "destructive",
      });
      return;
    }
    setShowRemoveAlert(true);
  };

  const confirmRemoveSelected = () => {
    const count = selectedGuias.length;
    setLote(prev => ({
      ...prev,
      guias: prev.guias.filter(g => !g.selected),
      timeline: [...prev.timeline, createTimelineEvent("item_removido", `${count} guia(s) removida(s) do lote`, { user: "Usuário Atual" })]
    }));
    setShowRemoveAlert(false);
    setHasChanges(true);
    toast({
      title: "Guias removidas",
      description: `${count} guia(s) removida(s) do lote.`,
    });
  };

  const handleCancelUnexecuted = () => {
    setLote(prev => ({
      ...prev,
      timeline: [...prev.timeline, createTimelineEvent("item_removido", "Itens não executados cancelados", { user: "Usuário Atual" })]
    }));
    toast({
      title: "Itens cancelados",
      description: "Os itens não executados foram cancelados.",
    });
    setHasChanges(true);
  };

  const handleViewReport = () => {
    toast({
      title: "Relatório de conferência",
      description: "Abrindo relatório de conferência do lote...",
    });
  };

  const handleCloseLote = () => {
    if (hasPendencias) {
      setShowCloseAlert(true);
    } else {
      confirmCloseLote();
    }
  };

  const confirmCloseLote = () => {
    setLote(prev => ({ 
      ...prev, 
      status: "fechado",
      timeline: [...prev.timeline, createTimelineEvent("lote_fechado", "Lote fechado para faturamento", { user: "Usuário Atual" })]
    }));
    setShowCloseAlert(false);
    toast({
      title: "Lote fechado",
      description: "O lote foi fechado e está disponível para faturamento.",
    });
  };

  // Get action buttons for item based on status
  const getItemActions = (guia: Guia, item: Item) => {
    const actions: React.ReactNode[] = [];
    
    if (item.situacao === "pendente" && lote.status === "transicao") {
      actions.push(
        <Tooltip key="corrigir">
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
              onClick={() => handleCorrectItem(guia.id, item.id)}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Corrigir pendência</TooltipContent>
        </Tooltip>
      );
    }
    
    if (item.situacao === "glosado") {
      actions.push(
        <Tooltip key="tratar">
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-warning hover:text-warning hover:bg-warning/10"
              onClick={() => handleTratarGlosa(guia.id, item.id)}
            >
              <Gavel className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tratar Glosa</TooltipContent>
        </Tooltip>,
        <Tooltip key="reapresentar">
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => handleReapresentar(guia.id, item.id)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reapresentar</TooltipContent>
        </Tooltip>
      );
    }
    
    if (lote.status === "transicao" && !["recebido", "glosa_acatada", "cancelado"].includes(item.situacao)) {
      actions.push(
        <Tooltip key="remover">
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveItem(guia.id, item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Excluir item</TooltipContent>
        </Tooltip>
      );
    }
    
    return actions;
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-gradient-services">
        <FaturamentoSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <FaturamentoNavbar />
          
          <main className="flex-1 p-6 overflow-auto pb-32">
            {/* Breadcrumb */}
            <button 
              onClick={() => navigate("/faturamento/pre-faturamento")}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Pré-Faturamento</span>
            </button>

            {/* Header */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-5 mb-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-xl font-bold text-foreground">{lote.codigo}</h1>
                      <LotePreFaturamentoBadge status={lote.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span><strong>Convênio:</strong> {lote.convenio}</span>
                      <span className="hidden sm:inline">•</span>
                      <span><strong>Período:</strong> {new Date(lote.periodoInicio).toLocaleDateString('pt-BR')} a {new Date(lote.periodoFim).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Timeline Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <History className="h-4 w-4" />
                        Histórico
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[450px]">
                      <SheetHeader>
                        <SheetTitle>Histórico do Lote</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FaturamentoTimeline events={lote.timeline} title="" maxHeight="calc(100vh - 150px)" />
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button 
                          onClick={handleCloseLote}
                          disabled={lote.status !== "transicao"}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Fechar Lote
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {hasPendencias && lote.status === "transicao" && (
                      <TooltipContent>
                        <p>Existem {pendentesCount} guia(s) com pendências</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{lote.guias.length}</p>
                    <p className="text-xs text-muted-foreground">Total de Guias</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pendentesCount}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{canceladasCount}</p>
                    <p className="text-xs text-muted-foreground">Canceladas</p>
                  </div>
                </div>
              </div>
              
              {itemStatusCounts.glosado > 0 && (
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{itemStatusCounts.glosado}</p>
                      <p className="text-xs text-muted-foreground">Itens Glosados</p>
                    </div>
                  </div>
                </div>
              )}
              
              {itemStatusCounts.recebido > 0 && (
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{itemStatusCounts.recebido}</p>
                      <p className="text-xs text-muted-foreground">Itens Recebidos</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{totalLote.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-xs text-muted-foreground">Total do Lote</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/30">
                      <TableHead className="w-10">
                        <Checkbox 
                          checked={lote.guias.length > 0 && lote.guias.every(g => g.selected)}
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="font-semibold">Nº Requisição/Guia</TableHead>
                      <TableHead className="font-semibold">Paciente</TableHead>
                      <TableHead className="font-semibold">Convênio / Plano</TableHead>
                      <TableHead className="font-semibold">Data Atendimento</TableHead>
                      <TableHead className="font-semibold text-right">Valor Total</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                      <TableHead className="font-semibold">Motivo Pendência</TableHead>
                      <TableHead className="font-semibold text-center w-16">Histórico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lote.guias.map((guia) => (
                      <>
                        {/* Main Row */}
                        <TableRow 
                          key={guia.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            guia.selected && "bg-primary/5",
                            guia.status === "pendente" && "bg-warning/5",
                            guia.status === "cancelada" && "opacity-60"
                          )}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={guia.selected}
                              onCheckedChange={(checked) => handleGuiaSelect(guia.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell onClick={() => toggleExpand(guia.id)}>
                            <button className="p-1 hover:bg-muted rounded transition-colors">
                              {expandedGuias.has(guia.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell className="font-medium text-primary" onClick={() => toggleExpand(guia.id)}>
                            {guia.codigo}
                          </TableCell>
                          <TableCell onClick={() => toggleExpand(guia.id)}>{guia.paciente}</TableCell>
                          <TableCell onClick={() => toggleExpand(guia.id)}>
                            <span className="text-foreground">{guia.convenio}</span>
                            <span className="text-muted-foreground"> / {guia.plano}</span>
                          </TableCell>
                          <TableCell onClick={() => toggleExpand(guia.id)}>
                            {new Date(guia.dataAtendimento).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right font-medium" onClick={() => toggleExpand(guia.id)}>
                            {guia.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell className="text-center" onClick={() => toggleExpand(guia.id)}>
                            <GuiaBadge status={guia.status} />
                          </TableCell>
                          <TableCell onClick={() => toggleExpand(guia.id)}>
                            {guia.motivoPendencia && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-sm text-warning truncate max-w-[200px] block">
                                    {guia.motivoPendencia.length > 30 
                                      ? `${guia.motivoPendencia.slice(0, 30)}...` 
                                      : guia.motivoPendencia}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                  <p>{guia.motivoPendencia}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <History className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-[400px] sm:w-[450px]">
                                <SheetHeader>
                                  <SheetTitle>Histórico da Guia {guia.codigo}</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                  <FaturamentoTimeline events={guia.timeline} title="" maxHeight="calc(100vh - 150px)" />
                                </div>
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Sub-table */}
                        {expandedGuias.has(guia.id) && (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="p-0 bg-muted/20">
                              <div className="p-4 pl-14">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Itens da Guia</h4>
                                <div className="bg-background rounded-lg border border-border overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="hover:bg-transparent bg-muted/50">
                                        <TableHead className="text-xs font-semibold">Código</TableHead>
                                        <TableHead className="text-xs font-semibold">Descrição</TableHead>
                                        <TableHead className="text-xs font-semibold text-center w-24">Quantidade</TableHead>
                                        <TableHead className="text-xs font-semibold text-right w-32">Valor Unitário</TableHead>
                                        <TableHead className="text-xs font-semibold text-right w-32">Valor Total</TableHead>
                                        <TableHead className="text-xs font-semibold text-center w-32">Situação</TableHead>
                                        <TableHead className="text-xs font-semibold">Motivo Pendência</TableHead>
                                        <TableHead className="text-xs font-semibold text-center w-28">Ações</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {guia.itens.map((item) => (
                                        <TableRow 
                                          key={item.id}
                                          className={cn(
                                            item.situacao === "pendente" && "bg-warning/5",
                                            item.situacao === "glosado" && "bg-destructive/5",
                                            item.situacao === "cancelado" && "opacity-60",
                                            item.situacao === "recebido" && "bg-success/5"
                                          )}
                                        >
                                          <TableCell className="text-sm font-medium text-muted-foreground">
                                            {item.codigo}
                                          </TableCell>
                                          <TableCell className="text-sm">{item.descricao}</TableCell>
                                          <TableCell className="text-center">
                                            <Input
                                              type="number"
                                              min="0"
                                              value={item.quantidade}
                                              onChange={(e) => handleItemQuantityChange(guia.id, item.id, e.target.value)}
                                              className="h-8 w-16 text-center text-sm mx-auto"
                                              disabled={lote.status !== "transicao" || ["recebido", "glosa_acatada", "cancelado"].includes(item.situacao)}
                                            />
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <Input
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={item.valorUnitario}
                                              onChange={(e) => handleItemValueChange(guia.id, item.id, e.target.value)}
                                              className="h-8 w-24 text-right text-sm ml-auto"
                                              disabled={lote.status !== "transicao" || ["recebido", "glosa_acatada", "cancelado"].includes(item.situacao)}
                                            />
                                          </TableCell>
                                          <TableCell className="text-right text-sm font-medium">
                                            {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <ItemGuiaBadge status={item.situacao} />
                                          </TableCell>
                                          <TableCell>
                                            {item.motivoPendencia && (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <span className={cn(
                                                    "text-xs truncate max-w-[150px] block",
                                                    item.situacao === "glosado" ? "text-destructive" : "text-warning"
                                                  )}>
                                                    {item.motivoPendencia.length > 25 
                                                      ? `${item.motivoPendencia.slice(0, 25)}...` 
                                                      : item.motivoPendencia}
                                                  </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="left">
                                                  <p>{item.motivoPendencia}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex items-center justify-center gap-1">
                                              {getItemActions(guia, item)}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty state */}
              {lote.guias.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma guia no lote.</p>
                </div>
              )}
            </div>
          </main>

          {/* Fixed Action Bar */}
          <div className="fixed bottom-0 left-64 right-0 bg-card border-t border-border shadow-lg z-10">
            <div className="flex items-center justify-between gap-4 p-4">
              {/* Left side - Selection info */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{selectedGuias.length}</strong> guia(s) selecionada(s)
                </span>
                {selectedGuias.length > 0 && (
                  <>
                    <span className="h-4 w-px bg-border" />
                    <span className="text-muted-foreground">
                      Total selecionado: <strong className="text-foreground">
                        {selectedGuias.reduce((sum, g) => sum + g.valorTotal, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                    </span>
                  </>
                )}
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewReport}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Relatório de Conferência
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelUnexecuted}
                  disabled={lote.status !== "transicao"}
                  className="gap-2"
                >
                  <Ban className="h-4 w-4" />
                  Cancelar Não Executados
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={selectedGuias.length === 0 || lote.status !== "transicao"}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover Selecionadas
                </Button>

                <span className="h-6 w-px bg-border" />
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/faturamento/pre-faturamento")}
                >
                  Cancelar
                </Button>
                
                <Button 
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges || lote.status !== "transicao"}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Remove Alert */}
        <AlertDialog open={showRemoveAlert} onOpenChange={setShowRemoveAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover guias selecionadas?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a remover {selectedGuias.length} guia(s) do lote. 
                Esta ação pode ser revertida adicionando as guias novamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Close Alert */}
        <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Fechar lote com pendências?</AlertDialogTitle>
              <AlertDialogDescription>
                Existem {pendentesCount} guia(s) com pendências no lote. 
                Deseja fechar o lote mesmo assim?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCloseLote}>
                Fechar mesmo assim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default PreFaturamentoLoteDetalhe;

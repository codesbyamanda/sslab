import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Building2,
  CalendarDays,
  Clock,
  DollarSign,
  Send,
  Lock,
  ChevronDown,
  ChevronRight,
  History,
  CheckCircle2,
  AlertCircle,
  User,
  Hash,
} from "lucide-react";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ===============================
// TIPOS E STATUS
// ===============================

type FaturaStatus = "AB" | "AR" | "PC" | "FD";
type GuiaStatus = "aberto" | "pendente" | "pre_faturado" | "faturado" | "recebido" | "glosa_parcial" | "glosa_total" | "glosa_acatada" | "reapresentada";
type ItemStatus = "AB" | "PD" | "PF" | "FT" | "RC" | "GP" | "GT" | "GA" | "RA" | "CN";

interface FaturaStatusConfig {
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const faturaStatusConfig: Record<FaturaStatus, FaturaStatusConfig> = {
  AB: { 
    label: "Aberto", 
    tooltip: "Fatura aberta para edição",
    icon: Clock,
    className: "bg-azul-claro/20 text-azul-escuro border-azul-claro/30"
  },
  AR: { 
    label: "Arquivo Gerado", 
    tooltip: "Arquivo magnético gerado, aguardando envio",
    icon: FileText,
    className: "bg-amarelo-alerta/20 text-amarelo-alerta border-amarelo-alerta/30"
  },
  PC: { 
    label: "Enviado ao Convênio", 
    tooltip: "Lote enviado e aguardando processamento",
    icon: Send,
    className: "bg-primary/20 text-primary border-primary/30"
  },
  FD: { 
    label: "Fechado", 
    tooltip: "Lote finalizado - não permite alterações",
    icon: Lock,
    className: "bg-verde-ativo/20 text-verde-ativo border-verde-ativo/30"
  },
};

const guiaStatusConfig: Record<GuiaStatus, { label: string; className: string }> = {
  aberto: { label: "Aberto", className: "bg-muted text-muted-foreground" },
  pendente: { label: "Pendente", className: "bg-amarelo-alerta/20 text-amarelo-alerta" },
  pre_faturado: { label: "Pré-Faturado", className: "bg-azul-claro/20 text-azul-escuro" },
  faturado: { label: "Faturado", className: "bg-primary/20 text-primary" },
  recebido: { label: "Recebido", className: "bg-verde-ativo/20 text-verde-ativo" },
  glosa_parcial: { label: "Glosa Parcial", className: "bg-amarelo-alerta/20 text-amarelo-alerta" },
  glosa_total: { label: "Glosa Total", className: "bg-destructive/20 text-destructive" },
  glosa_acatada: { label: "Glosa Acatada", className: "bg-muted text-muted-foreground" },
  reapresentada: { label: "Reapresentada", className: "bg-primary/20 text-primary" },
};

const itemStatusConfig: Record<ItemStatus, { label: string; className: string }> = {
  AB: { label: "Aberto", className: "bg-muted text-muted-foreground" },
  PD: { label: "Pendente", className: "bg-amarelo-alerta/20 text-amarelo-alerta" },
  PF: { label: "Pré-Faturado", className: "bg-azul-claro/20 text-azul-escuro" },
  FT: { label: "Faturado", className: "bg-primary/20 text-primary" },
  RC: { label: "Recebido", className: "bg-verde-ativo/20 text-verde-ativo" },
  GP: { label: "Glosa Parcial", className: "bg-amarelo-alerta/20 text-amarelo-alerta" },
  GT: { label: "Glosa Total", className: "bg-destructive/20 text-destructive" },
  GA: { label: "Glosa Acatada", className: "bg-muted text-muted-foreground" },
  RA: { label: "Reapresentada", className: "bg-primary/20 text-primary" },
  CN: { label: "Cancelado", className: "bg-destructive/10 text-destructive" },
};

// ===============================
// INTERFACES
// ===============================

interface ItemGuia {
  id: number;
  codigoProcedimento: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  status: ItemStatus;
}

interface Guia {
  id: number;
  numeroGuia: string;
  paciente: string;
  convenio: string;
  plano: string;
  dataAtendimento: string;
  qtdItens: number;
  valorTotal: number;
  status: GuiaStatus;
  itens: ItemGuia[];
}

interface HistoricoEvento {
  id: string;
  data: string;
  usuario: string;
  tipo: 'criacao' | 'guias_incluidas' | 'arquivo_gerado' | 'enviado_convenio' | 'fechamento' | 'glosa_identificada';
  descricao: string;
  detalhes?: string;
}

interface Fatura {
  id: number;
  codigo: string;
  convenio: string;
  periodoAtendimentoInicio: string;
  periodoAtendimentoFim: string;
  dataGeracao: string;
  dataEnvioConvenio: string | null;
  status: FaturaStatus;
  qtdGuias: number;
  valorTotal: number;
  guias: Guia[];
  historico: HistoricoEvento[];
}

// ===============================
// DADOS MOCK
// ===============================

const mockFatura: Fatura = {
  id: 1,
  codigo: "FAT-2024-0001",
  convenio: "Unimed",
  periodoAtendimentoInicio: "2024-01-01",
  periodoAtendimentoFim: "2024-01-15",
  dataGeracao: "2024-01-16",
  dataEnvioConvenio: "2024-01-17",
  status: "FD",
  qtdGuias: 45,
  valorTotal: 12580.50,
  guias: [
    {
      id: 1,
      numeroGuia: "G-2024-00001",
      paciente: "Maria Santos",
      convenio: "Unimed",
      plano: "Unimed Nacional",
      dataAtendimento: "2024-01-02",
      qtdItens: 3,
      valorTotal: 450.00,
      status: "recebido",
      itens: [
        { id: 1, codigoProcedimento: "40301630", descricao: "Hemograma completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, status: "RC" },
        { id: 2, codigoProcedimento: "40302040", descricao: "Glicose sérica", quantidade: 1, valorUnitario: 15.00, valorTotal: 15.00, status: "RC" },
        { id: 3, codigoProcedimento: "40316521", descricao: "Ureia sérica", quantidade: 1, valorUnitario: 18.00, valorTotal: 18.00, status: "RC" },
      ]
    },
    {
      id: 2,
      numeroGuia: "G-2024-00002",
      paciente: "João Oliveira",
      convenio: "Unimed",
      plano: "Unimed Nacional",
      dataAtendimento: "2024-01-03",
      qtdItens: 5,
      valorTotal: 890.50,
      status: "glosa_parcial",
      itens: [
        { id: 4, codigoProcedimento: "40301630", descricao: "Hemograma completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, status: "RC" },
        { id: 5, codigoProcedimento: "40302270", descricao: "Colesterol total", quantidade: 1, valorUnitario: 20.00, valorTotal: 20.00, status: "GP" },
        { id: 6, codigoProcedimento: "40302580", descricao: "TSH ultra-sensível", quantidade: 1, valorUnitario: 45.00, valorTotal: 45.00, status: "RC" },
        { id: 7, codigoProcedimento: "40302890", descricao: "T4 livre", quantidade: 1, valorUnitario: 42.00, valorTotal: 42.00, status: "RC" },
        { id: 8, codigoProcedimento: "40301770", descricao: "Creatinina", quantidade: 1, valorUnitario: 18.00, valorTotal: 18.00, status: "RC" },
      ]
    },
    {
      id: 3,
      numeroGuia: "G-2024-00003",
      paciente: "Ana Costa",
      convenio: "Unimed",
      plano: "Unimed Especial",
      dataAtendimento: "2024-01-05",
      qtdItens: 2,
      valorTotal: 320.00,
      status: "recebido",
      itens: [
        { id: 9, codigoProcedimento: "40301630", descricao: "Hemograma completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, status: "RC" },
        { id: 10, codigoProcedimento: "40304361", descricao: "PCR quantitativo", quantidade: 1, valorUnitario: 35.00, valorTotal: 35.00, status: "RC" },
      ]
    },
    {
      id: 4,
      numeroGuia: "G-2024-00004",
      paciente: "Carlos Pereira",
      convenio: "Unimed",
      plano: "Unimed Nacional",
      dataAtendimento: "2024-01-08",
      qtdItens: 4,
      valorTotal: 520.00,
      status: "faturado",
      itens: [
        { id: 11, codigoProcedimento: "40301630", descricao: "Hemograma completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, status: "FT" },
        { id: 12, codigoProcedimento: "40302040", descricao: "Glicose sérica", quantidade: 1, valorUnitario: 15.00, valorTotal: 15.00, status: "FT" },
        { id: 13, codigoProcedimento: "40316521", descricao: "Ureia sérica", quantidade: 1, valorUnitario: 18.00, valorTotal: 18.00, status: "FT" },
        { id: 14, codigoProcedimento: "40301770", descricao: "Creatinina", quantidade: 1, valorUnitario: 18.00, valorTotal: 18.00, status: "FT" },
      ]
    },
  ],
  historico: [
    { id: "1", data: "2024-01-16 08:00", usuario: "Maria Silva", tipo: "criacao", descricao: "Fatura criada" },
    { id: "2", data: "2024-01-16 08:15", usuario: "Maria Silva", tipo: "guias_incluidas", descricao: "45 guias incluídas na fatura" },
    { id: "3", data: "2024-01-16 10:00", usuario: "Sistema", tipo: "arquivo_gerado", descricao: "Arquivo TISS gerado com sucesso" },
    { id: "4", data: "2024-01-17 09:00", usuario: "João Santos", tipo: "enviado_convenio", descricao: "Fatura enviada ao convênio Unimed" },
    { id: "5", data: "2024-01-20 14:00", usuario: "Sistema", tipo: "fechamento", descricao: "Fatura fechada após confirmação do convênio" },
  ]
};

const eventoConfig: Record<HistoricoEvento['tipo'], { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  criacao: { icon: CheckCircle2, color: "text-verde-ativo" },
  guias_incluidas: { icon: FileText, color: "text-azul-claro" },
  arquivo_gerado: { icon: FileText, color: "text-amarelo-alerta" },
  enviado_convenio: { icon: Send, color: "text-primary" },
  fechamento: { icon: Lock, color: "text-verde-ativo" },
  glosa_identificada: { icon: AlertCircle, color: "text-destructive" },
};

// ===============================
// COMPONENTES AUXILIARES
// ===============================

const FaturaBadge = ({ status }: { status: FaturaStatus }) => {
  const config = faturaStatusConfig[status];
  const Icon = config.icon;
  
  return (
    <Tooltip>
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
    </Tooltip>
  );
};

const GuiaBadge = ({ status }: { status: GuiaStatus }) => {
  const config = guiaStatusConfig[status];
  return (
    <Badge className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
};

const ItemBadge = ({ status }: { status: ItemStatus }) => {
  const config = itemStatusConfig[status];
  return (
    <Badge className={cn("text-[10px] px-1.5 py-0", config.className)}>
      {status} - {config.label}
    </Badge>
  );
};

// ===============================
// COMPONENTE PRINCIPAL
// ===============================

const FaturaVisualizacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedGuias, setExpandedGuias] = useState<number[]>([]);

  // Em produção, buscar a fatura pelo ID
  const fatura = mockFatura;

  const toggleGuia = (guiaId: number) => {
    setExpandedGuias(prev => 
      prev.includes(guiaId) 
        ? prev.filter(id => id !== guiaId)
        : [...prev, guiaId]
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <FaturamentoSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <FaturamentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Botão Voltar */}
          <button 
            onClick={() => navigate("/faturamento/listagem-faturamento")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Listagem de Faturamento</span>
          </button>

          {/* Cabeçalho da Fatura */}
          <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 mb-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{fatura.codigo}</h1>
                    <p className="text-sm text-muted-foreground">Visualização da Fatura</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Convênio</p>
                      <p className="font-medium">{fatura.convenio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Período</p>
                      <p className="font-medium">{formatDate(fatura.periodoAtendimentoInicio)} - {formatDate(fatura.periodoAtendimentoFim)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data Geração</p>
                      <p className="font-medium">{formatDate(fatura.dataGeracao)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Total</p>
                      <p className="font-medium text-primary">{formatCurrency(fatura.valorTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <FaturaBadge status={fatura.status} />
                {fatura.dataEnvioConvenio && (
                  <p className="text-xs text-muted-foreground">
                    Enviado em: {formatDate(fatura.dataEnvioConvenio)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Quantidade de Guias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{fatura.qtdGuias}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{formatCurrency(fatura.valorTotal)}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Situação Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FaturaBadge status={fatura.status} />
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Send className="h-3 w-3" />
                  Envio ao Convênio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fatura.dataEnvioConvenio ? (
                  <p className="text-lg font-medium text-foreground">{formatDate(fatura.dataEnvioConvenio)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Não enviado</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Guias */}
          <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden mb-6 animate-fade-in">
            <div className="p-4 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Guias da Fatura
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Clique em uma guia para visualizar os itens
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="font-semibold">Nº Guia</TableHead>
                  <TableHead className="font-semibold">Paciente</TableHead>
                  <TableHead className="font-semibold">Convênio / Plano</TableHead>
                  <TableHead className="font-semibold">Data Atendimento</TableHead>
                  <TableHead className="font-semibold text-center">Qtd Itens</TableHead>
                  <TableHead className="font-semibold text-right">Valor Total</TableHead>
                  <TableHead className="font-semibold">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fatura.guias.map((guia) => (
                  <Collapsible
                    key={guia.id}
                    open={expandedGuias.includes(guia.id)}
                    onOpenChange={() => toggleGuia(guia.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <TableRow 
                        className={cn(
                          "cursor-pointer hover:bg-muted/20 transition-colors",
                          expandedGuias.includes(guia.id) && "bg-muted/10"
                        )}
                      >
                        <TableCell>
                          {expandedGuias.includes(guia.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-primary">{guia.numeroGuia}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {guia.paciente}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{guia.convenio}</p>
                            <p className="text-xs text-muted-foreground">{guia.plano}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(guia.dataAtendimento)}</TableCell>
                        <TableCell className="text-center">{guia.qtdItens}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(guia.valorTotal)}</TableCell>
                        <TableCell>
                          <GuiaBadge status={guia.status} />
                        </TableCell>
                      </TableRow>
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-muted/5 hover:bg-muted/5">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 border-t border-border/30">
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Hash className="h-4 w-4 text-primary" />
                              Itens da Guia
                            </h4>
                            <div className="bg-background rounded-lg border border-border/50 overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                                    <TableHead className="text-xs font-semibold">Código</TableHead>
                                    <TableHead className="text-xs font-semibold">Descrição</TableHead>
                                    <TableHead className="text-xs font-semibold text-center">Qtd</TableHead>
                                    <TableHead className="text-xs font-semibold text-right">Valor Unit.</TableHead>
                                    <TableHead className="text-xs font-semibold text-right">Valor Total</TableHead>
                                    <TableHead className="text-xs font-semibold">Situação</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {guia.itens.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/10">
                                      <TableCell className="font-mono text-xs">{item.codigoProcedimento}</TableCell>
                                      <TableCell className="text-sm">{item.descricao}</TableCell>
                                      <TableCell className="text-center">{item.quantidade}</TableCell>
                                      <TableCell className="text-right text-sm">{formatCurrency(item.valorUnitario)}</TableCell>
                                      <TableCell className="text-right font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                                      <TableCell>
                                        <ItemBadge status={item.status} />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>

            {/* Legenda de Status das Guias */}
            <div className="border-t border-border/50 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Legenda - Situação da Guia:</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(guiaStatusConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <Badge className={cn("text-[10px] px-1.5 py-0", config.className)}>
                      {config.label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico da Fatura
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Linha do tempo de eventos
              </p>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="p-4">
                <div className="relative pl-6">
                  {/* Timeline Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

                  {/* Timeline Events */}
                  <div className="space-y-4">
                    {fatura.historico.map((evento) => {
                      const config = eventoConfig[evento.tipo];
                      const Icon = config.icon;
                      
                      return (
                        <div key={evento.id} className="relative">
                          {/* Timeline Dot */}
                          <div className={cn(
                            "absolute -left-6 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center",
                            config.color === "text-verde-ativo" && "border-verde-ativo",
                            config.color === "text-azul-claro" && "border-azul-claro",
                            config.color === "text-amarelo-alerta" && "border-amarelo-alerta",
                            config.color === "text-primary" && "border-primary",
                            config.color === "text-destructive" && "border-destructive"
                          )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              config.color === "text-verde-ativo" && "bg-verde-ativo",
                              config.color === "text-azul-claro" && "bg-azul-claro",
                              config.color === "text-amarelo-alerta" && "bg-amarelo-alerta",
                              config.color === "text-primary" && "bg-primary",
                              config.color === "text-destructive" && "bg-destructive"
                            )} />
                          </div>

                          {/* Event Content */}
                          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                            <div className="flex items-start gap-2">
                              <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{evento.descricao}</p>
                                {evento.detalhes && (
                                  <p className="text-xs text-muted-foreground mt-1">{evento.detalhes}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                                  <span>{evento.data}</span>
                                  <span>•</span>
                                  <span>{evento.usuario}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FaturaVisualizacao;

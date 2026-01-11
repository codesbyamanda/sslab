import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  TestTube2,
  FlaskConical,
  Clock,
  AlertTriangle,
  FileText,
  AlertCircle,
  Syringe,
  Check,
  Truck,
  Package,
  ClipboardCheck,
  Play,
  Pause,
  RotateCcw,
  Ban,
  AlertOctagon,
  CheckCircle2,
  Settings,
  User,
  Thermometer,
} from "lucide-react";

// Status de condição da amostra (condição física)
type StatusCondicao = "normal" | "nao_localizada" | "acidentada" | "inadequada" | "insuficiente" | "descartada";

// Situação do processo/fluxo operacional
type SituacaoProcesso = "aberta" | "executada" | "liberada" | "cancelada" | "nao_executada";

interface AmostraDetalhe {
  id: string;
  numeroAmostra: string;
  paciente: string;
  dataHoraColeta: string;
  setorBancada: string;
  statusCondicao: StatusCondicao;
  situacaoProcesso: SituacaoProcesso;
  material: string;
  numeroRequisicao: string;
}

interface ExameVinculado {
  id: string;
  codigo: string;
  descricao: string;
  situacao: "pendente" | "em_analise" | "concluido" | "repetir";
  urgente: boolean;
  dataHoraProcessamento: string | null;
}

type EventoTipo = 
  | "coleta"
  | "conferencia"
  | "acondicionamento"
  | "transito"
  | "recebimento"
  | "protocolo"
  | "distribuicao"
  | "analise_inicio"
  | "analise_pausa"
  | "analise_retomada"
  | "repetir"
  | "recolhida"
  | "concluida"
  | "liberada"
  | "exame_concluido"
  | "exame_analise"
  | "rejeitada"
  | "extraviada"
  | "sistema";

interface EventoHistorico {
  id: string;
  tipo: EventoTipo;
  evento: string;
  dataHora: string;
  responsavel: string;
  setor?: string;
  observacao?: string;
  isCritical?: boolean;
  isAutomatic?: boolean;
}

const mockAmostra: AmostraDetalhe = {
  id: "1",
  numeroAmostra: "A-2024-089234",
  paciente: "Maria Silva Santos",
  dataHoraColeta: "16/12/2024 08:15",
  setorBancada: "Bioquímica / Bancada 01",
  statusCondicao: "normal",
  situacaoProcesso: "executada",
  material: "Sangue Total (EDTA)",
  numeroRequisicao: "REQ-2024-005678",
};

const mockExames: ExameVinculado[] = [
  { id: "1", codigo: "HMG", descricao: "Hemograma Completo", situacao: "em_analise", urgente: true, dataHoraProcessamento: "16/12/2024 09:30" },
  { id: "2", codigo: "GLI", descricao: "Glicose", situacao: "concluido", urgente: false, dataHoraProcessamento: "16/12/2024 09:45" },
  { id: "3", codigo: "HB1AC", descricao: "Hemoglobina Glicada", situacao: "em_analise", urgente: true, dataHoraProcessamento: null },
  { id: "4", codigo: "CREA", descricao: "Creatinina", situacao: "pendente", urgente: false, dataHoraProcessamento: null },
  { id: "5", codigo: "UREIA", descricao: "Ureia", situacao: "pendente", urgente: false, dataHoraProcessamento: null },
];

const mockHistorico: EventoHistorico[] = [
  { 
    id: "1", 
    tipo: "coleta",
    evento: "Amostra Coletada", 
    dataHora: "16/12/2024 08:15", 
    responsavel: "Ana Paula",
    setor: "Coleta",
    observacao: "Coleta venosa, braço esquerdo. Paciente em jejum de 12h." 
  },
  { 
    id: "2", 
    tipo: "conferencia",
    evento: "Conferência na Coleta", 
    dataHora: "16/12/2024 08:18", 
    responsavel: "Ana Paula",
    setor: "Coleta",
    observacao: "Volume adequado, identificação conferida"
  },
  { 
    id: "3", 
    tipo: "acondicionamento",
    evento: "Acondicionamento", 
    dataHora: "16/12/2024 08:20", 
    responsavel: "Ana Paula",
    setor: "Coleta",
    observacao: "Temperatura ambiente, caixa de transporte #12"
  },
  { 
    id: "4", 
    tipo: "transito",
    evento: "Em Trânsito para Triagem", 
    dataHora: "16/12/2024 08:25", 
    responsavel: "Sistema",
    isAutomatic: true,
    observacao: "Rota: Coleta → Triagem Central"
  },
  { 
    id: "5", 
    tipo: "recebimento",
    evento: "Recebida na Triagem", 
    dataHora: "16/12/2024 08:40", 
    responsavel: "Carlos Eduardo",
    setor: "Triagem"
  },
  { 
    id: "6", 
    tipo: "protocolo",
    evento: "Protocolada", 
    dataHora: "16/12/2024 08:42", 
    responsavel: "Carlos Eduardo",
    setor: "Triagem",
    observacao: "Protocolo #TR-2024-089234"
  },
  { 
    id: "7", 
    tipo: "transito",
    evento: "Em Trânsito para Setor", 
    dataHora: "16/12/2024 08:50", 
    responsavel: "Sistema",
    isAutomatic: true,
    observacao: "Rota: Triagem → Bioquímica"
  },
  { 
    id: "8", 
    tipo: "distribuicao",
    evento: "Distribuída para Setor", 
    dataHora: "16/12/2024 09:00", 
    responsavel: "Carlos Eduardo",
    setor: "Triagem",
    observacao: "Entregue à Bioquímica / Bancada 01"
  },
  { 
    id: "9", 
    tipo: "recebimento",
    evento: "Amostra Entregue no Setor", 
    dataHora: "16/12/2024 09:05", 
    responsavel: "Marcos Silva",
    setor: "Bioquímica"
  },
  { 
    id: "10", 
    tipo: "analise_inicio",
    evento: "Início da Análise", 
    dataHora: "16/12/2024 09:30", 
    responsavel: "Sistema (Automação)",
    isAutomatic: true,
    observacao: "Equipamento: Analisador BQ-5000"
  },
  { 
    id: "11", 
    tipo: "exame_concluido",
    evento: "Exame GLI Concluído", 
    dataHora: "16/12/2024 09:45", 
    responsavel: "Sistema (Automação)",
    isAutomatic: true,
    observacao: "Resultado: 98 mg/dL - Dentro dos valores de referência"
  },
  { 
    id: "12", 
    tipo: "exame_analise",
    evento: "Exame HMG em Análise", 
    dataHora: "16/12/2024 10:00", 
    responsavel: "Sistema (Automação)",
    isAutomatic: true
  },
];

// Configuração visual para status de condição da amostra
const statusCondicaoConfig: Record<StatusCondicao, { label: string; className: string }> = {
  normal: { label: "Normal", className: "badge-success" },
  nao_localizada: { label: "Não localizada", className: "badge-warning" },
  acidentada: { label: "Acidentada", className: "badge-error" },
  inadequada: { label: "Inadequada", className: "badge-error" },
  insuficiente: { label: "Insuficiente", className: "badge-warning" },
  descartada: { label: "Descartada", className: "badge-neutral" },
};

// Configuração visual para situação do processo/fluxo operacional
const situacaoProcessoConfig: Record<SituacaoProcesso, { label: string; className: string }> = {
  aberta: { label: "Aberta", className: "badge-neutral" },
  executada: { label: "Executada", className: "badge-warning" },
  liberada: { label: "Liberada", className: "badge-success" },
  cancelada: { label: "Cancelada", className: "badge-error" },
  nao_executada: { label: "Não Executada", className: "badge-error" },
};

const situacaoExameConfig = {
  pendente: { label: "Pendente", className: "badge-neutral" },
  em_analise: { label: "Em Análise", className: "badge-warning" },
  concluido: { label: "Concluído", className: "badge-success" },
  repetir: { label: "Repetir", className: "badge-error" },
};

const getEventoIcon = (tipo: EventoTipo) => {
  const iconClass = "h-4 w-4";
  switch (tipo) {
    case "coleta":
      return <Syringe className={iconClass} />;
    case "conferencia":
      return <ClipboardCheck className={iconClass} />;
    case "acondicionamento":
      return <Thermometer className={iconClass} />;
    case "transito":
      return <Truck className={iconClass} />;
    case "recebimento":
      return <Package className={iconClass} />;
    case "protocolo":
      return <FileText className={iconClass} />;
    case "distribuicao":
      return <Package className={iconClass} />;
    case "analise_inicio":
      return <Play className={iconClass} />;
    case "analise_pausa":
      return <Pause className={iconClass} />;
    case "analise_retomada":
      return <Play className={iconClass} />;
    case "repetir":
      return <RotateCcw className={iconClass} />;
    case "recolhida":
      return <RotateCcw className={iconClass} />;
    case "concluida":
      return <Check className={iconClass} />;
    case "liberada":
      return <CheckCircle2 className={iconClass} />;
    case "exame_concluido":
      return <FlaskConical className={iconClass} />;
    case "exame_analise":
      return <FlaskConical className={iconClass} />;
    case "rejeitada":
      return <Ban className={iconClass} />;
    case "extraviada":
      return <AlertOctagon className={iconClass} />;
    case "sistema":
      return <Settings className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const getEventoStyle = (tipo: EventoTipo, isCritical?: boolean) => {
  if (isCritical || tipo === "rejeitada" || tipo === "extraviada") {
    return {
      iconBg: "bg-destructive",
      iconText: "text-destructive-foreground",
      cardBg: "bg-destructive/10 border-destructive/30",
    };
  }
  
  switch (tipo) {
    case "coleta":
      return {
        iconBg: "bg-primary",
        iconText: "text-primary-foreground",
        cardBg: "bg-muted/30",
      };
    case "concluida":
    case "liberada":
    case "exame_concluido":
      return {
        iconBg: "bg-green-600",
        iconText: "text-white",
        cardBg: "bg-green-50 dark:bg-green-950/30",
      };
    case "transito":
      return {
        iconBg: "bg-blue-600",
        iconText: "text-white",
        cardBg: "bg-blue-50 dark:bg-blue-950/30",
      };
    case "repetir":
    case "recolhida":
      return {
        iconBg: "bg-orange-600",
        iconText: "text-white",
        cardBg: "bg-orange-50 dark:bg-orange-950/30",
      };
    default:
      return {
        iconBg: "bg-muted",
        iconText: "text-muted-foreground",
        cardBg: "bg-muted/30",
      };
  }
};

const LaboratorioAmostraDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [amostra, setAmostra] = useState<AmostraDetalhe | null>(null);
  const [exames, setExames] = useState<ExameVinculado[]>([]);
  const [historico, setHistorico] = useState<EventoHistorico[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      if (id === "999") {
        setNotFound(true);
      } else {
        setAmostra(mockAmostra);
        setExames(mockExames);
        setHistorico(mockHistorico);
      }
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <LaboratorioLayout title="Detalhes da Amostra">
        <div className="space-y-6 animate-fade-in">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-96" />
          <Card className="card-premium">
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </LaboratorioLayout>
    );
  }

  if (notFound) {
    return (
      <LaboratorioLayout title="Amostra não encontrada">
        <div className="space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/laboratorio/amostras")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Amostras
          </Button>
          <Card className="card-premium">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Amostra não encontrada
              </h2>
              <p className="text-muted-foreground text-center max-w-md">
                A amostra solicitada não foi encontrada no sistema. Verifique o número da amostra ou entre em contato com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      </LaboratorioLayout>
    );
  }

  if (!amostra) return null;

  const situacaoBadge = situacaoProcessoConfig[amostra.situacaoProcesso];
  const condicaoBadge = statusCondicaoConfig[amostra.statusCondicao];

  return (
    <LaboratorioLayout title="Detalhes da Amostra">
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Módulos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/laboratorio">Saúde Laboratório</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/laboratorio/amostras">Amostras</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detalhes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/laboratorio/amostras")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Detalhes da Amostra</h1>
              <span className={situacaoBadge.className}>{situacaoBadge.label}</span>
            </div>
            <p className="text-muted-foreground ml-11">
              <span className="font-mono font-medium text-foreground">{amostra.numeroAmostra}</span>
              <span className="mx-2">•</span>
              {amostra.paciente}
            </p>
          </div>
        </div>

        {/* Card Resumo da Amostra */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <TestTube2 className="h-4 w-4 text-primary" />
              Resumo da Amostra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nº da Amostra</p>
                <p className="font-mono font-medium text-foreground">{amostra.numeroAmostra}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Paciente</p>
                <p className="font-medium text-foreground">{amostra.paciente}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Data/Hora Coleta</p>
                <p className="font-medium text-foreground">{amostra.dataHoraColeta}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Setor / Bancada</p>
                <p className="font-medium text-foreground">{amostra.setorBancada}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Situação</p>
                <span className={situacaoBadge.className}>{situacaoBadge.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Condição</p>
                <span className={condicaoBadge.className}>{condicaoBadge.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Material</p>
                <p className="font-medium text-foreground">{amostra.material}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nº Requisição</p>
                <p className="font-mono font-medium text-foreground">{amostra.numeroRequisicao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção Exames Vinculados */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Serviços/Exames Vinculados
              </CardTitle>
              <span className="text-sm text-muted-foreground">{exames.length} exames</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-center">Urgente</TableHead>
                  <TableHead>Data/Hora Processamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exames.map((exame) => {
                  const situacao = situacaoExameConfig[exame.situacao];
                  return (
                    <TableRow key={exame.id}>
                      <TableCell className="font-mono font-medium">{exame.codigo}</TableCell>
                      <TableCell>{exame.descricao}</TableCell>
                      <TableCell>
                        <span className={situacao.className}>{situacao.label}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {exame.urgente ? (
                          <span className="badge-error flex items-center gap-1 justify-center">
                            <AlertTriangle className="h-3 w-3" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {exame.dataHoraProcessamento || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Seção Histórico / Linha do tempo */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Histórico / Linha do Tempo
              </CardTitle>
              <span className="text-sm text-muted-foreground">{historico.length} eventos</span>
            </div>
          </CardHeader>
          <CardContent>
            {historico.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  Nenhum evento registrado para esta amostra.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-4">
                    {historico.map((evento, index) => {
                      const style = getEventoStyle(evento.tipo, evento.isCritical);
                      const isFirst = index === 0;
                      const isCritical = evento.isCritical || evento.tipo === "rejeitada" || evento.tipo === "extraviada";
                      
                      return (
                        <div key={evento.id} className="relative pl-12">
                          {/* Icon Circle */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`absolute left-0 top-2 h-8 w-8 rounded-full border-2 flex items-center justify-center cursor-help transition-transform hover:scale-110 ${
                                    isFirst
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : `${style.iconBg} ${style.iconText} border-transparent`
                                  }`}
                                >
                                  {getEventoIcon(evento.tipo)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>{evento.evento}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {/* Event Card */}
                          <div className={`rounded-lg p-4 border ${style.cardBg} ${isCritical ? 'border-destructive/50' : 'border-transparent'}`}>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`font-medium text-sm ${isCritical ? 'text-destructive' : 'text-foreground'}`}>
                                    {evento.evento}
                                  </p>
                                  {evento.isAutomatic && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                                      <Settings className="h-2.5 w-2.5" />
                                      Automático
                                    </span>
                                  )}
                                  {isCritical && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive text-destructive-foreground">
                                      <AlertOctagon className="h-2.5 w-2.5" />
                                      Crítico
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                                {evento.dataHora}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{evento.responsavel}</span>
                              {evento.setor && (
                                <>
                                  <span className="text-border">•</span>
                                  <span>{evento.setor}</span>
                                </>
                              )}
                            </div>
                            
                            {evento.observacao && (
                              <p className="text-xs text-muted-foreground mt-2 pl-5 border-l-2 border-border/50 italic">
                                {evento.observacao}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioAmostraDetalhe;

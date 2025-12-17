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
import {
  ArrowLeft,
  TestTube2,
  FlaskConical,
  Clock,
  AlertTriangle,
  FileText,
  AlertCircle,
} from "lucide-react";

interface AmostraDetalhe {
  id: string;
  numeroAmostra: string;
  paciente: string;
  dataHoraColeta: string;
  setorBancada: string;
  status: "colhida" | "em_analise" | "concluida" | "repetir";
  urgente: boolean;
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

interface EventoHistorico {
  id: string;
  evento: string;
  dataHora: string;
  usuario: string;
  observacao?: string;
}

const mockAmostra: AmostraDetalhe = {
  id: "1",
  numeroAmostra: "A-2024-089234",
  paciente: "Maria Silva Santos",
  dataHoraColeta: "16/12/2024 08:15",
  setorBancada: "Bioquímica / Bancada 01",
  status: "em_analise",
  urgente: true,
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
  { id: "1", evento: "Amostra Coletada", dataHora: "16/12/2024 08:15", usuario: "Ana Paula (Coleta)", observacao: "Coleta venosa, braço esquerdo" },
  { id: "2", evento: "Amostra Recebida no Setor", dataHora: "16/12/2024 08:45", usuario: "Carlos (Triagem)" },
  { id: "3", evento: "Início da Análise", dataHora: "16/12/2024 09:30", usuario: "Sistema (Automação)" },
  { id: "4", evento: "Exame GLI Concluído", dataHora: "16/12/2024 09:45", usuario: "Sistema (Automação)", observacao: "Resultado: 98 mg/dL" },
];

const statusConfig = {
  colhida: { label: "Colhida", className: "badge-neutral" },
  em_analise: { label: "Em Análise", className: "badge-warning" },
  concluida: { label: "Concluída", className: "badge-success" },
  repetir: { label: "Repetir", className: "badge-error" },
};

const situacaoExameConfig = {
  pendente: { label: "Pendente", className: "badge-neutral" },
  em_analise: { label: "Em Análise", className: "badge-warning" },
  concluido: { label: "Concluído", className: "badge-success" },
  repetir: { label: "Repetir", className: "badge-error" },
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

  const statusBadge = statusConfig[amostra.status];

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
              <span className={statusBadge.className}>{statusBadge.label}</span>
              {amostra.urgente && (
                <span className="badge-error flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Urgente
                </span>
              )}
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                <span className={statusBadge.className}>{statusBadge.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Urgência</p>
                {amostra.urgente ? (
                  <span className="badge-error flex items-center gap-1 w-fit">
                    <AlertTriangle className="h-3 w-3" />
                    Sim
                  </span>
                ) : (
                  <p className="text-muted-foreground">Não</p>
                )}
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
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Histórico / Linha do Tempo
            </CardTitle>
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
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {historico.map((evento, index) => (
                    <div key={evento.id} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                          index === 0
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary-foreground" : "bg-muted-foreground"}`} />
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground text-sm">{evento.evento}</p>
                          <span className="text-xs text-muted-foreground">{evento.dataHora}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{evento.usuario}</p>
                        {evento.observacao && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {evento.observacao}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioAmostraDetalhe;
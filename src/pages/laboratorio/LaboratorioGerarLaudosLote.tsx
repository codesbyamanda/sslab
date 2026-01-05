import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Files, 
  Filter, 
  Play, 
  FileCheck, 
  Printer, 
  Cloud, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface LaudoProcessado {
  id: string;
  paciente: string;
  requisicao: string;
  status: "gerado" | "nao_gerado";
  motivo?: string;
}

const LaboratorioGerarLaudosLote = () => {
  const navigate = useNavigate();
  const [dataInicialEntrega, setDataInicialEntrega] = useState("");
  const [dataFinalEntrega, setDataFinalEntrega] = useState("");
  const [unidade, setUnidade] = useState("");
  const [convenio, setConvenio] = useState("");
  const [plano, setPlano] = useState("");
  const [requisitante, setRequisitante] = useState("");

  const [laudosProntos, setLaudosProntos] = useState(true);
  const [imprimir, setImprimir] = useState(false);
  const [enviarDataCenter, setEnviarDataCenter] = useState(false);

  const [stats, setStats] = useState({
    laudosAGerar: 42,
    laudosProntos: 38,
    laudosGerados: 0,
    laudosNaoGerados: 0,
    impressos: 0,
    enviadosDataCenter: 0,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [laudosProcessados, setLaudosProcessados] = useState<LaudoProcessado[]>([]);
  const [resultadoFinal, setResultadoFinal] = useState<"sucesso" | "parcial" | "falha" | null>(null);

  // Mock data para simulação
  const mockLaudos: LaudoProcessado[] = [
    { id: "1", paciente: "Maria Silva", requisicao: "REQ-2024-001234", status: "gerado" },
    { id: "2", paciente: "João Santos", requisicao: "REQ-2024-001235", status: "gerado" },
    { id: "3", paciente: "Ana Oliveira", requisicao: "REQ-2024-001236", status: "gerado" },
    { id: "4", paciente: "Carlos Souza", requisicao: "REQ-2024-001237", status: "nao_gerado", motivo: "Resultado não digitado" },
    { id: "5", paciente: "Fernanda Lima", requisicao: "REQ-2024-001238", status: "gerado" },
    { id: "6", paciente: "Roberto Costa", requisicao: "REQ-2024-001239", status: "gerado" },
    { id: "7", paciente: "Patrícia Alves", requisicao: "REQ-2024-001240", status: "nao_gerado", motivo: "Exame pendente de liberação" },
    { id: "8", paciente: "Lucas Pereira", requisicao: "REQ-2024-001241", status: "gerado" },
    { id: "9", paciente: "Camila Rocha", requisicao: "REQ-2024-001242", status: "gerado" },
    { id: "10", paciente: "André Martins", requisicao: "REQ-2024-001243", status: "gerado" },
  ];

  const handleGerar = () => {
    if (!dataInicialEntrega || !dataFinalEntrega) {
      toast.error("Preencha as datas de entrega");
      return;
    }

    // Validar se há laudos prontos
    if (stats.laudosProntos === 0) {
      toast.error("Não há laudos prontos para geração no período selecionado");
      return;
    }

    // Abrir modal e iniciar processamento
    setIsModalOpen(true);
    setIsProcessing(true);
    setIsCompleted(false);
    setProgress(0);
    setLaudosProcessados([]);
    setResultadoFinal(null);
  };

  // Simular processamento quando modal abre
  useEffect(() => {
    if (!isProcessing || !isModalOpen) return;

    let currentIndex = 0;
    const totalLaudos = mockLaudos.length;

    const interval = setInterval(() => {
      if (currentIndex < totalLaudos) {
        setLaudosProcessados(prev => [...prev, mockLaudos[currentIndex]]);
        setProgress(((currentIndex + 1) / totalLaudos) * 100);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsCompleted(true);

        // Calcular resultado
        const gerados = mockLaudos.filter(l => l.status === "gerado").length;
        const naoGerados = mockLaudos.filter(l => l.status === "nao_gerado").length;

        if (naoGerados === 0) {
          setResultadoFinal("sucesso");
        } else if (gerados === 0) {
          setResultadoFinal("falha");
        } else {
          setResultadoFinal("parcial");
        }

        // Atualizar stats
        setStats(prev => ({
          ...prev,
          laudosGerados: prev.laudosGerados + gerados,
          laudosNaoGerados: prev.laudosNaoGerados + naoGerados,
          impressos: imprimir ? prev.impressos + gerados : prev.impressos,
          enviadosDataCenter: enviarDataCenter ? prev.enviadosDataCenter + gerados : prev.enviadosDataCenter,
        }));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isProcessing, isModalOpen, imprimir, enviarDataCenter]);

  const handleCloseModal = () => {
    if (isProcessing) {
      toast.error("Aguarde a conclusão do processamento");
      return;
    }
    setIsModalOpen(false);
  };

  const handleImprimirLaudos = () => {
    // Navegar para tela de impressão com filtros aplicados
    const params = new URLSearchParams();
    params.set("status", "gerado");
    params.set("dataInicial", dataInicialEntrega);
    params.set("dataFinal", dataFinalEntrega);
    if (unidade && unidade !== "all") {
      params.set("unidade", unidade);
    }
    
    setIsModalOpen(false);
    navigate(`/laboratorio/impressao-laudo?${params.toString()}`);
  };

  const handleImprimirDireto = () => {
    const gerados = laudosProcessados.filter(l => l.status === "gerado").length;
    toast.success(`Enviando ${gerados} laudos para impressão...`);
  };

  const handleEnviarDataCenter = () => {
    const gerados = laudosProcessados.filter(l => l.status === "gerado").length;
    toast.success(`Enviando ${gerados} laudos para o Data Center...`);
  };

  const getUnidadeLabel = () => {
    if (!unidade || unidade === "all") return "Todas as unidades";
    const labels: Record<string, string> = {
      central: "Unidade Central",
      norte: "Unidade Norte",
      sul: "Unidade Sul",
    };
    return labels[unidade] || unidade;
  };

  const getResultadoBadge = () => {
    if (!resultadoFinal) return null;
    
    const config = {
      sucesso: { label: "Sucesso Total", variant: "default" as const, icon: CheckCircle2, className: "bg-accent text-accent-foreground" },
      parcial: { label: "Sucesso Parcial", variant: "secondary" as const, icon: AlertCircle, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
      falha: { label: "Falha", variant: "destructive" as const, icon: XCircle, className: "" },
    };

    const { label, icon: Icon, className, variant } = config[resultadoFinal];
    
    return (
      <Badge variant={variant} className={`gap-1.5 ${className}`}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Badge>
    );
  };

  const laudosGeradosCount = laudosProcessados.filter(l => l.status === "gerado").length;
  const laudosNaoGeradosCount = laudosProcessados.filter(l => l.status === "nao_gerado").length;

  return (
    <LaboratorioLayout title="Gerar Laudos Lote">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerar Laudos em Lote</h1>
          <p className="text-muted-foreground mt-1">
            Emissão de laudos em lote por período de entrega.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="dataInicialEntrega">Data Inicial Entrega *</Label>
                <Input
                  id="dataInicialEntrega"
                  type="date"
                  value={dataInicialEntrega}
                  onChange={(e) => setDataInicialEntrega(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFinalEntrega">Data Final Entrega *</Label>
                <Input
                  id="dataFinalEntrega"
                  type="date"
                  value={dataFinalEntrega}
                  onChange={(e) => setDataFinalEntrega(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="central">Unidade Central</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Convênio</Label>
                <Select value={convenio} onValueChange={setConvenio}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plano</Label>
                <Select value={plano} onValueChange={setPlano}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="completo">Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Requisitante</Label>
                <Select value={requisitante} onValueChange={setRequisitante}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="dr-carlos">Dr. Carlos Silva</SelectItem>
                    <SelectItem value="dra-ana">Dra. Ana Souza</SelectItem>
                    <SelectItem value="dr-pedro">Dr. Pedro Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost">Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Opções */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Opções de Geração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="laudosProntos"
                  checked={laudosProntos}
                  onCheckedChange={(checked) => setLaudosProntos(checked as boolean)}
                />
                <Label htmlFor="laudosProntos" className="text-sm font-normal cursor-pointer">
                  Laudos Prontos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="imprimir"
                  checked={imprimir}
                  onCheckedChange={(checked) => setImprimir(checked as boolean)}
                />
                <Label htmlFor="imprimir" className="text-sm font-normal cursor-pointer">
                  Imprimir
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enviarDataCenter"
                  checked={enviarDataCenter}
                  onCheckedChange={(checked) => setEnviarDataCenter(checked as boolean)}
                />
                <Label htmlFor="enviarDataCenter" className="text-sm font-normal cursor-pointer">
                  Enviar Data Center
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contadores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Files className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.laudosAGerar}</p>
              <p className="text-xs text-muted-foreground">Laudos a Gerar</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.laudosProntos}</p>
              <p className="text-xs text-muted-foreground">Laudos Prontos</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{stats.laudosGerados}</p>
              <p className="text-xs text-muted-foreground">Laudos Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <X className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">{stats.laudosNaoGerados}</p>
              <p className="text-xs text-muted-foreground">Não Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Printer className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.impressos}</p>
              <p className="text-xs text-muted-foreground">Impressos</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Cloud className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.enviadosDataCenter}</p>
              <p className="text-xs text-muted-foreground">Enviados DC</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">
            Fechar
          </Button>
          <Button 
            onClick={handleGerar} 
            disabled={!dataInicialEntrega || !dataFinalEntrega}
            className="btn-primary-premium"
          >
            <Play className="h-4 w-4 mr-2" />
            Gerar
          </Button>
        </div>
      </div>

      {/* Modal de Acompanhamento */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !isProcessing && setIsModalOpen(open)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Geração de Laudos em Lote</span>
              {isCompleted && getResultadoBadge()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {/* Resumo do Lote */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm text-foreground">Resumo do Lote</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Período: {dataInicialEntrega} a {dataFinalEntrega}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{getUnidadeLabel()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Total de laudos: {mockLaudos.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  {imprimir && (
                    <Badge variant="outline" className="text-xs">
                      <Printer className="h-3 w-3 mr-1" />
                      Imprimir
                    </Badge>
                  )}
                  {enviarDataCenter && (
                    <Badge variant="outline" className="text-xs">
                      <Cloud className="h-3 w-3 mr-1" />
                      Data Center
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isProcessing ? "Processando..." : isCompleted ? "Concluído" : "Aguardando"}
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {isProcessing && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processando laudo {laudosProcessados.length} de {mockLaudos.length}...
                </p>
              )}
            </div>

            {/* Contadores de Resultado */}
            {laudosProcessados.length > 0 && (
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Gerados:</span>
                  <span className="font-medium text-accent">{laudosGeradosCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-muted-foreground">Não gerados:</span>
                  <span className="font-medium text-destructive">{laudosNaoGeradosCount}</span>
                </div>
              </div>
            )}

            {/* Lista de Laudos Processados */}
            <div className="border rounded-lg">
              <div className="bg-muted/30 px-4 py-2 border-b">
                <h4 className="font-medium text-sm">Laudos Processados</h4>
              </div>
              <ScrollArea className="h-[200px]">
                {laudosProcessados.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Aguardando início do processamento...
                  </div>
                ) : (
                  <div className="divide-y">
                    {laudosProcessados.map((laudo) => (
                      <div
                        key={laudo.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          {laudo.status === "gerado" ? (
                            <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{laudo.paciente}</p>
                            <p className="text-xs text-muted-foreground">{laudo.requisicao}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {laudo.status === "gerado" ? (
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                              Gerado
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                                Não Gerado
                              </Badge>
                              {laudo.motivo && (
                                <p className="text-xs text-destructive">{laudo.motivo}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 flex-shrink-0 border-t pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={isProcessing}>
              Fechar
            </Button>
            {isCompleted && imprimir && laudosGeradosCount > 0 && (
              <Button variant="outline" onClick={handleImprimirDireto}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Direto ({laudosGeradosCount})
              </Button>
            )}
            {isCompleted && enviarDataCenter && laudosGeradosCount > 0 && (
              <Button variant="outline" onClick={handleEnviarDataCenter}>
                <Cloud className="h-4 w-4 mr-2" />
                Enviar ao Data Center ({laudosGeradosCount})
              </Button>
            )}
            {isCompleted && laudosGeradosCount > 0 && (
              <Button onClick={handleImprimirLaudos} className="btn-primary-premium">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Laudos
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LaboratorioLayout>
  );
};

export default LaboratorioGerarLaudosLote;

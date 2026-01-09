import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft, 
  Package, 
  FlaskConical, 
  AlertTriangle,
  MoreHorizontal,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  Send,
  PackageCheck,
  Unlock,
  Printer
} from "lucide-react";
import { toast } from "sonner";
import CancelarAmostraModal from "@/components/laboratorio/CancelarAmostraModal";
import IncluirAmostraModal from "@/components/laboratorio/IncluirAmostraModal";
import ConfirmacaoLoteModal from "@/components/laboratorio/ConfirmacaoLoteModal";

type StatusLote = "aberto" | "em_transicao" | "fechado";
type SituacaoAmostra = "pendente" | "recepcionada" | "em_analise" | "concluido" | "cancelada";

interface AmostraLote {
  id: string;
  numeroAmostra: string;
  numeroRequisicao: string;
  paciente: string;
  material: string;
  exameServico: string;
  situacao: SituacaoAmostra;
  urgente: boolean;
  dataHoraColeta: string;
  motivoCancelamento?: string;
}

interface AmostraDisponivel {
  id: string;
  codigo: string;
  paciente: string;
  setorBancada: string;
  dataHora: string;
  material: string;
}

const initialLoteData = {
  id: "1",
  numeroLote: "L-2024-001234",
  dataHora: "16/12/2024 08:30",
  unidade: "Unidade Central",
  setorBancada: "Bioquímica / Bancada 01",
  qtdAmostras: 8,
  status: "aberto" as StatusLote,
};

const initialAmostras: AmostraLote[] = [
  { id: "1", numeroAmostra: "A-001234-01", numeroRequisicao: "REQ-2024-005678", paciente: "Maria Silva Santos", material: "Sangue Total", exameServico: "Hemograma Completo", situacao: "pendente", urgente: true, dataHoraColeta: "16/12/2024 07:45" },
  { id: "2", numeroAmostra: "A-001234-02", numeroRequisicao: "REQ-2024-005678", paciente: "Maria Silva Santos", material: "Soro", exameServico: "Glicose", situacao: "recepcionada", urgente: false, dataHoraColeta: "16/12/2024 07:45" },
  { id: "3", numeroAmostra: "A-001234-03", numeroRequisicao: "REQ-2024-005679", paciente: "João Carlos Oliveira", material: "Sangue Total", exameServico: "Hemograma Completo", situacao: "em_analise", urgente: false, dataHoraColeta: "16/12/2024 07:50" },
  { id: "4", numeroAmostra: "A-001234-04", numeroRequisicao: "REQ-2024-005679", paciente: "João Carlos Oliveira", material: "Urina", exameServico: "EAS", situacao: "pendente", urgente: false, dataHoraColeta: "16/12/2024 07:52" },
  { id: "5", numeroAmostra: "A-001234-05", numeroRequisicao: "REQ-2024-005680", paciente: "Ana Paula Ferreira", material: "Soro", exameServico: "TSH", situacao: "em_analise", urgente: true, dataHoraColeta: "16/12/2024 08:00" },
  { id: "6", numeroAmostra: "A-001234-06", numeroRequisicao: "REQ-2024-005680", paciente: "Ana Paula Ferreira", material: "Soro", exameServico: "T4 Livre", situacao: "em_analise", urgente: true, dataHoraColeta: "16/12/2024 08:00" },
  { id: "7", numeroAmostra: "A-001234-07", numeroRequisicao: "REQ-2024-005681", paciente: "Carlos Eduardo Lima", material: "Sangue Total", exameServico: "Coagulograma", situacao: "concluido", urgente: false, dataHoraColeta: "16/12/2024 08:10" },
  { id: "8", numeroAmostra: "A-001234-08", numeroRequisicao: "REQ-2024-005682", paciente: "Fernanda Costa Souza", material: "Fezes", exameServico: "Parasitológico", situacao: "pendente", urgente: false, dataHoraColeta: "16/12/2024 08:15" },
];

const mockAmostrasDisponiveis: AmostraDisponivel[] = [
  { id: "new1", codigo: "AM-2024-005450", paciente: "Roberto Gomes", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 10:00", material: "Sangue" },
  { id: "new2", codigo: "AM-2024-005451", paciente: "Lucia Pereira", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 10:15", material: "Sangue" },
  { id: "new3", codigo: "AM-2024-005452", paciente: "Marcos Santos", setorBancada: "Hematologia / Bancada 01", dataHora: "09/01/2026 10:30", material: "Sangue" },
];

const statusConfig: Record<StatusLote, { label: string; className: string }> = {
  aberto: { label: "Aberto", className: "badge-success" },
  em_transicao: { label: "Em Transição", className: "badge-warning" },
  fechado: { label: "Fechado", className: "badge-neutral" },
};

const situacaoConfig: Record<SituacaoAmostra, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "badge-warning" },
  recepcionada: { label: "Recepcionada", className: "badge-neutral" },
  em_analise: { label: "Em Análise", className: "badge-neutral" },
  concluido: { label: "Concluído", className: "badge-success" },
  cancelada: { label: "Cancelada", className: "badge-error" },
};

const LaboratorioLoteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lote, setLote] = useState(initialLoteData);
  const [amostras, setAmostras] = useState<AmostraLote[]>(initialAmostras);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Modals state
  const [cancelarAmostraModal, setCancelarAmostraModal] = useState<{
    open: boolean;
    amostra: { id: string; codigo: string; paciente: string } | null;
  }>({ open: false, amostra: null });
  
  const [incluirAmostraModal, setIncluirAmostraModal] = useState(false);
  
  const [confirmacaoModal, setConfirmacaoModal] = useState<{
    open: boolean;
    type: "excluir_lote" | "enviar" | "recepcionar" | "abrir" | null;
  }>({ open: false, type: null });

  const statusBadge = statusConfig[lote.status];
  const isAberto = lote.status === "aberto";
  const isEmTransicao = lote.status === "em_transicao";
  const isFechado = lote.status === "fechado";

  // Ações por Amostra
  const handleExcluirAmostra = (amostraId: string) => {
    setAmostras(prev => prev.filter(a => a.id !== amostraId));
    setHasChanges(true);
    toast.success("Amostra removida do lote.");
  };

  const handleRecepcionarAmostra = (amostraId: string) => {
    setAmostras(prev => prev.map(a => 
      a.id === amostraId ? { ...a, situacao: "recepcionada" as SituacaoAmostra } : a
    ));
    setHasChanges(true);
    toast.success("Amostra recepcionada com sucesso.");
  };

  const handleCancelarAmostra = (amostraId: string, motivo: string) => {
    setAmostras(prev => prev.map(a => 
      a.id === amostraId ? { ...a, situacao: "cancelada" as SituacaoAmostra, motivoCancelamento: motivo } : a
    ));
    setHasChanges(true);
    toast.success("Amostra cancelada.", { description: `Motivo: ${motivo}` });
  };

  const handleIncluirAmostras = (amostraIds: string[]) => {
    const novasAmostras: AmostraLote[] = amostraIds.map((id, index) => {
      const amostraDisponivel = mockAmostrasDisponiveis.find(a => a.id === id);
      return {
        id: `new-${Date.now()}-${index}`,
        numeroAmostra: amostraDisponivel?.codigo || `A-NEW-${index}`,
        numeroRequisicao: `REQ-2024-NEW${index}`,
        paciente: amostraDisponivel?.paciente || "Paciente",
        material: amostraDisponivel?.material || "Material",
        exameServico: "Exame",
        situacao: "pendente" as SituacaoAmostra,
        urgente: false,
        dataHoraColeta: amostraDisponivel?.dataHora || new Date().toLocaleString("pt-BR"),
      };
    });
    
    setAmostras(prev => [...prev, ...novasAmostras]);
    setHasChanges(true);
    toast.success(`${amostraIds.length} amostra(s) adicionada(s) ao lote.`);
  };

  // Ações por Lote
  const handleSalvarLote = () => {
    toast.success("Lote salvo com sucesso.");
    setHasChanges(false);
  };

  const handleExcluirLote = () => {
    toast.success("Lote excluído com sucesso.");
    navigate("/laboratorio/lotes-amostras");
  };

  const handleEnviarLote = () => {
    setLote(prev => ({ ...prev, status: "em_transicao" }));
    toast.success("Lote enviado.", { description: "Status alterado para Em Transição." });
    setConfirmacaoModal({ open: false, type: null });
  };

  const handleRecepcionarLote = () => {
    setLote(prev => ({ ...prev, status: "fechado" }));
    toast.success("Lote recepcionado.", { description: "Status alterado para Fechado." });
    setConfirmacaoModal({ open: false, type: null });
  };

  const handleAbrirLote = () => {
    setLote(prev => ({ ...prev, status: "aberto" }));
    toast.success("Lote reaberto.", { description: "Status alterado para Aberto." });
    setConfirmacaoModal({ open: false, type: null });
  };

  const handleImprimirLote = () => {
    toast.info("Gerando impressão do lote...");
  };

  const getConfirmacaoConfig = () => {
    switch (confirmacaoModal.type) {
      case "excluir_lote":
        return {
          title: "Excluir Lote",
          description: "Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.",
          confirmLabel: "Excluir Lote",
          variant: "destructive" as const,
          onConfirm: handleExcluirLote,
        };
      case "enviar":
        return {
          title: "Enviar Lote",
          description: "Ao enviar o lote, o status será alterado para 'Em Transição' e não será mais possível adicionar ou remover amostras. Deseja continuar?",
          confirmLabel: "Enviar Lote",
          variant: "default" as const,
          onConfirm: handleEnviarLote,
        };
      case "recepcionar":
        return {
          title: "Recepcionar Lote",
          description: "Ao recepcionar o lote, o status será alterado para 'Fechado'. Deseja confirmar o recebimento?",
          confirmLabel: "Recepcionar Lote",
          variant: "default" as const,
          onConfirm: handleRecepcionarLote,
        };
      case "abrir":
        return {
          title: "Reabrir Lote",
          description: "Ao reabrir o lote, o status será alterado para 'Aberto' e será possível editar as amostras novamente. Deseja continuar?",
          confirmLabel: "Reabrir Lote",
          variant: "default" as const,
          onConfirm: handleAbrirLote,
        };
      default:
        return null;
    }
  };

  const confirmConfig = getConfirmacaoConfig();

  const amostrasAtivas = amostras.filter(a => a.situacao !== "cancelada");

  return (
    <LaboratorioLayout title="Lote de Amostras">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/laboratorio/lotes-amostras")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Lote de Amostras</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
              <span className="font-mono font-medium text-foreground">{lote.numeroLote}</span>
              <span>•</span>
              <span>{lote.dataHora}</span>
              <span>•</span>
              <span>{lote.unidade}</span>
              <span>•</span>
              <span>{lote.setorBancada}</span>
              <span>•</span>
              <span className={statusBadge.className}>{statusBadge.label}</span>
            </div>
          </div>

          {/* Ações do Lote */}
          <div className="flex items-center gap-2">
            {/* Imprimir - sempre disponível */}
            <Button variant="outline" size="sm" onClick={handleImprimirLote}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>

            {/* Salvar - apenas Aberto */}
            {isAberto && hasChanges && (
              <Button variant="outline" size="sm" onClick={handleSalvarLote}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            )}

            {/* Enviar - apenas Aberto */}
            {isAberto && (
              <Button 
                size="sm" 
                onClick={() => setConfirmacaoModal({ open: true, type: "enviar" })}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Lote
              </Button>
            )}

            {/* Recepcionar - apenas Em Transição */}
            {isEmTransicao && (
              <Button 
                size="sm" 
                onClick={() => setConfirmacaoModal({ open: true, type: "recepcionar" })}
              >
                <PackageCheck className="h-4 w-4 mr-2" />
                Recepcionar Lote
              </Button>
            )}

            {/* Abrir - apenas Fechado */}
            {isFechado && (
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => setConfirmacaoModal({ open: true, type: "abrir" })}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Reabrir Lote
              </Button>
            )}

            {/* Excluir - apenas Aberto */}
            {isAberto && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setConfirmacaoModal({ open: true, type: "excluir_lote" })}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
          </div>
        </div>

        {/* Informações do Lote */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Informações do Lote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nº do Lote</p>
                <p className="font-mono font-medium text-foreground">{lote.numeroLote}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Data/Hora Criação</p>
                <p className="font-medium text-foreground">{lote.dataHora}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Unidade</p>
                <p className="font-medium text-foreground">{lote.unidade}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Setor/Bancada</p>
                <p className="font-medium text-foreground">{lote.setorBancada}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                <span className={statusBadge.className}>{statusBadge.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total de Amostras</p>
                <p className="font-medium text-foreground">{amostrasAtivas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Amostras */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Amostras do Lote
              </CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{amostras.length} amostras</span>
                {isAberto && (
                  <Button 
                    size="sm" 
                    onClick={() => setIncluirAmostraModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Incluir Amostra
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Amostra</TableHead>
                  <TableHead>Nº Requisição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Exame/Serviço</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-center">Urgente</TableHead>
                  <TableHead>Data/Hora Coleta</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amostras.map((amostra) => {
                  const situacao = situacaoConfig[amostra.situacao];
                  const isCancelada = amostra.situacao === "cancelada";
                  
                  return (
                    <TableRow key={amostra.id} className={isCancelada ? "opacity-50" : ""}>
                      <TableCell className="font-mono font-medium">{amostra.numeroAmostra}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{amostra.numeroRequisicao}</TableCell>
                      <TableCell>{amostra.paciente}</TableCell>
                      <TableCell>{amostra.material}</TableCell>
                      <TableCell>{amostra.exameServico}</TableCell>
                      <TableCell>
                        <span className={situacao.className}>{situacao.label}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {amostra.urgente ? (
                          <span className="inline-flex items-center gap-1 badge-error">
                            <AlertTriangle className="h-3 w-3" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell>{amostra.dataHoraColeta}</TableCell>
                      <TableCell>
                        {!isCancelada && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Recepcionar - disponível para qualquer status do lote */}
                              {amostra.situacao === "pendente" && (
                                <DropdownMenuItem onClick={() => handleRecepcionarAmostra(amostra.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Recepcionar
                                </DropdownMenuItem>
                              )}
                              
                              {/* Excluir - apenas lote Aberto */}
                              {isAberto && (
                                <DropdownMenuItem 
                                  onClick={() => handleExcluirAmostra(amostra.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir do Lote
                                </DropdownMenuItem>
                              )}
                              
                              {(amostra.situacao === "pendente" || isAberto) && <DropdownMenuSeparator />}
                              
                              {/* Cancelar - sempre disponível se não cancelada */}
                              <DropdownMenuItem 
                                onClick={() => setCancelarAmostraModal({
                                  open: true,
                                  amostra: {
                                    id: amostra.id,
                                    codigo: amostra.numeroAmostra,
                                    paciente: amostra.paciente,
                                  }
                                })}
                                className="text-destructive focus:text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Amostra
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mensagem de bloqueio para lotes não editáveis */}
        {!isAberto && (
          <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isEmTransicao 
                ? "Este lote está em transição. Não é possível adicionar ou remover amostras."
                : "Este lote está fechado. Apenas visualização e impressão estão disponíveis."
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CancelarAmostraModal
        open={cancelarAmostraModal.open}
        onOpenChange={(open) => setCancelarAmostraModal({ open, amostra: null })}
        amostra={cancelarAmostraModal.amostra}
        onConfirm={handleCancelarAmostra}
      />

      <IncluirAmostraModal
        open={incluirAmostraModal}
        onOpenChange={setIncluirAmostraModal}
        unidade={lote.unidade}
        amostrasDisponiveis={mockAmostrasDisponiveis}
        onConfirm={handleIncluirAmostras}
      />

      {confirmConfig && (
        <ConfirmacaoLoteModal
          open={confirmacaoModal.open}
          onOpenChange={(open) => setConfirmacaoModal({ open, type: confirmacaoModal.type })}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          variant={confirmConfig.variant}
          onConfirm={confirmConfig.onConfirm}
        />
      )}
    </LaboratorioLayout>
  );
};

export default LaboratorioLoteDetalhe;

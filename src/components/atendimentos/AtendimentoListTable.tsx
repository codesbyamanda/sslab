import { Edit, Eye, History, TestTube, FileText, CreditCard, Tag, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Atendimento {
  id: number;
  numeroRequisicao: string;
  paciente: string;
  convenio: string;
  dataAtendimento: string;
  situacao: "aberto" | "pendente" | "cancelado" | "executado" | "liberado" | "impresso" | "entregue" | "repeticao";
  tipoAtendimento: string;
  medicoSolicitante: string;
  unidade: string;
  servicosPendentes?: number;
  laudoDisponivel?: boolean;
  valorPendente?: number;
}

const mockAtendimentos: Atendimento[] = [
  {
    id: 1,
    numeroRequisicao: "REQ-2024-001",
    paciente: "Maria Santos Silva",
    convenio: "Unimed",
    dataAtendimento: "2024-01-15",
    situacao: "aberto",
    tipoAtendimento: "Ambulatorial",
    medicoSolicitante: "Dr. Carlos Mendes",
    unidade: "Unidade Centro",
    servicosPendentes: 3,
    laudoDisponivel: false,
    valorPendente: 0,
  },
  {
    id: 2,
    numeroRequisicao: "REQ-2024-002",
    paciente: "João Pedro Oliveira",
    convenio: "Bradesco Saúde",
    dataAtendimento: "2024-01-15",
    situacao: "pendente",
    tipoAtendimento: "Emergência",
    medicoSolicitante: "Dra. Ana Paula Costa",
    unidade: "Unidade Norte",
    servicosPendentes: 2,
    laudoDisponivel: false,
    valorPendente: 0,
  },
  {
    id: 3,
    numeroRequisicao: "REQ-2024-003",
    paciente: "Fernanda Lima Costa",
    convenio: "Particular",
    dataAtendimento: "2024-01-14",
    situacao: "executado",
    tipoAtendimento: "Ambulatorial",
    medicoSolicitante: "Dr. Ricardo Souza",
    unidade: "Unidade Centro",
    servicosPendentes: 0,
    laudoDisponivel: true,
    valorPendente: 250.00,
  },
  {
    id: 4,
    numeroRequisicao: "REQ-2024-004",
    paciente: "Carlos Alberto Nunes",
    convenio: "SulAmérica",
    dataAtendimento: "2024-01-14",
    situacao: "liberado",
    tipoAtendimento: "Internação",
    medicoSolicitante: "Dr. Paulo Henrique",
    unidade: "Unidade Sul",
    servicosPendentes: 0,
    laudoDisponivel: true,
    valorPendente: 0,
  },
  {
    id: 5,
    numeroRequisicao: "REQ-2024-005",
    paciente: "Ana Beatriz Ferreira",
    convenio: "Amil",
    dataAtendimento: "2024-01-13",
    situacao: "cancelado",
    tipoAtendimento: "Ambulatorial",
    medicoSolicitante: "Dra. Mariana Rocha",
    unidade: "Unidade Centro",
    servicosPendentes: 0,
    laudoDisponivel: false,
    valorPendente: 0,
  },
  {
    id: 6,
    numeroRequisicao: "REQ-2024-006",
    paciente: "Roberto Almeida Santos",
    convenio: "Unimed",
    dataAtendimento: "2024-01-13",
    situacao: "impresso",
    tipoAtendimento: "Ambulatorial",
    medicoSolicitante: "Dr. Fernando Gomes",
    unidade: "Unidade Norte",
    servicosPendentes: 1,
    laudoDisponivel: true,
    valorPendente: 0,
  },
];

const getSituacaoStyle = (situacao: string) => {
  switch (situacao) {
    case "aberto":
      return "bg-background border border-border text-foreground";
    case "pendente":
      return "bg-ambar-suave/20 text-ambar-suave border border-ambar-suave/30";
    case "cancelado":
      return "bg-vermelho-moderno/20 text-vermelho-moderno border border-vermelho-moderno/30";
    case "executado":
      return "bg-petroleo/20 text-petroleo border border-petroleo/30";
    case "liberado":
      return "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30";
    case "impresso":
      return "bg-dourado-sutil/20 text-dourado-sutil border border-dourado-sutil/30";
    case "entregue":
      return "bg-primary/20 text-primary border border-primary/30";
    case "repeticao":
      return "bg-muted text-muted-foreground border border-border";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
};

const getSituacaoLabel = (situacao: string) => {
  const labels: Record<string, string> = {
    aberto: "Aberto",
    pendente: "Pendente",
    cancelado: "Cancelado",
    executado: "Executado",
    liberado: "Liberado",
    impresso: "Impresso",
    entregue: "Entregue",
    repeticao: "Repetição",
  };
  return labels[situacao] || situacao;
};

// Helper para verificar se atendimento pode ser editado
const canEdit = (atendimento: Atendimento) => {
  return !["cancelado", "entregue"].includes(atendimento.situacao);
};

// Helper para verificar se há serviços pendentes de recebimento
const hasServicesPending = (atendimento: Atendimento) => {
  return (atendimento.servicosPendentes ?? 0) > 0;
};

// Helper para verificar se laudo está disponível
const hasLaudoAvailable = (atendimento: Atendimento) => {
  return atendimento.laudoDisponivel === true;
};

// Helper para verificar se tem convênio vinculado (não particular)
const hasConvenio = (atendimento: Atendimento) => {
  return atendimento.convenio !== "Particular";
};

// Helper para verificar se é particular com valor pendente
const isParticularWithPendingValue = (atendimento: Atendimento) => {
  return atendimento.convenio === "Particular" && (atendimento.valorPendente ?? 0) > 0;
};

interface AtendimentoListTableProps {
  filters?: { search: string; showPending: boolean };
}

const AtendimentoListTable = ({ filters }: AtendimentoListTableProps) => {
  const navigate = useNavigate();

  const filteredAtendimentos = mockAtendimentos.filter((atendimento) => {
    if (filters?.showPending && atendimento.situacao !== "pendente") {
      return false;
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        atendimento.paciente.toLowerCase().includes(searchLower) ||
        atendimento.numeroRequisicao.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleRowClick = (id: number) => {
    navigate(`/atendimento/requisicao/${id}`);
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Nº Requisição</th>
              <th>Paciente</th>
              <th>Convênio</th>
              <th>Data</th>
              <th>Situação</th>
              <th>Tipo</th>
              <th>Médico Solicitante</th>
              <th>Unidade</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAtendimentos.map((atendimento) => {
              const editEnabled = canEdit(atendimento);
              const recebimentoEnabled = hasServicesPending(atendimento);
              const laudoEnabled = hasLaudoAvailable(atendimento);
              const guiasEnabled = hasConvenio(atendimento);
              const receitaEnabled = isParticularWithPendingValue(atendimento);

              return (
                <tr
                  key={atendimento.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(atendimento.id)}
                >
                  <td className="font-medium text-primary">{atendimento.numeroRequisicao}</td>
                  <td className="font-medium">{atendimento.paciente}</td>
                  <td>{atendimento.convenio}</td>
                  <td>{new Date(atendimento.dataAtendimento).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getSituacaoStyle(atendimento.situacao)}`}>
                      {getSituacaoLabel(atendimento.situacao)}
                    </span>
                  </td>
                  <td>{atendimento.tipoAtendimento}</td>
                  <td>{atendimento.medicoSolicitante}</td>
                  <td>{atendimento.unidade}</td>
                  <td>
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* 1. Editar Atendimento */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              editEnabled 
                                ? "text-muted-foreground hover:text-primary" 
                                : "text-muted-foreground/40 cursor-not-allowed"
                            }`}
                            disabled={!editEnabled}
                            onClick={() => editEnabled && navigate(`/atendimento/requisicao/${atendimento.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {editEnabled ? "Editar atendimento" : "Este atendimento não pode mais ser editado"}
                        </TooltipContent>
                      </Tooltip>

                      {/* 2. Recebimento de Material */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${
                              recebimentoEnabled 
                                ? "text-muted-foreground hover:text-verde-clinico" 
                                : "text-muted-foreground/40 cursor-not-allowed"
                            }`}
                            disabled={!recebimentoEnabled}
                            onClick={() => recebimentoEnabled && navigate(`/atendimento/recebimento/${atendimento.id}`)}
                          >
                            <TestTube className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {recebimentoEnabled ? "Recebimento de material" : "Não há serviços pendentes para recebimento"}
                        </TooltipContent>
                      </Tooltip>

                      {/* 3. Mais Ações */}
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Mais ações</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
                          {/* Visualizar Atendimento */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => navigate(`/atendimento/requisicao/${atendimento.id}`)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                                <span>Visualizar Atendimento</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">Visualizar atendimento</TooltipContent>
                          </Tooltip>

                          {/* Histórico */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <History className="h-4 w-4" />
                                <span>Histórico</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">Histórico do atendimento</TooltipContent>
                          </Tooltip>

                          {/* Impressões de Atendimento */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => navigate(`/atendimento/impressoes/${atendimento.id}`)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Tag className="h-4 w-4" />
                                <span>Impressões de Atendimento</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">Impressões do atendimento</TooltipContent>
                          </Tooltip>

                          {/* Imprimir Laudo */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => laudoEnabled && navigate(`/atendimento/laudo-paciente/${atendimento.id}`)}
                                disabled={!laudoEnabled}
                                className={`flex items-center gap-2 ${
                                  laudoEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <FileText className="h-4 w-4" />
                                <span>Imprimir Laudo</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              {laudoEnabled ? "Imprimir laudo" : "Laudo ainda não disponível"}
                            </TooltipContent>
                          </Tooltip>

                          {/* Guias */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => guiasEnabled && navigate(`/atendimento/guias/${atendimento.id}`)}
                                disabled={!guiasEnabled}
                                className={`flex items-center gap-2 ${
                                  guiasEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <FileText className="h-4 w-4" />
                                <span>Guias</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              {guiasEnabled ? "Guias do convênio" : "Atendimento sem convênio"}
                            </TooltipContent>
                          </Tooltip>

                          {/* Receita a Receber */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => receitaEnabled && navigate(`/atendimento/receita/${atendimento.id}`)}
                                disabled={!receitaEnabled}
                                className={`flex items-center gap-2 ${
                                  receitaEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <CreditCard className="h-4 w-4" />
                                <span>Receita a Receber</span>
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              {receitaEnabled 
                                ? "Receita a receber" 
                                : "Disponível apenas para atendimentos particulares com valor pendente"}
                            </TooltipContent>
                          </Tooltip>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAtendimentos.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Nenhum atendimento encontrado.
        </div>
      )}
    </div>
  );
};

export default AtendimentoListTable;

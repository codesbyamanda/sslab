import { Edit, Eye, Printer, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
            {filteredAtendimentos.map((atendimento) => (
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => navigate(`/atendimento/requisicao/${atendimento.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Visualizar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Imprimir</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Histórico</TooltipContent>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
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

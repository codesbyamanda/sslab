import { useState } from "react";
import { Plus, Edit, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ServiceModal from "./ServiceModal";
import KitConfirmationModal from "./KitConfirmationModal";

interface Servico {
  id: number;
  codigo: string;
  mnemonico: string;
  descricao: string;
  situacao: "aberto" | "pendente" | "cancelado" | "executado" | "liberado";
  urgencia: boolean;
  materialColhido: boolean;
  dataColeta: string;
  horaColeta: string;
  convenio: string;
  medicosSolicitantes: string[];
  valor: number;
}

interface ServicosTabProps {
  servicos: Servico[];
  onAddServico: (servico: Omit<Servico, "id">) => void;
  onEditServico: (servico: Servico) => void;
  onCancelServico: (id: number) => void;
  urgenciaGlobal: boolean;
}

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
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getSituacaoLabel = (situacao: string) => {
  const labels: Record<string, string> = {
    aberto: "Aberto",
    pendente: "Pendente",
    cancelado: "Cancelado",
    executado: "Executado",
    liberado: "Liberado",
  };
  return labels[situacao] || situacao;
};

const ServicosTab = ({
  servicos,
  onAddServico,
  onEditServico,
  onCancelServico,
  urgenciaGlobal,
}: ServicosTabProps) => {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [showKitModal, setShowKitModal] = useState(false);
  const [pendingKit, setPendingKit] = useState<{ codigo: string; servicos: string[] } | null>(null);

  const handleAddService = (servico: Omit<Servico, "id">) => {
    // Check if it's a kit (mock check)
    if (servico.mnemonico.toUpperCase().startsWith("KIT")) {
      setPendingKit({
        codigo: servico.mnemonico,
        servicos: ["Hemograma Completo", "Glicose", "Ureia", "Creatinina"],
      });
      setShowKitModal(true);
    } else {
      onAddServico({ ...servico, urgencia: urgenciaGlobal || servico.urgencia });
    }
    setShowServiceModal(false);
  };

  const handleConfirmKit = () => {
    if (pendingKit) {
      pendingKit.servicos.forEach((desc, index) => {
        onAddServico({
          codigo: `${pendingKit.codigo}-${index + 1}`,
          mnemonico: pendingKit.codigo,
          descricao: desc,
          situacao: "aberto",
          urgencia: urgenciaGlobal,
          materialColhido: false,
          dataColeta: "",
          horaColeta: "",
          convenio: "Unimed",
          medicosSolicitantes: [],
          valor: 25.0,
        });
      });
    }
    setShowKitModal(false);
    setPendingKit(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalValor = servicos.reduce((acc, s) => acc + s.valor, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Serviços da Requisição</h3>
          <p className="text-sm text-muted-foreground">
            Total: {servicos.length} serviço(s) • Valor Total: R$ {totalValor.toFixed(2)}
          </p>
        </div>
        <Button onClick={() => setShowServiceModal(true)} className="btn-primary-premium">
          <Plus className="h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Código/Mnemônico</th>
                <th>Descrição</th>
                <th>Situação</th>
                <th>Urgência</th>
                <th>Material</th>
                <th>Data/Hora Coleta</th>
                <th>Convênio</th>
                <th className="text-right">Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <>
                  <tr key={servico.id} className="hover:bg-muted/30">
                    <td>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleExpand(servico.id)}
                      >
                        {expandedRows.includes(servico.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="font-mono text-sm font-medium text-primary">
                      {servico.mnemonico}
                    </td>
                    <td className="font-medium">{servico.descricao}</td>
                    <td>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getSituacaoStyle(
                          servico.situacao
                        )}`}
                      >
                        {getSituacaoLabel(servico.situacao)}
                      </span>
                    </td>
                    <td>
                      {servico.urgencia && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-vermelho-moderno/20 text-vermelho-moderno border border-vermelho-moderno/30">
                          Urgente
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-medium ${
                          servico.materialColhido ? "text-verde-clinico" : "text-muted-foreground"
                        }`}
                      >
                        {servico.materialColhido ? "Colhido" : "Pendente"}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {servico.dataColeta && servico.horaColeta
                        ? `${new Date(servico.dataColeta).toLocaleDateString("pt-BR")} ${servico.horaColeta}`
                        : "-"}
                    </td>
                    <td>{servico.convenio}</td>
                    <td className="text-right font-medium">R$ {servico.valor.toFixed(2)}</td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingServico(servico);
                            setShowServiceModal(true);
                          }}
                          disabled={servico.situacao === "cancelado"}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onCancelServico(servico.id)}
                          disabled={servico.situacao === "cancelado"}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRows.includes(servico.id) && (
                    <tr className="bg-muted/20">
                      <td colSpan={10} className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Código:</span>
                            <p className="font-medium">{servico.codigo}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Médico(s) Solicitante(s):</span>
                            <p className="font-medium">
                              {servico.medicosSolicitantes && servico.medicosSolicitantes.length > 0
                                ? servico.medicosSolicitantes.join(", ")
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Convênio:</span>
                            <p className="font-medium">{servico.convenio}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Recipiente:</span>
                            <p className="font-medium">Tubo EDTA</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {servicos.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.
          </div>
        )}
      </div>

      {/* Service Modal */}
      <ServiceModal
        open={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setEditingServico(null);
        }}
        onSave={handleAddService}
        editingServico={editingServico}
      />

      {/* Kit Confirmation Modal */}
      <KitConfirmationModal
        open={showKitModal}
        onClose={() => {
          setShowKitModal(false);
          setPendingKit(null);
        }}
        onConfirm={handleConfirmKit}
        kitInfo={pendingKit}
      />
    </div>
  );
};

export default ServicosTab;

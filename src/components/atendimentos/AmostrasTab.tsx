import { useState } from "react";
import { Plus, Edit, Eye, XCircle, TestTubes, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AmostraModal from "./AmostraModal";

export interface Amostra {
  id: number;
  nome: string;
  descricao: string;
  servicosVinculados: number[];
  status: "ativa" | "inativa";
}

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
  medicoSolicitante: string;
  valor: number;
}

interface AmostrasTabProps {
  amostras: Amostra[];
  servicos: Servico[];
  onAddAmostra: (amostra: Omit<Amostra, "id">) => void;
  onEditAmostra: (amostra: Amostra) => void;
  onDeleteAmostra: (id: number) => void;
}

const AmostrasTab = ({
  amostras,
  servicos,
  onAddAmostra,
  onEditAmostra,
  onDeleteAmostra,
}: AmostrasTabProps) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingAmostra, setEditingAmostra] = useState<Amostra | null>(null);
  const [viewingAmostra, setViewingAmostra] = useState<Amostra | null>(null);

  const handleSave = (amostra: Omit<Amostra, "id"> | Amostra) => {
    if ("id" in amostra) {
      onEditAmostra(amostra as Amostra);
    } else {
      onAddAmostra(amostra);
    }
    setShowModal(false);
    setEditingAmostra(null);
    toast({
      title: "Amostra salva com sucesso.",
      description: `A amostra "${amostra.nome}" foi salva.`,
    });
  };

  const handleToggleStatus = (amostra: Amostra) => {
    const newStatus = amostra.status === "ativa" ? "inativa" : "ativa";
    onEditAmostra({ ...amostra, status: newStatus });
    toast({
      title: `Amostra ${newStatus === "ativa" ? "ativada" : "inativada"}`,
      description: `A amostra "${amostra.nome}" foi ${newStatus === "ativa" ? "ativada" : "inativada"}.`,
    });
  };

  const getServicosNomes = (servicosIds: number[]) => {
    return servicosIds
      .map((id) => servicos.find((s) => s.id === id)?.descricao)
      .filter(Boolean);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Amostras</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie amostras que agrupam serviços relacionados à mesma coleta.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-primary-premium">
          <Plus className="h-4 w-4" />
          Adicionar Amostra
        </Button>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Nome da Amostra</th>
                <th>Serviços Vinculados</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {amostras.map((amostra) => (
                <tr key={amostra.id} className="hover:bg-muted/30">
                  <td>
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-primary" />
                      <span className="font-medium">{amostra.nome}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {amostra.servicosVinculados.length > 0 ? (
                        <>
                          <Badge variant="secondary" className="text-xs">
                            {amostra.servicosVinculados.length} serviço(s)
                          </Badge>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-sm">Nenhum serviço</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        amostra.status === "ativa"
                          ? "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {amostra.status === "ativa" ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setViewingAmostra(amostra)}
                        title="Visualizar"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => {
                          setEditingAmostra(amostra);
                          setShowModal(true);
                        }}
                        title="Editar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleToggleStatus(amostra)}
                        title={amostra.status === "ativa" ? "Inativar" : "Ativar"}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {amostras.length === 0 && (
          <div className="p-12 text-center">
            <TestTubes className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Nenhuma amostra cadastrada ainda
            </h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Cadastre amostras para agrupar serviços relacionados à mesma coleta.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AmostraModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAmostra(null);
        }}
        onSave={handleSave}
        editingAmostra={editingAmostra}
        servicos={servicos}
      />

      {/* View Modal */}
      {viewingAmostra && (
        <AmostraViewModal
          open={!!viewingAmostra}
          onClose={() => setViewingAmostra(null)}
          amostra={viewingAmostra}
          servicos={servicos}
        />
      )}
    </div>
  );
};

// View Modal Component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AmostraViewModalProps {
  open: boolean;
  onClose: () => void;
  amostra: Amostra;
  servicos: Servico[];
}

const AmostraViewModal = ({ open, onClose, amostra, servicos }: AmostraViewModalProps) => {
  const servicosVinculados = amostra.servicosVinculados
    .map((id) => servicos.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            {amostra.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {amostra.descricao && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
              <p className="text-sm">{amostra.descricao}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                amostra.status === "ativa"
                  ? "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {amostra.status === "ativa" ? "Ativa" : "Inativa"}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Serviços Vinculados ({servicosVinculados.length})
            </h4>
            {servicosVinculados.length > 0 ? (
              <div className="space-y-2">
                {servicosVinculados.map((servico) => (
                  <div
                    key={servico!.id}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded-md"
                  >
                    <span className="font-mono text-xs text-primary">{servico!.mnemonico}</span>
                    <span className="text-sm">{servico!.descricao}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum serviço vinculado.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmostrasTab;

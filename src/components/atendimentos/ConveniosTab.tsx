import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Convenio {
  id: number;
  nome: string;
  plano: string;
  matricula: string;
  validade: string;
  titular: string;
  numeroAutorizacao: string;
  dataAutorizacao: string;
}

interface ConveniosTabProps {
  convenios: Convenio[];
  onAddConvenio: (convenio: Omit<Convenio, "id">) => void;
  onEditConvenio: (convenio: Convenio) => void;
  onDeleteConvenio: (id: number) => void;
}

const ConveniosTab = ({ convenios, onAddConvenio, onEditConvenio, onDeleteConvenio }: ConveniosTabProps) => {
  const [selectedConvenio, setSelectedConvenio] = useState<Convenio | null>(convenios[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Convenio>>({});

  const handleAddNew = () => {
    setIsEditing(true);
    setSelectedConvenio(null);
    setEditForm({
      nome: "",
      plano: "",
      matricula: "",
      validade: "",
      titular: "",
      numeroAutorizacao: "",
      dataAutorizacao: "",
    });
  };

  const handleEdit = () => {
    if (selectedConvenio) {
      setIsEditing(true);
      setEditForm(selectedConvenio);
    }
  };

  const handleSave = () => {
    if (editForm.nome && editForm.plano) {
      if (selectedConvenio) {
        onEditConvenio({ ...selectedConvenio, ...editForm } as Convenio);
      } else {
        onAddConvenio(editForm as Omit<Convenio, "id">);
      }
      setIsEditing(false);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de Convênios */}
      <div className="lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Convênios</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} disabled={!selectedConvenio}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => selectedConvenio && onDeleteConvenio(selectedConvenio.id)}
              disabled={!selectedConvenio}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {convenios.map((convenio) => (
            <Card
              key={convenio.id}
              className={`p-3 cursor-pointer transition-all ${
                selectedConvenio?.id === convenio.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => {
                setSelectedConvenio(convenio);
                setIsEditing(false);
              }}
            >
              <div className="font-medium text-foreground">{convenio.nome}</div>
              <div className="text-sm text-muted-foreground">{convenio.plano}</div>
            </Card>
          ))}

          {convenios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum convênio adicionado.
            </div>
          )}
        </div>
      </div>

      {/* Detalhes do Convênio */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {isEditing
              ? selectedConvenio
                ? "Editar Convênio"
                : "Novo Convênio"
              : "Detalhes do Convênio"}
          </h3>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="convenioNome">Convênio</Label>
                  <Input
                    id="convenioNome"
                    value={editForm.nome || ""}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="plano">Plano</Label>
                  <Input
                    id="plano"
                    value={editForm.plano || ""}
                    onChange={(e) => setEditForm({ ...editForm, plano: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={editForm.matricula || ""}
                    onChange={(e) => setEditForm({ ...editForm, matricula: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="validade">Validade</Label>
                  <Input
                    id="validade"
                    type="date"
                    value={editForm.validade || ""}
                    onChange={(e) => setEditForm({ ...editForm, validade: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="titular">Titular</Label>
                  <Input
                    id="titular"
                    value={editForm.titular || ""}
                    onChange={(e) => setEditForm({ ...editForm, titular: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroAutorizacao">Nº Autorização</Label>
                  <Input
                    id="numeroAutorizacao"
                    value={editForm.numeroAutorizacao || ""}
                    onChange={(e) => setEditForm({ ...editForm, numeroAutorizacao: e.target.value })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="dataAutorizacao">Data Autorização</Label>
                  <Input
                    id="dataAutorizacao"
                    type="date"
                    value={editForm.dataAutorizacao || ""}
                    onChange={(e) => setEditForm({ ...editForm, dataAutorizacao: e.target.value })}
                    className="input-premium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button className="btn-primary-premium" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          ) : selectedConvenio ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Convênio</Label>
                <p className="font-medium text-foreground">{selectedConvenio.nome}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Plano</Label>
                <p className="font-medium text-foreground">{selectedConvenio.plano}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Matrícula</Label>
                <p className="font-medium text-foreground">{selectedConvenio.matricula}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Validade</Label>
                <p className="font-medium text-foreground">
                  {selectedConvenio.validade
                    ? new Date(selectedConvenio.validade).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Titular</Label>
                <p className="font-medium text-foreground">{selectedConvenio.titular || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nº Autorização</Label>
                <p className="font-medium text-foreground">{selectedConvenio.numeroAutorizacao || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data Autorização</Label>
                <p className="font-medium text-foreground">
                  {selectedConvenio.dataAutorizacao
                    ? new Date(selectedConvenio.dataAutorizacao).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Selecione um convênio para ver os detalhes.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConveniosTab;

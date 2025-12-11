import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  selected?: boolean;
}

const mockMedicos: Medico[] = [
  { id: 1, nome: "Dr. Carlos Mendes", crm: "CRM-SP 123456", especialidade: "Clínico Geral" },
  { id: 2, nome: "Dra. Ana Paula Costa", crm: "CRM-SP 234567", especialidade: "Cardiologia" },
  { id: 3, nome: "Dr. Ricardo Souza", crm: "CRM-SP 345678", especialidade: "Ortopedia" },
  { id: 4, nome: "Dra. Mariana Rocha", crm: "CRM-SP 456789", especialidade: "Dermatologia" },
  { id: 5, nome: "Dr. Fernando Gomes", crm: "CRM-SP 567890", especialidade: "Neurologia" },
];

interface MedicosTabProps {
  selectedMedicos: Medico[];
  onChangeMedicos: (medicos: Medico[]) => void;
}

const MedicosTab = ({ selectedMedicos, onChangeMedicos }: MedicosTabProps) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredMedicos = mockMedicos.filter(
    (m) =>
      !selectedMedicos.find((sm) => sm.id === m.id) &&
      (m.nome.toLowerCase().includes(search.toLowerCase()) ||
        m.crm.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddMedico = (medico: Medico) => {
    onChangeMedicos([...selectedMedicos, { ...medico, selected: false }]);
    setSearch("");
    setShowSearch(false);
  };

  const handleRemoveMedico = (id: number) => {
    onChangeMedicos(selectedMedicos.filter((m) => m.id !== id));
  };

  const handleToggleSelection = (id: number) => {
    onChangeMedicos(
      selectedMedicos.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Médicos Solicitantes</h3>
          <p className="text-sm text-muted-foreground">
            Vincule os médicos solicitantes a esta requisição.
          </p>
        </div>
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="btn-primary-premium"
        >
          <Plus className="h-4 w-4" />
          Adicionar Médico
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CRM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-premium"
              autoFocus
            />
          </div>

          {search.length >= 2 && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {filteredMedicos.map((medico) => (
                <div
                  key={medico.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => handleAddMedico(medico)}
                >
                  <div>
                    <div className="font-medium text-foreground">{medico.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {medico.crm} • {medico.especialidade}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-primary" />
                </div>
              ))}

              {filteredMedicos.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum médico encontrado.
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Selected Medicos */}
      <div className="space-y-3">
        {selectedMedicos.map((medico) => (
          <Card
            key={medico.id}
            className={`p-4 transition-all ${
              medico.selected ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <Checkbox
                checked={medico.selected}
                onCheckedChange={() => handleToggleSelection(medico.id)}
              />

              <div className="flex-1">
                <div className="font-medium text-foreground">{medico.nome}</div>
                <div className="text-sm text-muted-foreground">
                  {medico.crm} • {medico.especialidade}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveMedico(medico.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {selectedMedicos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            Nenhum médico adicionado. Clique em "Adicionar Médico" para vincular.
          </div>
        )}
      </div>

      {/* Info */}
      {selectedMedicos.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Label className="text-sm text-primary font-medium">
            Médicos selecionados: {selectedMedicos.filter((m) => m.selected).length} de{" "}
            {selectedMedicos.length}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Marque os médicos que devem receber os laudos desta requisição.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicosTab;

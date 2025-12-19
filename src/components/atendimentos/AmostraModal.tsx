import { useState, useEffect } from "react";
import { FlaskConical, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Amostra {
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

interface AmostraModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (amostra: Omit<Amostra, "id"> | Amostra) => void;
  editingAmostra: Amostra | null;
  servicos: Servico[];
}

const AmostraModal = ({
  open,
  onClose,
  onSave,
  editingAmostra,
  servicos,
}: AmostraModalProps) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [servicosVinculados, setServicosVinculados] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ nome?: string }>({});

  useEffect(() => {
    if (editingAmostra) {
      setNome(editingAmostra.nome);
      setDescricao(editingAmostra.descricao);
      setServicosVinculados(editingAmostra.servicosVinculados);
    } else {
      setNome("");
      setDescricao("");
      setServicosVinculados([]);
    }
    setErrors({});
  }, [editingAmostra, open]);

  const handleToggleServico = (servicoId: number) => {
    setServicosVinculados((prev) =>
      prev.includes(servicoId)
        ? prev.filter((id) => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  const handleRemoveServico = (servicoId: number) => {
    setServicosVinculados((prev) => prev.filter((id) => id !== servicoId));
  };

  const handleSubmit = () => {
    const newErrors: { nome?: string } = {};

    if (!nome.trim()) {
      newErrors.nome = "O nome da amostra é obrigatório.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const amostraData = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      servicosVinculados,
      status: editingAmostra?.status || ("ativa" as const),
    };

    if (editingAmostra) {
      onSave({ ...amostraData, id: editingAmostra.id });
    } else {
      onSave(amostraData);
    }
  };

  const servicosSelecionados = servicosVinculados
    .map((id) => servicos.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            {editingAmostra ? "Editar Amostra" : "Adicionar Amostra"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome da Amostra <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errors.nome) setErrors({});
              }}
              placeholder="Ex: Sangue, Urina, Swab Nasal"
              className={errors.nome ? "border-destructive" : ""}
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição adicional sobre a amostra..."
              rows={2}
            />
          </div>

          {/* Serviços Selecionados */}
          {servicosSelecionados.length > 0 && (
            <div className="space-y-2">
              <Label>Serviços Selecionados</Label>
              <div className="flex flex-wrap gap-2">
                {servicosSelecionados.map((servico) => (
                  <Badge
                    key={servico!.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span>{servico!.descricao}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveServico(servico!.id)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Serviços */}
          <div className="space-y-2">
            <Label>Serviços Vinculados</Label>
            {servicos.length > 0 ? (
              <ScrollArea className="h-48 border rounded-md p-2">
                <div className="space-y-2">
                  {servicos
                    .filter((s) => s.situacao !== "cancelado")
                    .map((servico) => (
                      <div
                        key={servico.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          servicosVinculados.includes(servico.id)
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleToggleServico(servico.id)}
                      >
                        <Checkbox
                          checked={servicosVinculados.includes(servico.id)}
                          onCheckedChange={() => handleToggleServico(servico.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-primary">
                              {servico.mnemonico}
                            </span>
                            <span className="text-sm truncate">{servico.descricao}</span>
                          </div>
                        </div>
                        {servicosVinculados.includes(servico.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground border rounded-md">
                Nenhum serviço disponível. Adicione serviços na aba "Serviços" primeiro.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="btn-primary-premium">
            {editingAmostra ? "Salvar Alterações" : "Adicionar Amostra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AmostraModal;

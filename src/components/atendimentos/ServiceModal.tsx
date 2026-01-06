import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, X, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const medicosDisponiveis = [
  { id: "1", nome: "Dr. Carlos Mendes" },
  { id: "2", nome: "Dra. Ana Paula Costa" },
  { id: "3", nome: "Dr. Ricardo Souza" },
  { id: "4", nome: "Dra. Fernanda Lima" },
  { id: "5", nome: "Dr. João Oliveira" },
];

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

interface MockService {
  codigo: string;
  mnemonico: string;
  descricao: string;
  valor: number;
  recipiente: string;
}

const mockServices: MockService[] = [
  { codigo: "001", mnemonico: "HEMO", descricao: "Hemograma Completo", valor: 35.0, recipiente: "Tubo EDTA" },
  { codigo: "002", mnemonico: "GLIC", descricao: "Glicose", valor: 15.0, recipiente: "Tubo Fluoreto" },
  { codigo: "003", mnemonico: "UREA", descricao: "Ureia", valor: 18.0, recipiente: "Tubo Seco" },
  { codigo: "004", mnemonico: "CREA", descricao: "Creatinina", valor: 18.0, recipiente: "Tubo Seco" },
  { codigo: "005", mnemonico: "COL", descricao: "Colesterol Total", valor: 22.0, recipiente: "Tubo Seco" },
  { codigo: "006", mnemonico: "TGO", descricao: "Transaminase Oxalacética", valor: 20.0, recipiente: "Tubo Seco" },
  { codigo: "007", mnemonico: "TGP", descricao: "Transaminase Pirúvica", valor: 20.0, recipiente: "Tubo Seco" },
  { codigo: "KIT01", mnemonico: "KIT01", descricao: "Kit Check-up Básico", valor: 100.0, recipiente: "Diversos" },
];

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (servico: Omit<Servico, "id">) => void;
  editingServico: Servico | null;
}

const ServiceModal = ({ open, onClose, onSave, editingServico }: ServiceModalProps) => {
  const [mnemonico, setMnemonico] = useState("");
  const [selectedService, setSelectedService] = useState<MockService | null>(null);
  const [suggestions, setSuggestions] = useState<MockService[]>([]);
  const [convenio, setConvenio] = useState("Unimed");
  const [medicosSelecionados, setMedicosSelecionados] = useState<string[]>([]);
  const [medicosPopoverOpen, setMedicosPopoverOpen] = useState(false);
  const [urgencia, setUrgencia] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [showWarning, setShowWarning] = useState<string | null>(null);

  useEffect(() => {
    if (editingServico) {
      setMnemonico(editingServico.mnemonico);
      setSelectedService({
        codigo: editingServico.codigo,
        mnemonico: editingServico.mnemonico,
        descricao: editingServico.descricao,
        valor: editingServico.valor,
        recipiente: "Tubo EDTA",
      });
      setConvenio(editingServico.convenio);
      setMedicosSelecionados(editingServico.medicosSolicitantes || []);
      setUrgencia(editingServico.urgencia);
    } else {
      resetForm();
    }
  }, [editingServico, open]);

  const resetForm = () => {
    setMnemonico("");
    setSelectedService(null);
    setSuggestions([]);
    setConvenio("Unimed");
    setMedicosSelecionados([]);
    setUrgencia(false);
    setObservacoes("");
    setShowWarning(null);
  };

  const toggleMedico = (nome: string) => {
    setMedicosSelecionados(prev =>
      prev.includes(nome)
        ? prev.filter(m => m !== nome)
        : [...prev, nome]
    );
  };

  const removeMedico = (nome: string) => {
    setMedicosSelecionados(prev => prev.filter(m => m !== nome));
  };

  const handleMnemonicoChange = (value: string) => {
    setMnemonico(value.toUpperCase());
    if (value.length >= 2) {
      const filtered = mockServices.filter(
        (s) =>
          s.mnemonico.toLowerCase().includes(value.toLowerCase()) ||
          s.descricao.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectService = (service: MockService) => {
    setSelectedService(service);
    setMnemonico(service.mnemonico);
    setSuggestions([]);

    // Mock validation warnings
    if (service.mnemonico === "COL") {
      setShowWarning("Este exame requer jejum de 12 horas.");
    } else {
      setShowWarning(null);
    }
  };

  const handleSave = () => {
    if (!selectedService) return;

    onSave({
      codigo: selectedService.codigo,
      mnemonico: selectedService.mnemonico,
      descricao: selectedService.descricao,
      situacao: "aberto",
      urgencia,
      materialColhido: false,
      dataColeta: "",
      horaColeta: "",
      convenio,
      medicosSolicitantes: medicosSelecionados,
      valor: selectedService.valor,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingServico ? "Editar Serviço" : "Adicionar Serviço"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Mnemônico com autocomplete */}
          <div className="relative">
            <Label htmlFor="mnemonico">Mnemônico / Código</Label>
            <Input
              id="mnemonico"
              value={mnemonico}
              onChange={(e) => handleMnemonicoChange(e.target.value)}
              className="input-premium"
              placeholder="Digite o mnemônico ou descrição..."
              autoComplete="off"
            />

            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {suggestions.map((service) => (
                    <div
                      key={service.codigo}
                      className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-0"
                      onClick={() => handleSelectService(service)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-medium text-primary">
                            {service.mnemonico}
                          </span>
                          <span className="text-muted-foreground ml-2">-</span>
                          <span className="ml-2">{service.descricao}</span>
                        </div>
                        <span className="text-sm font-medium">
                          R$ {service.valor.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Serviço Selecionado */}
          {selectedService && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Descrição:</span>
                  <p className="font-medium">{selectedService.descricao}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Recipiente:</span>
                  <p className="font-medium">{selectedService.recipiente}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <p className="font-medium text-lg">
                    R$ {selectedService.valor.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {showWarning && (
            <div className="flex items-center gap-2 p-3 bg-ambar-suave/10 text-ambar-suave rounded-lg border border-ambar-suave/30">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{showWarning}</span>
            </div>
          )}

          {/* Convênio e Médico */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="convenio">Convênio</Label>
              <Select value={convenio} onValueChange={setConvenio}>
                <SelectTrigger className="input-premium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unimed">Unimed</SelectItem>
                  <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                  <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                  <SelectItem value="Amil">Amil</SelectItem>
                  <SelectItem value="Particular">Particular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="medico">Médico(s) Solicitante(s)</Label>
              <Popover open={medicosPopoverOpen} onOpenChange={setMedicosPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={medicosPopoverOpen}
                    className="w-full justify-between input-premium font-normal"
                  >
                    {medicosSelecionados.length === 0
                      ? "Selecione..."
                      : `${medicosSelecionados.length} médico(s) selecionado(s)`}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-popover border border-border z-50" align="start">
                  <div className="max-h-60 overflow-y-auto">
                    {medicosDisponiveis.map((medico) => (
                      <div
                        key={medico.id}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted"
                        onClick={() => toggleMedico(medico.nome)}
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                          medicosSelecionados.includes(medico.nome)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}>
                          {medicosSelecionados.includes(medico.nome) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm">{medico.nome}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Tags dos médicos selecionados */}
              {medicosSelecionados.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {medicosSelecionados.map((nome) => (
                    <Badge
                      key={nome}
                      variant="secondary"
                      className="text-xs py-0.5 pl-2 pr-1 flex items-center gap-1"
                    >
                      {nome}
                      <button
                        type="button"
                        onClick={() => removeMedico(nome)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Urgência */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="urgencia"
              checked={urgencia}
              onCheckedChange={(checked) => setUrgencia(checked === true)}
            />
            <Label htmlFor="urgencia" className="cursor-pointer">
              Marcar como urgente
            </Label>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="input-premium min-h-[80px]"
              placeholder="Observações adicionais..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="btn-primary-premium"
            onClick={handleSave}
            disabled={!selectedService}
          >
            {editingServico ? "Salvar Alterações" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;

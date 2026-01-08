import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface LancamentoCaixaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    tipo: "entrada" | "saida";
    valor: number;
    motivo: string;
    observacoes: string;
  }) => void;
}

const motivosEntrada = [
  "Troco recebido de outra unidade",
  "Reforço de caixa",
  "Devolução de despesa",
  "Recebimento de terceiros",
  "Outro",
];

const motivosSaida = [
  "Sangria para banco",
  "Sangria para cofre",
  "Pagamento de despesa",
  "Troco para outra unidade",
  "Outro",
];

const LancamentoCaixaModal = ({ open, onOpenChange, onConfirm }: LancamentoCaixaModalProps) => {
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const motivos = tipo === "entrada" ? motivosEntrada : motivosSaida;

  const handleConfirm = () => {
    const valorNumerico = parseFloat(valor);

    if (!valorNumerico || valorNumerico <= 0) {
      toast({
        title: "Atenção",
        description: "Informe um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!motivo) {
      toast({
        title: "Motivo obrigatório",
        description: "Selecione ou informe o motivo do lançamento.",
        variant: "destructive",
      });
      return;
    }

    onConfirm({
      tipo,
      valor: valorNumerico,
      motivo,
      observacoes: observacoes.trim(),
    });

    // Reset form
    setTipo("entrada");
    setValor("");
    setMotivo("");
    setObservacoes("");
  };

  const handleTipoChange = (newTipo: "entrada" | "saida") => {
    setTipo(newTipo);
    setMotivo(""); // Reset motivo when tipo changes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Lançamento Manual no Caixa
          </DialogTitle>
          <DialogDescription>
            Registre entradas ou saídas manuais no caixa da unidade. Esses lançamentos não impactam os registros individuais dos atendentes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tipo de Lançamento */}
          <div className="space-y-2">
            <Label>Tipo de Lançamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={tipo === "entrada" ? "default" : "outline"}
                className={tipo === "entrada" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                onClick={() => handleTipoChange("entrada")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Entrada
              </Button>
              <Button
                type="button"
                variant={tipo === "saida" ? "default" : "outline"}
                className={tipo === "saida" ? "bg-destructive hover:bg-destructive/90" : ""}
                onClick={() => handleTipoChange("saida")}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Saída
              </Button>
            </div>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo" className="flex items-center gap-2">
              Motivo
              <span className="text-destructive">*</span>
            </Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {motivos.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Detalhes adicionais sobre o lançamento..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Aviso */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Lançamentos manuais impactam apenas o caixa da unidade. Para movimentações de atendimentos, utilize o fluxo de Receitas a Receber.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className={tipo === "entrada" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
          >
            {tipo === "entrada" ? (
              <><TrendingUp className="h-4 w-4 mr-2" /> Confirmar Entrada</>
            ) : (
              <><TrendingDown className="h-4 w-4 mr-2" /> Confirmar Saída</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LancamentoCaixaModal;

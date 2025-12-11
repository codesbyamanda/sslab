import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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

interface Lancamento {
  id: number;
  data: string;
  formaRecebimento: string;
  valor: number;
  observacoes: string;
}

interface LancamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lancamento: Lancamento | null;
  onSave: (lancamento: Lancamento) => void;
}

const LancamentoModal = ({ open, onOpenChange, lancamento, onSave }: LancamentoModalProps) => {
  const [data, setData] = useState("");
  const [formaRecebimento, setFormaRecebimento] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (lancamento) {
      setData(lancamento.data);
      setFormaRecebimento(lancamento.formaRecebimento);
      setValor(lancamento.valor.toString());
      setObservacoes(lancamento.observacoes);
    } else {
      setData(new Date().toISOString().split('T')[0]);
      setFormaRecebimento("");
      setValor("");
      setObservacoes("");
    }
  }, [lancamento, open]);

  const handleSave = () => {
    onSave({
      id: lancamento?.id || 0,
      data,
      formaRecebimento,
      valor: parseFloat(valor) || 0,
      observacoes
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {lancamento ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dataLancamento">Data *</Label>
            <Input
              id="dataLancamento"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formaRecebimento">Forma de Recebimento *</Label>
            <Select value={formaRecebimento} onValueChange={setFormaRecebimento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorLancamento">Valor (R$) *</Label>
            <Input
              id="valorLancamento"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoesLancamento">Observações</Label>
            <Textarea
              id="observacoesLancamento"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações sobre o lançamento..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!data || !formaRecebimento || !valor}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LancamentoModal;

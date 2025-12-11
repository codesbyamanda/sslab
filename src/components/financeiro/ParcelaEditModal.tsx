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

interface Parcela {
  id: number;
  numero: number;
  dataVencimento: string;
  valor: number;
  situacao: "Aberto" | "Parcial" | "Quitado";
}

interface ParcelaEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parcela: Parcela | null;
  onSave: (parcela: Parcela) => void;
}

const ParcelaEditModal = ({ open, onOpenChange, parcela, onSave }: ParcelaEditModalProps) => {
  const [dataVencimento, setDataVencimento] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (parcela) {
      setDataVencimento(parcela.dataVencimento);
      setValor(parcela.valor.toString());
    }
  }, [parcela]);

  const handleSave = () => {
    if (!parcela) return;
    
    onSave({
      ...parcela,
      dataVencimento,
      valor: parseFloat(valor) || 0
    });
  };

  if (!parcela) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Parcela #{parcela.numero}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dataVencimentoParcela">Data de Vencimento</Label>
            <Input
              id="dataVencimentoParcela"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorParcela">Valor (R$)</Label>
            <Input
              id="valorParcela"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Ao alterar o valor desta parcela, as parcelas seguintes serão recalculadas automaticamente para manter o valor total.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelaEditModal;

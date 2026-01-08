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
import { toast } from "@/hooks/use-toast";
import { Unlock, User, DollarSign } from "lucide-react";

interface NovoRegistroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { atendente: string; saldoInicial: number }) => void;
}

const NovoRegistroModal = ({ open, onOpenChange, onConfirm }: NovoRegistroModalProps) => {
  const [atendente, setAtendente] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("0");

  const handleConfirm = () => {
    if (!atendente.trim()) {
      toast({
        title: "Atenção",
        description: "Informe o nome do atendente.",
        variant: "destructive",
      });
      return;
    }

    onConfirm({
      atendente: atendente.trim(),
      saldoInicial: parseFloat(saldoInicial) || 0,
    });

    // Reset form
    setAtendente("");
    setSaldoInicial("0");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-primary" />
            Abrir Novo Registro de Caixa
          </DialogTitle>
          <DialogDescription>
            Inicie um novo registro de caixa para o atendente. Cada atendente pode ter apenas um registro aberto por vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="atendente" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Atendente
            </Label>
            <Input
              id="atendente"
              placeholder="Nome do atendente"
              value={atendente}
              onChange={(e) => setAtendente(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saldoInicial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Saldo Inicial (Fundo de Troco)
            </Label>
            <Input
              id="saldoInicial"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Valor em dinheiro disponível para troco no início do turno.
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Data/Hora de Abertura:</strong>{" "}
              {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <Unlock className="h-4 w-4 mr-2" />
            Abrir Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoRegistroModal;

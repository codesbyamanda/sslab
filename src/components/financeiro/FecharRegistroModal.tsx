import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle, Banknote, CreditCard, FileText } from "lucide-react";
import { useState } from "react";

interface RegistroData {
  id: number;
  codigo: string;
  atendente: string;
  valorDinheiro: number;
  valorCartao: number;
  valorCheque: number;
  total: number;
  periodoAbertura: string;
}

interface FecharRegistroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registro: RegistroData | null;
  onConfirm: (imprimir: boolean) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

const FecharRegistroModal = ({ open, onOpenChange, registro, onConfirm }: FecharRegistroModalProps) => {
  const [imprimir, setImprimir] = useState(true);

  if (!registro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Fechar Registro de Caixa
          </DialogTitle>
          <DialogDescription>
            Ao fechar este registro, os valores serão consolidados no Caixa da unidade e não poderão mais receber movimentações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações do Registro */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Registro</p>
              <p className="font-semibold">{registro.codigo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Atendente</p>
              <p className="font-semibold">{registro.atendente}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Período</p>
              <p className="font-medium text-sm">
                {registro.periodoAbertura} até {new Date().toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Resumo de Valores */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Resumo de Valores</p>
            <div className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Banknote className="h-4 w-4 text-emerald-600" />
                  Dinheiro
                </span>
                <span className="font-medium text-emerald-600">{formatCurrency(registro.valorDinheiro)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Cartão
                </span>
                <span className="font-medium text-blue-600">{formatCurrency(registro.valorCartao)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4 text-amber-600" />
                  Cheque
                </span>
                <span className="font-medium text-amber-600">{formatCurrency(registro.valorCheque)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex items-center justify-between">
                <span className="font-semibold">Total a Consolidar</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(registro.total)}</span>
              </div>
            </div>
          </div>

          {/* Opção de Impressão */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="imprimir" 
              checked={imprimir} 
              onCheckedChange={(checked) => setImprimir(checked as boolean)} 
            />
            <Label htmlFor="imprimir" className="flex items-center gap-2 text-sm cursor-pointer">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Imprimir relatório de movimentação após fechar
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(imprimir)}>
            <Lock className="h-4 w-4 mr-2" />
            Fechar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FecharRegistroModal;

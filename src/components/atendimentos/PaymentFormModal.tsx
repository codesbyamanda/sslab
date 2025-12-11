import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { CreditCard, Banknote, Receipt, Percent } from "lucide-react";

export interface Payment {
  id: number;
  data: string;
  valor: number;
  formaPagamento: "dinheiro" | "credito" | "debito" | "cheque" | "desconto";
  operadora?: string;
  desconto: number;
  situacao: "normal" | "estornado";
  observacoes: string;
  // Cheque fields
  chequeEmitente?: string;
  chequeBanco?: string;
  chequeAgencia?: string;
  chequeConta?: string;
  chequeNumero?: string;
  chequeDataCompensacao?: string;
  // Desconto fields
  motivoDesconto?: string;
}

interface PaymentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payment: Omit<Payment, "id" | "situacao">) => void;
  onSaveAndNew: (payment: Omit<Payment, "id" | "situacao">) => void;
  editingPayment: Payment | null;
  valorPendente: number;
}

const PaymentFormModal = ({
  open,
  onClose,
  onSave,
  onSaveAndNew,
  editingPayment,
  valorPendente,
}: PaymentFormModalProps) => {
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<Payment["formaPagamento"]>("dinheiro");
  const [operadora, setOperadora] = useState("");
  const [desconto, setDesconto] = useState("0");
  const [observacoes, setObservacoes] = useState("");

  // Cheque fields
  const [chequeEmitente, setChequeEmitente] = useState("");
  const [chequeBanco, setChequeBanco] = useState("");
  const [chequeAgencia, setChequeAgencia] = useState("");
  const [chequeConta, setChequeConta] = useState("");
  const [chequeNumero, setChequeNumero] = useState("");
  const [chequeDataCompensacao, setChequeDataCompensacao] = useState("");

  // Desconto fields
  const [motivoDesconto, setMotivoDesconto] = useState("");

  useEffect(() => {
    if (editingPayment) {
      setData(editingPayment.data);
      setValor(editingPayment.valor.toString());
      setFormaPagamento(editingPayment.formaPagamento);
      setOperadora(editingPayment.operadora || "");
      setDesconto(editingPayment.desconto.toString());
      setObservacoes(editingPayment.observacoes);
      setChequeEmitente(editingPayment.chequeEmitente || "");
      setChequeBanco(editingPayment.chequeBanco || "");
      setChequeAgencia(editingPayment.chequeAgencia || "");
      setChequeConta(editingPayment.chequeConta || "");
      setChequeNumero(editingPayment.chequeNumero || "");
      setChequeDataCompensacao(editingPayment.chequeDataCompensacao || "");
      setMotivoDesconto(editingPayment.motivoDesconto || "");
    } else {
      resetForm();
      setValor(valorPendente.toFixed(2));
    }
  }, [editingPayment, open, valorPendente]);

  const resetForm = () => {
    setData(new Date().toISOString().split("T")[0]);
    setValor("");
    setFormaPagamento("dinheiro");
    setOperadora("");
    setDesconto("0");
    setObservacoes("");
    setChequeEmitente("");
    setChequeBanco("");
    setChequeAgencia("");
    setChequeConta("");
    setChequeNumero("");
    setChequeDataCompensacao("");
    setMotivoDesconto("");
  };

  const buildPayment = (): Omit<Payment, "id" | "situacao"> => ({
    data,
    valor: parseFloat(valor) || 0,
    formaPagamento,
    operadora: formaPagamento === "credito" || formaPagamento === "debito" ? operadora : undefined,
    desconto: parseFloat(desconto) || 0,
    observacoes,
    chequeEmitente: formaPagamento === "cheque" ? chequeEmitente : undefined,
    chequeBanco: formaPagamento === "cheque" ? chequeBanco : undefined,
    chequeAgencia: formaPagamento === "cheque" ? chequeAgencia : undefined,
    chequeConta: formaPagamento === "cheque" ? chequeConta : undefined,
    chequeNumero: formaPagamento === "cheque" ? chequeNumero : undefined,
    chequeDataCompensacao: formaPagamento === "cheque" ? chequeDataCompensacao : undefined,
    motivoDesconto: formaPagamento === "desconto" ? motivoDesconto : undefined,
  });

  const handleSave = () => {
    onSave(buildPayment());
    onClose();
  };

  const handleSaveAndNew = () => {
    onSaveAndNew(buildPayment());
    resetForm();
    setValor(valorPendente.toFixed(2));
  };

  const getFormaPagamentoIcon = (forma: string) => {
    switch (forma) {
      case "dinheiro":
        return <Banknote className="h-4 w-4" />;
      case "credito":
      case "debito":
        return <CreditCard className="h-4 w-4" />;
      case "cheque":
        return <Receipt className="h-4 w-4" />;
      case "desconto":
        return <Percent className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPayment ? "Editar Pagamento" : "Adicionar Pagamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Data e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataPagamento">Data do Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="input-premium"
              />
            </div>
            <div>
              <Label htmlFor="valorPagamento">Valor (R$)</Label>
              <Input
                id="valorPagamento"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="input-premium"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <Select
              value={formaPagamento}
              onValueChange={(v) => setFormaPagamento(v as Payment["formaPagamento"])}
            >
              <SelectTrigger className="input-premium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Dinheiro
                  </div>
                </SelectItem>
                <SelectItem value="credito">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </div>
                </SelectItem>
                <SelectItem value="debito">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Débito
                  </div>
                </SelectItem>
                <SelectItem value="cheque">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Cheque
                  </div>
                </SelectItem>
                <SelectItem value="desconto">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Desconto
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos condicionais - Cartão */}
          {(formaPagamento === "credito" || formaPagamento === "debito") && (
            <div>
              <Label htmlFor="operadora">Operadora</Label>
              <Select value={operadora} onValueChange={setOperadora}>
                <SelectTrigger className="input-premium">
                  <SelectValue placeholder="Selecione a operadora..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="elo">Elo</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="hipercard">Hipercard</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Campos condicionais - Cheque */}
          {formaPagamento === "cheque" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="font-medium text-sm text-foreground">Dados do Cheque</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="chequeEmitente">Nome do Emitente</Label>
                  <Input
                    id="chequeEmitente"
                    value={chequeEmitente}
                    onChange={(e) => setChequeEmitente(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="chequeBanco">Banco</Label>
                  <Input
                    id="chequeBanco"
                    value={chequeBanco}
                    onChange={(e) => setChequeBanco(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="chequeAgencia">Agência</Label>
                  <Input
                    id="chequeAgencia"
                    value={chequeAgencia}
                    onChange={(e) => setChequeAgencia(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="chequeConta">Conta</Label>
                  <Input
                    id="chequeConta"
                    value={chequeConta}
                    onChange={(e) => setChequeConta(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <Label htmlFor="chequeNumero">Nº do Cheque</Label>
                  <Input
                    id="chequeNumero"
                    value={chequeNumero}
                    onChange={(e) => setChequeNumero(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="chequeDataCompensacao">Data de Compensação</Label>
                  <Input
                    id="chequeDataCompensacao"
                    type="date"
                    value={chequeDataCompensacao}
                    onChange={(e) => setChequeDataCompensacao(e.target.value)}
                    className="input-premium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Campos condicionais - Desconto */}
          {formaPagamento === "desconto" && (
            <div>
              <Label htmlFor="motivoDesconto">Motivo do Desconto</Label>
              <Textarea
                id="motivoDesconto"
                value={motivoDesconto}
                onChange={(e) => setMotivoDesconto(e.target.value)}
                className="input-premium min-h-[80px]"
                placeholder="Informe o motivo do desconto..."
              />
            </div>
          )}

          {/* Desconto adicional */}
          {formaPagamento !== "desconto" && (
            <div>
              <Label htmlFor="descontoValor">Desconto (R$)</Label>
              <Input
                id="descontoValor"
                type="number"
                step="0.01"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                className="input-premium"
                placeholder="0,00"
              />
            </div>
          )}

          {/* Observações */}
          <div>
            <Label htmlFor="observacoesPagamento">Observações</Label>
            <Textarea
              id="observacoesPagamento"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="input-premium min-h-[60px]"
              placeholder="Observações adicionais..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleSaveAndNew}>
            Salvar e Novo (F7)
          </Button>
          <Button className="btn-primary-premium" onClick={handleSave}>
            Salvar (F6)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFormModal;

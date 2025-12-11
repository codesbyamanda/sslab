import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit, XCircle, AlertTriangle, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PaymentFormModal, { Payment } from "./PaymentFormModal";

interface PaymentsModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  valorTotal: number;
  pacienteNome: string;
  requisicaoNumero: string;
}

const getFormaPagamentoLabel = (forma: string) => {
  const labels: Record<string, string> = {
    dinheiro: "Dinheiro",
    credito: "Cartão de Crédito",
    debito: "Cartão de Débito",
    cheque: "Cheque",
    desconto: "Desconto",
  };
  return labels[forma] || forma;
};

const PaymentsModal = ({
  open,
  onClose,
  onComplete,
  valorTotal,
  pacienteNome,
  requisicaoNumero,
}: PaymentsModalProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [showEstornoConfirm, setShowEstornoConfirm] = useState(false);
  const [paymentToEstorno, setPaymentToEstorno] = useState<Payment | null>(null);
  const [nextId, setNextId] = useState(1);

  const totalPago = payments
    .filter((p) => p.situacao === "normal")
    .reduce((acc, p) => acc + p.valor - p.desconto, 0);

  const valorPendente = valorTotal - totalPago;

  const handleAddPayment = (payment: Omit<Payment, "id" | "situacao">) => {
    setPayments([
      ...payments,
      { ...payment, id: nextId, situacao: "normal" },
    ]);
    setNextId((prev) => prev + 1);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const handleUpdatePayment = (payment: Omit<Payment, "id" | "situacao">) => {
    if (editingPayment) {
      setPayments(
        payments.map((p) =>
          p.id === editingPayment.id
            ? { ...payment, id: editingPayment.id, situacao: editingPayment.situacao }
            : p
        )
      );
      setEditingPayment(null);
    }
  };

  const handleEstornoClick = (payment: Payment) => {
    setPaymentToEstorno(payment);
    setShowEstornoConfirm(true);
  };

  const handleConfirmEstorno = () => {
    if (paymentToEstorno) {
      setPayments(
        payments.map((p) =>
          p.id === paymentToEstorno.id
            ? { ...p, situacao: "estornado" as const }
            : p
        )
      );
    }
    setShowEstornoConfirm(false);
    setPaymentToEstorno(null);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Pagamentos</span>
              <span className="text-sm font-normal text-muted-foreground">
                - {requisicaoNumero}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Info do Paciente e Valores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card-premium p-4">
                <p className="text-sm text-muted-foreground">Paciente</p>
                <p className="font-semibold text-foreground">{pacienteNome}</p>
              </div>
              <div className="card-premium p-4">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-semibold text-foreground text-lg">
                  R$ {valorTotal.toFixed(2)}
                </p>
              </div>
              <div className="card-premium p-4">
                <p className="text-sm text-muted-foreground">Valor Pendente</p>
                <p
                  className={`font-semibold text-lg ${
                    valorPendente > 0
                      ? "text-vermelho-moderno"
                      : valorPendente < 0
                      ? "text-ambar-suave"
                      : "text-verde-clinico"
                  }`}
                >
                  R$ {valorPendente.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Botão Adicionar */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Pagamentos Realizados
              </h3>
              <Button
                onClick={() => {
                  setEditingPayment(null);
                  setShowPaymentForm(true);
                }}
                className="btn-primary-premium"
              >
                <Plus className="h-4 w-4" />
                Adicionar Pagamento
              </Button>
            </div>

            {/* Grid de Pagamentos */}
            <div className="card-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Forma de Pagamento</th>
                      <th>Operadora</th>
                      <th>Desconto</th>
                      <th>Situação</th>
                      <th>Observações</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className={
                          payment.situacao === "estornado"
                            ? "bg-vermelho-moderno/10"
                            : ""
                        }
                      >
                        <td>
                          {new Date(payment.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="font-medium">
                          R$ {payment.valor.toFixed(2)}
                        </td>
                        <td>{getFormaPagamentoLabel(payment.formaPagamento)}</td>
                        <td>{payment.operadora || "-"}</td>
                        <td>
                          {payment.desconto > 0
                            ? `R$ ${payment.desconto.toFixed(2)}`
                            : "-"}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                              payment.situacao === "normal"
                                ? "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30"
                                : "bg-vermelho-moderno/20 text-vermelho-moderno border border-vermelho-moderno/30"
                            }`}
                          >
                            {payment.situacao === "normal" ? "Normal" : "Estornado"}
                          </span>
                        </td>
                        <td className="max-w-[150px] truncate">
                          {payment.observacoes || "-"}
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                                  onClick={() => handleEditPayment(payment)}
                                  disabled={payment.situacao === "estornado"}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleEstornoClick(payment)}
                                  disabled={payment.situacao === "estornado"}
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Estornar</TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {payments.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum pagamento registrado. Clique em "Adicionar Pagamento"
                  para começar.
                </div>
              )}
            </div>

            {/* Resumo */}
            {payments.length > 0 && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total de Pagamentos:{" "}
                      <span className="font-medium text-foreground">
                        {payments.filter((p) => p.situacao === "normal").length}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Pago:{" "}
                      <span className="font-medium text-foreground">
                        R$ {totalPago.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  {valorPendente === 0 && (
                    <div className="flex items-center gap-2 text-verde-clinico">
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">Pagamento Completo</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="btn-primary-premium"
              onClick={handleComplete}
              disabled={valorPendente > 0}
            >
              Concluir Pagamentos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Form Modal */}
      <PaymentFormModal
        open={showPaymentForm}
        onClose={() => {
          setShowPaymentForm(false);
          setEditingPayment(null);
        }}
        onSave={editingPayment ? handleUpdatePayment : handleAddPayment}
        onSaveAndNew={handleAddPayment}
        editingPayment={editingPayment}
        valorPendente={valorPendente}
      />

      {/* Estorno Confirmation */}
      <AlertDialog open={showEstornoConfirm} onOpenChange={setShowEstornoConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-ambar-suave" />
              Confirmar Estorno
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente estornar este pagamento de{" "}
              <strong>R$ {paymentToEstorno?.valor.toFixed(2)}</strong>?
              <br />
              <br />
              Esta ação irá marcar o pagamento como estornado e recalcular os
              valores do caixa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmEstorno}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Estorno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentsModal;

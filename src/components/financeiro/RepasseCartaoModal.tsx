import { HandCoins, CreditCard, Calendar, Calculator, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TransacaoOriginal {
  data: string;
  portador: string;
}

interface Repasse {
  id: number;
  dataPrevista: string;
  dataRecebida: string | null;
  adquirente: string;
  bandeira: string;
  tipo: string;
  numeroTransacao: string;
  parcela: string;
  valorBruto: number;
  taxa: number;
  valorLiquido: number;
  situacao: string;
  transacaoOriginal: TransacaoOriginal;
}

interface RepasseCartaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repasse: Repasse | null;
}

const RepasseCartaoModal = ({ open, onOpenChange, repasse }: RepasseCartaoModalProps) => {
  if (!repasse) return null;

  const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "-";
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Previsto":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">{situacao}</Badge>;
      case "Recebido":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{situacao}</Badge>;
      case "Atrasado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{situacao}</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">{situacao}</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-primary" />
            Detalhes do Repasse
            <div className="ml-2">{getSituacaoBadge(repasse.situacao)}</div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Transação Original */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Transação Original
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nº da Transação</p>
                  <p className="font-mono font-medium">{repasse.numeroTransacao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data da Venda</p>
                  <p className="font-medium">{formatDate(repasse.transacaoOriginal.data)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Portador</p>
                  <p className="font-medium">{repasse.transacaoOriginal.portador}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parcela</p>
                  <Badge variant="secondary">{repasse.parcela}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Adquirente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Informações do Repasse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Adquirente</p>
                  <p className="font-medium">{repasse.adquirente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bandeira</p>
                  <p className="font-medium">{repasse.bandeira}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Operação</p>
                  <p className="font-medium">{repasse.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Aplicada</p>
                  <p className="font-medium text-red-600">{repasse.taxa}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Prazos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data Prevista</p>
                  <p className="font-medium">{formatDate(repasse.dataPrevista)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Recebida</p>
                  <p className={`font-medium ${repasse.dataRecebida ? "text-green-600" : "text-muted-foreground"}`}>
                    {formatDate(repasse.dataRecebida)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valores */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Cálculo do Repasse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor Bruto</span>
                  <span className="font-medium">{formatCurrency(repasse.valorBruto)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa ({repasse.taxa}%)</span>
                  <span className="font-medium text-red-600">
                    - {formatCurrency(repasse.valorBruto * repasse.taxa / 100)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valor Líquido</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(repasse.valorLiquido)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerta de Atraso */}
          {repasse.situacao === "Atrasado" && (
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-600">Repasse Atrasado</p>
                    <p className="text-sm text-muted-foreground">
                      Este repasse estava previsto para {formatDate(repasse.dataPrevista)} e ainda não foi recebido. 
                      Entre em contato com a operadora {repasse.adquirente} para verificar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {repasse.situacao === "Contestado" && (
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardContent className="py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-600">Transação Contestada</p>
                    <p className="text-sm text-muted-foreground">
                      O portador do cartão contestou esta transação. O repasse está suspenso até a resolução da disputa.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          {repasse.situacao === "Previsto" && (
            <Button>Confirmar Recebimento</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepasseCartaoModal;

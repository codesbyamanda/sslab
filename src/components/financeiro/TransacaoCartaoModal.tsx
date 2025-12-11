import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Transacao {
  id: number;
  data: string;
  bandeira: string;
  adquirente: string;
  tipo: string;
  parcelas: number;
  valorBruto: number;
  taxa: number;
  valorLiquido: number;
  previsaoRepasse: string;
  situacao: string;
  portador: string;
  observacoes: string;
}

interface TransacaoCartaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transacao: Transacao | null;
}

const bandeiras = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard", "Diners"];
const adquirentes = ["Cielo", "Rede", "Stone", "PagSeguro", "Getnet", "Safrapay"];
const tiposOperacao = [
  { value: "Débito", taxa: 1.8 },
  { value: "Crédito", taxa: 2.5 },
  { value: "Parcelado Loja", taxa: 3.2 },
  { value: "Parcelado Juros", taxa: 4.0 },
];

const TransacaoCartaoModal = ({ open, onOpenChange, transacao }: TransacaoCartaoModalProps) => {
  const [data, setData] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [adquirente, setAdquirente] = useState("");
  const [tipo, setTipo] = useState("");
  const [parcelas, setParcelas] = useState("1");
  const [valorBruto, setValorBruto] = useState("");
  const [taxa, setTaxa] = useState("");
  const [valorLiquido, setValorLiquido] = useState("");
  const [previsaoRepasse, setPrevisaoRepasse] = useState("");
  const [situacao, setSituacao] = useState("");
  const [portador, setPortador] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (transacao) {
      setData(transacao.data);
      setBandeira(transacao.bandeira);
      setAdquirente(transacao.adquirente);
      setTipo(transacao.tipo);
      setParcelas(transacao.parcelas.toString());
      setValorBruto(transacao.valorBruto.toString());
      setTaxa(transacao.taxa.toString());
      setValorLiquido(transacao.valorLiquido.toString());
      setPrevisaoRepasse(transacao.previsaoRepasse);
      setSituacao(transacao.situacao);
      setPortador(transacao.portador);
      setObservacoes(transacao.observacoes);
    }
  }, [transacao, open]);

  useEffect(() => {
    const tipoSelecionado = tiposOperacao.find(t => t.value === tipo);
    if (tipoSelecionado) {
      setTaxa(tipoSelecionado.taxa.toString());
    }
  }, [tipo]);

  useEffect(() => {
    const bruto = parseFloat(valorBruto) || 0;
    const taxaNum = parseFloat(taxa) || 0;
    const liquido = bruto - (bruto * taxaNum / 100);
    setValorLiquido(liquido.toFixed(2));
  }, [valorBruto, taxa]);

  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleSave = () => {
    toast({
      title: "Transação atualizada",
      description: "As informações da transação foram salvas com sucesso.",
    });
    onOpenChange(false);
  };

  const getSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{sit}</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{sit}</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{sit}</Badge>;
      default:
        return <Badge variant="outline">{sit}</Badge>;
    }
  };

  if (!transacao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Transação de Cartão
            <div className="ml-2">{getSituacaoBadge(situacao)}</div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da Operação</Label>
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Portador</Label>
              <Input value={portador} onChange={(e) => setPortador(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Select value={bandeira} onValueChange={setBandeira}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bandeiras.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Adquirente</Label>
              <Select value={adquirente} onValueChange={setAdquirente}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {adquirentes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Operação</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tiposOperacao.map(t => <SelectItem key={t.value} value={t.value}>{t.value}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantidade de Parcelas</Label>
              <Select value={parcelas} onValueChange={setParcelas}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Previsão de Repasse</Label>
              <Input type="date" value={previsaoRepasse} onChange={(e) => setPrevisaoRepasse(e.target.value)} />
            </div>
          </div>

          <Separator />

          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <p className="text-sm font-medium mb-4">Cálculo de Valores</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valor Bruto (R$)</Label>
                  <Input type="number" step="0.01" value={valorBruto} onChange={(e) => setValorBruto(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Taxa (%)</Label>
                  <Input type="number" step="0.01" value={taxa} onChange={(e) => setTaxa(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Valor Líquido (R$)</Label>
                  <Input type="number" step="0.01" value={valorLiquido} disabled className="bg-muted font-bold text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>Situação</Label>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Compensado">Compensado</SelectItem>
                <SelectItem value="Contestado">Contestado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransacaoCartaoModal;

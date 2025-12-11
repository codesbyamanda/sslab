import { useState, useEffect } from "react";
import { Landmark, FileCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Cheque {
  id: number;
  numero: string;
  emitente: string;
  valor: number;
}

interface Deposito {
  id: number;
  data: string;
  banco: string;
  agencia: string;
  conta: string;
  valor: number;
  numeroTransacao: string;
  situacao: string;
  cheques: Cheque[];
}

interface DepositoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deposito: Deposito | null;
}

const bancos = [
  "001 - Banco do Brasil",
  "033 - Santander",
  "104 - Caixa Econômica Federal",
  "237 - Bradesco",
  "341 - Itaú Unibanco",
];

const chequesDisponiveis = [
  { id: 10, numero: "009999", emitente: "Cliente Novo 1", valor: 750.00 },
  { id: 11, numero: "009888", emitente: "Cliente Novo 2", valor: 1200.00 },
  { id: 12, numero: "009777", emitente: "Cliente Novo 3", valor: 450.00 },
];

const DepositoModal = ({ open, onOpenChange, deposito }: DepositoModalProps) => {
  const [data, setData] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [numeroTransacao, setNumeroTransacao] = useState("");
  const [situacao, setSituacao] = useState("Depositado");
  const [chequesSelecionados, setChequesSelecionados] = useState<number[]>([]);
  const [chequesDoDeposito, setChequesDoDeposito] = useState<Cheque[]>([]);

  const isEdit = !!deposito;

  useEffect(() => {
    if (deposito) {
      setData(deposito.data);
      setBanco(deposito.banco);
      setAgencia(deposito.agencia);
      setConta(deposito.conta);
      setNumeroTransacao(deposito.numeroTransacao);
      setSituacao(deposito.situacao);
      setChequesDoDeposito(deposito.cheques);
      setChequesSelecionados(deposito.cheques.map(c => c.id));
    } else {
      setData(new Date().toISOString().split('T')[0]);
      setBanco("");
      setAgencia("");
      setConta("");
      setNumeroTransacao("");
      setSituacao("Depositado");
      setChequesDoDeposito([]);
      setChequesSelecionados([]);
    }
  }, [deposito, open]);

  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const valorTotal = isEdit 
    ? chequesDoDeposito.reduce((acc, c) => acc + c.valor, 0)
    : chequesDisponiveis.filter(c => chequesSelecionados.includes(c.id)).reduce((acc, c) => acc + c.valor, 0);

  const toggleCheque = (id: number) => {
    setChequesSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!data || !banco || !agencia || !conta) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isEdit ? "Depósito atualizado" : "Depósito cadastrado",
      description: isEdit ? "As informações foram atualizadas." : "Novo depósito registrado com sucesso.",
    });
    onOpenChange(false);
  };

  const getSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Depositado":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">{sit}</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{sit}</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{sit}</Badge>;
      default:
        return <Badge variant="outline">{sit}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            {isEdit ? `Depósito #${deposito?.numeroTransacao}` : "Novo Depósito"}
            {isEdit && <div className="ml-2">{getSituacaoBadge(situacao)}</div>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data do Depósito *</Label>
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Número da Transação</Label>
              <Input value={numeroTransacao} onChange={(e) => setNumeroTransacao(e.target.value)} placeholder="Código do comprovante" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Banco *</Label>
              <Select value={banco} onValueChange={setBanco}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {bancos.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agência *</Label>
              <Input value={agencia} onChange={(e) => setAgencia(e.target.value)} placeholder="0000" />
            </div>
            <div className="space-y-2">
              <Label>Conta Corrente *</Label>
              <Input value={conta} onChange={(e) => setConta(e.target.value)} placeholder="00000-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Situação</Label>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Depositado">Depositado</SelectItem>
                <SelectItem value="Compensado">Compensado</SelectItem>
                <SelectItem value="Devolvido">Devolvido</SelectItem>
                <SelectItem value="Reapresentado">Reapresentado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                {isEdit ? "Cheques do Depósito" : "Selecionar Cheques"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEdit ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Nº Cheque</TableHead>
                        <TableHead>Emitente</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chequesDoDeposito.map((cheque) => (
                        <TableRow key={cheque.id}>
                          <TableCell className="font-mono">{cheque.numero}</TableCell>
                          <TableCell>{cheque.emitente}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(cheque.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="space-y-2">
                  {chequesDisponiveis.map((cheque) => (
                    <div 
                      key={cheque.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        chequesSelecionados.includes(cheque.id) 
                          ? "bg-primary/5 border-primary" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleCheque(cheque.id)}
                    >
                      <Checkbox checked={chequesSelecionados.includes(cheque.id)} />
                      <div className="flex-1">
                        <p className="font-medium">Cheque #{cheque.numero}</p>
                        <p className="text-sm text-muted-foreground">{cheque.emitente}</p>
                      </div>
                      <p className="font-medium">{formatCurrency(cheque.valor)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {isEdit ? chequesDoDeposito.length : chequesSelecionados.length} cheque(s) selecionado(s)
                </span>
                <span className="text-lg font-bold text-primary">{formatCurrency(valorTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{isEdit ? "Salvar Alterações" : "Registrar Depósito"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositoModal;

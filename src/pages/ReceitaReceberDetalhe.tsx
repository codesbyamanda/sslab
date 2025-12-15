import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, CreditCard, Banknote, FileCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface Lancamento {
  id: string;
  data: string;
  tipo: string;
  valor: number;
  formaPagamento: string;
  usuario: string;
}

interface Parcela {
  id: string;
  numero: number;
  vencimento: string;
  valor: number;
  status: "Pendente" | "Pago" | "Atrasado";
  dataPagamento: string | null;
}

const mockLancamentos: Lancamento[] = [
  {
    id: "1",
    data: "2024-01-15 10:30",
    tipo: "Entrada",
    valor: 150.0,
    formaPagamento: "Dinheiro",
    usuario: "Maria Silva",
  },
  {
    id: "2",
    data: "2024-01-15 10:35",
    tipo: "Entrada",
    valor: 200.0,
    formaPagamento: "Cartão Débito",
    usuario: "Maria Silva",
  },
];

const mockParcelas: Parcela[] = [
  {
    id: "1",
    numero: 1,
    vencimento: "2024-01-15",
    valor: 175.0,
    status: "Pago",
    dataPagamento: "2024-01-15",
  },
  {
    id: "2",
    numero: 2,
    vencimento: "2024-02-15",
    valor: 175.0,
    status: "Pendente",
    dataPagamento: null,
  },
];

const ReceitaReceberDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"dinheiro" | "cartao" | "cheque">("dinheiro");
  const [paymentValue, setPaymentValue] = useState("");

  // Mock data
  const receita = {
    codigo: `REC-2024-00${id}`,
    tipoReceita: "Particular",
    descricao: "Atendimento Ambulatorial",
    pessoa: "Maria Silva Santos",
    terceiro: "",
    data: "15/01/2024",
    dataVencimento: "15/02/2024",
    valor: 450.0,
    desconto: 5,
    valorDevido: 427.5,
    ir: 0,
    iss: 0,
    pis: 0,
    cofins: 0,
    csll: 0,
  };

  const valorPago = mockLancamentos.reduce((acc, l) => acc + l.valor, 0);
  const saldoDevedor = receita.valorDevido - valorPago;

  const handleRegistrarPagamento = () => {
    const valor = parseFloat(paymentValue);
    if (!valor || valor <= 0) {
      toast.error("Informe um valor válido");
      return;
    }
    if (valor > saldoDevedor) {
      toast.error("Valor maior que o saldo devedor");
      return;
    }
    toast.success(`Pagamento de ${valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })} registrado com sucesso!`);
    setShowPaymentModal(false);
    setPaymentValue("");
  };

  const handleSave = () => {
    toast.success("Receita salva com sucesso!");
    navigate("/atendimento/atendimentos");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      Pago: { className: "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30" },
      Pendente: { className: "bg-ambar-suave/20 text-ambar-suave border border-ambar-suave/30" },
      Atrasado: { className: "bg-vermelho-moderno/20 text-vermelho-moderno border border-vermelho-moderno/30" },
    };
    const config = variants[status] || { className: "bg-muted text-muted-foreground" };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.className}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento/atendimentos")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Atendimentos</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-verde-clinico/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-verde-clinico" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Receita a Receber
                </h1>
                <p className="text-sm text-muted-foreground">
                  Atendimento Particular - Registro de pagamentos
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPaymentModal(true)}
              disabled={saldoDevedor <= 0}
              className="btn-primary-premium gap-2"
            >
              <Plus className="h-4 w-4" />
              Registrar Pagamento
            </Button>
          </div>

          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
            <Card className="card-elevated">
              <CardContent className="py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {receita.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Desconto ({receita.desconto}%)
                </p>
                <p className="text-2xl font-bold text-vermelho-moderno">
                  -{(receita.valor - receita.valorDevido).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Valor Pago
                </p>
                <p className="text-2xl font-bold text-verde-clinico">
                  {valorPago.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </CardContent>
            </Card>
            <Card className="card-elevated border-2 border-primary/20">
              <CardContent className="py-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Saldo Devedor
                </p>
                <p className="text-2xl font-bold text-primary">
                  {saldoDevedor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dados da Receita */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Dados da Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Código</label>
                  <Input value={receita.codigo} disabled className="input-modern" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tipo de Receita</label>
                  <Select value={receita.tipoReceita} disabled>
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-medium text-foreground">Descrição</label>
                  <Input value={receita.descricao} className="input-modern" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Pessoa</label>
                  <Input value={receita.pessoa} disabled className="input-modern" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Terceiro</label>
                  <Input placeholder="Opcional" value={receita.terceiro} className="input-modern" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data</label>
                  <Input type="date" value="2024-01-15" disabled className="input-modern" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data Vencimento</label>
                  <Input type="date" value="2024-02-15" className="input-modern" />
                </div>
              </div>

              {/* Retenções */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-foreground mb-4">Retenções</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">IR (%)</label>
                    <Input type="number" value={receita.ir} className="input-modern h-9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">ISS (%)</label>
                    <Input type="number" value={receita.iss} className="input-modern h-9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">PIS (%)</label>
                    <Input type="number" value={receita.pis} className="input-modern h-9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">COFINS (%)</label>
                    <Input type="number" value={receita.cofins} className="input-modern h-9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">CSLL (%)</label>
                    <Input type="number" value={receita.csll} className="input-modern h-9" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abas */}
          <Card className="card-elevated animate-fade-in">
            <Tabs defaultValue="lancamentos" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="h-10 bg-muted/30 p-1">
                  <TabsTrigger value="lancamentos" className="data-[state=active]:bg-background">
                    Lançamentos
                  </TabsTrigger>
                  <TabsTrigger value="historico" className="data-[state=active]:bg-background">
                    Histórico de Débitos
                  </TabsTrigger>
                  <TabsTrigger value="parcelas" className="data-[state=active]:bg-background">
                    Parcelas
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <TabsContent value="lancamentos" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Data/Hora</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold text-right">Valor</TableHead>
                        <TableHead className="font-semibold">Forma Pagamento</TableHead>
                        <TableHead className="font-semibold">Usuário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLancamentos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhum lançamento registrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        mockLancamentos.map((lancamento) => (
                          <TableRow key={lancamento.id}>
                            <TableCell>
                              {new Date(lancamento.data).toLocaleString("pt-BR")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-verde-clinico/20 text-verde-clinico">
                                {lancamento.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-verde-clinico">
                              +{lancamento.valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </TableCell>
                            <TableCell>{lancamento.formaPagamento}</TableCell>
                            <TableCell>{lancamento.usuario}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="historico" className="mt-0">
                  <div className="p-8 text-center text-muted-foreground">
                    <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum débito histórico encontrado</p>
                  </div>
                </TabsContent>

                <TabsContent value="parcelas" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold text-center">Parcela</TableHead>
                        <TableHead className="font-semibold">Vencimento</TableHead>
                        <TableHead className="font-semibold text-right">Valor</TableHead>
                        <TableHead className="font-semibold text-center">Status</TableHead>
                        <TableHead className="font-semibold">Data Pagamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockParcelas.map((parcela) => (
                        <TableRow key={parcela.id}>
                          <TableCell className="text-center font-medium">
                            {parcela.numero}/{mockParcelas.length}
                          </TableCell>
                          <TableCell>
                            {new Date(parcela.vencimento).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {parcela.valor.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(parcela.status)}
                          </TableCell>
                          <TableCell>
                            {parcela.dataPagamento
                              ? new Date(parcela.dataPagamento).toLocaleDateString("pt-BR")
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 mt-6 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => navigate("/atendimento/atendimentos")}
            >
              Fechar
            </Button>
            <Button onClick={handleSave} className="btn-primary-premium">
              Salvar
            </Button>
          </div>

          {/* Modal de Pagamento */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-verde-clinico" />
                  Registrar Pagamento
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Saldo Devedor</p>
                  <p className="text-xl font-bold text-primary">
                    {saldoDevedor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={paymentType === "dinheiro" ? "default" : "outline"}
                      className="flex flex-col gap-1 h-auto py-3"
                      onClick={() => setPaymentType("dinheiro")}
                    >
                      <Banknote className="h-5 w-5" />
                      <span className="text-xs">Dinheiro</span>
                    </Button>
                    <Button
                      type="button"
                      variant={paymentType === "cartao" ? "default" : "outline"}
                      className="flex flex-col gap-1 h-auto py-3"
                      onClick={() => setPaymentType("cartao")}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">Cartão</span>
                    </Button>
                    <Button
                      type="button"
                      variant={paymentType === "cheque" ? "default" : "outline"}
                      className="flex flex-col gap-1 h-auto py-3"
                      onClick={() => setPaymentType("cheque")}
                    >
                      <FileCheck className="h-5 w-5" />
                      <span className="text-xs">Cheque</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={paymentValue}
                    onChange={(e) => setPaymentValue(e.target.value)}
                    className="input-modern text-lg font-medium"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleRegistrarPagamento} className="btn-primary-premium">
                  Confirmar Pagamento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default ReceitaReceberDetalhe;

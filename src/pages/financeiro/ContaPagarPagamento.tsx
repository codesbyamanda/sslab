import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, CreditCard, Banknote, Building2, Calendar, FileText, Save } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock conta
const mockConta = {
  id: 1,
  codigo: "CP-2024-0001",
  descricao: "Fornecedor de reagentes - Lote Janeiro",
  fornecedor: "LabSupply Ltda",
  valorOriginal: 4500.00,
  valorPago: 1500.00,
  valorDevido: 3000.00,
  situacao: "Parcial",
};

const ContaPagarPagamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dataPagamento: new Date().toISOString().split("T")[0],
    valor: "",
    formaPagamento: "",
    contaOrigem: "",
    numeroDocumento: "",
    observacoes: "",
  });

  const conta = mockConta;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const valorPagamento = parseFloat(formData.valor) || 0;
  const novoSaldo = conta.valorDevido - valorPagamento;
  const isPagamentoTotal = valorPagamento >= conta.valorDevido;

  const handleValorChange = (value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData({ ...formData, valor: numericValue });
  };

  const handleSubmit = async () => {
    if (!formData.dataPagamento) {
      toast({ title: "Erro", description: "Informe a data do pagamento.", variant: "destructive" });
      return;
    }
    if (!formData.valor || valorPagamento <= 0) {
      toast({ title: "Erro", description: "Informe um valor válido.", variant: "destructive" });
      return;
    }
    if (valorPagamento > conta.valorDevido) {
      toast({ title: "Erro", description: "O valor do pagamento não pode ser maior que o saldo devedor.", variant: "destructive" });
      return;
    }
    if (!formData.formaPagamento) {
      toast({ title: "Erro", description: "Selecione a forma de pagamento.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({ title: "Sucesso", description: "Pagamento registrado com sucesso!" });
      navigate(`/financeiro/contas-pagar/${id}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate(`/financeiro/contas-pagar/${id}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Detalhes da Conta
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Registrar Pagamento
                </h1>
                <p className="text-muted-foreground mt-1">
                  {conta.codigo} - {conta.descricao}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate(`/financeiro/contas-pagar/${id}`)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </div>
            </div>

            {/* Resumo da Conta */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Fornecedor</p>
                    <p className="font-medium">{conta.fornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Original</p>
                    <p className="font-medium">{formatCurrency(conta.valorOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Já Pago</p>
                    <p className="font-medium text-green-600">{formatCurrency(conta.valorPago)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Devedor</p>
                    <p className="font-bold text-orange-600 text-lg">{formatCurrency(conta.valorDevido)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Pagamento */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Dados do Pagamento
                </CardTitle>
                <CardDescription>
                  Informe os detalhes do pagamento a ser registrado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Data do Pagamento *</Label>
                    <Input
                      type="date"
                      value={formData.dataPagamento}
                      onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor do Pagamento *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        placeholder="0,00"
                        value={formData.valor}
                        onChange={(e) => handleValorChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, valor: conta.valorDevido.toFixed(2) })}
                      >
                        Pagar Total
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Forma de Pagamento *</Label>
                    <Select
                      value={formData.formaPagamento}
                      onValueChange={(value) => setFormData({ ...formData, formaPagamento: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dinheiro">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            Dinheiro
                          </div>
                        </SelectItem>
                        <SelectItem value="Transferência Bancária">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Transferência Bancária
                          </div>
                        </SelectItem>
                        <SelectItem value="PIX">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            PIX
                          </div>
                        </SelectItem>
                        <SelectItem value="Cartão de Débito">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Cartão de Débito
                          </div>
                        </SelectItem>
                        <SelectItem value="Cheque">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Cheque
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Conta de Origem</Label>
                    <Select
                      value={formData.contaOrigem}
                      onValueChange={(value) => setFormData({ ...formData, contaOrigem: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caixa">Caixa Principal</SelectItem>
                        <SelectItem value="banco-brasil">Banco do Brasil - CC 12345-6</SelectItem>
                        <SelectItem value="itau">Itaú - CC 98765-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nº Documento / Comprovante</Label>
                    <Input
                      placeholder="Ex: PIX-2024-001"
                      value={formData.numeroDocumento}
                      onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <Label className="mb-2 block">Observações</Label>
                  <Textarea
                    placeholder="Observações sobre este pagamento..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumo do Pagamento */}
            {valorPagamento > 0 && (
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Resumo do Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Saldo Devedor Atual</span>
                      <span className="font-medium">{formatCurrency(conta.valorDevido)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Valor do Pagamento</span>
                      <span className="font-medium text-green-600">- {formatCurrency(valorPagamento)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold">Novo Saldo</span>
                      <span className={`font-bold text-lg ${novoSaldo <= 0 ? "text-green-600" : "text-orange-600"}`}>
                        {formatCurrency(Math.max(0, novoSaldo))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Nova Situação</span>
                      {isPagamentoTotal ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          Pago
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                          Parcial
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isPagamentoTotal && (
                    <Alert className="mt-4 bg-green-500/10 border-green-500/30">
                      <AlertDescription className="text-green-700">
                        Este pagamento quitará a conta por completo.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContaPagarPagamento;

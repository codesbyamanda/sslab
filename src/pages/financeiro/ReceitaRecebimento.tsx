import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Banknote, CreditCard, FileCheck, Building2, ArrowRightLeft, AlertCircle } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock data for the receita
const mockReceita = {
  id: 1,
  codigo: "REC-2024-0001",
  descricao: "Consulta particular - João Silva",
  pessoa: "João Silva",
  tipoPessoa: "Paciente",
  valorOriginal: 350.00,
  valorRecebido: 100.00,
  valorDevido: 250.00,
  situacao: "Parcial",
};

const ReceitaRecebimento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const receita = mockReceita;
  
  // Form state
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0]);
  const [valorRecebido, setValorRecebido] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacao, setObservacao] = useState("");
  
  // Campos dinâmicos por forma de pagamento
  const [numeroCheque, setNumeroCheque] = useState("");
  const [bancoCheque, setBancoCheque] = useState("");
  const [dataCompensacao, setDataCompensacao] = useState("");
  const [bandeiraCartao, setBandeiraCartao] = useState("");
  const [numeroAutorizacao, setNumeroAutorizacao] = useState("");
  const [parcelasCartao, setParcelasCartao] = useState("1");
  const [bancoDeposito, setBancoDeposito] = useState("");
  const [contaDeposito, setContaDeposito] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Aberto":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Aberto</Badge>;
      case "Parcial":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Parcial</Badge>;
      case "Quitado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Quitado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const valorNumerico = parseFloat(valorRecebido) || 0;
  const valorExcedente = valorNumerico > receita.valorDevido;

  const handleSubmit = () => {
    if (!dataRecebimento) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a data do recebimento.",
        variant: "destructive"
      });
      return;
    }

    if (!valorRecebido || valorNumerico <= 0) {
      toast({
        title: "Campo obrigatório",
        description: "Informe um valor válido para o recebimento.",
        variant: "destructive"
      });
      return;
    }

    if (valorNumerico > receita.valorDevido) {
      toast({
        title: "Valor inválido",
        description: "O valor recebido não pode ultrapassar o saldo em aberto.",
        variant: "destructive"
      });
      return;
    }

    if (!formaPagamento) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione a forma de pagamento.",
        variant: "destructive"
      });
      return;
    }

    // Validações específicas por forma de pagamento
    if (formaPagamento === "Cheque" && (!numeroCheque || !bancoCheque)) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o número do cheque e o banco.",
        variant: "destructive"
      });
      return;
    }

    if (formaPagamento === "Cartão" && (!bandeiraCartao || !numeroAutorizacao)) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe a bandeira e o número de autorização.",
        variant: "destructive"
      });
      return;
    }

    if (formaPagamento === "Depósito" && (!bancoDeposito || !contaDeposito)) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o banco e a conta de destino.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recebimento registrado",
      description: `Recebimento de ${formatCurrency(valorNumerico)} registrado com sucesso.`,
    });
    
    navigate(`/financeiro/receitas/${id}`);
  };

  const renderCamposDinamicos = () => {
    switch (formaPagamento) {
      case "Cheque":
        return (
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <Separator className="my-4" />
            <h3 className="font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              Dados do Cheque
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroCheque">Número do Cheque *</Label>
                <Input
                  id="numeroCheque"
                  value={numeroCheque}
                  onChange={(e) => setNumeroCheque(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bancoCheque">Banco *</Label>
                <Select value={bancoCheque} onValueChange={setBancoCheque}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="001">Banco do Brasil</SelectItem>
                    <SelectItem value="104">Caixa Econômica</SelectItem>
                    <SelectItem value="237">Bradesco</SelectItem>
                    <SelectItem value="341">Itaú</SelectItem>
                    <SelectItem value="033">Santander</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataCompensacao">Data de Compensação</Label>
                <Input
                  id="dataCompensacao"
                  type="date"
                  value={dataCompensacao}
                  onChange={(e) => setDataCompensacao(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "Cartão":
        return (
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <Separator className="my-4" />
            <h3 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              Dados do Cartão
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bandeiraCartao">Bandeira *</Label>
                <Select value={bandeiraCartao} onValueChange={setBandeiraCartao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                    <SelectItem value="Elo">Elo</SelectItem>
                    <SelectItem value="Amex">American Express</SelectItem>
                    <SelectItem value="Hipercard">Hipercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroAutorizacao">Nº Autorização *</Label>
                <Input
                  id="numeroAutorizacao"
                  value={numeroAutorizacao}
                  onChange={(e) => setNumeroAutorizacao(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcelasCartao">Parcelas</Label>
                <Select value={parcelasCartao} onValueChange={setParcelasCartao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "Depósito":
      case "Transferência":
        return (
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <Separator className="my-4" />
            <h3 className="font-medium flex items-center gap-2">
              {formaPagamento === "Depósito" ? (
                <Building2 className="h-4 w-4 text-teal-600" />
              ) : (
                <ArrowRightLeft className="h-4 w-4 text-indigo-600" />
              )}
              Dados do {formaPagamento}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bancoDeposito">Banco *</Label>
                <Select value={bancoDeposito} onValueChange={setBancoDeposito}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="001">Banco do Brasil</SelectItem>
                    <SelectItem value="104">Caixa Econômica</SelectItem>
                    <SelectItem value="237">Bradesco</SelectItem>
                    <SelectItem value="341">Itaú</SelectItem>
                    <SelectItem value="033">Santander</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contaDeposito">Conta de Destino *</Label>
                <Input
                  id="contaDeposito"
                  value={contaDeposito}
                  onChange={(e) => setContaDeposito(e.target.value)}
                  placeholder="00000-0"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
              onClick={() => navigate(`/financeiro/receitas/${id}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Visualização da Receita
            </button>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <DollarSign className="h-7 w-7 text-green-600" />
                Registrar Recebimento
              </h1>
              <p className="text-muted-foreground mt-1">
                Registre um novo pagamento para a receita {receita.codigo}
              </p>
            </div>

            {/* Resumo da Receita */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita</p>
                    <p className="font-semibold text-lg">{receita.codigo}</p>
                    <p className="text-sm text-muted-foreground">{receita.descricao}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Valor Original</p>
                      <p className="font-medium">{formatCurrency(receita.valorOriginal)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Já Recebido</p>
                      <p className="font-medium text-green-600">{formatCurrency(receita.valorRecebido)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Saldo em Aberto</p>
                      <p className="font-bold text-lg text-orange-600">{formatCurrency(receita.valorDevido)}</p>
                    </div>
                    <div>
                      {getSituacaoBadge(receita.situacao)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Recebimento */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Dados do Recebimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dataRecebimento">Data do Recebimento *</Label>
                    <Input
                      id="dataRecebimento"
                      type="date"
                      value={dataRecebimento}
                      onChange={(e) => setDataRecebimento(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valorRecebido">Valor Recebido (R$) *</Label>
                    <Input
                      id="valorRecebido"
                      type="number"
                      step="0.01"
                      value={valorRecebido}
                      onChange={(e) => setValorRecebido(e.target.value)}
                      placeholder="0,00"
                      max={receita.valorDevido}
                      className={valorExcedente ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {valorExcedente && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Valor não pode exceder o saldo em aberto ({formatCurrency(receita.valorDevido)})
                      </p>
                    )}
                    {valorNumerico > 0 && !valorExcedente && (
                      <p className="text-xs text-muted-foreground">
                        Saldo após recebimento: {formatCurrency(receita.valorDevido - valorNumerico)}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                    <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dinheiro">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-green-600" />
                            Dinheiro
                          </div>
                        </SelectItem>
                        <SelectItem value="Cartão">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-purple-600" />
                            Cartão
                          </div>
                        </SelectItem>
                        <SelectItem value="Cheque">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-blue-600" />
                            Cheque
                          </div>
                        </SelectItem>
                        <SelectItem value="Depósito">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-teal-600" />
                            Depósito
                          </div>
                        </SelectItem>
                        <SelectItem value="Transferência">
                          <div className="flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4 text-indigo-600" />
                            Transferência
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Campos dinâmicos */}
                {renderCamposDinamicos()}

                <div className="space-y-2">
                  <Label htmlFor="observacao">Observação</Label>
                  <Textarea
                    id="observacao"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Observações sobre o recebimento..."
                    rows={3}
                  />
                </div>

                {/* Preview do resultado */}
                {valorNumerico > 0 && !valorExcedente && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Resumo do Recebimento
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valor a Receber</p>
                        <p className="font-semibold text-green-600">{formatCurrency(valorNumerico)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Novo Saldo</p>
                        <p className="font-semibold">{formatCurrency(receita.valorDevido - valorNumerico)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nova Situação</p>
                        <p className="font-semibold">
                          {valorNumerico === receita.valorDevido ? (
                            <span className="text-green-600">Quitado</span>
                          ) : (
                            <span className="text-blue-600">Parcial</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Forma</p>
                        <p className="font-semibold">{formaPagamento || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/financeiro/receitas/${id}`)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={valorExcedente || valorNumerico <= 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Confirmar Recebimento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceitaRecebimento;

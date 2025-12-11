import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Banknote, 
  CreditCard, 
  Building2, 
  ArrowRightLeft, 
  Percent,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface Lancamento {
  id: number;
  data: string;
  formaRecebimento: string;
  valor: number;
  observacoes: string;
  // Cheque fields
  banco?: string;
  agencia?: string;
  conta?: string;
  numeroCheque?: string;
  dataCompensacao?: string;
  cpfCnpjEmitente?: string;
  nomeEmitente?: string;
  // Cartão fields
  adquirente?: string;
  bandeira?: string;
  tipoOperacao?: string;
  numeroParcelas?: number;
  portador?: string;
  // Depósito/Transferência fields
  numeroTransacao?: string;
  dataTransacao?: string;
  // Desconto fields
  motivoDesconto?: string;
}

interface RecebimentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lancamento: Lancamento | null;
  onSave: (lancamento: Lancamento) => void;
  valorDevido: number;
  pessoaNome?: string;
  pessoaCpf?: string;
}

type FormaPagamento = "Dinheiro" | "Cheque" | "Cartão" | "Desconto" | "Depósito" | "Transferência";

const formasPagamento = [
  { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
  { value: "Cheque", label: "Cheque", icon: FileCheck },
  { value: "Cartão", label: "Cartão", icon: CreditCard },
  { value: "Desconto", label: "Desconto", icon: Percent },
  { value: "Depósito", label: "Depósito Bancário", icon: Building2 },
  { value: "Transferência", label: "Transferência Bancária", icon: ArrowRightLeft },
];

const bancos = [
  "001 - Banco do Brasil",
  "033 - Santander",
  "104 - Caixa Econômica Federal",
  "237 - Bradesco",
  "341 - Itaú Unibanco",
  "756 - Sicoob",
  "748 - Sicredi",
  "077 - Inter",
  "260 - Nubank",
  "336 - C6 Bank",
];

const adquirentes = ["Cielo", "Rede", "Stone", "PagSeguro", "Getnet", "Safrapay"];
const bandeiras = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard", "Diners"];
const tiposOperacao = [
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito à Vista" },
  { value: "credito_predatado", label: "Crédito Predatado" },
  { value: "parcelado_loja", label: "Parcelado Loja" },
  { value: "parcelado_juros", label: "Parcelado com Juros" },
];

const RecebimentoModal = ({ 
  open, 
  onOpenChange, 
  lancamento, 
  onSave, 
  valorDevido,
  pessoaNome,
  pessoaCpf 
}: RecebimentoModalProps) => {
  // Form state
  const [data, setData] = useState("");
  const [formaRecebimento, setFormaRecebimento] = useState<FormaPagamento | "">("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  // Cheque fields
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [numeroCheque, setNumeroCheque] = useState("");
  const [dataCompensacao, setDataCompensacao] = useState("");
  const [cpfCnpjEmitente, setCpfCnpjEmitente] = useState("");
  const [nomeEmitente, setNomeEmitente] = useState("");
  
  // Cartão fields
  const [adquirente, setAdquirente] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState("");
  const [numeroParcelas, setNumeroParcelas] = useState("1");
  const [portador, setPortador] = useState("");
  
  // Depósito/Transferência fields
  const [numeroTransacao, setNumeroTransacao] = useState("");
  const [dataTransacao, setDataTransacao] = useState("");
  
  // Desconto fields
  const [motivoDesconto, setMotivoDesconto] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form
  useEffect(() => {
    if (lancamento) {
      setData(lancamento.data);
      setFormaRecebimento(lancamento.formaRecebimento as FormaPagamento);
      setValor(lancamento.valor.toString());
      setObservacoes(lancamento.observacoes || "");
      setBanco(lancamento.banco || "");
      setAgencia(lancamento.agencia || "");
      setConta(lancamento.conta || "");
      setNumeroCheque(lancamento.numeroCheque || "");
      setDataCompensacao(lancamento.dataCompensacao || "");
      setCpfCnpjEmitente(lancamento.cpfCnpjEmitente || "");
      setNomeEmitente(lancamento.nomeEmitente || "");
      setAdquirente(lancamento.adquirente || "");
      setBandeira(lancamento.bandeira || "");
      setTipoOperacao(lancamento.tipoOperacao || "");
      setNumeroParcelas(lancamento.numeroParcelas?.toString() || "1");
      setPortador(lancamento.portador || "");
      setNumeroTransacao(lancamento.numeroTransacao || "");
      setDataTransacao(lancamento.dataTransacao || "");
      setMotivoDesconto(lancamento.motivoDesconto || "");
    } else {
      resetForm();
    }
  }, [lancamento, open]);

  // Auto-fill emitente when selecting cheque
  useEffect(() => {
    if (formaRecebimento === "Cheque" && pessoaNome && pessoaCpf) {
      setNomeEmitente(pessoaNome);
      setCpfCnpjEmitente(pessoaCpf);
    }
  }, [formaRecebimento, pessoaNome, pessoaCpf]);

  const resetForm = () => {
    setData(new Date().toISOString().split('T')[0]);
    setFormaRecebimento("");
    setValor(valorDevido > 0 ? valorDevido.toString() : "");
    setObservacoes("");
    setBanco("");
    setAgencia("");
    setConta("");
    setNumeroCheque("");
    setDataCompensacao("");
    setCpfCnpjEmitente("");
    setNomeEmitente("");
    setAdquirente("");
    setBandeira("");
    setTipoOperacao("");
    setNumeroParcelas("1");
    setPortador("");
    setNumeroTransacao("");
    setDataTransacao("");
    setMotivoDesconto("");
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!data) newErrors.data = "Data é obrigatória";
    if (!formaRecebimento) newErrors.formaRecebimento = "Forma de pagamento é obrigatória";
    if (!valor || parseFloat(valor) <= 0) newErrors.valor = "Valor deve ser maior que zero";
    
    const valorNum = parseFloat(valor) || 0;
    if (valorNum > valorDevido && formaRecebimento !== "Desconto") {
      newErrors.valor = `Valor não pode ser maior que o devido (${formatCurrency(valorDevido)})`;
    }

    // Validação específica por forma de pagamento
    if (formaRecebimento === "Cheque") {
      if (!banco) newErrors.banco = "Banco é obrigatório";
      if (!agencia) newErrors.agencia = "Agência é obrigatória";
      if (!conta) newErrors.conta = "Conta é obrigatória";
      if (!numeroCheque) newErrors.numeroCheque = "Número do cheque é obrigatório";
      if (!dataCompensacao) newErrors.dataCompensacao = "Data de compensação é obrigatória";
      if (!cpfCnpjEmitente) newErrors.cpfCnpjEmitente = "CPF/CNPJ é obrigatório";
    }

    if (formaRecebimento === "Cartão") {
      if (!adquirente) newErrors.adquirente = "Adquirente é obrigatório";
      if (!bandeira) newErrors.bandeira = "Bandeira é obrigatória";
      if (!tipoOperacao) newErrors.tipoOperacao = "Tipo de operação é obrigatório";
    }

    if (formaRecebimento === "Desconto") {
      if (!motivoDesconto) newErrors.motivoDesconto = "Motivo do desconto é obrigatório";
    }

    if (formaRecebimento === "Depósito" || formaRecebimento === "Transferência") {
      if (!banco) newErrors.banco = "Banco é obrigatório";
      if (!agencia) newErrors.agencia = "Agência é obrigatória";
      if (!conta) newErrors.conta = "Conta é obrigatória";
      if (!dataTransacao) newErrors.dataTransacao = "Data da transação é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (andNew: boolean = false) => {
    if (!validate()) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newLancamento: Lancamento = {
      id: lancamento?.id || 0,
      data,
      formaRecebimento,
      valor: parseFloat(valor) || 0,
      observacoes,
      banco,
      agencia,
      conta,
      numeroCheque,
      dataCompensacao,
      cpfCnpjEmitente,
      nomeEmitente,
      adquirente,
      bandeira,
      tipoOperacao,
      numeroParcelas: parseInt(numeroParcelas) || 1,
      portador,
      numeroTransacao,
      dataTransacao,
      motivoDesconto,
    };

    onSave(newLancamento);

    if (andNew) {
      resetForm();
      toast({
        title: "Lançamento salvo",
        description: "Insira os dados do próximo lançamento.",
      });
    } else {
      onOpenChange(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const showParcelamento = tipoOperacao === "parcelado_loja" || tipoOperacao === "parcelado_juros";

  const getFormaPagamentoIcon = () => {
    const forma = formasPagamento.find(f => f.value === formaRecebimento);
    if (forma) {
      const Icon = forma.icon;
      return <Icon className="h-5 w-5" />;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {getFormaPagamentoIcon()}
            {lancamento ? "Editar Recebimento" : "Novo Recebimento"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6 py-4">
          {/* Info Card */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valor Devido:</span>
                <span className={cn(
                  "font-bold text-lg",
                  valorDevido > 0 ? "text-orange-600" : "text-green-600"
                )}>
                  {formatCurrency(valorDevido)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Campos Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataRecebimento">Data do Recebimento *</Label>
              <Input
                id="dataRecebimento"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={errors.data ? "border-destructive" : ""}
              />
              {errors.data && <p className="text-xs text-destructive">{errors.data}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorRecebimento">Valor (R$) *</Label>
              <Input
                id="valorRecebimento"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className={errors.valor ? "border-destructive" : ""}
              />
              {errors.valor && <p className="text-xs text-destructive">{errors.valor}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select value={formaRecebimento} onValueChange={(v) => setFormaRecebimento(v as FormaPagamento)}>
                <SelectTrigger className={errors.formaRecebimento ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma.value} value={forma.value}>
                      <div className="flex items-center gap-2">
                        <forma.icon className="h-4 w-4" />
                        {forma.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formaRecebimento && <p className="text-xs text-destructive">{errors.formaRecebimento}</p>}
            </div>
          </div>

          <Separator />

          {/* Campos específicos por forma de pagamento */}
          {formaRecebimento === "Dinheiro" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-green-600" />
                  Pagamento em Dinheiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="observacoesDinheiro">Observações</Label>
                  <Textarea
                    id="observacoesDinheiro"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre o pagamento..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formaRecebimento === "Cheque" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                  Dados do Cheque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Banco *</Label>
                    <Select value={banco} onValueChange={setBanco}>
                      <SelectTrigger className={errors.banco ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bancos.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.banco && <p className="text-xs text-destructive">{errors.banco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Agência *</Label>
                    <Input
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                      placeholder="0000"
                      className={errors.agencia ? "border-destructive" : ""}
                    />
                    {errors.agencia && <p className="text-xs text-destructive">{errors.agencia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Conta *</Label>
                    <Input
                      value={conta}
                      onChange={(e) => setConta(e.target.value)}
                      placeholder="00000-0"
                      className={errors.conta ? "border-destructive" : ""}
                    />
                    {errors.conta && <p className="text-xs text-destructive">{errors.conta}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número do Cheque *</Label>
                    <Input
                      value={numeroCheque}
                      onChange={(e) => setNumeroCheque(e.target.value)}
                      placeholder="000000"
                      className={errors.numeroCheque ? "border-destructive" : ""}
                    />
                    {errors.numeroCheque && <p className="text-xs text-destructive">{errors.numeroCheque}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Compensação *</Label>
                    <Input
                      type="date"
                      value={dataCompensacao}
                      onChange={(e) => setDataCompensacao(e.target.value)}
                      className={errors.dataCompensacao ? "border-destructive" : ""}
                    />
                    {errors.dataCompensacao && <p className="text-xs text-destructive">{errors.dataCompensacao}</p>}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CPF/CNPJ do Emitente *</Label>
                    <Input
                      value={cpfCnpjEmitente}
                      onChange={(e) => setCpfCnpjEmitente(e.target.value)}
                      placeholder="000.000.000-00"
                      className={errors.cpfCnpjEmitente ? "border-destructive" : ""}
                    />
                    {errors.cpfCnpjEmitente && <p className="text-xs text-destructive">{errors.cpfCnpjEmitente}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Nome do Emitente</Label>
                    <Input
                      value={nomeEmitente}
                      onChange={(e) => setNomeEmitente(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre o cheque..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formaRecebimento === "Cartão" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Dados do Cartão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Adquirente *</Label>
                    <Select value={adquirente} onValueChange={setAdquirente}>
                      <SelectTrigger className={errors.adquirente ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {adquirentes.map((a) => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.adquirente && <p className="text-xs text-destructive">{errors.adquirente}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Bandeira *</Label>
                    <Select value={bandeira} onValueChange={setBandeira}>
                      <SelectTrigger className={errors.bandeira ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bandeiras.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bandeira && <p className="text-xs text-destructive">{errors.bandeira}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Operação *</Label>
                    <Select value={tipoOperacao} onValueChange={setTipoOperacao}>
                      <SelectTrigger className={errors.tipoOperacao ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposOperacao.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoOperacao && <p className="text-xs text-destructive">{errors.tipoOperacao}</p>}
                  </div>
                </div>

                {showParcelamento && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número de Parcelas</Label>
                      <Select value={numeroParcelas} onValueChange={setNumeroParcelas}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                            <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Valor por parcela:</p>
                      <p className="text-lg font-bold">
                        {formatCurrency((parseFloat(valor) || 0) / parseInt(numeroParcelas))}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Nome do Portador</Label>
                  <Input
                    value={portador}
                    onChange={(e) => setPortador(e.target.value)}
                    placeholder="Nome como está no cartão"
                  />
                </div>

                <Card className="bg-blue-500/5 border-blue-500/20">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p>As taxas e prazos de repasse serão calculados automaticamente com base nas configurações do adquirente.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre a transação..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formaRecebimento === "Desconto" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Percent className="h-5 w-5 text-red-600" />
                  Dados do Desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p>O desconto será aplicado diretamente ao valor devido da receita. Esta operação pode ser estornada posteriormente.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label>Motivo do Desconto *</Label>
                  <Textarea
                    value={motivoDesconto}
                    onChange={(e) => setMotivoDesconto(e.target.value)}
                    placeholder="Descreva o motivo do desconto..."
                    rows={3}
                    className={errors.motivoDesconto ? "border-destructive" : ""}
                  />
                  {errors.motivoDesconto && <p className="text-xs text-destructive">{errors.motivoDesconto}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Observações Adicionais</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações adicionais..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formaRecebimento === "Depósito" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-teal-600" />
                  Dados do Depósito Bancário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Banco *</Label>
                    <Select value={banco} onValueChange={setBanco}>
                      <SelectTrigger className={errors.banco ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bancos.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.banco && <p className="text-xs text-destructive">{errors.banco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Agência *</Label>
                    <Input
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                      placeholder="0000"
                      className={errors.agencia ? "border-destructive" : ""}
                    />
                    {errors.agencia && <p className="text-xs text-destructive">{errors.agencia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Conta *</Label>
                    <Input
                      value={conta}
                      onChange={(e) => setConta(e.target.value)}
                      placeholder="00000-0"
                      className={errors.conta ? "border-destructive" : ""}
                    />
                    {errors.conta && <p className="text-xs text-destructive">{errors.conta}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número da Transação</Label>
                    <Input
                      value={numeroTransacao}
                      onChange={(e) => setNumeroTransacao(e.target.value)}
                      placeholder="Código/comprovante"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data do Depósito *</Label>
                    <Input
                      type="date"
                      value={dataTransacao}
                      onChange={(e) => setDataTransacao(e.target.value)}
                      className={errors.dataTransacao ? "border-destructive" : ""}
                    />
                    {errors.dataTransacao && <p className="text-xs text-destructive">{errors.dataTransacao}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre o depósito..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {formaRecebimento === "Transferência" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                  Dados da Transferência Bancária
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Banco *</Label>
                    <Select value={banco} onValueChange={setBanco}>
                      <SelectTrigger className={errors.banco ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bancos.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.banco && <p className="text-xs text-destructive">{errors.banco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Agência *</Label>
                    <Input
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                      placeholder="0000"
                      className={errors.agencia ? "border-destructive" : ""}
                    />
                    {errors.agencia && <p className="text-xs text-destructive">{errors.agencia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Conta Corrente *</Label>
                    <Input
                      value={conta}
                      onChange={(e) => setConta(e.target.value)}
                      placeholder="00000-0"
                      className={errors.conta ? "border-destructive" : ""}
                    />
                    {errors.conta && <p className="text-xs text-destructive">{errors.conta}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número da Transação</Label>
                    <Input
                      value={numeroTransacao}
                      onChange={(e) => setNumeroTransacao(e.target.value)}
                      placeholder="Código/comprovante"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data da Transferência *</Label>
                    <Input
                      type="date"
                      value={dataTransacao}
                      onChange={(e) => setDataTransacao(e.target.value)}
                      className={errors.dataTransacao ? "border-destructive" : ""}
                    />
                    {errors.dataTransacao && <p className="text-xs text-destructive">{errors.dataTransacao}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre a transferência..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {!formaRecebimento && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">
                  Selecione uma forma de pagamento para exibir os campos específicos.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(true)} disabled={!formaRecebimento}>
              Salvar & Novo
            </Button>
            <Button onClick={() => handleSave(false)} disabled={!formaRecebimento}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecebimentoModal;

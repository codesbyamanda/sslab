import { useState } from "react";
import { ArrowLeft, ArrowRightLeft, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data
const mockContas = [
  { id: 1, banco: "Banco do Brasil", agencia: "1234-5", conta: "12345-6", saldo: 45320.50 },
  { id: 2, banco: "Itaú", agencia: "0987", conta: "98765-4", saldo: 28150.00 },
  { id: 3, banco: "Bradesco", agencia: "5678", conta: "54321-0", saldo: 15000.00 },
];

const NovaTransferenciaBancaria = () => {
  const navigate = useNavigate();
  const [contaOrigem, setContaOrigem] = useState("");
  const [contaDestino, setContaDestino] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const contaOrigemData = mockContas.find(c => c.id.toString() === contaOrigem);
  const contaDestinoData = mockContas.find(c => c.id.toString() === contaDestino);
  const valorNum = parseFloat(valor) || 0;

  const saldoInsuficiente = contaOrigemData && valorNum > contaOrigemData.saldo;
  const mesmaConta = contaOrigem && contaDestino && contaOrigem === contaDestino;

  const handleSubmit = () => {
    if (!contaOrigem || !contaDestino || !valor || !tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (mesmaConta) {
      toast.error("A conta de origem e destino devem ser diferentes");
      return;
    }

    if (saldoInsuficiente) {
      toast.error("Saldo insuficiente na conta de origem");
      return;
    }

    toast.success("Transferência registrada com sucesso!");
    navigate("/financeiro/transferencias-bancarias");
  };

  const getTipoBadge = (tipoValue: string) => {
    switch (tipoValue) {
      case "TED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">TED</Badge>;
      case "DOC":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">DOC</Badge>;
      case "PIX":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">PIX</Badge>;
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
              onClick={() => navigate("/financeiro/transferencias-bancarias")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Transferências Bancárias
            </button>

            {/* Page Header */}
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowRightLeft className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Nova Transferência Bancária
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registrar transferência entre contas bancárias.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário principal */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Dados da Transferência</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Seleção de Contas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Conta Origem *</label>
                        <Select value={contaOrigem} onValueChange={setContaOrigem}>
                          <SelectTrigger className={mesmaConta ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a conta" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockContas.map(conta => (
                              <SelectItem key={conta.id} value={conta.id.toString()}>
                                <div className="flex flex-col">
                                  <span>{conta.banco}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Ag: {conta.agencia} | Conta: {conta.conta}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {contaOrigemData && (
                          <p className="text-xs text-muted-foreground">
                            Saldo: <span className="font-mono font-medium">{formatCurrency(contaOrigemData.saldo)}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center items-center pb-6">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Conta Destino *</label>
                        <Select value={contaDestino} onValueChange={setContaDestino}>
                          <SelectTrigger className={mesmaConta ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a conta" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockContas.map(conta => (
                              <SelectItem key={conta.id} value={conta.id.toString()}>
                                <div className="flex flex-col">
                                  <span>{conta.banco}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Ag: {conta.agencia} | Conta: {conta.conta}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {contaDestinoData && (
                          <p className="text-xs text-muted-foreground">
                            Saldo: <span className="font-mono font-medium">{formatCurrency(contaDestinoData.saldo)}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {mesmaConta && (
                      <p className="text-sm text-red-600">
                        A conta de origem e destino devem ser diferentes.
                      </p>
                    )}

                    {/* Valor e Tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Valor *</label>
                        <Input
                          type="number"
                          placeholder="0,00"
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          className={`text-lg font-mono ${saldoInsuficiente ? "border-red-500" : ""}`}
                        />
                        {saldoInsuficiente && (
                          <p className="text-sm text-red-600">
                            Saldo insuficiente.
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tipo de Transferência *</label>
                        <Select value={tipo} onValueChange={setTipo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TED">TED</SelectItem>
                            <SelectItem value="DOC">DOC</SelectItem>
                            <SelectItem value="PIX">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Data de Agendamento</label>
                        <Input
                          type="date"
                          value={dataAgendamento}
                          onChange={(e) => setDataAgendamento(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Deixe em branco para hoje
                        </p>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Observações</label>
                      <Textarea
                        placeholder="Informe o motivo ou detalhes da transferência..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => navigate("/financeiro/transferencias-bancarias")}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!contaOrigem || !contaDestino || !valor || !tipo || mesmaConta || saldoInsuficiente}
                  >
                    Confirmar Transferência
                  </Button>
                </div>
              </div>

              {/* Resumo */}
              <div className="space-y-6">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Resumo da Transferência</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contaOrigemData && (
                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Origem</span>
                        </div>
                        <p className="font-medium">{contaOrigemData.banco}</p>
                        <p className="text-sm text-muted-foreground">
                          Ag: {contaOrigemData.agencia} | Conta: {contaOrigemData.conta}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Saldo atual:</span>
                            <span className="font-mono">{formatCurrency(contaOrigemData.saldo)}</span>
                          </div>
                          {valorNum > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Novo saldo:</span>
                              <span className={`font-mono ${saldoInsuficiente ? "text-red-600" : "text-foreground"}`}>
                                {formatCurrency(contaOrigemData.saldo - valorNum)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {valorNum > 0 && tipo && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="px-4 py-2 rounded-lg bg-primary/10 text-center">
                          <p className="text-sm text-muted-foreground">Valor</p>
                          <p className="text-xl font-bold text-primary font-mono">
                            {formatCurrency(valorNum)}
                          </p>
                        </div>
                        {getTipoBadge(tipo)}
                      </div>
                    )}

                    {contaDestinoData && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Destino</span>
                        </div>
                        <p className="font-medium">{contaDestinoData.banco}</p>
                        <p className="text-sm text-muted-foreground">
                          Ag: {contaDestinoData.agencia} | Conta: {contaDestinoData.conta}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Saldo atual:</span>
                            <span className="font-mono">{formatCurrency(contaDestinoData.saldo)}</span>
                          </div>
                          {valorNum > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Novo saldo:</span>
                              <span className="font-mono text-green-600">
                                {formatCurrency(contaDestinoData.saldo + valorNum)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!contaOrigemData && !contaDestinoData && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Selecione as contas para visualizar o resumo.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NovaTransferenciaBancaria;

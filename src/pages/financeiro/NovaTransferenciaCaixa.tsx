import { useState } from "react";
import { ArrowLeft, ArrowLeftRight, Wallet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data
const mockCaixas = [
  { id: 1, nome: "Caixa Principal", saldo: 15420.50 },
  { id: 2, nome: "Caixa Recepção", saldo: 3250.00 },
  { id: 3, nome: "Caixa Coleta Externa", saldo: 1800.00 },
  { id: 4, nome: "Caixa Laboratório 2", saldo: 5670.25 },
];

const NovaTransferenciaCaixa = () => {
  const navigate = useNavigate();
  const [caixaOrigem, setCaixaOrigem] = useState("");
  const [caixaDestino, setCaixaDestino] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const caixaOrigemData = mockCaixas.find(c => c.id.toString() === caixaOrigem);
  const caixaDestinoData = mockCaixas.find(c => c.id.toString() === caixaDestino);
  const valorNum = parseFloat(valor) || 0;

  const saldoInsuficiente = caixaOrigemData && valorNum > caixaOrigemData.saldo;
  const mesmosCaixas = caixaOrigem && caixaDestino && caixaOrigem === caixaDestino;

  const handleSubmit = () => {
    if (!caixaOrigem || !caixaDestino || !valor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (mesmosCaixas) {
      toast.error("O caixa de origem e destino devem ser diferentes");
      return;
    }

    if (saldoInsuficiente) {
      toast.error("Saldo insuficiente no caixa de origem");
      return;
    }

    toast.success("Transferência realizada com sucesso!");
    navigate("/financeiro/transferencias-caixas");
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
              onClick={() => navigate("/financeiro/transferencias-caixas")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Transferências entre Caixas
            </button>

            {/* Page Header */}
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Nova Transferência entre Caixas
                </h1>
                <p className="text-muted-foreground mt-1">
                  Transferir valores entre os caixas internos do laboratório.
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
                    {/* Seleção de Caixas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Caixa Origem *</label>
                        <Select value={caixaOrigem} onValueChange={setCaixaOrigem}>
                          <SelectTrigger className={mesmosCaixas ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o caixa" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCaixas.map(caixa => (
                              <SelectItem key={caixa.id} value={caixa.id.toString()}>
                                <div className="flex justify-between items-center w-full gap-4">
                                  <span>{caixa.nome}</span>
                                  <span className="text-muted-foreground text-xs font-mono">
                                    {formatCurrency(caixa.saldo)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {caixaOrigemData && (
                          <p className="text-xs text-muted-foreground">
                            Saldo disponível: <span className="font-mono font-medium">{formatCurrency(caixaOrigemData.saldo)}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center items-center pb-6">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Caixa Destino *</label>
                        <Select value={caixaDestino} onValueChange={setCaixaDestino}>
                          <SelectTrigger className={mesmosCaixas ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o caixa" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCaixas.map(caixa => (
                              <SelectItem key={caixa.id} value={caixa.id.toString()}>
                                <div className="flex justify-between items-center w-full gap-4">
                                  <span>{caixa.nome}</span>
                                  <span className="text-muted-foreground text-xs font-mono">
                                    {formatCurrency(caixa.saldo)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {caixaDestinoData && (
                          <p className="text-xs text-muted-foreground">
                            Saldo atual: <span className="font-mono font-medium">{formatCurrency(caixaDestinoData.saldo)}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {mesmosCaixas && (
                      <p className="text-sm text-red-600">
                        O caixa de origem e destino devem ser diferentes.
                      </p>
                    )}

                    {/* Valor */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Valor da Transferência *</label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className={`text-lg font-mono ${saldoInsuficiente ? "border-red-500" : ""}`}
                      />
                      {saldoInsuficiente && (
                        <p className="text-sm text-red-600">
                          Saldo insuficiente no caixa de origem.
                        </p>
                      )}
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
                  <Button variant="outline" onClick={() => navigate("/financeiro/transferencias-caixas")}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!caixaOrigem || !caixaDestino || !valor || mesmosCaixas || saldoInsuficiente}
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
                    {caixaOrigemData && (
                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                          <Wallet className="h-4 w-4" />
                          <span className="text-sm font-medium">Origem</span>
                        </div>
                        <p className="font-medium">{caixaOrigemData.nome}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Saldo atual:</span>
                            <span className="font-mono">{formatCurrency(caixaOrigemData.saldo)}</span>
                          </div>
                          {valorNum > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Novo saldo:</span>
                              <span className={`font-mono ${saldoInsuficiente ? "text-red-600" : "text-foreground"}`}>
                                {formatCurrency(caixaOrigemData.saldo - valorNum)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {valorNum > 0 && (
                      <div className="flex justify-center">
                        <div className="px-4 py-2 rounded-lg bg-primary/10">
                          <p className="text-sm text-muted-foreground">Valor</p>
                          <p className="text-xl font-bold text-primary font-mono">
                            {formatCurrency(valorNum)}
                          </p>
                        </div>
                      </div>
                    )}

                    {caixaDestinoData && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <Wallet className="h-4 w-4" />
                          <span className="text-sm font-medium">Destino</span>
                        </div>
                        <p className="font-medium">{caixaDestinoData.nome}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Saldo atual:</span>
                            <span className="font-mono">{formatCurrency(caixaDestinoData.saldo)}</span>
                          </div>
                          {valorNum > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Novo saldo:</span>
                              <span className="font-mono text-green-600">
                                {formatCurrency(caixaDestinoData.saldo + valorNum)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!caixaOrigemData && !caixaDestinoData && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Selecione os caixas para visualizar o resumo.
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

export default NovaTransferenciaCaixa;

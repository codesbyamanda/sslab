import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark, Save, FileCheck, AlertCircle } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const bancos = [
  "001 - Banco do Brasil",
  "033 - Santander",
  "104 - Caixa Econômica Federal",
  "237 - Bradesco",
  "341 - Itaú Unibanco",
];

const chequesDisponiveis = [
  { id: 10, numero: "009999", emitente: "Cliente Novo 1", cpfCnpj: "111.222.333-44", valor: 750.00, dataVencimento: "2024-01-20" },
  { id: 11, numero: "009888", emitente: "Cliente Novo 2", cpfCnpj: "555.666.777-88", valor: 1200.00, dataVencimento: "2024-01-22" },
  { id: 12, numero: "009777", emitente: "Cliente Novo 3", cpfCnpj: "999.888.777-66", valor: 450.00, dataVencimento: "2024-01-25" },
  { id: 13, numero: "009666", emitente: "Cliente Novo 4", cpfCnpj: "444.333.222-11", valor: 2100.00, dataVencimento: "2024-01-28" },
  { id: 14, numero: "009555", emitente: "Cliente Novo 5", cpfCnpj: "777.888.999-00", valor: 890.00, dataVencimento: "2024-01-30" },
];

const NovoDeposito = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [numeroTransacao, setNumeroTransacao] = useState("");
  const [chequesSelecionados, setChequesSelecionados] = useState<number[]>([]);

  const valorTotal = chequesDisponiveis
    .filter(c => chequesSelecionados.includes(c.id))
    .reduce((acc, c) => acc + c.valor, 0);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const toggleCheque = (id: number) => {
    setChequesSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllCheques = () => {
    if (chequesSelecionados.length === chequesDisponiveis.length) {
      setChequesSelecionados([]);
    } else {
      setChequesSelecionados(chequesDisponiveis.map(c => c.id));
    }
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

    if (chequesSelecionados.length === 0) {
      toast({
        title: "Nenhum cheque selecionado",
        description: "Selecione ao menos um cheque para compor o depósito.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Depósito registrado",
      description: `Depósito de ${formatCurrency(valorTotal)} registrado com sucesso.`,
    });
    navigate("/financeiro/depositos");
  };

  const isFormValid = data && banco && agencia && conta && chequesSelecionados.length > 0;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/financeiro/depositos")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                      Novo Depósito
                    </h1>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Registre um novo depósito bancário com cheques
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                className="gap-2"
                disabled={!isFormValid}
              >
                <Save className="h-4 w-4" />
                Registrar Depósito
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados do Depósito */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Dados Bancários</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data do Depósito *</Label>
                        <Input 
                          type="date" 
                          value={data} 
                          onChange={(e) => setData(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nº Transação/Comprovante</Label>
                        <Input 
                          value={numeroTransacao} 
                          onChange={(e) => setNumeroTransacao(e.target.value)}
                          placeholder="Código do comprovante bancário"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Banco *</Label>
                        <Select value={banco} onValueChange={setBanco}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {bancos.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Agência *</Label>
                        <Input 
                          value={agencia} 
                          onChange={(e) => setAgencia(e.target.value)}
                          placeholder="0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Conta Corrente *</Label>
                        <Input 
                          value={conta} 
                          onChange={(e) => setConta(e.target.value)}
                          placeholder="00000-0"
                        />
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        O depósito será registrado com situação inicial <strong>"Depositado"</strong>. 
                        A compensação deve ser confirmada posteriormente.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Seleção de Cheques */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        Selecionar Cheques
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={selectAllCheques}>
                        {chequesSelecionados.length === chequesDisponiveis.length 
                          ? "Desmarcar Todos" 
                          : "Selecionar Todos"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chequesDisponiveis.length === 0 ? (
                      <div className="text-center py-8">
                        <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum cheque disponível para depósito.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cadastre cheques com situação "Aberto" para poder incluí-los em um depósito.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chequesDisponiveis.map((cheque) => {
                          const isSelected = chequesSelecionados.includes(cheque.id);
                          return (
                            <div 
                              key={cheque.id}
                              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                isSelected 
                                  ? "bg-primary/5 border-primary shadow-sm" 
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => toggleCheque(cheque.id)}
                            >
                              <Checkbox checked={isSelected} />
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Nº Cheque</p>
                                  <p className="font-mono font-medium">{cheque.numero}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Emitente</p>
                                  <p className="font-medium">{cheque.emitente}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Vencimento</p>
                                  <p>{formatDate(cheque.dataVencimento)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Valor</p>
                                  <p className="font-bold text-primary">{formatCurrency(cheque.valor)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Resumo */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border shadow-card sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Resumo do Depósito</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cheques selecionados</span>
                        <Badge variant="secondary" className="text-lg px-3">
                          {chequesSelecionados.length}
                        </Badge>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Valor Total do Depósito</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(valorTotal)}</p>
                      </div>

                      {banco && (
                        <div className="border-t pt-4 space-y-2">
                          <p className="text-sm text-muted-foreground">Destino</p>
                          <p className="font-medium">{banco.split(" - ")[1]}</p>
                          {agencia && conta && (
                            <p className="text-sm text-muted-foreground">
                              Ag. {agencia} / CC. {conta}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <Button 
                        onClick={handleSave} 
                        className="w-full gap-2"
                        disabled={!isFormValid}
                      >
                        <Save className="h-4 w-4" />
                        Registrar Depósito
                      </Button>
                      {!isFormValid && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Preencha os dados bancários e selecione ao menos um cheque
                        </p>
                      )}
                    </div>
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

export default NovoDeposito;

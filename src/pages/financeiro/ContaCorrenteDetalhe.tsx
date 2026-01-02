import { useState } from "react";
import { ArrowLeft, Building2, Plus, ArrowDownCircle, ArrowUpCircle, Clock, FileText, Wallet, CreditCard, ArrowRightLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

// Mock data
const mockConta = {
  id: 1,
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "12345-6",
  tipo: "Conta Corrente",
  titular: "Laboratório Central Ltda",
  cnpj: "12.345.678/0001-90",
  saldoAtual: 45320.50,
  situacao: "Ativa",
  dataAbertura: "2020-03-15",
  gerenteConta: "Carlos Oliveira",
  telefoneGerente: "(11) 98765-4321",
};

const mockMovimentacoes = [
  {
    id: 1,
    data: "2024-01-20",
    tipo: "Crédito",
    descricao: "Depósito identificado - Convênio XYZ",
    valor: 15000.00,
    saldoApos: 45320.50,
  },
  {
    id: 2,
    data: "2024-01-19",
    tipo: "Débito",
    descricao: "Pagamento fornecedor - LabSupply",
    valor: 4500.00,
    saldoApos: 30320.50,
  },
  {
    id: 3,
    data: "2024-01-18",
    tipo: "Crédito",
    descricao: "Repasse cartão - Stone",
    valor: 8200.00,
    saldoApos: 34820.50,
  },
  {
    id: 4,
    data: "2024-01-17",
    tipo: "Débito",
    descricao: "Transferência para Caixa Principal",
    valor: 5000.00,
    saldoApos: 26620.50,
  },
  {
    id: 5,
    data: "2024-01-16",
    tipo: "Débito",
    descricao: "Pagamento DAS - Simples Nacional",
    valor: 2850.00,
    saldoApos: 31620.50,
  },
];

const mockHistorico = [
  { data: "2024-01-15", acao: "Atualização cadastral", usuario: "Admin", detalhes: "Atualizado telefone do gerente" },
  { data: "2023-06-10", acao: "Alteração de limite", usuario: "Admin", detalhes: "Limite de crédito aumentado" },
  { data: "2020-03-15", acao: "Conta aberta", usuario: "Sistema", detalhes: "Abertura de conta corrente" },
];

const ContaCorrenteDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [valorMovimentacao, setValorMovimentacao] = useState("");
  const [descricaoMovimentacao, setDescricaoMovimentacao] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Ativa":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Ativa</Badge>;
      case "Inativa":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Inativa</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Crédito":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Crédito</Badge>;
      case "Débito":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Débito</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const handleRegistrarMovimentacao = () => {
    if (!tipoMovimentacao || !valorMovimentacao || !descricaoMovimentacao) {
      toast.error("Preencha todos os campos");
      return;
    }
    toast.success("Movimentação registrada com sucesso!");
    setShowMovimentacaoForm(false);
    setTipoMovimentacao("");
    setValorMovimentacao("");
    setDescricaoMovimentacao("");
  };

  const totalCreditos = mockMovimentacoes
    .filter(m => m.tipo === "Crédito")
    .reduce((acc, m) => acc + m.valor, 0);

  const totalDebitos = mockMovimentacoes
    .filter(m => m.tipo === "Débito")
    .reduce((acc, m) => acc + m.valor, 0);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro/contas-correntes")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Contas Correntes
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {mockConta.banco}
                    </h1>
                    {getSituacaoBadge(mockConta.situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Ag: {mockConta.agencia} | Conta: {mockConta.conta}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowMovimentacaoForm(!showMovimentacaoForm)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Registrar Movimentação
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/financeiro/transferencias-bancarias/nova")}
                  className="gap-2"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Nova Transferência
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {formatCurrency(mockConta.saldoAtual)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Créditos</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(totalCreditos)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ArrowDownCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Débitos</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {formatCurrency(totalDebitos)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <ArrowUpCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Movimentações</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {mockMovimentacoes.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        no período
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrar Movimentação Form */}
            {showMovimentacaoForm && (
              <Card className="bg-card border-border shadow-card border-l-4 border-l-primary">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium">Nova Movimentação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Tipo</label>
                      <Select value={tipoMovimentacao} onValueChange={setTipoMovimentacao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Crédito">Crédito</SelectItem>
                          <SelectItem value="Débito">Débito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Valor</label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={valorMovimentacao}
                        onChange={(e) => setValorMovimentacao(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">Descrição</label>
                      <Input
                        placeholder="Descreva a movimentação..."
                        value={descricaoMovimentacao}
                        onChange={(e) => setDescricaoMovimentacao(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="ghost" onClick={() => setShowMovimentacaoForm(false)}>Cancelar</Button>
                    <Button onClick={handleRegistrarMovimentacao}>Registrar Movimentação</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dados da Conta */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Dados Bancários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">{mockConta.banco}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Agência</p>
                    <p className="font-medium">{mockConta.agencia}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Conta</p>
                    <p className="font-medium font-mono">{mockConta.conta}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">{mockConta.tipo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Titular</p>
                    <p className="font-medium">{mockConta.titular}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CNPJ</p>
                    <p className="font-medium font-mono">{mockConta.cnpj}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gerente da Conta</p>
                    <p className="font-medium">{mockConta.gerenteConta}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Telefone Gerente</p>
                    <p className="font-medium">{mockConta.telefoneGerente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movimentações */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Movimentações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Saldo Após</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMovimentacoes.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDate(mov.data)}
                            </div>
                          </TableCell>
                          <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
                          <TableCell>{mov.descricao}</TableCell>
                          <TableCell className={`text-right font-mono ${mov.tipo === "Crédito" ? "text-green-600" : "text-red-600"}`}>
                            {mov.tipo === "Crédito" ? "+" : "-"} {formatCurrency(mov.valor)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(mov.saldoApos)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Histórico da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistorico.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.acao}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(item.data)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.detalhes}</p>
                        <p className="text-xs text-muted-foreground mt-1">por {item.usuario}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContaCorrenteDetalhe;

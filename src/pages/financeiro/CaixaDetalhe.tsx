import { useState } from "react";
import { ArrowLeft, Wallet, Lock, LockOpen, Plus, ArrowDownCircle, ArrowUpCircle, Clock, User, Calendar, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Mock data
const mockCaixa = {
  id: 1,
  nome: "Caixa Principal",
  responsavel: "Maria Silva",
  saldoInicial: 5000.00,
  saldoAtual: 15420.50,
  situacao: "Aberto",
  dataAbertura: "2024-01-20 08:00",
  ultimaMovimentacao: "2024-01-20 14:35",
  observacoes: "Caixa principal do laboratório, responsável pelos recebimentos diretos.",
};

const mockMovimentacoes = [
  {
    id: 1,
    data: "2024-01-20 14:35",
    tipo: "Entrada",
    descricao: "Recebimento atendimento #4521",
    valor: 350.00,
    usuario: "Maria Silva",
  },
  {
    id: 2,
    data: "2024-01-20 12:20",
    tipo: "Saída",
    descricao: "Troco para cliente",
    valor: 50.00,
    usuario: "Maria Silva",
  },
  {
    id: 3,
    data: "2024-01-20 11:45",
    tipo: "Entrada",
    descricao: "Recebimento atendimento #4520",
    valor: 220.00,
    usuario: "Maria Silva",
  },
  {
    id: 4,
    data: "2024-01-20 10:30",
    tipo: "Entrada",
    descricao: "Recebimento atendimento #4519",
    valor: 480.00,
    usuario: "Maria Silva",
  },
  {
    id: 5,
    data: "2024-01-20 09:15",
    tipo: "Transferência",
    descricao: "Transferência para Caixa Recepção",
    valor: 500.00,
    usuario: "Maria Silva",
  },
];

const mockHistorico = [
  { data: "2024-01-20 08:00", acao: "Caixa aberto", usuario: "Maria Silva", detalhes: "Saldo inicial: R$ 5.000,00" },
  { data: "2024-01-19 18:00", acao: "Caixa fechado", usuario: "Maria Silva", detalhes: "Saldo final: R$ 5.000,00" },
  { data: "2024-01-19 08:00", acao: "Caixa aberto", usuario: "Maria Silva", detalhes: "Saldo inicial: R$ 4.200,00" },
];

const CaixaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const [valorMovimentacao, setValorMovimentacao] = useState("");
  const [descricaoMovimentacao, setDescricaoMovimentacao] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Aberto":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 gap-1"><LockOpen className="h-3 w-3" /> Aberto</Badge>;
      case "Fechado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted gap-1"><Lock className="h-3 w-3" /> Fechado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Entrada":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Entrada</Badge>;
      case "Saída":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Saída</Badge>;
      case "Transferência":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Transferência</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const handleFecharCaixa = () => {
    toast.success("Caixa fechado com sucesso!");
    navigate("/financeiro/caixas");
  };

  const handleAbrirCaixa = () => {
    toast.success("Caixa aberto com sucesso!");
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

  const totalEntradas = mockMovimentacoes
    .filter(m => m.tipo === "Entrada")
    .reduce((acc, m) => acc + m.valor, 0);

  const totalSaidas = mockMovimentacoes
    .filter(m => m.tipo === "Saída" || m.tipo === "Transferência")
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
              onClick={() => navigate("/financeiro/caixas")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Caixas
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {mockCaixa.nome}
                    </h1>
                    {getSituacaoBadge(mockCaixa.situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Responsável: {mockCaixa.responsavel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {mockCaixa.situacao === "Aberto" ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => setShowMovimentacaoForm(!showMovimentacaoForm)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Registrar Movimentação
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Lock className="h-4 w-4" />
                          Fechar Caixa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Fechamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Deseja realmente fechar este caixa? O saldo atual é {formatCurrency(mockCaixa.saldoAtual)}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleFecharCaixa}>Confirmar Fechamento</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button onClick={handleAbrirCaixa} className="gap-2">
                    <LockOpen className="h-4 w-4" />
                    Abrir Caixa
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Inicial</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(mockCaixa.saldoInicial)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Entradas</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(totalEntradas)}
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
                      <p className="text-sm font-medium text-muted-foreground">Total Saídas</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {formatCurrency(totalSaidas)}
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
                      <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {formatCurrency(mockCaixa.saldoAtual)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrar Movimentação Form */}
            {showMovimentacaoForm && mockCaixa.situacao === "Aberto" && (
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
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Saída">Saída</SelectItem>
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

            {/* Dados do Caixa */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Dados do Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nome do Caixa</p>
                    <p className="font-medium">{mockCaixa.nome}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {mockCaixa.responsavel}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data de Abertura</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {mockCaixa.dataAbertura}
                    </p>
                  </div>
                </div>
                {mockCaixa.observacoes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{mockCaixa.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Movimentações */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Movimentações do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Usuário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMovimentacoes.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {mov.data}
                            </div>
                          </TableCell>
                          <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
                          <TableCell>{mov.descricao}</TableCell>
                          <TableCell className={`text-right font-mono ${mov.tipo === "Entrada" ? "text-green-600" : "text-red-600"}`}>
                            {mov.tipo === "Entrada" ? "+" : "-"} {formatCurrency(mov.valor)}
                          </TableCell>
                          <TableCell>{mov.usuario}</TableCell>
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
                <CardTitle className="text-lg font-semibold">Histórico do Caixa</CardTitle>
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
                          <p className="text-sm text-muted-foreground">{item.data}</p>
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

export default CaixaDetalhe;

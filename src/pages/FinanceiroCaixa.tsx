import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Wallet, 
  CreditCard, 
  Banknote, 
  TrendingDown, 
  Calculator,
  Search,
  X,
  FileText,
  Printer,
  ExternalLink,
  Plus,
  TrendingUp,
  Building2
} from "lucide-react";
import LancamentoCaixaModal from "@/components/financeiro/LancamentoCaixaModal";

// Mock data - lançamentos do caixa da unidade
const initialMockLancamentos = [
  {
    id: 1,
    dataHora: "11/12/2025 08:32",
    tipo: "Recebimento",
    origem: "Registro RC-2024-045",
    formaPagamento: "Dinheiro",
    valor: 650.00,
    motivo: null,
    observacoes: "Consolidação do registro de Maria Silva"
  },
  {
    id: 2,
    dataHora: "11/12/2025 09:15",
    tipo: "Recebimento",
    origem: "Registro RC-2024-045",
    formaPagamento: "Cartão Crédito",
    valor: 320.00,
    motivo: null,
    observacoes: "Consolidação do registro de Maria Silva"
  },
  {
    id: 3,
    dataHora: "11/12/2025 10:00",
    tipo: "Saída Manual",
    origem: "Caixa da Unidade",
    formaPagamento: "Dinheiro",
    valor: -2500.00,
    motivo: "Sangria para banco",
    observacoes: "Depósito conta corrente Banco do Brasil"
  },
  {
    id: 4,
    dataHora: "11/12/2025 11:45",
    tipo: "Recebimento",
    origem: "Registro RC-2024-044",
    formaPagamento: "Cheque",
    valor: 580.00,
    motivo: null,
    observacoes: "Consolidação do registro de João Santos"
  },
  {
    id: 5,
    dataHora: "11/12/2025 14:20",
    tipo: "Entrada Manual",
    origem: "Caixa da Unidade",
    formaPagamento: "Dinheiro",
    valor: 500.00,
    motivo: "Reforço de caixa",
    observacoes: "Troco para atendimento"
  },
  {
    id: 6,
    dataHora: "10/12/2025 19:00",
    tipo: "Recebimento",
    origem: "Registro RC-2024-044",
    formaPagamento: "Diversos",
    valor: 2250.00,
    motivo: null,
    observacoes: "Fechamento do registro de João Santos"
  }
];

const FinanceiroCaixa = () => {
  const navigate = useNavigate();
  const [lancamentos, setLancamentos] = useState(initialMockLancamentos);
  const [dataInicio, setDataInicio] = useState("2025-12-10");
  const [dataFim, setDataFim] = useState("2025-12-11");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [showLancamentoModal, setShowLancamentoModal] = useState(false);

  // Cálculos dos resumos
  const saldoInicial = 3000.00; // Saldo inicial do caixa da unidade
  const totalDinheiro = lancamentos
    .filter(l => l.formaPagamento === "Dinheiro" && l.valor > 0)
    .reduce((acc, l) => acc + l.valor, 0);
  const totalCartao = lancamentos
    .filter(l => l.formaPagamento.includes("Cartão") && l.valor > 0)
    .reduce((acc, l) => acc + l.valor, 0);
  const totalCheque = lancamentos
    .filter(l => l.formaPagamento === "Cheque" && l.valor > 0)
    .reduce((acc, l) => acc + l.valor, 0);
  const saidasManuais = lancamentos
    .filter(l => l.tipo === "Saída Manual")
    .reduce((acc, l) => acc + l.valor, 0);
  const entradasManuais = lancamentos
    .filter(l => l.tipo === "Entrada Manual")
    .reduce((acc, l) => acc + l.valor, 0);
  const totalRecebido = lancamentos
    .filter(l => l.valor > 0)
    .reduce((acc, l) => acc + l.valor, 0);
  const totalSaidas = lancamentos
    .filter(l => l.valor < 0)
    .reduce((acc, l) => acc + l.valor, 0);
  const saldoFinal = saldoInicial + totalRecebido + totalSaidas;

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Recebimento":
        return "default";
      case "Entrada Manual":
        return "outline";
      case "Saída Manual":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const handleNovoLancamento = (data: {
    tipo: "entrada" | "saida";
    valor: number;
    motivo: string;
    observacoes: string;
  }) => {
    const novoLancamento = {
      id: lancamentos.length + 1,
      dataHora: new Date().toLocaleString("pt-BR"),
      tipo: data.tipo === "entrada" ? "Entrada Manual" : "Saída Manual",
      origem: "Caixa da Unidade",
      formaPagamento: "Dinheiro",
      valor: data.tipo === "entrada" ? data.valor : -data.valor,
      motivo: data.motivo,
      observacoes: data.observacoes || data.motivo
    };

    setLancamentos([novoLancamento, ...lancamentos]);
    setShowLancamentoModal(false);

    toast({
      title: data.tipo === "entrada" ? "Entrada registrada" : "Saída registrada",
      description: `Lançamento de ${formatCurrency(data.valor)} registrado com sucesso.`,
    });
  };

  const filteredLancamentos = lancamentos.filter(l => {
    if (tipoFiltro === "todos") return true;
    if (tipoFiltro === "entradas") return l.valor > 0;
    if (tipoFiltro === "saidas") return l.valor < 0;
    if (tipoFiltro === "manuais") return l.tipo.includes("Manual");
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Caixa da Unidade</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie os lançamentos financeiros consolidados do caixa desta unidade.
            </p>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Saldo Inicial</p>
                    <p className="text-xl font-bold text-foreground mt-1">{formatCurrency(saldoInicial)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Dinheiro</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalDinheiro)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Cartão</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(totalCartao)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Entradas Manuais</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(entradasManuais)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Saídas Manuais</p>
                    <p className="text-xl font-bold text-destructive mt-1">{formatCurrency(saidasManuais)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-primary font-medium uppercase tracking-wide">Saldo Atual</p>
                    <p className="text-xl font-bold text-primary mt-1">{formatCurrency(saldoFinal)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Data Início</Label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Data Fim</Label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Tipo de Lançamento</Label>
                  <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="entradas">Somente Entradas</SelectItem>
                      <SelectItem value="saidas">Somente Saídas</SelectItem>
                      <SelectItem value="manuais">Lançamentos Manuais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2 lg:col-span-2">
                  <Button className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <Button onClick={() => setShowLancamentoModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/atendimento/financeiro/registros")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver Registros de Caixa
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Caixa
            </Button>
          </div>

          {/* Tabela de Lançamentos */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Lançamentos do Caixa da Unidade</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Data/Hora</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Origem</TableHead>
                      <TableHead className="font-semibold">Forma de Pagamento</TableHead>
                      <TableHead className="font-semibold">Motivo</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold">Observações</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLancamentos.map((lancamento) => (
                      <TableRow key={lancamento.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{lancamento.dataHora}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(lancamento.tipo)}>
                            {lancamento.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{lancamento.origem}</TableCell>
                        <TableCell>{lancamento.formaPagamento}</TableCell>
                        <TableCell className="text-sm">
                          {lancamento.motivo || "-"}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${lancamento.valor < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                          {formatCurrency(lancamento.valor)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                          {lancamento.observacoes}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal de Lançamento Manual */}
      <LancamentoCaixaModal
        open={showLancamentoModal}
        onOpenChange={setShowLancamentoModal}
        onConfirm={handleNovoLancamento}
      />
    </div>
  );
};

export default FinanceiroCaixa;

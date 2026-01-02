import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, ChevronDown, ChevronUp, CreditCard, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mockTransacoes = [
  {
    id: 1,
    data: "2024-01-15",
    bandeira: "Visa",
    adquirente: "Cielo",
    tipo: "Crédito",
    parcelas: 1,
    valorBruto: 500.00,
    taxa: 2.5,
    valorLiquido: 487.50,
    previsaoRepasse: "2024-02-15",
    situacao: "Pendente",
    portador: "João Silva",
    observacoes: ""
  },
  {
    id: 2,
    data: "2024-01-14",
    bandeira: "Mastercard",
    adquirente: "Rede",
    tipo: "Débito",
    parcelas: 1,
    valorBruto: 250.00,
    taxa: 1.8,
    valorLiquido: 245.50,
    previsaoRepasse: "2024-01-16",
    situacao: "Compensado",
    portador: "Maria Santos",
    observacoes: ""
  },
  {
    id: 3,
    data: "2024-01-13",
    bandeira: "Elo",
    adquirente: "Stone",
    tipo: "Parcelado Loja",
    parcelas: 3,
    valorBruto: 900.00,
    taxa: 3.2,
    valorLiquido: 871.20,
    previsaoRepasse: "2024-02-13",
    situacao: "Pendente",
    portador: "Carlos Oliveira",
    observacoes: "Parcelado em 3x"
  },
  {
    id: 4,
    data: "2024-01-12",
    bandeira: "American Express",
    adquirente: "Cielo",
    tipo: "Crédito",
    parcelas: 1,
    valorBruto: 1200.00,
    taxa: 3.5,
    valorLiquido: 1158.00,
    previsaoRepasse: "2024-02-12",
    situacao: "Contestado",
    portador: "Ana Pereira",
    observacoes: "Cliente contestou a compra"
  },
];

type SortField = "data" | "bandeira" | "adquirente" | "tipo" | "valorBruto" | "situacao";
type SortDirection = "asc" | "desc";

const TransacoesCartao = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("data");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [filterBandeira, setFilterBandeira] = useState("");
  const [filterAdquirente, setFilterAdquirente] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const filteredTransacoes = mockTransacoes
    .filter(t => {
      const matchesSearch = 
        t.portador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bandeira.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBandeira = !filterBandeira || t.bandeira === filterBandeira;
      const matchesAdquirente = !filterAdquirente || t.adquirente === filterAdquirente;
      const matchesTipo = !filterTipo || t.tipo === filterTipo;
      const matchesSituacao = !filterSituacao || t.situacao === filterSituacao;
      return matchesSearch && matchesBandeira && matchesAdquirente && matchesTipo && matchesSituacao;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Pendente</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Compensado</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Contestado</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/30">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Débito":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Débito</Badge>;
      case "Crédito":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Crédito</Badge>;
      case "Parcelado Loja":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Parcelado Loja</Badge>;
      case "Parcelado Juros":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Parcelado Juros</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleViewTransacao = (transacaoId: number) => {
    navigate(`/financeiro/transacoes-cartao/${transacaoId}`);
  };

  const clearFilters = () => {
    setFilterBandeira("");
    setFilterAdquirente("");
    setFilterTipo("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  const totalBruto = filteredTransacoes.reduce((acc, t) => acc + t.valorBruto, 0);
  const totalLiquido = filteredTransacoes.reduce((acc, t) => acc + t.valorLiquido, 0);
  const totalTaxas = totalBruto - totalLiquido;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <button
              onClick={() => navigate("/financeiro")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Financeiro
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-7 w-7 text-primary" />
                  Transações de Cartão
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerenciamento de transações de cartão de crédito e débito.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Total de Transações</p>
                  <p className="text-2xl font-bold text-foreground">{filteredTransacoes.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Valor Bruto</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBruto)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Total em Taxas</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalTaxas)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Valor Líquido</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalLiquido)}</p>
                </CardContent>
              </Card>
            </div>

            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleContent>
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Filtros de Busca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Início</label>
                        <Input type="date" value={filterDataInicio} onChange={(e) => setFilterDataInicio(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Fim</label>
                        <Input type="date" value={filterDataFim} onChange={(e) => setFilterDataFim(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bandeira</label>
                        <Select value={filterBandeira} onValueChange={setFilterBandeira}>
                          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Visa">Visa</SelectItem>
                            <SelectItem value="Mastercard">Mastercard</SelectItem>
                            <SelectItem value="Elo">Elo</SelectItem>
                            <SelectItem value="American Express">American Express</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adquirente</label>
                        <Select value={filterAdquirente} onValueChange={setFilterAdquirente}>
                          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cielo">Cielo</SelectItem>
                            <SelectItem value="Rede">Rede</SelectItem>
                            <SelectItem value="Stone">Stone</SelectItem>
                            <SelectItem value="PagSeguro">PagSeguro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo</label>
                        <Select value={filterTipo} onValueChange={setFilterTipo}>
                          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Débito">Débito</SelectItem>
                            <SelectItem value="Crédito">Crédito</SelectItem>
                            <SelectItem value="Parcelado Loja">Parcelado Loja</SelectItem>
                            <SelectItem value="Parcelado Juros">Parcelado Juros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Situação</label>
                        <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Compensado">Compensado</SelectItem>
                            <SelectItem value="Contestado">Contestado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={clearFilters}>Limpar filtros</Button>
                      <Button>Aplicar Filtros</Button>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold">Lista de Transações</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por portador ou bandeira..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("data")}>
                          <div className="flex items-center">Data {getSortIcon("data")}</div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("bandeira")}>
                          <div className="flex items-center">Bandeira {getSortIcon("bandeira")}</div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("adquirente")}>
                          <div className="flex items-center">Adquirente {getSortIcon("adquirente")}</div>
                        </TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-center">Parcelas</TableHead>
                        <TableHead className="text-right cursor-pointer hover:bg-muted/80" onClick={() => handleSort("valorBruto")}>
                          <div className="flex items-center justify-end">Valor Bruto {getSortIcon("valorBruto")}</div>
                        </TableHead>
                        <TableHead className="text-right">Taxa</TableHead>
                        <TableHead className="text-right">Valor Líquido</TableHead>
                        <TableHead>Previsão Repasse</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">Situação {getSortIcon("situacao")}</div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransacoes.map((transacao) => (
                        <TableRow key={transacao.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{formatDate(transacao.data)}</TableCell>
                          <TableCell>{transacao.bandeira}</TableCell>
                          <TableCell>{transacao.adquirente}</TableCell>
                          <TableCell>{getTipoBadge(transacao.tipo)}</TableCell>
                          <TableCell className="text-center">{transacao.parcelas}x</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(transacao.valorBruto)}</TableCell>
                          <TableCell className="text-right text-red-600">{transacao.taxa}%</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{formatCurrency(transacao.valorLiquido)}</TableCell>
                          <TableCell>{formatDate(transacao.previsaoRepasse)}</TableCell>
                          <TableCell>{getSituacaoBadge(transacao.situacao)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => handleViewTransacao(transacao.id)}
                              >
                                <Eye className="h-4 w-4" />
                                Visualizar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Exibindo {filteredTransacoes.length} transações</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransacoesCartao;

import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, Building2, ChevronDown, ChevronUp, Plus, FileDown, ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data
const mockContas = [{
  id: 1,
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "12345-6",
  tipo: "Conta Corrente",
  saldoAtual: 45320.50,
  situacao: "Ativa"
}, {
  id: 2,
  banco: "Itaú",
  agencia: "0987",
  conta: "98765-4",
  tipo: "Conta Corrente",
  saldoAtual: 28150.00,
  situacao: "Ativa"
}, {
  id: 3,
  banco: "Bradesco",
  agencia: "5678",
  conta: "54321-0",
  tipo: "Conta Poupança",
  saldoAtual: 15000.00,
  situacao: "Ativa"
}, {
  id: 4,
  banco: "Caixa Econômica",
  agencia: "0123",
  conta: "00123-4",
  tipo: "Conta Corrente",
  saldoAtual: 0,
  situacao: "Inativa"
}];
type SortField = "banco" | "agencia" | "conta" | "saldoAtual" | "situacao";
type SortDirection = "asc" | "desc";
const ContasCorrentes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("banco");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterBanco, setFilterBanco] = useState("");
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
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  const filteredContas = mockContas.filter(c => {
    const matchesSearch = c.banco.toLowerCase().includes(searchTerm.toLowerCase()) || c.conta.includes(searchTerm);
    const matchesSituacao = !filterSituacao || c.situacao === filterSituacao;
    const matchesBanco = !filterBanco || c.banco === filterBanco;
    return matchesSearch && matchesSituacao && matchesBanco;
  }).sort((a, b) => {
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
      case "Ativa":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Ativa</Badge>;
      case "Inativa":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Inativa</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  const clearFilters = () => {
    setFilterSituacao("");
    setFilterBanco("");
    setSearchTerm("");
  };

  // Cálculos para os cards
  const saldoTotal = mockContas.filter(c => c.situacao === "Ativa").reduce((acc, c) => acc + c.saldoAtual, 0);
  const entradasPeriodo = 85000.00; // Mock value
  const saidasPeriodo = 42500.00; // Mock value
  const contasAtivas = mockContas.filter(c => c.situacao === "Ativa").length;
  return <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Contas Correntes
                </h1>
                <p className="text-muted-foreground mt-1">
                  Controle de saldos bancários e movimentações das contas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={() => navigate("/financeiro/contas-correntes/nova")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Conta
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Total em Contas</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(saldoTotal)}
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
                      <p className="text-sm font-medium text-muted-foreground">Total em Entradas</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(entradasPeriodo)}
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
                      <p className="text-sm font-medium text-muted-foreground">Total em Saídas</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {formatCurrency(saidasPeriodo)}
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
                      <p className="text-sm font-medium text-muted-foreground">Contas Ativas</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {contasAtivas}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        de {mockContas.length} contas
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleContent>
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Filtros de Busca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Banco</label>
                        <Select value={filterBanco} onValueChange={setFilterBanco}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os bancos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                            <SelectItem value="Itaú">Itaú</SelectItem>
                            <SelectItem value="Bradesco">Bradesco</SelectItem>
                            <SelectItem value="Caixa Econômica">Caixa Econômica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Situação</label>
                        <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as situações" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ativa">Ativa</SelectItem>
                            <SelectItem value="Inativa">Inativa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button variant="ghost" onClick={clearFilters}>Limpar filtros</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Main Content */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold">Lista de Contas Correntes</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por banco ou conta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("banco")}>
                          <div className="flex items-center">
                            Banco
                            {getSortIcon("banco")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("agencia")}>
                          <div className="flex items-center">
                            Agência
                            {getSortIcon("agencia")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("conta")}>
                          <div className="flex items-center">
                            Conta
                            {getSortIcon("conta")}
                          </div>
                        </TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("saldoAtual")}>
                          <div className="flex items-center justify-end">
                            Saldo Atual
                            {getSortIcon("saldoAtual")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">
                            Situação
                            {getSortIcon("situacao")}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContas.length === 0 ? <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhuma conta encontrada.
                          </TableCell>
                        </TableRow> : filteredContas.map(conta => <TableRow key={conta.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/financeiro/contas-correntes/${conta.id}`)}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {conta.banco}
                              </div>
                            </TableCell>
                            <TableCell>{conta.agencia}</TableCell>
                            <TableCell className="font-mono">{conta.conta}</TableCell>
                            <TableCell>{conta.tipo}</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(conta.saldoAtual)}
                            </TableCell>
                            <TableCell>{getSituacaoBadge(conta.situacao)}</TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={e => {
                              e.stopPropagation();
                              navigate(`/financeiro/contas-correntes/${conta.id}`);
                            }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ver detalhes</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>;
};
export default ContasCorrentes;
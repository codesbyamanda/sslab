import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, Wallet, ChevronDown, ChevronUp, Plus, FileDown, Clock, LockOpen, Lock, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
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
const mockCaixas = [{
  id: 1,
  nome: "Caixa Principal",
  responsavel: "Maria Silva",
  saldoAtual: 15420.50,
  situacao: "Aberto",
  ultimaMovimentacao: "2024-01-20 14:35"
}, {
  id: 2,
  nome: "Caixa Recepção",
  responsavel: "João Santos",
  saldoAtual: 3250.00,
  situacao: "Aberto",
  ultimaMovimentacao: "2024-01-20 12:10"
}, {
  id: 3,
  nome: "Caixa Coleta Externa",
  responsavel: "Ana Costa",
  saldoAtual: 1800.00,
  situacao: "Fechado",
  ultimaMovimentacao: "2024-01-19 18:00"
}, {
  id: 4,
  nome: "Caixa Laboratório 2",
  responsavel: "Carlos Mendes",
  saldoAtual: 5670.25,
  situacao: "Aberto",
  ultimaMovimentacao: "2024-01-20 10:45"
}];
type SortField = "nome" | "responsavel" | "saldoAtual" | "situacao";
type SortDirection = "asc" | "desc";
const Caixas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("nome");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterSituacao, setFilterSituacao] = useState("");
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
  const filteredCaixas = mockCaixas.filter(c => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSituacao = !filterSituacao || c.situacao === filterSituacao;
    return matchesSearch && matchesSituacao;
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
      case "Aberto":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Aberto</Badge>;
      case "Fechado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Fechado</Badge>;
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
    setSearchTerm("");
  };

  // Cálculos para os cards
  const saldoTotal = mockCaixas.reduce((acc, c) => acc + c.saldoAtual, 0);
  const entradasPeriodo = 28500.00; // Mock value
  const saidasPeriodo = 12350.00; // Mock value
  const caixasAbertos = mockCaixas.filter(c => c.situacao === "Aberto").length;
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
                  Caixas
                </h1>
                <p className="text-muted-foreground mt-1">
                  Controle do dinheiro físico e movimentações internas dos caixas.
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
                <Button onClick={() => navigate("/financeiro/caixas/novo")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Caixa
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Entradas do Período</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Saídas do Período</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Caixas Abertos</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {caixasAbertos}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        de {mockCaixas.length} caixas
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <LockOpen className="h-6 w-6 text-blue-600" />
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
                        <label className="text-sm font-medium text-foreground">Nome do Caixa</label>
                        <Input placeholder="Buscar caixa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Situação</label>
                        <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as situações" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aberto">Aberto</SelectItem>
                            <SelectItem value="Fechado">Fechado</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Caixas</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome ou responsável..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("nome")}>
                          <div className="flex items-center">
                            Nome do Caixa
                            {getSortIcon("nome")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("responsavel")}>
                          <div className="flex items-center">
                            Responsável
                            {getSortIcon("responsavel")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("saldoAtual")}>
                          <div className="flex items-center justify-end">
                            Saldo Atual
                            {getSortIcon("saldoAtual")}
                          </div>
                        </TableHead>
                        <TableHead>Última Movimentação</TableHead>
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
                      {filteredCaixas.length === 0 ? <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum caixa encontrado.
                          </TableCell>
                        </TableRow> : filteredCaixas.map(caixa => <TableRow key={caixa.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/financeiro/caixas/${caixa.id}`)}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                                {caixa.nome}
                              </div>
                            </TableCell>
                            <TableCell>{caixa.responsavel}</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(caixa.saldoAtual)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {caixa.ultimaMovimentacao}
                              </div>
                            </TableCell>
                            <TableCell>{getSituacaoBadge(caixa.situacao)}</TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={e => {
                              e.stopPropagation();
                              navigate(`/financeiro/caixas/${caixa.id}`);
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
export default Caixas;
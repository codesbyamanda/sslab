import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, DollarSign, ChevronDown, ChevronUp, AlertCircle, Plus, FileDown, Calendar, Building2, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data
const mockContas = [{
  id: 1,
  dataLancamento: "2024-01-10",
  dataVencimento: "2024-01-25",
  descricao: "Fornecedor de reagentes - Lote Janeiro",
  fornecedor: "LabSupply Ltda",
  categoria: "Insumos",
  valorOriginal: 4500.00,
  valorPago: 0,
  situacao: "Aberto"
}, {
  id: 2,
  dataLancamento: "2024-01-05",
  dataVencimento: "2024-01-15",
  descricao: "Aluguel do prédio comercial",
  fornecedor: "Imobiliária Central",
  categoria: "Despesas Fixas",
  valorOriginal: 8000.00,
  valorPago: 8000.00,
  situacao: "Pago"
}, {
  id: 3,
  dataLancamento: "2024-01-08",
  dataVencimento: "2024-01-08",
  descricao: "Manutenção equipamentos laboratoriais",
  fornecedor: "TechMed Serviços",
  categoria: "Manutenção",
  valorOriginal: 2350.00,
  valorPago: 0,
  situacao: "Vencido"
}, {
  id: 4,
  dataLancamento: "2024-01-12",
  dataVencimento: "2024-02-12",
  descricao: "Material de escritório",
  fornecedor: "Papelaria Express",
  categoria: "Material",
  valorOriginal: 450.00,
  valorPago: 225.00,
  situacao: "Parcial"
}, {
  id: 5,
  dataLancamento: "2024-01-15",
  dataVencimento: "2024-01-30",
  descricao: "Serviço de limpeza mensal",
  fornecedor: "Clean Pro",
  categoria: "Serviços",
  valorOriginal: 1800.00,
  valorPago: 0,
  situacao: "Cancelado"
}];
type SortField = "dataLancamento" | "dataVencimento" | "descricao" | "fornecedor" | "valorOriginal" | "situacao";
type SortDirection = "asc" | "desc";
const ContasPagar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dataVencimento");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Filters
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState("");
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
    const matchesSearch = c.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filterCategoria || c.categoria === filterCategoria;
    const matchesSituacao = !filterSituacao || c.situacao === filterSituacao;
    const matchesFornecedor = !filterFornecedor || c.fornecedor.toLowerCase().includes(filterFornecedor.toLowerCase());
    return matchesSearch && matchesCategoria && matchesSituacao && matchesFornecedor;
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
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Aberto</Badge>;
      case "Parcial":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Parcial</Badge>;
      case "Pago":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Pago</Badge>;
      case "Vencido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Vencido</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };
  const isVencido = (dataVencimento: string, situacao: string) => {
    if (situacao === "Pago" || situacao === "Cancelado") return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  const clearFilters = () => {
    setFilterCategoria("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setFilterFornecedor("");
    setSearchTerm("");
  };

  // Cálculos para os cards
  const totalAPagar = mockContas.filter(c => c.situacao !== "Pago" && c.situacao !== "Cancelado").reduce((acc, c) => acc + (c.valorOriginal - c.valorPago), 0);
  const contasAbertas = mockContas.filter(c => c.situacao === "Aberto" || c.situacao === "Parcial").length;
  const contasVencidas = mockContas.filter(c => c.situacao === "Vencido").length;
  const valorVencido = mockContas.filter(c => c.situacao === "Vencido").reduce((acc, c) => acc + (c.valorOriginal - c.valorPago), 0);
  const contasPagas = mockContas.filter(c => c.situacao === "Pago").length;
  const valorPago = mockContas.filter(c => c.situacao === "Pago").reduce((acc, c) => acc + c.valorPago, 0);
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
                  Contas a Pagar
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gestão de obrigações financeiras, fornecedores e despesas do laboratório.
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
                <Button onClick={() => navigate("/financeiro/contas-pagar/nova")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Conta a Pagar
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total a Pagar</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(totalAPagar)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contas em Aberto</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {contasAbertas}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contas Vencidas</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {contasVencidas}
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        {formatCurrency(valorVencido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contas Pagas</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {contasPagas}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {formatCurrency(valorPago)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Fornecedor</label>
                        <Input placeholder="Buscar fornecedor..." value={filterFornecedor} onChange={e => setFilterFornecedor(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Categoria</label>
                        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Insumos">Insumos</SelectItem>
                            <SelectItem value="Despesas Fixas">Despesas Fixas</SelectItem>
                            <SelectItem value="Manutenção">Manutenção</SelectItem>
                            <SelectItem value="Material">Material</SelectItem>
                            <SelectItem value="Serviços">Serviços</SelectItem>
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
                            <SelectItem value="Aberto">Aberto</SelectItem>
                            <SelectItem value="Parcial">Parcial</SelectItem>
                            <SelectItem value="Pago">Pago</SelectItem>
                            <SelectItem value="Vencido">Vencido</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Data Início</label>
                        <Input type="date" value={filterDataInicio} onChange={e => setFilterDataInicio(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Data Fim</label>
                        <Input type="date" value={filterDataFim} onChange={e => setFilterDataFim(e.target.value)} />
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

            {/* Main Content */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold">Lista de Contas a Pagar</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por descrição ou fornecedor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("dataLancamento")}>
                          <div className="flex items-center">
                            Lançamento {getSortIcon("dataLancamento")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("dataVencimento")}>
                          <div className="flex items-center">
                            Vencimento {getSortIcon("dataVencimento")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("descricao")}>
                          <div className="flex items-center">
                            Descrição {getSortIcon("descricao")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("fornecedor")}>
                          <div className="flex items-center">
                            Fornecedor {getSortIcon("fornecedor")}
                          </div>
                        </TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("valorOriginal")}>
                          <div className="flex items-center justify-end">
                            Valor Original {getSortIcon("valorOriginal")}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Valor Pago</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">
                            Situação {getSortIcon("situacao")}
                          </div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContas.length === 0 ? <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Nenhuma conta a pagar encontrada com os filtros aplicados.
                          </TableCell>
                        </TableRow> : filteredContas.map(conta => <TableRow key={conta.id} className={isVencido(conta.dataVencimento, conta.situacao) ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/50"}>
                            <TableCell className="font-medium">
                              {formatDate(conta.dataLancamento)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {formatDate(conta.dataVencimento)}
                                {isVencido(conta.dataVencimento, conta.situacao) && <AlertCircle className="h-4 w-4 text-red-500" />}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {conta.descricao}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{conta.fornecedor}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-normal">
                                {conta.categoria}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(conta.valorOriginal)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={conta.valorPago > 0 ? "text-green-600" : "text-muted-foreground"}>
                                {formatCurrency(conta.valorPago)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getSituacaoBadge(conta.situacao)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/financeiro/contas-pagar/${conta.id}`)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Visualizar detalhes</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
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
export default ContasPagar;
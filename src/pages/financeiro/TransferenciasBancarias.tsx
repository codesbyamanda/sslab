import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, ArrowRightLeft, ChevronDown, ChevronUp, Plus, FileDown, Calendar, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
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
const mockTransferencias = [{
  id: 1,
  data: "2024-01-20",
  contaOrigem: "BB - 1234-5 / 12345-6",
  contaDestino: "Itaú - 0987 / 98765-4",
  valor: 25000.00,
  tipo: "TED",
  situacao: "Efetuada"
}, {
  id: 2,
  data: "2024-01-19",
  contaOrigem: "Itaú - 0987 / 98765-4",
  contaDestino: "BB - 1234-5 / 12345-6",
  valor: 15000.00,
  tipo: "PIX",
  situacao: "Efetuada"
}, {
  id: 3,
  data: "2024-01-18",
  contaOrigem: "BB - 1234-5 / 12345-6",
  contaDestino: "Bradesco - 5678 / 54321-0",
  valor: 8500.00,
  tipo: "DOC",
  situacao: "Pendente"
}, {
  id: 4,
  data: "2024-01-17",
  contaOrigem: "Bradesco - 5678 / 54321-0",
  contaDestino: "Itaú - 0987 / 98765-4",
  valor: 3200.00,
  tipo: "PIX",
  situacao: "Cancelada"
}];
type SortField = "data" | "contaOrigem" | "contaDestino" | "valor" | "tipo" | "situacao";
type SortDirection = "asc" | "desc";
const TransferenciasBancarias = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("data");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
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
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  const filteredTransferencias = mockTransferencias.filter(t => {
    const matchesSearch = t.contaOrigem.toLowerCase().includes(searchTerm.toLowerCase()) || t.contaDestino.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSituacao = !filterSituacao || t.situacao === filterSituacao;
    const matchesTipo = !filterTipo || t.tipo === filterTipo;
    return matchesSearch && matchesSituacao && matchesTipo;
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
      case "Efetuada":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 gap-1"><CheckCircle className="h-3 w-3" /> Efetuada</Badge>;
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "Cancelada":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted gap-1"><XCircle className="h-3 w-3" /> Cancelada</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "TED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">TED</Badge>;
      case "DOC":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">DOC</Badge>;
      case "PIX":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">PIX</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };
  const clearFilters = () => {
    setFilterSituacao("");
    setFilterTipo("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  // Cálculos para os cards
  const totalTransferido = mockTransferencias.filter(t => t.situacao === "Efetuada").reduce((acc, t) => acc + t.valor, 0);
  const transferenciasEfetuadas = mockTransferencias.filter(t => t.situacao === "Efetuada").length;
  const transferenciasPendentes = mockTransferencias.filter(t => t.situacao === "Pendente").length;
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
                  Transferências Bancárias
                </h1>
                <p className="text-muted-foreground mt-1">
                  Controle de transferências entre contas bancárias.
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
                <Button onClick={() => navigate("/financeiro/transferencias-bancarias/nova")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Transferência
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Transferido</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(totalTransferido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRightLeft className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transferências Efetuadas</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {transferenciasEfetuadas}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transferências Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {transferenciasPendentes}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tipo</label>
                        <Select value={filterTipo} onValueChange={setFilterTipo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TED">TED</SelectItem>
                            <SelectItem value="DOC">DOC</SelectItem>
                            <SelectItem value="PIX">PIX</SelectItem>
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
                            <SelectItem value="Efetuada">Efetuada</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Cancelada">Cancelada</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Transferências</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por conta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("data")}>
                          <div className="flex items-center">
                            Data
                            {getSortIcon("data")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("contaOrigem")}>
                          <div className="flex items-center">
                            Conta Origem
                            {getSortIcon("contaOrigem")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("contaDestino")}>
                          <div className="flex items-center">
                            Conta Destino
                            {getSortIcon("contaDestino")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("valor")}>
                          <div className="flex items-center justify-end">
                            Valor
                            {getSortIcon("valor")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("tipo")}>
                          <div className="flex items-center">
                            Tipo
                            {getSortIcon("tipo")}
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
                      {filteredTransferencias.length === 0 ? <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhuma transferência encontrada.
                          </TableCell>
                        </TableRow> : filteredTransferencias.map(transferencia => <TableRow key={transferencia.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/financeiro/transferencias-bancarias/${transferencia.id}`)}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(transferencia.data)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {transferencia.contaOrigem}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {transferencia.contaDestino}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              {formatCurrency(transferencia.valor)}
                            </TableCell>
                            <TableCell>{getTipoBadge(transferencia.tipo)}</TableCell>
                            <TableCell>{getSituacaoBadge(transferencia.situacao)}</TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={e => {
                              e.stopPropagation();
                              navigate(`/financeiro/transferencias-bancarias/${transferencia.id}`);
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
export default TransferenciasBancarias;
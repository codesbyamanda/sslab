import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, ChevronDown, ChevronUp, AlertCircle, Plus, FileDown, Clock, CheckCircle, XCircle, RotateCcw, FileCheck } from "lucide-react";
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
const mockCheques = [{
  id: 1,
  numero: "000451",
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "56789-0",
  favorecido: "LabSupply Ltda",
  dataEmissao: "2024-01-10",
  dataCompensacao: null,
  valor: 4500.00,
  situacao: "Aberto"
}, {
  id: 2,
  numero: "000450",
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "56789-0",
  favorecido: "Imobiliária Central",
  dataEmissao: "2024-01-05",
  dataCompensacao: "2024-01-12",
  valor: 8000.00,
  situacao: "Compensado"
}, {
  id: 3,
  numero: "000449",
  banco: "Itaú",
  agencia: "0987",
  conta: "12345-6",
  favorecido: "TechMed Serviços",
  dataEmissao: "2024-01-08",
  dataCompensacao: null,
  valor: 2350.00,
  situacao: "Devolvido"
}, {
  id: 4,
  numero: "000448",
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "56789-0",
  favorecido: "Papelaria Express",
  dataEmissao: "2024-01-03",
  dataCompensacao: "2024-01-08",
  valor: 450.00,
  situacao: "Compensado"
}, {
  id: 5,
  numero: "000447",
  banco: "Itaú",
  agencia: "0987",
  conta: "12345-6",
  favorecido: "Clean Pro",
  dataEmissao: "2024-01-02",
  dataCompensacao: null,
  valor: 1800.00,
  situacao: "Cancelado"
}, {
  id: 6,
  numero: "000452",
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "56789-0",
  favorecido: "Distribuidora Química",
  dataEmissao: "2024-01-15",
  dataCompensacao: null,
  valor: 6200.00,
  situacao: "Aberto"
}];
type SortField = "numero" | "favorecido" | "dataEmissao" | "valor" | "situacao";
type SortDirection = "asc" | "desc";
const ChequesEmitidos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dataEmissao");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filters
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterBanco, setFilterBanco] = useState("");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");
  const [filterFavorecido, setFilterFavorecido] = useState("");
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
  const filteredCheques = mockCheques.filter(c => {
    const matchesSearch = c.numero.toLowerCase().includes(searchTerm.toLowerCase()) || c.favorecido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSituacao = !filterSituacao || c.situacao === filterSituacao;
    const matchesBanco = !filterBanco || c.banco === filterBanco;
    const matchesFavorecido = !filterFavorecido || c.favorecido.toLowerCase().includes(filterFavorecido.toLowerCase());
    return matchesSearch && matchesSituacao && matchesBanco && matchesFavorecido;
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
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Compensado</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Devolvido</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
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
    setFilterDataInicio("");
    setFilterDataFim("");
    setFilterFavorecido("");
    setSearchTerm("");
  };

  // Cálculos para os cards
  const totalEmitido = mockCheques.filter(c => c.situacao !== "Cancelado").reduce((acc, c) => acc + c.valor, 0);
  const chequesAbertos = mockCheques.filter(c => c.situacao === "Aberto");
  const valorAberto = chequesAbertos.reduce((acc, c) => acc + c.valor, 0);
  const chequesCompensados = mockCheques.filter(c => c.situacao === "Compensado");
  const valorCompensado = chequesCompensados.reduce((acc, c) => acc + c.valor, 0);
  const chequesDevolvidos = mockCheques.filter(c => c.situacao === "Devolvido");
  const valorDevolvido = chequesDevolvidos.reduce((acc, c) => acc + c.valor, 0);
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
                  Cheques Emitidos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Controle de cheques emitidos para pagamento de fornecedores e despesas.
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
                <Button onClick={() => navigate("/financeiro/cheques-emitidos/novo")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Emitir Novo Cheque
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Emitido</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(totalEmitido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Em Aberto</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {chequesAbertos.length}
                      </p>
                      <p className="text-xs text-yellow-600 mt-0.5">
                        {formatCurrency(valorAberto)}
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
                      <p className="text-sm font-medium text-muted-foreground">Compensados</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {chequesCompensados.length}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {formatCurrency(valorCompensado)}
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
                      <p className="text-sm font-medium text-muted-foreground">Devolvidos</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {chequesDevolvidos.length}
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        {formatCurrency(valorDevolvido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <RotateCcw className="h-6 w-6 text-red-600" />
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
                        <label className="text-sm font-medium text-foreground">Favorecido</label>
                        <Input placeholder="Buscar favorecido..." value={filterFavorecido} onChange={e => setFilterFavorecido(e.target.value)} />
                      </div>
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
                            <SelectItem value="Santander">Santander</SelectItem>
                            <SelectItem value="Caixa">Caixa Econômica</SelectItem>
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
                            <SelectItem value="Compensado">Compensado</SelectItem>
                            <SelectItem value="Devolvido">Devolvido</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Cheques Emitidos</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por número ou favorecido..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("numero")}>
                          <div className="flex items-center">
                            Nº Cheque {getSortIcon("numero")}
                          </div>
                        </TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead>Agência / Conta</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("favorecido")}>
                          <div className="flex items-center">
                            Favorecido {getSortIcon("favorecido")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("dataEmissao")}>
                          <div className="flex items-center">
                            Emissão {getSortIcon("dataEmissao")}
                          </div>
                        </TableHead>
                        <TableHead>Compensação</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("valor")}>
                          <div className="flex items-center justify-end">
                            Valor {getSortIcon("valor")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">
                            Situação {getSortIcon("situacao")}
                          </div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCheques.length === 0 ? <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Nenhum cheque emitido encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow> : filteredCheques.map(cheque => <TableRow key={cheque.id} className={cheque.situacao === "Devolvido" ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/50"}>
                            <TableCell className="font-mono font-medium">
                              {cheque.numero}
                            </TableCell>
                            <TableCell>{cheque.banco}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {cheque.agencia} / {cheque.conta}
                            </TableCell>
                            <TableCell className="max-w-[180px] truncate">
                              {cheque.favorecido}
                            </TableCell>
                            <TableCell>
                              {formatDate(cheque.dataEmissao)}
                            </TableCell>
                            <TableCell>
                              {formatDate(cheque.dataCompensacao)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(cheque.valor)}
                            </TableCell>
                            <TableCell>
                              {getSituacaoBadge(cheque.situacao)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/financeiro/cheques-emitidos/${cheque.id}`)}>
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
export default ChequesEmitidos;
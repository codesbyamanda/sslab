import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, ChevronDown, ChevronUp, AlertCircle, FileCheck, Download } from "lucide-react";
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

// Mock data for cheques
const mockCheques = [{
  id: 1,
  numeroCheque: "000123",
  banco: "001 - Banco do Brasil",
  agencia: "1234",
  conta: "12345-6",
  emitente: "João Silva",
  cpfCnpj: "123.456.789-00",
  valor: 1500.00,
  dataEmissao: "2024-01-10",
  dataVencimento: "2024-02-10",
  localizacao: "Em caixa",
  situacao: "Aberto",
  observacoes: "",
  historico: [{
    id: 1,
    data: "2024-01-10 10:30",
    situacaoAnterior: "-",
    situacaoNova: "Aberto",
    usuario: "Ednaldo",
    observacao: "Cheque recebido"
  }]
}, {
  id: 2,
  numeroCheque: "000456",
  banco: "237 - Bradesco",
  agencia: "5678",
  conta: "67890-1",
  emitente: "Maria Santos",
  cpfCnpj: "987.654.321-00",
  valor: 2500.00,
  dataEmissao: "2024-01-05",
  dataVencimento: "2024-01-15",
  localizacao: "Em banco",
  situacao: "Depositado",
  observacoes: "Depósito realizado",
  historico: [{
    id: 1,
    data: "2024-01-05 14:00",
    situacaoAnterior: "-",
    situacaoNova: "Aberto",
    usuario: "Ednaldo",
    observacao: "Cheque recebido"
  }, {
    id: 2,
    data: "2024-01-08 09:15",
    situacaoAnterior: "Aberto",
    situacaoNova: "Depositado",
    usuario: "Ednaldo",
    observacao: "Enviado para compensação"
  }]
}, {
  id: 3,
  numeroCheque: "000789",
  banco: "341 - Itaú Unibanco",
  agencia: "9012",
  conta: "34567-8",
  emitente: "Carlos Oliveira",
  cpfCnpj: "456.789.123-00",
  valor: 800.00,
  dataEmissao: "2024-01-02",
  dataVencimento: "2024-01-10",
  localizacao: "Devolvido",
  situacao: "Devolvido",
  observacoes: "Sem fundos",
  historico: [{
    id: 1,
    data: "2024-01-02 11:00",
    situacaoAnterior: "-",
    situacaoNova: "Aberto",
    usuario: "Ednaldo",
    observacao: "Cheque recebido"
  }, {
    id: 2,
    data: "2024-01-05 10:00",
    situacaoAnterior: "Aberto",
    situacaoNova: "Depositado",
    usuario: "Ednaldo",
    observacao: ""
  }, {
    id: 3,
    data: "2024-01-08 16:30",
    situacaoAnterior: "Depositado",
    situacaoNova: "Devolvido",
    usuario: "Sistema",
    observacao: "Motivo: Sem fundos"
  }]
}, {
  id: 4,
  numeroCheque: "001234",
  banco: "033 - Santander",
  agencia: "3456",
  conta: "78901-2",
  emitente: "Ana Pereira",
  cpfCnpj: "321.654.987-00",
  valor: 3200.00,
  dataEmissao: "2023-12-20",
  dataVencimento: "2024-01-20",
  localizacao: "Compensado",
  situacao: "Compensado",
  observacoes: "",
  historico: [{
    id: 1,
    data: "2023-12-20 15:00",
    situacaoAnterior: "-",
    situacaoNova: "Aberto",
    usuario: "Ednaldo",
    observacao: "Cheque recebido"
  }, {
    id: 2,
    data: "2024-01-02 08:30",
    situacaoAnterior: "Aberto",
    situacaoNova: "Depositado",
    usuario: "Ednaldo",
    observacao: ""
  }, {
    id: 3,
    data: "2024-01-05 12:00",
    situacaoAnterior: "Depositado",
    situacaoNova: "Compensado",
    usuario: "Sistema",
    observacao: "Compensação confirmada"
  }]
}, {
  id: 5,
  numeroCheque: "005678",
  banco: "104 - Caixa Econômica Federal",
  agencia: "7890",
  conta: "23456-7",
  emitente: "Pedro Souza",
  cpfCnpj: "789.123.456-00",
  valor: 1800.00,
  dataEmissao: "2024-01-12",
  dataVencimento: "2024-02-12",
  localizacao: "Com terceiro",
  situacao: "Aberto",
  observacoes: "Repassado para fornecedor",
  historico: [{
    id: 1,
    data: "2024-01-12 09:00",
    situacaoAnterior: "-",
    situacaoNova: "Aberto",
    usuario: "Ednaldo",
    observacao: "Cheque recebido"
  }, {
    id: 2,
    data: "2024-01-14 11:30",
    situacaoAnterior: "Em caixa",
    situacaoNova: "Com terceiro",
    usuario: "Ednaldo",
    observacao: "Repassado para Fornecedor ABC"
  }]
}];
type SortField = "numeroCheque" | "banco" | "emitente" | "valor" | "dataVencimento" | "situacao";
type SortDirection = "asc" | "desc";
const Cheques = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dataVencimento");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filters
  const [filterBanco, setFilterBanco] = useState("");
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
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  const filteredCheques = mockCheques.filter(c => {
    const matchesSearch = c.emitente.toLowerCase().includes(searchTerm.toLowerCase()) || c.numeroCheque.includes(searchTerm) || c.banco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBanco = !filterBanco || c.banco.includes(filterBanco);
    const matchesSituacao = !filterSituacao || c.situacao === filterSituacao;
    return matchesSearch && matchesBanco && matchesSituacao;
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
      case "Depositado":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Depositado</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Devolvido</Badge>;
      case "Reapresentado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">Reapresentado</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Compensado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };
  const getLocalizacaoBadge = (localizacao: string) => {
    switch (localizacao) {
      case "Em caixa":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Em caixa</Badge>;
      case "Em banco":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Em banco</Badge>;
      case "Em transição":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Em transição</Badge>;
      case "Com terceiro":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700">Com terceiro</Badge>;
      case "Compensado":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Compensado</Badge>;
      case "Devolvido":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Devolvido</Badge>;
      default:
        return <Badge variant="secondary">{localizacao}</Badge>;
    }
  };
  const isVencido = (dataVencimento: string, situacao: string) => {
    if (situacao === "Compensado") return false;
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
  const handleViewCheque = (chequeId: number) => {
    navigate(`/financeiro/cheques/${chequeId}`);
  };
  const clearFilters = () => {
    setFilterBanco("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  // Summary stats
  const totalAberto = mockCheques.filter(c => c.situacao === "Aberto").reduce((acc, c) => acc + c.valor, 0);
  const totalDepositado = mockCheques.filter(c => c.situacao === "Depositado").reduce((acc, c) => acc + c.valor, 0);
  const totalDevolvido = mockCheques.filter(c => c.situacao === "Devolvido").reduce((acc, c) => acc + c.valor, 0);
  const totalCompensado = mockCheques.filter(c => c.situacao === "Compensado").reduce((acc, c) => acc + c.valor, 0);
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
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="h-7 w-7 text-primary" />
                  Cheques
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerenciamento de cheques recebidos e suas movimentações.
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Em Aberto</p>
                      <p className="text-lg font-bold text-yellow-600">{formatCurrency(totalAberto)}</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                      {mockCheques.filter(c => c.situacao === "Aberto").length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Depositados</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(totalDepositado)}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                      {mockCheques.filter(c => c.situacao === "Depositado").length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Devolvidos</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(totalDevolvido)}</p>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                      {mockCheques.filter(c => c.situacao === "Devolvido").length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Compensados</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(totalCompensado)}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                      {mockCheques.filter(c => c.situacao === "Compensado").length}
                    </Badge>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Banco</label>
                        <Select value={filterBanco} onValueChange={setFilterBanco}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os bancos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                            <SelectItem value="033">033 - Santander</SelectItem>
                            <SelectItem value="104">104 - Caixa Econômica</SelectItem>
                            <SelectItem value="237">237 - Bradesco</SelectItem>
                            <SelectItem value="341">341 - Itaú Unibanco</SelectItem>
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
                            <SelectItem value="Depositado">Depositado</SelectItem>
                            <SelectItem value="Devolvido">Devolvido</SelectItem>
                            <SelectItem value="Reapresentado">Reapresentado</SelectItem>
                            <SelectItem value="Compensado">Compensado</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Cheques</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por emitente, número ou banco..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("numeroCheque")}>
                          <div className="flex items-center">
                            Nº Cheque {getSortIcon("numeroCheque")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("banco")}>
                          <div className="flex items-center">
                            Banco {getSortIcon("banco")}
                          </div>
                        </TableHead>
                        <TableHead>Agência/Conta</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("emitente")}>
                          <div className="flex items-center">
                            Emitente {getSortIcon("emitente")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors text-right" onClick={() => handleSort("valor")}>
                          <div className="flex items-center justify-end">
                            Valor {getSortIcon("valor")}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("dataVencimento")}>
                          <div className="flex items-center">
                            Vencimento {getSortIcon("dataVencimento")}
                          </div>
                        </TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">
                            Situação {getSortIcon("situacao")}
                          </div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCheques.map(cheque => <TableRow key={cheque.id} className={cheque.situacao === "Devolvido" ? "bg-red-500/5 hover:bg-red-500/10" : isVencido(cheque.dataVencimento, cheque.situacao) ? "bg-orange-500/5 hover:bg-orange-500/10" : "hover:bg-muted/50"}>
                          <TableCell className="font-mono font-medium">
                            {cheque.numeroCheque}
                          </TableCell>
                          <TableCell className="text-sm">
                            {cheque.banco.split(" - ")[0]}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {cheque.agencia} / {cheque.conta}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{cheque.emitente}</span>
                              <p className="text-xs text-muted-foreground">{cheque.cpfCnpj}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(cheque.valor)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {formatDate(cheque.dataVencimento)}
                              {isVencido(cheque.dataVencimento, cheque.situacao) && <AlertCircle className="h-4 w-4 text-orange-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getLocalizacaoBadge(cheque.localizacao)}
                          </TableCell>
                          <TableCell>
                            {getSituacaoBadge(cheque.situacao)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => handleViewCheque(cheque.id)}>
                                <Eye className="h-4 w-4" />
                                Visualizar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Exibindo {filteredCheques.length} de {mockCheques.length} cheques
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-3">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="font-medium text-muted-foreground">Legenda:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
                    <span>Aberto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
                    <span>Depositado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                    <span>Devolvido</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/30" />
                    <span>Reapresentado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
                    <span>Compensado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>;
};
export default Cheques;
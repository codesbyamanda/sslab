import { useState } from "react";
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
import ReceitaModal from "@/components/financeiro/ReceitaModal";

// Mock data
const mockReceitas = [
  {
    id: 1,
    data: "2024-01-15",
    dataVencimento: "2024-02-15",
    descricao: "Consulta particular - João Silva",
    pessoa: "João Silva",
    tipoPessoa: "Paciente",
    valorOriginal: 350.00,
    valorDevido: 350.00,
    situacao: "Aberto",
    tipoReceita: "Consulta Particular",
  },
  {
    id: 2,
    data: "2024-01-10",
    dataVencimento: "2024-01-25",
    descricao: "Exames laboratoriais - Maria Santos",
    pessoa: "Maria Santos",
    tipoPessoa: "Paciente",
    valorOriginal: 520.00,
    valorDevido: 260.00,
    situacao: "Parcial",
    tipoReceita: "Exames",
  },
  {
    id: 3,
    data: "2024-01-05",
    dataVencimento: "2024-01-20",
    descricao: "Guia faturada - Unimed #45892",
    pessoa: "Unimed",
    tipoPessoa: "Convênio",
    valorOriginal: 1250.00,
    valorDevido: 0,
    situacao: "Quitado",
    tipoReceita: "Guia Faturada",
  },
  {
    id: 4,
    data: "2024-01-18",
    dataVencimento: "2024-01-10",
    descricao: "Procedimento cirúrgico - Carlos Oliveira",
    pessoa: "Carlos Oliveira",
    tipoPessoa: "Paciente",
    valorOriginal: 2800.00,
    valorDevido: 2800.00,
    situacao: "Aberto",
    tipoReceita: "Procedimento",
  },
  {
    id: 5,
    data: "2024-01-20",
    dataVencimento: "2024-02-20",
    descricao: "Aluguel sala consultório",
    pessoa: "Imobiliária Central",
    tipoPessoa: "Terceiro",
    valorOriginal: 1500.00,
    valorDevido: 1500.00,
    situacao: "Aberto",
    tipoReceita: "Aluguel",
  },
];

type SortField = "data" | "dataVencimento" | "descricao" | "pessoa" | "valorOriginal" | "valorDevido" | "situacao";
type SortDirection = "asc" | "desc";

const ReceitasReceber = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState<typeof mockReceitas[0] | null>(null);
  const [sortField, setSortField] = useState<SortField>("data");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filters
  const [filterTipoReceita, setFilterTipoReceita] = useState("");
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

  const filteredReceitas = mockReceitas
    .filter(r => {
      const matchesSearch = 
        r.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pessoa.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = !filterTipoReceita || r.tipoReceita === filterTipoReceita;
      const matchesSituacao = !filterSituacao || r.situacao === filterSituacao;
      return matchesSearch && matchesTipo && matchesSituacao;
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
      case "Aberto":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Aberto</Badge>;
      case "Parcial":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Parcial</Badge>;
      case "Quitado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Quitado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const isVencido = (dataVencimento: string, situacao: string) => {
    if (situacao === "Quitado") return false;
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleNewReceita = () => {
    setSelectedReceita(null);
    setIsModalOpen(true);
  };

  const handleEditReceita = (receita: typeof mockReceitas[0]) => {
    setSelectedReceita(receita);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setFilterTipoReceita("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Financeiro
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Receitas a Receber
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gestão dos recebíveis do laboratório, particulares e guias faturadas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button onClick={handleNewReceita} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Recebimento
                </Button>
              </div>
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
                        <label className="text-sm font-medium text-foreground">Tipo de Receita</label>
                        <Select value={filterTipoReceita} onValueChange={setFilterTipoReceita}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consulta Particular">Consulta Particular</SelectItem>
                            <SelectItem value="Exames">Exames</SelectItem>
                            <SelectItem value="Guia Faturada">Guia Faturada</SelectItem>
                            <SelectItem value="Procedimento">Procedimento</SelectItem>
                            <SelectItem value="Aluguel">Aluguel</SelectItem>
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
                            <SelectItem value="Quitado">Quitado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Data Início</label>
                        <Input
                          type="date"
                          value={filterDataInicio}
                          onChange={(e) => setFilterDataInicio(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Data Fim</label>
                        <Input
                          type="date"
                          value={filterDataFim}
                          onChange={(e) => setFilterDataFim(e.target.value)}
                        />
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
                  <CardTitle className="text-lg font-semibold">Lista de Receitas</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, pessoa ou requisição..."
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
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleSort("data")}
                        >
                          <div className="flex items-center">
                            Data {getSortIcon("data")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleSort("dataVencimento")}
                        >
                          <div className="flex items-center">
                            Vencimento {getSortIcon("dataVencimento")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleSort("descricao")}
                        >
                          <div className="flex items-center">
                            Descrição {getSortIcon("descricao")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleSort("pessoa")}
                        >
                          <div className="flex items-center">
                            Pessoa {getSortIcon("pessoa")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors text-right"
                          onClick={() => handleSort("valorOriginal")}
                        >
                          <div className="flex items-center justify-end">
                            Valor Original {getSortIcon("valorOriginal")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors text-right"
                          onClick={() => handleSort("valorDevido")}
                        >
                          <div className="flex items-center justify-end">
                            Valor Devido {getSortIcon("valorDevido")}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleSort("situacao")}
                        >
                          <div className="flex items-center">
                            Situação {getSortIcon("situacao")}
                          </div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReceitas.map((receita) => (
                        <TableRow 
                          key={receita.id}
                          className={isVencido(receita.dataVencimento, receita.situacao) 
                            ? "bg-red-500/5 hover:bg-red-500/10" 
                            : "hover:bg-muted/50"
                          }
                        >
                          <TableCell className="font-medium">
                            {formatDate(receita.data)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {formatDate(receita.dataVencimento)}
                              {isVencido(receita.dataVencimento, receita.situacao) && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {receita.descricao}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{receita.pessoa}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({receita.tipoPessoa})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(receita.valorOriginal)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={receita.valorDevido > 0 ? "font-semibold text-orange-600" : "text-green-600"}>
                              {formatCurrency(receita.valorDevido)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getSituacaoBadge(receita.situacao)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditReceita(receita)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Exibindo {filteredReceitas.length} de {mockReceitas.length} receitas
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total a Receber</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(mockReceitas.reduce((acc, r) => acc + r.valorDevido, 0))}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receitas em Aberto</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {mockReceitas.filter(r => r.situacao === "Aberto").length}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-yellow-600">!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receitas Vencidas</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {mockReceitas.filter(r => isVencido(r.dataVencimento, r.situacao)).length}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ReceitaModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        receita={selectedReceita}
      />
    </div>
  );
};

export default ReceitasReceber;

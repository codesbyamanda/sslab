import { useState } from "react";
import { ArrowLeft, Search, Filter, Edit, Trash2, Eye, Plus, ChevronDown, ChevronUp, Landmark, Download } from "lucide-react";
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
import DepositoModal from "@/components/financeiro/DepositoModal";

const mockDepositos = [
  {
    id: 1,
    data: "2024-01-15",
    banco: "001 - Banco do Brasil",
    agencia: "1234",
    conta: "12345-6",
    valor: 5500.00,
    numeroTransacao: "DEP001234",
    situacao: "Depositado",
    cheques: [
      { id: 1, numero: "000123", emitente: "João Silva", valor: 1500.00 },
      { id: 2, numero: "000456", emitente: "Maria Santos", valor: 2500.00 },
      { id: 3, numero: "000789", emitente: "Carlos Oliveira", valor: 1500.00 },
    ]
  },
  {
    id: 2,
    data: "2024-01-12",
    banco: "237 - Bradesco",
    agencia: "5678",
    conta: "67890-1",
    valor: 3200.00,
    numeroTransacao: "DEP005678",
    situacao: "Compensado",
    cheques: [
      { id: 4, numero: "001234", emitente: "Ana Pereira", valor: 3200.00 },
    ]
  },
  {
    id: 3,
    data: "2024-01-10",
    banco: "341 - Itaú Unibanco",
    agencia: "9012",
    conta: "34567-8",
    valor: 800.00,
    numeroTransacao: "DEP009012",
    situacao: "Devolvido",
    cheques: [
      { id: 5, numero: "005678", emitente: "Pedro Souza", valor: 800.00 },
    ]
  },
];

type SortField = "data" | "banco" | "valor" | "situacao";
type SortDirection = "asc" | "desc";

const Depositos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeposito, setSelectedDeposito] = useState<typeof mockDepositos[0] | null>(null);
  const [sortField, setSortField] = useState<SortField>("data");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const filteredDepositos = mockDepositos
    .filter(d => {
      const matchesSearch = d.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.numeroTransacao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBanco = !filterBanco || d.banco.includes(filterBanco);
      const matchesSituacao = !filterSituacao || d.situacao === filterSituacao;
      return matchesSearch && matchesBanco && matchesSituacao;
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
      case "Depositado":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Depositado</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Compensado</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Devolvido</Badge>;
      case "Reapresentado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">Reapresentado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleEditDeposito = (deposito: typeof mockDepositos[0]) => {
    setSelectedDeposito(deposito);
    setIsModalOpen(true);
  };

  const handleNovoDeposito = () => {
    setSelectedDeposito(null);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setFilterBanco("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  const totalDepositos = filteredDepositos.reduce((acc, d) => acc + d.valor, 0);
  const totalCompensado = mockDepositos.filter(d => d.situacao === "Compensado").reduce((acc, d) => acc + d.valor, 0);
  const totalPendente = mockDepositos.filter(d => d.situacao === "Depositado").reduce((acc, d) => acc + d.valor, 0);

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
                  <Landmark className="h-7 w-7 text-primary" />
                  Depósitos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registro e acompanhamento de depósitos bancários.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button onClick={handleNovoDeposito} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Depósito
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Total Depositado</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDepositos)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Aguardando Compensação</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPendente)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Compensado</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCompensado)}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Início</label>
                        <Input type="date" value={filterDataInicio} onChange={(e) => setFilterDataInicio(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Fim</label>
                        <Input type="date" value={filterDataFim} onChange={(e) => setFilterDataFim(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Banco</label>
                        <Select value={filterBanco} onValueChange={setFilterBanco}>
                          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="001">Banco do Brasil</SelectItem>
                            <SelectItem value="237">Bradesco</SelectItem>
                            <SelectItem value="341">Itaú</SelectItem>
                            <SelectItem value="104">Caixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Situação</label>
                        <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Depositado">Depositado</SelectItem>
                            <SelectItem value="Compensado">Compensado</SelectItem>
                            <SelectItem value="Devolvido">Devolvido</SelectItem>
                            <SelectItem value="Reapresentado">Reapresentado</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Depósitos</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por banco ou transação..."
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
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("banco")}>
                          <div className="flex items-center">Banco {getSortIcon("banco")}</div>
                        </TableHead>
                        <TableHead>Agência/Conta</TableHead>
                        <TableHead>Nº Transação</TableHead>
                        <TableHead className="text-center">Cheques</TableHead>
                        <TableHead className="text-right cursor-pointer hover:bg-muted/80" onClick={() => handleSort("valor")}>
                          <div className="flex items-center justify-end">Valor {getSortIcon("valor")}</div>
                        </TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">Situação {getSortIcon("situacao")}</div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDepositos.map((deposito) => (
                        <TableRow key={deposito.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{formatDate(deposito.data)}</TableCell>
                          <TableCell>{deposito.banco.split(" - ")[1]}</TableCell>
                          <TableCell className="text-muted-foreground">{deposito.agencia} / {deposito.conta}</TableCell>
                          <TableCell className="font-mono text-sm">{deposito.numeroTransacao}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{deposito.cheques.length}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(deposito.valor)}</TableCell>
                          <TableCell>{getSituacaoBadge(deposito.situacao)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDeposito(deposito)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDeposito(deposito)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Exibindo {filteredDepositos.length} depósitos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <DepositoModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        deposito={selectedDeposito}
      />
    </div>
  );
};

export default Depositos;

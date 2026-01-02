import { useState } from "react";
import { ArrowLeft, Search, Filter, Eye, ChevronDown, ChevronUp, HandCoins, Download, AlertCircle } from "lucide-react";
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
} from "@/components/ui/collapsible";

const mockRepasses = [
  {
    id: 1,
    dataPrevista: "2024-02-15",
    dataRecebida: null,
    adquirente: "Cielo",
    bandeira: "Visa",
    tipo: "Crédito",
    numeroTransacao: "TXN001234",
    parcela: "1/1",
    valorBruto: 500.00,
    taxa: 2.5,
    valorLiquido: 487.50,
    situacao: "Previsto",
    transacaoOriginal: { data: "2024-01-15", portador: "João Silva" }
  },
  {
    id: 2,
    dataPrevista: "2024-01-16",
    dataRecebida: "2024-01-16",
    adquirente: "Rede",
    bandeira: "Mastercard",
    tipo: "Débito",
    numeroTransacao: "TXN005678",
    parcela: "1/1",
    valorBruto: 250.00,
    taxa: 1.8,
    valorLiquido: 245.50,
    situacao: "Recebido",
    transacaoOriginal: { data: "2024-01-14", portador: "Maria Santos" }
  },
  {
    id: 3,
    dataPrevista: "2024-02-13",
    dataRecebida: null,
    adquirente: "Stone",
    bandeira: "Elo",
    tipo: "Parcelado",
    numeroTransacao: "TXN009012",
    parcela: "1/3",
    valorBruto: 300.00,
    taxa: 3.2,
    valorLiquido: 290.40,
    situacao: "Previsto",
    transacaoOriginal: { data: "2024-01-13", portador: "Carlos Oliveira" }
  },
  {
    id: 4,
    dataPrevista: "2024-03-13",
    dataRecebida: null,
    adquirente: "Stone",
    bandeira: "Elo",
    tipo: "Parcelado",
    numeroTransacao: "TXN009012",
    parcela: "2/3",
    valorBruto: 300.00,
    taxa: 3.2,
    valorLiquido: 290.40,
    situacao: "Previsto",
    transacaoOriginal: { data: "2024-01-13", portador: "Carlos Oliveira" }
  },
  {
    id: 5,
    dataPrevista: "2024-01-10",
    dataRecebida: null,
    adquirente: "Cielo",
    bandeira: "American Express",
    tipo: "Crédito",
    numeroTransacao: "TXN003456",
    parcela: "1/1",
    valorBruto: 1200.00,
    taxa: 3.5,
    valorLiquido: 1158.00,
    situacao: "Atrasado",
    transacaoOriginal: { data: "2024-01-05", portador: "Ana Pereira" }
  },
  {
    id: 6,
    dataPrevista: "2024-01-12",
    dataRecebida: null,
    adquirente: "Rede",
    bandeira: "Visa",
    tipo: "Crédito",
    numeroTransacao: "TXN007890",
    parcela: "1/1",
    valorBruto: 800.00,
    taxa: 2.5,
    valorLiquido: 780.00,
    situacao: "Contestado",
    transacaoOriginal: { data: "2024-01-08", portador: "Pedro Souza" }
  },
];

type SortField = "dataPrevista" | "adquirente" | "valorBruto" | "situacao";
type SortDirection = "asc" | "desc";

const RepasseCartao = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dataPrevista");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [filterAdquirente, setFilterAdquirente] = useState("");
  const [filterBandeira, setFilterBandeira] = useState("");
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

  const filteredRepasses = mockRepasses
    .filter(r => {
      const matchesSearch = r.numeroTransacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.transacaoOriginal.portador.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAdquirente = !filterAdquirente || r.adquirente === filterAdquirente;
      const matchesBandeira = !filterBandeira || r.bandeira === filterBandeira;
      const matchesSituacao = !filterSituacao || r.situacao === filterSituacao;
      return matchesSearch && matchesAdquirente && matchesBandeira && matchesSituacao;
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
      case "Previsto":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Previsto</Badge>;
      case "Recebido":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Recebido</Badge>;
      case "Atrasado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Atrasado</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">Contestado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const isAtrasado = (dataPrevista: string, situacao: string) => {
    if (situacao === "Recebido") return false;
    return new Date(dataPrevista) < new Date();
  };

  const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "-";
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleViewRepasse = (repasseId: number) => {
    navigate(`/financeiro/repasse-cartao/${repasseId}`);
  };

  const clearFilters = () => {
    setFilterAdquirente("");
    setFilterBandeira("");
    setFilterSituacao("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setSearchTerm("");
  };

  const totalPrevisto = mockRepasses.filter(r => r.situacao === "Previsto").reduce((acc, r) => acc + r.valorLiquido, 0);
  const totalRecebido = mockRepasses.filter(r => r.situacao === "Recebido").reduce((acc, r) => acc + r.valorLiquido, 0);
  const totalAtrasado = mockRepasses.filter(r => r.situacao === "Atrasado").reduce((acc, r) => acc + r.valorLiquido, 0);

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
                  <HandCoins className="h-7 w-7 text-primary" />
                  Repasse de Cartão
                </h1>
                <p className="text-muted-foreground mt-1">
                  Acompanhamento de repasses das operadoras de cartão.
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Total de Repasses</p>
                  <p className="text-2xl font-bold text-foreground">{filteredRepasses.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Previstos</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrevisto)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground">Recebidos</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRecebido)}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Atrasados</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAtrasado)}</p>
                    </div>
                    {totalAtrasado > 0 && <AlertCircle className="h-6 w-6 text-red-600" />}
                  </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Início</label>
                        <Input type="date" value={filterDataInicio} onChange={(e) => setFilterDataInicio(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data Fim</label>
                        <Input type="date" value={filterDataFim} onChange={(e) => setFilterDataFim(e.target.value)} />
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
                        <label className="text-sm font-medium">Situação</label>
                        <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Previsto">Previsto</SelectItem>
                            <SelectItem value="Recebido">Recebido</SelectItem>
                            <SelectItem value="Atrasado">Atrasado</SelectItem>
                            <SelectItem value="Contestado">Contestado</SelectItem>
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
                  <CardTitle className="text-lg font-semibold">Lista de Repasses</CardTitle>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por transação ou portador..."
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
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("dataPrevista")}>
                          <div className="flex items-center">Data Prevista {getSortIcon("dataPrevista")}</div>
                        </TableHead>
                        <TableHead>Data Recebida</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("adquirente")}>
                          <div className="flex items-center">Adquirente {getSortIcon("adquirente")}</div>
                        </TableHead>
                        <TableHead>Bandeira</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nº Transação</TableHead>
                        <TableHead className="text-center">Parcela</TableHead>
                        <TableHead className="text-right cursor-pointer hover:bg-muted/80" onClick={() => handleSort("valorBruto")}>
                          <div className="flex items-center justify-end">Valor Bruto {getSortIcon("valorBruto")}</div>
                        </TableHead>
                        <TableHead className="text-right">Taxa</TableHead>
                        <TableHead className="text-right">Valor Líquido</TableHead>
                        <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("situacao")}>
                          <div className="flex items-center">Situação {getSortIcon("situacao")}</div>
                        </TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRepasses.map((repasse) => (
                        <TableRow 
                          key={repasse.id} 
                          className={
                            repasse.situacao === "Atrasado" 
                              ? "bg-red-500/5 hover:bg-red-500/10" 
                              : "hover:bg-muted/50"
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {formatDate(repasse.dataPrevista)}
                              {isAtrasado(repasse.dataPrevista, repasse.situacao) && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(repasse.dataRecebida)}</TableCell>
                          <TableCell>{repasse.adquirente}</TableCell>
                          <TableCell>{repasse.bandeira}</TableCell>
                          <TableCell>{repasse.tipo}</TableCell>
                          <TableCell className="font-mono text-sm">{repasse.numeroTransacao}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{repasse.parcela}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(repasse.valorBruto)}</TableCell>
                          <TableCell className="text-right text-red-600">{repasse.taxa}%</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{formatCurrency(repasse.valorLiquido)}</TableCell>
                          <TableCell>{getSituacaoBadge(repasse.situacao)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewRepasse(repasse.id)}
                            >
                              <Eye className="h-4 w-4" />
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Exibindo {filteredRepasses.length} repasses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RepasseCartao;

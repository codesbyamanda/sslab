import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface Requisicao {
  id: string;
  numero: string;
  paciente: string;
  dataAtendimento: string;
  servicosPendentes: number;
  repeticoes: number;
  unidade: string;
}

const mockRequisicoes: Requisicao[] = [
  {
    id: "1",
    numero: "REQ-2024-001234",
    paciente: "Maria Silva Santos",
    dataAtendimento: "2024-01-15",
    servicosPendentes: 3,
    repeticoes: 0,
    unidade: "Matriz",
  },
  {
    id: "2",
    numero: "REQ-2024-001235",
    paciente: "João Pedro Oliveira",
    dataAtendimento: "2024-01-15",
    servicosPendentes: 5,
    repeticoes: 1,
    unidade: "Matriz",
  },
  {
    id: "3",
    numero: "REQ-2024-001236",
    paciente: "Ana Carolina Ferreira",
    dataAtendimento: "2024-01-14",
    servicosPendentes: 2,
    repeticoes: 0,
    unidade: "Filial Centro",
  },
  {
    id: "4",
    numero: "REQ-2024-001237",
    paciente: "Carlos Eduardo Lima",
    dataAtendimento: "2024-01-14",
    servicosPendentes: 1,
    repeticoes: 2,
    unidade: "Matriz",
  },
];

const RecebimentoMaterial = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    requisicao: "",
    paciente: "",
    data: "",
  });
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(mockRequisicoes);

  const handleFilter = () => {
    let filtered = mockRequisicoes;

    if (filters.requisicao) {
      filtered = filtered.filter((r) =>
        r.numero.toLowerCase().includes(filters.requisicao.toLowerCase())
      );
    }
    if (filters.paciente) {
      filtered = filtered.filter((r) =>
        r.paciente.toLowerCase().includes(filters.paciente.toLowerCase())
      );
    }
    if (filters.data) {
      filtered = filtered.filter((r) => r.dataAtendimento === filters.data);
    }

    setRequisicoes(filtered);
  };

  const handleClear = () => {
    setFilters({ requisicao: "", paciente: "", data: "" });
    setRequisicoes(mockRequisicoes);
  };

  const handleOpenRecebimento = (requisicao: Requisicao) => {
    navigate(`/atendimento/recebimento/${requisicao.id}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Dashboard</span>
          </button>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Recebimento de Material
                </h1>
                <p className="text-sm text-muted-foreground">
                  Localize requisições com serviços pendentes para realizar o
                  recebimento das amostras.
                </p>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Filtros de Pesquisa
              </CardTitle>
              <CardDescription>
                Utilize os campos abaixo para localizar requisições pendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nº da Requisição
                  </label>
                  <Input
                    placeholder="Ex: REQ-2024-001234"
                    value={filters.requisicao}
                    onChange={(e) =>
                      setFilters({ ...filters, requisicao: e.target.value })
                    }
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome do Paciente
                  </label>
                  <Input
                    placeholder="Buscar por nome..."
                    value={filters.paciente}
                    onChange={(e) =>
                      setFilters({ ...filters, paciente: e.target.value })
                    }
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Data do Atendimento
                  </label>
                  <Input
                    type="date"
                    value={filters.data}
                    onChange={(e) =>
                      setFilters({ ...filters, data: e.target.value })
                    }
                    className="input-modern"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleFilter}
                    className="btn-primary-premium flex-1"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card className="card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Requisições Pendentes
                </CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {requisicoes.length} encontrada(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">
                        Nº Requisição
                      </TableHead>
                      <TableHead className="font-semibold">Paciente</TableHead>
                      <TableHead className="font-semibold">
                        Data do Atendimento
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Serviços Pendentes
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Repetições
                      </TableHead>
                      <TableHead className="font-semibold">Unidade</TableHead>
                      <TableHead className="font-semibold text-center">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisicoes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>Nenhuma requisição pendente encontrada</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      requisicoes.map((requisicao) => (
                        <TableRow
                          key={requisicao.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onDoubleClick={() => handleOpenRecebimento(requisicao)}
                        >
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            {requisicao.numero}
                          </TableCell>
                          <TableCell className="font-medium">
                            {requisicao.paciente}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              requisicao.dataAtendimento
                            ).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="destructive"
                              className="font-semibold"
                            >
                              {requisicao.servicosPendentes}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {requisicao.repeticoes > 0 ? (
                              <Badge variant="outline" className="font-medium">
                                {requisicao.repeticoes}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>{requisicao.unidade}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenRecebimento(requisicao)}
                              className="hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              Abrir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default RecebimentoMaterial;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Beaker, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockConservantes = [
  { id: 1, codigo: "001", nome: "EDTA K2", tipo: "Anticoagulante", cor: "Roxo", volume: "3 mL", status: "ativo" },
  { id: 2, codigo: "002", nome: "EDTA K3", tipo: "Anticoagulante", cor: "Roxo", volume: "4 mL", status: "ativo" },
  { id: 3, codigo: "003", nome: "Citrato de Sódio", tipo: "Anticoagulante", cor: "Azul", volume: "2.7 mL", status: "ativo" },
  { id: 4, codigo: "004", nome: "Heparina", tipo: "Anticoagulante", cor: "Verde", volume: "4 mL", status: "ativo" },
  { id: 5, codigo: "005", nome: "Fluoreto de Sódio", tipo: "Antiglicolítico", cor: "Cinza", volume: "2 mL", status: "ativo" },
  { id: 6, codigo: "006", nome: "Gel Separador", tipo: "Ativador de Coágulo", cor: "Amarelo", volume: "5 mL", status: "ativo" },
  { id: 7, codigo: "007", nome: "Sem Aditivo", tipo: "Seco", cor: "Vermelho", volume: "5 mL", status: "ativo" },
  { id: 8, codigo: "008", nome: "Ácido Bórico", tipo: "Conservante", cor: "Branco", volume: "10 mL", status: "inativo" },
];

export default function Conservantes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const tipos = [...new Set(mockConservantes.map((c) => c.tipo))];

  const filteredConservantes = mockConservantes.filter((cons) => {
    const matchSearch =
      cons.codigo.toLowerCase().includes(search.toLowerCase()) ||
      cons.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || cons.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || cons.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Conservante ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O conservante foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Saúde Cadastro</span>
        <span>/</span>
        <span>Laboratório</span>
        <span>/</span>
        <span className="text-foreground font-medium">Conservantes</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conservantes</h1>
          <p className="text-muted-foreground">Gerenciamento de conservantes e anticoagulantes</p>
        </div>
        <Button onClick={() => navigate("/cadastro/conservantes/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Conservante
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockConservantes.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Anticoagulantes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockConservantes.filter((c) => c.tipo === "Anticoagulante").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockConservantes.filter((c) => c.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockConservantes.filter((c) => c.status === "inativo").length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cor do Tubo</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConservantes.map((cons) => (
                <TableRow key={cons.id}>
                  <TableCell className="font-mono">{cons.codigo}</TableCell>
                  <TableCell className="font-medium">{cons.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cons.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{
                          backgroundColor:
                            cons.cor === "Roxo" ? "#8B5CF6" :
                            cons.cor === "Azul" ? "#3B82F6" :
                            cons.cor === "Verde" ? "#22C55E" :
                            cons.cor === "Cinza" ? "#6B7280" :
                            cons.cor === "Amarelo" ? "#EAB308" :
                            cons.cor === "Vermelho" ? "#EF4444" :
                            cons.cor === "Branco" ? "#FFFFFF" : "#E5E7EB"
                        }}
                      />
                      {cons.cor}
                    </div>
                  </TableCell>
                  <TableCell>{cons.volume}</TableCell>
                  <TableCell>
                    <Badge variant={cons.status === "ativo" ? "default" : "secondary"}>
                      {cons.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/conservantes/${cons.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/conservantes/${cons.id}/editar`)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(cons.id, cons.status)}
                        title={cons.status === "ativo" ? "Inativar" : "Ativar"}
                      >
                        {cons.status === "ativo" ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredConservantes.length} de {mockConservantes.length} registros
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

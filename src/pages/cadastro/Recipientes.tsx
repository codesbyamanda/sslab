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
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockRecipientes = [
  { id: 1, codigo: "TB-RX", nome: "Tubo Roxo", tipo: "Tubo", material: "Plástico", volume: "4 mL", status: "ativo" },
  { id: 2, codigo: "TB-AZ", nome: "Tubo Azul", tipo: "Tubo", material: "Plástico", volume: "2.7 mL", status: "ativo" },
  { id: 3, codigo: "TB-VD", nome: "Tubo Verde", tipo: "Tubo", material: "Plástico", volume: "4 mL", status: "ativo" },
  { id: 4, codigo: "TB-AM", nome: "Tubo Amarelo", tipo: "Tubo", material: "Plástico", volume: "5 mL", status: "ativo" },
  { id: 5, codigo: "TB-VM", nome: "Tubo Vermelho", tipo: "Tubo", material: "Vidro", volume: "5 mL", status: "ativo" },
  { id: 6, codigo: "FR-UR", nome: "Frasco de Urina", tipo: "Frasco", material: "Plástico", volume: "80 mL", status: "ativo" },
  { id: 7, codigo: "FR-FZ", nome: "Frasco de Fezes", tipo: "Frasco", material: "Plástico", volume: "50 mL", status: "ativo" },
  { id: 8, codigo: "SW-ST", nome: "Swab Estéril", tipo: "Swab", material: "Algodão", volume: "-", status: "ativo" },
  { id: 9, codigo: "LM-VD", nome: "Lâmina de Vidro", tipo: "Lâmina", material: "Vidro", volume: "-", status: "ativo" },
  { id: 10, codigo: "SG-HM", nome: "Seringa Hemocultura", tipo: "Seringa", material: "Plástico", volume: "10 mL", status: "inativo" },
];

export default function Recipientes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const tipos = [...new Set(mockRecipientes.map((r) => r.tipo))];

  const filteredRecipientes = mockRecipientes.filter((rec) => {
    const matchSearch =
      rec.codigo.toLowerCase().includes(search.toLowerCase()) ||
      rec.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || rec.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || rec.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Recipiente ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O recipiente foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
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
        <span className="text-foreground font-medium">Recipientes</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recipientes</h1>
          <p className="text-muted-foreground">Gerenciamento de tubos, frascos e recipientes de coleta</p>
        </div>
        <Button onClick={() => navigate("/cadastro/recipientes/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Recipiente
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
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockRecipientes.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tubos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockRecipientes.filter((r) => r.tipo === "Tubo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockRecipientes.filter((r) => r.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockRecipientes.filter((r) => r.status === "inativo").length}
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
                <TableHead>Material</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipientes.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-mono">{rec.codigo}</TableCell>
                  <TableCell className="font-medium">{rec.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rec.tipo}</Badge>
                  </TableCell>
                  <TableCell>{rec.material}</TableCell>
                  <TableCell>{rec.volume}</TableCell>
                  <TableCell>
                    <Badge variant={rec.status === "ativo" ? "default" : "secondary"}>
                      {rec.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/recipientes/${rec.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/recipientes/${rec.id}/editar`)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(rec.id, rec.status)}
                        title={rec.status === "ativo" ? "Inativar" : "Ativar"}
                      >
                        {rec.status === "ativo" ? (
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
              Mostrando 1-{filteredRecipientes.length} de {mockRecipientes.length} registros
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

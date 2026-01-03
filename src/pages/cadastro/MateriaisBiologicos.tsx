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
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, TestTube, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMateriais = [
  { id: 1, codigo: "SG", nome: "Sangue", categoria: "Fluidos", origem: "Venosa", status: "ativo" },
  { id: 2, codigo: "UR", nome: "Urina", categoria: "Fluidos", origem: "Micção", status: "ativo" },
  { id: 3, codigo: "FZ", nome: "Fezes", categoria: "Excreções", origem: "Coleta", status: "ativo" },
  { id: 4, codigo: "SR", nome: "Soro", categoria: "Fluidos", origem: "Centrifugação", status: "ativo" },
  { id: 5, codigo: "PL", nome: "Plasma", categoria: "Fluidos", origem: "Centrifugação", status: "ativo" },
  { id: 6, codigo: "LC", nome: "Líquor", categoria: "Fluidos", origem: "Punção Lombar", status: "ativo" },
  { id: 7, codigo: "SC", nome: "Secreção", categoria: "Secreções", origem: "Swab", status: "ativo" },
  { id: 8, codigo: "SA", nome: "Saliva", categoria: "Fluidos", origem: "Coleta", status: "ativo" },
  { id: 9, codigo: "ES", nome: "Escarro", categoria: "Secreções", origem: "Expectoração", status: "ativo" },
  { id: 10, codigo: "BI", nome: "Biópsia", categoria: "Tecidos", origem: "Cirúrgica", status: "inativo" },
];

export default function MateriaisBiologicos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");

  const categorias = [...new Set(mockMateriais.map((m) => m.categoria))];

  const filteredMateriais = mockMateriais.filter((mat) => {
    const matchSearch =
      mat.codigo.toLowerCase().includes(search.toLowerCase()) ||
      mat.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || mat.status === statusFilter;
    const matchCategoria = categoriaFilter === "todas" || mat.categoria === categoriaFilter;
    return matchSearch && matchStatus && matchCategoria;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Material ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O material biológico foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
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
        <span className="text-foreground font-medium">Materiais Biológicos</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Materiais Biológicos</h1>
          <p className="text-muted-foreground">Gerenciamento de tipos de amostras biológicas</p>
        </div>
        <Button onClick={() => navigate("/cadastro/materiais-biologicos/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
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
              <TestTube className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockMateriais.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fluidos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockMateriais.filter((m) => m.categoria === "Fluidos").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockMateriais.filter((m) => m.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockMateriais.filter((m) => m.status === "inativo").length}
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
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
                <TableHead>Categoria</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMateriais.map((mat) => (
                <TableRow key={mat.id}>
                  <TableCell className="font-mono font-medium">{mat.codigo}</TableCell>
                  <TableCell className="font-medium">{mat.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{mat.categoria}</Badge>
                  </TableCell>
                  <TableCell>{mat.origem}</TableCell>
                  <TableCell>
                    <Badge variant={mat.status === "ativo" ? "default" : "secondary"}>
                      {mat.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/materiais-biologicos/${mat.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/materiais-biologicos/${mat.id}/editar`)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(mat.id, mat.status)}
                        title={mat.status === "ativo" ? "Inativar" : "Ativar"}
                      >
                        {mat.status === "ativo" ? (
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
              Mostrando 1-{filteredMateriais.length} de {mockMateriais.length} registros
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

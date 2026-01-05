import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, FileHeart, Upload } from "lucide-react";
const mockCIDs = [{
  id: 1,
  codigo: "A00",
  descricao: "Cólera",
  categoria: "Doenças infecciosas",
  status: "ativo"
}, {
  id: 2,
  codigo: "A01",
  descricao: "Febres tifóide e paratifóide",
  categoria: "Doenças infecciosas",
  status: "ativo"
}, {
  id: 3,
  codigo: "B15",
  descricao: "Hepatite aguda A",
  categoria: "Hepatites virais",
  status: "ativo"
}, {
  id: 4,
  codigo: "C00",
  descricao: "Neoplasia maligna do lábio",
  categoria: "Neoplasias",
  status: "ativo"
}, {
  id: 5,
  codigo: "D50",
  descricao: "Anemia por deficiência de ferro",
  categoria: "Doenças do sangue",
  status: "ativo"
}, {
  id: 6,
  codigo: "E10",
  descricao: "Diabetes mellitus insulino-dependente",
  categoria: "Doenças endócrinas",
  status: "ativo"
}, {
  id: 7,
  codigo: "F32",
  descricao: "Episódio depressivo",
  categoria: "Transtornos mentais",
  status: "ativo"
}, {
  id: 8,
  codigo: "G40",
  descricao: "Epilepsia",
  categoria: "Doenças do sistema nervoso",
  status: "ativo"
}, {
  id: 9,
  codigo: "I10",
  descricao: "Hipertensão essencial (primária)",
  categoria: "Doenças cardiovasculares",
  status: "ativo"
}, {
  id: 10,
  codigo: "J18",
  descricao: "Pneumonia por microrganismo não especificado",
  categoria: "Doenças respiratórias",
  status: "ativo"
}];
export default function CID() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const categorias = [...new Set(mockCIDs.map(c => c.categoria))];
  const filteredCIDs = mockCIDs.filter(cid => {
    const matchSearch = cid.codigo.toLowerCase().includes(search.toLowerCase()) || cid.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || cid.status === statusFilter;
    const matchCategoria = categoriaFilter === "todas" || cid.categoria === categoriaFilter;
    return matchSearch && matchStatus && matchCategoria;
  });
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CID - Classificação Internacional de Doenças</h1>
          <p className="text-muted-foreground">Gerenciamento dos códigos CID-10</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar CID
          </Button>
          <Button onClick={() => navigate("/cadastro/cid/novo")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo CID
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de CIDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileHeart className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">10.542</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">22</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">10.540</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">2</span>
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
                <Input placeholder="Buscar por código ou descrição..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Categorias</SelectItem>
                {categorias.map(cat => <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>)}
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
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCIDs.map(cid => <TableRow key={cid.id}>
                  <TableCell className="font-mono font-medium">{cid.codigo}</TableCell>
                  <TableCell>{cid.descricao}</TableCell>
                  <TableCell>{cid.categoria}</TableCell>
                  <TableCell>
                    <Badge variant={cid.status === "ativo" ? "default" : "secondary"}>
                      {cid.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/cid/${cid.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/cid/${cid.id}/editar`)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-10 de 10.542 registros
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="sm">
                1055
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}
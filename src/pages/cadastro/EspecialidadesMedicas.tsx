import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Stethoscope, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const mockEspecialidades = [{
  id: 1,
  codigo: "001",
  codigoANS: "1",
  codigoTUSS: "1",
  nome: "Clínica Médica",
  area: "Clínica",
  status: "ativo"
}, {
  id: 2,
  codigo: "002",
  codigoANS: "2",
  codigoTUSS: "2",
  nome: "Cardiologia",
  area: "Clínica",
  status: "ativo"
}, {
  id: 3,
  codigo: "003",
  codigoANS: "3",
  codigoTUSS: "3",
  nome: "Dermatologia",
  area: "Clínica",
  status: "ativo"
}, {
  id: 4,
  codigo: "004",
  codigoANS: "4",
  codigoTUSS: "4",
  nome: "Endocrinologia",
  area: "Clínica",
  status: "ativo"
}, {
  id: 5,
  codigo: "005",
  codigoANS: "5",
  codigoTUSS: "5",
  nome: "Gastroenterologia",
  area: "Clínica",
  status: "ativo"
}, {
  id: 6,
  codigo: "006",
  codigoANS: "6",
  codigoTUSS: "6",
  nome: "Ginecologia",
  area: "Cirúrgica",
  status: "ativo"
}, {
  id: 7,
  codigo: "007",
  codigoANS: "7",
  codigoTUSS: "7",
  nome: "Neurologia",
  area: "Clínica",
  status: "ativo"
}, {
  id: 8,
  codigo: "008",
  codigoANS: "8",
  codigoTUSS: "8",
  nome: "Oftalmologia",
  area: "Cirúrgica",
  status: "ativo"
}, {
  id: 9,
  codigo: "009",
  codigoANS: "9",
  codigoTUSS: "9",
  nome: "Ortopedia",
  area: "Cirúrgica",
  status: "inativo"
}, {
  id: 10,
  codigo: "010",
  codigoANS: "10",
  codigoTUSS: "10",
  nome: "Pediatria",
  area: "Clínica",
  status: "ativo"
}];
export default function EspecialidadesMedicas() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todas");
  const areas = [...new Set(mockEspecialidades.map(e => e.area))];
  const filteredEspecialidades = mockEspecialidades.filter(esp => {
    const matchSearch = esp.codigo.toLowerCase().includes(search.toLowerCase()) || esp.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || esp.status === statusFilter;
    const matchArea = areaFilter === "todas" || esp.area === areaFilter;
    return matchSearch && matchStatus && matchArea;
  });
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Especialidade ${newStatus === "ativo" ? "ativada" : "inativada"}`,
      description: `A especialidade foi ${newStatus === "ativo" ? "ativada" : "inativada"} com sucesso.`
    });
  };
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Especialidades Médicas</h1>
          <p className="text-muted-foreground">Gerenciamento de especialidades médicas (ANS/TUSS)</p>
        </div>
        <Button onClick={() => navigate("/cadastro/especialidades/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Especialidade
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
              <Stethoscope className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockEspecialidades.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clínicas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockEspecialidades.filter(e => e.area === "Clínica").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cirúrgicas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockEspecialidades.filter(e => e.area === "Cirúrgica").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockEspecialidades.filter(e => e.status === "ativo").length}
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
                <Input placeholder="Buscar por código ou nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Áreas</SelectItem>
                {areas.map(area => <SelectItem key={area} value={area}>
                    {area}
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
                <TableHead>Código ANS</TableHead>
                <TableHead>Código TUSS</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEspecialidades.map(esp => <TableRow key={esp.id}>
                  <TableCell className="font-mono">{esp.codigo}</TableCell>
                  <TableCell>{esp.codigoANS}</TableCell>
                  <TableCell>{esp.codigoTUSS}</TableCell>
                  <TableCell className="font-medium">{esp.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{esp.area}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={esp.status === "ativo" ? "default" : "secondary"}>
                      {esp.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/especialidades/${esp.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/especialidades/${esp.id}/editar`)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(esp.id, esp.status)} title={esp.status === "ativo" ? "Inativar" : "Ativar"}>
                        {esp.status === "ativo" ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredEspecialidades.length} de {mockEspecialidades.length} registros
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
    </div>;
}
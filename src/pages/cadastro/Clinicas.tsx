import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Building, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const mockClinicas = [{
  id: 1,
  codigo: "001",
  nome: "Clínica São Lucas",
  cnpj: "12.345.678/0001-90",
  cidade: "São Paulo",
  uf: "SP",
  tipo: "Laboratório",
  status: "ativo"
}, {
  id: 2,
  codigo: "002",
  nome: "Centro Médico Vida",
  cnpj: "23.456.789/0001-01",
  cidade: "São Paulo",
  uf: "SP",
  tipo: "Clínica",
  status: "ativo"
}, {
  id: 3,
  codigo: "003",
  nome: "Laboratório Central",
  cnpj: "34.567.890/0001-12",
  cidade: "Rio de Janeiro",
  uf: "RJ",
  tipo: "Laboratório",
  status: "ativo"
}, {
  id: 4,
  codigo: "004",
  nome: "Hospital Santa Maria",
  cnpj: "45.678.901/0001-23",
  cidade: "Belo Horizonte",
  uf: "MG",
  tipo: "Hospital",
  status: "ativo"
}, {
  id: 5,
  codigo: "005",
  nome: "Diagnósticos Rápidos",
  cnpj: "56.789.012/0001-34",
  cidade: "Curitiba",
  uf: "PR",
  tipo: "Laboratório",
  status: "ativo"
}, {
  id: 6,
  codigo: "006",
  nome: "Clínica Popular Saúde",
  cnpj: "67.890.123/0001-45",
  cidade: "Porto Alegre",
  uf: "RS",
  tipo: "Clínica",
  status: "inativo"
}, {
  id: 7,
  codigo: "007",
  nome: "Lab Express",
  cnpj: "78.901.234/0001-56",
  cidade: "Salvador",
  uf: "BA",
  tipo: "Laboratório",
  status: "ativo"
}, {
  id: 8,
  codigo: "008",
  nome: "Centro Diagnóstico Avançado",
  cnpj: "89.012.345/0001-67",
  cidade: "Recife",
  uf: "PE",
  tipo: "Diagnóstico",
  status: "ativo"
}];
export default function Clinicas() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const tipos = [...new Set(mockClinicas.map(c => c.tipo))];
  const filteredClinicas = mockClinicas.filter(clinica => {
    const matchSearch = clinica.codigo.toLowerCase().includes(search.toLowerCase()) || clinica.nome.toLowerCase().includes(search.toLowerCase()) || clinica.cnpj.includes(search);
    const matchStatus = statusFilter === "todos" || clinica.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || clinica.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Clínica ${newStatus === "ativo" ? "ativada" : "inativada"}`,
      description: `A clínica foi ${newStatus === "ativo" ? "ativada" : "inativada"} com sucesso.`
    });
  };
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clínicas</h1>
          <p className="text-muted-foreground">Gerenciamento de clínicas, laboratórios e hospitais parceiros</p>
        </div>
        <Button onClick={() => navigate("/cadastro/clinicas/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Clínica
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
              <Building className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockClinicas.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Laboratórios</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockClinicas.filter(c => c.tipo === "Laboratório").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockClinicas.filter(c => c.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockClinicas.filter(c => c.status === "inativo").length}
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
                <Input placeholder="Buscar por código, nome ou CNPJ..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                {tipos.map(tipo => <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativas</SelectItem>
                <SelectItem value="inativo">Inativas</SelectItem>
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
                <TableHead>CNPJ</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClinicas.map(clinica => <TableRow key={clinica.id}>
                  <TableCell className="font-mono">{clinica.codigo}</TableCell>
                  <TableCell className="font-medium">{clinica.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{clinica.cnpj}</TableCell>
                  <TableCell>{clinica.cidade}/{clinica.uf}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{clinica.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={clinica.status === "ativo" ? "default" : "secondary"}>
                      {clinica.status === "ativo" ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/clinicas/${clinica.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/clinicas/${clinica.id}/editar`)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(clinica.id, clinica.status)} title={clinica.status === "ativo" ? "Inativar" : "Ativar"}>
                        {clinica.status === "ativo" ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredClinicas.length} de {mockClinicas.length} registros
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
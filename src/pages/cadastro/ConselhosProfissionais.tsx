import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Award, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const mockConselhos = [{
  id: 1,
  sigla: "CRM",
  nome: "Conselho Regional de Medicina",
  uf: "Todos",
  tipo: "Médico",
  status: "ativo"
}, {
  id: 2,
  sigla: "COREN",
  nome: "Conselho Regional de Enfermagem",
  uf: "Todos",
  tipo: "Enfermagem",
  status: "ativo"
}, {
  id: 3,
  sigla: "CRO",
  nome: "Conselho Regional de Odontologia",
  uf: "Todos",
  tipo: "Odontologia",
  status: "ativo"
}, {
  id: 4,
  sigla: "CRF",
  nome: "Conselho Regional de Farmácia",
  uf: "Todos",
  tipo: "Farmácia",
  status: "ativo"
}, {
  id: 5,
  sigla: "CRBM",
  nome: "Conselho Regional de Biomedicina",
  uf: "Todos",
  tipo: "Biomedicina",
  status: "ativo"
}, {
  id: 6,
  sigla: "CRP",
  nome: "Conselho Regional de Psicologia",
  uf: "Todos",
  tipo: "Psicologia",
  status: "ativo"
}, {
  id: 7,
  sigla: "CREFITO",
  nome: "Conselho Regional de Fisioterapia e Terapia Ocupacional",
  uf: "Todos",
  tipo: "Fisioterapia",
  status: "ativo"
}, {
  id: 8,
  sigla: "CRN",
  nome: "Conselho Regional de Nutricionistas",
  uf: "Todos",
  tipo: "Nutrição",
  status: "ativo"
}, {
  id: 9,
  sigla: "CRBIO",
  nome: "Conselho Regional de Biologia",
  uf: "Todos",
  tipo: "Biologia",
  status: "inativo"
}, {
  id: 10,
  sigla: "CRASS",
  nome: "Conselho Regional de Serviço Social",
  uf: "Todos",
  tipo: "Serviço Social",
  status: "ativo"
}];
export default function ConselhosProfissionais() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const tipos = [...new Set(mockConselhos.map(c => c.tipo))];
  const filteredConselhos = mockConselhos.filter(conselho => {
    const matchSearch = conselho.sigla.toLowerCase().includes(search.toLowerCase()) || conselho.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || conselho.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || conselho.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Conselho ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O conselho foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`
    });
  };
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conselhos Profissionais</h1>
          <p className="text-muted-foreground">Gerenciamento de conselhos de classe</p>
        </div>
        <Button onClick={() => navigate("/cadastro/conselhos/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Conselho
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
              <Award className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockConselhos.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockConselhos.filter(c => c.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockConselhos.filter(c => c.status === "inativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{tipos.length}</span>
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
                <Input placeholder="Buscar por sigla ou nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
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
                <TableHead>Sigla</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Abrangência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConselhos.map(conselho => <TableRow key={conselho.id}>
                  <TableCell className="font-mono font-bold">{conselho.sigla}</TableCell>
                  <TableCell>{conselho.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conselho.tipo}</Badge>
                  </TableCell>
                  <TableCell>{conselho.uf}</TableCell>
                  <TableCell>
                    <Badge variant={conselho.status === "ativo" ? "default" : "secondary"}>
                      {conselho.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/conselhos/${conselho.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/conselhos/${conselho.id}/editar`)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(conselho.id, conselho.status)} title={conselho.status === "ativo" ? "Inativar" : "Ativar"}>
                        {conselho.status === "ativo" ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredConselhos.length} de {mockConselhos.length} registros
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const mockPrazos = [{
  id: 1,
  codigo: "001",
  nome: "Urgente",
  horas: 2,
  tipo: "Horas",
  diasUteis: false,
  status: "ativo"
}, {
  id: 2,
  codigo: "002",
  nome: "Mesmo Dia",
  horas: 8,
  tipo: "Horas",
  diasUteis: false,
  status: "ativo"
}, {
  id: 3,
  codigo: "003",
  nome: "24 Horas",
  horas: 24,
  tipo: "Horas",
  diasUteis: false,
  status: "ativo"
}, {
  id: 4,
  codigo: "004",
  nome: "48 Horas",
  horas: 48,
  tipo: "Horas",
  diasUteis: false,
  status: "ativo"
}, {
  id: 5,
  codigo: "005",
  nome: "1 Dia Útil",
  horas: 24,
  tipo: "Dias Úteis",
  diasUteis: true,
  status: "ativo"
}, {
  id: 6,
  codigo: "006",
  nome: "2 Dias Úteis",
  horas: 48,
  tipo: "Dias Úteis",
  diasUteis: true,
  status: "ativo"
}, {
  id: 7,
  codigo: "007",
  nome: "3 Dias Úteis",
  horas: 72,
  tipo: "Dias Úteis",
  diasUteis: true,
  status: "ativo"
}, {
  id: 8,
  codigo: "008",
  nome: "5 Dias Úteis",
  horas: 120,
  tipo: "Dias Úteis",
  diasUteis: true,
  status: "ativo"
}, {
  id: 9,
  codigo: "009",
  nome: "7 Dias Úteis",
  horas: 168,
  tipo: "Dias Úteis",
  diasUteis: true,
  status: "ativo"
}, {
  id: 10,
  codigo: "010",
  nome: "15 Dias",
  horas: 360,
  tipo: "Dias",
  diasUteis: false,
  status: "inativo"
}];
export default function PrazosEntrega() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const tipos = [...new Set(mockPrazos.map(p => p.tipo))];
  const filteredPrazos = mockPrazos.filter(prazo => {
    const matchSearch = prazo.codigo.toLowerCase().includes(search.toLowerCase()) || prazo.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || prazo.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || prazo.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });
  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Prazo ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O prazo de entrega foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`
    });
  };
  const formatPrazo = (horas: number, tipo: string) => {
    if (tipo === "Horas") {
      return `${horas}h`;
    }
    const dias = Math.floor(horas / 24);
    return `${dias} dia${dias > 1 ? "s" : ""}`;
  };
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prazos de Entrega</h1>
          <p className="text-muted-foreground">Configuração de prazos para liberação de resultados</p>
        </div>
        <Button onClick={() => navigate("/cadastro/prazos-entrega/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Prazo
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
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockPrazos.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Horas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockPrazos.filter(p => p.tipo === "Horas").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockPrazos.filter(p => p.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockPrazos.filter(p => p.status === "inativo").length}
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
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dias Úteis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrazos.map(prazo => <TableRow key={prazo.id}>
                  <TableCell className="font-mono">{prazo.codigo}</TableCell>
                  <TableCell className="font-medium">{prazo.nome}</TableCell>
                  <TableCell>{formatPrazo(prazo.horas, prazo.tipo)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{prazo.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prazo.diasUteis ? "default" : "secondary"}>
                      {prazo.diasUteis ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prazo.status === "ativo" ? "default" : "secondary"}>
                      {prazo.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/prazos-entrega/${prazo.id}`)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/prazos-entrega/${prazo.id}/editar`)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(prazo.id, prazo.status)} title={prazo.status === "ativo" ? "Inativar" : "Ativar"}>
                        {prazo.status === "ativo" ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredPrazos.length} de {mockPrazos.length} registros
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, Search, Settings2, Type, Hash, Calendar, Calculator } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const parametrosMock = [
  { id: 1, codigo: "PRM001", nome: "Hemoglobina", tipo: "Numérico", unidade: "g/dL", status: "ativo" },
  { id: 2, codigo: "PRM002", nome: "Hematócrito", tipo: "Numérico", unidade: "%", status: "ativo" },
  { id: 3, codigo: "PRM003", nome: "Leucócitos", tipo: "Numérico", unidade: "/mm³", status: "ativo" },
  { id: 4, codigo: "PRM004", nome: "Observações", tipo: "Texto", unidade: "-", status: "ativo" },
  { id: 5, codigo: "PRM005", nome: "Data Coleta", tipo: "Data", unidade: "-", status: "ativo" },
  { id: 6, codigo: "PRM006", nome: "IMC Calculado", tipo: "Fórmula", unidade: "kg/m²", status: "inativo" },
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "Texto": return <Type className="h-4 w-4" />;
    case "Numérico": return <Hash className="h-4 w-4" />;
    case "Data": return <Calendar className="h-4 w-4" />;
    case "Fórmula": return <Calculator className="h-4 w-4" />;
    default: return <Settings2 className="h-4 w-4" />;
  }
};

export default function Parametros() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const filteredParametros = parametrosMock.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    const matchesTipo = tipoFilter === "todos" || item.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const numericos = parametrosMock.filter(p => p.tipo === "Numérico").length;
  const textos = parametrosMock.filter(p => p.tipo === "Texto").length;
  const formulas = parametrosMock.filter(p => p.tipo === "Fórmula").length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Parâmetros</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Parâmetros
          </h1>
          <p className="text-muted-foreground">Gerencie os parâmetros de laudos</p>
        </div>
        <Button onClick={() => navigate("/cadastro/parametros/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Parâmetro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Parâmetros"
          value={parametrosMock.length}
          icon={Settings2}
          variant="primary"
        />
        <StatCard
          title="Numéricos"
          value={numericos}
          variant="primary"
        />
        <StatCard
          title="Texto"
          value={textos}
          variant="warning"
        />
        <StatCard
          title="Fórmulas"
          value={formulas}
          variant="success"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Texto">Texto</SelectItem>
                <SelectItem value="Numérico">Numérico</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
                <SelectItem value="Fórmula">Fórmula</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParametros.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(item.tipo)}
                      {item.tipo}
                    </div>
                  </TableCell>
                  <TableCell>{item.unidade}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/parametros/${item.id}`)}
                      onEdit={() => navigate(`/cadastro/parametros/${item.id}?edit=true`)}
                      isActive={item.status === "ativo"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

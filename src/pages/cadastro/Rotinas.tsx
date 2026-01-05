import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, LayoutList } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const rotinasMock = [
  { id: 1, codigo: "ROT001", nome: "Hemograma Completo", parametros: 12, setor: "Hematologia", status: "ativo" },
  { id: 2, codigo: "ROT002", nome: "Glicemia", parametros: 3, setor: "Bioquímica", status: "ativo" },
  { id: 3, codigo: "ROT003", nome: "Perfil Lipídico", parametros: 6, setor: "Bioquímica", status: "ativo" },
  { id: 4, codigo: "ROT004", nome: "Urina Tipo I", parametros: 15, setor: "Uroanálise", status: "ativo" },
  { id: 5, codigo: "ROT005", nome: "TSH", parametros: 2, setor: "Hormônios", status: "inativo" },
];

export default function Rotinas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [setorFilter, setSetorFilter] = useState("todos");

  const filteredRotinas = rotinasMock.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    const matchesSetor = setorFilter === "todos" || item.setor === setorFilter;
    return matchesSearch && matchesStatus && matchesSetor;
  });

  const totalAtivas = rotinasMock.filter(r => r.status === "ativo").length;
  const totalParametros = rotinasMock.reduce((acc, r) => acc + r.parametros, 0);
  const totalSetores = new Set(rotinasMock.map(r => r.setor)).size;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rotinas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutList className="h-6 w-6 text-primary" />
            Rotinas
          </h1>
          <p className="text-muted-foreground">Gerencie as rotinas de exames</p>
        </div>
        <Button onClick={() => navigate("/cadastro/rotinas/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Rotina
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Rotinas"
          value={rotinasMock.length}
          icon={LayoutList}
          variant="primary"
        />
        <StatCard
          title="Rotinas Ativas"
          value={totalAtivas}
          variant="success"
        />
        <StatCard
          title="Total Parâmetros"
          value={totalParametros}
          variant="primary"
        />
        <StatCard
          title="Setores"
          value={totalSetores}
          variant="warning"
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
            <Select value={setorFilter} onValueChange={setSetorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                <SelectItem value="Hematologia">Hematologia</SelectItem>
                <SelectItem value="Bioquímica">Bioquímica</SelectItem>
                <SelectItem value="Uroanálise">Uroanálise</SelectItem>
                <SelectItem value="Hormônios">Hormônios</SelectItem>
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
                <TableHead>Setor</TableHead>
                <TableHead className="text-center">Parâmetros</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRotinas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.setor}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.parametros}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/rotinas/${item.id}`)}
                      onEdit={() => navigate(`/cadastro/rotinas/${item.id}?edit=true`)}
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

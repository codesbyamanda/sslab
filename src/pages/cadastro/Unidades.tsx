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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Plus, Filter, X } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockUnidades = [
  { id: 1, codigo: "UND001", nome: "Unidade Centro", empresa: "Laboratório Central Ltda", cnes: "1234567", cidade: "São Paulo", status: "ativo", setores: 5 },
  { id: 2, codigo: "UND002", nome: "Unidade Zona Sul", empresa: "Laboratório Central Ltda", cnes: "2345678", cidade: "São Paulo", status: "ativo", setores: 3 },
  { id: 3, codigo: "UND003", nome: "Unidade Campinas", empresa: "Clínica Saúde Total S.A.", cnes: "3456789", cidade: "Campinas", status: "ativo", setores: 4 },
  { id: 4, codigo: "UND004", nome: "Unidade Santos", empresa: "Clínica Saúde Total S.A.", cnes: "4567890", cidade: "Santos", status: "inativo", setores: 2 },
];

export default function Unidades() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("all");

  const filteredUnidades = mockUnidades.filter((unidade) => {
    const matchSearch =
      unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidade.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmpresa = empresaFilter === "all" || unidade.empresa.includes(empresaFilter);
    return matchSearch && matchEmpresa;
  });

  const totalAtivas = mockUnidades.filter((u) => u.status === "ativo").length;
  const totalSetores = mockUnidades.reduce((acc, u) => acc + u.setores, 0);
  const cidadesAtendidas = new Set(mockUnidades.map((u) => u.cidade)).size;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Unidades</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Unidades
          </h1>
          <p className="text-muted-foreground">
            Gerencie as unidades de atendimento
          </p>
        </div>
        <Button onClick={() => navigate("/cadastro/unidades/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Unidades"
          value={mockUnidades.length}
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Unidades Ativas"
          value={totalAtivas}
          variant="success"
        />
        <StatCard
          title="Total de Setores"
          value={totalSetores}
          variant="primary"
        />
        <StatCard
          title="Cidades Atendidas"
          value={cidadesAtendidas}
          variant="warning"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Código ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Empresa</label>
              <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Laboratório Central">Laboratório Central</SelectItem>
                  <SelectItem value="Clínica Saúde Total">Clínica Saúde Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="ghost" onClick={() => { setSearchTerm(""); setEmpresaFilter("all"); }}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
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
                <TableHead>Empresa</TableHead>
                <TableHead>CNES</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead className="text-center">Setores</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnidades.map((unidade) => (
                <TableRow key={unidade.id}>
                  <TableCell className="font-mono">{unidade.codigo}</TableCell>
                  <TableCell className="font-medium">{unidade.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{unidade.empresa}</TableCell>
                  <TableCell>{unidade.cnes}</TableCell>
                  <TableCell>{unidade.cidade}</TableCell>
                  <TableCell className="text-center">{unidade.setores}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={unidade.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/unidades/${unidade.id}`)}
                      onDelete={unidade.status === "inativo" ? () => {} : undefined}
                      isActive={unidade.status === "ativo"}
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

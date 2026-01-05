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
import { Plus, Search, FlaskConical } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const metodosMock = [
  { id: 1, codigo: "MTD001", nome: "Espectrofotometria", descricao: "Método por absorção de luz", status: "ativo" },
  { id: 2, codigo: "MTD002", nome: "Cromatografia Líquida", descricao: "HPLC de alta performance", status: "ativo" },
  { id: 3, codigo: "MTD003", nome: "Imunoensaio", descricao: "Método imunológico automatizado", status: "ativo" },
  { id: 4, codigo: "MTD004", nome: "Eletroforese", descricao: "Separação por carga elétrica", status: "ativo" },
  { id: 5, codigo: "MTD005", nome: "Turbidimetria", descricao: "Medição de turvação", status: "inativo" },
];

export default function Metodos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredMetodos = metodosMock.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAtivos = metodosMock.filter(m => m.status === "ativo").length;
  const totalInativos = metodosMock.filter(m => m.status === "inativo").length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Métodos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            Métodos
          </h1>
          <p className="text-muted-foreground">Gerencie os métodos analíticos</p>
        </div>
        <Button onClick={() => navigate("/cadastro/metodos/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Método
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Métodos"
          value={metodosMock.length}
          icon={FlaskConical}
          variant="primary"
        />
        <StatCard
          title="Métodos Ativos"
          value={totalAtivos}
          variant="success"
        />
        <StatCard
          title="Métodos Inativos"
          value={totalInativos}
          variant="default"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMetodos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{item.descricao}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/metodos/${item.id}`)}
                      onEdit={() => navigate(`/cadastro/metodos/${item.id}?edit=true`)}
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

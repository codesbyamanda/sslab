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
import { Plus, Search, Receipt } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const tiposContaPagarMock = [
  { id: 1, codigo: "CPG001", descricao: "Fornecedores", status: "ativo" },
  { id: 2, codigo: "CPG002", descricao: "Salários e Encargos", status: "ativo" },
  { id: 3, codigo: "CPG003", descricao: "Aluguel", status: "ativo" },
  { id: 4, codigo: "CPG004", descricao: "Energia Elétrica", status: "ativo" },
  { id: 5, codigo: "CPG005", descricao: "Impostos e Tributos", status: "ativo" },
  { id: 6, codigo: "CPG006", descricao: "Manutenção Predial", status: "inativo" },
];

export default function TiposContaPagar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipos, setTipos] = useState(tiposContaPagarMock);

  const filteredTipos = tipos.filter((item) => {
    const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTipos = tipos.length;
  const tiposAtivos = tipos.filter(t => t.status === "ativo").length;
  const tiposInativos = tipos.filter(t => t.status === "inativo").length;

  const handleToggleStatus = (id: number) => {
    setTipos(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "ativo" ? "inativo" : "ativo";
        toast.success(`Tipo de conta ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso`);
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tipos de Contas a Pagar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Tipos de Contas a Pagar
          </h1>
          <p className="text-muted-foreground">Padronize e classifique as despesas do módulo financeiro</p>
        </div>
        <Button onClick={() => navigate("/cadastro/tipo-contas-pagar/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Tipos"
          value={totalTipos}
          icon={Receipt}
          variant="primary"
        />
        <StatCard
          title="Ativos"
          value={tiposAtivos}
          variant="success"
        />
        <StatCard
          title="Inativos"
          value={tiposInativos}
          variant="error"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
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
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTipos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum tipo de conta encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredTipos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <TableActions
                        onView={() => navigate(`/cadastro/tipo-contas-pagar/${item.id}`)}
                        onEdit={() => navigate(`/cadastro/tipo-contas-pagar/${item.id}?edit=true`)}
                        onToggleStatus={() => handleToggleStatus(item.id)}
                        isActive={item.status === "ativo"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

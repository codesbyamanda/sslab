import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Search, Eye, Edit, DollarSign, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

const tiposReceitaMock = [
  { id: 1, codigo: "REC001", descricao: "Exames Laboratoriais", status: "Ativo" },
  { id: 2, codigo: "REC002", descricao: "Consultas Médicas", status: "Ativo" },
  { id: 3, codigo: "REC003", descricao: "Procedimentos", status: "Ativo" },
  { id: 4, codigo: "REC004", descricao: "Venda de Produtos", status: "Ativo" },
  { id: 5, codigo: "REC005", descricao: "Taxas Administrativas", status: "Inativo" },
];

export default function TiposReceita() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipos, setTipos] = useState(tiposReceitaMock);

  const filteredTipos = tipos.filter((item) => {
    const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTipos = tipos.length;
  const tiposAtivos = tipos.filter(t => t.status === "Ativo").length;
  const tiposInativos = tipos.filter(t => t.status === "Inativo").length;

  const handleToggleStatus = (id: number) => {
    setTipos(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "Ativo" ? "Inativo" : "Ativo";
        toast.success(`Tipo de receita ${newStatus === "Ativo" ? "ativado" : "inativado"} com sucesso`);
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tipos de Receita</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tipos de Receita</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os tipos de receita utilizados nos módulos financeiros</p>
        </div>
        <Button onClick={() => navigate("/cadastro/tipo-receita/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Receita
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Tipos</p>
                <p className="text-2xl font-bold">{totalTipos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipos Ativos</p>
                <p className="text-2xl font-bold">{tiposAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipos Inativos</p>
                <p className="text-2xl font-bold">{tiposInativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTipos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum tipo de receita encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredTipos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Ativo" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/cadastro/tipo-receita/${item.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Visualizar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/cadastro/tipo-receita/${item.id}?edit=true`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleStatus(item.id)}
                              >
                                {item.status === "Ativo" ? (
                                  <ToggleRight className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.status === "Ativo" ? "Inativar" : "Ativar"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
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

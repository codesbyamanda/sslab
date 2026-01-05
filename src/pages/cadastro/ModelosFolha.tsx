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
import { Plus, Search, Eye, Edit, FileText, Copy, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

const modelosFolhaMock = [
  { id: 1, codigo: "FLH001", nome: "Folha A4 Padrão", status: "Ativo" },
  { id: 2, codigo: "FLH002", nome: "Folha A4 Paisagem", status: "Ativo" },
  { id: 3, codigo: "FLH003", nome: "Folha Carta", status: "Ativo" },
  { id: 4, codigo: "FLH004", nome: "Etiqueta Pequena", status: "Ativo" },
  { id: 5, codigo: "FLH005", nome: "Folha Timbrada", status: "Inativo" },
];

export default function ModelosFolha() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [modelos, setModelos] = useState(modelosFolhaMock);

  const filteredModelos = modelos.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalModelos = modelos.length;
  const modelosAtivos = modelos.filter(m => m.status === "Ativo").length;
  const modelosInativos = modelos.filter(m => m.status === "Inativo").length;

  const handleToggleStatus = (id: number) => {
    setModelos(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "Ativo" ? "Inativo" : "Ativo";
        toast.success(`Modelo ${newStatus === "Ativo" ? "ativado" : "inativado"} com sucesso`);
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleDuplicate = (item: typeof modelosFolhaMock[0]) => {
    const newModelo = {
      ...item,
      id: modelos.length + 1,
      codigo: `FLH${String(modelos.length + 1).padStart(3, '0')}`,
      nome: `${item.nome} (Cópia)`,
    };
    setModelos(prev => [...prev, newModelo]);
    toast.success("Modelo duplicado com sucesso");
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
            <BreadcrumbPage>Modelos de Folha de Laudo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modelos de Folha de Laudo</h1>
          <p className="text-muted-foreground">Gerencie os modelos de folha usados nos laudos médicos/laboratoriais</p>
        </div>
        <Button onClick={() => navigate("/cadastro/modelos-folha/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo de Folha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Modelos</p>
                <p className="text-2xl font-bold">{totalModelos}</p>
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
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">{modelosAtivos}</p>
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
                <p className="text-sm text-muted-foreground">Inativos</p>
                <p className="text-2xl font-bold">{modelosInativos}</p>
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
                placeholder="Buscar por nome ou código..."
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
                <TableHead>Nome do Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModelos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum modelo de folha encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredModelos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                    <TableCell>{item.nome}</TableCell>
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
                                onClick={() => navigate(`/cadastro/modelos-folha/${item.id}`)}
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
                                onClick={() => navigate(`/cadastro/modelos-folha/${item.id}?edit=true`)}
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
                                onClick={() => handleDuplicate(item)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicar</TooltipContent>
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

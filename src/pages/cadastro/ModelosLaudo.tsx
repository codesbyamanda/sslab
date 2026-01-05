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
import { Plus, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const modelosMock = [
  { id: 1, codigo: "MDL001", nome: "Laudo Padrão", tipo: "Geral", rotinas: 15, status: "ativo" },
  { id: 2, codigo: "MDL002", nome: "Laudo Hematologia", tipo: "Específico", rotinas: 5, status: "ativo" },
  { id: 3, codigo: "MDL003", nome: "Laudo Bioquímica", tipo: "Específico", rotinas: 8, status: "ativo" },
  { id: 4, codigo: "MDL004", nome: "Laudo Hormônios", tipo: "Específico", rotinas: 6, status: "ativo" },
  { id: 5, codigo: "MDL005", nome: "Laudo Antigo", tipo: "Geral", rotinas: 10, status: "inativo" },
];

export default function ModelosLaudo() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [modelos, setModelos] = useState(modelosMock);

  const filteredModelos = modelos.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    const matchesTipo = tipoFilter === "todos" || item.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalAtivos = modelos.filter(m => m.status === "ativo").length;
  const gerais = modelos.filter(m => m.tipo === "Geral").length;
  const especificos = modelos.filter(m => m.tipo === "Específico").length;

  const handleDuplicate = (item: typeof modelosMock[0]) => {
    const newModelo = {
      ...item,
      id: modelos.length + 1,
      codigo: `MDL${String(modelos.length + 1).padStart(3, '0')}`,
      nome: `${item.nome} (Cópia)`,
    };
    setModelos(prev => [...prev, newModelo]);
    toast.success("Modelo duplicado com sucesso");
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
            <BreadcrumbPage>Modelos de Laudo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Modelos de Laudo
          </h1>
          <p className="text-muted-foreground">Gerencie os modelos de laudo</p>
        </div>
        <Button onClick={() => navigate("/cadastro/modelos-laudo/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Modelos"
          value={modelos.length}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Modelos Ativos"
          value={totalAtivos}
          variant="success"
        />
        <StatCard
          title="Modelos Gerais"
          value={gerais}
          variant="primary"
        />
        <StatCard
          title="Modelos Específicos"
          value={especificos}
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
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Específico">Específico</SelectItem>
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
                <TableHead className="text-center">Rotinas</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModelos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>
                    <Badge variant={item.tipo === "Geral" ? "default" : "outline"}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{item.rotinas}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/modelos-laudo/${item.id}`)}
                      onEdit={() => navigate(`/cadastro/modelos-laudo/${item.id}?edit=true`)}
                      onDuplicate={() => handleDuplicate(item)}
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

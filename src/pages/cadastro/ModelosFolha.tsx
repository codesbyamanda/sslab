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
import { Plus, Search, FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const modelosFolhaMock = [
  { id: 1, codigo: "FLH001", nome: "Folha A4 Padrão", status: "ativo" },
  { id: 2, codigo: "FLH002", nome: "Folha A4 Paisagem", status: "ativo" },
  { id: 3, codigo: "FLH003", nome: "Folha Carta", status: "ativo" },
  { id: 4, codigo: "FLH004", nome: "Etiqueta Pequena", status: "ativo" },
  { id: 5, codigo: "FLH005", nome: "Folha Timbrada", status: "inativo" },
];

export default function ModelosFolha() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [modelos, setModelos] = useState(modelosFolhaMock);

  const filteredModelos = modelos.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalModelos = modelos.length;
  const modelosAtivos = modelos.filter(m => m.status === "ativo").length;
  const modelosInativos = modelos.filter(m => m.status === "inativo").length;

  const handleToggleStatus = (id: number) => {
    setModelos(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "ativo" ? "inativo" : "ativo";
        toast.success(`Modelo ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso`);
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
    <div className="p-6 space-y-6">
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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Modelos de Folha de Laudo
          </h1>
          <p className="text-muted-foreground">Gerencie os modelos de folha usados nos laudos médicos/laboratoriais</p>
        </div>
        <Button onClick={() => navigate("/cadastro/modelos-folha-laudo/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo de Folha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Modelos"
          value={totalModelos}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Ativos"
          value={modelosAtivos}
          variant="success"
        />
        <StatCard
          title="Inativos"
          value={modelosInativos}
          variant="error"
        />
      </div>

      <Card>
        <CardContent className="p-4">
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
                <TableHead className="text-center">Status</TableHead>
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
                    <TableCell className="text-center">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <TableActions
                        onView={() => navigate(`/cadastro/modelos-folha-laudo/${item.id}`)}
                        onEdit={() => navigate(`/cadastro/modelos-folha-laudo/${item.id}?edit=true`)}
                        onDuplicate={() => handleDuplicate(item)}
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

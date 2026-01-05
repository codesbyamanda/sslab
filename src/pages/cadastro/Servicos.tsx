import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, Plus, ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockServicos = [
  { id: 1, codigo: "HMG", nome: "Hemograma Completo", bancada: "Hematologia", material: "Sangue", prazo: "24h", preco: 25.00, status: "ativo" },
  { id: 2, codigo: "GLI", nome: "Glicemia em Jejum", bancada: "Bioquímica", material: "Soro", prazo: "24h", preco: 12.00, status: "ativo" },
  { id: 3, codigo: "COL", nome: "Colesterol Total", bancada: "Bioquímica", material: "Soro", prazo: "24h", preco: 15.00, status: "ativo" },
  { id: 4, codigo: "TRI", nome: "Triglicerídeos", bancada: "Bioquímica", material: "Soro", prazo: "24h", preco: 15.00, status: "ativo" },
  { id: 5, codigo: "TSH", nome: "TSH", bancada: "Hormônios", material: "Soro", prazo: "48h", preco: 35.00, status: "ativo" },
  { id: 6, codigo: "T4L", nome: "T4 Livre", bancada: "Hormônios", material: "Soro", prazo: "48h", preco: 35.00, status: "ativo" },
  { id: 7, codigo: "UR1", nome: "Urina Tipo I", bancada: "Urinálise", material: "Urina", prazo: "24h", preco: 18.00, status: "ativo" },
  { id: 8, codigo: "URO", nome: "Urocultura", bancada: "Microbiologia", material: "Urina", prazo: "72h", preco: 45.00, status: "ativo" },
  { id: 9, codigo: "PFH", nome: "Perfil Hepático", bancada: "Bioquímica", material: "Soro", prazo: "24h", preco: 65.00, status: "ativo" },
  { id: 10, codigo: "VIT", nome: "Vitamina D", bancada: "Hormônios", material: "Soro", prazo: "72h", preco: 85.00, status: "inativo" },
];

export default function Servicos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [bancadaFilter, setBancadaFilter] = useState("todas");

  const bancadas = [...new Set(mockServicos.map((s) => s.bancada))];

  const filteredServicos = mockServicos.filter((serv) => {
    const matchSearch =
      serv.codigo.toLowerCase().includes(search.toLowerCase()) ||
      serv.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || serv.status === statusFilter;
    const matchBancada = bancadaFilter === "todas" || serv.bancada === bancadaFilter;
    return matchSearch && matchStatus && matchBancada;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Serviço ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O serviço foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
    });
  };

  const totalAtivos = mockServicos.filter((s) => s.status === "ativo").length;
  const totalInativos = mockServicos.filter((s) => s.status === "inativo").length;
  const bioquimica = mockServicos.filter((s) => s.bancada === "Bioquímica").length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Laboratório</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Serviços</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            Serviços / Exames
          </h1>
          <p className="text-muted-foreground">Gerenciamento de exames e serviços laboratoriais</p>
        </div>
        <Button onClick={() => navigate("/cadastro/servicos/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Serviços"
          value={mockServicos.length}
          icon={FlaskConical}
          variant="primary"
        />
        <StatCard
          title="Bioquímica"
          value={bioquimica}
          variant="primary"
        />
        <StatCard
          title="Serviços Ativos"
          value={totalAtivos}
          variant="success"
        />
        <StatCard
          title="Serviços Inativos"
          value={totalInativos}
          variant="default"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código ou nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={bancadaFilter} onValueChange={setBancadaFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Bancada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Bancadas</SelectItem>
                {bancadas.map((banc) => (
                  <SelectItem key={banc} value={banc}>
                    {banc}
                  </SelectItem>
                ))}
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Bancada</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServicos.map((serv) => (
                <TableRow key={serv.id}>
                  <TableCell className="font-mono font-medium">{serv.codigo}</TableCell>
                  <TableCell className="font-medium">{serv.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{serv.bancada}</Badge>
                  </TableCell>
                  <TableCell>{serv.material}</TableCell>
                  <TableCell>{serv.prazo}</TableCell>
                  <TableCell>R$ {serv.preco.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={serv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/servicos/${serv.id}`)}
                      onEdit={() => navigate(`/cadastro/servicos/${serv.id}/editar`)}
                      onToggleStatus={() => handleToggleStatus(serv.id, serv.status)}
                      isActive={serv.status === "ativo"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredServicos.length} de {mockServicos.length} registros
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
    </div>
  );
}

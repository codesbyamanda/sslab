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
import { Search, Plus, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockBancadas = [
  { id: 1, codigo: "HEM", nome: "Hematologia", setor: "Laboratório Central", equipamento: "ABX Pentra", exames: 15, status: "ativo" },
  { id: 2, codigo: "BIO", nome: "Bioquímica", setor: "Laboratório Central", equipamento: "Cobas c501", exames: 42, status: "ativo" },
  { id: 3, codigo: "IMU", nome: "Imunologia", setor: "Laboratório Central", equipamento: "Cobas e601", exames: 28, status: "ativo" },
  { id: 4, codigo: "HOR", nome: "Hormônios", setor: "Laboratório Central", equipamento: "Cobas e601", exames: 35, status: "ativo" },
  { id: 5, codigo: "COA", nome: "Coagulação", setor: "Laboratório Central", equipamento: "ACL TOP", exames: 8, status: "ativo" },
  { id: 6, codigo: "URI", nome: "Urinálise", setor: "Laboratório Central", equipamento: "iRICELL", exames: 5, status: "ativo" },
  { id: 7, codigo: "MIC", nome: "Microbiologia", setor: "Microbiologia", equipamento: "VITEK 2", exames: 22, status: "ativo" },
  { id: 8, codigo: "PAR", nome: "Parasitologia", setor: "Parasitologia", equipamento: "Manual", exames: 6, status: "ativo" },
  { id: 9, codigo: "GAS", nome: "Gasometria", setor: "Urgência", equipamento: "ABL800", exames: 3, status: "ativo" },
  { id: 10, codigo: "CIT", nome: "Citologia", setor: "Anatomia Patológica", equipamento: "Manual", exames: 4, status: "inativo" },
];

export default function Bancadas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [setorFilter, setSetorFilter] = useState("todos");

  const setores = [...new Set(mockBancadas.map((b) => b.setor))];

  const filteredBancadas = mockBancadas.filter((banc) => {
    const matchSearch =
      banc.codigo.toLowerCase().includes(search.toLowerCase()) ||
      banc.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || banc.status === statusFilter;
    const matchSetor = setorFilter === "todos" || banc.setor === setorFilter;
    return matchSearch && matchStatus && matchSetor;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Bancada ${newStatus === "ativo" ? "ativada" : "inativada"}`,
      description: `A bancada foi ${newStatus === "ativo" ? "ativada" : "inativada"} com sucesso.`,
    });
  };

  const totalAtivas = mockBancadas.filter((b) => b.status === "ativo").length;
  const totalInativos = mockBancadas.filter((b) => b.status === "inativo").length;
  const totalExames = mockBancadas.reduce((sum, b) => sum + b.exames, 0);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Laboratório</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Bancadas</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            Bancadas
          </h1>
          <p className="text-muted-foreground">Gerenciamento de bancadas e áreas de trabalho do laboratório</p>
        </div>
        <Button onClick={() => navigate("/cadastro/bancadas/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Bancada
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Bancadas"
          value={mockBancadas.length}
          icon={LayoutGrid}
          variant="primary"
        />
        <StatCard
          title="Total de Exames"
          value={totalExames}
          variant="primary"
        />
        <StatCard
          title="Bancadas Ativas"
          value={totalAtivas}
          variant="success"
        />
        <StatCard
          title="Bancadas Inativas"
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
            <Select value={setorFilter} onValueChange={setSetorFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Setores</SelectItem>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
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
                <TableHead>Setor</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead className="text-center">Exames</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBancadas.map((banc) => (
                <TableRow key={banc.id}>
                  <TableCell className="font-mono font-medium">{banc.codigo}</TableCell>
                  <TableCell className="font-medium">{banc.nome}</TableCell>
                  <TableCell>{banc.setor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{banc.equipamento}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{banc.exames}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={banc.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/bancadas/${banc.id}`)}
                      onEdit={() => navigate(`/cadastro/bancadas/${banc.id}/editar`)}
                      onToggleStatus={() => handleToggleStatus(banc.id, banc.status)}
                      isActive={banc.status === "ativo"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredBancadas.length} de {mockBancadas.length} registros
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

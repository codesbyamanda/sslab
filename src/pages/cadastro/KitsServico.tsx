import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, PackageOpen, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockKits = [
  { id: 1, codigo: "CHK-01", nome: "Check-up Básico", exames: 8, preco: 180.00, prazo: "24h", status: "ativo" },
  { id: 2, codigo: "CHK-02", nome: "Check-up Completo", exames: 18, preco: 450.00, prazo: "48h", status: "ativo" },
  { id: 3, codigo: "CHK-03", nome: "Check-up Executivo", exames: 25, preco: 680.00, prazo: "72h", status: "ativo" },
  { id: 4, codigo: "PFT", nome: "Perfil Tireoidiano", exames: 4, preco: 120.00, prazo: "48h", status: "ativo" },
  { id: 5, codigo: "PLI", nome: "Perfil Lipídico", exames: 4, preco: 65.00, prazo: "24h", status: "ativo" },
  { id: 6, codigo: "PFH", nome: "Perfil Hepático", exames: 6, preco: 95.00, prazo: "24h", status: "ativo" },
  { id: 7, codigo: "PRN", nome: "Perfil Renal", exames: 5, preco: 75.00, prazo: "24h", status: "ativo" },
  { id: 8, codigo: "PAN", nome: "Perfil Anemia", exames: 6, preco: 110.00, prazo: "48h", status: "ativo" },
  { id: 9, codigo: "PDM", nome: "Perfil Diabetes", exames: 4, preco: 85.00, prazo: "24h", status: "ativo" },
  { id: 10, codigo: "PPN", nome: "Pré-Natal", exames: 12, preco: 320.00, prazo: "72h", status: "inativo" },
];

export default function KitsServico() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredKits = mockKits.filter((kit) => {
    const matchSearch =
      kit.codigo.toLowerCase().includes(search.toLowerCase()) ||
      kit.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || kit.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Kit ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O kit foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Saúde Cadastro</span>
        <span>/</span>
        <span>Laboratório</span>
        <span>/</span>
        <span className="text-foreground font-medium">Kits de Serviço</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kits de Serviço</h1>
          <p className="text-muted-foreground">Pacotes de exames agrupados (check-ups, perfis)</p>
        </div>
        <Button onClick={() => navigate("/cadastro/kits-servico/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Kit
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Kits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockKits.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Exames</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockKits.reduce((sum, k) => sum + k.exames, 0)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockKits.filter((k) => k.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockKits.filter((k) => k.status === "inativo").length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
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

      {/* Tabela */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Qtd. Exames</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKits.map((kit) => (
                <TableRow key={kit.id}>
                  <TableCell className="font-mono font-medium">{kit.codigo}</TableCell>
                  <TableCell className="font-medium">{kit.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{kit.exames} exames</Badge>
                  </TableCell>
                  <TableCell>{kit.prazo}</TableCell>
                  <TableCell className="font-medium">R$ {kit.preco.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={kit.status === "ativo" ? "default" : "secondary"}>
                      {kit.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/kits-servico/${kit.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/kits-servico/${kit.id}/editar`)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(kit.id, kit.status)}
                        title={kit.status === "ativo" ? "Inativar" : "Ativar"}
                      >
                        {kit.status === "ativo" ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-{filteredKits.length} de {mockKits.length} registros
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

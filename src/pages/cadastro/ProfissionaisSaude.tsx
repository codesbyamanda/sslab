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
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight, UserCog, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockProfissionais = [
  { id: 1, nome: "Dr. Carlos Silva", conselho: "CRM", registro: "123456", uf: "SP", especialidade: "Cardiologia", status: "ativo" },
  { id: 2, nome: "Dra. Ana Santos", conselho: "CRM", registro: "234567", uf: "SP", especialidade: "Clínica Médica", status: "ativo" },
  { id: 3, nome: "Dr. Pedro Oliveira", conselho: "CRM", registro: "345678", uf: "RJ", especialidade: "Neurologia", status: "ativo" },
  { id: 4, nome: "Enf. Maria Costa", conselho: "COREN", registro: "456789", uf: "SP", especialidade: "Enfermagem", status: "ativo" },
  { id: 5, nome: "Dr. João Ferreira", conselho: "CRM", registro: "567890", uf: "MG", especialidade: "Ortopedia", status: "ativo" },
  { id: 6, nome: "Dra. Lucia Almeida", conselho: "CRM", registro: "678901", uf: "SP", especialidade: "Pediatria", status: "ativo" },
  { id: 7, nome: "Bio. Roberto Lima", conselho: "CRBM", registro: "789012", uf: "SP", especialidade: "Análises Clínicas", status: "ativo" },
  { id: 8, nome: "Dra. Patricia Gomes", conselho: "CRM", registro: "890123", uf: "RS", especialidade: "Dermatologia", status: "inativo" },
  { id: 9, nome: "Farm. Carlos Dias", conselho: "CRF", registro: "901234", uf: "SP", especialidade: "Farmácia Hospitalar", status: "ativo" },
  { id: 10, nome: "Dr. Ricardo Mendes", conselho: "CRM", registro: "012345", uf: "PR", especialidade: "Gastroenterologia", status: "ativo" },
];

export default function ProfissionaisSaude() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [conselhoFilter, setConselhoFilter] = useState("todos");

  const conselhos = [...new Set(mockProfissionais.map((p) => p.conselho))];

  const filteredProfissionais = mockProfissionais.filter((prof) => {
    const matchSearch =
      prof.nome.toLowerCase().includes(search.toLowerCase()) ||
      prof.registro.includes(search) ||
      prof.especialidade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || prof.status === statusFilter;
    const matchConselho = conselhoFilter === "todos" || prof.conselho === conselhoFilter;
    return matchSearch && matchStatus && matchConselho;
  });

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    toast({
      title: `Profissional ${newStatus === "ativo" ? "ativado" : "inativado"}`,
      description: `O profissional foi ${newStatus === "ativo" ? "ativado" : "inativado"} com sucesso.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Saúde Cadastro</span>
        <span>/</span>
        <span>Médico</span>
        <span>/</span>
        <span className="text-foreground font-medium">Profissionais de Saúde</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profissionais de Saúde</h1>
          <p className="text-muted-foreground">Gerenciamento de médicos e profissionais da saúde</p>
        </div>
        <Button onClick={() => navigate("/cadastro/profissionais-saude/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Profissional
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{mockProfissionais.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {mockProfissionais.filter((p) => p.conselho === "CRM").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">
              {mockProfissionais.filter((p) => p.status === "ativo").length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-muted-foreground">
              {mockProfissionais.filter((p) => p.status === "inativo").length}
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
                  placeholder="Buscar por nome, registro ou especialidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={conselhoFilter} onValueChange={setConselhoFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Conselho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Conselhos</SelectItem>
                {conselhos.map((conselho) => (
                  <SelectItem key={conselho} value={conselho}>
                    {conselho}
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

      {/* Tabela */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Conselho</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfissionais.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell className="font-medium">{prof.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{prof.conselho}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{prof.registro}</TableCell>
                  <TableCell>{prof.uf}</TableCell>
                  <TableCell>{prof.especialidade}</TableCell>
                  <TableCell>
                    <Badge variant={prof.status === "ativo" ? "default" : "secondary"}>
                      {prof.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/profissionais-saude/${prof.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/profissionais-saude/${prof.id}/editar`)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(prof.id, prof.status)}
                        title={prof.status === "ativo" ? "Inativar" : "Ativar"}
                      >
                        {prof.status === "ativo" ? (
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
              Mostrando 1-{filteredProfissionais.length} de {mockProfissionais.length} registros
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Pencil, UserX, Trash2, X, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";

// Mock data
const mockProfissionais = [
  {
    id: 1,
    nome: "Dr. Carlos Alberto Mendes",
    crm: "CRM/SP 123456",
    especialidade: "Cardiologia",
    telefone: "(11) 99999-1234",
    email: "carlos.mendes@email.com",
    situacao: "Ativo"
  },
  {
    id: 2,
    nome: "Dra. Maria Fernanda Costa",
    crm: "CRM/SP 234567",
    especialidade: "Endocrinologia",
    telefone: "(11) 98888-5678",
    email: "maria.costa@email.com",
    situacao: "Ativo"
  },
  {
    id: 3,
    nome: "Dr. João Pedro Santos",
    crm: "CRM/SP 345678",
    especialidade: "Clínico Geral",
    telefone: "(11) 97777-9012",
    email: "joao.santos@email.com",
    situacao: "Ativo"
  },
  {
    id: 4,
    nome: "Dra. Ana Carolina Lima",
    crm: "CRM/SP 456789",
    especialidade: "Ginecologia",
    telefone: "(11) 96666-3456",
    email: "ana.lima@email.com",
    situacao: "Inativo"
  },
  {
    id: 5,
    nome: "Dr. Ricardo Oliveira",
    crm: "CRM/SP 567890",
    especialidade: "Ortopedia",
    telefone: "(11) 95555-7890",
    email: "ricardo.oliveira@email.com",
    situacao: "Ativo"
  },
  {
    id: 6,
    nome: "Dra. Patrícia Souza",
    crm: "CRM/SP 678901",
    especialidade: "Dermatologia",
    telefone: "(11) 94444-1234",
    email: "patricia.souza@email.com",
    situacao: "Ativo"
  },
];

const Profissionais = () => {
  const navigate = useNavigate();
  const [searchNome, setSearchNome] = useState("");
  const [searchCRM, setSearchCRM] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [situacao, setSituacao] = useState("");
  const [profissionais, setProfissionais] = useState(mockProfissionais);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<typeof mockProfissionais[0] | null>(null);

  const handleFilter = () => {
    let filtered = [...mockProfissionais];
    
    if (searchNome) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchNome.toLowerCase())
      );
    }
    
    if (searchCRM) {
      filtered = filtered.filter(p => 
        p.crm.toLowerCase().includes(searchCRM.toLowerCase())
      );
    }
    
    if (especialidade && especialidade !== "all") {
      filtered = filtered.filter(p => p.especialidade === especialidade);
    }
    
    if (situacao && situacao !== "all") {
      filtered = filtered.filter(p => p.situacao === situacao);
    }
    
    setProfissionais(filtered);
    toast({
      title: "Filtros aplicados",
      description: `${filtered.length} profissional(is) encontrado(s).`
    });
  };

  const handleClearFilters = () => {
    setSearchNome("");
    setSearchCRM("");
    setEspecialidade("");
    setSituacao("");
    setProfissionais(mockProfissionais);
  };

  const handleDelete = (profissional: typeof mockProfissionais[0]) => {
    setSelectedProfissional(profissional);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProfissional) {
      setProfissionais(profissionais.filter(p => p.id !== selectedProfissional.id));
      toast({
        title: "Profissional excluído",
        description: `${selectedProfissional.nome} foi excluído com sucesso.`
      });
    }
    setDeleteDialogOpen(false);
    setSelectedProfissional(null);
  };

  const handleToggleStatus = (profissional: typeof mockProfissionais[0]) => {
    setSelectedProfissional(profissional);
    setToggleDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (selectedProfissional) {
      const updated = profissionais.map(p => {
        if (p.id === selectedProfissional.id) {
          return {
            ...p,
            situacao: p.situacao === "Ativo" ? "Inativo" : "Ativo"
          };
        }
        return p;
      });
      setProfissionais(updated);
      
      const newStatus = selectedProfissional.situacao === "Ativo" ? "inativado" : "ativado";
      toast({
        title: `Profissional ${newStatus}`,
        description: `${selectedProfissional.nome} foi ${newStatus} com sucesso.`
      });
    }
    setToggleDialogOpen(false);
    setSelectedProfissional(null);
  };

  const especialidades = [...new Set(mockProfissionais.map(p => p.especialidade))];

  return (
    <div className="min-h-screen flex bg-background">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Profissionais da Saúde</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie os médicos solicitantes utilizados nos atendimentos.
                </p>
              </div>
              <Button onClick={() => navigate("/atendimento/profissionais/novo")} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Profissional
              </Button>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Nome
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome..."
                        value={searchNome}
                        onChange={(e) => setSearchNome(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      CRM / Registro
                    </label>
                    <Input
                      placeholder="Buscar por CRM..."
                      value={searchCRM}
                      onChange={(e) => setSearchCRM(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Especialidade
                    </label>
                    <Select value={especialidade} onValueChange={setEspecialidade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {especialidades.map(esp => (
                          <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Situação
                    </label>
                    <Select value={situacao} onValueChange={setSituacao}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <Button onClick={handleFilter} className="gap-2">
                    <Search className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabela */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Lista de Profissionais</CardTitle>
                <CardDescription>
                  {profissionais.length} profissional(is) cadastrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Nome</TableHead>
                        <TableHead className="font-semibold">CRM / Registro</TableHead>
                        <TableHead className="font-semibold">Especialidade</TableHead>
                        <TableHead className="font-semibold">Telefone</TableHead>
                        <TableHead className="font-semibold">E-mail</TableHead>
                        <TableHead className="font-semibold text-center">Situação</TableHead>
                        <TableHead className="font-semibold text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profissionais.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Nenhum profissional encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        profissionais.map((profissional) => (
                          <TableRow key={profissional.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{profissional.nome}</TableCell>
                            <TableCell>{profissional.crm}</TableCell>
                            <TableCell>{profissional.especialidade}</TableCell>
                            <TableCell>{profissional.telefone}</TableCell>
                            <TableCell className="text-muted-foreground">{profissional.email}</TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={profissional.situacao === "Ativo" ? "default" : "secondary"}
                                className={cn(
                                  profissional.situacao === "Ativo" 
                                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                                    : "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
                                )}
                              >
                                {profissional.situacao}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/atendimento/profissionais/${profissional.id}`)}
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleToggleStatus(profissional)}
                                  title={profissional.situacao === "Ativo" ? "Inativar" : "Ativar"}
                                >
                                  {profissional.situacao === "Ativo" ? (
                                    <UserX className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <UserCheck className="h-4 w-4 text-emerald-600" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(profissional)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir <strong>{selectedProfissional?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedProfissional?.situacao === "Ativo" ? "Inativar" : "Ativar"} profissional
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja {selectedProfissional?.situacao === "Ativo" ? "inativar" : "ativar"} o profissional{" "}
              <strong>{selectedProfissional?.nome}</strong>?
              {selectedProfissional?.situacao === "Ativo" && (
                <span className="block mt-2 text-amber-600">
                  Profissionais inativos não aparecem nas listas de seleção.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profissionais;

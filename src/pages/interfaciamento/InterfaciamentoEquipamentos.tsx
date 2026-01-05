import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Filter, Eye, Power, PowerOff, Monitor, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";
const equipamentos = [{
  id: 1,
  codigo: "EQ-001",
  nome: "Analisador Hematológico XN-1000",
  fabricante: "Sysmex",
  modelo: "XN-1000",
  setor: "Hematologia",
  protocolo: "ASTM",
  status: "ativo",
  ultimaComunicacao: "02/01/2026 14:32"
}, {
  id: 2,
  codigo: "EQ-002",
  nome: "Analisador Bioquímico AU-680",
  fabricante: "Beckman Coulter",
  modelo: "AU-680",
  setor: "Bioquímica",
  protocolo: "HL7",
  status: "ativo",
  ultimaComunicacao: "02/01/2026 14:30"
}, {
  id: 3,
  codigo: "EQ-003",
  nome: "Coagulômetro CS-2500",
  fabricante: "Sysmex",
  modelo: "CS-2500",
  setor: "Coagulação",
  protocolo: "ASTM",
  status: "offline",
  ultimaComunicacao: "02/01/2026 12:15"
}, {
  id: 4,
  codigo: "EQ-004",
  nome: "Analisador de Urina UF-5000",
  fabricante: "Sysmex",
  modelo: "UF-5000",
  setor: "Urinálise",
  protocolo: "Serial",
  status: "inativo",
  ultimaComunicacao: "01/01/2026 18:00"
}];
export default function InterfaciamentoEquipamentos() {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<typeof equipamentos[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>;
      case "inativo":
        return <Badge variant="secondary">Inativo</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const handleToggleStatus = (equipamento: typeof equipamentos[0]) => {
    setEquipamentoSelecionado(equipamento);
    setDialogOpen(true);
  };
  const confirmarToggle = () => {
    if (equipamentoSelecionado) {
      const novoStatus = equipamentoSelecionado.status === "ativo" ? "inativo" : "ativo";
      toast.success(`Equipamento ${novoStatus === "ativo" ? "ativado" : "inativado"} com sucesso`);
    }
    setDialogOpen(false);
    setEquipamentoSelecionado(null);
  };
  const equipamentosFiltrados = equipamentos.filter(eq => {
    const matchNome = eq.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchStatus = filtroStatus === "todos" || eq.status === filtroStatus;
    return matchNome && matchStatus;
  });
  return <div className="space-y-6">
      {/* Breadcrumb */}
      

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os equipamentos de automação laboratorial
          </p>
        </div>
        <Link to="/interfaciamento/equipamentos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Equipamento
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome do equipamento..." value={filtroNome} onChange={e => setFiltroNome(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
            setFiltroNome("");
            setFiltroStatus("todos");
          }}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome do Equipamento</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Protocolo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Comunicação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipamentosFiltrados.length === 0 ? <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <Monitor className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Nenhum equipamento encontrado</p>
                  </TableCell>
                </TableRow> : equipamentosFiltrados.map(equipamento => <TableRow key={equipamento.id}>
                    <TableCell className="font-medium">{equipamento.codigo}</TableCell>
                    <TableCell>{equipamento.nome}</TableCell>
                    <TableCell>{equipamento.fabricante}</TableCell>
                    <TableCell>{equipamento.modelo}</TableCell>
                    <TableCell>{equipamento.setor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{equipamento.protocolo}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(equipamento.status)}</TableCell>
                    <TableCell>{equipamento.ultimaComunicacao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/interfaciamento/equipamentos/${equipamento.id}`}>
                          <Button variant="ghost" size="icon" title="Visualizar/Editar">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title={equipamento.status === "ativo" ? "Inativar" : "Ativar"} onClick={() => handleToggleStatus(equipamento)}>
                          {equipamento.status === "ativo" ? <PowerOff className="w-4 h-4 text-red-600" /> : <Power className="w-4 h-4 text-green-600" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {equipamentoSelecionado?.status === "ativo" ? "Inativar" : "Ativar"} Equipamento
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente {equipamentoSelecionado?.status === "ativo" ? "inativar" : "ativar"} o equipamento "{equipamentoSelecionado?.nome}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarToggle}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}
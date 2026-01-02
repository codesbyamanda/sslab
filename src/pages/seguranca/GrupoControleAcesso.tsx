import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SegurancaLayout } from "@/components/seguranca/SegurancaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Search, Eye, Trash2, Users, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Mock data
const mockPerfis = [
  { id: 1, codigo: "ADM", descricao: "Administrador", emUso: true, usuariosVinculados: 5 },
  { id: 2, codigo: "MED", descricao: "Médico", emUso: true, usuariosVinculados: 12 },
  { id: 3, codigo: "ENF", descricao: "Enfermeiro", emUso: true, usuariosVinculados: 8 },
  { id: 4, codigo: "REC", descricao: "Recepcionista", emUso: true, usuariosVinculados: 3 },
  { id: 5, codigo: "FAT", descricao: "Faturamento", emUso: false, usuariosVinculados: 0 },
  { id: 6, codigo: "FIN", descricao: "Financeiro", emUso: true, usuariosVinculados: 2 },
  { id: 7, codigo: "LAB", descricao: "Laboratório", emUso: true, usuariosVinculados: 4 },
  { id: 8, codigo: "AUD", descricao: "Auditor", emUso: false, usuariosVinculados: 0 },
];

export default function GrupoControleAcesso() {
  const navigate = useNavigate();
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [perfis, setPerfis] = useState(mockPerfis);
  const [perfilExcluir, setPerfilExcluir] = useState<typeof mockPerfis[0] | null>(null);
  const [showAlertEmUso, setShowAlertEmUso] = useState(false);

  const perfisFiltrados = perfis.filter((p) =>
    p.descricao.toLowerCase().includes(filtroDescricao.toLowerCase())
  );

  const handleLimparFiltros = () => {
    setFiltroDescricao("");
  };

  const handleExcluir = (perfil: typeof mockPerfis[0]) => {
    if (perfil.emUso) {
      setShowAlertEmUso(true);
    } else {
      setPerfilExcluir(perfil);
    }
  };

  const confirmarExclusao = () => {
    if (perfilExcluir) {
      setPerfis(perfis.filter((p) => p.id !== perfilExcluir.id));
      toast.success(`Perfil "${perfilExcluir.descricao}" excluído com sucesso.`);
      setPerfilExcluir(null);
    }
  };

  return (
    <SegurancaLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Grupo de Controle de Acesso</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os perfis e permissões de acesso do sistema.
            </p>
          </div>
          <Button onClick={() => navigate("/seguranca/perfil/novo")} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Perfil
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Perfis</p>
                  <p className="text-2xl font-bold">{perfis.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perfis em Uso</p>
                  <p className="text-2xl font-bold">{perfis.filter((p) => p.emUso).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários Vinculados</p>
                  <p className="text-2xl font-bold">
                    {perfis.reduce((acc, p) => acc + p.usuariosVinculados, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[250px]">
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Descrição do Perfil
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={filtroDescricao}
                    onChange={(e) => setFiltroDescricao(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleLimparFiltros}>
                  Limpar
                </Button>
                <Button>Filtrar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perfis de Acesso</CardTitle>
            <CardDescription>
              {perfisFiltrados.length} perfil(is) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {perfisFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Nenhum perfil encontrado
                </h3>
                <p className="text-muted-foreground">
                  Não há perfis que correspondam aos filtros aplicados.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Descrição do Perfil</TableHead>
                      <TableHead className="text-center w-[150px]">Usuários</TableHead>
                      <TableHead className="text-center w-[120px]">Status</TableHead>
                      <TableHead className="text-right w-[120px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfisFiltrados.map((perfil) => (
                      <TableRow key={perfil.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-medium">
                          {perfil.codigo}
                        </TableCell>
                        <TableCell className="font-medium">{perfil.descricao}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-sm">
                            <Users className="w-3.5 h-3.5" />
                            {perfil.usuariosVinculados}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {perfil.emUso ? (
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              Em uso
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                              Inativo
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/seguranca/perfil/${perfil.id}`)}
                              title="Visualizar / Editar"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExcluir(perfil)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!perfilExcluir} onOpenChange={() => setPerfilExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o perfil "{perfilExcluir?.descricao}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert de perfil em uso */}
      <AlertDialog open={showAlertEmUso} onOpenChange={setShowAlertEmUso}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <AlertDialogTitle>Não é possível excluir</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Este perfil está em uso por usuários ativos do sistema. 
              Para excluí-lo, primeiro remova todos os usuários vinculados a este perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SegurancaLayout>
  );
}

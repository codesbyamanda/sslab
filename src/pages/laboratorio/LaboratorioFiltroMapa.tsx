import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Pencil, Trash2, Eye, Filter } from "lucide-react";
import { toast } from "sonner";

interface FiltroMapa {
  id: string;
  nome: string;
  qtdCombinacoes: number;
  ultimaAtualizacao: string;
}

const mockFiltros: FiltroMapa[] = [
  { id: "1", nome: "Bioquímica Geral", qtdCombinacoes: 5, ultimaAtualizacao: "15/12/2024" },
  { id: "2", nome: "Hematologia", qtdCombinacoes: 3, ultimaAtualizacao: "14/12/2024" },
  { id: "3", nome: "Microbiologia", qtdCombinacoes: 4, ultimaAtualizacao: "13/12/2024" },
  { id: "4", nome: "Urinálise", qtdCombinacoes: 2, ultimaAtualizacao: "12/12/2024" },
  { id: "5", nome: "Hormônios", qtdCombinacoes: 6, ultimaAtualizacao: "10/12/2024" },
];

const LaboratorioFiltroMapa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros] = useState<FiltroMapa[]>(mockFiltros);

  const filteredFiltros = filtros.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    toast.success("Filtro excluído com sucesso!");
  };

  return (
    <LaboratorioLayout title="Filtro do Mapa">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Filtro do Mapa</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie filtros padrões para emissão de mapas de trabalho.
            </p>
          </div>
          <Button onClick={() => navigate("/laboratorio/filtro-mapa/novo")} className="btn-primary-premium">
            <Plus className="h-4 w-4 mr-2" />
            Novo Filtro
          </Button>
        </div>

        {/* Filtros de Pesquisa */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-md">
                <Label htmlFor="search" className="text-sm font-medium">
                  Nome do Filtro
                </Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Filtros Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Filtro</TableHead>
                  <TableHead className="text-center">Qtde Combinações</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiltros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum filtro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFiltros.map((filtro) => (
                    <TableRow key={filtro.id}>
                      <TableCell className="font-medium">{filtro.nome}</TableCell>
                      <TableCell className="text-center">
                        <span className="badge-neutral">{filtro.qtdCombinacoes} setor/bancada</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{filtro.ultimaAtualizacao}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/laboratorio/filtro-mapa/${filtro.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/laboratorio/filtro-mapa/${filtro.id}/editar`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Filtro</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o filtro "{filtro.nome}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(filtro.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioFiltroMapa;

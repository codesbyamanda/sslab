import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BancadaItem {
  id: string;
  unidade: string;
  setor: string;
  bancada: string;
}

const mockUnidades = ["Unidade Central", "Unidade Norte", "Unidade Sul"];
const mockSetores = ["Bioquímica", "Hematologia", "Microbiologia", "Urinálise"];
const mockBancadas = ["Bancada 01", "Bancada 02", "Bancada 03", "Bancada 04"];

const LaboratorioFiltroMapaCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [nome, setNome] = useState(isEditing ? "Bioquímica Geral" : "");
  const [descricao, setDescricao] = useState("");
  const [bancadas, setBancadas] = useState<BancadaItem[]>(
    isEditing
      ? [
          { id: "1", unidade: "Unidade Central", setor: "Bioquímica", bancada: "Bancada 01" },
          { id: "2", unidade: "Unidade Central", setor: "Bioquímica", bancada: "Bancada 02" },
        ]
      : []
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newUnidade, setNewUnidade] = useState("");
  const [newSetor, setNewSetor] = useState("");
  const [newBancada, setNewBancada] = useState("");

  const handleAddBancada = () => {
    if (!newUnidade || !newSetor || !newBancada) {
      toast.error("Preencha todos os campos");
      return;
    }

    setBancadas([
      ...bancadas,
      {
        id: Date.now().toString(),
        unidade: newUnidade,
        setor: newSetor,
        bancada: newBancada,
      },
    ]);

    setNewUnidade("");
    setNewSetor("");
    setNewBancada("");
    setDrawerOpen(false);
    toast.success("Bancada adicionada");
  };

  const handleRemoveBancada = (id: string) => {
    setBancadas(bancadas.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    if (!nome) {
      toast.error("Nome do filtro é obrigatório");
      return;
    }
    toast.success(isEditing ? "Filtro atualizado com sucesso!" : "Filtro criado com sucesso!");
    navigate("/laboratorio/filtro-mapa");
  };

  return (
    <LaboratorioLayout title={isEditing ? "Editar Filtro" : "Novo Filtro"}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/laboratorio/filtro-mapa")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Editar Filtro do Mapa" : "Novo Filtro do Mapa"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Modifique as configurações do filtro" : "Configure um novo filtro para geração de mapas"}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Informações do Filtro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Filtro *</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Bioquímica Geral"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição opcional do filtro"
                  className="mt-1.5 resize-none"
                  rows={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bancadas */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Conteúdo do Filtro (Setor / Bancada)</CardTitle>
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Incluir Bancada
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Adicionar Bancada</SheetTitle>
                    <SheetDescription>
                      Selecione a unidade, setor e bancada para incluir no filtro.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label>Unidade</Label>
                      <Select value={newUnidade} onValueChange={setNewUnidade}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUnidades.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Setor</Label>
                      <Select value={newSetor} onValueChange={setNewSetor}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSetores.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Bancada</Label>
                      <Select value={newBancada} onValueChange={setNewBancada}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Selecione a bancada" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBancadas.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>
                        Cancelar
                      </Button>
                      <Button className="flex-1" onClick={handleAddBancada}>
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Bancada</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bancadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhuma bancada adicionada. Clique em "Incluir Bancada" para começar.
                    </TableCell>
                  </TableRow>
                ) : (
                  bancadas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell>{item.setor}</TableCell>
                      <TableCell>{item.bancada}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveBancada(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/laboratorio/filtro-mapa")}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="btn-primary-premium">
            Salvar
          </Button>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioFiltroMapaCadastro;

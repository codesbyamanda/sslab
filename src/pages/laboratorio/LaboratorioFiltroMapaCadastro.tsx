import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowLeft, Plus, Trash2, FlaskConical, Building2 } from "lucide-react";
import { toast } from "sonner";

interface BancadaItem {
  id: string;
  empresa: string;
  unidade: string;
  setor: string;
  bancada: string;
}

interface UnidadeAtendimentoItem {
  id: string;
  empresa: string;
  unidadeAtendimento: string;
}

// Mock data com hierarquia
const mockEmpresas = ["Laboratório Central S.A.", "Lab Norte Ltda.", "Diagnósticos Sul"];

const mockUnidadesPorEmpresa: Record<string, string[]> = {
  "Laboratório Central S.A.": ["Unidade Central", "Unidade Matriz"],
  "Lab Norte Ltda.": ["Unidade Norte", "Unidade Nordeste"],
  "Diagnósticos Sul": ["Unidade Sul", "Unidade Sudeste"],
};

const mockSetoresPorUnidade: Record<string, string[]> = {
  "Unidade Central": ["Bioquímica", "Hematologia"],
  "Unidade Matriz": ["Microbiologia", "Urinálise"],
  "Unidade Norte": ["Bioquímica", "Parasitologia"],
  "Unidade Nordeste": ["Hematologia", "Imunologia"],
  "Unidade Sul": ["Bioquímica", "Hematologia", "Microbiologia"],
  "Unidade Sudeste": ["Urinálise", "Parasitologia"],
};

const mockBancadasPorSetor: Record<string, string[]> = {
  "Bioquímica": ["Bancada BQ-01", "Bancada BQ-02", "Bancada BQ-03"],
  "Hematologia": ["Bancada HM-01", "Bancada HM-02"],
  "Microbiologia": ["Bancada MB-01", "Bancada MB-02"],
  "Urinálise": ["Bancada UR-01"],
  "Parasitologia": ["Bancada PR-01", "Bancada PR-02"],
  "Imunologia": ["Bancada IM-01"],
};

const mockUnidadesAtendimentoPorEmpresa: Record<string, string[]> = {
  "Laboratório Central S.A.": ["Posto Centro", "Posto Shopping", "Coleta Domiciliar"],
  "Lab Norte Ltda.": ["Posto Norte I", "Posto Norte II"],
  "Diagnósticos Sul": ["Posto Sul", "Posto Litoral", "Coleta Empresas"],
};

const LaboratorioFiltroMapaCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [nome, setNome] = useState(isEditing ? "Bioquímica Geral" : "");
  const [descricao, setDescricao] = useState("");
  const [activeTab, setActiveTab] = useState("bancadas");

  // Bancadas state
  const [bancadas, setBancadas] = useState<BancadaItem[]>(
    isEditing
      ? [
          { id: "1", empresa: "Laboratório Central S.A.", unidade: "Unidade Central", setor: "Bioquímica", bancada: "Bancada BQ-01" },
          { id: "2", empresa: "Laboratório Central S.A.", unidade: "Unidade Central", setor: "Bioquímica", bancada: "Bancada BQ-02" },
        ]
      : []
  );

  // Unidades de Atendimento state
  const [unidadesAtendimento, setUnidadesAtendimento] = useState<UnidadeAtendimentoItem[]>(
    isEditing
      ? [
          { id: "1", empresa: "Laboratório Central S.A.", unidadeAtendimento: "Posto Centro" },
        ]
      : []
  );

  // Bancada drawer state
  const [bancadaDrawerOpen, setBancadaDrawerOpen] = useState(false);
  const [newEmpresaBancada, setNewEmpresaBancada] = useState("");
  const [newUnidade, setNewUnidade] = useState("");
  const [newSetor, setNewSetor] = useState("");
  const [newBancada, setNewBancada] = useState("");

  // Unidade de Atendimento drawer state
  const [unidadeDrawerOpen, setUnidadeDrawerOpen] = useState(false);
  const [newEmpresaUnidade, setNewEmpresaUnidade] = useState("");
  const [newUnidadeAtendimento, setNewUnidadeAtendimento] = useState("");

  // Computed values for cascading selects - Bancada
  const unidadesDisponiveis = newEmpresaBancada ? mockUnidadesPorEmpresa[newEmpresaBancada] || [] : [];
  const setoresDisponiveis = newUnidade ? mockSetoresPorUnidade[newUnidade] || [] : [];
  const bancadasDisponiveis = newSetor ? mockBancadasPorSetor[newSetor] || [] : [];

  // Computed values for cascading selects - Unidade Atendimento
  const unidadesAtendimentoDisponiveis = newEmpresaUnidade ? mockUnidadesAtendimentoPorEmpresa[newEmpresaUnidade] || [] : [];

  // Reset dependent fields when parent changes - Bancada
  const handleEmpresaBancadaChange = (value: string) => {
    setNewEmpresaBancada(value);
    setNewUnidade("");
    setNewSetor("");
    setNewBancada("");
  };

  const handleUnidadeChange = (value: string) => {
    setNewUnidade(value);
    setNewSetor("");
    setNewBancada("");
  };

  const handleSetorChange = (value: string) => {
    setNewSetor(value);
    setNewBancada("");
  };

  // Reset dependent fields when parent changes - Unidade Atendimento
  const handleEmpresaUnidadeChange = (value: string) => {
    setNewEmpresaUnidade(value);
    setNewUnidadeAtendimento("");
  };

  const handleAddBancada = () => {
    if (!newEmpresaBancada || !newUnidade || !newSetor || !newBancada) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Check for duplicates
    const exists = bancadas.some(
      (b) => b.empresa === newEmpresaBancada && b.unidade === newUnidade && b.setor === newSetor && b.bancada === newBancada
    );
    if (exists) {
      toast.error("Esta bancada já foi adicionada ao filtro");
      return;
    }

    setBancadas([
      ...bancadas,
      {
        id: Date.now().toString(),
        empresa: newEmpresaBancada,
        unidade: newUnidade,
        setor: newSetor,
        bancada: newBancada,
      },
    ]);

    setNewEmpresaBancada("");
    setNewUnidade("");
    setNewSetor("");
    setNewBancada("");
    setBancadaDrawerOpen(false);
    toast.success("Bancada adicionada ao filtro");
  };

  const handleAddUnidadeAtendimento = () => {
    if (!newEmpresaUnidade || !newUnidadeAtendimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Check for duplicates
    const exists = unidadesAtendimento.some(
      (u) => u.empresa === newEmpresaUnidade && u.unidadeAtendimento === newUnidadeAtendimento
    );
    if (exists) {
      toast.error("Esta unidade de atendimento já foi adicionada ao filtro");
      return;
    }

    setUnidadesAtendimento([
      ...unidadesAtendimento,
      {
        id: Date.now().toString(),
        empresa: newEmpresaUnidade,
        unidadeAtendimento: newUnidadeAtendimento,
      },
    ]);

    setNewEmpresaUnidade("");
    setNewUnidadeAtendimento("");
    setUnidadeDrawerOpen(false);
    toast.success("Unidade de Atendimento adicionada ao filtro");
  };

  const handleRemoveBancada = (id: string) => {
    setBancadas(bancadas.filter((b) => b.id !== id));
    toast.success("Bancada removida do filtro");
  };

  const handleRemoveUnidadeAtendimento = (id: string) => {
    setUnidadesAtendimento(unidadesAtendimento.filter((u) => u.id !== id));
    toast.success("Unidade de Atendimento removida do filtro");
  };

  const handleSave = () => {
    if (!nome) {
      toast.error("Nome do filtro é obrigatório");
      return;
    }

    if (bancadas.length === 0 && unidadesAtendimento.length === 0) {
      toast.error("Adicione pelo menos uma bancada ou uma unidade de atendimento ao filtro");
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

        {/* Tabs Content */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Conteúdo do Filtro</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 border-b">
                <TabsList className="h-12 bg-transparent p-0 gap-6">
                  <TabsTrigger
                    value="bancadas"
                    className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Bancadas (Processamento)
                    {bancadas.length > 0 && (
                      <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                        {bancadas.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="unidades"
                    className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Unidades de Atendimento
                    {unidadesAtendimento.length > 0 && (
                      <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                        {unidadesAtendimento.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Bancadas */}
              <TabsContent value="bancadas" className="m-0">
                <div className="p-4 border-b flex justify-end">
                  <Sheet open={bancadaDrawerOpen} onOpenChange={setBancadaDrawerOpen}>
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
                          Selecione a empresa, unidade, setor e bancada para incluir no filtro.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        {/* Empresa */}
                        <div>
                          <Label>Empresa *</Label>
                          <Select value={newEmpresaBancada} onValueChange={handleEmpresaBancadaChange}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockEmpresas.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Unidade */}
                        <div>
                          <Label>Unidade *</Label>
                          <Select
                            value={newUnidade}
                            onValueChange={handleUnidadeChange}
                            disabled={!newEmpresaBancada}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={newEmpresaBancada ? "Selecione a unidade" : "Selecione a empresa primeiro"} />
                            </SelectTrigger>
                            <SelectContent>
                              {unidadesDisponiveis.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Setor */}
                        <div>
                          <Label>Setor *</Label>
                          <Select
                            value={newSetor}
                            onValueChange={handleSetorChange}
                            disabled={!newUnidade}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={newUnidade ? "Selecione o setor" : "Selecione a unidade primeiro"} />
                            </SelectTrigger>
                            <SelectContent>
                              {setoresDisponiveis.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Bancada */}
                        <div>
                          <Label>Bancada *</Label>
                          <Select
                            value={newBancada}
                            onValueChange={setNewBancada}
                            disabled={!newSetor}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={newSetor ? "Selecione a bancada" : "Selecione o setor primeiro"} />
                            </SelectTrigger>
                            <SelectContent>
                              {bancadasDisponiveis.map((b) => (
                                <SelectItem key={b} value={b}>
                                  {b}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setBancadaDrawerOpen(false)}>
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

                <Table className="table-premium">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead>Bancada</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bancadas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhuma bancada adicionada. Clique em "Incluir Bancada" para começar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bancadas.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.empresa}</TableCell>
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
              </TabsContent>

              {/* Tab Unidades de Atendimento */}
              <TabsContent value="unidades" className="m-0">
                <div className="p-4 border-b flex justify-end">
                  <Sheet open={unidadeDrawerOpen} onOpenChange={setUnidadeDrawerOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Incluir Unidade de Atendimento
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Adicionar Unidade de Atendimento</SheetTitle>
                        <SheetDescription>
                          Selecione a empresa e a unidade de atendimento (origem da coleta) para incluir no filtro.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        {/* Empresa */}
                        <div>
                          <Label>Empresa *</Label>
                          <Select value={newEmpresaUnidade} onValueChange={handleEmpresaUnidadeChange}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockEmpresas.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Unidade de Atendimento */}
                        <div>
                          <Label>Unidade de Atendimento *</Label>
                          <Select
                            value={newUnidadeAtendimento}
                            onValueChange={setNewUnidadeAtendimento}
                            disabled={!newEmpresaUnidade}
                          >
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder={newEmpresaUnidade ? "Selecione a unidade de atendimento" : "Selecione a empresa primeiro"} />
                            </SelectTrigger>
                            <SelectContent>
                              {unidadesAtendimentoDisponiveis.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setUnidadeDrawerOpen(false)}>
                            Cancelar
                          </Button>
                          <Button className="flex-1" onClick={handleAddUnidadeAtendimento}>
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <Table className="table-premium">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Unidade de Atendimento</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidadesAtendimento.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Nenhuma unidade de atendimento adicionada. Clique em "Incluir Unidade de Atendimento" para começar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      unidadesAtendimento.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.empresa}</TableCell>
                          <TableCell>{item.unidadeAtendimento}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveUnidadeAtendimento(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
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

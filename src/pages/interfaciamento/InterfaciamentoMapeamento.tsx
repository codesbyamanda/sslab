import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, Edit, Link2, ChevronRight, Home, FlaskConical } from "lucide-react";
import { toast } from "sonner";
const mapeamentos = [{
  id: 1,
  exameSaudeLab: "Hemograma Completo",
  codigoExame: "HMG",
  codigoEquipamento: "CBC",
  equipamento: "Analisador Hematológico XN-1000",
  unidade: "Matriz",
  status: "ativo"
}, {
  id: 2,
  exameSaudeLab: "Glicose",
  codigoExame: "GLI",
  codigoEquipamento: "GLU",
  equipamento: "Analisador Bioquímico AU-680",
  unidade: "Matriz",
  status: "ativo"
}, {
  id: 3,
  exameSaudeLab: "Tempo de Protrombina",
  codigoExame: "TAP",
  codigoEquipamento: "PT",
  equipamento: "Coagulômetro CS-2500",
  unidade: "Matriz",
  status: "ativo"
}, {
  id: 4,
  exameSaudeLab: "Urina Tipo I",
  codigoExame: "EAS",
  codigoEquipamento: "UA",
  equipamento: "Analisador de Urina UF-5000",
  unidade: "Filial Centro",
  status: "inativo"
}, {
  id: 5,
  exameSaudeLab: "TSH",
  codigoExame: "TSH",
  codigoEquipamento: "TSH01",
  equipamento: "Analisador de Imunologia Cobas e411",
  unidade: "Matriz",
  status: "ativo"
}];
export default function InterfaciamentoMapeamento() {
  const [filtroExame, setFiltroExame] = useState("");
  const [filtroEquipamento, setFiltroEquipamento] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mapeamentoSelecionado, setMapeamentoSelecionado] = useState<typeof mapeamentos[0] | null>(null);
  const [codigoEquipamentoEdit, setCodigoEquipamentoEdit] = useState("");
  const handleEditar = (mapeamento: typeof mapeamentos[0]) => {
    setMapeamentoSelecionado(mapeamento);
    setCodigoEquipamentoEdit(mapeamento.codigoEquipamento);
    setDialogOpen(true);
  };
  const handleSalvar = () => {
    toast.success("Mapeamento atualizado com sucesso");
    setDialogOpen(false);
    setMapeamentoSelecionado(null);
  };
  const mapeamentosFiltrados = mapeamentos.filter(m => {
    const matchExame = m.exameSaudeLab.toLowerCase().includes(filtroExame.toLowerCase());
    const matchEquipamento = filtroEquipamento === "todos" || m.equipamento === filtroEquipamento;
    return matchExame && matchEquipamento;
  });
  const equipamentosUnicos = [...new Set(mapeamentos.map(m => m.equipamento))];
  return <div className="space-y-6">
      {/* Breadcrumb */}
      

      <div>
        <h1 className="text-2xl font-bold text-foreground">Mapeamento de Exames</h1>
        <p className="text-muted-foreground mt-1">
          Vincule exames do SaúdeLab aos códigos dos equipamentos
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Integração com SaúdeLab</p>
              <p className="text-sm text-blue-700 mt-1">
                O mapeamento permite que resultados recebidos dos equipamentos sejam automaticamente 
                associados aos exames cadastrados no SaúdeLab, reduzindo erros de digitação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <Input placeholder="Buscar por nome do exame..." value={filtroExame} onChange={e => setFiltroExame(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={filtroEquipamento} onValueChange={setFiltroEquipamento}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Equipamentos</SelectItem>
                {equipamentosUnicos.map(eq => <SelectItem key={eq} value={eq}>{eq}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
            setFiltroExame("");
            setFiltroEquipamento("todos");
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
                <TableHead>Exame (SaúdeLab)</TableHead>
                <TableHead>Código Exame</TableHead>
                <TableHead>Código Equipamento</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mapeamentosFiltrados.length === 0 ? <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <FlaskConical className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Nenhum mapeamento encontrado</p>
                  </TableCell>
                </TableRow> : mapeamentosFiltrados.map(mapeamento => <TableRow key={mapeamento.id}>
                    <TableCell className="font-medium">{mapeamento.exameSaudeLab}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapeamento.codigoExame}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        {mapeamento.codigoEquipamento}
                      </Badge>
                    </TableCell>
                    <TableCell>{mapeamento.equipamento}</TableCell>
                    <TableCell>{mapeamento.unidade}</TableCell>
                    <TableCell>
                      <Badge className={mapeamento.status === "ativo" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700"}>
                        {mapeamento.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditar(mapeamento)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mapeamento</DialogTitle>
          </DialogHeader>
          {mapeamentoSelecionado && <div className="space-y-4 py-4">
              <div>
                <Label>Exame (SaúdeLab)</Label>
                <Input value={mapeamentoSelecionado.exameSaudeLab} disabled />
              </div>
              <div>
                <Label>Equipamento</Label>
                <Input value={mapeamentoSelecionado.equipamento} disabled />
              </div>
              <div>
                <Label htmlFor="codigoEquipamento">Código no Equipamento</Label>
                <Input id="codigoEquipamento" value={codigoEquipamentoEdit} onChange={e => setCodigoEquipamentoEdit(e.target.value)} placeholder="Código usado pelo equipamento" />
                <p className="text-xs text-muted-foreground mt-1">
                  Este código é usado para identificar o exame nas mensagens do equipamento
                </p>
              </div>
            </div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
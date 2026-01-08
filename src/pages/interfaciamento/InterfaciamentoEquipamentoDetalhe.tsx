import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, 
  Home, 
  Save, 
  ArrowLeft,
  Monitor,
  Settings,
  Network,
  Link2,
  Plus,
  Trash2,
  FlaskConical
} from "lucide-react";
import { toast } from "sonner";

// Lista de exames disponíveis para mapeamento
const examesDisponiveis = [
  { codigo: "HMG", nome: "Hemograma Completo" },
  { codigo: "GLI", nome: "Glicose" },
  { codigo: "TAP", nome: "Tempo de Protrombina" },
  { codigo: "EAS", nome: "Urina Tipo I" },
  { codigo: "TSH", nome: "TSH" },
  { codigo: "T4L", nome: "T4 Livre" },
  { codigo: "COL", nome: "Colesterol Total" },
  { codigo: "TRI", nome: "Triglicerídeos" },
  { codigo: "URE", nome: "Ureia" },
  { codigo: "CRE", nome: "Creatinina" },
  { codigo: "TGO", nome: "TGO (AST)" },
  { codigo: "TGP", nome: "TGP (ALT)" },
];

export default function InterfaciamentoEquipamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    nome: isNew ? "" : "Analisador Hematológico XN-1000",
    fabricante: isNew ? "" : "Sysmex",
    modelo: isNew ? "" : "XN-1000",
    numeroSerie: isNew ? "" : "SN-2024-001234",
    ip: isNew ? "" : "192.168.1.100",
    porta: isNew ? "" : "5000",
    canalComunicacao: isNew ? "" : "COM1",
    protocolo: isNew ? "" : "astm",
    frequenciaComunicacao: isNew ? "" : "30",
    setor: isNew ? "" : "Hematologia",
    ativo: !isNew,
    observacoes: isNew ? "" : "Equipamento instalado em dezembro/2024. Manutenção preventiva agendada para março/2026.",
  });

  // Estado para mapeamentos de exames
  const [mapeamentos, setMapeamentos] = useState(isNew ? [] : [
    { id: 1, exameNome: "Hemograma Completo", exameCodigo: "HMG", codigoEquipamento: "CBC", ativo: true },
    { id: 2, exameNome: "Glicose", exameCodigo: "GLI", codigoEquipamento: "GLU", ativo: true },
  ]);

  // Estado para dialog de novo mapeamento
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoMapeamento, setNovoMapeamento] = useState({
    exameCodigo: "",
    codigoEquipamento: "",
  });

  const handleSave = () => {
    if (!formData.nome || !formData.fabricante || !formData.protocolo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    toast.success(isNew ? "Equipamento cadastrado com sucesso" : "Equipamento atualizado com sucesso");
    navigate("/interfaciamento/equipamentos");
  };

  const handleAddMapeamento = () => {
    if (!novoMapeamento.exameCodigo || !novoMapeamento.codigoEquipamento) {
      toast.error("Preencha todos os campos do mapeamento");
      return;
    }

    const exame = examesDisponiveis.find(e => e.codigo === novoMapeamento.exameCodigo);
    if (!exame) return;

    // Verifica se já existe mapeamento para este exame
    const jaExiste = mapeamentos.some(m => m.exameCodigo === novoMapeamento.exameCodigo);
    if (jaExiste) {
      toast.error("Este exame já está mapeado para este equipamento");
      return;
    }

    setMapeamentos([
      ...mapeamentos,
      {
        id: Date.now(),
        exameNome: exame.nome,
        exameCodigo: exame.codigo,
        codigoEquipamento: novoMapeamento.codigoEquipamento,
        ativo: true,
      },
    ]);

    setNovoMapeamento({ exameCodigo: "", codigoEquipamento: "" });
    setDialogOpen(false);
    toast.success("Mapeamento adicionado");
  };

  const handleRemoveMapeamento = (id: number) => {
    setMapeamentos(mapeamentos.filter(m => m.id !== id));
    toast.success("Mapeamento removido");
  };

  const handleToggleMapeamento = (id: number) => {
    setMapeamentos(mapeamentos.map(m => 
      m.id === id ? { ...m, ativo: !m.ativo } : m
    ));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/interfaciamento/equipamentos" className="hover:text-foreground">
          Equipamentos
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{isNew ? "Novo Equipamento" : "Editar Equipamento"}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? "Novo Equipamento" : "Editar Equipamento"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? "Cadastre um novo equipamento de automação" : "Edite as informações do equipamento"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/interfaciamento/equipamentos")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados do Equipamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Dados do Equipamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome do Equipamento *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Analisador Hematológico XN-1000"
                />
              </div>
              <div>
                <Label htmlFor="fabricante">Fabricante *</Label>
                <Input
                  id="fabricante"
                  value={formData.fabricante}
                  onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                  placeholder="Ex: Sysmex"
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  placeholder="Ex: XN-1000"
                />
              </div>
              <div>
                <Label htmlFor="numeroSerie">Número de Série</Label>
                <Input
                  id="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                  placeholder="Ex: SN-2024-001234"
                />
              </div>
              <div>
                <Label htmlFor="setor">Setor / Laboratório</Label>
                <Select 
                  value={formData.setor} 
                  onValueChange={(value) => setFormData({ ...formData, setor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hematologia">Hematologia</SelectItem>
                    <SelectItem value="Bioquímica">Bioquímica</SelectItem>
                    <SelectItem value="Imunologia">Imunologia</SelectItem>
                    <SelectItem value="Microbiologia">Microbiologia</SelectItem>
                    <SelectItem value="Urinálise">Urinálise</SelectItem>
                    <SelectItem value="Coagulação">Coagulação</SelectItem>
                    <SelectItem value="Hormônios">Hormônios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Equipamento Ativo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Comunicação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="w-5 h-5" />
              Configurações de Comunicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ip">Endereço IP</Label>
                <Input
                  id="ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  placeholder="Ex: 192.168.1.100"
                />
              </div>
              <div>
                <Label htmlFor="porta">Porta</Label>
                <Input
                  id="porta"
                  value={formData.porta}
                  onChange={(e) => setFormData({ ...formData, porta: e.target.value })}
                  placeholder="Ex: 5000"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="canalComunicacao">Canal de Comunicação</Label>
                <Input
                  id="canalComunicacao"
                  value={formData.canalComunicacao}
                  onChange={(e) => setFormData({ ...formData, canalComunicacao: e.target.value })}
                  placeholder="Ex: COM1, USB0, TCP/IP"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Porta serial, USB ou endereço de rede
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocolo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Protocolo de Comunicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="protocolo">Protocolo *</Label>
              <Select 
                value={formData.protocolo} 
                onValueChange={(value) => setFormData({ ...formData, protocolo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o protocolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="astm">ASTM</SelectItem>
                  <SelectItem value="hl7">HL7</SelectItem>
                  <SelectItem value="proprietario">Proprietário</SelectItem>
                  <SelectItem value="serial">Serial</SelectItem>
                  <SelectItem value="tcpip">TCP/IP</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Protocolo utilizado para comunicação com o equipamento
              </p>
            </div>
            <div>
              <Label htmlFor="frequenciaComunicacao">Frequência de Comunicação (segundos)</Label>
              <Input
                id="frequenciaComunicacao"
                type="number"
                value={formData.frequenciaComunicacao}
                onChange={(e) => setFormData({ ...formData, frequenciaComunicacao: e.target.value })}
                placeholder="Ex: 30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Intervalo entre verificações de comunicação
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o equipamento, histórico de manutenção, etc."
              rows={5}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mapeamento de Exames - Seção full width */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Mapeamento de Exames
          </CardTitle>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exame
          </Button>
        </CardHeader>
        <CardContent>
          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Integração com SaúdeLab</p>
                <p className="text-sm text-blue-700 mt-1">
                  O mapeamento permite que resultados recebidos do equipamento sejam automaticamente 
                  associados aos exames cadastrados no SaúdeLab.
                </p>
              </div>
            </div>
          </div>

          {mapeamentos.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">Nenhum exame mapeado para este equipamento</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em "Adicionar Exame" para vincular exames a este equipamento
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exame (SaúdeLab)</TableHead>
                  <TableHead>Código Exame</TableHead>
                  <TableHead>Código Equipamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapeamentos.map((mapeamento) => (
                  <TableRow key={mapeamento.id}>
                    <TableCell className="font-medium">{mapeamento.exameNome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapeamento.exameCodigo}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                        {mapeamento.codigoEquipamento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={mapeamento.ativo}
                        onCheckedChange={() => handleToggleMapeamento(mapeamento.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMapeamento(mapeamento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para adicionar mapeamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Mapeamento de Exame</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="exameCodigo">Exame (SaúdeLab)</Label>
              <Select 
                value={novoMapeamento.exameCodigo} 
                onValueChange={(value) => setNovoMapeamento({ ...novoMapeamento, exameCodigo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o exame" />
                </SelectTrigger>
                <SelectContent>
                  {examesDisponiveis
                    .filter(e => !mapeamentos.some(m => m.exameCodigo === e.codigo))
                    .map((exame) => (
                      <SelectItem key={exame.codigo} value={exame.codigo}>
                        {exame.nome} ({exame.codigo})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="codigoEquipamento">Código no Equipamento</Label>
              <Input
                id="codigoEquipamento"
                value={novoMapeamento.codigoEquipamento}
                onChange={(e) => setNovoMapeamento({ ...novoMapeamento, codigoEquipamento: e.target.value })}
                placeholder="Ex: CBC, GLU, PT"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Este código é usado para identificar o exame nas mensagens do equipamento
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMapeamento}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

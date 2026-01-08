import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Plus, Edit, Building2, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const parceirosIniciais = [
  { id: "1", codigo: "LAC", descricao: "Lab Apoio Central", identificacao: "LAC001", tipoIntegracao: "API", ativo: true },
  { id: "2", codigo: "LANC", descricao: "Lab Análises Clínicas", identificacao: "LANC002", tipoIntegracao: "Arquivo", ativo: true },
  { id: "3", codigo: "CSP", descricao: "Clínica São Paulo", identificacao: "CSP003", tipoIntegracao: "API", ativo: true },
  { id: "4", codigo: "HREG", descricao: "Hospital Regional", identificacao: "HREG004", tipoIntegracao: "Arquivo", ativo: true },
  { id: "5", codigo: "LESP", descricao: "Lab Especializado", identificacao: "LESP005", tipoIntegracao: "API", ativo: false }
];

const TransferenciaConfiguracoes = () => {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState(parceirosIniciais);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParceiro, setEditingParceiro] = useState<typeof parceirosIniciais[0] | null>(null);
  const [novoParceiro, setNovoParceiro] = useState({
    codigo: "",
    descricao: "",
    identificacao: "",
    tipoIntegracao: "API",
    ativo: true
  });

  const handleSaveParceiro = () => {
    if (!novoParceiro.codigo || !novoParceiro.descricao) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingParceiro) {
      setParceiros(prev => prev.map(p => 
        p.id === editingParceiro.id 
          ? { ...p, ...novoParceiro }
          : p
      ));
      toast.success("Parceiro atualizado com sucesso!");
    } else {
      setParceiros(prev => [...prev, {
        id: String(prev.length + 1),
        ...novoParceiro
      }]);
      toast.success("Parceiro cadastrado com sucesso!");
    }

    setDialogOpen(false);
    setEditingParceiro(null);
    setNovoParceiro({
      codigo: "",
      descricao: "",
      identificacao: "",
      tipoIntegracao: "API",
      ativo: true
    });
  };

  const handleEditParceiro = (parceiro: typeof parceirosIniciais[0]) => {
    setEditingParceiro(parceiro);
    setNovoParceiro({
      codigo: parceiro.codigo,
      descricao: parceiro.descricao,
      identificacao: parceiro.identificacao,
      tipoIntegracao: parceiro.tipoIntegracao,
      ativo: parceiro.ativo
    });
    setDialogOpen(true);
  };

  const handleToggleAtivo = (id: string) => {
    setParceiros(prev => prev.map(p => 
      p.id === id ? { ...p, ativo: !p.ativo } : p
    ));
    toast.success("Status do parceiro alterado!");
  };

  return (
    <TransferenciaLayout title="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os parceiros e configurações de integração
          </p>
        </div>

        {/* Parceiros */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Cadastro de Parceiros
              </CardTitle>
              <CardDescription>
                Configure os laboratórios e clínicas parceiras para integração
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => {
              setEditingParceiro(null);
              setNovoParceiro({
                codigo: "",
                descricao: "",
                identificacao: "",
                tipoIntegracao: "API",
                ativo: true
              });
              setDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Identificação no Parceiro</TableHead>
                  <TableHead>Tipo de Integração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parceiros.map((parceiro) => (
                  <TableRow key={parceiro.id}>
                    <TableCell className="font-mono font-medium">{parceiro.codigo}</TableCell>
                    <TableCell className="font-medium">{parceiro.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">{parceiro.identificacao}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={parceiro.tipoIntegracao === "API" ? "border-blue-300 text-blue-700" : "border-purple-300 text-purple-700"}
                      >
                        {parceiro.tipoIntegracao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={parceiro.ativo} 
                        onCheckedChange={() => handleToggleAtivo(parceiro.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/transferencia/configuracoes/parceiro/${parceiro.id}`)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditParceiro(parceiro)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Novo/Editar Parceiro */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingParceiro ? "Editar Parceiro" : "Novo Parceiro"}
              </DialogTitle>
              <DialogDescription>
                {editingParceiro ? "Atualize os dados do parceiro" : "Cadastre um novo laboratório ou clínica parceira"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input 
                  id="codigo"
                  placeholder="Ex: LAC"
                  value={novoParceiro.codigo}
                  onChange={(e) => setNovoParceiro(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input 
                  id="descricao"
                  placeholder="Nome do parceiro"
                  value={novoParceiro.descricao}
                  onChange={(e) => setNovoParceiro(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificacao">Identificação no Parceiro</Label>
                <Input 
                  id="identificacao"
                  placeholder="Código de identificação"
                  value={novoParceiro.identificacao}
                  onChange={(e) => setNovoParceiro(prev => ({ ...prev, identificacao: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoIntegracao">Tipo de Integração</Label>
                <Select 
                  value={novoParceiro.tipoIntegracao} 
                  onValueChange={(value) => setNovoParceiro(prev => ({ ...prev, tipoIntegracao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Arquivo">Arquivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Ativo</Label>
                <Switch 
                  id="ativo"
                  checked={novoParceiro.ativo}
                  onCheckedChange={(checked) => setNovoParceiro(prev => ({ ...prev, ativo: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveParceiro}>
                {editingParceiro ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaConfiguracoes;

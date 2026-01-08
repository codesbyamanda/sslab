import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Plus, Edit, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

// Mock data do parceiro
const parceiroData = {
  id: "1",
  codigo: "LAC",
  descricao: "Lab Apoio Central",
  identificacao: "LAC001",
  tipoIntegracao: "API",
  ativo: true,
  exportarRequisicao: true,
  importarRequisicao: false,
  exportarLaudos: false,
  importarLaudos: true,
  usarMnemonico: true,
  marcarLiberados: true
};

// Mock data De/Para
const servicosDepara = [
  { id: "1", codigoInterno: "HEM", codigoParceiro: "HEMO001", descricaoInterna: "Hemograma Completo", descricaoParceiro: "Hemograma" },
  { id: "2", codigoInterno: "GLI", codigoParceiro: "GLIC001", descricaoInterna: "Glicemia de Jejum", descricaoParceiro: "Glicose Jejum" },
  { id: "3", codigoInterno: "COL", codigoParceiro: "COLT001", descricaoInterna: "Colesterol Total", descricaoParceiro: "Colesterol" }
];

const materiaisDepara = [
  { id: "1", codigoInterno: "SG", codigoParceiro: "SANG", descricaoInterna: "Sangue", descricaoParceiro: "Sangue Venoso" },
  { id: "2", codigoInterno: "UR", codigoParceiro: "URIN", descricaoInterna: "Urina", descricaoParceiro: "Amostra Urina" }
];

const assinantesDepara = [
  { id: "1", codigoInterno: "DRM001", codigoParceiro: "MED001", descricaoInterna: "Dr. Carlos Eduardo", descricaoParceiro: "Dr. Carlos E. Silva" }
];

const conveniosDepara = [
  { id: "1", codigoInterno: "UNIMED", codigoParceiro: "UNI001", descricaoInterna: "Unimed", descricaoParceiro: "Unimed Nacional" },
  { id: "2", codigoInterno: "BRADESCO", codigoParceiro: "BRA001", descricaoInterna: "Bradesco Saúde", descricaoParceiro: "Bradesco" }
];

interface DeparaItem {
  id: string;
  codigoInterno: string;
  codigoParceiro: string;
  descricaoInterna: string;
  descricaoParceiro: string;
}

const ParceiroDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parceiro, setParceiro] = useState(parceiroData);
  const [servicos, setServicos] = useState(servicosDepara);
  const [materiais, setMateriais] = useState(materiaisDepara);
  const [assinantes, setAssinantes] = useState(assinantesDepara);
  const [convenios, setConvenios] = useState(conveniosDepara);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("servicos");
  const [editingItem, setEditingItem] = useState<DeparaItem | null>(null);
  const [novoItem, setNovoItem] = useState({
    codigoInterno: "",
    codigoParceiro: "",
    descricaoInterna: "",
    descricaoParceiro: ""
  });

  const getActiveList = () => {
    switch (activeTab) {
      case "servicos": return servicos;
      case "materiais": return materiais;
      case "assinantes": return assinantes;
      case "convenios": return convenios;
      default: return [];
    }
  };

  const setActiveList = (items: DeparaItem[]) => {
    switch (activeTab) {
      case "servicos": setServicos(items); break;
      case "materiais": setMateriais(items); break;
      case "assinantes": setAssinantes(items); break;
      case "convenios": setConvenios(items); break;
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setNovoItem({
      codigoInterno: "",
      codigoParceiro: "",
      descricaoInterna: "",
      descricaoParceiro: ""
    });
    setDialogOpen(true);
  };

  const handleEditItem = (item: DeparaItem) => {
    setEditingItem(item);
    setNovoItem({
      codigoInterno: item.codigoInterno,
      codigoParceiro: item.codigoParceiro,
      descricaoInterna: item.descricaoInterna,
      descricaoParceiro: item.descricaoParceiro
    });
    setDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const list = getActiveList();
    setActiveList(list.filter(item => item.id !== itemId));
    toast.success("Item removido com sucesso!");
  };

  const handleSaveItem = () => {
    if (!novoItem.codigoInterno || !novoItem.codigoParceiro) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const list = getActiveList();
    
    if (editingItem) {
      setActiveList(list.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...novoItem }
          : item
      ));
      toast.success("Item atualizado com sucesso!");
    } else {
      setActiveList([...list, {
        id: String(list.length + 1),
        ...novoItem
      }]);
      toast.success("Item cadastrado com sucesso!");
    }

    setDialogOpen(false);
  };

  const handleSaveConfiguracoes = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "servicos": return "Serviço";
      case "materiais": return "Material";
      case "assinantes": return "Assinante";
      case "convenios": return "Convênio/Plano";
      default: return "Item";
    }
  };

  return (
    <TransferenciaLayout title="Detalhe do Parceiro">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/transferencia/configuracoes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">{parceiro.descricao}</h1>
              <Badge 
                variant="outline"
                className={parceiro.tipoIntegracao === "API" ? "border-blue-300 text-blue-700" : "border-purple-300 text-purple-700"}
              >
                {parceiro.tipoIntegracao}
              </Badge>
              <Badge 
                className={parceiro.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-700"}
              >
                {parceiro.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Código: {parceiro.codigo} | Identificação: {parceiro.identificacao}
            </p>
          </div>
        </div>

        {/* Configurações do Parceiro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações de Integração</CardTitle>
            <CardDescription>
              Defina quais operações estão habilitadas para este parceiro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Requisições</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="exportarRequisicao">Exportar requisições</Label>
                  <Switch 
                    id="exportarRequisicao"
                    checked={parceiro.exportarRequisicao}
                    onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, exportarRequisicao: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="importarRequisicao">Importar requisições</Label>
                  <Switch 
                    id="importarRequisicao"
                    checked={parceiro.importarRequisicao}
                    onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, importarRequisicao: checked }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Laudos</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="exportarLaudos">Exportar laudos</Label>
                  <Switch 
                    id="exportarLaudos"
                    checked={parceiro.exportarLaudos}
                    onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, exportarLaudos: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="importarLaudos">Importar laudos</Label>
                  <Switch 
                    id="importarLaudos"
                    checked={parceiro.importarLaudos}
                    onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, importarLaudos: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Opções Adicionais</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="usarMnemonico">Usar mnemônico do exame</Label>
                  <p className="text-sm text-muted-foreground">Utilizar código mnemônico ao invés do código numérico</p>
                </div>
                <Switch 
                  id="usarMnemonico"
                  checked={parceiro.usarMnemonico}
                  onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, usarMnemonico: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marcarLiberados">Marcar exames como liberados</Label>
                  <p className="text-sm text-muted-foreground">Ao importar laudos, marcar automaticamente como liberados</p>
                </div>
                <Switch 
                  id="marcarLiberados"
                  checked={parceiro.marcarLiberados}
                  onCheckedChange={(checked) => setParceiro(prev => ({ ...prev, marcarLiberados: checked }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveConfiguracoes}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* De/Para de Tabelas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">De/Para de Tabelas</CardTitle>
            <CardDescription>
              Configure o mapeamento entre os códigos internos e os códigos do parceiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="servicos">Serviços</TabsTrigger>
                  <TabsTrigger value="materiais">Materiais</TabsTrigger>
                  <TabsTrigger value="assinantes">Assinantes</TabsTrigger>
                  <TabsTrigger value="convenios">Convênios/Planos</TabsTrigger>
                </TabsList>
                <Button size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {["servicos", "materiais", "assinantes", "convenios"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código Interno</TableHead>
                        <TableHead>Código Parceiro</TableHead>
                        <TableHead>Descrição Interna</TableHead>
                        <TableHead>Descrição Parceiro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === "servicos" ? servicos : 
                        tab === "materiais" ? materiais : 
                        tab === "assinantes" ? assinantes : convenios
                      ).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Nenhum mapeamento cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        (tab === "servicos" ? servicos : 
                          tab === "materiais" ? materiais : 
                          tab === "assinantes" ? assinantes : convenios
                        ).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium text-primary">{item.codigoInterno}</TableCell>
                            <TableCell className="font-mono">{item.codigoParceiro}</TableCell>
                            <TableCell>{item.descricaoInterna}</TableCell>
                            <TableCell className="text-muted-foreground">{item.descricaoParceiro}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialog de Novo/Editar Item */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Editar ${getTabTitle()}` : `Novo ${getTabTitle()}`}
              </DialogTitle>
              <DialogDescription>
                Configure o mapeamento entre o sistema interno e o parceiro
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoInterno">Código Interno *</Label>
                  <Input 
                    id="codigoInterno"
                    placeholder="Ex: HEM"
                    value={novoItem.codigoInterno}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, codigoInterno: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoParceiro">Código Parceiro *</Label>
                  <Input 
                    id="codigoParceiro"
                    placeholder="Ex: HEMO001"
                    value={novoItem.codigoParceiro}
                    onChange={(e) => setNovoItem(prev => ({ ...prev, codigoParceiro: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricaoInterna">Descrição Interna</Label>
                <Input 
                  id="descricaoInterna"
                  placeholder="Descrição no sistema"
                  value={novoItem.descricaoInterna}
                  onChange={(e) => setNovoItem(prev => ({ ...prev, descricaoInterna: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricaoParceiro">Descrição no Parceiro</Label>
                <Input 
                  id="descricaoParceiro"
                  placeholder="Descrição no parceiro"
                  value={novoItem.descricaoParceiro}
                  onChange={(e) => setNovoItem(prev => ({ ...prev, descricaoParceiro: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate("/transferencia/configuracoes")}>
            Voltar
          </Button>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default ParceiroDetalhe;

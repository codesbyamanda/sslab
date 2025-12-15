import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface ItemGuia {
  id: string;
  codAMB: string;
  tabela: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

const mockItens: ItemGuia[] = [
  {
    id: "1",
    codAMB: "40301010",
    tabela: "CBHPM",
    descricao: "Hemograma Completo",
    quantidade: 1,
    valorUnitario: 35.0,
  },
  {
    id: "2",
    codAMB: "40302040",
    tabela: "CBHPM",
    descricao: "Glicemia de Jejum",
    quantidade: 1,
    valorUnitario: 15.0,
  },
  {
    id: "3",
    codAMB: "40302059",
    tabela: "CBHPM",
    descricao: "Colesterol Total",
    quantidade: 1,
    valorUnitario: 25.0,
  },
];

const GuiaCadastro = () => {
  const navigate = useNavigate();
  const { id, guiaId } = useParams();
  const isEditing = !!guiaId && guiaId !== "nova";

  const [formData, setFormData] = useState({
    numGuia: isEditing ? "GUI-2024-0001" : "",
    valor: isEditing ? "450.00" : "",
    lotePreFaturamento: isEditing ? "PRE-2024-001" : "",
    loteFaturamento: "",
    empresaAuditoria: "",
    numFormularioAuditoria: "",
  });

  const [itens, setItens] = useState<ItemGuia[]>(isEditing ? mockItens : []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    const newItem: ItemGuia = {
      id: Date.now().toString(),
      codAMB: "",
      tabela: "CBHPM",
      descricao: "",
      quantidade: 1,
      valorUnitario: 0,
    };
    setItens((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItens((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    if (!formData.numGuia) {
      toast.error("Informe o número da guia");
      return;
    }
    toast.success(isEditing ? "Guia atualizada com sucesso!" : "Guia cadastrada com sucesso!");
    navigate(`/atendimento/guias/${id}`);
  };

  const handleSaveAndNew = () => {
    if (!formData.numGuia) {
      toast.error("Informe o número da guia");
      return;
    }
    toast.success("Guia cadastrada com sucesso!");
    setFormData({
      numGuia: "",
      valor: "",
      lotePreFaturamento: "",
      loteFaturamento: "",
      empresaAuditoria: "",
      numFormularioAuditoria: "",
    });
    setItens([]);
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(`/atendimento/guias/${id}`)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Guias</span>
          </button>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? "Editar Guia" : "Nova Guia"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Altere os dados da guia selecionada"
                    : "Preencha os campos para cadastrar uma nova guia"}
                </p>
              </div>
            </div>
          </div>

          {/* Dados da Guia */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Dados da Guia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nº Guia <span className="text-vermelho-moderno">*</span>
                  </label>
                  <Input
                    placeholder="Ex: GUI-2024-0001"
                    value={formData.numGuia}
                    onChange={(e) => handleChange("numGuia", e.target.value)}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Valor (R$)
                  </label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => handleChange("valor", e.target.value)}
                    className="input-modern"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Lote Pré-Faturamento
                  </label>
                  <Input
                    placeholder="Ex: PRE-2024-001"
                    value={formData.lotePreFaturamento}
                    onChange={(e) => handleChange("lotePreFaturamento", e.target.value)}
                    className="input-modern"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Lote Faturamento
                  </label>
                  <Input
                    placeholder="Ex: FAT-2024-001"
                    value={formData.loteFaturamento}
                    onChange={(e) => handleChange("loteFaturamento", e.target.value)}
                    className="input-modern"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Empresa Auditoria
                  </label>
                  <Select
                    value={formData.empresaAuditoria}
                    onValueChange={(value) => handleChange("empresaAuditoria", value)}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auditoria1">Auditoria ABC</SelectItem>
                      <SelectItem value="auditoria2">Auditoria XYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nº Formulário Auditoria
                  </label>
                  <Input
                    placeholder="Ex: AUD-001"
                    value={formData.numFormularioAuditoria}
                    onChange={(e) => handleChange("numFormularioAuditoria", e.target.value)}
                    className="input-modern"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itens da Guia */}
          <Card className="card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Itens</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-medium">
                    Total:{" "}
                    {calcularTotal().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-1">
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Cód AMB</TableHead>
                      <TableHead className="font-semibold">Tabela</TableHead>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold text-center">Qtd</TableHead>
                      <TableHead className="font-semibold text-right">Valor Unit.</TableHead>
                      <TableHead className="font-semibold text-right">Subtotal</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itens.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      itens.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.codAMB}
                              onChange={(e) =>
                                handleItemChange(item.id, "codAMB", e.target.value)
                              }
                              className="h-8 w-24 font-mono text-xs"
                              placeholder="00000000"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.tabela}
                              onValueChange={(value) =>
                                handleItemChange(item.id, "tabela", value)
                              }
                            >
                              <SelectTrigger className="h-8 w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CBHPM">CBHPM</SelectItem>
                                <SelectItem value="AMB">AMB</SelectItem>
                                <SelectItem value="TUSS">TUSS</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.descricao}
                              onChange={(e) =>
                                handleItemChange(item.id, "descricao", e.target.value)
                              }
                              className="h-8 text-sm"
                              placeholder="Descrição do item"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantidade}
                              onChange={(e) =>
                                handleItemChange(item.id, "quantidade", parseInt(e.target.value) || 1)
                              }
                              className="h-8 w-16 text-center text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.valorUnitario}
                              onChange={(e) =>
                                handleItemChange(item.id, "valorUnitario", parseFloat(e.target.value) || 0)
                              }
                              className="h-8 w-24 text-right text-sm"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {(item.quantidade * item.valorUnitario).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-vermelho-moderno"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 mt-6 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => navigate(`/atendimento/guias/${id}`)}
            >
              Cancelar
            </Button>
            {!isEditing && (
              <Button variant="outline" onClick={handleSaveAndNew}>
                Salvar e Novo
              </Button>
            )}
            <Button onClick={handleSave} className="btn-primary-premium">
              Salvar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuiaCadastro;

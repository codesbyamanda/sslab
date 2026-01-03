import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RecipienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "TB-RX",
    nome: isNew ? "" : "Tubo Roxo",
    tipo: isNew ? "" : "Tubo",
    material: isNew ? "" : "Plástico",
    volume: isNew ? "" : "4",
    unidadeVolume: isNew ? "mL" : "mL",
    conservante: isNew ? "" : "EDTA K2",
    corIdentificacao: isNew ? "" : "Roxo",
    fabricante: isNew ? "" : "BD Vacutainer",
    codigoBarras: isNew ? "" : "7891234567890",
    observacoes: isNew ? "" : "",
    ativo: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Recipiente cadastrado" : "Recipiente atualizado",
      description: `O recipiente ${formData.nome} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/recipientes");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Saúde Cadastro</span>
        <span>/</span>
        <span>Laboratório</span>
        <span>/</span>
        <span
          className="hover:text-foreground cursor-pointer"
          onClick={() => navigate("/cadastro/recipientes")}
        >
          Recipientes
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo Recipiente" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/recipientes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Recipiente" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo recipiente de coleta" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/recipientes")}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Recipiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="TB-RX"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do recipiente"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tubo">Tubo</SelectItem>
                      <SelectItem value="Frasco">Frasco</SelectItem>
                      <SelectItem value="Swab">Swab</SelectItem>
                      <SelectItem value="Lâmina">Lâmina</SelectItem>
                      <SelectItem value="Seringa">Seringa</SelectItem>
                      <SelectItem value="Coletor">Coletor</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plástico">Plástico</SelectItem>
                      <SelectItem value="Vidro">Vidro</SelectItem>
                      <SelectItem value="Algodão">Algodão</SelectItem>
                      <SelectItem value="Aço Inox">Aço Inox</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Input
                    id="volume"
                    type="number"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidadeVolume">Unidade</Label>
                  <Select
                    value={formData.unidadeVolume}
                    onValueChange={(value) => setFormData({ ...formData, unidadeVolume: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="µL">µL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corIdentificacao">Cor de Identificação</Label>
                  <Select
                    value={formData.corIdentificacao}
                    onValueChange={(value) => setFormData({ ...formData, corIdentificacao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roxo">Roxo</SelectItem>
                      <SelectItem value="Azul">Azul</SelectItem>
                      <SelectItem value="Verde">Verde</SelectItem>
                      <SelectItem value="Cinza">Cinza</SelectItem>
                      <SelectItem value="Amarelo">Amarelo</SelectItem>
                      <SelectItem value="Vermelho">Vermelho</SelectItem>
                      <SelectItem value="Branco">Branco</SelectItem>
                      <SelectItem value="Transparente">Transparente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conservante">Conservante Associado</Label>
                  <Select
                    value={formData.conservante}
                    onValueChange={(value) => setFormData({ ...formData, conservante: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o conservante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDTA K2">EDTA K2</SelectItem>
                      <SelectItem value="EDTA K3">EDTA K3</SelectItem>
                      <SelectItem value="Citrato de Sódio">Citrato de Sódio</SelectItem>
                      <SelectItem value="Heparina">Heparina</SelectItem>
                      <SelectItem value="Fluoreto de Sódio">Fluoreto de Sódio</SelectItem>
                      <SelectItem value="Gel Separador">Gel Separador</SelectItem>
                      <SelectItem value="Sem Aditivo">Sem Aditivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fabricante">Fabricante</Label>
                  <Input
                    id="fabricante"
                    value={formData.fabricante}
                    onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                    placeholder="Nome do fabricante"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoBarras">Código de Barras</Label>
                <Input
                  id="codigoBarras"
                  value={formData.codigoBarras}
                  onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
                  placeholder="Código de barras do produto"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Recipiente Ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em:</span>
                <span>01/01/2020</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Atualizado em:</span>
                <span>15/03/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exames vinculados:</span>
                <span>67</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

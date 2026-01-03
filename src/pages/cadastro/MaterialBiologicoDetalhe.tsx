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

export default function MaterialBiologicoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "SG",
    nome: isNew ? "" : "Sangue",
    categoria: isNew ? "" : "Fluidos",
    origem: isNew ? "" : "Venosa",
    coletaInstrucoes: isNew ? "" : "Coletar com paciente em jejum de 8-12 horas quando necessário",
    volumeMinimo: isNew ? "" : "5",
    unidadeVolume: isNew ? "mL" : "mL",
    conservante: isNew ? "" : "EDTA K2",
    temperatura: isNew ? "" : "2-8",
    estabilidade: isNew ? "" : "24 horas",
    observacoes: isNew ? "" : "",
    ativo: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Material cadastrado" : "Material atualizado",
      description: `O material ${formData.nome} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/materiais-biologicos");
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
          onClick={() => navigate("/cadastro/materiais-biologicos")}
        >
          Materiais Biológicos
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo Material" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/materiais-biologicos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Material Biológico" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo tipo de amostra" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/materiais-biologicos")}>
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
              <CardTitle>Dados do Material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="SG"
                    maxLength={4}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do material"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fluidos">Fluidos</SelectItem>
                      <SelectItem value="Secreções">Secreções</SelectItem>
                      <SelectItem value="Excreções">Excreções</SelectItem>
                      <SelectItem value="Tecidos">Tecidos</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem da Coleta</Label>
                  <Input
                    id="origem"
                    value={formData.origem}
                    onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                    placeholder="Ex: Venosa, Punção, Swab"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especificações de Coleta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coletaInstrucoes">Instruções de Coleta</Label>
                <Textarea
                  id="coletaInstrucoes"
                  value={formData.coletaInstrucoes}
                  onChange={(e) => setFormData({ ...formData, coletaInstrucoes: e.target.value })}
                  placeholder="Instruções para a coleta do material"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volumeMinimo">Volume Mínimo</Label>
                  <Input
                    id="volumeMinimo"
                    type="number"
                    value={formData.volumeMinimo}
                    onChange={(e) => setFormData({ ...formData, volumeMinimo: e.target.value })}
                    placeholder="5"
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
                      <SelectItem value="g">g</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperatura">Temperatura (°C)</Label>
                  <Input
                    id="temperatura"
                    value={formData.temperatura}
                    onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
                    placeholder="2-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estabilidade">Estabilidade</Label>
                  <Input
                    id="estabilidade"
                    value={formData.estabilidade}
                    onChange={(e) => setFormData({ ...formData, estabilidade: e.target.value })}
                    placeholder="24 horas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conservante">Conservante Padrão</Label>
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
                <Label htmlFor="ativo">Material Ativo</Label>
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
                <span>128</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

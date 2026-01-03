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

export default function ConservanteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "001",
    nome: isNew ? "" : "EDTA K2",
    tipo: isNew ? "" : "Anticoagulante",
    corTubo: isNew ? "" : "Roxo",
    volume: isNew ? "" : "3",
    unidadeVolume: isNew ? "mL" : "mL",
    funcao: isNew ? "" : "Anticoagulante para hematologia",
    instrucoes: isNew ? "" : "Homogeneizar por inversão 8-10 vezes imediatamente após a coleta",
    temperatura: isNew ? "" : "15-25",
    estabilidade: isNew ? "" : "24 horas",
    observacoes: isNew ? "" : "",
    ativo: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Conservante cadastrado" : "Conservante atualizado",
      description: `O conservante ${formData.nome} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/conservantes");
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
          onClick={() => navigate("/cadastro/conservantes")}
        >
          Conservantes
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo Conservante" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/conservantes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Conservante" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo conservante" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/conservantes")}>
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
              <CardTitle>Dados do Conservante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="001"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do conservante"
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
                      <SelectItem value="Anticoagulante">Anticoagulante</SelectItem>
                      <SelectItem value="Antiglicolítico">Antiglicolítico</SelectItem>
                      <SelectItem value="Ativador de Coágulo">Ativador de Coágulo</SelectItem>
                      <SelectItem value="Conservante">Conservante</SelectItem>
                      <SelectItem value="Seco">Seco (Sem Aditivo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corTubo">Cor do Tubo</Label>
                  <Select
                    value={formData.corTubo}
                    onValueChange={(value) => setFormData({ ...formData, corTubo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roxo">Roxo (EDTA)</SelectItem>
                      <SelectItem value="Azul">Azul (Citrato)</SelectItem>
                      <SelectItem value="Verde">Verde (Heparina)</SelectItem>
                      <SelectItem value="Cinza">Cinza (Fluoreto)</SelectItem>
                      <SelectItem value="Amarelo">Amarelo (Gel Separador)</SelectItem>
                      <SelectItem value="Vermelho">Vermelho (Seco)</SelectItem>
                      <SelectItem value="Branco">Branco</SelectItem>
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
                    placeholder="3"
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
                  <Label htmlFor="temperatura">Temperatura (°C)</Label>
                  <Input
                    id="temperatura"
                    value={formData.temperatura}
                    onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
                    placeholder="15-25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funcao">Função</Label>
                <Textarea
                  id="funcao"
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                  placeholder="Descreva a função do conservante"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instruções de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instrucoes">Instruções de Manuseio</Label>
                <Textarea
                  id="instrucoes"
                  value={formData.instrucoes}
                  onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })}
                  placeholder="Instruções para manuseio correto"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estabilidade">Estabilidade da Amostra</Label>
                <Input
                  id="estabilidade"
                  value={formData.estabilidade}
                  onChange={(e) => setFormData({ ...formData, estabilidade: e.target.value })}
                  placeholder="Ex: 24 horas"
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
                <Label htmlFor="ativo">Conservante Ativo</Label>
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
                <span>45</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

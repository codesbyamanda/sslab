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

export default function BancadaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "HEM",
    nome: isNew ? "" : "Hematologia",
    setor: isNew ? "" : "Laboratório Central",
    equipamento: isNew ? "" : "ABX Pentra",
    responsavel: isNew ? "" : "Dr. Carlos Silva",
    capacidadeDiaria: isNew ? "" : "200",
    tempoMedio: isNew ? "" : "15",
    descricao: isNew ? "" : "Bancada de hematologia para hemogramas e coagulação básica",
    observacoes: isNew ? "" : "",
    ativo: true,
    interfaceada: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Bancada cadastrada" : "Bancada atualizada",
      description: `A bancada ${formData.nome} foi ${isNew ? "cadastrada" : "atualizada"} com sucesso.`,
    });
    navigate("/cadastro/bancadas");
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
          onClick={() => navigate("/cadastro/bancadas")}
        >
          Bancadas
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Nova Bancada" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/bancadas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Nova Bancada" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar nova bancada de trabalho" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/bancadas")}>
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
              <CardTitle>Dados da Bancada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="HEM"
                    maxLength={5}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da bancada"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Select
                    value={formData.setor}
                    onValueChange={(value) => setFormData({ ...formData, setor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laboratório Central">Laboratório Central</SelectItem>
                      <SelectItem value="Microbiologia">Microbiologia</SelectItem>
                      <SelectItem value="Parasitologia">Parasitologia</SelectItem>
                      <SelectItem value="Urgência">Urgência</SelectItem>
                      <SelectItem value="Anatomia Patológica">Anatomia Patológica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipamento">Equipamento Principal</Label>
                  <Input
                    id="equipamento"
                    value={formData.equipamento}
                    onChange={(e) => setFormData({ ...formData, equipamento: e.target.value })}
                    placeholder="Nome do equipamento"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável Técnico</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da bancada"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacidade e Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacidadeDiaria">Capacidade Diária (exames)</Label>
                  <Input
                    id="capacidadeDiaria"
                    type="number"
                    value={formData.capacidadeDiaria}
                    onChange={(e) => setFormData({ ...formData, capacidadeDiaria: e.target.value })}
                    placeholder="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempoMedio">Tempo Médio por Exame (min)</Label>
                  <Input
                    id="tempoMedio"
                    type="number"
                    value={formData.tempoMedio}
                    onChange={(e) => setFormData({ ...formData, tempoMedio: e.target.value })}
                    placeholder="15"
                  />
                </div>
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
              <CardTitle>Status e Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Bancada Ativa</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="interfaceada">Interfaceada</Label>
                  <p className="text-xs text-muted-foreground">
                    Conectada a equipamento automatizado
                  </p>
                </div>
                <Switch
                  id="interfaceada"
                  checked={formData.interfaceada}
                  onCheckedChange={(checked) => setFormData({ ...formData, interfaceada: checked })}
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
                <span>15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exames hoje:</span>
                <span>87</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

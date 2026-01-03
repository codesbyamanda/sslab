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

export default function EspecialidadeDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "002",
    codigoANS: isNew ? "" : "2",
    codigoTUSS: isNew ? "" : "2",
    nome: isNew ? "" : "Cardiologia",
    area: isNew ? "" : "Clínica",
    descricao: isNew ? "" : "Especialidade médica que se ocupa do diagnóstico e tratamento das doenças do coração e do sistema circulatório.",
    requerRQE: isNew ? true : true,
    observacoes: isNew ? "" : "",
    ativo: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Especialidade cadastrada" : "Especialidade atualizada",
      description: `A especialidade ${formData.nome} foi ${isNew ? "cadastrada" : "atualizada"} com sucesso.`,
    });
    navigate("/cadastro/especialidades");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Saúde Cadastro</span>
        <span>/</span>
        <span>Médico</span>
        <span>/</span>
        <span
          className="hover:text-foreground cursor-pointer"
          onClick={() => navigate("/cadastro/especialidades")}
        >
          Especialidades Médicas
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Nova Especialidade" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/especialidades")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Nova Especialidade" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar nova especialidade médica" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/especialidades")}>
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
              <CardTitle>Dados da Especialidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código Interno *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Ex: 001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoANS">Código ANS</Label>
                  <Input
                    id="codigoANS"
                    value={formData.codigoANS}
                    onChange={(e) => setFormData({ ...formData, codigoANS: e.target.value })}
                    placeholder="Código ANS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoTUSS">Código TUSS</Label>
                  <Input
                    id="codigoTUSS"
                    value={formData.codigoTUSS}
                    onChange={(e) => setFormData({ ...formData, codigoTUSS: e.target.value })}
                    placeholder="Código TUSS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Especialidade *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da especialidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área *</Label>
                  <Select
                    value={formData.area}
                    onValueChange={(value) => setFormData({ ...formData, area: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clínica">Clínica</SelectItem>
                      <SelectItem value="Cirúrgica">Cirúrgica</SelectItem>
                      <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                      <SelectItem value="Laboratorial">Laboratorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da especialidade"
                  rows={4}
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
                rows={3}
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
                <Label htmlFor="ativo">Especialidade Ativa</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rqe">Requer RQE</Label>
                  <p className="text-xs text-muted-foreground">
                    Registro de Qualificação de Especialista
                  </p>
                </div>
                <Switch
                  id="rqe"
                  checked={formData.requerRQE}
                  onCheckedChange={(checked) => setFormData({ ...formData, requerRQE: checked })}
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
                <span className="text-muted-foreground">Profissionais:</span>
                <span>12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

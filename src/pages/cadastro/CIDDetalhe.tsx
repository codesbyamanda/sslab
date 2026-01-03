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

export default function CIDDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "A00",
    descricao: isNew ? "" : "Cólera",
    descricaoCompleta: isNew ? "" : "Cólera devida a Vibrio cholerae 01, biótipo cholerae",
    categoria: isNew ? "" : "Doenças infecciosas e parasitárias",
    subcategoria: isNew ? "" : "Doenças infecciosas intestinais",
    sexoAplicavel: isNew ? "ambos" : "ambos",
    idadeMinima: isNew ? "" : "",
    idadeMaxima: isNew ? "" : "",
    notificacaoObrigatoria: isNew ? false : true,
    observacoes: isNew ? "" : "Doença de notificação compulsória imediata",
    ativo: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "CID cadastrado" : "CID atualizado",
      description: `O código ${formData.codigo} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/cid");
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
          onClick={() => navigate("/cadastro/cid")}
        >
          CID
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo CID" : formData.codigo}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/cid")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo CID" : `CID ${formData.codigo}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo código CID" : formData.descricao}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/cid")}>
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
              <CardTitle>Dados do CID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código CID *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ex: A00"
                    className="font-mono"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="descricao">Descrição Resumida *</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição resumida do CID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricaoCompleta">Descrição Completa</Label>
                <Textarea
                  id="descricaoCompleta"
                  value={formData.descricaoCompleta}
                  onChange={(e) => setFormData({ ...formData, descricaoCompleta: e.target.value })}
                  placeholder="Descrição completa do CID"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doenças infecciosas e parasitárias">
                        Doenças infecciosas e parasitárias (A00-B99)
                      </SelectItem>
                      <SelectItem value="Neoplasias">Neoplasias (C00-D48)</SelectItem>
                      <SelectItem value="Doenças do sangue">
                        Doenças do sangue e órgãos hematopoéticos (D50-D89)
                      </SelectItem>
                      <SelectItem value="Doenças endócrinas">
                        Doenças endócrinas, nutricionais e metabólicas (E00-E90)
                      </SelectItem>
                      <SelectItem value="Transtornos mentais">
                        Transtornos mentais e comportamentais (F00-F99)
                      </SelectItem>
                      <SelectItem value="Doenças do sistema nervoso">
                        Doenças do sistema nervoso (G00-G99)
                      </SelectItem>
                      <SelectItem value="Doenças cardiovasculares">
                        Doenças do aparelho circulatório (I00-I99)
                      </SelectItem>
                      <SelectItem value="Doenças respiratórias">
                        Doenças do aparelho respiratório (J00-J99)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategoria">Subcategoria</Label>
                  <Input
                    id="subcategoria"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                    placeholder="Subcategoria do CID"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restrições de Aplicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sexoAplicavel">Sexo Aplicável</Label>
                  <Select
                    value={formData.sexoAplicavel}
                    onValueChange={(value) => setFormData({ ...formData, sexoAplicavel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambos">Ambos</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMinima">Idade Mínima (anos)</Label>
                  <Input
                    id="idadeMinima"
                    type="number"
                    value={formData.idadeMinima}
                    onChange={(e) => setFormData({ ...formData, idadeMinima: e.target.value })}
                    placeholder="Ex: 0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMaxima">Idade Máxima (anos)</Label>
                  <Input
                    id="idadeMaxima"
                    type="number"
                    value={formData.idadeMaxima}
                    onChange={(e) => setFormData({ ...formData, idadeMaxima: e.target.value })}
                    placeholder="Ex: 120"
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
                placeholder="Observações adicionais sobre o CID"
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
                <Label htmlFor="ativo">CID Ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificacao">Notificação Obrigatória</Label>
                  <p className="text-xs text-muted-foreground">
                    Doença de notificação compulsória
                  </p>
                </div>
                <Switch
                  id="notificacao"
                  checked={formData.notificacaoObrigatoria}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, notificacaoObrigatoria: checked })
                  }
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
                <span className="text-muted-foreground">Versão CID:</span>
                <span>CID-10</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

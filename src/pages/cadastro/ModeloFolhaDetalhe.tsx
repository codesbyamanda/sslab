import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, FileSpreadsheet, Ruler } from "lucide-react";

export default function ModeloFolhaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "FLH001",
    nome: isNew ? "" : "Folha A4 Padrão",
    formato: isNew ? "" : "A4",
    orientacao: isNew ? "" : "Retrato",
    largura: isNew ? "" : "210",
    altura: isNew ? "" : "297",
    margemSuperior: isNew ? "" : "20",
    margemInferior: isNew ? "" : "20",
    margemEsquerda: isNew ? "" : "15",
    margemDireita: isNew ? "" : "15",
    espacamentoLinhas: isNew ? "" : "5",
    fonteNome: isNew ? "" : "Arial",
    fonteTamanho: isNew ? "" : "10",
    observacoes: isNew ? "" : "Modelo padrão para impressão em papel A4",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando modelo de folha:", formData);
    navigate("/cadastro/modelos-folha");
  };

  const handleFormatoChange = (formato: string) => {
    let largura = "";
    let altura = "";
    
    switch (formato) {
      case "A4":
        largura = "210";
        altura = "297";
        break;
      case "Carta":
        largura = "216";
        altura = "279";
        break;
      case "A5":
        largura = "148";
        altura = "210";
        break;
    }
    
    setFormData({ ...formData, formato, largura, altura });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro/modelos-folha">Modelos de Folha</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Modelo" : isEditing ? "Editar Modelo" : "Visualizar Modelo"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/modelos-folha")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Modelo de Folha" : isEditing ? "Editar Modelo" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo modelo" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/modelos-folha/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="dimensoes">Dimensões</TabsTrigger>
            <TabsTrigger value="fonte">Fonte</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Informações do Modelo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      disabled={!isNew && !isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      disabled={!isNew && !isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="formato">Formato *</Label>
                    <Select
                      value={formData.formato}
                      onValueChange={handleFormatoChange}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                        <SelectItem value="A5">A5 (148 x 210 mm)</SelectItem>
                        <SelectItem value="Carta">Carta (216 x 279 mm)</SelectItem>
                        <SelectItem value="Personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orientacao">Orientação *</Label>
                    <Select
                      value={formData.orientacao}
                      onValueChange={(value) => setFormData({ ...formData, orientacao: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a orientação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retrato">Retrato</SelectItem>
                        <SelectItem value="Paisagem">Paisagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    disabled={!isNew && !isEditing}
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                    disabled={!isNew && !isEditing}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dimensoes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Dimensões e Margens (em mm)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="largura">Largura (mm)</Label>
                    <Input
                      id="largura"
                      type="number"
                      value={formData.largura}
                      onChange={(e) => setFormData({ ...formData, largura: e.target.value })}
                      disabled={(!isNew && !isEditing) || formData.formato !== "Personalizado"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (mm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      value={formData.altura}
                      onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                      disabled={(!isNew && !isEditing) || formData.formato !== "Personalizado"}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Margens</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="margemSuperior">Superior</Label>
                      <Input
                        id="margemSuperior"
                        type="number"
                        value={formData.margemSuperior}
                        onChange={(e) => setFormData({ ...formData, margemSuperior: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="margemInferior">Inferior</Label>
                      <Input
                        id="margemInferior"
                        type="number"
                        value={formData.margemInferior}
                        onChange={(e) => setFormData({ ...formData, margemInferior: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="margemEsquerda">Esquerda</Label>
                      <Input
                        id="margemEsquerda"
                        type="number"
                        value={formData.margemEsquerda}
                        onChange={(e) => setFormData({ ...formData, margemEsquerda: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="margemDireita">Direita</Label>
                      <Input
                        id="margemDireita"
                        type="number"
                        value={formData.margemDireita}
                        onChange={(e) => setFormData({ ...formData, margemDireita: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="espacamentoLinhas">Espaçamento entre Linhas (mm)</Label>
                  <Input
                    id="espacamentoLinhas"
                    type="number"
                    value={formData.espacamentoLinhas}
                    onChange={(e) => setFormData({ ...formData, espacamentoLinhas: e.target.value })}
                    disabled={!isNew && !isEditing}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fonte">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Fonte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fonteNome">Fonte</Label>
                    <Select
                      value={formData.fonteNome}
                      onValueChange={(value) => setFormData({ ...formData, fonteNome: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fonteTamanho">Tamanho (pt)</Label>
                    <Input
                      id="fonteTamanho"
                      type="number"
                      value={formData.fonteTamanho}
                      onChange={(e) => setFormData({ ...formData, fonteTamanho: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Pré-visualização</h5>
                  <p 
                    style={{ 
                      fontFamily: formData.fonteNome || 'Arial',
                      fontSize: `${formData.fonteTamanho || 10}pt`
                    }}
                  >
                    Exemplo de texto com a fonte {formData.fonteNome || 'Arial'} em tamanho {formData.fonteTamanho || 10}pt
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/modelos-folha")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

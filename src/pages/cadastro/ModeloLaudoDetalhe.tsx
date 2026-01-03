import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Save, FileText, Plus, Code } from "lucide-react";

const marcadoresMock = [
  { codigo: "[PACIENTE]", descricao: "Nome do paciente" },
  { codigo: "[DATA_NASC]", descricao: "Data de nascimento" },
  { codigo: "[IDADE]", descricao: "Idade do paciente" },
  { codigo: "[SEXO]", descricao: "Sexo do paciente" },
  { codigo: "[REQUISICAO]", descricao: "Número da requisição" },
  { codigo: "[DATA_COLETA]", descricao: "Data da coleta" },
  { codigo: "[MEDICO]", descricao: "Médico solicitante" },
  { codigo: "[CONVENIO]", descricao: "Convênio" },
  { codigo: "[MATERIAL]", descricao: "Material biológico" },
  { codigo: "[METODO]", descricao: "Método utilizado" },
  { codigo: "[PRM:CODIGO]", descricao: "Valor do parâmetro" },
  { codigo: "[REF:CODIGO]", descricao: "Valor de referência" },
];

export default function ModeloLaudoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "MDL001",
    nome: isNew ? "" : "Laudo Padrão",
    tipo: isNew ? "" : "Geral",
    descricao: isNew ? "" : "Modelo padrão para impressão de laudos",
    cabecalho: isNew ? "" : "[LOGO]\n[EMPRESA]\n[ENDERECO]\n[TELEFONE]",
    corpo: isNew ? "" : "Paciente: [PACIENTE]\nData Nasc.: [DATA_NASC]\nIdade: [IDADE]\n\nResultados:\n[RESULTADOS]",
    rodape: isNew ? "" : "[DATA_IMPRESSAO]\n[RESPONSAVEL_TECNICO]",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando modelo:", formData);
    navigate("/cadastro/modelos-laudo");
  };

  const insertMarcador = (marcador: string, field: 'cabecalho' | 'corpo' | 'rodape') => {
    setFormData({
      ...formData,
      [field]: formData[field] + marcador,
    });
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
            <BreadcrumbLink href="/cadastro/modelos-laudo">Modelos de Laudo</BreadcrumbLink>
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/modelos-laudo")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Modelo de Laudo" : isEditing ? "Editar Modelo" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo modelo" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/modelos-laudo/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="layout">Layout do Laudo</TabsTrigger>
            <TabsTrigger value="marcadores">Marcadores</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      disabled={!isNew && !isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Geral">Geral</SelectItem>
                        <SelectItem value="Específico">Específico</SelectItem>
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

          <TabsContent value="layout">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cabeçalho</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.cabecalho}
                    onChange={(e) => setFormData({ ...formData, cabecalho: e.target.value })}
                    disabled={!isNew && !isEditing}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Configure o cabeçalho do laudo..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corpo do Laudo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.corpo}
                    onChange={(e) => setFormData({ ...formData, corpo: e.target.value })}
                    disabled={!isNew && !isEditing}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder="Configure o corpo do laudo..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rodapé</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.rodape}
                    onChange={(e) => setFormData({ ...formData, rodape: e.target.value })}
                    disabled={!isNew && !isEditing}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Configure o rodapé do laudo..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marcadores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Marcadores Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilize os marcadores abaixo para inserir informações dinâmicas no laudo.
                  Clique em um marcador para copiá-lo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {marcadoresMock.map((marcador) => (
                    <div
                      key={marcador.codigo}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(marcador.codigo)}
                    >
                      <div>
                        <Badge variant="outline" className="font-mono">
                          {marcador.codigo}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{marcador.descricao}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/modelos-laudo")}>
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

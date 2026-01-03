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
import { ArrowLeft, Save, Settings2 } from "lucide-react";

export default function ParametroDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "PRM001",
    nome: isNew ? "" : "Hemoglobina",
    tipo: isNew ? "" : "Numérico",
    unidade: isNew ? "" : "g/dL",
    casasDecimais: isNew ? "" : "2",
    valorMinimo: isNew ? "" : "0",
    valorMaximo: isNew ? "" : "25",
    valorCriticoMin: isNew ? "" : "7",
    valorCriticoMax: isNew ? "" : "18",
    valorAbsurdoMin: isNew ? "" : "0",
    valorAbsurdoMax: isNew ? "" : "30",
    formula: "",
    observacoes: isNew ? "" : "Parâmetro para medição de hemoglobina no sangue",
    ativo: true,
    obrigatorio: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando parâmetro:", formData);
    navigate("/cadastro/parametros");
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
            <BreadcrumbLink href="/cadastro/parametros">Parâmetros</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Parâmetro" : isEditing ? "Editar Parâmetro" : "Visualizar Parâmetro"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/parametros")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Parâmetro" : isEditing ? "Editar Parâmetro" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo parâmetro" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/parametros/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="valores">Valores de Referência</TabsTrigger>
            <TabsTrigger value="formula">Fórmula</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Informações Básicas
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectItem value="Texto">Texto</SelectItem>
                        <SelectItem value="Numérico">Numérico</SelectItem>
                        <SelectItem value="Data">Data</SelectItem>
                        <SelectItem value="Fórmula">Fórmula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input
                      id="unidade"
                      value={formData.unidade}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="casasDecimais">Casas Decimais</Label>
                    <Input
                      id="casasDecimais"
                      type="number"
                      value={formData.casasDecimais}
                      onChange={(e) => setFormData({ ...formData, casasDecimais: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
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

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                      disabled={!isNew && !isEditing}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="obrigatorio"
                      checked={formData.obrigatorio}
                      onCheckedChange={(checked) => setFormData({ ...formData, obrigatorio: checked })}
                      disabled={!isNew && !isEditing}
                    />
                    <Label htmlFor="obrigatorio">Obrigatório</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valores">
            <Card>
              <CardHeader>
                <CardTitle>Valores de Referência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorMinimo">Valor Mínimo</Label>
                    <Input
                      id="valorMinimo"
                      type="number"
                      value={formData.valorMinimo}
                      onChange={(e) => setFormData({ ...formData, valorMinimo: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorMaximo">Valor Máximo</Label>
                    <Input
                      id="valorMaximo"
                      type="number"
                      value={formData.valorMaximo}
                      onChange={(e) => setFormData({ ...formData, valorMaximo: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Valores Críticos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorCriticoMin">Crítico Mínimo</Label>
                      <Input
                        id="valorCriticoMin"
                        type="number"
                        value={formData.valorCriticoMin}
                        onChange={(e) => setFormData({ ...formData, valorCriticoMin: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorCriticoMax">Crítico Máximo</Label>
                      <Input
                        id="valorCriticoMax"
                        type="number"
                        value={formData.valorCriticoMax}
                        onChange={(e) => setFormData({ ...formData, valorCriticoMax: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Valores Absurdos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorAbsurdoMin">Absurdo Mínimo</Label>
                      <Input
                        id="valorAbsurdoMin"
                        type="number"
                        value={formData.valorAbsurdoMin}
                        onChange={(e) => setFormData({ ...formData, valorAbsurdoMin: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorAbsurdoMax">Absurdo Máximo</Label>
                      <Input
                        id="valorAbsurdoMax"
                        type="number"
                        value={formData.valorAbsurdoMax}
                        onChange={(e) => setFormData({ ...formData, valorAbsurdoMax: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formula">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Fórmula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure a fórmula de cálculo quando o tipo do parâmetro for "Fórmula".
                  Use os marcadores para referenciar outros parâmetros.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="formula">Fórmula</Label>
                  <Textarea
                    id="formula"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    disabled={!isNew && !isEditing}
                    placeholder="Ex: [PESO] / ([ALTURA] * [ALTURA])"
                    rows={4}
                  />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Marcadores disponíveis:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>[PARAM_CODIGO] - Referência a outro parâmetro</li>
                    <li>Operadores: +, -, *, /, (, )</li>
                    <li>Funções: ABS(), SQRT(), POW()</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/parametros")}>
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

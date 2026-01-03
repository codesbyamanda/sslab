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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, LayoutList, Plus, Trash2, GripVertical } from "lucide-react";

const parametrosMock = [
  { id: 1, codigo: "PRM001", nome: "Hemácias", ordem: 1, obrigatorio: true },
  { id: 2, codigo: "PRM002", nome: "Hemoglobina", ordem: 2, obrigatorio: true },
  { id: 3, codigo: "PRM003", nome: "Hematócrito", ordem: 3, obrigatorio: true },
  { id: 4, codigo: "PRM004", nome: "VCM", ordem: 4, obrigatorio: false },
  { id: 5, codigo: "PRM005", nome: "HCM", ordem: 5, obrigatorio: false },
];

const valoresReferenciaMock = [
  { id: 1, sexo: "Masculino", idadeMin: 0, idadeMax: 12, valorMin: 4.0, valorMax: 5.5, parametro: "Hemácias" },
  { id: 2, sexo: "Masculino", idadeMin: 13, idadeMax: 999, valorMin: 4.5, valorMax: 6.0, parametro: "Hemácias" },
  { id: 3, sexo: "Feminino", idadeMin: 0, idadeMax: 12, valorMin: 4.0, valorMax: 5.5, parametro: "Hemácias" },
  { id: 4, sexo: "Feminino", idadeMin: 13, idadeMax: 999, valorMin: 4.0, valorMax: 5.5, parametro: "Hemácias" },
];

export default function RotinaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "ROT001",
    nome: isNew ? "" : "Hemograma Completo",
    setor: isNew ? "" : "Hematologia",
    metodo: isNew ? "" : "MTD001",
    material: isNew ? "" : "Sangue Total",
    observacoes: isNew ? "" : "Rotina completa de hemograma com contagem diferencial",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando rotina:", formData);
    navigate("/cadastro/rotinas");
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
            <BreadcrumbLink href="/cadastro/rotinas">Rotinas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Nova Rotina" : isEditing ? "Editar Rotina" : "Visualizar Rotina"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/rotinas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Nova Rotina" : isEditing ? "Editar Rotina" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da nova rotina" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/rotinas/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
            <TabsTrigger value="referencias">Valores de Referência</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutList className="h-5 w-5" />
                  Informações da Rotina
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
                    <Label htmlFor="setor">Setor</Label>
                    <Select
                      value={formData.setor}
                      onValueChange={(value) => setFormData({ ...formData, setor: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hematologia">Hematologia</SelectItem>
                        <SelectItem value="Bioquímica">Bioquímica</SelectItem>
                        <SelectItem value="Uroanálise">Uroanálise</SelectItem>
                        <SelectItem value="Hormônios">Hormônios</SelectItem>
                        <SelectItem value="Microbiologia">Microbiologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metodo">Método</Label>
                    <Select
                      value={formData.metodo}
                      onValueChange={(value) => setFormData({ ...formData, metodo: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MTD001">Espectrofotometria</SelectItem>
                        <SelectItem value="MTD002">Cromatografia Líquida</SelectItem>
                        <SelectItem value="MTD003">Imunoensaio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
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

          <TabsContent value="parametros">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Parâmetros da Rotina</CardTitle>
                {(isNew || isEditing) && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Parâmetro
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Obrigatório</TableHead>
                      {(isNew || isEditing) && <TableHead className="w-12"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parametrosMock.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell>
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        </TableCell>
                        <TableCell>{param.ordem}</TableCell>
                        <TableCell className="font-medium">{param.codigo}</TableCell>
                        <TableCell>{param.nome}</TableCell>
                        <TableCell>
                          <Badge variant={param.obrigatorio ? "default" : "outline"}>
                            {param.obrigatorio ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                        {(isNew || isEditing) && (
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referencias">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Valores de Referência</CardTitle>
                {(isNew || isEditing) && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Referência
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parâmetro</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Idade Mín.</TableHead>
                      <TableHead>Idade Máx.</TableHead>
                      <TableHead>Valor Mín.</TableHead>
                      <TableHead>Valor Máx.</TableHead>
                      {(isNew || isEditing) && <TableHead className="w-12"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {valoresReferenciaMock.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-medium">{ref.parametro}</TableCell>
                        <TableCell>{ref.sexo}</TableCell>
                        <TableCell>{ref.idadeMin} anos</TableCell>
                        <TableCell>{ref.idadeMax === 999 ? "+" : `${ref.idadeMax} anos`}</TableCell>
                        <TableCell>{ref.valorMin}</TableCell>
                        <TableCell>{ref.valorMax}</TableCell>
                        {(isNew || isEditing) && (
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/rotinas")}>
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

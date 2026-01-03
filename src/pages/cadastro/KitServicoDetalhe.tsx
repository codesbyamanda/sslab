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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockExamesKit = [
  { id: 1, codigo: "HMG", nome: "Hemograma Completo", preco: 25.00 },
  { id: 2, codigo: "GLI", nome: "Glicemia em Jejum", preco: 12.00 },
  { id: 3, codigo: "COL", nome: "Colesterol Total", preco: 15.00 },
  { id: 4, codigo: "TRI", nome: "Triglicerídeos", preco: 15.00 },
  { id: 5, codigo: "HDL", nome: "HDL Colesterol", preco: 15.00 },
  { id: 6, codigo: "UR1", nome: "Urina Tipo I", preco: 18.00 },
  { id: 7, codigo: "CRE", nome: "Creatinina", preco: 12.00 },
  { id: 8, codigo: "URE", nome: "Ureia", preco: 12.00 },
];

export default function KitServicoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "CHK-01",
    nome: isNew ? "" : "Check-up Básico",
    descricao: isNew ? "" : "Pacote básico de exames para avaliação geral de saúde",
    prazo: isNew ? "" : "24 Horas",
    precoKit: isNew ? "" : "180.00",
    tipoDesconto: isNew ? "percentual" : "percentual",
    desconto: isNew ? "" : "15",
    orientacoes: isNew ? "" : "Jejum de 8-12 horas para coleta dos exames bioquímicos",
    observacoes: isNew ? "" : "",
    ativo: true,
    disponivel: true,
  });

  const [examesKit, setExamesKit] = useState(isNew ? [] : mockExamesKit);

  const handleSave = () => {
    toast({
      title: isNew ? "Kit cadastrado" : "Kit atualizado",
      description: `O kit ${formData.nome} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/kits-servico");
  };

  const handleRemoveExame = (exameId: number) => {
    setExamesKit(examesKit.filter((e) => e.id !== exameId));
    toast({
      title: "Exame removido",
      description: "O exame foi removido do kit.",
    });
  };

  const totalExames = examesKit.reduce((sum, e) => sum + e.preco, 0);

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
          onClick={() => navigate("/cadastro/kits-servico")}
        >
          Kits de Serviço
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo Kit" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/kits-servico")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Kit de Serviço" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo pacote de exames" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/kits-servico")}>
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
              <CardTitle>Dados do Kit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="CHK-01"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome do Kit *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do kit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do kit"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo de Entrega</Label>
                  <Select
                    value={formData.prazo}
                    onValueChange={(value) => setFormData({ ...formData, prazo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24 Horas">24 Horas</SelectItem>
                      <SelectItem value="48 Horas">48 Horas</SelectItem>
                      <SelectItem value="72 Horas">72 Horas</SelectItem>
                      <SelectItem value="5 Dias">5 Dias Úteis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precoKit">Preço do Kit (R$)</Label>
                  <Input
                    id="precoKit"
                    type="number"
                    step="0.01"
                    value={formData.precoKit}
                    onChange={(e) => setFormData({ ...formData, precoKit: e.target.value })}
                    placeholder="180.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
                  <Select
                    value={formData.tipoDesconto}
                    onValueChange={(value) => setFormData({ ...formData, tipoDesconto: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="valor">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desconto">Desconto</Label>
                  <Input
                    id="desconto"
                    type="number"
                    value={formData.desconto}
                    onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                    placeholder="15"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exames do Kit</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Exame
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço Unit.</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examesKit.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell className="font-mono">{exame.codigo}</TableCell>
                      <TableCell>{exame.nome}</TableCell>
                      <TableCell>R$ {exame.preco.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExame(exame.id)}
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {examesKit.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Nenhum exame adicionado ao kit
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {examesKit.length > 0 && (
                <div className="flex justify-end mt-4 pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Soma dos exames:</p>
                    <p className="text-lg font-bold">R$ {totalExames.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orientações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orientacoes">Orientações ao Paciente</Label>
                <Textarea
                  id="orientacoes"
                  value={formData.orientacoes}
                  onChange={(e) => setFormData({ ...formData, orientacoes: e.target.value })}
                  placeholder="Orientações para preparo dos exames"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Internas</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações internas"
                  rows={3}
                />
              </div>
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
                <Label htmlFor="ativo">Kit Ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="disponivel">Disponível Online</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir para agendamento
                  </p>
                </div>
                <Switch
                  id="disponivel"
                  checked={formData.disponivel}
                  onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo de Preços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Soma dos exames:</span>
                <span>R$ {totalExames.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Desconto:</span>
                <span className="text-green-600">
                  {formData.tipoDesconto === "percentual" ? `${formData.desconto}%` : `R$ ${formData.desconto}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Preço final:</span>
                <span className="font-bold text-lg">R$ {formData.precoKit || "0.00"}</span>
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
                <span className="text-muted-foreground">Vendidos este mês:</span>
                <span>45</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

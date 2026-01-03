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
import { ArrowLeft, Save, CreditCard, Plus, Trash2 } from "lucide-react";

const bandeirasMock = [
  { id: 1, bandeira: "Visa", taxaDebito: "1.39", taxaCredito: "2.49", taxaParcelado: "3.49" },
  { id: 2, bandeira: "Mastercard", taxaDebito: "1.39", taxaCredito: "2.49", taxaParcelado: "3.49" },
  { id: 3, bandeira: "Elo", taxaDebito: "1.49", taxaCredito: "2.59", taxaParcelado: "3.59" },
  { id: 4, bandeira: "American Express", taxaDebito: "-", taxaCredito: "3.19", taxaParcelado: "4.19" },
];

export default function AdquirenteCartaoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "ADQ001",
    nome: isNew ? "" : "Cielo",
    cnpj: isNew ? "" : "01.027.058/0001-91",
    contaCorrente: isNew ? "" : "CC001",
    taxaDebitoGeral: isNew ? "" : "1.39",
    taxaCreditoGeral: isNew ? "" : "2.49",
    taxaParceladoGeral: isNew ? "" : "3.49",
    prazoRepasseDebito: isNew ? "" : "1",
    prazoRepasseCredito: isNew ? "" : "30",
    prazoRepasseParcelado: isNew ? "" : "30",
    taxaAntecipacao: isNew ? "" : "2.99",
    observacoes: isNew ? "" : "Adquirente principal para operações com cartão",
    ativo: true,
    antecipacaoAutomatica: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando adquirente:", formData);
    navigate("/cadastro/adquirentes-cartao");
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
            <BreadcrumbLink href="/cadastro/adquirentes-cartao">Adquirentes de Cartão</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Adquirente" : isEditing ? "Editar Adquirente" : "Visualizar Adquirente"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/adquirentes-cartao")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Adquirente" : isEditing ? "Editar Adquirente" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo adquirente" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/adquirentes-cartao/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="taxas">Taxas Gerais</TabsTrigger>
            <TabsTrigger value="bandeiras">Taxas por Bandeira</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informações do Adquirente
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
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      disabled={!isNew && !isEditing}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contaCorrente">Conta Corrente para Repasse</Label>
                    <Select
                      value={formData.contaCorrente}
                      onValueChange={(value) => setFormData({ ...formData, contaCorrente: value })}
                      disabled={!isNew && !isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC001">Banco do Brasil - 12345-6</SelectItem>
                        <SelectItem value="CC002">Itaú - 98765-4</SelectItem>
                        <SelectItem value="CC003">Bradesco - 55555-5</SelectItem>
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
                      id="antecipacaoAutomatica"
                      checked={formData.antecipacaoAutomatica}
                      onCheckedChange={(checked) => setFormData({ ...formData, antecipacaoAutomatica: checked })}
                      disabled={!isNew && !isEditing}
                    />
                    <Label htmlFor="antecipacaoAutomatica">Antecipação Automática</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxas">
            <Card>
              <CardHeader>
                <CardTitle>Taxas e Prazos Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxaDebitoGeral">Taxa Débito (%)</Label>
                    <Input
                      id="taxaDebitoGeral"
                      type="number"
                      step="0.01"
                      value={formData.taxaDebitoGeral}
                      onChange={(e) => setFormData({ ...formData, taxaDebitoGeral: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxaCreditoGeral">Taxa Crédito à Vista (%)</Label>
                    <Input
                      id="taxaCreditoGeral"
                      type="number"
                      step="0.01"
                      value={formData.taxaCreditoGeral}
                      onChange={(e) => setFormData({ ...formData, taxaCreditoGeral: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxaParceladoGeral">Taxa Crédito Parcelado (%)</Label>
                    <Input
                      id="taxaParceladoGeral"
                      type="number"
                      step="0.01"
                      value={formData.taxaParceladoGeral}
                      onChange={(e) => setFormData({ ...formData, taxaParceladoGeral: e.target.value })}
                      disabled={!isNew && !isEditing}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Prazos de Repasse (em dias)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prazoRepasseDebito">Débito</Label>
                      <Input
                        id="prazoRepasseDebito"
                        type="number"
                        value={formData.prazoRepasseDebito}
                        onChange={(e) => setFormData({ ...formData, prazoRepasseDebito: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prazoRepasseCredito">Crédito à Vista</Label>
                      <Input
                        id="prazoRepasseCredito"
                        type="number"
                        value={formData.prazoRepasseCredito}
                        onChange={(e) => setFormData({ ...formData, prazoRepasseCredito: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prazoRepasseParcelado">Crédito Parcelado</Label>
                      <Input
                        id="prazoRepasseParcelado"
                        type="number"
                        value={formData.prazoRepasseParcelado}
                        onChange={(e) => setFormData({ ...formData, prazoRepasseParcelado: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Antecipação</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxaAntecipacao">Taxa de Antecipação (%)</Label>
                      <Input
                        id="taxaAntecipacao"
                        type="number"
                        step="0.01"
                        value={formData.taxaAntecipacao}
                        onChange={(e) => setFormData({ ...formData, taxaAntecipacao: e.target.value })}
                        disabled={!isNew && !isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bandeiras">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Taxas por Bandeira</CardTitle>
                {(isNew || isEditing) && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Bandeira
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bandeira</TableHead>
                      <TableHead className="text-center">Taxa Débito (%)</TableHead>
                      <TableHead className="text-center">Taxa Crédito (%)</TableHead>
                      <TableHead className="text-center">Taxa Parcelado (%)</TableHead>
                      {(isNew || isEditing) && <TableHead className="w-12"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bandeirasMock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.bandeira}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.taxaDebito}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.taxaCredito}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.taxaParcelado}</Badge>
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
        </Tabs>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/adquirentes-cartao")}>
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

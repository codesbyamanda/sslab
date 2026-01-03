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
import { ArrowLeft, Save, TrendingDown } from "lucide-react";

export default function TipoContaPagarDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "CPG001",
    nome: isNew ? "" : "Fornecedores",
    categoria: isNew ? "" : "Operacional",
    contaContabil: isNew ? "" : "2.1.1.01",
    centroCusto: isNew ? "" : "CC001",
    formaPagamentoPadrao: isNew ? "" : "Boleto",
    prazoMedioPagamento: isNew ? "" : "30",
    descricao: isNew ? "" : "Pagamentos a fornecedores de materiais e insumos",
    ativo: true,
    exigeAprovacao: true,
    dedutivel: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando tipo de conta a pagar:", formData);
    navigate("/cadastro/tipos-conta-pagar");
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
            <BreadcrumbLink href="/cadastro/tipos-conta-pagar">Tipos de Contas a Pagar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Tipo" : isEditing ? "Editar Tipo" : "Visualizar Tipo"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/tipos-conta-pagar")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Tipo de Conta a Pagar" : isEditing ? "Editar Tipo" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo tipo" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {!isNew && !isEditing && (
          <Button onClick={() => navigate(`/cadastro/tipos-conta-pagar/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Informações do Tipo de Conta a Pagar
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
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  disabled={!isNew && !isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                    <SelectItem value="Fixo">Fixo</SelectItem>
                    <SelectItem value="Utilidades">Utilidades</SelectItem>
                    <SelectItem value="Tributos">Tributos</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contaContabil">Conta Contábil</Label>
                <Input
                  id="contaContabil"
                  value={formData.contaContabil}
                  onChange={(e) => setFormData({ ...formData, contaContabil: e.target.value })}
                  disabled={!isNew && !isEditing}
                  placeholder="Ex: 2.1.1.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="centroCusto">Centro de Custo</Label>
                <Input
                  id="centroCusto"
                  value={formData.centroCusto}
                  onChange={(e) => setFormData({ ...formData, centroCusto: e.target.value })}
                  disabled={!isNew && !isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formaPagamentoPadrao">Forma de Pagamento Padrão</Label>
                <Select
                  value={formData.formaPagamentoPadrao}
                  onValueChange={(value) => setFormData({ ...formData, formaPagamentoPadrao: value })}
                  disabled={!isNew && !isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boleto">Boleto</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prazoMedioPagamento">Prazo Médio (dias)</Label>
                <Input
                  id="prazoMedioPagamento"
                  type="number"
                  value={formData.prazoMedioPagamento}
                  onChange={(e) => setFormData({ ...formData, prazoMedioPagamento: e.target.value })}
                  disabled={!isNew && !isEditing}
                />
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
                  id="exigeAprovacao"
                  checked={formData.exigeAprovacao}
                  onCheckedChange={(checked) => setFormData({ ...formData, exigeAprovacao: checked })}
                  disabled={!isNew && !isEditing}
                />
                <Label htmlFor="exigeAprovacao">Exige Aprovação</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="dedutivel"
                  checked={formData.dedutivel}
                  onCheckedChange={(checked) => setFormData({ ...formData, dedutivel: checked })}
                  disabled={!isNew && !isEditing}
                />
                <Label htmlFor="dedutivel">Dedutível</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {(isNew || isEditing) && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/tipos-conta-pagar")}>
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

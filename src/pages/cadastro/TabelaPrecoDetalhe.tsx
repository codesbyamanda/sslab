import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Save, TableProperties } from "lucide-react";
import { toast } from "sonner";

export default function TabelaPrecoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "TAB001",
    descricao: isNew ? "" : "Tabela Padrão Particular",
    moeda: isNew ? "" : "BRL",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Tabela de preço criada com sucesso" : "Tabela de preço atualizada com sucesso");
    navigate("/cadastro/tabelas-preco");
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
            <BreadcrumbLink href="/cadastro/tabelas-preco">Tabelas de Preço</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Nova Tabela" : isEditing ? "Editar Tabela" : "Visualizar Tabela"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/tabelas-preco")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Nova Tabela de Preço" : isEditing ? "Editar Tabela" : formData.descricao}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da nova tabela" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/tabelas-preco/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableProperties className="h-5 w-5" />
              Dados da Tabela de Preço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Tabela</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  disabled={isViewMode}
                  placeholder="Ex: TAB001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Tabela *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="Digite a descrição"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moeda">Moeda</Label>
                <Select
                  value={formData.moeda}
                  onValueChange={(value) => setFormData({ ...formData, moeda: value })}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                disabled={isViewMode}
              />
              <Label htmlFor="ativo">Status Ativo</Label>
            </div>

            {!isNew && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Após salvar, você poderá cadastrar os itens da tabela acessando a opção "Gerenciar Itens" na listagem.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/tabelas-preco")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Tabela
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

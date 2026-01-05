import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Save, Coins } from "lucide-react";
import { toast } from "sonner";

export default function MoedaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "BRL",
    descricao: isNew ? "" : "Real Brasileiro",
    simbolo: isNew ? "" : "R$",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo.trim() || !formData.descricao.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Moeda criada com sucesso" : "Moeda atualizada com sucesso");
    navigate("/cadastro/unidade-monetaria");
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
            <BreadcrumbLink href="/cadastro/unidade-monetaria">Unidade Monetária</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Nova Moeda" : isEditing ? "Editar Moeda" : "Visualizar Moeda"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/unidade-monetaria")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Nova Moeda" : isEditing ? "Editar Moeda" : formData.descricao}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da nova moeda" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/unidade-monetaria/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Dados da Moeda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Moeda *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                  disabled={isViewMode}
                  required
                  placeholder="Ex: BRL, USD"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
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
                <Label htmlFor="simbolo">Símbolo</Label>
                <Input
                  id="simbolo"
                  value={formData.simbolo}
                  onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
                  disabled={isViewMode}
                  placeholder="Ex: R$, $, €"
                  maxLength={5}
                />
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
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/unidade-monetaria")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Moeda
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

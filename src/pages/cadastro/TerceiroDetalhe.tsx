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
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function TerceiroDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "TER001",
    nome: isNew ? "" : "Laboratório Apoio SP",
    cnpj: isNew ? "" : "12.345.678/0001-00",
    retencaoIR: isNew ? "" : "1.5",
    retencaoISS: isNew ? "" : "5",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Terceiro criado com sucesso" : "Terceiro atualizado com sucesso");
    navigate("/cadastro/terceiros");
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
            <BreadcrumbLink href="/cadastro/terceiros">Terceiros</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Terceiro" : isEditing ? "Editar Terceiro" : "Visualizar Terceiro"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/terceiros")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Terceiro" : isEditing ? "Editar Terceiro" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo terceiro" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/terceiros/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Dados do Terceiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  disabled={isViewMode}
                  placeholder="Ex: TER001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Terceiro *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="Digite o nome"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  disabled={isViewMode}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retencaoIR">Retenção IR (%)</Label>
                <Input
                  id="retencaoIR"
                  type="number"
                  step="0.01"
                  value={formData.retencaoIR}
                  onChange={(e) => setFormData({ ...formData, retencaoIR: e.target.value })}
                  disabled={isViewMode}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retencaoISS">Retenção ISS (%)</Label>
                <Input
                  id="retencaoISS"
                  type="number"
                  step="0.01"
                  value={formData.retencaoISS}
                  onChange={(e) => setFormData({ ...formData, retencaoISS: e.target.value })}
                  disabled={isViewMode}
                  placeholder="0.00"
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
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/terceiros")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Terceiro
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

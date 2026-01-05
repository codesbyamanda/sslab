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
import { ArrowLeft, Save, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function FeriadoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    data: isNew ? "" : "2024-01-01",
    descricao: isNew ? "" : "Confraternização Universal",
    tipo: isNew ? "" : "Nacional",
    impactaPrazo: true,
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data.trim() || !formData.descricao.trim() || !formData.tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Feriado criado com sucesso" : "Feriado atualizado com sucesso");
    navigate("/cadastro/feriados");
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
            <BreadcrumbLink href="/cadastro/feriados">Feriados</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Feriado" : isEditing ? "Editar Feriado" : "Visualizar Feriado"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/feriados")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Feriado" : isEditing ? "Editar Feriado" : formData.descricao}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo feriado" : `Data: ${new Date(formData.data).toLocaleDateString("pt-BR")}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/feriados/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dados do Feriado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  disabled={isViewMode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Feriado *</Label>
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
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                    <SelectItem value="Estadual">Estadual</SelectItem>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="impactaPrazo"
                  checked={formData.impactaPrazo}
                  onCheckedChange={(checked) => setFormData({ ...formData, impactaPrazo: checked })}
                  disabled={isViewMode}
                />
                <Label htmlFor="impactaPrazo">Impacta Prazo</Label>
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
            </div>
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/feriados")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Feriado
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

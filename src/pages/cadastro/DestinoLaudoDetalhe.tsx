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
import { ArrowLeft, Save, FileOutput } from "lucide-react";
import { toast } from "sonner";

export default function DestinoLaudoDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "DES001",
    descricao: isNew ? "" : "Impressão Local",
    tipo: isNew ? "" : "Impressão",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao.trim() || !formData.tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Destino de laudo criado com sucesso" : "Destino de laudo atualizado com sucesso");
    navigate("/cadastro/destino-laudo");
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
            <BreadcrumbLink href="/cadastro/destino-laudo">Destino de Laudo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Destino" : isEditing ? "Editar Destino" : "Visualizar Destino"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/destino-laudo")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Destino de Laudo" : isEditing ? "Editar Destino" : formData.descricao}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo destino" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/destino-laudo/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileOutput className="h-5 w-5" />
              Dados do Destino
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  disabled={isViewMode}
                  placeholder="Ex: DES001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Destino *</Label>
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
                    <SelectItem value="Impressão">Impressão</SelectItem>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
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
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/destino-laudo")}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Destino
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

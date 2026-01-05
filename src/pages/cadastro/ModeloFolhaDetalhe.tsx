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
import { ArrowLeft, Save, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ModeloFolhaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id !== "novo" && searchParams.get("edit") === "true";
  const isNew = id === "novo";
  const isViewMode = !isNew && !isEditing;

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "FLH001",
    nome: isNew ? "" : "Folha A4 Padrão",
    conteudo: isNew ? "" : `[CABEÇALHO]
Logo: {LOGO_EMPRESA}
Nome: {NOME_EMPRESA}
Endereço: {ENDERECO_EMPRESA}

[CORPO]
Paciente: {NOME_PACIENTE}
Data Nascimento: {DATA_NASCIMENTO}
Prontuário: {NUMERO_PRONTUARIO}

[RESULTADOS]
{LISTA_EXAMES}

[RODAPÉ]
Responsável Técnico: {RESPONSAVEL_TECNICO}
CRM: {CRM_RESPONSAVEL}
Data de Impressão: {DATA_IMPRESSAO}`,
    observacoes: isNew ? "" : "Modelo padrão para impressão de laudos em papel A4",
    ativo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo.trim() || !formData.nome.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success(isNew ? "Modelo de folha criado com sucesso" : "Modelo de folha atualizado com sucesso");
    navigate("/cadastro/modelos-folha");
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
            <BreadcrumbLink href="/cadastro/modelos-folha">Modelos de Folha</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNew ? "Novo Modelo de Folha" : isEditing ? "Editar Modelo de Folha" : "Visualizar Modelo de Folha"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/modelos-folha")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Modelo de Folha" : isEditing ? "Editar Modelo de Folha" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados do novo modelo de folha" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        {isViewMode && (
          <Button onClick={() => navigate(`/cadastro/modelos-folha/${id}?edit=true`)}>
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados do Modelo de Folha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="Ex: FLH001"
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="nome">Nome do Modelo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={isViewMode}
                  required
                  placeholder="Digite o nome do modelo de folha"
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

            <div className="space-y-2">
              <Label htmlFor="conteudo">Editor de Conteúdo da Folha (Layout textual/estrutural)</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                disabled={isViewMode}
                rows={12}
                className="font-mono text-sm"
                placeholder="Digite o layout estrutural da folha de laudo..."
              />
              <p className="text-xs text-muted-foreground">
                Use variáveis entre chaves para campos dinâmicos. Ex: {"{NOME_PACIENTE}"}, {"{DATA_EXAME}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                disabled={isViewMode}
                rows={3}
                placeholder="Observações adicionais sobre este modelo de folha"
              />
            </div>
          </CardContent>
        </Card>

        {!isViewMode && (
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate("/cadastro/modelos-folha")}>
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

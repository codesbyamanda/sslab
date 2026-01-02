import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Users, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function PessoaDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "PES001",
    nome: isNew ? "" : "João Silva Santos",
    cpf: isNew ? "" : "123.456.789-00",
    rg: isNew ? "" : "12.345.678-9",
    dataNascimento: isNew ? "" : "1985-05-15",
    sexo: isNew ? "" : "M",
    estadoCivil: isNew ? "" : "casado",
    profissao: isNew ? "" : "1",
    endereco: isNew ? "" : "Rua das Flores, 100",
    bairro: isNew ? "" : "Centro",
    cidade: isNew ? "" : "São Paulo",
    uf: isNew ? "" : "SP",
    cep: isNew ? "" : "01310-100",
    telefone: isNew ? "" : "(11) 99999-8888",
    email: isNew ? "" : "joao@email.com",
    usuario: isNew ? "" : "joao.silva",
    perfilAcesso: isNew ? "" : "1",
    observacoes: isNew ? "" : "",
    ativo: true,
  });

  const handleSave = () => {
    toast.success(isNew ? "Pessoa cadastrada com sucesso!" : "Pessoa atualizada com sucesso!");
    navigate("/cadastro/pessoas");
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/cadastro/pessoas">Pessoas</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{isNew ? "Nova Pessoa" : "Editar Pessoa"}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/pessoas")}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isNew ? "Nova Pessoa" : "Editar Pessoa"}
            </h1>
            <p className="text-muted-foreground">{isNew ? "Preencha os dados" : `Editando: ${formData.nome}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/pessoas")}>Cancelar</Button>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
        </div>
      </div>

      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="endereco">Endereço e Contato</TabsTrigger>
          <TabsTrigger value="acesso">Acesso ao Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card>
            <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Código</Label>
                  <Input value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} />
                </div>
                <div className="md:col-span-3">
                  <Label>Nome Completo *</Label>
                  <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>CPF</Label>
                  <Input value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
                </div>
                <div>
                  <Label>RG</Label>
                  <Input value={formData.rg} onChange={(e) => setFormData({ ...formData, rg: e.target.value })} />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={formData.dataNascimento} onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })} />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select value={formData.sexo} onValueChange={(v) => setFormData({ ...formData, sexo: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Estado Civil</Label>
                  <Select value={formData.estadoCivil} onValueChange={(v) => setFormData({ ...formData, estadoCivil: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profissão</Label>
                  <Select value={formData.profissao} onValueChange={(v) => setFormData({ ...formData, profissao: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Engenheiro</SelectItem>
                      <SelectItem value="2">Professor</SelectItem>
                      <SelectItem value="3">Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">Pessoa Ativa</p>
                  <p className="text-sm text-muted-foreground">Pessoas inativas não aparecem nas seleções</p>
                </div>
                <Switch checked={formData.ativo} onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endereco">
          <Card>
            <CardHeader><CardTitle>Endereço e Contato</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label>Endereço</Label>
                  <Input value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
                </div>
                <div>
                  <Label>CEP</Label>
                  <Input value={formData.cep} onChange={(e) => setFormData({ ...formData, cep: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Bairro</Label>
                  <Input value={formData.bairro} onChange={(e) => setFormData({ ...formData, bairro: e.target.value })} />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input value={formData.cidade} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} />
                </div>
                <div>
                  <Label>UF</Label>
                  <Input value={formData.uf} onChange={(e) => setFormData({ ...formData, uf: e.target.value })} maxLength={2} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acesso">
          <Card>
            <CardHeader><CardTitle>Acesso ao Sistema</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Usuário de Acesso</Label>
                  <Input value={formData.usuario} onChange={(e) => setFormData({ ...formData, usuario: e.target.value })} placeholder="nome.usuario" />
                </div>
                <div>
                  <Label>Perfil de Acesso</Label>
                  <Select value={formData.perfilAcesso} onValueChange={(v) => setFormData({ ...formData, perfilAcesso: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Atendente</SelectItem>
                      <SelectItem value="3">Técnico</SelectItem>
                      <SelectItem value="4">Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                O perfil de acesso define as permissões do usuário no sistema. Configure os perfis em Segurança → Controle de Acesso.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

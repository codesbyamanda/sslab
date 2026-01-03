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
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ServicoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    codigo: isNew ? "" : "HMG",
    nome: isNew ? "" : "Hemograma Completo",
    mnemônico: isNew ? "" : "HEMOGRAMA",
    bancada: isNew ? "" : "Hematologia",
    material: isNew ? "" : "Sangue",
    conservante: isNew ? "" : "EDTA K2",
    recipiente: isNew ? "" : "Tubo Roxo",
    prazo: isNew ? "" : "24 Horas",
    volumeMinimo: isNew ? "" : "3",
    preco: isNew ? "" : "25.00",
    codigoTUSS: isNew ? "" : "40304361",
    codigoAMB: isNew ? "" : "4.03.04.36-1",
    sexo: isNew ? "ambos" : "ambos",
    idadeMinima: isNew ? "" : "",
    idadeMaxima: isNew ? "" : "",
    jejum: isNew ? false : false,
    orientacoes: isNew ? "" : "Não necessita jejum. Evitar atividade física intensa 24h antes.",
    observacoes: isNew ? "" : "",
    ativo: true,
    disponivel: true,
  });

  const handleSave = () => {
    toast({
      title: isNew ? "Serviço cadastrado" : "Serviço atualizado",
      description: `O serviço ${formData.nome} foi ${isNew ? "cadastrado" : "atualizado"} com sucesso.`,
    });
    navigate("/cadastro/servicos");
  };

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
          onClick={() => navigate("/cadastro/servicos")}
        >
          Serviços
        </span>
        <span>/</span>
        <span className="text-foreground font-medium">
          {isNew ? "Novo Serviço" : formData.nome}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/cadastro/servicos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Novo Serviço" : formData.nome}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Cadastrar novo exame ou serviço" : `Código: ${formData.codigo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/cadastro/servicos")}>
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
              <CardTitle>Dados do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="HMG"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mnemônico">Mnemônico</Label>
                  <Input
                    id="mnemônico"
                    value={formData.mnemônico}
                    onChange={(e) => setFormData({ ...formData, mnemônico: e.target.value.toUpperCase() })}
                    placeholder="HEMOGRAMA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="25.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do serviço"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoTUSS">Código TUSS</Label>
                  <Input
                    id="codigoTUSS"
                    value={formData.codigoTUSS}
                    onChange={(e) => setFormData({ ...formData, codigoTUSS: e.target.value })}
                    placeholder="40304361"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoAMB">Código AMB</Label>
                  <Input
                    id="codigoAMB"
                    value={formData.codigoAMB}
                    onChange={(e) => setFormData({ ...formData, codigoAMB: e.target.value })}
                    placeholder="4.03.04.36-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coleta e Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bancada">Bancada *</Label>
                  <Select
                    value={formData.bancada}
                    onValueChange={(value) => setFormData({ ...formData, bancada: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a bancada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hematologia">Hematologia</SelectItem>
                      <SelectItem value="Bioquímica">Bioquímica</SelectItem>
                      <SelectItem value="Imunologia">Imunologia</SelectItem>
                      <SelectItem value="Hormônios">Hormônios</SelectItem>
                      <SelectItem value="Urinálise">Urinálise</SelectItem>
                      <SelectItem value="Microbiologia">Microbiologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo de Entrega</Label>
                  <Select
                    value={formData.prazo}
                    onValueChange={(value) => setFormData({ ...formData, prazo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgente">Urgente (2h)</SelectItem>
                      <SelectItem value="Mesmo Dia">Mesmo Dia</SelectItem>
                      <SelectItem value="24 Horas">24 Horas</SelectItem>
                      <SelectItem value="48 Horas">48 Horas</SelectItem>
                      <SelectItem value="72 Horas">72 Horas</SelectItem>
                      <SelectItem value="5 Dias">5 Dias Úteis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sangue">Sangue</SelectItem>
                      <SelectItem value="Soro">Soro</SelectItem>
                      <SelectItem value="Plasma">Plasma</SelectItem>
                      <SelectItem value="Urina">Urina</SelectItem>
                      <SelectItem value="Fezes">Fezes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conservante">Conservante</Label>
                  <Select
                    value={formData.conservante}
                    onValueChange={(value) => setFormData({ ...formData, conservante: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDTA K2">EDTA K2</SelectItem>
                      <SelectItem value="Citrato">Citrato de Sódio</SelectItem>
                      <SelectItem value="Heparina">Heparina</SelectItem>
                      <SelectItem value="Fluoreto">Fluoreto de Sódio</SelectItem>
                      <SelectItem value="Gel">Gel Separador</SelectItem>
                      <SelectItem value="Seco">Sem Aditivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeMinimo">Volume Mín. (mL)</Label>
                  <Input
                    id="volumeMinimo"
                    type="number"
                    value={formData.volumeMinimo}
                    onChange={(e) => setFormData({ ...formData, volumeMinimo: e.target.value })}
                    placeholder="3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restrições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo Aplicável</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) => setFormData({ ...formData, sexo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambos">Ambos</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMinima">Idade Mínima</Label>
                  <Input
                    id="idadeMinima"
                    type="number"
                    value={formData.idadeMinima}
                    onChange={(e) => setFormData({ ...formData, idadeMinima: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idadeMaxima">Idade Máxima</Label>
                  <Input
                    id="idadeMaxima"
                    type="number"
                    value={formData.idadeMaxima}
                    onChange={(e) => setFormData({ ...formData, idadeMaxima: e.target.value })}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientacoes">Orientações ao Paciente</Label>
                <Textarea
                  id="orientacoes"
                  value={formData.orientacoes}
                  onChange={(e) => setFormData({ ...formData, orientacoes: e.target.value })}
                  placeholder="Orientações para preparo do exame"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status e Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Serviço Ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="disponivel">Disponível para Agendamento</Label>
                  <p className="text-xs text-muted-foreground">
                    Exibir para pacientes
                  </p>
                </div>
                <Switch
                  id="disponivel"
                  checked={formData.disponivel}
                  onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="jejum">Requer Jejum</Label>
                  <p className="text-xs text-muted-foreground">
                    Exige jejum para coleta
                  </p>
                </div>
                <Switch
                  id="jejum"
                  checked={formData.jejum}
                  onCheckedChange={(checked) => setFormData({ ...formData, jejum: checked })}
                />
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
                <span className="text-muted-foreground">Realizados este mês:</span>
                <span>1.234</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

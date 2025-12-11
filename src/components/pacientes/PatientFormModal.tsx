import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Contact {
  id: string;
  tipo: string;
  valor: string;
  enviarMensagem: boolean;
}

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (patient: any) => void;
  onSaveAndNew: (patient: any) => void;
  patient?: any;
}

const PatientFormModal = ({
  open,
  onClose,
  onSave,
  onSaveAndNew,
  patient,
}: PatientFormModalProps) => {
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", tipo: "Celular", valor: "(11) 99999-9999", enviarMensagem: true },
  ]);

  const [formData, setFormData] = useState({
    nome: patient?.nome || "",
    dataNascimento: patient?.dataNascimento || "",
    sexo: patient?.sexo || "",
    rg: patient?.rg || "",
    cpf: patient?.cpf || "",
    peso: patient?.peso || "",
    altura: patient?.altura || "",
    tipoSanguineo: patient?.tipoSanguineo || "",
    fatorRh: patient?.fatorRh || "",
    fatorDu: patient?.fatorDu || "",
    estadoCivil: patient?.estadoCivil || "",
    numeroFilhos: patient?.numeroFilhos || "",
    profissao: patient?.profissao || "",
    nomeMae: patient?.nomeMae || "",
    nomePai: patient?.nomePai || "",
    fumante: patient?.fumante || false,
    observacoes: patient?.observacoes || "",
    // Address
    cep: patient?.cep || "",
    endereco: patient?.endereco || "",
    numero: patient?.numero || "",
    complemento: patient?.complemento || "",
    bairro: patient?.bairro || "",
    cidade: patient?.cidade || "",
    estado: patient?.estado || "",
    // Convênio
    convenio: patient?.convenio || "",
    plano: patient?.plano || "",
    matricula: patient?.matricula || "",
    titular: patient?.titular || "",
    validadeCartao: patient?.validadeCartao || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      { id: Date.now().toString(), tipo: "Celular", valor: "", enviarMensagem: false },
    ]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const updateContact = (id: string, field: keyof Contact, value: any) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = () => {
    onSave({ ...formData, contacts });
  };

  const handleSubmitAndNew = () => {
    onSaveAndNew({ ...formData, contacts });
    setFormData({
      nome: "",
      dataNascimento: "",
      sexo: "",
      rg: "",
      cpf: "",
      peso: "",
      altura: "",
      tipoSanguineo: "",
      fatorRh: "",
      fatorDu: "",
      estadoCivil: "",
      numeroFilhos: "",
      profissao: "",
      nomeMae: "",
      nomePai: "",
      fumante: false,
      observacoes: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      convenio: "",
      plano: "",
      matricula: "",
      titular: "",
      validadeCartao: "",
    });
    setContacts([]);
    setActiveTab("dados-pessoais");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              {patient ? "Editar Paciente" : "Novo Paciente"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="dados-pessoais"
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
            >
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="endereco"
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
            >
              Endereço
            </TabsTrigger>
            <TabsTrigger
              value="convenio"
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
            >
              Convênio
            </TabsTrigger>
          </TabsList>

          {/* TAB 1 - Dados Pessoais */}
          <TabsContent value="dados-pessoais" className="mt-6 space-y-6">
            {/* Section: Identificação */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Identificação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="dataNascimento" className="text-sm font-medium">
                    Data de Nascimento *
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange("dataNascimento", e.target.value)}
                    className="input-premium mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="sexo" className="text-sm font-medium">
                    Sexo *
                  </Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) => handleChange("sexo", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rg" className="text-sm font-medium">
                    RG
                  </Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => handleChange("rg", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="00.000.000-0"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-sm font-medium">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleChange("cpf", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Section: Dados Médicos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dados Médicos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="peso" className="text-sm font-medium">
                    Peso (kg)
                  </Label>
                  <Input
                    id="peso"
                    type="number"
                    value={formData.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="70"
                  />
                </div>
                <div>
                  <Label htmlFor="altura" className="text-sm font-medium">
                    Altura (cm)
                  </Label>
                  <Input
                    id="altura"
                    type="number"
                    value={formData.altura}
                    onChange={(e) => handleChange("altura", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="170"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoSanguineo" className="text-sm font-medium">
                    Tipo Sanguíneo
                  </Label>
                  <Select
                    value={formData.tipoSanguineo}
                    onValueChange={(value) => handleChange("tipoSanguineo", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fatorRh" className="text-sm font-medium">
                    Fator RH
                  </Label>
                  <Select
                    value={formData.fatorRh}
                    onValueChange={(value) => handleChange("fatorRh", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="positivo">Positivo (+)</SelectItem>
                      <SelectItem value="negativo">Negativo (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fatorDu" className="text-sm font-medium">
                    Fator DU
                  </Label>
                  <Select
                    value={formData.fatorDu}
                    onValueChange={(value) => handleChange("fatorDu", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="positivo">Positivo</SelectItem>
                      <SelectItem value="negativo">Negativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 col-span-2 md:col-span-3 pt-6">
                  <Switch
                    id="fumante"
                    checked={formData.fumante}
                    onCheckedChange={(checked) => handleChange("fumante", checked)}
                  />
                  <Label htmlFor="fumante" className="text-sm font-medium cursor-pointer">
                    É fumante?
                  </Label>
                </div>
              </div>
            </div>

            {/* Section: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estadoCivil" className="text-sm font-medium">
                    Estado Civil
                  </Label>
                  <Select
                    value={formData.estadoCivil}
                    onValueChange={(value) => handleChange("estadoCivil", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      <SelectItem value="uniao-estavel">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numeroFilhos" className="text-sm font-medium">
                    Número de Filhos
                  </Label>
                  <Input
                    id="numeroFilhos"
                    type="number"
                    value={formData.numeroFilhos}
                    onChange={(e) => handleChange("numeroFilhos", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="profissao" className="text-sm font-medium">
                    Profissão
                  </Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => handleChange("profissao", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Digite a profissão"
                  />
                </div>
                <div>
                  <Label htmlFor="nomeMae" className="text-sm font-medium">
                    Nome da Mãe
                  </Label>
                  <Input
                    id="nomeMae"
                    value={formData.nomeMae}
                    onChange={(e) => handleChange("nomeMae", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Nome completo da mãe"
                  />
                </div>
                <div>
                  <Label htmlFor="nomePai" className="text-sm font-medium">
                    Nome do Pai
                  </Label>
                  <Input
                    id="nomePai"
                    value={formData.nomePai}
                    onChange={(e) => handleChange("nomePai", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Nome completo do pai"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Observações
              </h3>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                className="min-h-24 input-premium resize-none"
                placeholder="Observações adicionais sobre o paciente..."
              />
            </div>
          </TabsContent>

          {/* TAB 2 - Endereço */}
          <TabsContent value="endereco" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cep" className="text-sm font-medium">
                    CEP
                  </Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleChange("cep", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="00000-000"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="endereco" className="text-sm font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <Label htmlFor="numero" className="text-sm font-medium">
                    Número
                  </Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleChange("numero", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="123"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="complemento" className="text-sm font-medium">
                    Complemento
                  </Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => handleChange("complemento", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Apto, Bloco..."
                  />
                </div>
                <div>
                  <Label htmlFor="bairro" className="text-sm font-medium">
                    Bairro
                  </Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => handleChange("bairro", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade" className="text-sm font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <Label htmlFor="estado" className="text-sm font-medium">
                    Estado
                  </Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => handleChange("estado", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AL">AL</SelectItem>
                      <SelectItem value="AP">AP</SelectItem>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="BA">BA</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="DF">DF</SelectItem>
                      <SelectItem value="ES">ES</SelectItem>
                      <SelectItem value="GO">GO</SelectItem>
                      <SelectItem value="MA">MA</SelectItem>
                      <SelectItem value="MT">MT</SelectItem>
                      <SelectItem value="MS">MS</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                      <SelectItem value="PB">PB</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="PE">PE</SelectItem>
                      <SelectItem value="PI">PI</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="RN">RN</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                      <SelectItem value="RO">RO</SelectItem>
                      <SelectItem value="RR">RR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="SE">SE</SelectItem>
                      <SelectItem value="TO">TO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Contatos
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                  className="btn-secondary-premium h-9"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <div className="card-premium overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-xs font-semibold">Tipo</TableHead>
                      <TableHead className="text-xs font-semibold">Telefone/Email</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Enviar Mensagem</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhum contato adicionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="py-2">
                            <Select
                              value={contact.tipo}
                              onValueChange={(value) => updateContact(contact.id, "tipo", value)}
                            >
                              <SelectTrigger className="h-9 w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="Celular">Celular</SelectItem>
                                <SelectItem value="Telefone">Telefone</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              value={contact.valor}
                              onChange={(e) => updateContact(contact.id, "valor", e.target.value)}
                              className="h-9"
                              placeholder="Digite o contato"
                            />
                          </TableCell>
                          <TableCell className="text-center py-2">
                            <Checkbox
                              checked={contact.enviarMensagem}
                              onCheckedChange={(checked) =>
                                updateContact(contact.id, "enviarMensagem", checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeContact(contact.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3 - Convênio */}
          <TabsContent value="convenio" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dados do Convênio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="convenio" className="text-sm font-medium">
                    Convênio
                  </Label>
                  <Select
                    value={formData.convenio}
                    onValueChange={(value) => handleChange("convenio", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="unimed">Unimed</SelectItem>
                      <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      <SelectItem value="sulamerica">SulAmérica</SelectItem>
                      <SelectItem value="amil">Amil</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plano" className="text-sm font-medium">
                    Plano
                  </Label>
                  <Select
                    value={formData.plano}
                    onValueChange={(value) => handleChange("plano", value)}
                  >
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="executivo">Executivo</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="matricula" className="text-sm font-medium">
                    Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => handleChange("matricula", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Número da matrícula"
                  />
                </div>
                <div>
                  <Label htmlFor="titular" className="text-sm font-medium">
                    Titular
                  </Label>
                  <Input
                    id="titular"
                    value={formData.titular}
                    onChange={(e) => handleChange("titular", e.target.value)}
                    className="input-premium mt-1.5"
                    placeholder="Nome do titular"
                  />
                </div>
                <div>
                  <Label htmlFor="validadeCartao" className="text-sm font-medium">
                    Data de Validade do Cartão
                  </Label>
                  <Input
                    id="validadeCartao"
                    type="date"
                    value={formData.validadeCartao}
                    onChange={(e) => handleChange("validadeCartao", e.target.value)}
                    className="input-premium mt-1.5"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border sticky bottom-0 bg-card">
          <Button variant="outline" onClick={onClose} className="btn-secondary-premium">
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmitAndNew}
            className="btn-secondary-premium"
          >
            <Save className="h-4 w-4" />
            Salvar e Novo
          </Button>
          <Button onClick={handleSubmit} className="btn-primary-premium">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormModal;

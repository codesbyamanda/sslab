import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User,
  MapPin,
  Building2,
  Save,
  X,
  Plus,
  Search,
  History
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const PacienteCadastro = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [fumante, setFumante] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro de Paciente</h1>
          <p className="text-muted-foreground mt-1">Preencha os dados do paciente</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="btn-secondary-premium">
            <History className="h-4 w-4" />
            Histórico
          </Button>
          <Button variant="outline" className="btn-secondary-premium">
            <Search className="h-4 w-4" />
            Buscar Paciente
          </Button>
        </div>
      </div>

      {/* Form Card with Tabs */}
      <div className="card-premium">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger 
                value="dados-pessoais" 
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <User className="h-4 w-4 mr-2" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger 
                value="endereco"
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Endereço
              </TabsTrigger>
              <TabsTrigger 
                value="convenio"
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Convênio
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1 - Dados Pessoais */}
          <TabsContent value="dados-pessoais" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nome Completo */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Nome Completo *</Label>
                <Input className="input-premium mt-1.5" placeholder="Digite o nome completo" />
              </div>

              {/* Data de Nascimento */}
              <div>
                <Label className="text-sm font-medium text-foreground">Data de Nascimento *</Label>
                <Input type="date" className="input-premium mt-1.5" />
              </div>

              {/* Sexo */}
              <div>
                <Label className="text-sm font-medium text-foreground">Sexo *</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* RG */}
              <div>
                <Label className="text-sm font-medium text-foreground">RG</Label>
                <Input className="input-premium mt-1.5" placeholder="00.000.000-0" />
              </div>

              {/* CPF */}
              <div>
                <Label className="text-sm font-medium text-foreground">CPF</Label>
                <Input className="input-premium mt-1.5" placeholder="000.000.000-00" />
              </div>

              {/* Peso */}
              <div>
                <Label className="text-sm font-medium text-foreground">Peso (kg)</Label>
                <Input type="number" className="input-premium mt-1.5" placeholder="0.0" />
              </div>

              {/* Altura */}
              <div>
                <Label className="text-sm font-medium text-foreground">Altura (cm)</Label>
                <Input type="number" className="input-premium mt-1.5" placeholder="0" />
              </div>

              {/* Tipo Sanguíneo */}
              <div>
                <Label className="text-sm font-medium text-foreground">Tipo Sanguíneo</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fator RH */}
              <div>
                <Label className="text-sm font-medium text-foreground">Fator RH</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positivo">Positivo (+)</SelectItem>
                    <SelectItem value="negativo">Negativo (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado Civil */}
              <div>
                <Label className="text-sm font-medium text-foreground">Estado Civil</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nº de Filhos */}
              <div>
                <Label className="text-sm font-medium text-foreground">Nº de Filhos</Label>
                <Input type="number" className="input-premium mt-1.5" placeholder="0" />
              </div>

              {/* Profissão */}
              <div>
                <Label className="text-sm font-medium text-foreground">Profissão</Label>
                <Input className="input-premium mt-1.5" placeholder="Digite a profissão" />
              </div>

              {/* Nome da Mãe */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Nome da Mãe</Label>
                <Input className="input-premium mt-1.5" placeholder="Nome completo da mãe" />
              </div>

              {/* Nome do Pai */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Nome do Pai</Label>
                <Input className="input-premium mt-1.5" placeholder="Nome completo do pai" />
              </div>

              {/* Fumante */}
              <div className="flex items-center gap-3">
                <Switch 
                  checked={fumante} 
                  onCheckedChange={setFumante} 
                  id="fumante"
                />
                <Label htmlFor="fumante" className="text-sm font-medium text-foreground cursor-pointer">
                  Fumante
                </Label>
              </div>

              {/* Observações */}
              <div className="lg:col-span-3">
                <Label className="text-sm font-medium text-foreground">Observações</Label>
                <Textarea 
                  className="input-premium mt-1.5 min-h-[120px] resize-none" 
                  placeholder="Digite observações relevantes sobre o paciente..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 2 - Endereço */}
          <TabsContent value="endereco" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CEP */}
              <div>
                <Label className="text-sm font-medium text-foreground">CEP</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input className="input-premium" placeholder="00000-000" />
                  <Button className="btn-secondary-premium px-4">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Endereço */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Endereço</Label>
                <Input className="input-premium mt-1.5" placeholder="Rua, Avenida..." />
              </div>

              {/* Número */}
              <div>
                <Label className="text-sm font-medium text-foreground">Número</Label>
                <Input className="input-premium mt-1.5" placeholder="Nº" />
              </div>

              {/* Complemento */}
              <div>
                <Label className="text-sm font-medium text-foreground">Complemento</Label>
                <Input className="input-premium mt-1.5" placeholder="Apto, Bloco..." />
              </div>

              {/* Bairro */}
              <div>
                <Label className="text-sm font-medium text-foreground">Bairro</Label>
                <Input className="input-premium mt-1.5" placeholder="Bairro" />
              </div>

              {/* Cidade */}
              <div>
                <Label className="text-sm font-medium text-foreground">Cidade</Label>
                <Input className="input-premium mt-1.5" placeholder="Cidade" />
              </div>

              {/* Estado */}
              <div>
                <Label className="text-sm font-medium text-foreground">Estado</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Divisor */}
              <div className="lg:col-span-3 border-t border-border pt-6 mt-2">
                <h3 className="font-semibold text-foreground mb-4">Contatos</h3>
              </div>

              {/* Telefone 1 */}
              <div>
                <Label className="text-sm font-medium text-foreground">Telefone Principal</Label>
                <Input className="input-premium mt-1.5" placeholder="(00) 00000-0000" />
              </div>

              {/* Telefone 2 */}
              <div>
                <Label className="text-sm font-medium text-foreground">Telefone Secundário</Label>
                <Input className="input-premium mt-1.5" placeholder="(00) 00000-0000" />
              </div>

              {/* Telefone 3 */}
              <div>
                <Label className="text-sm font-medium text-foreground">Telefone Comercial</Label>
                <Input className="input-premium mt-1.5" placeholder="(00) 0000-0000" />
              </div>

              {/* Email Principal */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">E-mail Principal</Label>
                <Input type="email" className="input-premium mt-1.5" placeholder="email@exemplo.com" />
              </div>

              {/* Email Secundário */}
              <div>
                <Label className="text-sm font-medium text-foreground">E-mail Secundário</Label>
                <Input type="email" className="input-premium mt-1.5" placeholder="email@exemplo.com" />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3 - Convênio */}
          <TabsContent value="convenio" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Convênio Fixo */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Convênio Fixo</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione o convênio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="amil">Amil</SelectItem>
                    <SelectItem value="hapvida">Hapvida</SelectItem>
                    <SelectItem value="notredame">NotreDame Intermédica</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Plano */}
              <div>
                <Label className="text-sm font-medium text-foreground">Plano</Label>
                <Input className="input-premium mt-1.5" placeholder="Nome do plano" />
              </div>

              {/* Matrícula */}
              <div>
                <Label className="text-sm font-medium text-foreground">Matrícula</Label>
                <Input className="input-premium mt-1.5" placeholder="Número da matrícula" />
              </div>

              {/* Validade */}
              <div>
                <Label className="text-sm font-medium text-foreground">Validade</Label>
                <Input type="date" className="input-premium mt-1.5" />
              </div>

              {/* Titular */}
              <div>
                <Label className="text-sm font-medium text-foreground">Titular</Label>
                <Input className="input-premium mt-1.5" placeholder="Nome do titular" />
              </div>

              {/* Nº de Autorização */}
              <div>
                <Label className="text-sm font-medium text-foreground">Nº de Autorização</Label>
                <Input className="input-premium mt-1.5" placeholder="Número da autorização" />
              </div>

              {/* Data da Autorização */}
              <div>
                <Label className="text-sm font-medium text-foreground">Data da Autorização</Label>
                <Input type="date" className="input-premium mt-1.5" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button variant="outline" className="btn-secondary-premium" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="btn-secondary-premium">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
            <Button className="btn-primary-premium">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacienteCadastro;

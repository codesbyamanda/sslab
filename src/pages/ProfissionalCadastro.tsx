import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";

// Mock data for editing
const mockProfissional = {
  id: 1,
  nome: "Dr. Carlos Alberto Mendes",
  crm: "CRM/SP 123456",
  especialidade: "Cardiologia",
  telefone: "(11) 99999-1234",
  telefone2: "(11) 3333-4567",
  email: "carlos.mendes@email.com",
  endereco: "Av. Paulista, 1000 - São Paulo/SP",
  observacoes: "Atende às segundas, quartas e sextas.",
  situacao: "Ativo"
};

const especialidades = [
  "Cardiologia",
  "Clínico Geral",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Ginecologia",
  "Neurologia",
  "Oftalmologia",
  "Ortopedia",
  "Pediatria",
  "Pneumologia",
  "Psiquiatria",
  "Urologia",
  "Outros"
];

const ProfissionalCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "novo";

  // Form fields
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);

  // Load data if editing
  useEffect(() => {
    if (isEditing) {
      // Simulate loading data
      setNome(mockProfissional.nome);
      setCrm(mockProfissional.crm);
      setEspecialidade(mockProfissional.especialidade);
      setTelefone(mockProfissional.telefone);
      setTelefone2(mockProfissional.telefone2);
      setEmail(mockProfissional.email);
      setEndereco(mockProfissional.endereco);
      setObservacoes(mockProfissional.observacoes);
      setAtivo(mockProfissional.situacao === "Ativo");
    }
  }, [isEditing]);

  const validateForm = () => {
    if (!nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o nome do profissional.",
        variant: "destructive"
      });
      return false;
    }

    if (!crm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o CRM / Registro profissional.",
        variant: "destructive"
      });
      return false;
    }

    if (!especialidade) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione a especialidade.",
        variant: "destructive"
      });
      return false;
    }

    if (!telefone.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o telefone principal.",
        variant: "destructive"
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o e-mail.",
        variant: "destructive"
      });
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "E-mail inválido",
        description: "Informe um e-mail válido.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    toast({
      title: isEditing ? "Profissional atualizado" : "Profissional cadastrado",
      description: `${nome} foi ${isEditing ? "atualizado" : "cadastrado"} com sucesso.`
    });
    navigate("/atendimento/profissionais");
  };

  const handleSaveAndNew = () => {
    if (!validateForm()) return;

    toast({
      title: "Profissional cadastrado",
      description: `${nome} foi cadastrado com sucesso.`
    });

    // Clear form
    setNome("");
    setCrm("");
    setEspecialidade("");
    setTelefone("");
    setTelefone2("");
    setEmail("");
    setEndereco("");
    setObservacoes("");
    setAtivo(true);
  };

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isEditing ? "Editar Profissional" : "Novo Profissional"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isEditing 
                  ? "Atualize os dados do profissional de saúde."
                  : "Cadastre um novo médico solicitante no sistema."
                }
              </p>
            </div>

            {/* Dados Principais */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Dados Principais</CardTitle>
                <CardDescription>Informações obrigatórias do profissional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">
                    Nome Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: Dr. João da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block">
                      CRM / Registro Profissional <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Ex: CRM/SP 123456"
                      value={crm}
                      onChange={(e) => setCrm(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block">
                      Especialidade <span className="text-destructive">*</span>
                    </Label>
                    <Select value={especialidade} onValueChange={setEspecialidade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map(esp => (
                          <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block">
                      Telefone Principal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(formatPhone(e.target.value))}
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Telefone Secundário</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={telefone2}
                      onChange={(e) => setTelefone2(formatPhone(e.target.value))}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    E-mail <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados Complementares */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Dados Complementares</CardTitle>
                <CardDescription>Informações opcionais do profissional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Endereço</Label>
                  <Input
                    placeholder="Endereço completo..."
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Observações</Label>
                  <Textarea
                    placeholder="Observações sobre o profissional..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Situação */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Situação</CardTitle>
                <CardDescription>Defina se o profissional está ativo no sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Profissional Ativo</p>
                    <p className="text-sm text-muted-foreground">
                      Profissionais inativos não aparecem nas listas de seleção.
                    </p>
                  </div>
                  <Switch
                    checked={ativo}
                    onCheckedChange={setAtivo}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Integrações */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Integrações do Sistema</CardTitle>
                <CardDescription>Este profissional será utilizado automaticamente em:</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Aba "Médico Solicitante" no Atendimento
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Impressão de Laudos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Relatórios que envolvem médicos solicitantes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Configurações de Campos TISS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Laudo Internet (quando associado)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate("/atendimento/profissionais")} className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              {!isEditing && (
                <Button variant="secondary" onClick={handleSaveAndNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Salvar e Novo
                </Button>
              )}
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfissionalCadastro;

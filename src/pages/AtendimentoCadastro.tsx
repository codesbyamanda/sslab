import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import PatientSearchInput from "@/components/atendimentos/PatientSearchInput";
import ConveniosTab from "@/components/atendimentos/ConveniosTab";
import GeralTab from "@/components/atendimentos/GeralTab";
import MedicosTab from "@/components/atendimentos/MedicosTab";
import ServicosTab from "@/components/atendimentos/ServicosTab";
import AmostrasTab, { Amostra } from "@/components/atendimentos/AmostrasTab";
import PaymentsModal from "@/components/atendimentos/PaymentsModal";
import PrintingModal from "@/components/atendimentos/PrintingModal";

interface Patient {
  id: number;
  codigo: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  convenio?: string;
}

interface Convenio {
  id: number;
  nome: string;
  plano: string;
  matricula: string;
  validade: string;
  titular: string;
  numeroAutorizacao: string;
  dataAutorizacao: string;
}

interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  selected?: boolean;
}

interface Servico {
  id: number;
  codigo: string;
  mnemonico: string;
  descricao: string;
  situacao: "aberto" | "pendente" | "cancelado" | "executado" | "liberado";
  urgencia: boolean;
  materialColhido: boolean;
  dataColeta: string;
  horaColeta: string;
  convenio: string;
  medicoSolicitante: string;
  valor: number;
}

// Convênios que exigem pagamento no ato
const CONVENIOS_PAGAMENTO_ATO = ["Particular", "Pagamento no Ato", "Caixa"];

const AtendimentoCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = id && id !== "novo";

  // Header fields
  const [numeroRequisicao, setNumeroRequisicao] = useState(
    isEditing ? `REQ-2024-${id?.padStart(3, "0")}` : "REQ-2024-XXX"
  );
  const [dataRequisicao, setDataRequisicao] = useState(new Date().toISOString().split("T")[0]);
  const [tipoAtendimento, setTipoAtendimento] = useState("ambulatorial");
  const [guiaPrincipal, setGuiaPrincipal] = useState("");
  const [empresa, setEmpresa] = useState("Saúde Systems");
  const [unidade, setUnidade] = useState("centro");
  const [usuario, setUsuario] = useState("Admin");

  // Patient
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Tabs data
  const [convenios, setConvenios] = useState<Convenio[]>([
    {
      id: 1,
      nome: "Unimed",
      plano: "Essencial Plus",
      matricula: "0012345678901",
      validade: "2025-12-31",
      titular: "Maria Santos Silva",
      numeroAutorizacao: "",
      dataAutorizacao: "",
    },
  ]);

  const [geralData, setGeralData] = useState({
    cid: "",
    tipoDoenca: "",
    tempoDoenca: "",
    unidadeTempo: "dias",
    tipoSaida: "",
    indicacaoAcidente: "nao",
    dataSolicitacao: new Date().toISOString().split("T")[0],
    caraterSolicitacao: "eletivo",
    indicacaoClinica: "",
    dataEntrega: "",
    adicionalDias: "0",
    horaEntrega: "18:00",
    destinoLaudo: "paciente",
    dadosClinicos: "",
    urgencia: false,
  });

  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nextServicoId, setNextServicoId] = useState(1);

  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [nextAmostraId, setNextAmostraId] = useState(1);

  // Payment flow states
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showPrintingModal, setShowPrintingModal] = useState(false);

  // Load mock data for editing
  useEffect(() => {
    if (isEditing) {
      setSelectedPatient({
        id: 1,
        codigo: "PAC001",
        nome: "Maria Santos Silva",
        cpf: "123.456.789-00",
        dataNascimento: "1985-03-15",
        convenio: "Unimed",
      });

      setMedicos([
        { id: 1, nome: "Dr. Carlos Mendes", crm: "CRM-SP 123456", especialidade: "Clínico Geral", selected: true },
      ]);

      setServicos([
        {
          id: 1,
          codigo: "001",
          mnemonico: "HEMO",
          descricao: "Hemograma Completo",
          situacao: "aberto",
          urgencia: false,
          materialColhido: false,
          dataColeta: "",
          horaColeta: "",
          convenio: "Unimed",
          medicoSolicitante: "Dr. Carlos Mendes",
          valor: 35.0,
        },
      ]);
      setNextServicoId(2);
    }
  }, [isEditing]);

  // Calculate delivery date
  useEffect(() => {
    const hoje = new Date();
    const adicional = parseInt(geralData.adicionalDias) || 0;
    hoje.setDate(hoje.getDate() + 3 + adicional);
    setGeralData((prev) => ({
      ...prev,
      dataEntrega: hoje.toISOString().split("T")[0],
    }));
  }, [geralData.adicionalDias]);

  // Check if any convenio requires payment at time of service
  const requiresPayment = () => {
    return convenios.some((c) =>
      CONVENIOS_PAGAMENTO_ATO.some((cpa) => c.nome.toLowerCase().includes(cpa.toLowerCase()))
    );
  };

  // Calculate total value of services
  const calcularValorTotal = () => {
    return servicos
      .filter((s) => s.situacao !== "cancelado")
      .reduce((acc, s) => acc + s.valor, 0);
  };

  const handleAddConvenio = (convenio: Omit<Convenio, "id">) => {
    setConvenios([...convenios, { ...convenio, id: Date.now() }]);
  };

  const handleEditConvenio = (convenio: Convenio) => {
    setConvenios(convenios.map((c) => (c.id === convenio.id ? convenio : c)));
  };

  const handleDeleteConvenio = (id: number) => {
    setConvenios(convenios.filter((c) => c.id !== id));
  };

  const handleAddServico = (servico: Omit<Servico, "id">) => {
    setServicos([...servicos, { ...servico, id: nextServicoId }]);
    setNextServicoId((prev) => prev + 1);
  };

  const handleEditServico = (servico: Servico) => {
    setServicos(servicos.map((s) => (s.id === servico.id ? servico : s)));
  };

  const handleCancelServico = (id: number) => {
    setServicos(
      servicos.map((s) => (s.id === id ? { ...s, situacao: "cancelado" as const } : s))
    );
  };

  const handleAddAmostra = (amostra: Omit<Amostra, "id">) => {
    setAmostras([...amostras, { ...amostra, id: nextAmostraId }]);
    setNextAmostraId((prev) => prev + 1);
  };

  const handleEditAmostra = (amostra: Amostra) => {
    setAmostras(amostras.map((a) => (a.id === amostra.id ? amostra : a)));
  };

  const handleDeleteAmostra = (id: number) => {
    setAmostras(amostras.filter((a) => a.id !== id));
  };

  const handleSave = () => {
    // Check if requires payment
    if (requiresPayment() && calcularValorTotal() > 0) {
      setShowPaymentsModal(true);
    } else {
      // Go directly to printing
      setShowPrintingModal(true);
    }
  };

  const handlePaymentsComplete = () => {
    setShowPaymentsModal(false);
    setShowPrintingModal(true);
  };

  const handlePrintingClose = () => {
    setShowPrintingModal(false);
    navigate("/atendimento/atendimentos");
  };

  const handleSaveAndNew = () => {
    toast({
      title: "Requisição salva",
      description: `Requisição ${numeroRequisicao} salva com sucesso.`,
    });
    // Reset form
    setSelectedPatient(null);
    setConvenios([]);
    setMedicos([]);
    setServicos([]);
    setAmostras([]);
    setGeralData({
      cid: "",
      tipoDoenca: "",
      tempoDoenca: "",
      unidadeTempo: "dias",
      tipoSaida: "",
      indicacaoAcidente: "nao",
      dataSolicitacao: new Date().toISOString().split("T")[0],
      caraterSolicitacao: "eletivo",
      indicacaoClinica: "",
      dataEntrega: "",
      adicionalDias: "0",
      horaEntrega: "18:00",
      destinoLaudo: "paciente",
      dadosClinicos: "",
      urgencia: false,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento/atendimentos")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Atendimentos</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditing ? "Editar Requisição" : "Nova Requisição"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Preencha os dados para {isEditing ? "atualizar" : "criar"} a requisição de atendimento.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/atendimento/atendimentos")}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={handleSaveAndNew}>
                <Plus className="h-4 w-4" />
                Salvar e Novo
              </Button>
              <Button className="btn-primary-premium" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>

          {/* Cabeçalho da Requisição */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div>
                <Label htmlFor="numeroRequisicao">Nº Requisição</Label>
                <Input
                  id="numeroRequisicao"
                  value={numeroRequisicao}
                  readOnly
                  className="input-premium bg-muted/50"
                />
              </div>

              <div>
                <Label htmlFor="dataRequisicao">Data</Label>
                <Input
                  id="dataRequisicao"
                  type="date"
                  value={dataRequisicao}
                  onChange={(e) => setDataRequisicao(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <Label htmlFor="tipoAtendimento">Tipo Atendimento</Label>
                <Select value={tipoAtendimento} onValueChange={setTipoAtendimento}>
                  <SelectTrigger className="input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                    <SelectItem value="emergencia">Emergência</SelectItem>
                    <SelectItem value="internacao">Internação</SelectItem>
                    <SelectItem value="domiciliar">Domiciliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="guiaPrincipal">Nº Guia Principal</Label>
                <Input
                  id="guiaPrincipal"
                  value={guiaPrincipal}
                  onChange={(e) => setGuiaPrincipal(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  value={empresa}
                  readOnly
                  className="input-premium bg-muted/50"
                />
              </div>

              <div>
                <Label htmlFor="unidade">Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centro">Unidade Centro</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  value={usuario}
                  readOnly
                  className="input-premium bg-muted/50"
                />
              </div>
            </div>
          </Card>

          {/* Paciente */}
          <Card className="p-6 mb-6">
            <Label className="text-base font-semibold mb-4 block">Paciente</Label>
            <PatientSearchInput
              selectedPatient={selectedPatient}
              onSelectPatient={(patient) => {
                setSelectedPatient(patient);
                // Auto-fill convenio
                if (patient?.convenio) {
                  const existingConvenio = convenios.find((c) => c.nome === patient.convenio);
                  if (!existingConvenio) {
                    setConvenios([
                      ...convenios,
                      {
                        id: Date.now(),
                        nome: patient.convenio,
                        plano: "Básico",
                        matricula: "",
                        validade: "",
                        titular: patient.nome,
                        numeroAutorizacao: "",
                        dataAutorizacao: "",
                      },
                    ]);
                  }
                }
              }}
            />
          </Card>

          {/* Tabs */}
          <Card className="p-6">
            <Tabs defaultValue="convenios" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="convenios">Convênios</TabsTrigger>
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="medicos">Médicos Solicitantes</TabsTrigger>
                <TabsTrigger value="servicos">Serviços</TabsTrigger>
                <TabsTrigger value="amostras">Amostras</TabsTrigger>
              </TabsList>

              <TabsContent value="convenios">
                <ConveniosTab
                  convenios={convenios}
                  onAddConvenio={handleAddConvenio}
                  onEditConvenio={handleEditConvenio}
                  onDeleteConvenio={handleDeleteConvenio}
                />
              </TabsContent>

              <TabsContent value="geral">
                <GeralTab data={geralData} onChange={setGeralData} />
              </TabsContent>

              <TabsContent value="medicos">
                <MedicosTab selectedMedicos={medicos} onChangeMedicos={setMedicos} />
              </TabsContent>

              <TabsContent value="servicos">
                <ServicosTab
                  servicos={servicos}
                  onAddServico={handleAddServico}
                  onEditServico={handleEditServico}
                  onCancelServico={handleCancelServico}
                  urgenciaGlobal={geralData.urgencia}
                />
              </TabsContent>

              <TabsContent value="amostras">
                <AmostrasTab
                  amostras={amostras}
                  servicos={servicos}
                  onAddAmostra={handleAddAmostra}
                  onEditAmostra={handleEditAmostra}
                  onDeleteAmostra={handleDeleteAmostra}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </main>
      </div>

      {/* Payments Modal */}
      <PaymentsModal
        open={showPaymentsModal}
        onClose={() => setShowPaymentsModal(false)}
        onComplete={handlePaymentsComplete}
        valorTotal={calcularValorTotal()}
        pacienteNome={selectedPatient?.nome || "Paciente não selecionado"}
        requisicaoNumero={numeroRequisicao}
      />

      {/* Printing Modal */}
      <PrintingModal
        open={showPrintingModal}
        onClose={handlePrintingClose}
        requisicaoNumero={numeroRequisicao}
        pacienteNome={selectedPatient?.nome || "Paciente não selecionado"}
      />
    </div>
  );
};

export default AtendimentoCadastro;

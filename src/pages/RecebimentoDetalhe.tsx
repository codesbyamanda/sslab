import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Save, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import ServicosPendentesTab from "@/components/recebimento/ServicosPendentesTab";
import AmostrasColhidasTab from "@/components/recebimento/AmostrasColhidasTab";
import RecebimentoPrintModal from "@/components/recebimento/RecebimentoPrintModal";

export interface ServicoPendente {
  id: string;
  codigo: string;
  descricao: string;
  recipiente: string;
  quantidade: number;
  situacao: "Pendente" | "Aberto" | "Liberado" | "Cancelado";
  numeroAmostra: string | null;
  dataColeta: string | null;
  horaColeta: string | null;
  responsavelColeta: string | null;
}

export interface AmostraColhida {
  id: string;
  servico: string;
  numeroAmostra: string;
  dataColeta: string;
  material: string;
  convenio: string;
  situacao: string;
}

const mockServicosPendentes: ServicoPendente[] = [
  {
    id: "1",
    codigo: "HEMO001",
    descricao: "Hemograma Completo",
    recipiente: "Tubo EDTA",
    quantidade: 1,
    situacao: "Pendente",
    numeroAmostra: null,
    dataColeta: null,
    horaColeta: null,
    responsavelColeta: null,
  },
  {
    id: "2",
    codigo: "GLI001",
    descricao: "Glicemia em Jejum",
    recipiente: "Tubo Fluoreto",
    quantidade: 1,
    situacao: "Pendente",
    numeroAmostra: null,
    dataColeta: null,
    horaColeta: null,
    responsavelColeta: null,
  },
  {
    id: "3",
    codigo: "CREA001",
    descricao: "Creatinina",
    recipiente: "Tubo Seco",
    quantidade: 1,
    situacao: "Pendente",
    numeroAmostra: null,
    dataColeta: null,
    horaColeta: null,
    responsavelColeta: null,
  },
];

const mockAmostrasColhidas: AmostraColhida[] = [
  {
    id: "a1",
    servico: "TSH Ultra Sensível",
    numeroAmostra: "AMS-2024-005678",
    dataColeta: "2024-01-15",
    material: "Soro",
    convenio: "Unimed",
    situacao: "Em Análise",
  },
  {
    id: "a2",
    servico: "T4 Livre",
    numeroAmostra: "AMS-2024-005679",
    dataColeta: "2024-01-15",
    material: "Soro",
    convenio: "Unimed",
    situacao: "Em Análise",
  },
];

const RecebimentoDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [servicosPendentes, setServicosPendentes] = useState<ServicoPendente[]>(
    mockServicosPendentes
  );
  const [amostrasColhidas, setAmostrasColhidas] = useState<AmostraColhida[]>(
    mockAmostrasColhidas
  );
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pendentes");

  // Mock data for requisition
  const requisicao = {
    numero: "REQ-2024-001234",
    paciente: "Maria Silva Santos",
    dataAtendimento: "15/01/2024",
  };

  const gerarNumeroAmostra = () => {
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `AMS-2024-${random}`;
  };

  const handleBaixaMaterial = (servicoId: string, responsavel: string) => {
    const now = new Date();
    const dataColeta = now.toISOString().split("T")[0];
    const horaColeta = now.toTimeString().slice(0, 5);
    const numeroAmostra = gerarNumeroAmostra();

    setServicosPendentes((prev) =>
      prev.map((servico) => {
        if (servico.id === servicoId && servico.situacao === "Pendente") {
          // Add to collected samples
          const novaAmostra: AmostraColhida = {
            id: `col-${servicoId}`,
            servico: servico.descricao,
            numeroAmostra,
            dataColeta,
            material: servico.recipiente,
            convenio: "Particular",
            situacao: "Recebido",
          };
          setAmostrasColhidas((prev) => [...prev, novaAmostra]);

          return {
            ...servico,
            situacao: "Aberto" as const,
            numeroAmostra,
            dataColeta,
            horaColeta,
            responsavelColeta: responsavel,
          };
        }
        return servico;
      })
    );

    toast({
      title: "Material recebido",
      description: `Amostra ${numeroAmostra} registrada com sucesso.`,
    });
  };

  const handleSalvar = () => {
    const itensRecebidos = servicosPendentes.filter(
      (s) => s.situacao === "Aberto"
    );

    if (itensRecebidos.length === 0) {
      toast({
        title: "Atenção",
        description: "Nenhum item foi baixado. Realize o recebimento de pelo menos um material.",
        variant: "destructive",
      });
      return;
    }

    // Save and open print modal
    toast({
      title: "Recebimento salvo",
      description: `${itensRecebidos.length} amostra(s) registrada(s) com sucesso.`,
    });

    setShowPrintModal(true);
  };

  const handleCancelar = () => {
    navigate("/atendimento/recebimento");
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    navigate("/atendimento/recebimento");
  };

  const pendentesCount = servicosPendentes.filter(
    (s) => s.situacao === "Pendente"
  ).length;
  const recebidosCount = servicosPendentes.filter(
    (s) => s.situacao === "Aberto"
  ).length;

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento/recebimento")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Pesquisa</span>
          </button>

          {/* Header */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Recebimento de Material
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>
                        <strong>Requisição:</strong>{" "}
                        <span className="text-primary font-mono">
                          {requisicao.numero}
                        </span>
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Paciente:</strong> {requisicao.paciente}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Data:</strong> {requisicao.dataAtendimento}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="destructive"
                    className="text-sm px-3 py-1"
                  >
                    {pendentesCount} Pendente(s)
                  </Badge>
                  {recebidosCount > 0 && (
                    <Badge
                      variant="default"
                      className="text-sm px-3 py-1 bg-verde-sucesso"
                    >
                      {recebidosCount} Recebido(s)
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Card className="card-elevated animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0 border-b">
                <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-0">
                  <TabsTrigger
                    value="pendentes"
                    className="relative px-6 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all"
                  >
                    Serviços Pendentes
                    {pendentesCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 text-xs px-1.5 py-0.5"
                      >
                        {pendentesCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="colhidas"
                    className="relative px-6 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all"
                  >
                    Amostras Colhidas
                    <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                      {amostrasColhidas.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-0">
                <TabsContent value="pendentes" className="mt-0">
                  <ServicosPendentesTab
                    servicos={servicosPendentes}
                    onBaixaMaterial={handleBaixaMaterial}
                  />
                </TabsContent>
                <TabsContent value="colhidas" className="mt-0">
                  <AmostrasColhidasTab amostras={amostrasColhidas} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 animate-fade-in">
            <Button variant="outline" onClick={handleCancelar} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              className="btn-primary-premium gap-2"
              disabled={recebidosCount === 0}
            >
              <Save className="h-4 w-4" />
              Salvar Recebimento
            </Button>
          </div>
        </main>
      </div>

      <RecebimentoPrintModal
        open={showPrintModal}
        onClose={handleClosePrintModal}
        requisicaoNumero={requisicao.numero}
        pacienteNome={requisicao.paciente}
        amostras={amostrasColhidas}
      />
    </div>
  );
};

export default RecebimentoDetalhe;

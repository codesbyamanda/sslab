import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Eye, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface ServicoLaudo {
  id: string;
  servico: string;
  descricao: string;
  material: string;
  dataColeta: string;
  dataEntrega: string;
  situacao: "Pendente" | "Liberado" | "Impresso" | "Entregue";
}

const mockServicos: ServicoLaudo[] = [
  {
    id: "1",
    servico: "HEM",
    descricao: "Hemograma Completo",
    material: "Sangue Total EDTA",
    dataColeta: "2024-01-15",
    dataEntrega: "2024-01-16",
    situacao: "Liberado",
  },
  {
    id: "2",
    servico: "GLI",
    descricao: "Glicemia de Jejum",
    material: "Sangue Total Fluoreto",
    dataColeta: "2024-01-15",
    dataEntrega: "2024-01-15",
    situacao: "Liberado",
  },
  {
    id: "3",
    servico: "COL",
    descricao: "Colesterol Total",
    material: "Soro",
    dataColeta: "2024-01-15",
    dataEntrega: "2024-01-16",
    situacao: "Pendente",
  },
  {
    id: "4",
    servico: "TGO",
    descricao: "Transaminase Oxalacética",
    material: "Soro",
    dataColeta: "2024-01-15",
    dataEntrega: "2024-01-16",
    situacao: "Impresso",
  },
  {
    id: "5",
    servico: "TSH",
    descricao: "Hormônio Tireoestimulante",
    material: "Soro",
    dataColeta: "2024-01-15",
    dataEntrega: "2024-01-17",
    situacao: "Entregue",
  },
];

const ImpressaoLaudoPaciente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedServicos, setSelectedServicos] = useState<string[]>([]);
  const [requisitante, setRequisitante] = useState("todos");

  // Mock data - em produção viria do backend
  const requisicao = {
    numero: `REQ-2024-00${id}`,
    paciente: "Maria Silva Santos",
    dataAtendimento: "15/01/2024",
    dataEntrega: "16/01/2024",
  };

  const hasLaudoPendente = mockServicos.some((s) => s.situacao === "Pendente");

  const handleToggleServico = (servicoId: string) => {
    setSelectedServicos((prev) =>
      prev.includes(servicoId)
        ? prev.filter((id) => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServicos.length === mockServicos.length) {
      setSelectedServicos([]);
    } else {
      setSelectedServicos(mockServicos.map((s) => s.id));
    }
  };

  const handleVisualizarPDF = () => {
    if (selectedServicos.length === 0) {
      toast.error("Selecione ao menos um serviço para visualizar");
      return;
    }
    toast.success("Abrindo visualização do laudo...");
  };

  const handleImprimir = () => {
    if (selectedServicos.length === 0) {
      toast.error("Selecione ao menos um serviço para imprimir");
      return;
    }
    toast.success(`Imprimindo ${selectedServicos.length} laudo(s)...`);
  };

  const getSituacaoBadge = (situacao: string) => {
    const variants: Record<string, { className: string }> = {
      Pendente: { className: "bg-ambar-suave/20 text-ambar-suave border border-ambar-suave/30" },
      Liberado: { className: "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30" },
      Impresso: { className: "bg-primary/20 text-primary border border-primary/30" },
      Entregue: { className: "bg-muted text-muted-foreground border border-border" },
    };
    const config = variants[situacao] || { className: "bg-muted text-muted-foreground" };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.className}`}>
        {situacao}
      </span>
    );
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
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  Imprimir Laudo de Paciente
                </h1>
                <p className="text-sm text-muted-foreground">
                  Selecione os serviços para visualizar e imprimir laudos
                </p>
              </div>
              {hasLaudoPendente && (
                <Badge variant="destructive" className="animate-pulse">
                  Laudo Pendente
                </Badge>
              )}
            </div>
          </div>

          {/* Informações da Requisição */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Dados da Requisição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nº Requisição
                  </label>
                  <p className="font-mono text-sm font-medium text-primary">
                    {requisicao.numero}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paciente
                  </label>
                  <p className="font-medium text-foreground">{requisicao.paciente}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Data Atendimento
                  </label>
                  <p className="text-foreground">{requisicao.dataAtendimento}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Data Entrega
                  </label>
                  <p className="text-foreground">{requisicao.dataEntrega}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Requisitante
                  </label>
                  <Select value={requisitante} onValueChange={setRequisitante}>
                    <SelectTrigger className="input-modern h-9">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="dr-carlos">Dr. Carlos Oliveira</SelectItem>
                      <SelectItem value="dra-ana">Dra. Ana Paula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Serviços */}
          <Card className="card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Serviços
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-medium">
                    {selectedServicos.length} selecionado(s)
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedServicos.length === mockServicos.length
                      ? "Desmarcar Todos"
                      : "Selecionar Todos"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedServicos.length === mockServicos.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-semibold">Serviço</TableHead>
                      <TableHead className="font-semibold">Descrição</TableHead>
                      <TableHead className="font-semibold">Material</TableHead>
                      <TableHead className="font-semibold">Data Coleta</TableHead>
                      <TableHead className="font-semibold">Data Entrega</TableHead>
                      <TableHead className="font-semibold text-center">Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockServicos.map((servico) => (
                      <TableRow
                        key={servico.id}
                        className={`cursor-pointer transition-colors ${
                          selectedServicos.includes(servico.id)
                            ? "bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleToggleServico(servico.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedServicos.includes(servico.id)}
                            onCheckedChange={() => handleToggleServico(servico.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium text-primary">
                          {servico.servico}
                        </TableCell>
                        <TableCell className="font-medium">{servico.descricao}</TableCell>
                        <TableCell>{servico.material}</TableCell>
                        <TableCell>
                          {new Date(servico.dataColeta).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {new Date(servico.dataEntrega).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-center">
                          {getSituacaoBadge(servico.situacao)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 mt-6 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => navigate("/atendimento/atendimentos")}
            >
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={handleVisualizarPDF}
              disabled={selectedServicos.length === 0}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Visualizar PDF
            </Button>
            <Button
              onClick={handleImprimir}
              disabled={selectedServicos.length === 0}
              className="btn-primary-premium gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImpressaoLaudoPaciente;

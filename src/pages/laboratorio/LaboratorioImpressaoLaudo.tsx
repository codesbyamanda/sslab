import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer, Search, Filter, FileDown, Eye, AlertCircle, FileText, Building2, Calendar, User } from "lucide-react";
import { toast } from "sonner";

interface ServicoLaudo {
  id: string;
  servico: string;
  descricao: string;
  material: string;
  dataColeta: string;
  dataEntrega: string;
  situacao: "pendente" | "pronto" | "impresso";
}

const mockServicos: ServicoLaudo[] = [
  { id: "1", servico: "GLI", descricao: "Glicose", material: "Sangue", dataColeta: "16/12/2024 08:15", dataEntrega: "17/12/2024 14:00", situacao: "pronto" },
  { id: "2", servico: "COL", descricao: "Colesterol Total", material: "Sangue", dataColeta: "16/12/2024 08:15", dataEntrega: "17/12/2024 14:00", situacao: "pronto" },
  { id: "3", servico: "TGO", descricao: "TGO (AST)", material: "Sangue", dataColeta: "16/12/2024 08:15", dataEntrega: "17/12/2024 14:00", situacao: "pendente" },
  { id: "4", servico: "HEM", descricao: "Hemograma Completo", material: "Sangue", dataColeta: "16/12/2024 08:15", dataEntrega: "17/12/2024 14:00", situacao: "impresso" },
];

const situacaoConfig = {
  pendente: { label: "Laudo Pendente", class: "badge-warning" },
  pronto: { label: "Pronto", class: "badge-success" },
  impresso: { label: "Impresso", class: "badge-neutral" },
};

// Mock data for the report preview
const mockRequisicao = {
  numero: "REQ-2024-045678",
  paciente: "Maria Silva Santos",
  dataNascimento: "15/03/1985",
  sexo: "Feminino",
  unidade: "Laboratório Central",
  dataAtendimento: "16/12/2024",
  requisitante: "Dr. Carlos Silva",
  crm: "CRM-SP 123456",
};

// Mock results for report preview
const mockResultados: Record<string, { parametro: string; resultado: string; unidade: string; referencia: string }[]> = {
  "1": [
    { parametro: "Glicose", resultado: "92", unidade: "mg/dL", referencia: "70 - 99" },
  ],
  "2": [
    { parametro: "Colesterol Total", resultado: "185", unidade: "mg/dL", referencia: "< 200 (desejável)" },
  ],
  "4": [
    { parametro: "Hemácias", resultado: "4.8", unidade: "milhões/mm³", referencia: "4.5 - 5.5" },
    { parametro: "Hemoglobina", resultado: "14.2", unidade: "g/dL", referencia: "12.0 - 16.0" },
    { parametro: "Hematócrito", resultado: "42", unidade: "%", referencia: "36 - 46" },
    { parametro: "Leucócitos", resultado: "7.500", unidade: "/mm³", referencia: "4.000 - 11.000" },
    { parametro: "Plaquetas", resultado: "250.000", unidade: "/mm³", referencia: "150.000 - 400.000" },
  ],
};

const LaboratorioImpressaoLaudo = () => {
  const [numeroRequisicao, setNumeroRequisicao] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [requisitante, setRequisitante] = useState("");
  const [status, setStatus] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(true);
  const [viewingLaudo, setViewingLaudo] = useState<ServicoLaudo | null>(null);

  const handleSelectAll = () => {
    if (selectedServices.length === mockServicos.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(mockServicos.map((s) => s.id));
    }
  };

  const handleSelectService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handlePrint = () => {
    if (selectedServices.length === 0) {
      toast.error("Selecione pelo menos um serviço para imprimir");
      return;
    }
    toast.success(`Enviando ${selectedServices.length} laudo(s) para impressão...`);
  };

  const handleSavePDF = () => {
    if (selectedServices.length === 0) {
      toast.error("Selecione pelo menos um serviço para salvar");
      return;
    }
    toast.success("PDF gerado com sucesso!");
  };

  const handleViewLaudo = (servico: ServicoLaudo) => {
    setViewingLaudo(servico);
  };

  const handlePrintLaudo = () => {
    toast.success("Enviando laudo para impressão...");
    setViewingLaudo(null);
  };

  const handleSaveLaudoPDF = () => {
    toast.success("PDF do laudo gerado com sucesso!");
  };

  const canViewLaudo = (situacao: ServicoLaudo["situacao"]) => {
    return situacao === "pronto" || situacao === "impresso";
  };

  const hasPendingLaudos = mockServicos.some((s) => s.situacao === "pendente");

  return (
    <LaboratorioLayout title="Impressão Laudo">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Impressão de Laudo</h1>
          <p className="text-muted-foreground mt-1">
            Filtre e imprima laudos de pacientes.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="numeroRequisicao">Nº Requisição</Label>
                <Input
                  id="numeroRequisicao"
                  value={numeroRequisicao}
                  onChange={(e) => setNumeroRequisicao(e.target.value)}
                  placeholder="REQ-2024-..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="paciente">Paciente</Label>
                <Input
                  id="paciente"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  placeholder="Nome do paciente"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataAtendimento">Data Atendimento</Label>
                <Input
                  id="dataAtendimento"
                  type="date"
                  value={dataAtendimento}
                  onChange={(e) => setDataAtendimento(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataEntrega">Data Entrega</Label>
                <Input
                  id="dataEntrega"
                  type="date"
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Requisitante</Label>
                <Select value={requisitante} onValueChange={setRequisitante}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="dr-carlos">Dr. Carlos Silva</SelectItem>
                    <SelectItem value="dra-ana">Dra. Ana Souza</SelectItem>
                    <SelectItem value="dr-pedro">Dr. Pedro Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Laudo Pendente</SelectItem>
                    <SelectItem value="pronto">Pronto</SelectItem>
                    <SelectItem value="impresso">Impresso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowResults(true)}>
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost">Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {showResults && (
          <>
            {/* Aviso de Laudo Pendente */}
            {hasPendingLaudos && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Atenção: Laudos Pendentes</p>
                  <p className="text-sm text-muted-foreground">
                    Existem exames com status "Laudo Pendente". Esses exames ainda não foram liberados e não podem ser impressos.
                  </p>
                </div>
              </div>
            )}

            {/* Resumo */}
            <Card className="card-premium">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Requisição</p>
                    <p className="font-medium">REQ-2024-045678 • Maria Silva Santos</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atendimento: 16/12/2024 • Entrega: 17/12/2024 14:00
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={selectedServices.length === 0}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Serviços */}
            <Card className="card-premium">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Serviços/Exames
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {selectedServices.length} de {mockServicos.length} selecionado(s)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-premium">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedServices.length === mockServicos.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Data Coleta</TableHead>
                      <TableHead>Data Entrega</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="w-20 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockServicos.map((servico) => (
                      <TableRow key={servico.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedServices.includes(servico.id)}
                            onCheckedChange={() => handleSelectService(servico.id)}
                            disabled={servico.situacao === "pendente"}
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium">{servico.servico}</TableCell>
                        <TableCell>{servico.descricao}</TableCell>
                        <TableCell>{servico.material}</TableCell>
                        <TableCell>{servico.dataColeta}</TableCell>
                        <TableCell>{servico.dataEntrega}</TableCell>
                        <TableCell>
                          <span className={situacaoConfig[servico.situacao].class}>
                            {situacaoConfig[servico.situacao].label}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={!canViewLaudo(servico.situacao)}
                                  onClick={() => handleViewLaudo(servico)}
                                >
                                  <Eye className={`h-4 w-4 ${!canViewLaudo(servico.situacao) ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {canViewLaudo(servico.situacao) 
                                  ? "Visualizar Laudo" 
                                  : "Laudo pendente de liberação"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleSavePDF} disabled={selectedServices.length === 0}>
                <FileDown className="h-4 w-4 mr-2" />
                Salvar PDF
              </Button>
              <Button onClick={handlePrint} disabled={selectedServices.length === 0} className="btn-primary-premium">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Modal Visualizar Laudo */}
      <Dialog open={!!viewingLaudo} onOpenChange={(open) => !open && setViewingLaudo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visualizar Laudo - {viewingLaudo?.descricao}
            </DialogTitle>
            
            {/* Metadados do cabeçalho */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Paciente</p>
                  <p className="text-sm font-medium">{mockRequisicao.paciente}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Nº Requisição</p>
                  <p className="text-sm font-medium">{mockRequisicao.numero}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Unidade</p>
                  <p className="text-sm font-medium">{mockRequisicao.unidade}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="text-sm font-medium">{mockRequisicao.dataAtendimento}</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Preview do Laudo */}
          <div className="flex-1 overflow-auto py-4">
            <div className="bg-white border rounded-lg shadow-sm p-6 min-h-[400px]">
              {/* Cabeçalho do Laudo */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">LABORATÓRIO CENTRAL</h3>
                    <p className="text-xs text-gray-600">Av. Brasil, 1500 - Centro • Tel: (11) 3000-0000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Requisição: {mockRequisicao.numero}</p>
                    <p className="text-xs text-gray-600">Data: {mockRequisicao.dataAtendimento}</p>
                  </div>
                </div>
              </div>

              {/* Dados do Paciente */}
              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Paciente:</span>
                    <span className="font-medium text-gray-900 ml-1">{mockRequisicao.paciente}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Data Nasc.:</span>
                    <span className="font-medium text-gray-900 ml-1">{mockRequisicao.dataNascimento}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sexo:</span>
                    <span className="font-medium text-gray-900 ml-1">{mockRequisicao.sexo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Requisitante:</span>
                    <span className="font-medium text-gray-900 ml-1">{mockRequisicao.requisitante}</span>
                  </div>
                </div>
              </div>

              {/* Exame */}
              <div className="mb-4">
                <div className="bg-primary/10 text-primary font-semibold px-3 py-2 rounded-t text-sm">
                  {viewingLaudo?.servico} - {viewingLaudo?.descricao}
                </div>
                <div className="border border-t-0 rounded-b">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2 font-medium text-gray-700">Parâmetro</th>
                        <th className="text-center p-2 font-medium text-gray-700">Resultado</th>
                        <th className="text-center p-2 font-medium text-gray-700">Unidade</th>
                        <th className="text-left p-2 font-medium text-gray-700">Valor de Referência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingLaudo && mockResultados[viewingLaudo.id]?.map((resultado, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="p-2 text-gray-900">{resultado.parametro}</td>
                          <td className="p-2 text-center font-semibold text-gray-900">{resultado.resultado}</td>
                          <td className="p-2 text-center text-gray-600">{resultado.unidade}</td>
                          <td className="p-2 text-gray-600">{resultado.referencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rodapé do Laudo */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-end">
                  <div className="text-xs text-gray-600">
                    <p>Material: {viewingLaudo?.material}</p>
                    <p>Data/Hora da Coleta: {viewingLaudo?.dataColeta}</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="text-sm font-medium text-gray-900">{mockRequisicao.requisitante}</p>
                    <p className="text-xs text-gray-600">{mockRequisicao.crm}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 gap-2">
            <Button variant="outline" onClick={() => setViewingLaudo(null)}>
              Fechar
            </Button>
            <Button variant="outline" onClick={handleSaveLaudoPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Salvar PDF
            </Button>
            <Button onClick={handlePrintLaudo} className="btn-primary-premium">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LaboratorioLayout>
  );
};

export default LaboratorioImpressaoLaudo;

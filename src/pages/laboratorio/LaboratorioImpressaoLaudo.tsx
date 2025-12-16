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
import { Printer, Search, Filter, FileDown, Eye, AlertCircle } from "lucide-react";
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

const LaboratorioImpressaoLaudo = () => {
  const [numeroRequisicao, setNumeroRequisicao] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [requisitante, setRequisitante] = useState("");
  const [status, setStatus] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(true);

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
    </LaboratorioLayout>
  );
};

export default LaboratorioImpressaoLaudo;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { UserCheck, Search, Filter, FileEdit, Clock } from "lucide-react";

interface Requisicao {
  id: string;
  numeroRequisicao: string;
  paciente: string;
  convenio: string;
  data: string;
  prazoEntrega: string;
  status: "aberto" | "executado" | "liberado" | "repeticao" | "nao_executado";
}

const mockRequisicoes: Requisicao[] = [
  { id: "1", numeroRequisicao: "REQ-2024-045678", paciente: "Maria Silva Santos", convenio: "Unimed", data: "16/12/2024", prazoEntrega: "17/12/2024 14:00", status: "aberto" },
  { id: "2", numeroRequisicao: "REQ-2024-045677", paciente: "João Pedro Oliveira", convenio: "SulAmérica", data: "16/12/2024", prazoEntrega: "17/12/2024 10:00", status: "executado" },
  { id: "3", numeroRequisicao: "REQ-2024-045676", paciente: "Ana Carolina Lima", convenio: "Particular", data: "16/12/2024", prazoEntrega: "16/12/2024 18:00", status: "liberado" },
  { id: "4", numeroRequisicao: "REQ-2024-045675", paciente: "Carlos Eduardo Souza", convenio: "Bradesco Saúde", data: "15/12/2024", prazoEntrega: "16/12/2024 14:00", status: "repeticao" },
  { id: "5", numeroRequisicao: "REQ-2024-045674", paciente: "Fernanda Costa", convenio: "Amil", data: "15/12/2024", prazoEntrega: "16/12/2024 12:00", status: "nao_executado" },
];

const statusConfig = {
  aberto: { label: "Aberto", class: "badge-warning" },
  executado: { label: "Executado", class: "badge-neutral" },
  liberado: { label: "Liberado", class: "badge-success" },
  repeticao: { label: "Repetição", class: "badge-error" },
  nao_executado: { label: "Não Executado", class: "bg-muted text-muted-foreground text-xs px-2.5 py-0.5 rounded-full" },
};

const LaboratorioDigitacaoPaciente = () => {
  const navigate = useNavigate();
  const [numeroRequisicao, setNumeroRequisicao] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [unidade, setUnidade] = useState("");
  const [situacao, setSituacao] = useState("");

  return (
    <LaboratorioLayout title="Digitação por Paciente">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Digitação por Paciente</h1>
          <p className="text-muted-foreground mt-1">
            Localize uma requisição para fazer digitação e liberação de todos os exames.
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
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="central">Unidade Central</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Situação</Label>
                <Select value={situacao} onValueChange={setSituacao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="executado">Executado</SelectItem>
                    <SelectItem value="liberado">Liberado</SelectItem>
                    <SelectItem value="repeticao">Repetição</SelectItem>
                    <SelectItem value="nao_executado">Não Executado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost">Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Requisições Encontradas
              </CardTitle>
              <span className="text-sm text-muted-foreground">{mockRequisicoes.length} requisições</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Requisição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Prazo Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequisicoes.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium font-mono">{req.numeroRequisicao}</TableCell>
                    <TableCell>{req.paciente}</TableCell>
                    <TableCell>{req.convenio}</TableCell>
                    <TableCell>{req.data}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.prazoEntrega}
                    </TableCell>
                    <TableCell>
                      <span className={statusConfig[req.status].class}>
                        {statusConfig[req.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/laboratorio/digitacao-paciente/${req.id}`)}
                      >
                        <FileEdit className="h-4 w-4 mr-2" />
                        Abrir Digitação
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioDigitacaoPaciente;

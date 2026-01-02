import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Filter, 
  Activity,
  ChevronRight,
  Home,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock
} from "lucide-react";

const comunicacoes = [
  {
    id: 1,
    dataHora: "02/01/2026 14:32:45",
    equipamento: "Analisador Hematológico XN-1000",
    tipo: "Recebimento",
    exame: "Hemograma Completo",
    paciente: "Maria Silva",
    status: "sucesso",
    tempoResposta: "120ms"
  },
  {
    id: 2,
    dataHora: "02/01/2026 14:32:12",
    equipamento: "Analisador Bioquímico AU-680",
    tipo: "Recebimento",
    exame: "Glicose",
    paciente: "João Santos",
    status: "sucesso",
    tempoResposta: "98ms"
  },
  {
    id: 3,
    dataHora: "02/01/2026 14:31:58",
    equipamento: "Coagulômetro CS-2500",
    tipo: "Envio",
    exame: "Tempo de Protrombina",
    paciente: "Ana Oliveira",
    status: "erro",
    tempoResposta: "Timeout"
  },
  {
    id: 4,
    dataHora: "02/01/2026 14:31:30",
    equipamento: "Analisador Hematológico XN-1000",
    tipo: "Recebimento",
    exame: "Hemograma Completo",
    paciente: "Carlos Ferreira",
    status: "sucesso",
    tempoResposta: "115ms"
  },
  {
    id: 5,
    dataHora: "02/01/2026 14:30:45",
    equipamento: "Analisador de Urina UF-5000",
    tipo: "Recebimento",
    exame: "Urina Tipo I",
    paciente: "Lucia Mendes",
    status: "sucesso",
    tempoResposta: "145ms"
  },
  {
    id: 6,
    dataHora: "02/01/2026 14:30:02",
    equipamento: "Analisador Bioquímico AU-680",
    tipo: "Envio",
    exame: "Perfil Lipídico",
    paciente: "Roberto Lima",
    status: "sucesso",
    tempoResposta: "87ms"
  },
];

export default function InterfaciamentoMonitoramento() {
  const [filtroEquipamento, setFiltroEquipamento] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const equipamentosUnicos = [...new Set(comunicacoes.map(c => c.equipamento))];

  const comunicacoesFiltradas = comunicacoes.filter((c) => {
    const matchEquipamento = filtroEquipamento === "todos" || c.equipamento === filtroEquipamento;
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;
    return matchEquipamento && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Monitoramento</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitoramento</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe a comunicação em tempo real com os equipamentos
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Hoje</p>
                <p className="text-2xl font-bold">1.247</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Erros</p>
                <p className="text-2xl font-bold text-red-600">18</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">112ms</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Input type="date" className="w-[160px]" />
              <span className="flex items-center text-muted-foreground">até</span>
              <Input type="date" className="w-[160px]" />
            </div>
            <Select value={filtroEquipamento} onValueChange={setFiltroEquipamento}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Equipamentos</SelectItem>
                {equipamentosUnicos.map((eq) => (
                  <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sucesso">Sucesso</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { setFiltroEquipamento("todos"); setFiltroStatus("todos"); }}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Exame</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comunicacoesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Nenhuma comunicação encontrada</p>
                  </TableCell>
                </TableRow>
              ) : (
                comunicacoesFiltradas.map((comunicacao) => (
                  <TableRow key={comunicacao.id}>
                    <TableCell className="font-mono text-sm">{comunicacao.dataHora}</TableCell>
                    <TableCell>{comunicacao.equipamento}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {comunicacao.tipo === "Envio" ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-blue-600" />
                        )}
                        <span>{comunicacao.tipo}</span>
                      </div>
                    </TableCell>
                    <TableCell>{comunicacao.exame}</TableCell>
                    <TableCell>{comunicacao.paciente}</TableCell>
                    <TableCell>
                      {comunicacao.status === "sucesso" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Sucesso
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Erro
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={comunicacao.status === "erro" ? "text-red-600" : ""}>
                        {comunicacao.tempoResposta}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

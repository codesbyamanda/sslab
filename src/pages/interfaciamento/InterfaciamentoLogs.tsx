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
  FileText,
  ChevronRight,
  Home,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

const logs = [
  {
    id: 1,
    dataHora: "02/01/2026 14:32:45",
    equipamento: "Analisador Hematológico XN-1000",
    protocolo: "ASTM",
    mensagemResumida: "H|\\^&|||XN-1000^Sysmex|...",
    resultado: "sucesso"
  },
  {
    id: 2,
    dataHora: "02/01/2026 14:32:12",
    equipamento: "Analisador Bioquímico AU-680",
    protocolo: "HL7",
    mensagemResumida: "MSH|^~\\&|AU680|LAB|LIS|...",
    resultado: "sucesso"
  },
  {
    id: 3,
    dataHora: "02/01/2026 14:31:58",
    equipamento: "Coagulômetro CS-2500",
    protocolo: "ASTM",
    mensagemResumida: "Connection timeout after 30s",
    resultado: "erro"
  },
  {
    id: 4,
    dataHora: "02/01/2026 14:31:30",
    equipamento: "Analisador Hematológico XN-1000",
    protocolo: "ASTM",
    mensagemResumida: "P|1||12345^Ferreira^Carlos||...",
    resultado: "sucesso"
  },
  {
    id: 5,
    dataHora: "02/01/2026 14:30:45",
    equipamento: "Analisador de Urina UF-5000",
    protocolo: "Serial",
    mensagemResumida: "Invalid checksum received",
    resultado: "warning"
  },
  {
    id: 6,
    dataHora: "02/01/2026 14:30:02",
    equipamento: "Analisador Bioquímico AU-680",
    protocolo: "HL7",
    mensagemResumida: "OBR|1|202601020001||GLU^...",
    resultado: "sucesso"
  },
];

export default function InterfaciamentoLogs() {
  const [filtroEquipamento, setFiltroEquipamento] = useState("todos");
  const [filtroResultado, setFiltroResultado] = useState("todos");

  const equipamentosUnicos = [...new Set(logs.map(l => l.equipamento))];

  const logsFiltrados = logs.filter((l) => {
    const matchEquipamento = filtroEquipamento === "todos" || l.equipamento === filtroEquipamento;
    const matchResultado = filtroResultado === "todos" || l.resultado === filtroResultado;
    return matchEquipamento && matchResultado;
  });

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case "sucesso":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Sucesso
          </Badge>
        );
      case "erro":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Aviso
          </Badge>
        );
      default:
        return <Badge variant="outline">{resultado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Logs de Comunicação</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Logs de Comunicação</h1>
        <p className="text-muted-foreground mt-1">
          Auditoria técnica e rastreabilidade das comunicações
        </p>
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
            <Select value={filtroResultado} onValueChange={setFiltroResultado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sucesso">Sucesso</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { setFiltroEquipamento("todos"); setFiltroResultado("todos"); }}
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
                <TableHead>Protocolo</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Nenhum log encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                logsFiltrados.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.dataHora}</TableCell>
                    <TableCell>{log.equipamento}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.protocolo}</Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-[250px] truncate block">
                        {log.mensagemResumida}
                      </code>
                    </TableCell>
                    <TableCell>{getResultadoBadge(log.resultado)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/interfaciamento/logs/${log.id}`}>
                        <Button variant="ghost" size="icon" title="Ver detalhes">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
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

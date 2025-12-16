import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Package, Search, Filter, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoteAmostra {
  id: string;
  numeroLote: string;
  dataHora: string;
  unidade: string;
  setorBancada: string;
  qtdAmostras: number;
  status: "aberto" | "processando" | "concluido";
}

const mockLotes: LoteAmostra[] = [
  { id: "1", numeroLote: "L-2024-001234", dataHora: "16/12/2024 08:30", unidade: "Unidade Central", setorBancada: "Bioquímica / Bancada 01", qtdAmostras: 45, status: "processando" },
  { id: "2", numeroLote: "L-2024-001233", dataHora: "16/12/2024 07:15", unidade: "Unidade Central", setorBancada: "Hematologia / Bancada 01", qtdAmostras: 32, status: "concluido" },
  { id: "3", numeroLote: "L-2024-001232", dataHora: "15/12/2024 16:45", unidade: "Unidade Norte", setorBancada: "Bioquímica / Bancada 02", qtdAmostras: 28, status: "concluido" },
  { id: "4", numeroLote: "L-2024-001231", dataHora: "15/12/2024 14:20", unidade: "Unidade Central", setorBancada: "Microbiologia / Bancada 01", qtdAmostras: 15, status: "aberto" },
  { id: "5", numeroLote: "L-2024-001230", dataHora: "15/12/2024 10:00", unidade: "Unidade Sul", setorBancada: "Urinálise / Bancada 01", qtdAmostras: 52, status: "concluido" },
];

const statusConfig = {
  aberto: { label: "Aberto", variant: "warning" as const },
  processando: { label: "Processando", variant: "default" as const },
  concluido: { label: "Concluído", variant: "success" as const },
};

const LaboratorioLotesAmostras = () => {
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [unidade, setUnidade] = useState("");
  const [setor, setSetor] = useState("");
  const [status, setStatus] = useState("");

  const getStatusBadge = (status: LoteAmostra["status"]) => {
    const config = statusConfig[status];
    const variantClasses = {
      warning: "badge-warning",
      default: "badge-neutral",
      success: "badge-success",
    };
    return <span className={variantClasses[config.variant]}>{config.label}</span>;
  };

  return (
    <LaboratorioLayout title="Lotes de Amostras">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lotes de Amostras</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os lotes relacionados à geração e organização do mapa de trabalho.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="central">Unidade Central</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Setor/Bancada</Label>
                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="bioquimica">Bioquímica</SelectItem>
                    <SelectItem value="hematologia">Hematologia</SelectItem>
                    <SelectItem value="microbiologia">Microbiologia</SelectItem>
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
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="processando">Processando</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
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
                <Package className="h-4 w-4" />
                Lotes Encontrados
              </CardTitle>
              <span className="text-sm text-muted-foreground">{mockLotes.length} lotes</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Lote</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Setor / Bancada</TableHead>
                  <TableHead className="text-center">Qtd. Amostras</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLotes.map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium font-mono">{lote.numeroLote}</TableCell>
                    <TableCell>{lote.dataHora}</TableCell>
                    <TableCell>{lote.unidade}</TableCell>
                    <TableCell>{lote.setorBancada}</TableCell>
                    <TableCell className="text-center">
                      <span className="badge-neutral">{lote.qtdAmostras}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lote.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
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

export default LaboratorioLotesAmostras;

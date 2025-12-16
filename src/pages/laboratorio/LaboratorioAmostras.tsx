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
import { TestTube2, Search, Filter, Eye, AlertTriangle } from "lucide-react";

interface Amostra {
  id: string;
  numeroAmostra: string;
  paciente: string;
  dataColeta: string;
  setorBancada: string;
  status: "colhida" | "em_analise" | "concluida" | "repetir";
  urgente: boolean;
}

const mockAmostras: Amostra[] = [
  { id: "1", numeroAmostra: "A-2024-089234", paciente: "Maria Silva Santos", dataColeta: "16/12/2024 08:15", setorBancada: "Bioquímica / Bancada 01", status: "em_analise", urgente: true },
  { id: "2", numeroAmostra: "A-2024-089233", paciente: "João Pedro Oliveira", dataColeta: "16/12/2024 08:00", setorBancada: "Hematologia / Bancada 01", status: "concluida", urgente: false },
  { id: "3", numeroAmostra: "A-2024-089232", paciente: "Ana Carolina Lima", dataColeta: "16/12/2024 07:45", setorBancada: "Bioquímica / Bancada 02", status: "colhida", urgente: false },
  { id: "4", numeroAmostra: "A-2024-089231", paciente: "Carlos Eduardo Souza", dataColeta: "16/12/2024 07:30", setorBancada: "Microbiologia / Bancada 01", status: "em_analise", urgente: false },
  { id: "5", numeroAmostra: "A-2024-089230", paciente: "Fernanda Costa", dataColeta: "15/12/2024 17:00", setorBancada: "Urinálise / Bancada 01", status: "repetir", urgente: true },
];

const statusConfig = {
  colhida: { label: "Colhida", class: "badge-neutral" },
  em_analise: { label: "Em Análise", class: "badge-warning" },
  concluida: { label: "Concluída", class: "badge-success" },
  repetir: { label: "Repetir", class: "badge-error" },
};

const LaboratorioAmostras = () => {
  const navigate = useNavigate();
  const [numeroAmostra, setNumeroAmostra] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [setor, setSetor] = useState("");
  const [status, setStatus] = useState("");
  const [urgencia, setUrgencia] = useState("");

  return (
    <LaboratorioLayout title="Amostras">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Amostras</h1>
          <p className="text-muted-foreground mt-1">
            Lista e gestão de amostras do laboratório.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="numeroAmostra">Nº Amostra</Label>
                <Input
                  id="numeroAmostra"
                  value={numeroAmostra}
                  onChange={(e) => setNumeroAmostra(e.target.value)}
                  placeholder="A-2024-..."
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
                <Label htmlFor="dataColeta">Data Coleta</Label>
                <Input
                  id="dataColeta"
                  type="date"
                  value={dataColeta}
                  onChange={(e) => setDataColeta(e.target.value)}
                  className="mt-1.5"
                />
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
                    <SelectItem value="urinalise">Urinálise</SelectItem>
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
                    <SelectItem value="colhida">Colhida</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="repetir">Repetir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgência</Label>
                <Select value={urgencia} onValueChange={setUrgencia}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
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
                <TestTube2 className="h-4 w-4" />
                Amostras Encontradas
              </CardTitle>
              <span className="text-sm text-muted-foreground">{mockAmostras.length} amostras</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Amostra</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data Coleta</TableHead>
                  <TableHead>Setor / Bancada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Urgência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAmostras.map((amostra) => (
                  <TableRow key={amostra.id}>
                    <TableCell className="font-medium font-mono">{amostra.numeroAmostra}</TableCell>
                    <TableCell>{amostra.paciente}</TableCell>
                    <TableCell>{amostra.dataColeta}</TableCell>
                    <TableCell>{amostra.setorBancada}</TableCell>
                    <TableCell>
                      <span className={statusConfig[amostra.status].class}>
                        {statusConfig[amostra.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {amostra.urgente && (
                        <span className="badge-error flex items-center gap-1 justify-center">
                          <AlertTriangle className="h-3 w-3" />
                          Urgente
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/laboratorio/amostras/${amostra.id}`)}
                      >
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

export default LaboratorioAmostras;

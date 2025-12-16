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
import { FileText, Search, Filter, FolderOpen, Info } from "lucide-react";

interface MapaDigitacao {
  id: string;
  numeroMapa: string;
  dataHoraGeracao: string;
  qtdFolhas: number;
  qtdExamesPorFolha: number;
  bancada: string;
}

const mockMapas: MapaDigitacao[] = [
  { id: "1", numeroMapa: "M-2024-001234", dataHoraGeracao: "16/12/2024 08:30", qtdFolhas: 3, qtdExamesPorFolha: 15, bancada: "Bioquímica / Bancada 01" },
  { id: "2", numeroMapa: "M-2024-001233", dataHoraGeracao: "16/12/2024 07:15", qtdFolhas: 2, qtdExamesPorFolha: 12, bancada: "Hematologia / Bancada 01" },
  { id: "3", numeroMapa: "M-2024-001232", dataHoraGeracao: "15/12/2024 16:45", qtdFolhas: 4, qtdExamesPorFolha: 18, bancada: "Bioquímica / Bancada 02" },
  { id: "4", numeroMapa: "M-2024-001231", dataHoraGeracao: "15/12/2024 14:20", qtdFolhas: 1, qtdExamesPorFolha: 8, bancada: "Microbiologia / Bancada 01" },
];

const LaboratorioDigitacaoMapa = () => {
  const navigate = useNavigate();
  const [numeroMapa, setNumeroMapa] = useState("");
  const [dataGeracao, setDataGeracao] = useState("");
  const [unidade, setUnidade] = useState("");
  const [bancada, setBancada] = useState("");

  return (
    <LaboratorioLayout title="Digitação por Mapa">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Digitação por Mapa</h1>
          <p className="text-muted-foreground mt-1">
            Digitação de vários pacientes de um lote de mapas de trabalho.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Pesquisa do Mapa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="numeroMapa">Número do Mapa</Label>
                <Input
                  id="numeroMapa"
                  value={numeroMapa}
                  onChange={(e) => setNumeroMapa(e.target.value)}
                  placeholder="M-2024-..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataGeracao">Data Geração</Label>
                <Input
                  id="dataGeracao"
                  type="date"
                  value={dataGeracao}
                  onChange={(e) => setDataGeracao(e.target.value)}
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
                <Label>Bancada</Label>
                <Select value={bancada} onValueChange={setBancada}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="bioquimica">Bioquímica</SelectItem>
                    <SelectItem value="hematologia">Hematologia</SelectItem>
                    <SelectItem value="microbiologia">Microbiologia</SelectItem>
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

        {/* Info de navegação */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            <strong>Navegação por teclado:</strong> CTRL + → próxima requisição • CTRL + ← requisição anterior
          </span>
        </div>

        {/* Tabela */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Mapas Encontrados
              </CardTitle>
              <span className="text-sm text-muted-foreground">{mockMapas.length} mapas</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Mapa</TableHead>
                  <TableHead>Data/Hora Geração</TableHead>
                  <TableHead className="text-center">Qtd Folhas</TableHead>
                  <TableHead className="text-center">Exames/Folha</TableHead>
                  <TableHead>Bancada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMapas.map((mapa) => (
                  <TableRow key={mapa.id}>
                    <TableCell className="font-medium font-mono">{mapa.numeroMapa}</TableCell>
                    <TableCell>{mapa.dataHoraGeracao}</TableCell>
                    <TableCell className="text-center">
                      <span className="badge-neutral">{mapa.qtdFolhas}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="badge-neutral">{mapa.qtdExamesPorFolha}</span>
                    </TableCell>
                    <TableCell>{mapa.bancada}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/laboratorio/digitacao-mapa/${mapa.id}`)}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Abrir
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

export default LaboratorioDigitacaoMapa;

import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  FileBarChart,
  FileText,
  BarChart3,
  Clock,
  Users,
  Layers,
  Filter,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileX,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RelatorioTipo = 
  | "producao-setor"
  | "amostras-periodo"
  | "laudos-emitidos"
  | "exames-convenio"
  | "tat"
  | "produtividade-bancada"
  | null;

interface Relatorio {
  id: RelatorioTipo;
  titulo: string;
  descricao: string;
  icon: React.ElementType;
}

const relatorios: Relatorio[] = [
  {
    id: "producao-setor",
    titulo: "Produção por Setor",
    descricao: "Volume de exames realizados por setor técnico",
    icon: Layers,
  },
  {
    id: "amostras-periodo",
    titulo: "Amostras por Período",
    descricao: "Quantidade de amostras coletadas no período",
    icon: FileBarChart,
  },
  {
    id: "laudos-emitidos",
    titulo: "Laudos Emitidos",
    descricao: "Total de laudos liberados por período",
    icon: FileText,
  },
  {
    id: "exames-convenio",
    titulo: "Exames por Convênio",
    descricao: "Distribuição de exames por convênio/plano",
    icon: Users,
  },
  {
    id: "tat",
    titulo: "TAT (Turnaround Time)",
    descricao: "Tempo médio de liberação dos resultados",
    icon: Clock,
  },
  {
    id: "produtividade-bancada",
    titulo: "Produtividade por Bancada",
    descricao: "Performance e volume por bancada técnica",
    icon: BarChart3,
  },
];

// Mock data for charts
const mockProducaoSetor = [
  { setor: "Bioquímica", quantidade: 1250 },
  { setor: "Hematologia", quantidade: 980 },
  { setor: "Microbiologia", quantidade: 450 },
  { setor: "Imunologia", quantidade: 320 },
  { setor: "Parasitologia", quantidade: 180 },
  { setor: "Uroanálise", quantidade: 520 },
];

const mockAmostrasPeriodo = [
  { data: "01/12", amostras: 145 },
  { data: "02/12", amostras: 132 },
  { data: "03/12", amostras: 168 },
  { data: "04/12", amostras: 155 },
  { data: "05/12", amostras: 189 },
  { data: "06/12", amostras: 142 },
  { data: "07/12", amostras: 98 },
];

const mockExamesConvenio = [
  { name: "Unimed", value: 35 },
  { name: "SulAmérica", value: 25 },
  { name: "Bradesco", value: 20 },
  { name: "Particular", value: 15 },
  { name: "Outros", value: 5 },
];

const mockTAT = [
  { setor: "Bioquímica", tempo: 2.5 },
  { setor: "Hematologia", tempo: 1.8 },
  { setor: "Microbiologia", tempo: 48.0 },
  { setor: "Imunologia", tempo: 4.2 },
  { setor: "Uroanálise", tempo: 1.2 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(142 76% 36%)", "hsl(38 92% 50%)", "hsl(var(--muted-foreground))"];

const LaboratorioRelatorios = () => {
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [unidade, setUnidade] = useState("all");
  const [setor, setSetor] = useState("all");
  const [convenio, setConvenio] = useState("all");
  
  const [relatorioAtivo, setRelatorioAtivo] = useState<RelatorioTipo>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectRelatorio = (id: RelatorioTipo) => {
    setIsLoading(true);
    setRelatorioAtivo(id);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleLimparFiltros = () => {
    setDataInicial("");
    setDataFinal("");
    setUnidade("all");
    setSetor("all");
    setConvenio("all");
  };

  const handleVoltar = () => {
    setRelatorioAtivo(null);
  };

  const relatorioInfo = relatorios.find(r => r.id === relatorioAtivo);
  const periodoTexto = dataInicial && dataFinal 
    ? `${dataInicial} a ${dataFinal}` 
    : "Todo o período";

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!hasData) {
      return (
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <FileX className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Nenhum dado encontrado para os filtros aplicados.</p>
        </div>
      );
    }

    switch (relatorioAtivo) {
      case "producao-setor":
      case "produtividade-bancada":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockProducaoSetor}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="setor" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="quantidade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "amostras-periodo":
      case "laudos-emitidos":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAmostrasPeriodo}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="data" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="amostras" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "exames-convenio":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockExamesConvenio}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockExamesConvenio.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "tat":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTAT} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="setor" type="category" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}h`, 'Tempo médio']}
              />
              <Bar dataKey="tempo" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (!hasData) {
      return null;
    }

    switch (relatorioAtivo) {
      case "producao-setor":
      case "produtividade-bancada":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">% Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducaoSetor.map((item) => {
                const total = mockProducaoSetor.reduce((acc, i) => acc + i.quantidade, 0);
                const percent = ((item.quantidade / total) * 100).toFixed(1);
                return (
                  <TableRow key={item.setor}>
                    <TableCell className="font-medium">{item.setor}</TableCell>
                    <TableCell className="text-right">{item.quantidade.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{percent}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      case "amostras-periodo":
      case "laudos-emitidos":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAmostrasPeriodo.map((item, index) => {
                const anterior = index > 0 ? mockAmostrasPeriodo[index - 1].amostras : item.amostras;
                const variacao = ((item.amostras - anterior) / anterior * 100).toFixed(1);
                const isPositivo = parseFloat(variacao) >= 0;
                return (
                  <TableRow key={item.data}>
                    <TableCell className="font-medium">{item.data}</TableCell>
                    <TableCell className="text-right">{item.amostras}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={isPositivo ? "default" : "destructive"} className={cn(
                        "text-xs",
                        isPositivo && "bg-accent/10 text-accent border-accent/20"
                      )}>
                        {isPositivo ? "+" : ""}{variacao}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      case "exames-convenio":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Convênio</TableHead>
                <TableHead className="text-right">Exames</TableHead>
                <TableHead className="text-right">% Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExamesConvenio.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{(item.value * 50).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.value}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "tat":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead className="text-right">TAT Médio</TableHead>
                <TableHead className="text-right">Meta</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTAT.map((item) => {
                const meta = item.setor === "Microbiologia" ? 72 : 4;
                const dentroMeta = item.tempo <= meta;
                return (
                  <TableRow key={item.setor}>
                    <TableCell className="font-medium">{item.setor}</TableCell>
                    <TableCell className="text-right">{item.tempo}h</TableCell>
                    <TableCell className="text-right">{meta}h</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={dentroMeta ? "default" : "destructive"} className={cn(
                        "text-xs",
                        dentroMeta && "bg-accent/10 text-accent border-accent/20"
                      )}>
                        {dentroMeta ? "Dentro da meta" : "Acima da meta"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  return (
    <LaboratorioLayout title="Relatórios">
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Módulos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/laboratorio">Saúde Laboratório</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Relatórios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Relatórios operacionais e gerenciais do laboratório.
          </p>
        </div>

        {/* Filtros Globais */}
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
                <Label htmlFor="dataInicial">Período Inicial</Label>
                <Input
                  id="dataInicial"
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFinal">Período Final</Label>
                <Input
                  id="dataFinal"
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
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
                <Label>Setor / Área Técnica</Label>
                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="bioquimica">Bioquímica</SelectItem>
                    <SelectItem value="hematologia">Hematologia</SelectItem>
                    <SelectItem value="microbiologia">Microbiologia</SelectItem>
                    <SelectItem value="imunologia">Imunologia</SelectItem>
                    <SelectItem value="parasitologia">Parasitologia</SelectItem>
                    <SelectItem value="uroanalise">Uroanálise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Convênio</Label>
                <Select value={convenio} onValueChange={setConvenio}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost" onClick={handleLimparFiltros}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        {!relatorioAtivo ? (
          /* Cards de Relatórios */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatorios.map(({ id, titulo, descricao, icon: Icon }) => (
              <Card
                key={id}
                className="card-premium cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
                onClick={() => handleSelectRelatorio(id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{titulo}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{descricao}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          /* Área de Visualização do Relatório */
          <div className="space-y-4">
            {/* Header do Relatório */}
            <Card className="card-premium">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleVoltar}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="text-lg">{relatorioInfo?.titulo}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Período: {periodoTexto}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Gráfico */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Visualização Gráfica</CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>

            {/* Tabela */}
            <Card className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Dados Detalhados</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable()}
                
                {/* Paginação */}
                {hasData && !isLoading && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Exibindo 1-6 de 6 registros
                    </p>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" disabled>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="w-8">
                        1
                      </Button>
                      <Button variant="outline" size="icon" disabled>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioRelatorios;
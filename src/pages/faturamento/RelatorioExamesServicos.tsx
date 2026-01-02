import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Loader2, FileText, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

// Mock data
const mockData = [
  { id: 1, exame: "Hemograma Completo", quantidade: 342, valorTotal: 8550.00, mediaPeriodo: 57 },
  { id: 2, exame: "Glicose", quantidade: 289, valorTotal: 4335.00, mediaPeriodo: 48 },
  { id: 3, exame: "Ureia", quantidade: 245, valorTotal: 2940.00, mediaPeriodo: 41 },
  { id: 4, exame: "Creatinina", quantidade: 231, valorTotal: 3465.00, mediaPeriodo: 39 },
  { id: 5, exame: "TSH", quantidade: 187, valorTotal: 8415.00, mediaPeriodo: 31 },
  { id: 6, exame: "T4 Livre", quantidade: 156, valorTotal: 5928.00, mediaPeriodo: 26 },
  { id: 7, exame: "Colesterol Total", quantidade: 198, valorTotal: 3564.00, mediaPeriodo: 33 },
  { id: 8, exame: "Triglicerídeos", quantidade: 189, valorTotal: 3402.00, mediaPeriodo: 32 },
];

const mockTimeData = [
  { mes: "Jul", hemograma: 45, glicose: 38, tsh: 22 },
  { mes: "Ago", hemograma: 52, glicose: 42, tsh: 28 },
  { mes: "Set", hemograma: 58, glicose: 48, tsh: 31 },
  { mes: "Out", hemograma: 61, glicose: 51, tsh: 35 },
  { mes: "Nov", hemograma: 55, glicose: 47, tsh: 32 },
  { mes: "Dez", hemograma: 71, glicose: 63, tsh: 39 },
];

const convenios = [
  { value: "all", label: "Todos" },
  { value: "unimed", label: "Unimed" },
  { value: "bradesco", label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica" },
  { value: "amil", label: "Amil" },
];

const setores = [
  { value: "all", label: "Todos" },
  { value: "bioquimica", label: "Bioquímica" },
  { value: "hematologia", label: "Hematologia" },
  { value: "hormonios", label: "Hormônios" },
  { value: "imunologia", label: "Imunologia" },
  { value: "microbiologia", label: "Microbiologia" },
];

const chartConfig = {
  quantidade: {
    label: "Quantidade",
    color: "hsl(var(--primary))",
  },
  hemograma: {
    label: "Hemograma",
    color: "hsl(var(--primary))",
  },
  glicose: {
    label: "Glicose",
    color: "hsl(var(--verde-clinico))",
  },
  tsh: {
    label: "TSH",
    color: "hsl(var(--ambar-suave))",
  },
};

const RelatorioExamesServicos = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [convenio, setConvenio] = useState("all");
  const [tipoExame, setTipoExame] = useState("");
  const [setor, setSetor] = useState("all");
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [data, setData] = useState(mockData);

  const handleFiltrar = () => {
    setLoading(true);
    setTimeout(() => {
      setFiltered(true);
      setLoading(false);
      toast({ title: "Filtros aplicados", description: "Relatório atualizado com sucesso." });
    }, 800);
  };

  const handleLimpar = () => {
    setDataInicial(undefined);
    setDataFinal(undefined);
    setConvenio("all");
    setTipoExame("");
    setSetor("all");
    setFiltered(false);
  };

  const handleExportPDF = () => {
    toast({ title: "Exportando PDF", description: "O arquivo será baixado em instantes." });
  };

  const handleExportExcel = () => {
    toast({ title: "Exportando Excel", description: "O arquivo será baixado em instantes." });
  };

  // Chart data for bar chart
  const barChartData = [...data]
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 8)
    .map((item) => ({
      name: item.exame.length > 15 ? item.exame.substring(0, 15) + "..." : item.exame,
      quantidade: item.quantidade,
    }));

  // Calculate totals
  const totals = data.reduce((acc, row) => ({
    quantidade: acc.quantidade + row.quantidade,
    valorTotal: acc.valorTotal + row.valorTotal,
  }), { quantidade: 0, valorTotal: 0 });

  return (
    <div className="min-h-screen bg-background flex">
      <FaturamentoSidebar />
      <div className="flex-1 flex flex-col">
        <FaturamentoNavbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Quantidade de Exames por Serviços</h1>
            <p className="text-muted-foreground mt-1">
              Volume de exames realizados por tipo de serviço/setor
            </p>
          </div>

          {/* Filters Card */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Data Inicial */}
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataInicial && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicial ? format(dataInicial, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataInicial}
                        onSelect={setDataInicial}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data Final */}
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataFinal && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFinal ? format(dataFinal, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataFinal}
                        onSelect={setDataFinal}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Convênio */}
                <div className="space-y-2">
                  <Label>Convênio</Label>
                  <Select value={convenio} onValueChange={setConvenio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {convenios.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Exame */}
                <div className="space-y-2">
                  <Label>Tipo de Exame</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={tipoExame}
                    onChange={(e) => setTipoExame(e.target.value)}
                  />
                </div>

                {/* Setor / Serviço */}
                <div className="space-y-2">
                  <Label>Setor / Serviço</Label>
                  <Select value={setor} onValueChange={setSetor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {setores.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={handleFiltrar} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
                  Filtrar
                </Button>
                <Button variant="outline" onClick={handleLimpar}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <div className="flex-1" />
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={handleExportExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filtered ? (
            <div className="space-y-6">
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Volume por Exame */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Volume por Exame</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} layout="vertical" margin={{ left: 100, right: 20 }}>
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fontSize: 11 }}
                            width={100}
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => [`${value} exames`, "Quantidade"]}
                              />
                            }
                          />
                          <Bar dataKey="quantidade" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Line Chart - Evolução Temporal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Evolução Temporal (Últimos 6 meses)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTimeData} margin={{ left: 10, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value, name) => [`${value} exames`, name]}
                              />
                            }
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="hemograma" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Hemograma"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="glicose" 
                            stroke="hsl(var(--verde-clinico))" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Glicose"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="tsh" 
                            stroke="hsl(var(--ambar-suave))" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="TSH"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Table */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Detalhamento por Exame/Serviço</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Exame / Serviço</TableHead>
                          <TableHead className="text-right">Quantidade Realizada</TableHead>
                          <TableHead className="text-right">Valor Total</TableHead>
                          <TableHead className="text-right">Média por Mês</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.exame}</TableCell>
                            <TableCell className="text-right">{row.quantidade}</TableCell>
                            <TableCell className="text-right">
                              {row.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {row.mediaPeriodo}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-muted/80 font-bold">
                          <TableCell>TOTAL</TableCell>
                          <TableCell className="text-right">{totals.quantidade}</TableCell>
                          <TableCell className="text-right">
                            {totals.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">—</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Aplique os filtros</h3>
                <p className="text-muted-foreground max-w-md">
                  Selecione os filtros desejados e clique em "Filtrar" para visualizar os dados do relatório.
                </p>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default RelatorioExamesServicos;

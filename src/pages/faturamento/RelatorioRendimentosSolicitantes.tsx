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
import { CalendarIcon, Filter, X, Loader2, FileText, FileSpreadsheet, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

// Mock data
const mockData = [
  { id: 1, medico: "Dr. Carlos Mendes", totalGuias: 45, totalExames: 128, valorFaturado: 15680.50, valorRecebido: 15360.50, percentualGlosa: 2.04 },
  { id: 2, medico: "Dra. Ana Paula", totalGuias: 32, totalExames: 89, valorFaturado: 11250.00, valorRecebido: 11250.00, percentualGlosa: 0 },
  { id: 3, medico: "Dr. Roberto Silva", totalGuias: 28, totalExames: 67, valorFaturado: 8920.75, valorRecebido: 8740.50, percentualGlosa: 2.02 },
  { id: 4, medico: "Dra. Mariana Costa", totalGuias: 51, totalExames: 142, valorFaturado: 19450.00, valorRecebido: 19000.00, percentualGlosa: 2.31 },
  { id: 5, medico: "Dr. Fernando Gomes", totalGuias: 19, totalExames: 45, valorFaturado: 5890.00, valorRecebido: 5890.00, percentualGlosa: 0 },
  { id: 6, medico: "Dra. Juliana Alves", totalGuias: 38, totalExames: 95, valorFaturado: 12340.00, valorRecebido: 11890.00, percentualGlosa: 3.65 },
];

const convenios = [
  { value: "all", label: "Todos" },
  { value: "unimed", label: "Unimed" },
  { value: "bradesco", label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica" },
  { value: "amil", label: "Amil" },
];

const chartConfig = {
  valorFaturado: {
    label: "Valor Faturado",
    color: "hsl(var(--primary))",
  },
};

const RelatorioRendimentosSolicitantes = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [medico, setMedico] = useState("");
  const [convenio, setConvenio] = useState("all");
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
    setMedico("");
    setConvenio("all");
    setFiltered(false);
  };

  const handleExportPDF = () => {
    toast({ title: "Exportando PDF", description: "O arquivo será baixado em instantes." });
  };

  const handleExportExcel = () => {
    toast({ title: "Exportando Excel", description: "O arquivo será baixado em instantes." });
  };

  // Sort by valor faturado for chart
  const chartData = [...data]
    .sort((a, b) => b.valorFaturado - a.valorFaturado)
    .slice(0, 10)
    .map((item) => ({
      name: item.medico.replace("Dr. ", "").replace("Dra. ", ""),
      valor: item.valorFaturado,
    }));

  // Calculate totals
  const totals = data.reduce((acc, row) => ({
    totalGuias: acc.totalGuias + row.totalGuias,
    totalExames: acc.totalExames + row.totalExames,
    valorFaturado: acc.valorFaturado + row.valorFaturado,
    valorRecebido: acc.valorRecebido + row.valorRecebido,
  }), { totalGuias: 0, totalExames: 0, valorFaturado: 0, valorRecebido: 0 });

  const mediaGlosa = data.length > 0 
    ? data.reduce((acc, row) => acc + row.percentualGlosa, 0) / data.length 
    : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <FaturamentoSidebar />
      <div className="flex-1 flex flex-col">
        <FaturamentoNavbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Rendimentos por Solicitantes</h1>
            <p className="text-muted-foreground mt-1">
              Análise de faturamento e glosas por médico solicitante
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Médico Solicitante */}
                <div className="space-y-2">
                  <Label>Médico Solicitante</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={medico}
                    onChange={(e) => setMedico(e.target.value)}
                  />
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
              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ranking de Faturamento por Solicitante</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent 
                              formatter={(value) => [
                                (value as number).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                                "Valor Faturado"
                              ]}
                            />
                          }
                        />
                        <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? "hsl(var(--verde-clinico))" : "hsl(var(--primary))"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Table */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Detalhamento por Solicitante</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Médico</TableHead>
                          <TableHead className="text-right">Total Guias</TableHead>
                          <TableHead className="text-right">Total Exames</TableHead>
                          <TableHead className="text-right">Valor Faturado</TableHead>
                          <TableHead className="text-right">Valor Recebido</TableHead>
                          <TableHead className="text-right">% Glosa</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.medico}</TableCell>
                            <TableCell className="text-right">{row.totalGuias}</TableCell>
                            <TableCell className="text-right">{row.totalExames}</TableCell>
                            <TableCell className="text-right">
                              {row.valorFaturado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell className="text-right font-medium text-verde-clinico">
                              {row.valorRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={cn(
                                "inline-flex items-center gap-1 font-medium",
                                row.percentualGlosa > 2 ? "text-destructive" : row.percentualGlosa > 0 ? "text-ambar-suave" : "text-verde-clinico"
                              )}>
                                {row.percentualGlosa > 0 ? (
                                  <TrendingDown className="h-3 w-3" />
                                ) : (
                                  <TrendingUp className="h-3 w-3" />
                                )}
                                {row.percentualGlosa.toFixed(2)}%
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="bg-muted/80 font-bold">
                          <TableCell>TOTAL</TableCell>
                          <TableCell className="text-right">{totals.totalGuias}</TableCell>
                          <TableCell className="text-right">{totals.totalExames}</TableCell>
                          <TableCell className="text-right">
                            {totals.valorFaturado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className="text-right text-verde-clinico">
                            {totals.valorRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn(
                              "font-medium",
                              mediaGlosa > 2 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {mediaGlosa.toFixed(2)}% (média)
                            </span>
                          </TableCell>
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

export default RelatorioRendimentosSolicitantes;

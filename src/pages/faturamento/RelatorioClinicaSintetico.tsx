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
import { CalendarIcon, Download, FileSpreadsheet, Filter, X, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockData = [
  { id: 1, medicoClinica: "Dr. Carlos Mendes / Clínica Saúde Plena", qtdGuias: 45, qtdExames: 128, valorFaturado: 15680.50, valorGlosado: 320.00, valorRecebido: 15360.50 },
  { id: 2, medicoClinica: "Dra. Ana Paula / Hospital Central", qtdGuias: 32, qtdExames: 89, valorFaturado: 11250.00, valorGlosado: 0, valorRecebido: 11250.00 },
  { id: 3, medicoClinica: "Dr. Roberto Silva / Clínica Vida", qtdGuias: 28, qtdExames: 67, valorFaturado: 8920.75, valorGlosado: 180.25, valorRecebido: 8740.50 },
  { id: 4, medicoClinica: "Dra. Mariana Costa / Centro Médico", qtdGuias: 51, qtdExames: 142, valorFaturado: 19450.00, valorGlosado: 450.00, valorRecebido: 19000.00 },
  { id: 5, medicoClinica: "Dr. Fernando Gomes / Lab Diagnóstico", qtdGuias: 19, qtdExames: 45, valorFaturado: 5890.00, valorGlosado: 0, valorRecebido: 5890.00 },
];

const situacoes = [
  { value: "all", label: "Todas" },
  { value: "AB", label: "Aberto" },
  { value: "PC", label: "Parcialmente Conferido" },
  { value: "FD", label: "Fechado" },
];

const convenios = [
  { value: "all", label: "Todos" },
  { value: "unimed", label: "Unimed" },
  { value: "bradesco", label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica" },
  { value: "amil", label: "Amil" },
];

const RelatorioClinicaSintetico = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [convenio, setConvenio] = useState("all");
  const [clinica, setClinica] = useState("");
  const [medico, setMedico] = useState("");
  const [situacao, setSituacao] = useState("all");
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
    setClinica("");
    setMedico("");
    setSituacao("all");
    setFiltered(false);
  };

  const handleExportPDF = () => {
    toast({ title: "Exportando PDF", description: "O arquivo será baixado em instantes." });
  };

  const handleExportExcel = () => {
    toast({ title: "Exportando Excel", description: "O arquivo será baixado em instantes." });
  };

  // Calculate totals
  const totals = data.reduce((acc, row) => ({
    qtdGuias: acc.qtdGuias + row.qtdGuias,
    qtdExames: acc.qtdExames + row.qtdExames,
    valorFaturado: acc.valorFaturado + row.valorFaturado,
    valorGlosado: acc.valorGlosado + row.valorGlosado,
    valorRecebido: acc.valorRecebido + row.valorRecebido,
  }), { qtdGuias: 0, qtdExames: 0, valorFaturado: 0, valorGlosado: 0, valorRecebido: 0 });

  return (
    <div className="min-h-screen bg-background flex">
      <FaturamentoSidebar />
      <div className="flex-1 flex flex-col">
        <FaturamentoNavbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Faturamento Clínica / Médico – Sintético</h1>
            <p className="text-muted-foreground mt-1">
              Visão consolidada do faturamento por médico e clínica
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

                {/* Clínica */}
                <div className="space-y-2">
                  <Label>Clínica / Unidade</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={clinica}
                    onChange={(e) => setClinica(e.target.value)}
                  />
                </div>

                {/* Médico */}
                <div className="space-y-2">
                  <Label>Médico Solicitante</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={medico}
                    onChange={(e) => setMedico(e.target.value)}
                  />
                </div>

                {/* Situação */}
                <div className="space-y-2">
                  <Label>Situação</Label>
                  <Select value={situacao} onValueChange={setSituacao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {situacoes.map((s) => (
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
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Resultados</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Médico / Clínica</TableHead>
                        <TableHead className="text-right">Qtd. Guias</TableHead>
                        <TableHead className="text-right">Qtd. Exames</TableHead>
                        <TableHead className="text-right">Valor Faturado</TableHead>
                        <TableHead className="text-right">Valor Glosado</TableHead>
                        <TableHead className="text-right">Valor Recebido</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.medicoClinica}</TableCell>
                          <TableCell className="text-right">{row.qtdGuias}</TableCell>
                          <TableCell className="text-right">{row.qtdExames}</TableCell>
                          <TableCell className="text-right">
                            {row.valorFaturado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className={cn("text-right", row.valorGlosado > 0 && "text-destructive")}>
                            {row.valorGlosado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className="text-right font-medium text-verde-clinico">
                            {row.valorRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-muted/80 font-bold">
                        <TableCell>TOTAL</TableCell>
                        <TableCell className="text-right">{totals.qtdGuias}</TableCell>
                        <TableCell className="text-right">{totals.qtdExames}</TableCell>
                        <TableCell className="text-right">
                          {totals.valorFaturado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                        <TableCell className={cn("text-right", totals.valorGlosado > 0 && "text-destructive")}>
                          {totals.valorGlosado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                        <TableCell className="text-right text-verde-clinico">
                          {totals.valorRecebido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
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

export default RelatorioClinicaSintetico;

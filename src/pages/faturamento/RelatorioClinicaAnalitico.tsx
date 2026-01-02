import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import FaturamentoNavbar from "@/components/faturamento/FaturamentoNavbar";
import FaturamentoSidebar from "@/components/faturamento/FaturamentoSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X, Loader2, FileText, FileSpreadsheet, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type GuiaItem = {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  situacao: string;
};

type Guia = {
  id: number;
  dataAtendimento: string;
  numeroGuia: string;
  paciente: string;
  medico: string;
  convenio: string;
  exames: GuiaItem[];
  valorCobrado: number;
  valorGlosado: number;
  situacao: string;
};

// Mock data
const mockData: Guia[] = [
  {
    id: 1,
    dataAtendimento: "02/01/2026",
    numeroGuia: "G-2026-00145",
    paciente: "Maria Silva Santos",
    medico: "Dr. Carlos Mendes",
    convenio: "Unimed",
    valorCobrado: 450.00,
    valorGlosado: 0,
    situacao: "FT",
    exames: [
      { codigo: "40301630", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "FT" },
      { codigo: "40302040", descricao: "Glicose", quantidade: 1, valorUnitario: 15.00, valorTotal: 15.00, situacao: "FT" },
      { codigo: "40302067", descricao: "Ureia", quantidade: 1, valorUnitario: 12.00, valorTotal: 12.00, situacao: "FT" },
    ]
  },
  {
    id: 2,
    dataAtendimento: "02/01/2026",
    numeroGuia: "G-2026-00146",
    paciente: "João Pedro Oliveira",
    medico: "Dra. Ana Paula",
    convenio: "Bradesco Saúde",
    valorCobrado: 320.50,
    valorGlosado: 45.00,
    situacao: "GP",
    exames: [
      { codigo: "40301630", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "FT" },
      { codigo: "40304361", descricao: "TSH", quantidade: 1, valorUnitario: 45.00, valorTotal: 45.00, situacao: "GP" },
    ]
  },
  {
    id: 3,
    dataAtendimento: "03/01/2026",
    numeroGuia: "G-2026-00147",
    paciente: "Ana Clara Costa",
    medico: "Dr. Roberto Silva",
    convenio: "SulAmérica",
    valorCobrado: 580.00,
    valorGlosado: 0,
    situacao: "FT",
    exames: [
      { codigo: "40301630", descricao: "Hemograma Completo", quantidade: 1, valorUnitario: 25.00, valorTotal: 25.00, situacao: "FT" },
      { codigo: "40302040", descricao: "Glicose", quantidade: 1, valorUnitario: 15.00, valorTotal: 15.00, situacao: "FT" },
      { codigo: "40304361", descricao: "TSH", quantidade: 1, valorUnitario: 45.00, valorTotal: 45.00, situacao: "FT" },
      { codigo: "40304370", descricao: "T4 Livre", quantidade: 1, valorUnitario: 38.00, valorTotal: 38.00, situacao: "FT" },
    ]
  },
];

const situacoes = [
  { value: "all", label: "Todas" },
  { value: "PD", label: "Pendente" },
  { value: "FT", label: "Faturado" },
  { value: "GP", label: "Glosa Parcial" },
  { value: "GT", label: "Glosa Total" },
  { value: "RC", label: "Recebido" },
];

const convenios = [
  { value: "all", label: "Todos" },
  { value: "unimed", label: "Unimed" },
  { value: "bradesco", label: "Bradesco Saúde" },
  { value: "sulamerica", label: "SulAmérica" },
  { value: "amil", label: "Amil" },
];

const agrupamentos = [
  { value: "none", label: "Sem agrupamento" },
  { value: "clinica", label: "Por Clínica" },
  { value: "medico", label: "Por Médico" },
];

const getSituacaoBadge = (situacao: string) => {
  const config: Record<string, { label: string; className: string }> = {
    PD: { label: "Pendente", className: "bg-ambar-suave/10 text-ambar-suave border-ambar-suave/20" },
    FT: { label: "Faturado", className: "bg-primary/10 text-primary border-primary/20" },
    GP: { label: "Glosa Parcial", className: "bg-destructive/10 text-destructive border-destructive/20" },
    GT: { label: "Glosa Total", className: "bg-destructive/20 text-destructive border-destructive/30" },
    RC: { label: "Recebido", className: "bg-verde-clinico/10 text-verde-clinico border-verde-clinico/20" },
  };
  return config[situacao] || { label: situacao, className: "bg-muted text-muted-foreground" };
};

const RelatorioClinicaAnalitico = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [convenio, setConvenio] = useState("all");
  const [clinica, setClinica] = useState("");
  const [medico, setMedico] = useState("");
  const [situacao, setSituacao] = useState("all");
  const [agrupamento, setAgrupamento] = useState("none");
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [data, setData] = useState(mockData);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

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
    setAgrupamento("none");
    setFiltered(false);
    setExpandedRows(new Set());
  };

  const handleExportPDF = () => {
    toast({ title: "Exportando PDF", description: "O arquivo será baixado em instantes." });
  };

  const handleExportExcel = () => {
    toast({ title: "Exportando Excel", description: "O arquivo será baixado em instantes." });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <FaturamentoSidebar />
      <div className="flex-1 flex flex-col">
        <FaturamentoNavbar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Faturamento Clínica – Analítico</h1>
            <p className="text-muted-foreground mt-1">
              Detalhamento completo por guia e procedimento
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  <Label>Clínica</Label>
                  <Input
                    placeholder="Digite o nome"
                    value={clinica}
                    onChange={(e) => setClinica(e.target.value)}
                  />
                </div>

                {/* Médico */}
                <div className="space-y-2">
                  <Label>Médico</Label>
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

                {/* Agrupamento */}
                <div className="space-y-2">
                  <Label>Agrupamento</Label>
                  <Select value={agrupamento} onValueChange={setAgrupamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {agrupamentos.map((a) => (
                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
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
                <CardTitle className="text-base">Resultados ({data.length} guias)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Data Atend.</TableHead>
                        <TableHead>Nº Guia</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Médico</TableHead>
                        <TableHead>Convênio</TableHead>
                        <TableHead className="text-right">Valor Cobrado</TableHead>
                        <TableHead className="text-right">Valor Glosado</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((guia) => {
                        const isExpanded = expandedRows.has(guia.id);
                        const situacaoConfig = getSituacaoBadge(guia.situacao);
                        return (
                          <>
                            <TableRow 
                              key={guia.id} 
                              className={cn(
                                "cursor-pointer hover:bg-muted/50",
                                guia.valorGlosado > 0 && "bg-destructive/5"
                              )}
                              onClick={() => toggleRow(guia.id)}
                            >
                              <TableCell>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>{guia.dataAtendimento}</TableCell>
                              <TableCell className="font-mono text-sm">{guia.numeroGuia}</TableCell>
                              <TableCell className="font-medium">{guia.paciente}</TableCell>
                              <TableCell>{guia.medico}</TableCell>
                              <TableCell>{guia.convenio}</TableCell>
                              <TableCell className="text-right">
                                {guia.valorCobrado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </TableCell>
                              <TableCell className={cn("text-right", guia.valorGlosado > 0 && "text-destructive font-medium")}>
                                {guia.valorGlosado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={situacaoConfig.className}>
                                  {situacaoConfig.label}
                                </Badge>
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow>
                                <TableCell colSpan={9} className="bg-muted/30 p-0">
                                  <div className="p-4">
                                    <p className="text-sm font-medium text-muted-foreground mb-3">Itens da Guia</p>
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-background/50">
                                          <TableHead>Código</TableHead>
                                          <TableHead>Descrição</TableHead>
                                          <TableHead className="text-center">Qtd.</TableHead>
                                          <TableHead className="text-right">Valor Unit.</TableHead>
                                          <TableHead className="text-right">Valor Total</TableHead>
                                          <TableHead>Situação</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {guia.exames.map((item, idx) => {
                                          const itemSituacao = getSituacaoBadge(item.situacao);
                                          return (
                                            <TableRow key={idx}>
                                              <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                                              <TableCell>{item.descricao}</TableCell>
                                              <TableCell className="text-center">{item.quantidade}</TableCell>
                                              <TableCell className="text-right">
                                                {item.valorUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                {item.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                              </TableCell>
                                              <TableCell>
                                                <Badge variant="outline" className={cn("text-xs", itemSituacao.className)}>
                                                  {itemSituacao.label}
                                                </Badge>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
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

export default RelatorioClinicaAnalitico;

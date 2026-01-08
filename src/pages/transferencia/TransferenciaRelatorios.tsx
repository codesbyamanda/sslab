import { useState } from "react";
import { FileText, Filter, Download, FileSpreadsheet, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const relatorioPeriodo = [
  { periodo: "Janeiro 2026", exportacoes: 45, importacoes: 38, total: 83 },
  { periodo: "Dezembro 2025", exportacoes: 52, importacoes: 41, total: 93 },
  { periodo: "Novembro 2025", exportacoes: 48, importacoes: 35, total: 83 },
  { periodo: "Outubro 2025", exportacoes: 55, importacoes: 42, total: 97 }
];

const relatorioParceiro = [
  { parceiro: "Lab Apoio Central", exportacoes: 85, importacoes: 72, erros: 5 },
  { parceiro: "Lab Análises Clínicas", exportacoes: 62, importacoes: 48, erros: 3 },
  { parceiro: "Clínica São Paulo", exportacoes: 45, importacoes: 32, erros: 2 },
  { parceiro: "Hospital Regional", exportacoes: 38, importacoes: 28, erros: 1 }
];

const relatorioErros = [
  { tipo: "Timeout de conexão", quantidade: 12, percentual: "35%" },
  { tipo: "Exame não mapeado", quantidade: 8, percentual: "23%" },
  { tipo: "Dados inválidos", quantidade: 6, percentual: "17%" },
  { tipo: "Paciente não encontrado", quantidade: 5, percentual: "14%" },
  { tipo: "Outros", quantidade: 4, percentual: "11%" }
];

const relatorioVolume = [
  { parceiro: "Lab Apoio Central", requisicoes: 320, laudos: 285, amostras: 410 },
  { parceiro: "Lab Análises Clínicas", requisicoes: 180, laudos: 165, amostras: 220 },
  { parceiro: "Clínica São Paulo", requisicoes: 95, laudos: 88, amostras: 120 },
  { parceiro: "Hospital Regional", requisicoes: 75, laudos: 68, amostras: 95 }
];

const TransferenciaRelatorios = () => {
  const [parceiroFilter, setParceiroFilter] = useState("todos");
  const [tipoOperacaoFilter, setTipoOperacaoFilter] = useState("todos");
  const [tipoDadosFilter, setTipoDadosFilter] = useState("todos");

  const handleExportPDF = () => {
    toast.success("Relatório exportado em PDF!");
  };

  const handleExportExcel = () => {
    toast.success("Relatório exportado em Excel!");
  };

  const handlePrint = () => {
    toast.success("Enviando para impressão...");
  };

  return (
    <TransferenciaLayout title="Relatórios">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Relatórios de Integrações
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Análises e consolidações de transferências
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input type="date" className="w-40" defaultValue="2025-10-01" />
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input type="date" className="w-40" defaultValue="2026-01-08" />
              </div>
              <div className="space-y-2">
                <Label>Parceiro</Label>
                <Select value={parceiroFilter} onValueChange={setParceiroFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="lab_apoio">Lab Apoio Central</SelectItem>
                    <SelectItem value="lab_analises">Lab Análises Clínicas</SelectItem>
                    <SelectItem value="clinica_sp">Clínica São Paulo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Operação</Label>
                <Select value={tipoOperacaoFilter} onValueChange={setTipoOperacaoFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="exportacao">Exportação</SelectItem>
                    <SelectItem value="importacao">Importação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Dado</Label>
                <Select value={tipoDadosFilter} onValueChange={setTipoDadosFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="requisicoes">Requisições</SelectItem>
                    <SelectItem value="laudos">Laudos</SelectItem>
                    <SelectItem value="amostras">Amostras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="secondary">Aplicar Filtros</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports */}
        <Tabs defaultValue="periodo">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="periodo">Por Período</TabsTrigger>
            <TabsTrigger value="parceiro">Por Parceiro</TabsTrigger>
            <TabsTrigger value="erros">Erros</TabsTrigger>
            <TabsTrigger value="volume">Volume de Exames</TabsTrigger>
          </TabsList>

          <TabsContent value="periodo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transferências por Período</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Exportações</TableHead>
                      <TableHead className="text-right">Importações</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioPeriodo.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.periodo}</TableCell>
                        <TableCell className="text-right text-blue-600">{item.exportacoes}</TableCell>
                        <TableCell className="text-right text-purple-600">{item.importacoes}</TableCell>
                        <TableCell className="text-right font-semibold">{item.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {relatorioPeriodo.reduce((acc, item) => acc + item.exportacoes, 0)}
                      </TableCell>
                      <TableCell className="text-right text-purple-600">
                        {relatorioPeriodo.reduce((acc, item) => acc + item.importacoes, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {relatorioPeriodo.reduce((acc, item) => acc + item.total, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parceiro" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transferências por Parceiro</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead className="text-right">Exportações</TableHead>
                      <TableHead className="text-right">Importações</TableHead>
                      <TableHead className="text-right">Erros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioParceiro.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.parceiro}</TableCell>
                        <TableCell className="text-right text-blue-600">{item.exportacoes}</TableCell>
                        <TableCell className="text-right text-purple-600">{item.importacoes}</TableCell>
                        <TableCell className="text-right">
                          {item.erros > 0 ? (
                            <span className="text-red-600">{item.erros}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {relatorioParceiro.reduce((acc, item) => acc + item.exportacoes, 0)}
                      </TableCell>
                      <TableCell className="text-right text-purple-600">
                        {relatorioParceiro.reduce((acc, item) => acc + item.importacoes, 0)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {relatorioParceiro.reduce((acc, item) => acc + item.erros, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="erros" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Erros de Integração</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Erro</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioErros.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.tipo}</TableCell>
                        <TableCell className="text-right text-red-600">{item.quantidade}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.percentual}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right text-red-600">
                        {relatorioErros.reduce((acc, item) => acc + item.quantidade, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge>100%</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volume" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Volume de Exames Enviados/Recebidos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead className="text-right">Requisições</TableHead>
                      <TableHead className="text-right">Laudos</TableHead>
                      <TableHead className="text-right">Amostras</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioVolume.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.parceiro}</TableCell>
                        <TableCell className="text-right">{item.requisicoes}</TableCell>
                        <TableCell className="text-right">{item.laudos}</TableCell>
                        <TableCell className="text-right">{item.amostras}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {relatorioVolume.reduce((acc, item) => acc + item.requisicoes, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {relatorioVolume.reduce((acc, item) => acc + item.laudos, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {relatorioVolume.reduce((acc, item) => acc + item.amostras, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaRelatorios;

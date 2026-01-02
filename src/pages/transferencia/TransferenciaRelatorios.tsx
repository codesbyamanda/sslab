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
  { periodo: "Janeiro 2026", internas: 32, externas: 8, total: 40 },
  { periodo: "Dezembro 2025", internas: 45, externas: 12, total: 57 },
  { periodo: "Novembro 2025", internas: 38, externas: 10, total: 48 },
  { periodo: "Outubro 2025", internas: 41, externas: 9, total: 50 }
];

const relatorioTipo = [
  { tipo: "Interna - Setor", quantidade: 85, percentual: "53%" },
  { tipo: "Interna - Unidade", quantidade: 45, percentual: "28%" },
  { tipo: "Externa - Hospital", quantidade: 22, percentual: "14%" },
  { tipo: "Externa - Clínica", quantidade: 8, percentual: "5%" }
];

const relatorioUnidade = [
  { unidade: "UTI Adulto", entradas: 45, saidas: 38, saldo: 7 },
  { unidade: "Emergência", entradas: 12, saidas: 65, saldo: -53 },
  { unidade: "Enfermaria 3", entradas: 52, saidas: 28, saldo: 24 },
  { unidade: "Centro Cirúrgico", entradas: 38, saidas: 40, saldo: -2 },
  { unidade: "Internação", entradas: 48, saidas: 15, saldo: 33 }
];

const TransferenciaRelatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState("periodo");

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
              Relatórios de Transferências
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
                <Label>Período Inicial</Label>
                <Input type="date" className="w-40" defaultValue="2025-10-01" />
              </div>
              <div className="space-y-2">
                <Label>Período Final</Label>
                <Input type="date" className="w-40" defaultValue="2026-01-02" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="interna">Interna</SelectItem>
                    <SelectItem value="externa">Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Situação</Label>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
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
        <Tabs defaultValue="periodo" onValueChange={setTipoRelatorio}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="periodo">Por Período</TabsTrigger>
            <TabsTrigger value="tipo">Por Tipo</TabsTrigger>
            <TabsTrigger value="unidade">Por Unidade</TabsTrigger>
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
                      <TableHead className="text-right">Internas</TableHead>
                      <TableHead className="text-right">Externas</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioPeriodo.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.periodo}</TableCell>
                        <TableCell className="text-right">{item.internas}</TableCell>
                        <TableCell className="text-right">{item.externas}</TableCell>
                        <TableCell className="text-right font-semibold">{item.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {relatorioPeriodo.reduce((acc, item) => acc + item.internas, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {relatorioPeriodo.reduce((acc, item) => acc + item.externas, 0)}
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

          <TabsContent value="tipo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transferências por Tipo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Transferência</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioTipo.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.tipo}</TableCell>
                        <TableCell className="text-right">{item.quantidade}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.percentual}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {relatorioTipo.reduce((acc, item) => acc + item.quantidade, 0)}
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

          <TabsContent value="unidade" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transferências por Unidade/Origem/Destino</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Entradas</TableHead>
                      <TableHead className="text-right">Saídas</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorioUnidade.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.unidade}</TableCell>
                        <TableCell className="text-right text-emerald-600">+{item.entradas}</TableCell>
                        <TableCell className="text-right text-red-600">-{item.saidas}</TableCell>
                        <TableCell className="text-right">
                          <span className={item.saldo >= 0 ? "text-emerald-600" : "text-red-600"}>
                            {item.saldo >= 0 ? `+${item.saldo}` : item.saldo}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
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

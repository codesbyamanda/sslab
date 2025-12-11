import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Pencil, Printer, Trash2, X, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";

// Mock data
const mockOrcamentos = [
  {
    id: 1,
    numero: "ORC-2024-0001",
    paciente: "Maria Silva Santos",
    convenio: "Particular",
    plano: "-",
    data: "2024-01-15",
    valorTotal: 450.00,
    situacao: "Finalizado"
  },
  {
    id: 2,
    numero: "ORC-2024-0002",
    paciente: "João Pedro Oliveira",
    convenio: "Unimed",
    plano: "Básico",
    data: "2024-01-16",
    valorTotal: 320.50,
    situacao: "Rascunho"
  },
  {
    id: 3,
    numero: "ORC-2024-0003",
    paciente: "Ana Carolina Souza",
    convenio: "Bradesco Saúde",
    plano: "Premium",
    data: "2024-01-17",
    valorTotal: 780.00,
    situacao: "Finalizado"
  },
  {
    id: 4,
    numero: "ORC-2024-0004",
    paciente: "Carlos Eduardo Lima",
    convenio: "Particular",
    plano: "-",
    data: "2024-01-18",
    valorTotal: 1250.00,
    situacao: "Rascunho"
  },
  {
    id: 5,
    numero: "ORC-2024-0005",
    paciente: "Fernanda Costa",
    convenio: "SulAmérica",
    plano: "Executivo",
    data: "2024-01-19",
    valorTotal: 560.75,
    situacao: "Finalizado"
  },
];

const Orcamentos = () => {
  const navigate = useNavigate();
  const [searchPaciente, setSearchPaciente] = useState("");
  const [convenio, setConvenio] = useState("");
  const [unidade, setUnidade] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [orcamentos, setOrcamentos] = useState(mockOrcamentos);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<typeof mockOrcamentos[0] | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleFilter = () => {
    let filtered = [...mockOrcamentos];
    
    if (searchPaciente) {
      filtered = filtered.filter(o => 
        o.paciente.toLowerCase().includes(searchPaciente.toLowerCase())
      );
    }
    
    if (convenio) {
      filtered = filtered.filter(o => o.convenio === convenio);
    }
    
    setOrcamentos(filtered);
    toast({
      title: "Filtros aplicados",
      description: `${filtered.length} orçamento(s) encontrado(s).`
    });
  };

  const handleClearFilters = () => {
    setSearchPaciente("");
    setConvenio("");
    setUnidade("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setOrcamentos(mockOrcamentos);
  };

  const handleDelete = (orcamento: typeof mockOrcamentos[0]) => {
    setSelectedOrcamento(orcamento);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrcamento) {
      setOrcamentos(orcamentos.filter(o => o.id !== selectedOrcamento.id));
      toast({
        title: "Orçamento excluído",
        description: `O orçamento ${selectedOrcamento.numero} foi excluído com sucesso.`
      });
    }
    setDeleteDialogOpen(false);
    setSelectedOrcamento(null);
  };

  const handlePrint = (orcamento: typeof mockOrcamentos[0]) => {
    setSelectedOrcamento(orcamento);
    setPrintModalOpen(true);
  };

  const handleDownloadPdf = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "PDF gerado com sucesso",
        description: "O arquivo foi baixado para sua máquina."
      });
      setPrintModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Orçamentos</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerencie e consulte simulações de preços de exames.
                </p>
              </div>
              <Button onClick={() => navigate("/atendimento/orcamento/novo")} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Orçamento
              </Button>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Nome do Paciente
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome..."
                        value={searchPaciente}
                        onChange={(e) => setSearchPaciente(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Período
                    </label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal flex-1",
                              !dateFrom && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "dd/MM/yy") : "De"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal flex-1",
                              !dateTo && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "dd/MM/yy") : "Até"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Convênio
                    </label>
                    <Select value={convenio} onValueChange={setConvenio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Particular">Particular</SelectItem>
                        <SelectItem value="Unimed">Unimed</SelectItem>
                        <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                        <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                      Unidade
                    </label>
                    <Select value={unidade} onValueChange={setUnidade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="matriz">Matriz</SelectItem>
                        <SelectItem value="filial1">Filial Centro</SelectItem>
                        <SelectItem value="filial2">Filial Norte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <Button onClick={handleFilter} className="gap-2">
                    <Search className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabela */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Lista de Orçamentos</CardTitle>
                <CardDescription>
                  {orcamentos.length} orçamento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Nº Orçamento</TableHead>
                        <TableHead className="font-semibold">Paciente</TableHead>
                        <TableHead className="font-semibold">Convênio / Plano</TableHead>
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold text-right">Valor Total</TableHead>
                        <TableHead className="font-semibold text-center">Situação</TableHead>
                        <TableHead className="font-semibold text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orcamentos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Nenhum orçamento encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        orcamentos.map((orcamento) => (
                          <TableRow key={orcamento.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{orcamento.numero}</TableCell>
                            <TableCell>{orcamento.paciente}</TableCell>
                            <TableCell>
                              {orcamento.convenio}
                              {orcamento.plano !== "-" && (
                                <span className="text-muted-foreground"> / {orcamento.plano}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {format(new Date(orcamento.data), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {orcamento.valorTotal.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={orcamento.situacao === "Finalizado" ? "default" : "secondary"}
                                className={cn(
                                  orcamento.situacao === "Finalizado" 
                                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" 
                                    : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                )}
                              >
                                {orcamento.situacao}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/atendimento/orcamento/${orcamento.id}`)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handlePrint(orcamento)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(orcamento)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir o orçamento <strong>{selectedOrcamento?.numero}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Modal */}
      <Dialog open={printModalOpen} onOpenChange={setPrintModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Impressão do Orçamento
            </DialogTitle>
            <DialogDescription>
              Visualize o resumo e baixe o PDF do orçamento.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrcamento && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Número:</span>
                  <span className="text-sm font-medium">{selectedOrcamento.numero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Paciente:</span>
                  <span className="text-sm font-medium">{selectedOrcamento.paciente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Convênio:</span>
                  <span className="text-sm font-medium">{selectedOrcamento.convenio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(selectedOrcamento.data), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Valor Total:</span>
                  <span className="text-base font-semibold text-primary">
                    R$ {selectedOrcamento.valorTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isPrinting} className="gap-2">
              {isPrinting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;

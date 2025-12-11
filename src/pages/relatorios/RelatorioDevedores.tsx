import { useState } from "react";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon,
  AlertCircle,
  Download,
  X,
  Loader2,
  CheckCircle
} from "lucide-react";

const RelatorioDevedores = () => {
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [empresa, setEmpresa] = useState("");
  const [convenio, setConvenio] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleLimpar = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setEmpresa("");
    setConvenio("");
  };

  const handleGerarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      toast({
        title: "Período obrigatório",
        description: "Informe a data inicial e final do período de movimento.",
        variant: "destructive"
      });
      return;
    }

    setShowModal(true);
    setIsGenerating(true);
    setIsGenerated(false);

    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O arquivo PDF está sendo baixado.",
    });
    setShowModal(false);
    setIsGenerated(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Devedores
            </h1>
            <p className="text-muted-foreground mt-1">
              Selecione os filtros para gerar o relatório de pacientes com pendências financeiras.
            </p>
          </div>

          {/* Card de Filtros */}
          <Card className="border-border/50 max-w-4xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Filtros do Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Início */}
                <div className="space-y-2">
                  <Label className="text-sm">Período Movimento - Início *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataInicio && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data Fim */}
                <div className="space-y-2">
                  <Label className="text-sm">Período Movimento - Fim *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataFim && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Empresa / Unidade */}
                <div className="space-y-2">
                  <Label className="text-sm">Empresa / Unidade</Label>
                  <Select value={empresa} onValueChange={setEmpresa}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as empresas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as empresas</SelectItem>
                      <SelectItem value="matriz">Unidade Matriz</SelectItem>
                      <SelectItem value="filial-centro">Filial Centro</SelectItem>
                      <SelectItem value="filial-sul">Filial Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Convênio */}
                <div className="space-y-2">
                  <Label className="text-sm">Convênio</Label>
                  <Select value={convenio} onValueChange={setConvenio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os convênios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os convênios</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="unimed">Unimed</SelectItem>
                      <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" onClick={handleLimpar}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
                <Button onClick={handleGerarRelatorio}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modal de Geração */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerando Relatório</DialogTitle>
                <DialogDescription>
                  Devedores - {dataInicio && format(dataInicio, "dd/MM/yyyy")} a {dataFim && format(dataFim, "dd/MM/yyyy")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-8 flex flex-col items-center justify-center">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Processando dados...</p>
                  </>
                ) : isGenerated ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
                    <p className="text-foreground font-medium">Relatório gerado com sucesso!</p>
                    <p className="text-sm text-muted-foreground mt-1">relatorio_devedores.pdf</p>
                  </>
                ) : null}
              </div>

              <DialogFooter>
                {isGenerated && (
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default RelatorioDevedores;

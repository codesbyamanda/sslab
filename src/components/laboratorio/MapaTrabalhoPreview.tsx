import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileDown,
  Printer,
  AlertTriangle,
  Info,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface MapaGerado {
  id: string;
  numeroMapa: string;
  dataHoraGeracao: string;
  periodoInicio: string;
  periodoFim: string;
  setorBancada: string;
  unidade: string;
  modelo: string;
  qtdePacientes: number;
  qtdeExames: number;
  itensUrgentes: boolean;
  qtdeUrgentes: number;
  status: "gerado" | "impresso" | "reimpresso";
}

interface MapaTrabalhoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapa: MapaGerado;
}

// Mock data para o preview do mapa
const mockPacientesMapa = [
  {
    atendimento: "ATD-089234",
    paciente: "Maria Silva Santos",
    idade: "45 anos",
    sexo: "F",
    medico: "Dr. João Oliveira",
    exames: { COL: true, HDL: true, LDL: true, TRI: true, VLDL: true, GLI: false, HB1AC: false, TGO: false, TGP: false, GGT: false },
    urgente: true,
  },
  {
    atendimento: "ATD-089235",
    paciente: "José Carlos Pereira",
    idade: "62 anos",
    sexo: "M",
    medico: "Dra. Ana Paula",
    exames: { COL: true, HDL: true, LDL: true, TRI: true, VLDL: true, GLI: true, HB1AC: true, TGO: false, TGP: false, GGT: false },
    urgente: false,
  },
  {
    atendimento: "ATD-089236",
    paciente: "Ana Carolina Lima",
    idade: "33 anos",
    sexo: "F",
    medico: "Dr. Carlos Alberto",
    exames: { COL: false, HDL: false, LDL: false, TRI: false, VLDL: false, GLI: true, HB1AC: true, TGO: true, TGP: true, GGT: true },
    urgente: false,
  },
  {
    atendimento: "ATD-089237",
    paciente: "Pedro Henrique Costa",
    idade: "28 anos",
    sexo: "M",
    medico: "Dr. João Oliveira",
    exames: { COL: true, HDL: true, LDL: true, TRI: true, VLDL: false, GLI: true, HB1AC: false, TGO: false, TGP: false, GGT: false },
    urgente: true,
  },
  {
    atendimento: "ATD-089238",
    paciente: "Fernanda Souza",
    idade: "51 anos",
    sexo: "F",
    medico: "Dra. Marina Santos",
    exames: { COL: true, HDL: true, LDL: true, TRI: true, VLDL: true, GLI: true, HB1AC: true, TGO: true, TGP: true, GGT: true },
    urgente: false,
  },
  {
    atendimento: "ATD-089239",
    paciente: "Roberto Almeida",
    idade: "67 anos",
    sexo: "M",
    medico: "Dr. Carlos Alberto",
    exames: { COL: true, HDL: true, LDL: false, TRI: true, VLDL: false, GLI: true, HB1AC: true, TGO: false, TGP: false, GGT: false },
    urgente: false,
  },
  {
    atendimento: "ATD-089240",
    paciente: "Luciana Martins",
    idade: "39 anos",
    sexo: "F",
    medico: "Dra. Ana Paula",
    exames: { COL: false, HDL: false, LDL: false, TRI: false, VLDL: false, GLI: true, HB1AC: false, TGO: true, TGP: true, GGT: true },
    urgente: true,
  },
  {
    atendimento: "ATD-089241",
    paciente: "Marcos Vinícius",
    idade: "44 anos",
    sexo: "M",
    medico: "Dr. João Oliveira",
    exames: { COL: true, HDL: true, LDL: true, TRI: true, VLDL: true, GLI: false, HB1AC: false, TGO: false, TGP: false, GGT: false },
    urgente: false,
  },
];

const examesColunas = ["COL", "HDL", "LDL", "TRI", "VLDL", "GLI", "HB1AC", "TGO", "TGP", "GGT"];

const MapaTrabalhoPreview = ({ open, onOpenChange, mapa }: MapaTrabalhoPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavingPDF, setIsSavingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const totalPages = 3; // Mock - em produção seria calculado

  const handleSavePDF = async () => {
    setIsSavingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("PDF gerado com sucesso!", {
        description: `Mapa ${mapa.numeroMapa} salvo.`,
      });
    } catch {
      toast.error("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsSavingPDF(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Enviado para impressão!", {
        description: `Mapa ${mapa.numeroMapa}`,
      });
    } catch {
      toast.error("Não foi possível imprimir. Tente novamente.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg flex items-center gap-2">
                Preview do Mapa de Trabalho
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {mapa.numeroMapa} • {mapa.setorBancada} • Gerado em {mapa.dataHoraGeracao}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {mapa.status !== "gerado" && (
                <span className="badge-warning flex items-center gap-1 text-xs">
                  <Info className="h-3 w-3" />
                  Mapa impresso anteriormente
                </span>
              )}
              {mapa.itensUrgentes && (
                <span className="badge-error flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  {mapa.qtdeUrgentes} itens urgentes
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Document Preview */}
        <div className="flex-1 overflow-hidden bg-muted/30 p-6">
          <ScrollArea className="h-full">
            {/* Documento simulando papel A4 */}
            <div className="bg-white shadow-lg rounded-sm mx-auto" style={{ width: "100%", maxWidth: "1200px" }}>
              {/* Cabeçalho do Documento */}
              <div className="border-b-2 border-foreground p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-foreground">LABORATÓRIO CENTRAL SAÚDE</h1>
                    <p className="text-sm text-muted-foreground">Análises Clínicas e Diagnósticos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Mapa:</span> {mapa.numeroMapa}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Gerado:</span> {mapa.dataHoraGeracao}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-x-8 gap-y-1 text-xs">
                  <span>
                    <span className="font-semibold">Unidade:</span> {mapa.unidade}
                  </span>
                  <span>
                    <span className="font-semibold">Setor/Bancada:</span> {mapa.setorBancada}
                  </span>
                  <span>
                    <span className="font-semibold">Período:</span>{" "}
                    {mapa.periodoInicio === mapa.periodoFim
                      ? mapa.periodoInicio
                      : `${mapa.periodoInicio} a ${mapa.periodoFim}`}
                  </span>
                  <span>
                    <span className="font-semibold">Modelo:</span> {mapa.modelo}
                  </span>
                  <span className="ml-auto">
                    <span className="font-semibold">Página:</span> {currentPage}/{totalPages}
                  </span>
                </div>
              </div>

              {/* Título da Seção */}
              <div className="px-4 py-2 bg-muted/50 border-b">
                <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  MAPA DE TRABALHO - {mapa.setorBancada.split("/")[0]?.trim()}
                </h2>
              </div>

              {/* Grade de Exames */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-2 py-2 text-left font-semibold w-24">
                        Nº Atend.
                      </th>
                      <th className="border border-border px-2 py-2 text-left font-semibold min-w-[180px]">
                        Paciente
                      </th>
                      <th className="border border-border px-2 py-2 text-center font-semibold w-16">
                        Idade
                      </th>
                      <th className="border border-border px-2 py-2 text-center font-semibold w-10">
                        Sexo
                      </th>
                      <th className="border border-border px-2 py-2 text-left font-semibold min-w-[140px]">
                        Médico
                      </th>
                      {examesColunas.map((exame) => (
                        <th
                          key={exame}
                          className="border border-border px-1 py-2 text-center font-bold w-12 bg-primary/5"
                        >
                          {exame}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockPacientesMapa.map((paciente, index) => (
                      <tr
                        key={paciente.atendimento}
                        className={`
                          ${index % 2 === 0 ? "bg-white" : "bg-muted/20"}
                          ${paciente.urgente ? "bg-vermelho-moderno/5" : ""}
                        `}
                      >
                        <td className="border border-border px-2 py-1.5 font-mono text-xs">
                          <div className="flex items-center gap-1">
                            {paciente.urgente && (
                              <AlertTriangle className="h-3 w-3 text-vermelho-moderno shrink-0" />
                            )}
                            {paciente.atendimento}
                          </div>
                        </td>
                        <td className="border border-border px-2 py-1.5 font-medium">
                          {paciente.paciente}
                        </td>
                        <td className="border border-border px-2 py-1.5 text-center">
                          {paciente.idade}
                        </td>
                        <td className="border border-border px-2 py-1.5 text-center font-medium">
                          {paciente.sexo}
                        </td>
                        <td className="border border-border px-2 py-1.5 text-muted-foreground">
                          {paciente.medico}
                        </td>
                        {examesColunas.map((exame) => (
                          <td
                            key={exame}
                            className="border border-border px-1 py-1.5 text-center"
                          >
                            {paciente.exames[exame as keyof typeof paciente.exames] ? (
                              <div className="w-4 h-4 border-2 border-foreground rounded-sm mx-auto" />
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé do Documento */}
              <div className="p-4 border-t-2 border-foreground mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold">Total:</span> {mapa.qtdePacientes} pacientes
                    • {mapa.qtdeExames} exames
                    {mapa.itensUrgentes && (
                      <span className="text-vermelho-moderno ml-2">
                        • {mapa.qtdeUrgentes} urgentes
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p>Saúde Systems - Laboratório</p>
                    <p>Impresso em: {new Date().toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer com Ações */}
        <div className="px-6 py-4 border-t bg-background shrink-0">
          <div className="flex items-center justify-between">
            {/* Paginação */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
              <Button
                variant="outline"
                onClick={handleSavePDF}
                disabled={isSavingPDF}
              >
                {isSavingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                Salvar PDF
              </Button>
              <Button
                onClick={handlePrint}
                disabled={isPrinting}
                className="btn-primary-premium"
              >
                {isPrinting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapaTrabalhoPreview;

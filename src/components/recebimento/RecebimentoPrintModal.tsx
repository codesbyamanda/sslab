import { useState } from "react";
import { Printer, X, Tag, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { AmostraColhida } from "@/pages/RecebimentoDetalhe";

interface RecebimentoPrintModalProps {
  open: boolean;
  onClose: () => void;
  requisicaoNumero: string;
  pacienteNome: string;
  amostras: AmostraColhida[];
}

const RecebimentoPrintModal = ({
  open,
  onClose,
  requisicaoNumero,
  pacienteNome,
  amostras,
}: RecebimentoPrintModalProps) => {
  const { toast } = useToast();
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>([]);
  const [printGuias, setPrintGuias] = useState(false);
  const [printComprovante, setPrintComprovante] = useState(false);

  const handleToggleEtiqueta = (amostraId: string) => {
    setSelectedEtiquetas((prev) =>
      prev.includes(amostraId)
        ? prev.filter((id) => id !== amostraId)
        : [...prev, amostraId]
    );
  };

  const handleSelectAllEtiquetas = () => {
    if (selectedEtiquetas.length === amostras.length) {
      setSelectedEtiquetas([]);
    } else {
      setSelectedEtiquetas(amostras.map((a) => a.id));
    }
  };

  const handlePrint = () => {
    const items: string[] = [];

    if (selectedEtiquetas.length > 0) {
      items.push(`${selectedEtiquetas.length} etiqueta(s)`);
    }
    if (printGuias) {
      items.push("guias");
    }
    if (printComprovante) {
      items.push("comprovante de coleta");
    }

    if (items.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um item para impressão.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Impressão iniciada",
      description: `Enviando para impressão: ${items.join(", ")}.`,
    });

    onClose();
  };

  const handleSkip = () => {
    toast({
      title: "Recebimento concluído",
      description: "Os materiais foram recebidos com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Impressão de Documentos
          </DialogTitle>
          <DialogDescription>
            Selecione os documentos que deseja imprimir após o recebimento.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Request Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-1">
            <p className="text-sm">
              <strong>Requisição:</strong>{" "}
              <span className="font-mono text-primary">{requisicaoNumero}</span>
            </p>
            <p className="text-sm">
              <strong>Paciente:</strong> {pacienteNome}
            </p>
          </div>

          {/* Etiquetas Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Etiquetas de Amostras
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllEtiquetas}
                  className="text-xs h-7"
                >
                  {selectedEtiquetas.length === amostras.length
                    ? "Desmarcar Todas"
                    : "Selecionar Todas"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {amostras.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma amostra para impressão
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amostras.map((amostra) => (
                    <label
                      key={amostra.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedEtiquetas.includes(amostra.id)}
                        onCheckedChange={() => handleToggleEtiqueta(amostra.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{amostra.servico}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {amostra.numeroAmostra}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {amostra.material}
                      </Badge>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Outros Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <Checkbox
                  checked={printGuias}
                  onCheckedChange={(checked) => setPrintGuias(checked === true)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guias</p>
                  <p className="text-xs text-muted-foreground">
                    Documentos conforme convênios envolvidos
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <Checkbox
                  checked={printComprovante}
                  onCheckedChange={(checked) =>
                    setPrintComprovante(checked === true)
                  }
                />
                <div className="flex items-center gap-2 flex-1">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Comprovante de Coleta</p>
                    <p className="text-xs text-muted-foreground">
                      Documento de comprovação do recebimento
                    </p>
                  </div>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleSkip} className="gap-2">
            <X className="h-4 w-4" />
            Pular Impressão
          </Button>
          <Button
            onClick={handlePrint}
            className="btn-primary-premium gap-2"
            disabled={
              selectedEtiquetas.length === 0 && !printGuias && !printComprovante
            }
          >
            <Printer className="h-4 w-4" />
            Imprimir Selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecebimentoPrintModal;

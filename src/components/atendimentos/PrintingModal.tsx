import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Printer, FileText, Tag, Receipt } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PrintingModalProps {
  open: boolean;
  onClose: () => void;
  requisicaoNumero: string;
  pacienteNome: string;
}

const PrintingModal = ({ open, onClose, requisicaoNumero, pacienteNome }: PrintingModalProps) => {
  const { toast } = useToast();
  const [printComprovante, setPrintComprovante] = useState(true);
  const [printGuias, setPrintGuias] = useState(true);
  const [printEtiquetas, setPrintEtiquetas] = useState(true);

  const handlePrint = () => {
    const selected = [];
    if (printComprovante) selected.push("Comprovante");
    if (printGuias) selected.push("Guias");
    if (printEtiquetas) selected.push("Etiquetas");

    toast({
      title: "Impressão enviada",
      description: `Documentos: ${selected.join(", ")}`,
    });

    onClose();
  };

  const handleSkip = () => {
    toast({
      title: "Requisição salva",
      description: `${requisicaoNumero} salva com sucesso.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Impressão de Documentos
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Requisição <strong className="text-primary">{requisicaoNumero}</strong> salva com
            sucesso. Selecione os documentos que deseja imprimir:
          </p>

          <div className="space-y-3">
            <div
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setPrintComprovante(!printComprovante)}
            >
              <Checkbox
                id="comprovante"
                checked={printComprovante}
                onCheckedChange={(checked) => setPrintComprovante(checked === true)}
              />
              <Receipt className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="comprovante" className="cursor-pointer font-medium">
                  Comprovante
                </Label>
                <p className="text-sm text-muted-foreground">
                  Comprovante de atendimento para o paciente
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setPrintGuias(!printGuias)}
            >
              <Checkbox
                id="guias"
                checked={printGuias}
                onCheckedChange={(checked) => setPrintGuias(checked === true)}
              />
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="guias" className="cursor-pointer font-medium">
                  Guias
                </Label>
                <p className="text-sm text-muted-foreground">
                  Guias de autorização dos convênios
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => setPrintEtiquetas(!printEtiquetas)}
            >
              <Checkbox
                id="etiquetas"
                checked={printEtiquetas}
                onCheckedChange={(checked) => setPrintEtiquetas(checked === true)}
              />
              <Tag className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="etiquetas" className="cursor-pointer font-medium">
                  Etiquetas
                </Label>
                <p className="text-sm text-muted-foreground">
                  Etiquetas para identificação dos materiais
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Pular Impressão
          </Button>
          <Button
            className="btn-primary-premium"
            onClick={handlePrint}
            disabled={!printComprovante && !printGuias && !printEtiquetas}
          >
            <Printer className="h-4 w-4" />
            Imprimir Selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintingModal;

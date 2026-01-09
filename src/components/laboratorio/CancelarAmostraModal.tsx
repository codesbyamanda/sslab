import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface CancelarAmostraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amostra: {
    id: string;
    codigo: string;
    paciente: string;
  } | null;
  onConfirm: (amostraId: string, motivo: string) => void;
}

const CancelarAmostraModal = ({ 
  open, 
  onOpenChange, 
  amostra,
  onConfirm 
}: CancelarAmostraModalProps) => {
  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      toast.error("Informe o motivo do cancelamento.");
      return;
    }

    if (!amostra) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onConfirm(amostra.id, motivo);
    
    setIsSubmitting(false);
    setMotivo("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setMotivo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Amostra
          </DialogTitle>
          <DialogDescription>
            Esta ação irá cancelar a amostra e não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {amostra && (
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="text-muted-foreground">Código: </span>
                <span className="font-mono font-medium">{amostra.codigo}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Paciente: </span>
                <span className="font-medium">{amostra.paciente}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">
                Motivo do cancelamento <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="motivo"
                placeholder="Informe o motivo do cancelamento..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                O motivo será registrado para fins de auditoria e histórico.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Voltar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!motivo.trim() || isSubmitting}
          >
            {isSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelarAmostraModal;

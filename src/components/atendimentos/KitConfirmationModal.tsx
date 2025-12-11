import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, Check } from "lucide-react";

interface KitConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  kitInfo: { codigo: string; servicos: string[] } | null;
}

const KitConfirmationModal = ({ open, onClose, onConfirm, kitInfo }: KitConfirmationModalProps) => {
  if (!kitInfo) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Confirmação de Kit
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            O mnemônico <span className="font-mono font-bold text-primary">{kitInfo.codigo}</span> corresponde a um kit de exames.
            Deseja adicionar todos os serviços abaixo?
          </p>

          <div className="space-y-2 bg-muted/50 rounded-lg p-4">
            {kitInfo.servicos.map((servico, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-verde-clinico" />
                <span>{servico}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Total de {kitInfo.servicos.length} serviço(s) serão adicionados à requisição.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="btn-primary-premium" onClick={onConfirm}>
            Confirmar e Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KitConfirmationModal;

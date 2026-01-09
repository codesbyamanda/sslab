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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, TestTube2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Amostra {
  id: string;
  codigo: string;
  paciente: string;
  setorBancada: string;
  dataHora: string;
  material: string;
}

interface IncluirAmostraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade: string;
  amostrasDisponiveis: Amostra[];
  onConfirm: (amostraIds: string[]) => void;
}

const IncluirAmostraModal = ({ 
  open, 
  onOpenChange, 
  unidade,
  amostrasDisponiveis,
  onConfirm 
}: IncluirAmostraModalProps) => {
  const [amostrasSelecionadas, setAmostrasSelecionadas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAmostra = (amostraId: string, checked: boolean) => {
    if (checked) {
      setAmostrasSelecionadas(prev => [...prev, amostraId]);
    } else {
      setAmostrasSelecionadas(prev => prev.filter(id => id !== amostraId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setAmostrasSelecionadas(amostrasDisponiveis.map(a => a.id));
    } else {
      setAmostrasSelecionadas([]);
    }
  };

  const handleConfirm = async () => {
    if (amostrasSelecionadas.length === 0) {
      toast.error("Selecione pelo menos uma amostra.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onConfirm(amostrasSelecionadas);
    
    setIsSubmitting(false);
    setAmostrasSelecionadas([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    setAmostrasSelecionadas([]);
    onOpenChange(false);
  };

  const isAllSelected = amostrasDisponiveis.length > 0 && 
    amostrasSelecionadas.length === amostrasDisponiveis.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Incluir Amostras no Lote
          </DialogTitle>
          <DialogDescription>
            Selecione as amostras da unidade <strong>{unidade}</strong> para adicionar ao lote.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {amostrasDisponiveis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-medium">Nenhuma amostra disponível</p>
              <p className="text-sm">Todas as amostras desta unidade já estão vinculadas a lotes</p>
            </div>
          ) : (
            <div className="border rounded-lg flex flex-col">
              <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <TestTube2 className="h-4 w-4 text-muted-foreground" />
                  <span>{amostrasDisponiveis.length} amostra(s) disponível(is)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="selectAll"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="selectAll" className="text-xs cursor-pointer">
                    Selecionar todas
                  </label>
                </div>
              </div>
              <ScrollArea className="flex-1 max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Setor/Bancada</TableHead>
                      <TableHead>Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amostrasDisponiveis.map((amostra) => (
                      <TableRow key={amostra.id}>
                        <TableCell>
                          <Checkbox 
                            checked={amostrasSelecionadas.includes(amostra.id)}
                            onCheckedChange={(checked) => handleSelectAmostra(amostra.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{amostra.codigo}</TableCell>
                        <TableCell>{amostra.paciente}</TableCell>
                        <TableCell>{amostra.material}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{amostra.setorBancada}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{amostra.dataHora}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={amostrasSelecionadas.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ({amostrasSelecionadas.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncluirAmostraModal;

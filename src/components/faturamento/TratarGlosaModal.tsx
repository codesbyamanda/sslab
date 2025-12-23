import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  RefreshCw, 
  XCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemGuiaBadge, type ItemGuiaStatus } from "./StatusBadge";

export interface GlosaItem {
  id: number;
  codigo: string;
  descricao: string;
  valorOriginal: number;
  valorGlosado: number;
  situacao: ItemGuiaStatus;
  motivoGlosa: string;
}

export type GlosaAction = "aceitar" | "reapresentar" | "cancelar";

interface TratarGlosaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GlosaItem | null;
  onConfirm: (itemId: number, action: GlosaAction, justificativa: string, valorRecurso?: number) => void;
}

export const TratarGlosaModal = ({
  open,
  onOpenChange,
  item,
  onConfirm,
}: TratarGlosaModalProps) => {
  const [selectedAction, setSelectedAction] = useState<GlosaAction>("aceitar");
  const [justificativa, setJustificativa] = useState("");
  const [valorRecurso, setValorRecurso] = useState<string>("");

  const handleConfirm = () => {
    if (!item) return;
    onConfirm(
      item.id, 
      selectedAction, 
      justificativa,
      selectedAction === "reapresentar" ? parseFloat(valorRecurso) || item.valorOriginal : undefined
    );
    // Reset state
    setSelectedAction("aceitar");
    setJustificativa("");
    setValorRecurso("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedAction("aceitar");
      setJustificativa("");
      setValorRecurso("");
    }
    onOpenChange(newOpen);
  };

  if (!item) return null;

  const isGlosaTotal = item.situacao === "glosa_total";
  const valorDiferenca = item.valorOriginal - item.valorGlosado;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Tratamento de Glosa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Procedimento</p>
                <p className="font-medium">{item.codigo} - {item.descricao}</p>
              </div>
              <ItemGuiaBadge status={item.situacao} />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Valor Original</p>
                <p className="font-semibold text-foreground">
                  {item.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor Glosado</p>
                <p className="font-semibold text-destructive">
                  {item.valorGlosado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diferença</p>
                <p className="font-semibold text-warning">
                  {valorDiferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Motivo da Glosa (Convênio)</p>
              <p className="text-sm text-destructive">{item.motivoGlosa}</p>
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ação do Tratamento</Label>
            <RadioGroup
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value as GlosaAction)}
              className="grid gap-3"
            >
              {/* Aceitar Glosa */}
              <Label
                htmlFor="aceitar"
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  selectedAction === "aceitar"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="aceitar" id="aceitar" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Aceitar Glosa</span>
                    <Badge variant="outline" className="text-xs">GA</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aceita a glosa do convênio. {isGlosaTotal 
                      ? "O item não será cobrado." 
                      : "O valor ajustado será aceito."}
                  </p>
                </div>
              </Label>

              {/* Reapresentar */}
              <Label
                htmlFor="reapresentar"
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  selectedAction === "reapresentar"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="reapresentar" id="reapresentar" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-warning" />
                    <span className="font-medium">Reapresentar Item</span>
                    <Badge variant="outline" className="text-xs">RP</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Envia recurso de glosa ao convênio para reanálise do item.
                  </p>
                </div>
              </Label>

              {/* Cancelar Item */}
              <Label
                htmlFor="cancelar"
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  selectedAction === "cancelar"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="cancelar" id="cancelar" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Cancelar Item</span>
                    <Badge variant="outline" className="text-xs">CN</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cancela o item. Não será cobrado nem reapresentado.
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Valor para Recurso (apenas se reapresentar) */}
          {selectedAction === "reapresentar" && (
            <div className="space-y-2">
              <Label htmlFor="valorRecurso" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Valor para Recurso
              </Label>
              <Input
                id="valorRecurso"
                type="number"
                step="0.01"
                min="0"
                placeholder={item.valorOriginal.toFixed(2)}
                value={valorRecurso}
                onChange={(e) => setValorRecurso(e.target.value)}
                className="max-w-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para usar o valor original de {item.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          )}

          {/* Justificativa */}
          <div className="space-y-2">
            <Label htmlFor="justificativa" className="text-sm font-medium">
              Justificativa / Observação
              {selectedAction === "reapresentar" && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id="justificativa"
              placeholder={
                selectedAction === "aceitar"
                  ? "Descreva o motivo da aceitação da glosa (opcional)..."
                  : selectedAction === "reapresentar"
                  ? "Descreva o motivo do recurso de glosa (obrigatório)..."
                  : "Descreva o motivo do cancelamento (opcional)..."
              }
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedAction === "reapresentar" && !justificativa.trim()}
            className={cn(
              selectedAction === "aceitar" && "bg-muted-foreground hover:bg-muted-foreground/90",
              selectedAction === "reapresentar" && "bg-warning hover:bg-warning/90 text-warning-foreground",
              selectedAction === "cancelar" && "bg-destructive hover:bg-destructive/90"
            )}
          >
            {selectedAction === "aceitar" && "Aceitar Glosa"}
            {selectedAction === "reapresentar" && "Reapresentar"}
            {selectedAction === "cancelar" && "Cancelar Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
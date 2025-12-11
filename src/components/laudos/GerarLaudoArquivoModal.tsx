import { useState } from "react";
import { Download, FolderOpen, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Requisicao } from "@/pages/ImpressaoLaudos";

interface GerarLaudoArquivoModalProps {
  open: boolean;
  onClose: () => void;
  requisicao: Requisicao;
}

const GerarLaudoArquivoModal = ({ open, onClose, requisicao }: GerarLaudoArquivoModalProps) => {
  const { toast } = useToast();
  const [layout, setLayout] = useState("padrao");
  const [destino, setDestino] = useState("C:\\Laudos\\");
  const [isSaving, setIsSaving] = useState(false);

  const fileName = `LAUDO_${requisicao.numero.replace(/-/g, "_")}_${requisicao.paciente
    .split(" ")
    .slice(0, 2)
    .join("_")
    .toUpperCase()}.pdf`;

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate save process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);

    toast({
      title: "Arquivo salvo",
      description: `O laudo foi salvo em: ${destino}${fileName}`,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-amber-600" />
            Gerar Laudo Arquivo (F7)
          </DialogTitle>
          <DialogDescription>
            Salve o laudo localmente em formato PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Request Info */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-sm">
            <p><strong>Requisição:</strong> <span className="font-mono text-primary">{requisicao.numero}</span></p>
            <p><strong>Paciente:</strong> {requisicao.paciente}</p>
            <p><strong>Convênio:</strong> {requisicao.convenio}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Padrão de Layout</Label>
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger className="input-modern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="completo">Layout Completo</SelectItem>
                  <SelectItem value="resumido">Layout Resumido</SelectItem>
                  <SelectItem value="convenio">Layout Convênio</SelectItem>
                  <SelectItem value="cabecalho">Apenas Cabeçalho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino do Arquivo</Label>
              <div className="flex gap-2">
                <Input
                  id="destino"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="input-modern"
                  placeholder="C:\Laudos\"
                />
                <Button variant="outline" size="icon" className="shrink-0">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome do Arquivo</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                <FileText className="h-4 w-4 text-vermelho-moderno" />
                <span className="text-sm font-mono truncate">{fileName}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                O nome é gerado automaticamente com base na requisição e paciente.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="btn-primary-premium gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Salvar Arquivo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GerarLaudoArquivoModal;

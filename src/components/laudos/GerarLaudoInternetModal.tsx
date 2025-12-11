import { useState } from "react";
import { Globe, Check, Mail, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Requisicao } from "@/pages/ImpressaoLaudos";

interface GerarLaudoInternetModalProps {
  open: boolean;
  onClose: () => void;
  requisicao: Requisicao;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

const GerarLaudoInternetModal = ({ open, onClose, requisicao }: GerarLaudoInternetModalProps) => {
  const { toast } = useToast();
  const [layout, setLayout] = useState("padrao");
  const [destino, setDestino] = useState("/datacenter/laudos/");
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString("pt-BR");
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLogs([]);

    addLog("Iniciando geração do laudo...", "info");

    // Simulate generation process
    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog(`Layout selecionado: ${layout === "padrao" ? "Padrão Data-Center" : layout}`, "info");

    await new Promise((resolve) => setTimeout(resolve, 600));
    addLog("Gerando PDF do laudo...", "info");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const fileName = `LAUDO_${requisicao.numero.replace(/-/g, "_")}.pdf`;
    addLog(`Laudo gerado com sucesso: ${fileName}`, "success");

    await new Promise((resolve) => setTimeout(resolve, 500));
    addLog(`Arquivo salvo em: ${destino}${fileName}`, "success");

    await new Promise((resolve) => setTimeout(resolve, 700));
    addLog("Enviando ao Data-Center...", "info");

    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog("Laudo disponibilizado no Data-Center", "success");

    if (enviarEmail) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      addLog("Enviando e-mail de notificação...", "info");
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog("E-mail enviado com sucesso", "success");
    }

    setIsGenerating(false);

    toast({
      title: "Laudo gerado",
      description: "O laudo foi gerado e disponibilizado com sucesso.",
    });
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-3 w-3 text-verde-sucesso" />;
      case "error":
        return <span className="h-3 w-3 rounded-full bg-vermelho-moderno" />;
      default:
        return <span className="h-3 w-3 rounded-full bg-primary/50" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-verde-sucesso" />
            Gerar Laudo Internet (F6)
          </DialogTitle>
          <DialogDescription>
            Gera o laudo em PDF no padrão Data-Center e disponibiliza para acesso online.
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
                  <SelectItem value="padrao">Padrão Data-Center</SelectItem>
                  <SelectItem value="completo">Layout Completo</SelectItem>
                  <SelectItem value="resumido">Layout Resumido</SelectItem>
                  <SelectItem value="convenio">Layout Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <div className="flex gap-2">
                <Input
                  id="destino"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="input-modern"
                  placeholder="/datacenter/laudos/"
                />
                <Button variant="outline" size="icon" className="shrink-0">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Checkbox
                checked={enviarEmail}
                onCheckedChange={(checked) => setEnviarEmail(checked === true)}
              />
              <div className="flex items-center gap-2 flex-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Enviar por e-mail automaticamente</p>
                  <p className="text-xs text-muted-foreground">
                    Notifica o paciente quando o laudo estiver disponível
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Log Output */}
          {logs.length > 0 && (
            <Card>
              <CardContent className="p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Log de Status</p>
                <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        log.type === "success"
                          ? "text-verde-sucesso"
                          : log.type === "error"
                          ? "text-vermelho-moderno"
                          : "text-foreground"
                      }`}
                    >
                      {getLogIcon(log.type)}
                      <span className="text-muted-foreground">[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleGenerate}
            className="btn-primary-premium gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                Gerar Laudo Internet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GerarLaudoInternetModal;

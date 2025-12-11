import { useState } from "react";
import { History, Printer, RefreshCw, Eye, Globe, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { Requisicao } from "@/pages/ImpressaoLaudos";

interface Emissao {
  id: string;
  dataHora: string;
  tipo: "Internet" | "Arquivo" | "Impressão";
  arquivo: string;
  usuario: string;
  convenio: string;
  situacao: "Gerado" | "Enviado" | "Erro" | "Cancelado";
}

const mockEmissoes: Emissao[] = [
  {
    id: "1",
    dataHora: "2024-01-15 14:32:45",
    tipo: "Internet",
    arquivo: "LAUDO_REQ_2024_001234.pdf",
    usuario: "Maria Operadora",
    convenio: "Unimed",
    situacao: "Enviado",
  },
  {
    id: "2",
    dataHora: "2024-01-15 10:15:22",
    tipo: "Impressão",
    arquivo: "LAUDO_REQ_2024_001234.pdf",
    usuario: "João Atendente",
    convenio: "Unimed",
    situacao: "Gerado",
  },
  {
    id: "3",
    dataHora: "2024-01-14 16:45:10",
    tipo: "Arquivo",
    arquivo: "LAUDO_REQ_2024_001234_MARIA.pdf",
    usuario: "Maria Operadora",
    convenio: "Unimed",
    situacao: "Gerado",
  },
  {
    id: "4",
    dataHora: "2024-01-14 09:20:33",
    tipo: "Internet",
    arquivo: "LAUDO_REQ_2024_001234.pdf",
    usuario: "Sistema",
    convenio: "Unimed",
    situacao: "Erro",
  },
];

interface HistoricoEmissoesModalProps {
  open: boolean;
  onClose: () => void;
  requisicao: Requisicao;
}

const HistoricoEmissoesModal = ({ open, onClose, requisicao }: HistoricoEmissoesModalProps) => {
  const { toast } = useToast();
  const [emissoes] = useState<Emissao[]>(mockEmissoes);

  const handleReimprimir = (emissao: Emissao) => {
    toast({
      title: "Reimprimindo laudo",
      description: `Enviando ${emissao.arquivo} para impressora...`,
    });
  };

  const handleRegerar = (emissao: Emissao) => {
    toast({
      title: "Regerando laudo",
      description: `O laudo ${emissao.arquivo} será gerado novamente.`,
    });
  };

  const handleVisualizar = (emissao: Emissao) => {
    toast({
      title: "Abrindo visualização",
      description: `Carregando ${emissao.arquivo}...`,
    });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Internet":
        return <Globe className="h-4 w-4 text-verde-sucesso" />;
      case "Arquivo":
        return <Download className="h-4 w-4 text-amber-600" />;
      case "Impressão":
        return <Printer className="h-4 w-4 text-primary" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Gerado":
        return <Badge variant="secondary">Gerado</Badge>;
      case "Enviado":
        return <Badge className="bg-verde-sucesso hover:bg-verde-sucesso/90">Enviado</Badge>;
      case "Erro":
        return <Badge variant="destructive">Erro</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="text-muted-foreground">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico de Emissões (F8)
          </DialogTitle>
          <DialogDescription>
            Requisição: <span className="font-mono text-primary">{requisicao.numero}</span>
            {" • "}Paciente: <span className="font-medium">{requisicao.paciente}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Data/Hora</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Arquivo Gerado</TableHead>
                  <TableHead className="font-semibold">Usuário</TableHead>
                  <TableHead className="font-semibold">Convênio</TableHead>
                  <TableHead className="font-semibold text-center">Situação</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emissoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma emissão registrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  emissoes.map((emissao) => (
                    <TableRow key={emissao.id} className={emissao.situacao === "Erro" ? "bg-vermelho-moderno/5" : ""}>
                      <TableCell className="font-mono text-sm">
                        {emissao.dataHora}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(emissao.tipo)}
                          <span>{emissao.tipo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-primary">
                        {emissao.arquivo}
                      </TableCell>
                      <TableCell>{emissao.usuario}</TableCell>
                      <TableCell>{emissao.convenio}</TableCell>
                      <TableCell className="text-center">
                        {getSituacaoBadge(emissao.situacao)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                onClick={() => handleVisualizar(emissao)}
                                disabled={emissao.situacao === "Erro"}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Visualizar PDF</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-verde-sucesso/10 hover:text-verde-sucesso"
                                onClick={() => handleReimprimir(emissao)}
                                disabled={emissao.situacao === "Erro"}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reimprimir</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-600"
                                onClick={() => handleRegerar(emissao)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Regerar</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Legenda:</strong>{" "}
              <span className="inline-flex items-center gap-1 mr-3">
                <Globe className="h-3 w-3 text-verde-sucesso" /> Internet
              </span>
              <span className="inline-flex items-center gap-1 mr-3">
                <Download className="h-3 w-3 text-amber-600" /> Arquivo
              </span>
              <span className="inline-flex items-center gap-1">
                <Printer className="h-3 w-3 text-primary" /> Impressão
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricoEmissoesModal;

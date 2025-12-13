import { useState, useEffect } from "react";
import { History, Printer, RefreshCw, Eye, Globe, Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

  // Suporte para fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

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
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Gerado
          </Badge>
        );
      case "Enviado":
        return (
          <Badge className="bg-verde-sucesso/15 text-verde-sucesso border border-verde-sucesso/30 hover:bg-verde-sucesso/20">
            Enviado
          </Badge>
        );
      case "Erro":
        return (
          <Badge variant="destructive" className="bg-destructive/15 text-destructive border border-destructive/30">
            Erro
          </Badge>
        );
      case "Cancelado":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70vw] max-h-[85vh] p-0 gap-0 overflow-hidden">
        {/* Cabeçalho */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Histórico de Emissões
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Requisição: <span className="font-mono text-primary font-medium">{requisicao.numero}</span>
                  {" • "}
                  Paciente: <span className="font-medium text-foreground">{requisicao.paciente}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Corpo com tabela scrollável */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[50vh]">
            <div className="px-6 py-4">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Data/Hora</TableHead>
                      <TableHead className="font-semibold text-foreground">Tipo de Emissão</TableHead>
                      <TableHead className="font-semibold text-foreground">Arquivo Gerado</TableHead>
                      <TableHead className="font-semibold text-foreground">Usuário</TableHead>
                      <TableHead className="font-semibold text-foreground">Convênio</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Situação</TableHead>
                      <TableHead className="font-semibold text-foreground text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emissoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                          <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Nenhuma emissão registrada para esta requisição</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      emissoes.map((emissao) => (
                        <TableRow 
                          key={emissao.id} 
                          className={
                            emissao.situacao === "Erro" 
                              ? "bg-destructive/5 hover:bg-destructive/10" 
                              : "hover:bg-muted/30"
                          }
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {emissao.dataHora}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTipoIcon(emissao.tipo)}
                              <span className="text-sm">{emissao.tipo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded text-primary font-mono">
                              {emissao.arquivo}
                            </code>
                          </TableCell>
                          <TableCell className="text-sm">{emissao.usuario}</TableCell>
                          <TableCell className="text-sm">{emissao.convenio}</TableCell>
                          <TableCell className="text-center">
                            {getSituacaoBadge(emissao.situacao)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              {/* Visualizar PDF - só aparece se houver arquivo e não for erro */}
                              {emissao.situacao !== "Erro" && emissao.arquivo && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                      onClick={() => handleVisualizar(emissao)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Visualizar PDF</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {/* Reimprimir - desabilitado em caso de erro */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-verde-sucesso/10 hover:text-verde-sucesso disabled:opacity-40"
                                    onClick={() => handleReimprimir(emissao)}
                                    disabled={emissao.situacao === "Erro"}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Imprimir novamente</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* Reprocessar/Gerar novamente - estilo neutro */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-muted hover:text-foreground"
                                    onClick={() => handleRegerar(emissao)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Reprocessar / Gerar novamente</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Rodapé com legenda e botão */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/20 flex-row justify-between items-center">
          {/* Legenda à esquerda */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">Legenda:</span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-verde-sucesso" />
              Internet
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-amber-600" />
              Arquivo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5 text-primary" />
              Impressão
            </span>
          </div>

          {/* Botão fechar à direita */}
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricoEmissoesModal;

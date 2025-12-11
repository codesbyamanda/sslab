import { useState } from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ServicoPendente } from "@/pages/RecebimentoDetalhe";

interface ServicosPendentesTabProps {
  servicos: ServicoPendente[];
  onBaixaMaterial: (servicoId: string, responsavel: string) => void;
}

const ServicosPendentesTab = ({
  servicos,
  onBaixaMaterial,
}: ServicosPendentesTabProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedServico, setSelectedServico] = useState<ServicoPendente | null>(
    null
  );
  const [responsavel, setResponsavel] = useState("");

  const handleOpenConfirm = (servico: ServicoPendente) => {
    if (servico.situacao !== "Pendente") return;
    setSelectedServico(servico);
    setResponsavel("");
    setShowConfirmModal(true);
  };

  const handleConfirmBaixa = () => {
    if (selectedServico && responsavel.trim()) {
      onBaixaMaterial(selectedServico.id, responsavel);
      setShowConfirmModal(false);
      setSelectedServico(null);
      setResponsavel("");
    }
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Pendente":
        return (
          <Badge variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case "Aberto":
        return (
          <Badge className="gap-1 bg-verde-sucesso hover:bg-verde-sucesso/90">
            <Check className="h-3 w-3" />
            Recebido
          </Badge>
        );
      case "Liberado":
        return (
          <Badge variant="secondary" className="gap-1">
            Liberado
          </Badge>
        );
      case "Cancelado":
        return (
          <Badge variant="outline" className="gap-1 text-vermelho-moderno border-vermelho-moderno">
            <AlertCircle className="h-3 w-3" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold w-24">Código</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold">Recipiente</TableHead>
                <TableHead className="font-semibold text-center w-20">
                  Qtd
                </TableHead>
                <TableHead className="font-semibold text-center w-28">
                  Situação
                </TableHead>
                <TableHead className="font-semibold w-36">Nº Amostra</TableHead>
                <TableHead className="font-semibold w-28">Data Coleta</TableHead>
                <TableHead className="font-semibold w-20">Hora</TableHead>
                <TableHead className="font-semibold">Responsável</TableHead>
                <TableHead className="font-semibold text-center w-32">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum serviço pendente</p>
                  </TableCell>
                </TableRow>
              ) : (
                servicos.map((servico) => (
                  <TableRow
                    key={servico.id}
                    className={
                      servico.situacao === "Aberto"
                        ? "bg-verde-sucesso/5"
                        : servico.situacao === "Cancelado"
                        ? "bg-vermelho-moderno/5"
                        : ""
                    }
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {servico.codigo}
                    </TableCell>
                    <TableCell className="font-medium">
                      {servico.descricao}
                    </TableCell>
                    <TableCell>{servico.recipiente}</TableCell>
                    <TableCell className="text-center">
                      {servico.quantidade}
                    </TableCell>
                    <TableCell className="text-center">
                      {getSituacaoBadge(servico.situacao)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {servico.numeroAmostra || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {servico.dataColeta ? (
                        new Date(servico.dataColeta).toLocaleDateString("pt-BR")
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {servico.horaColeta || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {servico.responsavelColeta || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {servico.situacao === "Pendente" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenConfirm(servico)}
                          className="btn-primary-premium h-8 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Dar Baixa
                        </Button>
                      )}
                      {servico.situacao === "Aberto" && (
                        <span className="text-xs text-verde-sucesso font-medium">
                          ✓ Recebido
                        </span>
                      )}
                      {(servico.situacao === "Liberado" ||
                        servico.situacao === "Cancelado") && (
                        <span className="text-xs text-muted-foreground">
                          Indisponível
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirm Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-verde-sucesso" />
              Confirmar Recebimento
            </DialogTitle>
            <DialogDescription>
              Informe o responsável pela coleta para registrar o recebimento do
              material.
            </DialogDescription>
          </DialogHeader>

          {selectedServico && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>Serviço:</strong> {selectedServico.descricao}
                </p>
                <p className="text-sm">
                  <strong>Código:</strong>{" "}
                  <span className="font-mono">{selectedServico.codigo}</span>
                </p>
                <p className="text-sm">
                  <strong>Recipiente:</strong> {selectedServico.recipiente}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">
                  Responsável pela Coleta <span className="text-vermelho-moderno">*</span>
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Nome do responsável..."
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBaixa}
              disabled={!responsavel.trim()}
              className="btn-primary-premium"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicosPendentesTab;

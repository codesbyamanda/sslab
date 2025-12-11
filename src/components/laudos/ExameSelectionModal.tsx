import { useState } from "react";
import { Printer, Check, FileText, Receipt, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Requisicao } from "@/pages/ImpressaoLaudos";

interface Exame {
  id: string;
  codigo: string;
  nome: string;
  material: string;
  situacao: "Pendente" | "Executado" | "Liberado" | "Impresso";
  dataLiberacao: string | null;
}

const mockExames: Exame[] = [
  { id: "1", codigo: "HEMO001", nome: "Hemograma Completo", material: "Sangue EDTA", situacao: "Liberado", dataLiberacao: "2024-01-15" },
  { id: "2", codigo: "GLI001", nome: "Glicemia em Jejum", material: "Soro", situacao: "Liberado", dataLiberacao: "2024-01-15" },
  { id: "3", codigo: "CREA001", nome: "Creatinina", material: "Soro", situacao: "Executado", dataLiberacao: null },
  { id: "4", codigo: "TSH001", nome: "TSH Ultra Sensível", material: "Soro", situacao: "Liberado", dataLiberacao: "2024-01-15" },
  { id: "5", codigo: "COL001", nome: "Colesterol Total", material: "Soro", situacao: "Pendente", dataLiberacao: null },
];

interface ExameSelectionModalProps {
  open: boolean;
  onClose: () => void;
  requisicao: Requisicao;
}

const ExameSelectionModal = ({ open, onClose, requisicao }: ExameSelectionModalProps) => {
  const { toast } = useToast();
  const [selectedExames, setSelectedExames] = useState<string[]>([]);
  const [printGuias, setPrintGuias] = useState(false);
  const [printComprovante, setPrintComprovante] = useState(false);

  const examesDisponiveis = mockExames.filter(
    (e) => e.situacao === "Executado" || e.situacao === "Liberado" || e.situacao === "Impresso"
  );

  const handleToggleExame = (exameId: string) => {
    const exame = mockExames.find((e) => e.id === exameId);
    if (exame && exame.situacao === "Pendente") return;

    setSelectedExames((prev) =>
      prev.includes(exameId)
        ? prev.filter((id) => id !== exameId)
        : [...prev, exameId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExames.length === examesDisponiveis.length) {
      setSelectedExames([]);
    } else {
      setSelectedExames(examesDisponiveis.map((e) => e.id));
    }
  };

  const handlePrint = (all: boolean = false) => {
    const examesPrint = all
      ? examesDisponiveis.map((e) => e.id)
      : selectedExames;

    if (examesPrint.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um exame para impressão.",
        variant: "destructive",
      });
      return;
    }

    const items: string[] = [];
    items.push(`${examesPrint.length} laudo(s)`);
    if (printGuias) items.push("guias");
    if (printComprovante) items.push("comprovante");

    toast({
      title: "Impressão iniciada",
      description: `Enviando para impressão: ${items.join(", ")}.`,
    });

    onClose();
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Liberado":
        return <Badge className="bg-verde-sucesso hover:bg-verde-sucesso/90">Liberado</Badge>;
      case "Executado":
        return <Badge variant="secondary">Executado</Badge>;
      case "Impresso":
        return <Badge variant="default" className="bg-primary">Impresso</Badge>;
      case "Pendente":
        return <Badge variant="outline" className="text-muted-foreground">Pendente</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Seleção de Exames para Impressão
          </DialogTitle>
          <DialogDescription>
            Requisição: <span className="font-mono text-primary">{requisicao.numero}</span>
            {" • "}Paciente: <span className="font-medium">{requisicao.paciente}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Exames Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Exames da Requisição
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-7">
                  {selectedExames.length === examesDisponiveis.length
                    ? "Desmarcar Todos"
                    : "Selecionar Disponíveis"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-semibold">Código</TableHead>
                      <TableHead className="font-semibold">Nome do Exame</TableHead>
                      <TableHead className="font-semibold">Material</TableHead>
                      <TableHead className="font-semibold text-center">Situação</TableHead>
                      <TableHead className="font-semibold">Data Liberação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExames.map((exame) => {
                      const isDisabled = exame.situacao === "Pendente";
                      const isSelected = selectedExames.includes(exame.id);

                      return (
                        <TableRow
                          key={exame.id}
                          className={`${isDisabled ? "opacity-50" : "cursor-pointer hover:bg-muted/50"} ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                          onClick={() => !isDisabled && handleToggleExame(exame.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              disabled={isDisabled}
                              onCheckedChange={() => handleToggleExame(exame.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-sm">{exame.codigo}</TableCell>
                          <TableCell className="font-medium">{exame.nome}</TableCell>
                          <TableCell>{exame.material}</TableCell>
                          <TableCell className="text-center">
                            {getSituacaoBadge(exame.situacao)}
                          </TableCell>
                          <TableCell>
                            {exame.dataLiberacao
                              ? new Date(exame.dataLiberacao).toLocaleDateString("pt-BR")
                              : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground p-3">
                * Exames pendentes não podem ser impressos.
              </p>
            </CardContent>
          </Card>

          {/* Additional Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Documentos Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <Checkbox
                  checked={printGuias}
                  onCheckedChange={(checked) => setPrintGuias(checked === true)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guias dos Convênios</p>
                  <p className="text-xs text-muted-foreground">
                    Documentos conforme convênio: {requisicao.convenio}
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <Checkbox
                  checked={printComprovante}
                  onCheckedChange={(checked) => setPrintComprovante(checked === true)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Comprovante de Atendimento</p>
                    <p className="text-xs text-muted-foreground">
                      Documento de comprovação do atendimento
                    </p>
                  </div>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Voltar
          </Button>
          <Button
            variant="secondary"
            onClick={() => handlePrint(true)}
            disabled={examesDisponiveis.length === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Imprimir Todos
          </Button>
          <Button
            onClick={() => handlePrint(false)}
            className="btn-primary-premium gap-2"
            disabled={selectedExames.length === 0}
          >
            <Printer className="h-4 w-4" />
            Imprimir Selecionados ({selectedExames.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExameSelectionModal;

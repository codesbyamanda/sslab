import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface Guia {
  id: string;
  numGuia: string;
  convenio: string;
  plano: string;
  valor: number;
  lotePreFaturamento: string | null;
  loteFaturamento: string | null;
}

const mockGuias: Guia[] = [
  {
    id: "1",
    numGuia: "GUI-2024-0001",
    convenio: "Unimed",
    plano: "Unimax",
    valor: 450.0,
    lotePreFaturamento: "PRE-2024-001",
    loteFaturamento: null,
  },
  {
    id: "2",
    numGuia: "GUI-2024-0002",
    convenio: "Bradesco Saúde",
    plano: "Top Nacional",
    valor: 280.0,
    lotePreFaturamento: null,
    loteFaturamento: null,
  },
  {
    id: "3",
    numGuia: "GUI-2024-0003",
    convenio: "SulAmérica",
    plano: "Executivo",
    valor: 520.0,
    lotePreFaturamento: "PRE-2024-001",
    loteFaturamento: "FAT-2024-001",
  },
];

const GuiasAtendimento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [guias, setGuias] = useState<Guia[]>(mockGuias);
  const [deleteGuia, setDeleteGuia] = useState<Guia | null>(null);

  // Mock data
  const requisicao = {
    numero: `REQ-2024-00${id}`,
    paciente: "Maria Silva Santos",
  };

  const handleEditGuia = (guiaId: string) => {
    navigate(`/atendimento/guias/${id}/editar/${guiaId}`);
  };


  const handleDeleteGuia = () => {
    if (deleteGuia) {
      setGuias((prev) => prev.filter((g) => g.id !== deleteGuia.id));
      toast.success("Guia excluída com sucesso!");
      setDeleteGuia(null);
    }
  };

  const getStatusBadge = (guia: Guia) => {
    if (guia.loteFaturamento) {
      return (
        <Badge variant="default" className="bg-verde-clinico hover:bg-verde-clinico/90">
          Faturada
        </Badge>
      );
    }
    if (guia.lotePreFaturamento) {
      return (
        <Badge variant="secondary" className="bg-ambar-suave/20 text-ambar-suave">
          Pré-Faturada
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Pendente
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento/atendimentos")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Atendimentos</span>
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Guias</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie as guias de convênio vinculadas à requisição
              </p>
            </div>
          </div>

          {/* Informações da Requisição */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nº Requisição
                  </label>
                  <p className="font-mono text-sm font-medium text-primary">
                    {requisicao.numero}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paciente
                  </label>
                  <p className="font-medium text-foreground">{requisicao.paciente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Guias */}
          <Card className="card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Guias Vinculadas
                </CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {guias.length} guia(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nº Guia</TableHead>
                      <TableHead className="font-semibold">Convênio</TableHead>
                      <TableHead className="font-semibold">Plano</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                      <TableHead className="font-semibold">Lote Pré-Fat.</TableHead>
                      <TableHead className="font-semibold">Lote Fat.</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>Nenhuma guia cadastrada</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      guias.map((guia) => (
                        <TableRow
                          key={guia.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onDoubleClick={() => handleEditGuia(guia.id)}
                        >
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            {guia.numGuia}
                          </TableCell>
                          <TableCell className="font-medium">{guia.convenio}</TableCell>
                          <TableCell>{guia.plano}</TableCell>
                          <TableCell className="text-right font-medium">
                            {guia.valor.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>
                            {guia.lotePreFaturamento ? (
                              <span className="font-mono text-xs">{guia.lotePreFaturamento}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {guia.loteFaturamento ? (
                              <span className="font-mono text-xs">{guia.loteFaturamento}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(guia)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditGuia(guia.id);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar Guia</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-vermelho-moderno"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteGuia(guia);
                                    }}
                                    disabled={!!guia.loteFaturamento}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {guia.loteFaturamento
                                    ? "Não é possível excluir guia faturada"
                                    : "Excluir Guia"}
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
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 mt-6 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => navigate("/atendimento/atendimentos")}
            >
              Fechar
            </Button>
          </div>

          {/* Dialog de confirmação de exclusão */}
          <AlertDialog open={!!deleteGuia} onOpenChange={() => setDeleteGuia(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a guia{" "}
                  <strong>{deleteGuia?.numGuia}</strong>? Esta ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteGuia}
                  className="bg-vermelho-moderno hover:bg-vermelho-moderno/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default GuiasAtendimento;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw, AlertTriangle, DollarSign, Clock, Banknote, CreditCard, FileCheck, Building2, ArrowRightLeft } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "@/hooks/use-toast";

// Mock data
const mockReceita = {
  id: 1,
  codigo: "REC-2024-0001",
  descricao: "Consulta particular - João Silva",
  pessoa: "João Silva",
  valorOriginal: 350.00,
  valorRecebido: 100.00,
  valorDevido: 250.00,
  situacao: "Parcial",
};

const mockLancamentos = [
  { 
    id: 1, 
    data: "2024-01-20", 
    valor: 50.00, 
    formaPagamento: "Dinheiro",
    usuario: "Ednaldo",
    observacao: "Primeiro pagamento parcial",
    extornado: false
  },
  { 
    id: 2, 
    data: "2024-01-22", 
    valor: 50.00, 
    formaPagamento: "Cartão",
    usuario: "Maria",
    observacao: "Segundo pagamento",
    extornado: false
  }
];

const ReceitaExtorno = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const receita = mockReceita;
  const lancamentos = mockLancamentos.filter(l => !l.extornado);
  
  const [selectedLancamentos, setSelectedLancamentos] = useState<number[]>([]);
  const [justificativa, setJustificativa] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getFormaIcon = (forma: string) => {
    switch (forma) {
      case "Dinheiro": return <Banknote className="h-4 w-4 text-green-600" />;
      case "Cheque": return <FileCheck className="h-4 w-4 text-blue-600" />;
      case "Cartão": return <CreditCard className="h-4 w-4 text-purple-600" />;
      case "Depósito": return <Building2 className="h-4 w-4 text-teal-600" />;
      case "Transferência": return <ArrowRightLeft className="h-4 w-4 text-indigo-600" />;
      default: return <Banknote className="h-4 w-4" />;
    }
  };

  const toggleLancamento = (lancamentoId: number) => {
    setSelectedLancamentos(prev => 
      prev.includes(lancamentoId)
        ? prev.filter(id => id !== lancamentoId)
        : [...prev, lancamentoId]
    );
  };

  const toggleAll = () => {
    if (selectedLancamentos.length === lancamentos.length) {
      setSelectedLancamentos([]);
    } else {
      setSelectedLancamentos(lancamentos.map(l => l.id));
    }
  };

  const valorTotalExtorno = lancamentos
    .filter(l => selectedLancamentos.includes(l.id))
    .reduce((acc, l) => acc + l.valor, 0);

  const novoSaldoDevido = receita.valorDevido + valorTotalExtorno;
  const novaSituacao = novoSaldoDevido >= receita.valorOriginal ? "Aberto" : "Parcial";

  const handleExtorno = () => {
    if (selectedLancamentos.length === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos um lançamento para extornar.",
        variant: "destructive"
      });
      return;
    }

    if (!justificativa.trim() || justificativa.trim().length < 10) {
      toast({
        title: "Justificativa obrigatória",
        description: "A justificativa deve ter no mínimo 10 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setConfirmDialogOpen(true);
  };

  const confirmExtorno = () => {
    toast({
      title: "Extorno realizado",
      description: `${selectedLancamentos.length} lançamento(s) extornado(s) com sucesso. Valor total: ${formatCurrency(valorTotalExtorno)}`,
    });
    
    setConfirmDialogOpen(false);
    navigate(`/financeiro/receitas/${id}`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate(`/financeiro/receitas/${id}`)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Visualização da Receita
            </button>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <RotateCcw className="h-7 w-7 text-orange-600" />
                Extorno de Recebimento
              </h1>
              <p className="text-muted-foreground mt-1">
                Selecione os lançamentos que deseja extornar da receita {receita.codigo}
              </p>
            </div>

            {/* Alerta */}
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      Atenção: Esta ação é irreversível
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      O extorno anula recebimentos já registrados. O valor extornado voltará a compor o saldo em aberto da receita.
                      Todos os extornos ficam registrados no histórico para fins de auditoria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo da Receita */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Resumo da Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-semibold">{receita.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Original</p>
                    <p className="font-semibold">{formatCurrency(receita.valorOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Recebido</p>
                    <p className="font-semibold text-green-600">{formatCurrency(receita.valorRecebido)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo em Aberto</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(receita.valorDevido)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Situação</p>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                      {receita.situacao}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lançamentos para Extornar */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Selecione os Lançamentos para Extornar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lancamentos.length > 0 ? (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={selectedLancamentos.length === lancamentos.length}
                              onCheckedChange={toggleAll}
                            />
                          </TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Forma de Pagamento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Observação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lancamentos.map((lancamento) => (
                          <TableRow 
                            key={lancamento.id} 
                            className={`hover:bg-muted/50 cursor-pointer ${
                              selectedLancamentos.includes(lancamento.id) ? "bg-orange-50 dark:bg-orange-900/20" : ""
                            }`}
                            onClick={() => toggleLancamento(lancamento.id)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox 
                                checked={selectedLancamentos.includes(lancamento.id)}
                                onCheckedChange={() => toggleLancamento(lancamento.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatDate(lancamento.data)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFormaIcon(lancamento.formaPagamento)}
                                <span>{lancamento.formaPagamento}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(lancamento.valor)}
                            </TableCell>
                            <TableCell>{lancamento.usuario}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {lancamento.observacao || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há lançamentos disponíveis para extorno.
                  </div>
                )}

                {selectedLancamentos.length > 0 && (
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {selectedLancamentos.length} lançamento(s) selecionado(s)
                      </span>
                      <span className="font-bold text-orange-600">
                        Total: {formatCurrency(valorTotalExtorno)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Justificativa */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Justificativa do Extorno *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="justificativa">
                    Informe o motivo do extorno (mínimo 10 caracteres)
                  </Label>
                  <Textarea
                    id="justificativa"
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    placeholder="Descreva detalhadamente o motivo do extorno..."
                    rows={4}
                    className={justificativa.length > 0 && justificativa.length < 10 ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {justificativa.length}/10 caracteres mínimos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview do Resultado */}
            {selectedLancamentos.length > 0 && justificativa.length >= 10 && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Resultado Após o Extorno
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Extornado</p>
                      <p className="font-bold text-orange-600">{formatCurrency(valorTotalExtorno)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Novo Total Recebido</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(receita.valorRecebido - valorTotalExtorno)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Novo Saldo em Aberto</p>
                      <p className="font-semibold">{formatCurrency(novoSaldoDevido)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nova Situação</p>
                      <Badge 
                        variant="outline" 
                        className={
                          novaSituacao === "Aberto" 
                            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        }
                      >
                        {novaSituacao}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/financeiro/receitas/${id}`)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleExtorno}
                disabled={selectedLancamentos.length === 0 || justificativa.length < 10}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Confirmar Extorno
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Confirmar Extorno
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Você está prestes a extornar:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>{selectedLancamentos.length}</strong> lançamento(s)</li>
                <li>Valor total: <strong>{formatCurrency(valorTotalExtorno)}</strong></li>
              </ul>
              <p className="pt-2">
                Esta ação será registrada no histórico da receita e não poderá ser desfeita.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmExtorno}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Confirmar Extorno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReceitaExtorno;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, DollarSign, RotateCcw, Clock, FileText, CreditCard, Banknote, Building2, ArrowRightLeft, FileCheck, Percent, ChevronDown, ChevronRight } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data for the receita
const mockReceita = {
  id: 1,
  codigo: "REC-2024-0001",
  data: "2024-01-15",
  dataVencimento: "2024-02-15",
  descricao: "Consulta particular - João Silva",
  pessoa: "João Silva",
  tipoPessoa: "Paciente",
  valorOriginal: 350.00,
  valorRecebido: 100.00,
  valorDevido: 250.00,
  situacao: "Parcial",
  tipoReceita: "Consulta Particular",
  parcelas: [
    { id: 1, numero: 1, dataVencimento: "2024-02-15", valor: 175.00, situacao: "Parcial", valorRecebido: 100.00 },
    { id: 2, numero: 2, dataVencimento: "2024-03-15", valor: 175.00, situacao: "Aberto", valorRecebido: 0 },
  ],
  lancamentos: [
    { 
      id: 1, 
      data: "2024-01-20", 
      valor: 100.00, 
      formaPagamento: "Dinheiro",
      usuario: "Ednaldo",
      observacao: "Pagamento parcial"
    }
  ],
  historico: [
    { id: 1, data: "2024-01-15 10:30", evento: "Receita criada", descricao: "Receita gerada a partir do atendimento #1234", usuario: "Sistema", impacto: "+R$ 350,00" },
    { id: 2, data: "2024-01-20 14:45", evento: "Recebimento registrado", descricao: "Pagamento em dinheiro recebido", usuario: "Ednaldo", impacto: "-R$ 100,00 (saldo)" },
  ]
};

const ReceitaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedParcelas, setExpandedParcelas] = useState<number[]>([]);

  const receita = mockReceita;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Aberto":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Aberto</Badge>;
      case "Parcial":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Parcial</Badge>;
      case "Quitado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Quitado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getFormaIcon = (forma: string) => {
    switch (forma) {
      case "Dinheiro": return <Banknote className="h-4 w-4 text-green-600" />;
      case "Cheque": return <FileCheck className="h-4 w-4 text-blue-600" />;
      case "Cartão": return <CreditCard className="h-4 w-4 text-purple-600" />;
      case "Desconto": return <Percent className="h-4 w-4 text-red-600" />;
      case "Depósito": return <Building2 className="h-4 w-4 text-teal-600" />;
      case "Transferência": return <ArrowRightLeft className="h-4 w-4 text-indigo-600" />;
      default: return <Banknote className="h-4 w-4" />;
    }
  };

  const toggleParcela = (parcelaId: number) => {
    setExpandedParcelas(prev => 
      prev.includes(parcelaId) 
        ? prev.filter(id => id !== parcelaId)
        : [...prev, parcelaId]
    );
  };

  const canExtornar = receita.lancamentos.length > 0;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro/receitas")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Receitas a Receber
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {receita.codigo}
                  </h1>
                  {getSituacaoBadge(receita.situacao)}
                </div>
                <p className="text-muted-foreground mt-1">
                  {receita.descricao}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/financeiro/receitas/${id}/recebimento`)}
                  disabled={receita.situacao === "Quitado"}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Recebimento
                </Button>
                {canExtornar && (
                  <Button 
                    variant="outline" 
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    onClick={() => navigate(`/financeiro/receitas/${id}/extorno`)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Extornar
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Original</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(receita.valorOriginal)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Recebido</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(receita.valorRecebido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor em Aberto</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {formatCurrency(receita.valorDevido)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Situação Atual</p>
                      <div className="mt-2">
                        {getSituacaoBadge(receita.situacao)}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dados da Receita */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados da Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Receita</p>
                    <p className="font-medium">{receita.tipoReceita}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Pessoa</p>
                    <p className="font-medium">{receita.tipoPessoa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pessoa Vinculada</p>
                    <p className="font-medium">{receita.pessoa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">{formatDate(receita.data)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                    <p className="font-medium">{formatDate(receita.dataVencimento)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Original</p>
                    <p className="font-medium">{formatCurrency(receita.valorOriginal)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parcelas */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Parcelas ({receita.parcelas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Nº Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Recebido</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receita.parcelas.map((parcela) => (
                        <Collapsible key={parcela.id} asChild>
                          <>
                            <TableRow className="hover:bg-muted/50">
                              <TableCell>
                                <CollapsibleTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => toggleParcela(parcela.id)}
                                  >
                                    {expandedParcelas.includes(parcela.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </CollapsibleTrigger>
                              </TableCell>
                              <TableCell className="font-medium">
                                {parcela.numero}/{receita.parcelas.length}
                              </TableCell>
                              <TableCell>{formatDate(parcela.dataVencimento)}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(parcela.valor)}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {formatCurrency(parcela.valorRecebido)}
                              </TableCell>
                              <TableCell className="text-right text-orange-600">
                                {formatCurrency(parcela.valor - parcela.valorRecebido)}
                              </TableCell>
                              <TableCell>
                                {getSituacaoBadge(parcela.situacao)}
                              </TableCell>
                            </TableRow>
                            <CollapsibleContent asChild>
                              <TableRow className="bg-muted/30">
                                <TableCell colSpan={7} className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    <p><strong>Detalhes da Parcela:</strong></p>
                                    <p>Criada em: {formatDate(receita.data)}</p>
                                    <p>Última atualização: {formatDate(receita.data)}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </CollapsibleContent>
                          </>
                        </Collapsible>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Totalizador */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 min-w-[300px]">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Parcelas:</span>
                      <span className="font-medium">{formatCurrency(receita.parcelas.reduce((a, p) => a + p.valor, 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Recebido:</span>
                      <span className="font-medium text-green-600">{formatCurrency(receita.parcelas.reduce((a, p) => a + p.valorRecebido, 0))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Saldo em Aberto:</span>
                      <span className="text-orange-600">{formatCurrency(receita.valorDevido)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lançamentos Recebidos */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Lançamentos Recebidos ({receita.lancamentos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {receita.lancamentos.length > 0 ? (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Data</TableHead>
                          <TableHead>Forma de Pagamento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Observação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receita.lancamentos.map((lancamento) => (
                          <TableRow key={lancamento.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {formatDate(lancamento.data)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFormaIcon(lancamento.formaPagamento)}
                                <span>{lancamento.formaPagamento}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
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
                    Nenhum recebimento registrado para esta receita.
                  </div>
                )}

                {/* Totalizador de Lançamentos */}
                {receita.lancamentos.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 min-w-[250px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Recebido:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(receita.lancamentos.reduce((a, l) => a + l.valor, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-muted-foreground">Saldo Restante:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(receita.valorDevido)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico Financeiro */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receita.historico.map((evento, index) => (
                    <div key={evento.id} className="relative pl-6">
                      {/* Timeline line */}
                      {index < receita.historico.length - 1 && (
                        <div className="absolute left-[9px] top-6 w-0.5 h-full bg-border" />
                      )}
                      
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      
                      {/* Content */}
                      <div className="bg-muted/30 rounded-lg p-4 ml-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">{evento.evento}</p>
                            <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{evento.data}</p>
                            <p className="text-sm font-medium text-primary">{evento.impacto}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          por {evento.usuario}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceitaDetalhe;

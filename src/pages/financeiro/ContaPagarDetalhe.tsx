import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Clock, FileText, Building2, Calendar, Tag, Edit2, Save, X, AlertCircle, CheckCircle, History } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockConta = {
  id: 1,
  codigo: "CP-2024-0001",
  dataLancamento: "2024-01-10",
  dataVencimento: "2024-01-25",
  descricao: "Fornecedor de reagentes - Lote Janeiro",
  fornecedor: "LabSupply Ltda",
  cnpjFornecedor: "12.345.678/0001-90",
  categoria: "Insumos",
  subcategoria: "Reagentes Laboratoriais",
  valorOriginal: 4500.00,
  valorPago: 1500.00,
  valorDevido: 3000.00,
  situacao: "Parcial",
  observacoes: "Pagamento parcelado conforme acordado com fornecedor. Próxima parcela em 30 dias.",
  numeroDocumento: "NF-2024-00458",
  pagamentos: [
    {
      id: 1,
      data: "2024-01-15",
      valor: 1500.00,
      formaPagamento: "Transferência Bancária",
      usuario: "Maria Silva",
      observacao: "Primeira parcela"
    }
  ],
  historico: [
    { id: 1, data: "2024-01-10 09:15", evento: "Conta criada", descricao: "Conta a pagar registrada no sistema", usuario: "João Santos", impacto: "+R$ 4.500,00" },
    { id: 2, data: "2024-01-15 14:30", evento: "Pagamento registrado", descricao: "Pagamento parcial via transferência bancária", usuario: "Maria Silva", impacto: "-R$ 1.500,00 (saldo)" },
  ]
};

const ContaPagarDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedConta, setEditedConta] = useState(mockConta);
  
  const conta = mockConta;

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
      case "Pago":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Pago</Badge>;
      case "Vencido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Vencido</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const isVencido = () => {
    if (conta.situacao === "Pago" || conta.situacao === "Cancelado") return false;
    const hoje = new Date();
    const vencimento = new Date(conta.dataVencimento);
    return vencimento < hoje;
  };

  const handleSave = () => {
    // Mock save
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedConta(mockConta);
    setIsEditing(false);
  };

  const canEdit = conta.situacao !== "Pago" && conta.situacao !== "Cancelado";
  const canPay = conta.situacao !== "Pago" && conta.situacao !== "Cancelado";

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro/contas-pagar")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Contas a Pagar
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    {conta.codigo}
                  </h1>
                  {getSituacaoBadge(conta.situacao)}
                  {isVencido() && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Vencida
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {conta.descricao}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <>
                    {canEdit && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    {canPay && (
                      <Button onClick={() => navigate(`/financeiro/contas-pagar/${id}/pagamento`)}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Registrar Pagamento
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Alert for overdue */}
            {isVencido() && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Esta conta está vencida desde {formatDate(conta.dataVencimento)}. O valor em aberto é de {formatCurrency(conta.valorDevido)}.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Original</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(conta.valorOriginal)}
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
                      <p className="text-sm font-medium text-muted-foreground">Valor Pago</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(conta.valorPago)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo Devedor</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {formatCurrency(conta.valorDevido)}
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
                      <p className="text-sm font-medium text-muted-foreground">Situação</p>
                      <div className="mt-2">
                        {getSituacaoBadge(conta.situacao)}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dados da Conta */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Fornecedor</p>
                    {isEditing ? (
                      <Input
                        value={editedConta.fornecedor}
                        onChange={(e) => setEditedConta({ ...editedConta, fornecedor: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{conta.fornecedor}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ do Fornecedor</p>
                    <p className="font-medium">{conta.cnpjFornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nº Documento</p>
                    <p className="font-medium">{conta.numeroDocumento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Lançamento</p>
                    <p className="font-medium">{formatDate(conta.dataLancamento)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedConta.dataVencimento}
                        onChange={(e) => setEditedConta({ ...editedConta, dataVencimento: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{formatDate(conta.dataVencimento)}</p>
                        {isVencido() && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    {isEditing ? (
                      <Select
                        value={editedConta.categoria}
                        onValueChange={(value) => setEditedConta({ ...editedConta, categoria: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Insumos">Insumos</SelectItem>
                          <SelectItem value="Despesas Fixas">Despesas Fixas</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Material">Material</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{conta.categoria}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                  {isEditing ? (
                    <Input
                      value={editedConta.descricao}
                      onChange={(e) => setEditedConta({ ...editedConta, descricao: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{conta.descricao}</p>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  {isEditing ? (
                    <Textarea
                      value={editedConta.observacoes}
                      onChange={(e) => setEditedConta({ ...editedConta, observacoes: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{conta.observacoes || "Nenhuma observação registrada."}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pagamentos Realizados */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pagamentos Realizados ({conta.pagamentos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conta.pagamentos.length > 0 ? (
                  <>
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
                          {conta.pagamentos.map((pagamento) => (
                            <TableRow key={pagamento.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                {formatDate(pagamento.data)}
                              </TableCell>
                              <TableCell>{pagamento.formaPagamento}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">
                                {formatCurrency(pagamento.valor)}
                              </TableCell>
                              <TableCell>{pagamento.usuario}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {pagamento.observacao || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Totalizador */}
                    <div className="mt-4 flex justify-end">
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2 min-w-[300px]">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total da Conta:</span>
                          <span className="font-medium">{formatCurrency(conta.valorOriginal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Pago:</span>
                          <span className="font-medium text-green-600">{formatCurrency(conta.valorPago)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Saldo Devedor:</span>
                          <span className="text-orange-600">{formatCurrency(conta.valorDevido)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum pagamento registrado para esta conta.</p>
                    {canPay && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate(`/financeiro/contas-pagar/${id}/pagamento`)}
                      >
                        Registrar Primeiro Pagamento
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Movimentações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conta.historico.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        {index < conta.historico.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{item.evento}</p>
                          <span className="text-xs text-muted-foreground">{item.data}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.descricao}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-muted-foreground">Usuário: {item.usuario}</span>
                          {item.impacto && (
                            <span className={item.impacto.includes("+") ? "text-red-600" : "text-green-600"}>
                              {item.impacto}
                            </span>
                          )}
                        </div>
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

export default ContaPagarDetalhe;

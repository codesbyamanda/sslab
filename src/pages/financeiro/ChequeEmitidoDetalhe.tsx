import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileCheck, Clock, Calendar, Building2, User, Edit2, Save, X, AlertCircle, CheckCircle, RotateCcw, History, XCircle } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockCheque = {
  id: 1,
  numero: "000451",
  banco: "Banco do Brasil",
  codigoBanco: "001",
  agencia: "1234-5",
  conta: "56789-0",
  favorecido: "LabSupply Ltda",
  cnpjFavorecido: "12.345.678/0001-90",
  dataEmissao: "2024-01-10",
  dataCompensacao: null,
  dataBomPara: "2024-01-20",
  valor: 4500.00,
  situacao: "Aberto",
  descricao: "Pagamento de reagentes laboratoriais - Lote Janeiro/2024",
  observacoes: "Cheque emitido conforme pedido de compra #PC-2024-0045",
  contaPagarVinculada: "CP-2024-0001",
  historico: [
    { id: 1, data: "2024-01-10 09:30", evento: "Cheque emitido", descricao: "Cheque emitido para pagamento de fornecedor", usuario: "Maria Silva", impacto: "R$ 4.500,00" },
    { id: 2, data: "2024-01-10 09:35", evento: "Vinculação", descricao: "Vinculado à conta a pagar CP-2024-0001", usuario: "Maria Silva", impacto: null },
  ]
};

const ChequeEmitidoDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCheque, setEditedCheque] = useState(mockCheque);
  
  const cheque = mockCheque;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Aberto":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Aberto</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Compensado</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">Devolvido</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case "Aberto":
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case "Compensado":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "Devolvido":
        return <RotateCcw className="h-6 w-6 text-red-600" />;
      case "Cancelado":
        return <XCircle className="h-6 w-6 text-muted-foreground" />;
      default:
        return <FileCheck className="h-6 w-6" />;
    }
  };

  const handleSave = () => {
    toast({ title: "Sucesso", description: "Cheque atualizado com sucesso!" });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCheque(mockCheque);
    setIsEditing(false);
  };

  const handleMarcarCompensado = () => {
    toast({ title: "Sucesso", description: "Cheque marcado como compensado!" });
  };

  const handleMarcarDevolvido = () => {
    toast({ title: "Atenção", description: "Cheque marcado como devolvido!", variant: "destructive" });
  };

  const handleCancelar = () => {
    toast({ title: "Cheque cancelado", description: "O cheque foi cancelado com sucesso." });
  };

  const canEdit = cheque.situacao === "Aberto";
  const canCompensate = cheque.situacao === "Aberto";
  const canDevolver = cheque.situacao === "Aberto" || cheque.situacao === "Compensado";
  const canCancel = cheque.situacao === "Aberto";

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro/cheques-emitidos")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Cheques Emitidos
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">
                    Cheque Nº {cheque.numero}
                  </h1>
                  {getSituacaoBadge(cheque.situacao)}
                </div>
                <p className="text-muted-foreground mt-1">
                  {cheque.banco} • Ag. {cheque.agencia} • CC {cheque.conta}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
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
                    {canCompensate && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Compensar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Compensação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja marcar o cheque Nº {cheque.numero} como compensado? Esta ação irá registrar a baixa no fluxo financeiro.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleMarcarCompensado}>Confirmar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {canDevolver && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Devolvido
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Registrar Devolução</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja registrar que o cheque Nº {cheque.numero} foi devolvido pelo banco? Esta ação ficará registrada no histórico.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleMarcarDevolvido} className="bg-red-600 hover:bg-red-700">
                              Confirmar Devolução
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {canCancel && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="text-muted-foreground">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancelar Cheque
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar Cheque</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja cancelar o cheque Nº {cheque.numero}? O cheque será marcado como cancelado e não poderá mais ser utilizado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelar} className="bg-muted text-muted-foreground hover:bg-muted/80">
                              Cancelar Cheque
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Alert for devolvido */}
            {cheque.situacao === "Devolvido" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este cheque foi devolvido pelo banco. Verifique o motivo da devolução e tome as providências necessárias junto ao favorecido.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor do Cheque</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(cheque.valor)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {formatDate(cheque.dataEmissao)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bom Para</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {formatDate(cheque.dataBomPara)}
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
                        {getSituacaoBadge(cheque.situacao)}
                      </div>
                    </div>
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      cheque.situacao === "Compensado" ? "bg-green-500/10" :
                      cheque.situacao === "Devolvido" ? "bg-red-500/10" :
                      cheque.situacao === "Cancelado" ? "bg-muted" :
                      "bg-yellow-500/10"
                    }`}>
                      {getSituacaoIcon(cheque.situacao)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dados Bancários */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dados Bancários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">{cheque.banco}</p>
                    <p className="text-xs text-muted-foreground">Código: {cheque.codigoBanco}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agência</p>
                    <p className="font-medium font-mono">{cheque.agencia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conta Corrente</p>
                    <p className="font-medium font-mono">{cheque.conta}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Número do Cheque</p>
                    <p className="font-medium font-mono text-lg">{cheque.numero}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favorecido */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Favorecido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome / Razão Social</p>
                    {isEditing ? (
                      <Input
                        value={editedCheque.favorecido}
                        onChange={(e) => setEditedCheque({ ...editedCheque, favorecido: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{cheque.favorecido}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ / CPF</p>
                    <p className="font-medium">{cheque.cnpjFavorecido}</p>
                  </div>
                  {cheque.contaPagarVinculada && (
                    <div>
                      <p className="text-sm text-muted-foreground">Conta a Pagar Vinculada</p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() => navigate(`/financeiro/contas-pagar/1`)}
                      >
                        {cheque.contaPagarVinculada}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Datas e Valores */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Datas e Valores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Emissão</p>
                    <p className="font-medium">{formatDate(cheque.dataEmissao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bom Para</p>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedCheque.dataBomPara || ""}
                        onChange={(e) => setEditedCheque({ ...editedCheque, dataBomPara: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{formatDate(cheque.dataBomPara)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Compensação</p>
                    <p className="font-medium">{formatDate(cheque.dataCompensacao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-bold text-lg">{formatCurrency(cheque.valor)}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descrição</p>
                  {isEditing ? (
                    <Input
                      value={editedCheque.descricao}
                      onChange={(e) => setEditedCheque({ ...editedCheque, descricao: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{cheque.descricao}</p>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  {isEditing ? (
                    <Textarea
                      value={editedCheque.observacoes}
                      onChange={(e) => setEditedCheque({ ...editedCheque, observacoes: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{cheque.observacoes || "Nenhuma observação registrada."}</p>
                  )}
                </div>
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
                  {cheque.historico.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        {index < cheque.historico.length - 1 && (
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
                            <span className="font-medium text-primary">{item.impacto}</span>
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

export default ChequeEmitidoDetalhe;

import { ArrowLeft, ArrowRightLeft, Building2, Calendar, User, FileText, CheckCircle, Clock, XCircle, Banknote } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";

// Mock data
const mockTransferencia = {
  id: 1,
  codigo: "TB-2024-0001",
  data: "2024-01-20",
  contaOrigem: {
    banco: "Banco do Brasil",
    agencia: "1234-5",
    conta: "12345-6",
    saldoAntes: 70320.50,
    saldoDepois: 45320.50,
  },
  contaDestino: {
    banco: "Itaú",
    agencia: "0987",
    conta: "98765-4",
    saldoAntes: 3150.00,
    saldoDepois: 28150.00,
  },
  valor: 25000.00,
  tipo: "TED",
  situacao: "Efetuada",
  dataEfetivacao: "2024-01-20",
  usuario: "Admin Sistema",
  observacoes: "Transferência para pagamento de fornecedores via conta Itaú.",
};

const mockHistorico = [
  { data: "2024-01-20 15:30", acao: "Transferência efetuada", usuario: "Admin Sistema", detalhes: "TED confirmado pelo banco" },
  { data: "2024-01-20 14:00", acao: "Transferência agendada", usuario: "Admin Sistema", detalhes: "Aguardando efetivação bancária" },
  { data: "2024-01-20 13:45", acao: "Transferência criada", usuario: "Admin Sistema", detalhes: "Solicitação de TED registrada" },
];

const TransferenciaBancariaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Efetuada":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 gap-1"><CheckCircle className="h-3 w-3" /> Efetuada</Badge>;
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "Cancelada":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted gap-1"><XCircle className="h-3 w-3" /> Cancelada</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "TED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">TED</Badge>;
      case "DOC":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">DOC</Badge>;
      case "PIX":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">PIX</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const handleConfirmar = () => {
    toast.success("Transferência confirmada com sucesso!");
  };

  const handleCancelar = () => {
    toast.success("Transferência cancelada com sucesso!");
    navigate("/financeiro/transferencias-bancarias");
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
              onClick={() => navigate("/financeiro/transferencias-bancarias")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Transferências Bancárias
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ArrowRightLeft className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {mockTransferencia.codigo}
                    </h1>
                    {getSituacaoBadge(mockTransferencia.situacao)}
                    {getTipoBadge(mockTransferencia.tipo)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Transferência bancária entre contas
                  </p>
                </div>
              </div>
              {mockTransferencia.situacao === "Pendente" && (
                <div className="flex items-center gap-3">
                  <Button onClick={handleConfirmar} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Efetivação
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Transferência</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja realmente cancelar esta transferência? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelar}>Confirmar Cancelamento</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Valor da Transferência */}
            <Card className="bg-card border-border shadow-card border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Transferido</p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {formatCurrency(mockTransferencia.valor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <p className="text-xs">Data</p>
                        <p className="font-medium text-foreground">{formatDate(mockTransferencia.data)}</p>
                      </div>
                    </div>
                    {mockTransferencia.dataEfetivacao && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-xs">Efetivação</p>
                          <p className="font-medium text-foreground">{formatDate(mockTransferencia.dataEfetivacao)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contas Envolvidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conta Origem */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-red-500" />
                    Conta Origem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Banco</p>
                      <p className="font-medium text-lg">{mockTransferencia.contaOrigem.banco}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Agência</p>
                        <p className="font-medium font-mono">{mockTransferencia.contaOrigem.agencia}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Conta</p>
                        <p className="font-medium font-mono">{mockTransferencia.contaOrigem.conta}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Antes</p>
                        <p className="font-medium font-mono">{formatCurrency(mockTransferencia.contaOrigem.saldoAntes)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Depois</p>
                        <p className="font-medium font-mono text-red-600">{formatCurrency(mockTransferencia.contaOrigem.saldoDepois)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conta Destino */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-500" />
                    Conta Destino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Banco</p>
                      <p className="font-medium text-lg">{mockTransferencia.contaDestino.banco}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Agência</p>
                        <p className="font-medium font-mono">{mockTransferencia.contaDestino.agencia}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Conta</p>
                        <p className="font-medium font-mono">{mockTransferencia.contaDestino.conta}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Antes</p>
                        <p className="font-medium font-mono">{formatCurrency(mockTransferencia.contaDestino.saldoAntes)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Depois</p>
                        <p className="font-medium font-mono text-green-600">{formatCurrency(mockTransferencia.contaDestino.saldoDepois)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações Adicionais */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Informações da Transferência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-medium font-mono">{mockTransferencia.codigo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      {mockTransferencia.tipo}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Usuário Responsável</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {mockTransferencia.usuario}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Situação</p>
                    {getSituacaoBadge(mockTransferencia.situacao)}
                  </div>
                </div>
                {mockTransferencia.observacoes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{mockTransferencia.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistorico.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.acao}</p>
                          <p className="text-sm text-muted-foreground">{item.data}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.detalhes}</p>
                        <p className="text-xs text-muted-foreground mt-1">por {item.usuario}</p>
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

export default TransferenciaBancariaDetalhe;

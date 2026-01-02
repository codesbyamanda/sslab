import { ArrowLeft, ArrowLeftRight, Wallet, Calendar, User, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
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
  codigo: "TC-2024-0001",
  data: "2024-01-20 14:30",
  caixaOrigem: "Caixa Principal",
  saldoOrigemAntes: 17420.50,
  saldoOrigemDepois: 15420.50,
  caixaDestino: "Caixa Recepção",
  saldoDestinoAntes: 1250.00,
  saldoDestinoDepois: 3250.00,
  valor: 2000.00,
  usuario: "Maria Silva",
  situacao: "Concluída",
  observacoes: "Transferência para troco do caixa da recepção.",
};

const mockHistorico = [
  { data: "2024-01-20 14:30", acao: "Transferência concluída", usuario: "Maria Silva", detalhes: "Valor transferido com sucesso" },
  { data: "2024-01-20 14:29", acao: "Transferência iniciada", usuario: "Maria Silva", detalhes: "Solicitação de transferência registrada" },
];

const TransferenciaCaixaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Concluída":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 gap-1"><CheckCircle className="h-3 w-3" /> Concluída</Badge>;
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "Cancelada":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted gap-1"><XCircle className="h-3 w-3" /> Cancelada</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const handleCancelar = () => {
    toast.success("Transferência cancelada com sucesso!");
    navigate("/financeiro/transferencias-caixas");
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
              onClick={() => navigate("/financeiro/transferencias-caixas")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Transferências entre Caixas
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ArrowLeftRight className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      {mockTransferencia.codigo}
                    </h1>
                    {getSituacaoBadge(mockTransferencia.situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Transferência entre caixas internos
                  </p>
                </div>
              </div>
              {mockTransferencia.situacao === "Pendente" && (
                <div className="flex items-center gap-3">
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Transferência
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
                          Deseja realmente cancelar esta transferência? Os saldos não serão afetados.
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">{mockTransferencia.data}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados da Transferência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Caixa Origem */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-red-500" />
                    Caixa Origem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nome do Caixa</p>
                      <p className="font-medium text-lg">{mockTransferencia.caixaOrigem}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Antes</p>
                        <p className="font-medium font-mono">{formatCurrency(mockTransferencia.saldoOrigemAntes)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Depois</p>
                        <p className="font-medium font-mono text-red-600">{formatCurrency(mockTransferencia.saldoOrigemDepois)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Caixa Destino */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-500" />
                    Caixa Destino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nome do Caixa</p>
                      <p className="font-medium text-lg">{mockTransferencia.caixaDestino}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Antes</p>
                        <p className="font-medium font-mono">{formatCurrency(mockTransferencia.saldoDestinoAntes)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Saldo Depois</p>
                        <p className="font-medium font-mono text-green-600">{formatCurrency(mockTransferencia.saldoDestinoDepois)}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-medium font-mono">{mockTransferencia.codigo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Usuário Responsável</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {mockTransferencia.usuario}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data/Hora</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {mockTransferencia.data}
                    </p>
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

export default TransferenciaCaixaDetalhe;

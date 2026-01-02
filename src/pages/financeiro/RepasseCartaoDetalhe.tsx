import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HandCoins, CreditCard, Calendar, Calculator, AlertCircle, Clock, User, CheckCircle } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const mockRepasses = [
  {
    id: 1,
    dataPrevista: "2024-02-15",
    dataRecebida: null,
    adquirente: "Cielo",
    bandeira: "Visa",
    tipo: "Crédito",
    numeroTransacao: "TXN001234",
    parcela: "1/1",
    valorBruto: 500.00,
    taxa: 2.5,
    valorLiquido: 487.50,
    situacao: "Previsto",
    transacaoOriginal: { data: "2024-01-15", portador: "João Silva" }
  },
  {
    id: 2,
    dataPrevista: "2024-01-16",
    dataRecebida: "2024-01-16",
    adquirente: "Rede",
    bandeira: "Mastercard",
    tipo: "Débito",
    numeroTransacao: "TXN005678",
    parcela: "1/1",
    valorBruto: 250.00,
    taxa: 1.8,
    valorLiquido: 245.50,
    situacao: "Recebido",
    transacaoOriginal: { data: "2024-01-14", portador: "Maria Santos" }
  },
  {
    id: 3,
    dataPrevista: "2024-02-13",
    dataRecebida: null,
    adquirente: "Stone",
    bandeira: "Elo",
    tipo: "Parcelado",
    numeroTransacao: "TXN009012",
    parcela: "1/3",
    valorBruto: 300.00,
    taxa: 3.2,
    valorLiquido: 290.40,
    situacao: "Previsto",
    transacaoOriginal: { data: "2024-01-13", portador: "Carlos Oliveira" }
  },
  {
    id: 5,
    dataPrevista: "2024-01-10",
    dataRecebida: null,
    adquirente: "Cielo",
    bandeira: "American Express",
    tipo: "Crédito",
    numeroTransacao: "TXN003456",
    parcela: "1/1",
    valorBruto: 1200.00,
    taxa: 3.5,
    valorLiquido: 1158.00,
    situacao: "Atrasado",
    transacaoOriginal: { data: "2024-01-05", portador: "Ana Pereira" }
  },
  {
    id: 6,
    dataPrevista: "2024-01-12",
    dataRecebida: null,
    adquirente: "Rede",
    bandeira: "Visa",
    tipo: "Crédito",
    numeroTransacao: "TXN007890",
    parcela: "1/1",
    valorBruto: 800.00,
    taxa: 2.5,
    valorLiquido: 780.00,
    situacao: "Contestado",
    transacaoOriginal: { data: "2024-01-08", portador: "Pedro Souza" }
  },
];

const mockHistorico = [
  {
    id: 1,
    dataHora: "2024-01-15 10:30:00",
    usuario: "Sistema",
    acao: "Repasse Previsto",
    descricao: "Repasse gerado automaticamente a partir da transação de cartão"
  },
  {
    id: 2,
    dataHora: "2024-01-16 09:00:00",
    usuario: "Maria Financeiro",
    acao: "Recebimento Confirmado",
    descricao: "Valor creditado na conta corrente"
  },
];

const RepasseCartaoDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const repasse = mockRepasses.find(r => r.id === Number(id)) || mockRepasses[0];
  
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0]);

  const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "-";
  const formatDateTime = (dateStr: string) => {
    const [date, time] = dateStr.split(" ");
    return `${new Date(date).toLocaleDateString("pt-BR")} às ${time}`;
  };
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Previsto":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">{situacao}</Badge>;
      case "Recebido":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{situacao}</Badge>;
      case "Atrasado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{situacao}</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">{situacao}</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Débito":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Débito</Badge>;
      case "Crédito":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Crédito</Badge>;
      case "Parcelado":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Parcelado</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  const handleConfirmarRecebimento = () => {
    toast({
      title: "Recebimento confirmado",
      description: `Repasse de ${formatCurrency(repasse.valorLiquido)} confirmado com sucesso.`,
    });
    setShowConfirmacao(false);
    navigate("/financeiro/repasse-cartao");
  };

  const diasAtraso = () => {
    if (repasse.situacao !== "Atrasado") return 0;
    const prevista = new Date(repasse.dataPrevista);
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - prevista.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const podeConfirmarRecebimento = repasse.situacao === "Previsto" || repasse.situacao === "Atrasado";

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/financeiro/repasse-cartao")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <HandCoins className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                      Repasse #{repasse.numeroTransacao}
                    </h1>
                    {getSituacaoBadge(repasse.situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {repasse.adquirente} • {repasse.bandeira} • Parcela {repasse.parcela}
                  </p>
                </div>
              </div>
              {podeConfirmarRecebimento && !showConfirmacao && (
                <Button onClick={() => setShowConfirmacao(true)} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirmar Recebimento
                </Button>
              )}
            </div>

            {/* Alertas */}
            {repasse.situacao === "Atrasado" && (
              <Alert className="bg-red-500/5 border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>Repasse Atrasado há {diasAtraso()} dias</strong> — 
                  Estava previsto para {formatDate(repasse.dataPrevista)} e ainda não foi recebido. 
                  Entre em contato com a operadora {repasse.adquirente} para verificar.
                </AlertDescription>
              </Alert>
            )}

            {repasse.situacao === "Contestado" && (
              <Alert className="bg-orange-500/5 border-orange-500/30">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  <strong>Transação Contestada</strong> — 
                  O portador do cartão contestou esta transação. O repasse está suspenso até a resolução da disputa.
                </AlertDescription>
              </Alert>
            )}

            {/* Confirmação de Recebimento */}
            {showConfirmacao && (
              <Card className="bg-green-500/5 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Recebimento do Repasse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Confirme que o valor de <strong className="text-green-600">{formatCurrency(repasse.valorLiquido)}</strong> foi 
                    creditado em sua conta pela operadora <strong>{repasse.adquirente}</strong>.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="space-y-2 flex-1 md:max-w-xs">
                      <Label>Data do Recebimento</Label>
                      <Input 
                        type="date" 
                        value={dataRecebimento}
                        onChange={(e) => setDataRecebimento(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowConfirmacao(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleConfirmarRecebimento} className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Transação Original */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      Transação Original
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Nº da Transação</p>
                        <p className="font-mono font-medium">{repasse.numeroTransacao}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Data da Venda</p>
                        <p className="font-medium">{formatDate(repasse.transacaoOriginal.data)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Portador</p>
                        <p className="font-medium">{repasse.transacaoOriginal.portador}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Parcela</p>
                        <Badge variant="secondary" className="mt-1">{repasse.parcela}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações do Repasse */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <HandCoins className="h-5 w-5 text-primary" />
                      Informações do Repasse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Adquirente</p>
                        <p className="font-medium">{repasse.adquirente}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Bandeira</p>
                        <p className="font-medium">{repasse.bandeira}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tipo de Operação</p>
                        <div>{getTipoBadge(repasse.tipo)}</div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Taxa Aplicada</p>
                        <p className="font-medium text-red-600">{repasse.taxa}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prazos */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      Prazos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Data Prevista</p>
                        <p className={`text-xl font-bold ${repasse.situacao === "Atrasado" ? "text-red-600" : "text-foreground"}`}>
                          {formatDate(repasse.dataPrevista)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Data Recebida</p>
                        <p className={`text-xl font-bold ${repasse.dataRecebida ? "text-green-600" : "text-muted-foreground"}`}>
                          {formatDate(repasse.dataRecebida)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cálculo do Repasse */}
                <Card className="bg-muted/30 border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-green-600" />
                      Cálculo do Repasse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valor Bruto da Transação</span>
                        <span className="text-lg font-medium">{formatCurrency(repasse.valorBruto)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Taxa do Adquirente ({repasse.taxa}%)</span>
                        <span className="text-lg font-medium text-red-600">
                          - {formatCurrency(repasse.valorBruto * repasse.taxa / 100)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Valor Líquido a Receber</span>
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(repasse.valorLiquido)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Coluna Lateral - Histórico */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border shadow-card sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Histórico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockHistorico.map((item) => (
                        <div key={item.id} className="border-l-2 border-primary/30 pl-4 pb-4 last:pb-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(item.dataHora)}
                          </div>
                          <p className="font-medium text-foreground mt-1">{item.acao}</p>
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <User className="h-3 w-3" />
                            {item.usuario}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RepasseCartaoDetalhe;

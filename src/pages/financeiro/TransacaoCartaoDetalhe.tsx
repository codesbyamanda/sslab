import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Edit, Save, X, Clock, User } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const mockTransacoes = [
  {
    id: 1,
    data: "2024-01-15",
    bandeira: "Visa",
    adquirente: "Cielo",
    tipo: "Crédito",
    parcelas: 1,
    valorBruto: 500.00,
    taxa: 2.5,
    valorLiquido: 487.50,
    previsaoRepasse: "2024-02-15",
    situacao: "Pendente",
    portador: "João Silva",
    observacoes: ""
  },
  {
    id: 2,
    data: "2024-01-14",
    bandeira: "Mastercard",
    adquirente: "Rede",
    tipo: "Débito",
    parcelas: 1,
    valorBruto: 250.00,
    taxa: 1.8,
    valorLiquido: 245.50,
    previsaoRepasse: "2024-01-16",
    situacao: "Compensado",
    portador: "Maria Santos",
    observacoes: ""
  },
  {
    id: 3,
    data: "2024-01-13",
    bandeira: "Elo",
    adquirente: "Stone",
    tipo: "Parcelado Loja",
    parcelas: 3,
    valorBruto: 900.00,
    taxa: 3.2,
    valorLiquido: 871.20,
    previsaoRepasse: "2024-02-13",
    situacao: "Pendente",
    portador: "Carlos Oliveira",
    observacoes: "Parcelado em 3x"
  },
  {
    id: 4,
    data: "2024-01-12",
    bandeira: "American Express",
    adquirente: "Cielo",
    tipo: "Crédito",
    parcelas: 1,
    valorBruto: 1200.00,
    taxa: 3.5,
    valorLiquido: 1158.00,
    previsaoRepasse: "2024-02-12",
    situacao: "Contestado",
    portador: "Ana Pereira",
    observacoes: "Cliente contestou a compra"
  },
];

const mockHistorico = [
  {
    id: 1,
    dataHora: "2024-01-15 09:30:00",
    usuario: "Admin Sistema",
    acao: "Criação",
    descricao: "Transação registrada no sistema"
  },
  {
    id: 2,
    dataHora: "2024-01-16 14:15:00",
    usuario: "Maria Financeiro",
    acao: "Alteração de Situação",
    descricao: "Situação alterada de 'Pendente' para 'Compensado'"
  },
];

const bandeiras = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard", "Diners"];
const adquirentes = ["Cielo", "Rede", "Stone", "PagSeguro", "Getnet", "Safrapay"];
const tiposOperacao = [
  { value: "Débito", taxa: 1.8 },
  { value: "Crédito", taxa: 2.5 },
  { value: "Parcelado Loja", taxa: 3.2 },
  { value: "Parcelado Juros", taxa: 4.0 },
];
const situacoes = ["Pendente", "Compensado", "Contestado", "Cancelado"];

const TransacaoCartaoDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const transacao = mockTransacoes.find(t => t.id === Number(id)) || mockTransacoes[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(transacao.data);
  const [bandeira, setBandeira] = useState(transacao.bandeira);
  const [adquirente, setAdquirente] = useState(transacao.adquirente);
  const [tipo, setTipo] = useState(transacao.tipo);
  const [parcelas, setParcelas] = useState(transacao.parcelas.toString());
  const [valorBruto, setValorBruto] = useState(transacao.valorBruto.toString());
  const [taxa, setTaxa] = useState(transacao.taxa.toString());
  const [previsaoRepasse, setPrevisaoRepasse] = useState(transacao.previsaoRepasse);
  const [situacao, setSituacao] = useState(transacao.situacao);
  const [portador, setPortador] = useState(transacao.portador);
  const [observacoes, setObservacoes] = useState(transacao.observacoes);

  const valorLiquido = (parseFloat(valorBruto) || 0) - ((parseFloat(valorBruto) || 0) * (parseFloat(taxa) || 0) / 100);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");
  const formatDateTime = (dateStr: string) => {
    const [date, time] = dateStr.split(" ");
    return `${new Date(date).toLocaleDateString("pt-BR")} às ${time}`;
  };
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Pendente":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{sit}</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{sit}</Badge>;
      case "Contestado":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{sit}</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/30">{sit}</Badge>;
      default:
        return <Badge variant="outline">{sit}</Badge>;
    }
  };

  const getTipoBadge = (t: string) => {
    switch (t) {
      case "Débito":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Débito</Badge>;
      case "Crédito":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Crédito</Badge>;
      case "Parcelado Loja":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Parcelado Loja</Badge>;
      case "Parcelado Juros":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Parcelado Juros</Badge>;
      default:
        return <Badge variant="secondary">{t}</Badge>;
    }
  };

  const handleSave = () => {
    toast({
      title: "Transação atualizada",
      description: "As alterações foram salvas com sucesso. O histórico foi atualizado.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setData(transacao.data);
    setBandeira(transacao.bandeira);
    setAdquirente(transacao.adquirente);
    setTipo(transacao.tipo);
    setParcelas(transacao.parcelas.toString());
    setValorBruto(transacao.valorBruto.toString());
    setTaxa(transacao.taxa.toString());
    setPrevisaoRepasse(transacao.previsaoRepasse);
    setSituacao(transacao.situacao);
    setPortador(transacao.portador);
    setObservacoes(transacao.observacoes);
    setIsEditing(false);
  };

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
                  onClick={() => navigate("/financeiro/transacoes-cartao")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                      Transação de Cartão
                    </h1>
                    {getSituacaoBadge(situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    #{transacao.id} • {portador}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} className="gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados da Transação */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Dados da Transação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data da Operação</Label>
                        {isEditing ? (
                          <Input 
                            type="date" 
                            value={data} 
                            onChange={(e) => setData(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium">{formatDate(data)}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Portador</Label>
                        {isEditing ? (
                          <Input 
                            value={portador} 
                            onChange={(e) => setPortador(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium">{portador}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Bandeira</Label>
                        {isEditing ? (
                          <Select value={bandeira} onValueChange={setBandeira}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {bandeiras.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-foreground font-medium">{bandeira}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Adquirente</Label>
                        {isEditing ? (
                          <Select value={adquirente} onValueChange={setAdquirente}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {adquirentes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-foreground font-medium">{adquirente}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Operação</Label>
                        {isEditing ? (
                          <Select value={tipo} onValueChange={setTipo}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {tiposOperacao.map(t => <SelectItem key={t.value} value={t.value}>{t.value}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div>{getTipoBadge(tipo)}</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantidade de Parcelas</Label>
                        {isEditing ? (
                          <Select value={parcelas} onValueChange={setParcelas}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                                <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-foreground font-medium">{parcelas}x</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Previsão de Repasse</Label>
                        {isEditing ? (
                          <Input 
                            type="date" 
                            value={previsaoRepasse} 
                            onChange={(e) => setPrevisaoRepasse(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium">{formatDate(previsaoRepasse)}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Valores */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Valores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Valor Bruto</Label>
                        {isEditing ? (
                          <Input 
                            type="number"
                            step="0.01"
                            value={valorBruto} 
                            onChange={(e) => setValorBruto(e.target.value)} 
                          />
                        ) : (
                          <p className="text-2xl font-bold text-foreground">{formatCurrency(parseFloat(valorBruto))}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Taxa (%)</Label>
                        {isEditing ? (
                          <Input 
                            type="number"
                            step="0.01"
                            value={taxa} 
                            onChange={(e) => setTaxa(e.target.value)} 
                          />
                        ) : (
                          <p className="text-2xl font-bold text-red-600">{taxa}%</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Líquido</Label>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(valorLiquido)}</p>
                        <p className="text-xs text-muted-foreground">Calculado automaticamente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Situação */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Situação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Alterar a situação da transação gera automaticamente um registro no histórico.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label>Situação Atual</Label>
                      {isEditing ? (
                        <Select value={situacao} onValueChange={setSituacao}>
                          <SelectTrigger className="w-full md:w-64">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {situacoes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div>{getSituacaoBadge(situacao)}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Observações */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea 
                        value={observacoes} 
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={4}
                        placeholder="Adicionar observações..."
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {observacoes || "Nenhuma observação registrada."}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Histórico */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border shadow-card sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Histórico de Movimentações
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

export default TransacaoCartaoDetalhe;

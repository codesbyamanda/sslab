import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Landmark, Edit, Save, X, Clock, User, FileCheck, AlertCircle } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const mockDepositos = [
  {
    id: 1,
    data: "2024-01-15",
    banco: "001 - Banco do Brasil",
    agencia: "1234",
    conta: "12345-6",
    valor: 5500.00,
    numeroTransacao: "DEP001234",
    situacao: "Depositado",
    cheques: [
      { id: 1, numero: "000123", emitente: "João Silva", cpfCnpj: "123.456.789-00", valor: 1500.00, situacao: "Depositado" },
      { id: 2, numero: "000456", emitente: "Maria Santos", cpfCnpj: "987.654.321-00", valor: 2500.00, situacao: "Depositado" },
      { id: 3, numero: "000789", emitente: "Carlos Oliveira", cpfCnpj: "456.789.123-00", valor: 1500.00, situacao: "Depositado" },
    ]
  },
  {
    id: 2,
    data: "2024-01-12",
    banco: "237 - Bradesco",
    agencia: "5678",
    conta: "67890-1",
    valor: 3200.00,
    numeroTransacao: "DEP005678",
    situacao: "Compensado",
    cheques: [
      { id: 4, numero: "001234", emitente: "Ana Pereira", cpfCnpj: "321.654.987-00", valor: 3200.00, situacao: "Compensado" },
    ]
  },
  {
    id: 3,
    data: "2024-01-10",
    banco: "341 - Itaú Unibanco",
    agencia: "9012",
    conta: "34567-8",
    valor: 800.00,
    numeroTransacao: "DEP009012",
    situacao: "Devolvido",
    cheques: [
      { id: 5, numero: "005678", emitente: "Pedro Souza", cpfCnpj: "789.123.456-00", valor: 800.00, situacao: "Devolvido" },
    ]
  },
];

const mockHistorico = [
  {
    id: 1,
    dataHora: "2024-01-15 09:30:00",
    usuario: "Admin Sistema",
    acao: "Criação",
    descricao: "Depósito registrado no sistema"
  },
  {
    id: 2,
    dataHora: "2024-01-16 10:45:00",
    usuario: "Maria Financeiro",
    acao: "Alteração de Situação",
    descricao: "Situação alterada de 'Depositado' para 'Compensado'"
  },
];

const bancos = [
  "001 - Banco do Brasil",
  "033 - Santander",
  "104 - Caixa Econômica Federal",
  "237 - Bradesco",
  "341 - Itaú Unibanco",
];

const situacoes = ["Depositado", "Compensado", "Devolvido", "Reapresentado"];

const DepositoDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const deposito = mockDepositos.find(d => d.id === Number(id)) || mockDepositos[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(deposito.data);
  const [banco, setBanco] = useState(deposito.banco);
  const [agencia, setAgencia] = useState(deposito.agencia);
  const [conta, setConta] = useState(deposito.conta);
  const [numeroTransacao, setNumeroTransacao] = useState(deposito.numeroTransacao);
  const [situacao, setSituacao] = useState(deposito.situacao);

  const isCompensado = situacao === "Compensado";
  const valorTotal = deposito.cheques.reduce((acc, c) => acc + c.valor, 0);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");
  const formatDateTime = (dateStr: string) => {
    const [date, time] = dateStr.split(" ");
    return `${new Date(date).toLocaleDateString("pt-BR")} às ${time}`;
  };
  const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const getSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Depositado":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">{sit}</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{sit}</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{sit}</Badge>;
      case "Reapresentado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">{sit}</Badge>;
      default:
        return <Badge variant="outline">{sit}</Badge>;
    }
  };

  const getChequeSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Depositado":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Depositado</Badge>;
      case "Compensado":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Compensado</Badge>;
      case "Devolvido":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Devolvido</Badge>;
      default:
        return <Badge variant="secondary">{sit}</Badge>;
    }
  };

  const handleSave = () => {
    toast({
      title: "Depósito atualizado",
      description: "As alterações foram salvas e o histórico foi atualizado.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setData(deposito.data);
    setBanco(deposito.banco);
    setAgencia(deposito.agencia);
    setConta(deposito.conta);
    setNumeroTransacao(deposito.numeroTransacao);
    setSituacao(deposito.situacao);
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
                  onClick={() => navigate("/financeiro/depositos")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                      Depósito #{numeroTransacao}
                    </h1>
                    {getSituacaoBadge(situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {banco.split(" - ")[1]} • Agência {agencia} • Conta {conta}
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
                  <Button onClick={() => setIsEditing(true)} className="gap-2" disabled={isCompensado}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>

            {isCompensado && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este depósito já foi compensado e não pode ser editado. Apenas visualização disponível.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dados do Depósito */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Dados do Depósito</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data do Depósito</Label>
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
                        <Label>Nº Transação/Comprovante</Label>
                        {isEditing ? (
                          <Input 
                            value={numeroTransacao} 
                            onChange={(e) => setNumeroTransacao(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium font-mono">{numeroTransacao}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Banco</Label>
                        {isEditing ? (
                          <Select value={banco} onValueChange={setBanco}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {bancos.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-foreground font-medium">{banco}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Agência</Label>
                        {isEditing ? (
                          <Input 
                            value={agencia} 
                            onChange={(e) => setAgencia(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium">{agencia}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Conta Corrente</Label>
                        {isEditing ? (
                          <Input 
                            value={conta} 
                            onChange={(e) => setConta(e.target.value)} 
                          />
                        ) : (
                          <p className="text-foreground font-medium">{conta}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Situação do Depósito</Label>
                        {isEditing ? (
                          <>
                            <Select value={situacao} onValueChange={setSituacao}>
                              <SelectTrigger className="w-full md:w-64">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {situacoes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Alterar a situação gera registro automático no histórico.
                            </p>
                          </>
                        ) : (
                          <div>{getSituacaoBadge(situacao)}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cheques Vinculados */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Cheques Vinculados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertDescription>
                        Cheques vinculados ao depósito não podem ser editados aqui. Para alterar um cheque, acesse o cadastro do cheque diretamente.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Nº Cheque</TableHead>
                            <TableHead>Emitente</TableHead>
                            <TableHead>CPF/CNPJ</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead>Situação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deposito.cheques.map((cheque) => (
                            <TableRow key={cheque.id} className="hover:bg-muted/50">
                              <TableCell className="font-mono font-medium">{cheque.numero}</TableCell>
                              <TableCell>{cheque.emitente}</TableCell>
                              <TableCell className="text-muted-foreground">{cheque.cpfCnpj}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(cheque.valor)}</TableCell>
                              <TableCell>{getChequeSituacaoBadge(cheque.situacao)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-muted-foreground">
                        {deposito.cheques.length} cheque(s) vinculado(s)
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total do Depósito</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(valorTotal)}</p>
                      </div>
                    </div>
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

export default DepositoDetalhe;

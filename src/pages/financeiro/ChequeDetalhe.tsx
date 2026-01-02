import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck, MapPin, ClipboardList, History, AlertCircle, Edit, Save, X } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { toast } from "@/hooks/use-toast";

interface HistoricoItem {
  id: number;
  data: string;
  situacaoAnterior: string;
  situacaoNova: string;
  usuario: string;
  observacao: string;
}

interface Cheque {
  id: number;
  numeroCheque: string;
  banco: string;
  agencia: string;
  conta: string;
  emitente: string;
  cpfCnpj: string;
  valor: number;
  dataEmissao: string;
  dataVencimento: string;
  localizacao: string;
  situacao: string;
  observacoes: string;
  historico: HistoricoItem[];
}

// Mock data - mesmos dados da listagem
const mockCheques: Cheque[] = [
  {
    id: 1,
    numeroCheque: "000123",
    banco: "001 - Banco do Brasil",
    agencia: "1234",
    conta: "12345-6",
    emitente: "João Silva",
    cpfCnpj: "123.456.789-00",
    valor: 1500.00,
    dataEmissao: "2024-01-10",
    dataVencimento: "2024-02-10",
    localizacao: "Em caixa",
    situacao: "Aberto",
    observacoes: "",
    historico: [
      { id: 1, data: "2024-01-10 10:30", situacaoAnterior: "-", situacaoNova: "Aberto", usuario: "Ednaldo", observacao: "Cheque recebido" }
    ]
  },
  {
    id: 2,
    numeroCheque: "000456",
    banco: "237 - Bradesco",
    agencia: "5678",
    conta: "67890-1",
    emitente: "Maria Santos",
    cpfCnpj: "987.654.321-00",
    valor: 2500.00,
    dataEmissao: "2024-01-05",
    dataVencimento: "2024-01-15",
    localizacao: "Em banco",
    situacao: "Depositado",
    observacoes: "Depósito realizado",
    historico: [
      { id: 1, data: "2024-01-05 14:00", situacaoAnterior: "-", situacaoNova: "Aberto", usuario: "Ednaldo", observacao: "Cheque recebido" },
      { id: 2, data: "2024-01-08 09:15", situacaoAnterior: "Aberto", situacaoNova: "Depositado", usuario: "Ednaldo", observacao: "Enviado para compensação" }
    ]
  },
  {
    id: 3,
    numeroCheque: "000789",
    banco: "341 - Itaú Unibanco",
    agencia: "9012",
    conta: "34567-8",
    emitente: "Carlos Oliveira",
    cpfCnpj: "456.789.123-00",
    valor: 800.00,
    dataEmissao: "2024-01-02",
    dataVencimento: "2024-01-10",
    localizacao: "Devolvido",
    situacao: "Devolvido",
    observacoes: "Sem fundos",
    historico: [
      { id: 1, data: "2024-01-02 11:00", situacaoAnterior: "-", situacaoNova: "Aberto", usuario: "Ednaldo", observacao: "Cheque recebido" },
      { id: 2, data: "2024-01-05 10:00", situacaoAnterior: "Aberto", situacaoNova: "Depositado", usuario: "Ednaldo", observacao: "" },
      { id: 3, data: "2024-01-08 16:30", situacaoAnterior: "Depositado", situacaoNova: "Devolvido", usuario: "Sistema", observacao: "Motivo: Sem fundos" }
    ]
  },
  {
    id: 4,
    numeroCheque: "001234",
    banco: "033 - Santander",
    agencia: "3456",
    conta: "78901-2",
    emitente: "Ana Pereira",
    cpfCnpj: "321.654.987-00",
    valor: 3200.00,
    dataEmissao: "2023-12-20",
    dataVencimento: "2024-01-20",
    localizacao: "Compensado",
    situacao: "Compensado",
    observacoes: "",
    historico: [
      { id: 1, data: "2023-12-20 15:00", situacaoAnterior: "-", situacaoNova: "Aberto", usuario: "Ednaldo", observacao: "Cheque recebido" },
      { id: 2, data: "2024-01-02 08:30", situacaoAnterior: "Aberto", situacaoNova: "Depositado", usuario: "Ednaldo", observacao: "" },
      { id: 3, data: "2024-01-05 12:00", situacaoAnterior: "Depositado", situacaoNova: "Compensado", usuario: "Sistema", observacao: "Compensação confirmada" }
    ]
  },
  {
    id: 5,
    numeroCheque: "005678",
    banco: "104 - Caixa Econômica Federal",
    agencia: "7890",
    conta: "23456-7",
    emitente: "Pedro Souza",
    cpfCnpj: "789.123.456-00",
    valor: 1800.00,
    dataEmissao: "2024-01-12",
    dataVencimento: "2024-02-12",
    localizacao: "Com terceiro",
    situacao: "Aberto",
    observacoes: "Repassado para fornecedor",
    historico: [
      { id: 1, data: "2024-01-12 09:00", situacaoAnterior: "-", situacaoNova: "Aberto", usuario: "Ednaldo", observacao: "Cheque recebido" },
      { id: 2, data: "2024-01-14 11:30", situacaoAnterior: "Em caixa", situacaoNova: "Com terceiro", usuario: "Ednaldo", observacao: "Repassado para Fornecedor ABC" }
    ]
  },
];

const bancos = [
  "001 - Banco do Brasil",
  "033 - Santander",
  "104 - Caixa Econômica Federal",
  "237 - Bradesco",
  "341 - Itaú Unibanco",
  "756 - Sicoob",
  "748 - Sicredi",
  "077 - Inter",
  "260 - Nubank",
  "336 - C6 Bank",
];

const localizacoes = [
  { value: "Em caixa", label: "Em caixa", description: "O cheque está guardado no caixa da empresa" },
  { value: "Em transição", label: "Em transição", description: "Depositado, aguardando compensação" },
  { value: "Em banco", label: "Em banco", description: "Cheque já compensado e disponível" },
  { value: "Com terceiro", label: "Com terceiro", description: "Repassado para quitar contas" },
];

const situacoes = [
  { value: "Aberto", label: "Aberto", color: "yellow" },
  { value: "Depositado", label: "Depositado", color: "blue" },
  { value: "Devolvido", label: "Devolvido", color: "red" },
  { value: "Reapresentado", label: "Reapresentado", color: "orange" },
  { value: "Compensado", label: "Compensado", color: "green" },
];

const ChequeDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [cheque, setCheque] = useState<Cheque | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [numeroCheque, setNumeroCheque] = useState("");
  const [valor, setValor] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [emitente, setEmitente] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [situacao, setSituacao] = useState("");

  useEffect(() => {
    // Simula carregamento
    setLoading(true);
    const foundCheque = mockCheques.find(c => c.id === Number(id));
    
    setTimeout(() => {
      if (foundCheque) {
        setCheque(foundCheque);
        setBanco(foundCheque.banco);
        setAgencia(foundCheque.agencia);
        setConta(foundCheque.conta);
        setNumeroCheque(foundCheque.numeroCheque);
        setValor(foundCheque.valor.toString());
        setCpfCnpj(foundCheque.cpfCnpj);
        setEmitente(foundCheque.emitente);
        setDataEmissao(foundCheque.dataEmissao);
        setDataVencimento(foundCheque.dataVencimento);
        setObservacoes(foundCheque.observacoes);
        setLocalizacao(foundCheque.localizacao);
        setSituacao(foundCheque.situacao);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  const isCompensado = situacao === "Compensado";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const getSituacaoBadge = (sit: string) => {
    switch (sit) {
      case "Aberto":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{sit}</Badge>;
      case "Depositado":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">{sit}</Badge>;
      case "Devolvido":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">{sit}</Badge>;
      case "Reapresentado":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">{sit}</Badge>;
      case "Compensado":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">{sit}</Badge>;
      default:
        return <Badge variant="outline">{sit}</Badge>;
    }
  };

  const handleSituacaoChange = (newSituacao: string) => {
    if (isCompensado) {
      toast({
        title: "Operação não permitida",
        description: "Cheques compensados não podem ter sua situação alterada.",
        variant: "destructive"
      });
      return;
    }
    
    setSituacao(newSituacao);
    
    // Atualizar localização automaticamente
    if (newSituacao === "Depositado") {
      setLocalizacao("Em transição");
    } else if (newSituacao === "Compensado") {
      setLocalizacao("Compensado");
    } else if (newSituacao === "Devolvido") {
      setLocalizacao("Devolvido");
    }
  };

  const handleSave = () => {
    toast({
      title: "Cheque atualizado",
      description: "As informações do cheque foram salvas com sucesso.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (cheque) {
      setBanco(cheque.banco);
      setAgencia(cheque.agencia);
      setConta(cheque.conta);
      setNumeroCheque(cheque.numeroCheque);
      setValor(cheque.valor.toString());
      setCpfCnpj(cheque.cpfCnpj);
      setEmitente(cheque.emitente);
      setDataEmissao(cheque.dataEmissao);
      setDataVencimento(cheque.dataVencimento);
      setObservacoes(cheque.observacoes);
      setLocalizacao(cheque.localizacao);
      setSituacao(cheque.situacao);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <FinanceiroSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <FinanceiroNavbar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 flex items-center justify-center">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!cheque) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <FinanceiroSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <FinanceiroNavbar />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <button
                onClick={() => navigate("/financeiro/cheques")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Cheques
              </button>
              <Card className="bg-card border-border shadow-card">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Cheque não encontrado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    O cheque solicitado não existe ou foi removido.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/financeiro/cheques")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Cheques
            </button>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                      Cheque #{numeroCheque}
                    </h1>
                    {getSituacaoBadge(situacao)}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {emitente} • {formatCurrency(cheque.valor)}
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
                  <>
                    {!isCompensado && (
                      <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Aviso Compensado */}
            {isCompensado && (
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="py-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Este cheque foi compensado e não pode mais ser alterado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1 - Dados do Cheque */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Dados do Cheque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Banco</Label>
                      {isEditing && !isCompensado ? (
                        <Select value={banco} onValueChange={setBanco}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {bancos.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm font-medium py-2">{banco}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Número do Cheque</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          value={numeroCheque}
                          onChange={(e) => setNumeroCheque(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2 font-mono">{numeroCheque}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Agência</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          value={agencia}
                          onChange={(e) => setAgencia(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{agencia}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Conta</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          value={conta}
                          onChange={(e) => setConta(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{conta}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    {isEditing && !isCompensado ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                      />
                    ) : (
                      <p className="text-lg font-bold text-primary py-2">{formatCurrency(Number(valor))}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Emitente</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          value={emitente}
                          onChange={(e) => setEmitente(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{emitente}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>CPF/CNPJ do Emitente</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          value={cpfCnpj}
                          onChange={(e) => setCpfCnpj(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{cpfCnpj}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Emissão</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          type="date"
                          value={dataEmissao}
                          onChange={(e) => setDataEmissao(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{formatDate(dataEmissao)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Vencimento</Label>
                      {isEditing && !isCompensado ? (
                        <Input
                          type="date"
                          value={dataVencimento}
                          onChange={(e) => setDataVencimento(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{formatDate(dataVencimento)}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    {isEditing && !isCompensado ? (
                      <Textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        {observacoes || "Nenhuma observação registrada."}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 e 3 - Localização e Situação */}
              <div className="space-y-6">
                {/* Localização */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Localização do Cheque
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="bg-muted/30 border-dashed">
                      <CardContent className="py-3">
                        <p className="text-xs text-muted-foreground">
                          A localização indica onde o cheque se encontra fisicamente ou em que etapa do processo está.
                        </p>
                      </CardContent>
                    </Card>

                    {isEditing && !isCompensado ? (
                      <RadioGroup 
                        value={localizacao} 
                        onValueChange={setLocalizacao}
                        className="space-y-2"
                      >
                        {localizacoes.map((loc) => (
                          <div key={loc.value} className="flex items-start space-x-3">
                            <RadioGroupItem value={loc.value} id={loc.value} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={loc.value} className="font-medium cursor-pointer text-sm">
                                {loc.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {loc.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Localização atual:</p>
                          <p className="text-lg font-bold text-primary">{localizacao}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Situação */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      Situação do Cheque
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="bg-amber-500/5 border-amber-500/20 border-dashed">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Alterar a situação pode impactar automaticamente a localização do cheque.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {isEditing && !isCompensado ? (
                      <div className="grid grid-cols-2 gap-2">
                        {situacoes.map((sit) => (
                          <Card 
                            key={sit.value}
                            className={`cursor-pointer transition-all ${
                              situacao === sit.value 
                                ? "ring-2 ring-primary border-primary" 
                                : "hover:border-muted-foreground/50"
                            }`}
                            onClick={() => handleSituacaoChange(sit.value)}
                          >
                            <CardContent className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  sit.color === "yellow" ? "bg-yellow-500" :
                                  sit.color === "blue" ? "bg-blue-500" :
                                  sit.color === "red" ? "bg-red-500" :
                                  sit.color === "orange" ? "bg-orange-500" :
                                  "bg-green-500"
                                }`} />
                                <span className="text-sm font-medium">{sit.label}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Situação atual:</p>
                          <div className="mt-1">{getSituacaoBadge(situacao)}</div>
                        </div>
                        <ClipboardList className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}

                    {situacao === "Devolvido" && (
                      <Card className="bg-red-500/5 border-red-500/20">
                        <CardContent className="py-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-600">Cheque Devolvido</p>
                              <p className="text-xs text-muted-foreground">
                                Este cheque foi devolvido pelo banco. Você pode reapresentá-lo ou tomar as medidas cabíveis.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Card 4 - Histórico */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Histórico de Movimentações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cheque.historico.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum registro de movimentação.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Alteração</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Observação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cheque.historico.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">
                              {item.data}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getSituacaoBadge(item.situacaoAnterior)}
                                <span className="text-muted-foreground">→</span>
                                {getSituacaoBadge(item.situacaoNova)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{item.usuario}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.observacao || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChequeDetalhe;

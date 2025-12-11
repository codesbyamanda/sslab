import { useState, useEffect } from "react";
import { AlertCircle, FileCheck, MapPin, ClipboardList, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

interface ChequeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cheque: Cheque | null;
}

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

const ChequeModal = ({ open, onOpenChange, cheque }: ChequeModalProps) => {
  const [activeTab, setActiveTab] = useState("dados");
  
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
  
  // Localização e situação
  const [localizacao, setLocalizacao] = useState("");
  const [situacao, setSituacao] = useState("");
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  const isCompensado = situacao === "Compensado";

  // Initialize form when cheque changes
  useEffect(() => {
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
      setHistorico(cheque.historico);
    }
  }, [cheque, open]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
    // Adicionar ao histórico
    const novoHistorico: HistoricoItem = {
      id: Date.now(),
      data: new Date().toLocaleString("pt-BR"),
      situacaoAnterior: cheque?.situacao || "-",
      situacaoNova: situacao,
      usuario: "Ednaldo",
      observacao: "Alteração manual"
    };
    
    toast({
      title: "Cheque atualizado",
      description: "As informações do cheque foram salvas com sucesso.",
    });
    onOpenChange(false);
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

  if (!cheque) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Cheque #{cheque.numeroCheque}
            <div className="ml-2">
              {getSituacaoBadge(situacao)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados" className="gap-2">
              <FileCheck className="h-4 w-4" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="localizacao" className="gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </TabsTrigger>
            <TabsTrigger value="situacao" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Situação
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto mt-4">
            {/* Tab 1 - Dados do Cheque */}
            <TabsContent value="dados" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Banco</Label>
                  <Select value={banco} onValueChange={setBanco} disabled={isCompensado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {bancos.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Agência</Label>
                  <Input
                    value={agencia}
                    onChange={(e) => setAgencia(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Input
                    value={conta}
                    onChange={(e) => setConta(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número do Cheque</Label>
                  <Input
                    value={numeroCheque}
                    onChange={(e) => setNumeroCheque(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF/CNPJ do Emitente</Label>
                  <Input
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nome do Emitente</Label>
                  <Input
                    value={emitente}
                    onChange={(e) => setEmitente(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input
                    type="date"
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de Vencimento</Label>
                  <Input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    disabled={isCompensado}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  disabled={isCompensado}
                />
              </div>

              {isCompensado && (
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Este cheque já foi compensado e não pode mais ser alterado.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab 2 - Localização */}
            <TabsContent value="localizacao" className="mt-0 space-y-4">
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">
                    A localização indica onde o cheque se encontra fisicamente ou em que etapa do processo está.
                  </p>
                </CardContent>
              </Card>

              <RadioGroup 
                value={localizacao} 
                onValueChange={setLocalizacao}
                className="space-y-3"
                disabled={isCompensado}
              >
                {localizacoes.map((loc) => (
                  <div key={loc.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={loc.value} id={loc.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={loc.value} className="font-medium cursor-pointer">
                        {loc.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {loc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <Card className="mt-6">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Localização atual:</p>
                      <p className="text-lg font-bold text-primary">{localizacao}</p>
                    </div>
                    <MapPin className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3 - Situação */}
            <TabsContent value="situacao" className="mt-0 space-y-4">
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">
                    A situação do cheque determina seu status no fluxo financeiro. Alterar a situação pode afetar automaticamente a localização.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {situacoes.map((sit) => (
                  <Card 
                    key={sit.value}
                    className={`cursor-pointer transition-all ${
                      situacao === sit.value 
                        ? "ring-2 ring-primary border-primary" 
                        : "hover:border-muted-foreground/50"
                    } ${isCompensado && sit.value !== "Compensado" ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isCompensado && handleSituacaoChange(sit.value)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${
                          sit.color === "yellow" ? "bg-yellow-500" :
                          sit.color === "blue" ? "bg-blue-500" :
                          sit.color === "red" ? "bg-red-500" :
                          sit.color === "orange" ? "bg-orange-500" :
                          "bg-green-500"
                        }`} />
                        <span className="font-medium">{sit.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {situacao === "Devolvido" && (
                <Card className="bg-red-500/5 border-red-500/20 mt-4">
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

              {isCompensado && (
                <Card className="bg-green-500/5 border-green-500/20 mt-4">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-600">Cheque Compensado</p>
                        <p className="text-xs text-muted-foreground">
                          Este cheque foi compensado com sucesso e não pode mais ser alterado.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab 4 - Histórico */}
            <TabsContent value="historico" className="mt-0 space-y-4">
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Registro de todas as movimentações e alterações realizadas neste cheque.
                  </p>
                </CardContent>
              </Card>

              {historico.length > 0 ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>De</TableHead>
                        <TableHead>Para</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Observação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historico.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium text-sm">
                            {item.data}
                          </TableCell>
                          <TableCell>
                            {item.situacaoAnterior === "-" ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              getSituacaoBadge(item.situacaoAnterior)
                            )}
                          </TableCell>
                          <TableCell>
                            {getSituacaoBadge(item.situacaoNova)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.usuario}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {item.observacao || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma movimentação registrada.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isCompensado}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChequeModal;

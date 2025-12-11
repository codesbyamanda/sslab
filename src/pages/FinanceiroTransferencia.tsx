import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeftRight,
  Banknote,
  CreditCard,
  FileCheck,
  CheckCircle,
  X
} from "lucide-react";

// Mock data - Itens disponíveis para transferência
const mockItensTransferencia = [
  {
    id: 1,
    tipo: "Dinheiro",
    descricao: "Recebimentos em espécie",
    valor: 650.00,
    selecionado: false
  },
  {
    id: 2,
    tipo: "Cheque",
    descricao: "Banco Itaú - Cheque 789456",
    valor: 580.00,
    selecionado: false
  },
  {
    id: 3,
    tipo: "Cheque",
    descricao: "Banco Bradesco - Cheque 123789",
    valor: 350.00,
    selecionado: false
  },
  {
    id: 4,
    tipo: "Cartão",
    descricao: "Vendas em cartão de crédito",
    valor: 320.00,
    selecionado: false
  },
  {
    id: 5,
    tipo: "Cartão",
    descricao: "Vendas em cartão de débito",
    valor: 180.00,
    selecionado: false
  }
];

// Mock data - Registros/Caixas disponíveis
const mockCaixas = [
  { id: "rc-045", nome: "RC-2024-045 - Maria Silva (Aberto)" },
  { id: "rc-044", nome: "RC-2024-044 - João Santos (Fechado)" },
  { id: "caixa-central", nome: "Caixa Central - Unidade Matriz" },
  { id: "caixa-filial", nome: "Caixa - Filial Centro" }
];

const FinanceiroTransferencia = () => {
  const navigate = useNavigate();
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [dataTransferencia, setDataTransferencia] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState(mockItensTransferencia);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const toggleItem = (id: number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, selecionado: !item.selecionado } : item
    ));
  };

  const toggleAll = (checked: boolean) => {
    setItens(itens.map(item => ({ ...item, selecionado: checked })));
  };

  const itensSelecionados = itens.filter(item => item.selecionado);
  const totalSelecionado = itensSelecionados.reduce((acc, item) => acc + item.valor, 0);

  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case "Dinheiro":
        return <Banknote className="h-4 w-4 text-emerald-600" />;
      case "Cheque":
        return <FileCheck className="h-4 w-4 text-amber-600" />;
      case "Cartão":
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const handleConfirmarTransferencia = () => {
    if (!origem || !destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione a origem e o destino da transferência.",
        variant: "destructive"
      });
      return;
    }

    if (origem === destino) {
      toast({
        title: "Erro de validação",
        description: "A origem e o destino não podem ser iguais.",
        variant: "destructive"
      });
      return;
    }

    if (itensSelecionados.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione ao menos um item para transferir.",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const executarTransferencia = () => {
    toast({
      title: "Transferência realizada com sucesso",
      description: `${itensSelecionados.length} itens transferidos. Total: ${formatCurrency(totalSelecionado)}`,
    });
    setShowConfirmModal(false);
    // Reset form
    setItens(mockItensTransferencia);
    setObservacoes("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Transferência de Caixa</h1>
            <p className="text-muted-foreground mt-1">
              Transfira valores entre caixas e registros de forma segura e rastreável.
            </p>
          </div>

          {/* Card de Origem e Destino */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Configuração da Transferência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Caixa / Registro de Origem *</Label>
                  <Select value={origem} onValueChange={setOrigem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCaixas.map((caixa) => (
                        <SelectItem key={caixa.id} value={caixa.id}>
                          {caixa.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Caixa / Registro de Destino *</Label>
                  <Select value={destino} onValueChange={setDestino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCaixas.map((caixa) => (
                        <SelectItem key={caixa.id} value={caixa.id}>
                          {caixa.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Data da Transferência</Label>
                  <Input
                    type="date"
                    value={dataTransferencia}
                    onChange={(e) => setDataTransferencia(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Usuário Responsável</Label>
                  <Input
                    value="Maria Silva"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Itens para Transferência */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Itens Disponíveis para Transferência</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={itens.every(item => item.selecionado)}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                  />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">
                    Selecionar todos
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Descrição / Identificação</TableHead>
                      <TableHead className="font-semibold text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itens.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className={`hover:bg-muted/20 cursor-pointer ${item.selecionado ? 'bg-primary/5' : ''}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={item.selecionado}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getIconByTipo(item.tipo)}
                            {item.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.descricao}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          {formatCurrency(item.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo e Observações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Observações */}
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Adicione observações sobre esta transferência..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-primary">Resumo da Transferência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Itens selecionados:</span>
                  <span className="font-semibold">{itensSelecionados.length}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="text-sm font-medium">Total a transferir:</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(totalSelecionado)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate("/atendimento/financeiro/caixa")}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleConfirmarTransferencia}>
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Confirmar Transferência
            </Button>
          </div>

          {/* Modal de Confirmação */}
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Confirmar Transferência
                </DialogTitle>
                <DialogDescription>
                  Revise os dados antes de confirmar a transferência.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Origem</p>
                    <p className="font-medium text-sm">
                      {mockCaixas.find(c => c.id === origem)?.nome || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destino</p>
                    <p className="font-medium text-sm">
                      {mockCaixas.find(c => c.id === destino)?.nome || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Itens</p>
                    <p className="font-medium">{itensSelecionados.length} selecionados</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-primary text-lg">{formatCurrency(totalSelecionado)}</p>
                  </div>
                </div>

                {observacoes && (
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Observações:</p>
                    <p className="text-sm">{observacoes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                  Voltar
                </Button>
                <Button onClick={executarTransferencia}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default FinanceiroTransferencia;

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, History, AlertCircle } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import ParcelaEditModal from "./ParcelaEditModal";
import LancamentoModal from "./LancamentoModal";

interface Parcela {
  id: number;
  numero: number;
  dataVencimento: string;
  valor: number;
  situacao: "Aberto" | "Parcial" | "Quitado";
}

interface Lancamento {
  id: number;
  data: string;
  formaRecebimento: string;
  valor: number;
  observacoes: string;
}

interface HistoricoAlteracao {
  id: number;
  data: string;
  descricao: string;
  valorAnterior: number;
  valorNovo: number;
  usuario: string;
}

interface Receita {
  id?: number;
  data: string;
  dataVencimento: string;
  descricao: string;
  pessoa: string;
  tipoPessoa: string;
  valorOriginal: number;
  valorDevido: number;
  situacao: string;
  tipoReceita: string;
}

interface ReceitaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receita: Receita | null;
}

const ReceitaModal = ({ open, onOpenChange, receita }: ReceitaModalProps) => {
  const [activeTab, setActiveTab] = useState("dados");
  
  // Form state
  const [tipoReceita, setTipoReceita] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [pessoa, setPessoa] = useState("");
  const [data, setData] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [valor, setValor] = useState("");
  const [valorDevido, setValorDevido] = useState("");
  
  // Parcelas state
  const [numParcelas, setNumParcelas] = useState("1");
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [parcelaEditOpen, setParcelaEditOpen] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  
  // Lancamentos state
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [lancamentoModalOpen, setLancamentoModalOpen] = useState(false);
  const [selectedLancamento, setSelectedLancamento] = useState<Lancamento | null>(null);
  
  // Historico
  const [historico] = useState<HistoricoAlteracao[]>([
    {
      id: 1,
      data: "2024-01-15 10:30",
      descricao: "Criação da receita",
      valorAnterior: 0,
      valorNovo: 350.00,
      usuario: "Ednaldo"
    },
    {
      id: 2,
      data: "2024-01-16 14:20",
      descricao: "Alteração de valor",
      valorAnterior: 350.00,
      valorNovo: 400.00,
      usuario: "Ednaldo"
    }
  ]);

  // Initialize form when receita changes
  useEffect(() => {
    if (receita) {
      setTipoReceita(receita.tipoReceita);
      setDescricao(receita.descricao);
      setTipoPessoa(receita.tipoPessoa);
      setPessoa(receita.pessoa);
      setData(receita.data);
      setDataVencimento(receita.dataVencimento);
      setValor(receita.valorOriginal.toString());
      setValorDevido(receita.valorDevido.toString());
      
      // Generate mock parcelas
      setParcelas([
        { id: 1, numero: 1, dataVencimento: receita.dataVencimento, valor: receita.valorOriginal, situacao: "Aberto" }
      ]);
    } else {
      // Reset form
      setTipoReceita("");
      setDescricao("");
      setTipoPessoa("");
      setPessoa("");
      setData("");
      setDataVencimento("");
      setValor("");
      setValorDevido("");
      setParcelas([]);
      setNumParcelas("1");
    }
  }, [receita, open]);

  const generateParcelas = () => {
    const num = parseInt(numParcelas);
    const valorTotal = parseFloat(valor) || 0;
    const valorParcela = valorTotal / num;
    const baseDate = new Date(dataVencimento || new Date());
    
    const novasParcelas: Parcela[] = [];
    for (let i = 0; i < num; i++) {
      const parcelaDate = new Date(baseDate);
      parcelaDate.setMonth(parcelaDate.getMonth() + i);
      
      novasParcelas.push({
        id: i + 1,
        numero: i + 1,
        dataVencimento: parcelaDate.toISOString().split('T')[0],
        valor: Math.round(valorParcela * 100) / 100,
        situacao: "Aberto"
      });
    }
    
    setParcelas(novasParcelas);
    toast({
      title: "Parcelas geradas",
      description: `${num} parcela(s) criada(s) com sucesso.`,
    });
  };

  const handleParcelaEdit = (parcela: Parcela) => {
    setSelectedParcela(parcela);
    setParcelaEditOpen(true);
  };

  const handleParcelaSave = (updatedParcela: Parcela) => {
    const index = parcelas.findIndex(p => p.id === updatedParcela.id);
    if (index === -1) return;

    const valorDiferenca = updatedParcela.valor - parcelas[index].valor;
    const parcelasRestantes = parcelas.slice(index + 1);
    
    if (parcelasRestantes.length > 0 && valorDiferenca !== 0) {
      const ajustePorParcela = valorDiferenca / parcelasRestantes.length;
      
      const novasParcelas = parcelas.map((p, i) => {
        if (p.id === updatedParcela.id) {
          return updatedParcela;
        }
        if (i > index) {
          return {
            ...p,
            valor: Math.round((p.valor - ajustePorParcela) * 100) / 100
          };
        }
        return p;
      });
      
      setParcelas(novasParcelas);
      toast({
        title: "Parcelas recalculadas",
        description: "As parcelas seguintes foram ajustadas automaticamente.",
      });
    } else {
      setParcelas(parcelas.map(p => p.id === updatedParcela.id ? updatedParcela : p));
    }
    
    setParcelaEditOpen(false);
  };

  const handleAddLancamento = () => {
    setSelectedLancamento(null);
    setLancamentoModalOpen(true);
  };

  const handleEditLancamento = (lancamento: Lancamento) => {
    setSelectedLancamento(lancamento);
    setLancamentoModalOpen(true);
  };

  const handleSaveLancamento = (lancamento: Lancamento) => {
    if (lancamento.id) {
      setLancamentos(lancamentos.map(l => l.id === lancamento.id ? lancamento : l));
    } else {
      setLancamentos([...lancamentos, { ...lancamento, id: Date.now() }]);
    }
    setLancamentoModalOpen(false);
    toast({
      title: "Lançamento salvo",
      description: "O lançamento foi registrado com sucesso.",
    });
  };

  const handleDeleteLancamento = (id: number) => {
    setLancamentos(lancamentos.filter(l => l.id !== id));
    toast({
      title: "Lançamento excluído",
      description: "O lançamento foi removido com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  const handleSave = () => {
    if (!tipoReceita || !descricao || !pessoa || !data || !dataVencimento || !valor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Receita salva",
      description: receita ? "Receita atualizada com sucesso." : "Nova receita cadastrada com sucesso.",
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {receita ? "Editar Receita" : "Nova Receita"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dados">Dados da Receita</TabsTrigger>
              <TabsTrigger value="parcelas">Parcelas</TabsTrigger>
              <TabsTrigger value="lancamentos">Lançamentos Recebidos</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              {/* Tab 1 - Dados da Receita */}
              <TabsContent value="dados" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoReceita">Tipo da Receita *</Label>
                    <Select value={tipoReceita} onValueChange={setTipoReceita}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulta Particular">Consulta Particular</SelectItem>
                        <SelectItem value="Exames">Exames</SelectItem>
                        <SelectItem value="Guia Faturada">Guia Faturada</SelectItem>
                        <SelectItem value="Procedimento">Procedimento</SelectItem>
                        <SelectItem value="Aluguel">Aluguel</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoPessoa">Tipo de Pessoa *</Label>
                    <Select value={tipoPessoa} onValueChange={setTipoPessoa}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paciente">Paciente</SelectItem>
                        <SelectItem value="Terceiro">Terceiro</SelectItem>
                        <SelectItem value="Convênio">Convênio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pessoa">Pessoa / Paciente / Terceiro *</Label>
                    <Input
                      id="pessoa"
                      value={pessoa}
                      onChange={(e) => setPessoa(e.target.value)}
                      placeholder="Digite o nome..."
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descreva a receita..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                    <Input
                      id="dataVencimento"
                      type="date"
                      value={dataVencimento}
                      onChange={(e) => setDataVencimento(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$) *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={valor}
                      onChange={(e) => {
                        setValor(e.target.value);
                        setValorDevido(e.target.value);
                      }}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valorDevido">Valor Devido (R$)</Label>
                    <Input
                      id="valorDevido"
                      type="number"
                      step="0.01"
                      value={valorDevido}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* Histórico de Alterações */}
                {receita && (
                  <Card className="mt-6">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Histórico de Alterações</span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-auto">
                        {historico.map((item) => (
                          <div key={item.id} className="text-xs text-muted-foreground flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <span className="font-medium">{item.data}</span>
                            <span>-</span>
                            <span>{item.descricao}</span>
                            {item.valorAnterior !== item.valorNovo && (
                              <>
                                <span>|</span>
                                <span className="text-red-500">{formatCurrency(item.valorAnterior)}</span>
                                <span>→</span>
                                <span className="text-green-600">{formatCurrency(item.valorNovo)}</span>
                              </>
                            )}
                            <span className="ml-auto">por {item.usuario}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab 2 - Parcelas */}
              <TabsContent value="parcelas" className="mt-0 space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-end gap-4">
                      <div className="space-y-2 flex-1">
                        <Label>Número de Parcelas</Label>
                        <Select value={numParcelas} onValueChange={setNumParcelas}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                              <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={generateParcelas} disabled={!valor || !dataVencimento}>
                        Gerar Parcelas
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {parcelas.length > 0 && (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-20">Nº</TableHead>
                          <TableHead>Data de Vencimento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Situação</TableHead>
                          <TableHead className="w-20 text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parcelas.map((parcela) => (
                          <TableRow key={parcela.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{parcela.numero}</TableCell>
                            <TableCell>{formatDate(parcela.dataVencimento)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(parcela.valor)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  parcela.situacao === "Quitado" 
                                    ? "bg-green-500/10 text-green-600 border-green-500/30"
                                    : parcela.situacao === "Parcial"
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                                }
                              >
                                {parcela.situacao}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleParcelaEdit(parcela)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {parcelas.length > 0 && (
                  <div className="flex items-center justify-end gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total das parcelas: </span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(parcelas.reduce((acc, p) => acc + p.valor, 0))}
                      </span>
                    </div>
                  </div>
                )}

                {parcelas.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma parcela gerada.</p>
                    <p className="text-sm mt-1">Defina o número de parcelas e clique em "Gerar Parcelas".</p>
                  </div>
                )}
              </TabsContent>

              {/* Tab 3 - Lançamentos Recebidos */}
              <TabsContent value="lancamentos" className="mt-0 space-y-4">
                <div className="flex justify-end">
                  <Button onClick={handleAddLancamento} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Incluir Lançamento
                  </Button>
                </div>

                {lancamentos.length > 0 ? (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Data</TableHead>
                          <TableHead>Forma de Recebimento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Observações</TableHead>
                          <TableHead className="w-24 text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lancamentos.map((lancamento) => (
                          <TableRow key={lancamento.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {formatDate(lancamento.data)}
                            </TableCell>
                            <TableCell>{lancamento.formaRecebimento}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(lancamento.valor)}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {lancamento.observacoes || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditLancamento(lancamento)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteLancamento(lancamento.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum lançamento registrado.</p>
                    <p className="text-sm mt-1">Clique em "Incluir Lançamento" para adicionar pagamentos recebidos.</p>
                  </div>
                )}

                {lancamentos.length > 0 && (
                  <div className="flex items-center justify-end gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total recebido: </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(lancamentos.reduce((acc, l) => acc + l.valor, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Receita
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ParcelaEditModal
        open={parcelaEditOpen}
        onOpenChange={setParcelaEditOpen}
        parcela={selectedParcela}
        onSave={handleParcelaSave}
      />

      <LancamentoModal
        open={lancamentoModalOpen}
        onOpenChange={setLancamentoModalOpen}
        lancamento={selectedLancamento}
        onSave={handleSaveLancamento}
      />
    </>
  );
};

export default ReceitaModal;

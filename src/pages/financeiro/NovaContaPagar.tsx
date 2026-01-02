import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Building2, Calendar, DollarSign, FileText, Tag, Plus, X } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock fornecedores
const mockFornecedores = [
  { id: 1, nome: "LabSupply Ltda", cnpj: "12.345.678/0001-90" },
  { id: 2, nome: "Imobiliária Central", cnpj: "98.765.432/0001-10" },
  { id: 3, nome: "TechMed Serviços", cnpj: "11.222.333/0001-44" },
  { id: 4, nome: "Papelaria Express", cnpj: "55.666.777/0001-88" },
  { id: 5, nome: "Clean Pro", cnpj: "22.333.444/0001-55" },
];

const NovaContaPagar = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fornecedorId: "",
    descricao: "",
    categoria: "",
    subcategoria: "",
    numeroDocumento: "",
    dataLancamento: new Date().toISOString().split("T")[0],
    dataVencimento: "",
    valorOriginal: "",
    numeroParcelas: "1",
    observacoes: "",
  });

  const [parcelas, setParcelas] = useState<{ numero: number; vencimento: string; valor: number }[]>([]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleValorChange = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData({ ...formData, valorOriginal: numericValue });
    
    // Recalculate parcelas
    if (numericValue && parcelas.length > 0) {
      const valorTotal = parseFloat(numericValue) || 0;
      const valorParcela = valorTotal / parcelas.length;
      setParcelas(parcelas.map(p => ({ ...p, valor: valorParcela })));
    }
  };

  const handleParcelasChange = (num: string) => {
    setFormData({ ...formData, numeroParcelas: num });
    const numParcelas = parseInt(num) || 1;
    const valorTotal = parseFloat(formData.valorOriginal) || 0;
    const valorParcela = valorTotal / numParcelas;

    const novasParcelas = [];
    const dataBase = formData.dataVencimento ? new Date(formData.dataVencimento) : new Date();
    
    for (let i = 0; i < numParcelas; i++) {
      const dataVencimento = new Date(dataBase);
      dataVencimento.setMonth(dataVencimento.getMonth() + i);
      novasParcelas.push({
        numero: i + 1,
        vencimento: dataVencimento.toISOString().split("T")[0],
        valor: valorParcela,
      });
    }
    
    setParcelas(novasParcelas);
  };

  const handleVencimentoChange = (vencimento: string) => {
    setFormData({ ...formData, dataVencimento: vencimento });
    
    if (parcelas.length > 0) {
      const dataBase = new Date(vencimento);
      setParcelas(parcelas.map((p, i) => {
        const novaData = new Date(dataBase);
        novaData.setMonth(novaData.getMonth() + i);
        return { ...p, vencimento: novaData.toISOString().split("T")[0] };
      }));
    }
  };

  const updateParcelaVencimento = (index: number, vencimento: string) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index] = { ...novasParcelas[index], vencimento };
    setParcelas(novasParcelas);
  };

  const updateParcelaValor = (index: number, valor: string) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index] = { ...novasParcelas[index], valor: parseFloat(valor) || 0 };
    setParcelas(novasParcelas);
  };

  const totalParcelas = parcelas.reduce((acc, p) => acc + p.valor, 0);
  const valorOriginal = parseFloat(formData.valorOriginal) || 0;
  const diferencaParcelas = valorOriginal - totalParcelas;

  const selectedFornecedor = mockFornecedores.find(f => f.id.toString() === formData.fornecedorId);

  const handleSubmit = async () => {
    // Validações
    if (!formData.fornecedorId) {
      toast({ title: "Erro", description: "Selecione um fornecedor.", variant: "destructive" });
      return;
    }
    if (!formData.descricao) {
      toast({ title: "Erro", description: "Informe a descrição da conta.", variant: "destructive" });
      return;
    }
    if (!formData.categoria) {
      toast({ title: "Erro", description: "Selecione uma categoria.", variant: "destructive" });
      return;
    }
    if (!formData.dataVencimento) {
      toast({ title: "Erro", description: "Informe a data de vencimento.", variant: "destructive" });
      return;
    }
    if (!formData.valorOriginal || parseFloat(formData.valorOriginal) <= 0) {
      toast({ title: "Erro", description: "Informe um valor válido.", variant: "destructive" });
      return;
    }
    if (parcelas.length > 1 && Math.abs(diferencaParcelas) > 0.01) {
      toast({ title: "Erro", description: "O valor das parcelas não confere com o valor total.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    // Mock submit
    setTimeout(() => {
      toast({ title: "Sucesso", description: "Conta a pagar registrada com sucesso!" });
      navigate("/financeiro/contas-pagar");
    }, 1000);
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
              onClick={() => navigate("/financeiro/contas-pagar")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Contas a Pagar
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Nova Conta a Pagar
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registre uma nova obrigação financeira no sistema.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate("/financeiro/contas-pagar")}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Salvando..." : "Salvar Conta"}
                </Button>
              </div>
            </div>

            {/* Fornecedor */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Fornecedor
                </CardTitle>
                <CardDescription>
                  Selecione o fornecedor ou credor desta conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fornecedor *</Label>
                    <Select
                      value={formData.fornecedorId}
                      onValueChange={(value) => setFormData({ ...formData, fornecedorId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockFornecedores.map((f) => (
                          <SelectItem key={f.id} value={f.id.toString()}>
                            {f.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedFornecedor && (
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input value={selectedFornecedor.cnpj} disabled className="bg-muted" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dados da Conta */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descrição *</Label>
                    <Input
                      placeholder="Ex: Fornecedor de reagentes - Lote Janeiro"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº Documento / NF</Label>
                    <Input
                      placeholder="Ex: NF-2024-00458"
                      value={formData.numeroDocumento}
                      onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Insumos">Insumos</SelectItem>
                        <SelectItem value="Despesas Fixas">Despesas Fixas</SelectItem>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Impostos">Impostos</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Lançamento</Label>
                    <Input
                      type="date"
                      value={formData.dataLancamento}
                      onChange={(e) => setFormData({ ...formData, dataLancamento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Vencimento *</Label>
                    <Input
                      type="date"
                      value={formData.dataVencimento}
                      onChange={(e) => handleVencimentoChange(e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <Label className="mb-2 block">Observações</Label>
                  <Textarea
                    placeholder="Observações adicionais sobre esta conta..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Valores e Parcelas */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Valores e Parcelamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Valor Total *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        placeholder="0,00"
                        value={formData.valorOriginal}
                        onChange={(e) => handleValorChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Parcelas</Label>
                    <Select
                      value={formData.numeroParcelas}
                      onValueChange={handleParcelasChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}x
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Situação Inicial</Label>
                    <div className="h-10 flex items-center">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                        Aberto
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Parcelas */}
                {parcelas.length > 1 && (
                  <>
                    <Separator className="my-6" />
                    
                    <div>
                      <Label className="mb-4 block">Detalhamento das Parcelas</Label>
                      <div className="space-y-3">
                        {parcelas.map((parcela, index) => (
                          <div key={parcela.numero} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                            <span className="text-sm font-medium min-w-[60px]">
                              {parcela.numero}/{parcelas.length}
                            </span>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <Input
                                  type="date"
                                  value={parcela.vencimento}
                                  onChange={(e) => updateParcelaVencimento(index, e.target.value)}
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                <Input
                                  value={parcela.valor.toFixed(2)}
                                  onChange={(e) => updateParcelaValor(index, e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totalizador */}
                      <div className="mt-4 flex justify-end">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2 min-w-[300px]">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Valor Total:</span>
                            <span className="font-medium">{formatCurrency(valorOriginal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Soma das Parcelas:</span>
                            <span className="font-medium">{formatCurrency(totalParcelas)}</span>
                          </div>
                          {Math.abs(diferencaParcelas) > 0.01 && (
                            <>
                              <Separator />
                              <div className="flex justify-between text-sm font-semibold text-red-600">
                                <span>Diferença:</span>
                                <span>{formatCurrency(diferencaParcelas)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NovaContaPagar;

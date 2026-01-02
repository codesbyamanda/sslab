import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Building2, User, Calendar, FileCheck, DollarSign, Link } from "lucide-react";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock contas bancárias
const mockContasBancarias = [
  { id: 1, banco: "Banco do Brasil", codigoBanco: "001", agencia: "1234-5", conta: "56789-0", proximoCheque: "000453" },
  { id: 2, banco: "Itaú", codigoBanco: "341", agencia: "0987", conta: "12345-6", proximoCheque: "000128" },
  { id: 3, banco: "Bradesco", codigoBanco: "237", agencia: "5678", conta: "98765-4", proximoCheque: "000089" },
];

// Mock fornecedores
const mockFornecedores = [
  { id: 1, nome: "LabSupply Ltda", cnpj: "12.345.678/0001-90" },
  { id: 2, nome: "Imobiliária Central", cnpj: "98.765.432/0001-10" },
  { id: 3, nome: "TechMed Serviços", cnpj: "11.222.333/0001-44" },
  { id: 4, nome: "Papelaria Express", cnpj: "55.666.777/0001-88" },
  { id: 5, nome: "Clean Pro", cnpj: "22.333.444/0001-55" },
];

// Mock contas a pagar em aberto
const mockContasPagar = [
  { id: 1, codigo: "CP-2024-0001", descricao: "Fornecedor de reagentes", fornecedor: "LabSupply Ltda", valor: 4500.00 },
  { id: 2, codigo: "CP-2024-0003", descricao: "Manutenção equipamentos", fornecedor: "TechMed Serviços", valor: 2350.00 },
  { id: 3, codigo: "CP-2024-0004", descricao: "Material de escritório", fornecedor: "Papelaria Express", valor: 225.00 },
];

const NovoChequeEmitido = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    contaBancariaId: "",
    numeroCheque: "",
    favorecidoId: "",
    favorecidoManual: "",
    cnpjManual: "",
    usarFavorecidoManual: false,
    dataEmissao: new Date().toISOString().split("T")[0],
    dataBomPara: "",
    valor: "",
    descricao: "",
    observacoes: "",
    contaPagarId: "",
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleValorChange = (value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData({ ...formData, valor: numericValue });
  };

  const selectedContaBancaria = mockContasBancarias.find(c => c.id.toString() === formData.contaBancariaId);
  const selectedFornecedor = mockFornecedores.find(f => f.id.toString() === formData.favorecidoId);
  const selectedContaPagar = mockContasPagar.find(c => c.id.toString() === formData.contaPagarId);

  // Auto-fill número do cheque quando seleciona conta
  const handleContaBancariaChange = (value: string) => {
    const conta = mockContasBancarias.find(c => c.id.toString() === value);
    setFormData({ 
      ...formData, 
      contaBancariaId: value,
      numeroCheque: conta?.proximoCheque || ""
    });
  };

  // Auto-fill valor e favorecido quando seleciona conta a pagar
  const handleContaPagarChange = (value: string) => {
    const conta = mockContasPagar.find(c => c.id.toString() === value);
    if (conta) {
      const fornecedor = mockFornecedores.find(f => f.nome === conta.fornecedor);
      setFormData({ 
        ...formData, 
        contaPagarId: value,
        valor: conta.valor.toFixed(2),
        descricao: conta.descricao,
        favorecidoId: fornecedor?.id.toString() || "",
        usarFavorecidoManual: false
      });
    } else {
      setFormData({ ...formData, contaPagarId: value });
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.contaBancariaId) {
      toast({ title: "Erro", description: "Selecione uma conta bancária.", variant: "destructive" });
      return;
    }
    if (!formData.numeroCheque) {
      toast({ title: "Erro", description: "Informe o número do cheque.", variant: "destructive" });
      return;
    }
    if (!formData.usarFavorecidoManual && !formData.favorecidoId) {
      toast({ title: "Erro", description: "Selecione um favorecido.", variant: "destructive" });
      return;
    }
    if (formData.usarFavorecidoManual && !formData.favorecidoManual) {
      toast({ title: "Erro", description: "Informe o nome do favorecido.", variant: "destructive" });
      return;
    }
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast({ title: "Erro", description: "Informe um valor válido.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({ title: "Sucesso", description: "Cheque emitido com sucesso!" });
      navigate("/financeiro/cheques-emitidos");
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
              onClick={() => navigate("/financeiro/cheques-emitidos")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Cheques Emitidos
            </button>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Emitir Novo Cheque
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registre a emissão de um novo cheque para pagamento.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate("/financeiro/cheques-emitidos")}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Salvando..." : "Emitir Cheque"}
                </Button>
              </div>
            </div>

            {/* Vincular a Conta a Pagar */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Vincular a Conta a Pagar (Opcional)
                </CardTitle>
                <CardDescription>
                  Selecione uma conta a pagar para vincular este cheque e preencher automaticamente os dados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Conta a Pagar</Label>
                  <Select
                    value={formData.contaPagarId}
                    onValueChange={handleContaPagarChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma conta a pagar (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockContasPagar.map((conta) => (
                        <SelectItem key={conta.id} value={conta.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{conta.codigo}</span>
                            <span>-</span>
                            <span>{conta.descricao}</span>
                            <span className="text-muted-foreground">({formatCurrency(conta.valor)})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedContaPagar && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Código</p>
                        <p className="font-medium">{selectedContaPagar.codigo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fornecedor</p>
                        <p className="font-medium">{selectedContaPagar.fornecedor}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor</p>
                        <p className="font-medium">{formatCurrency(selectedContaPagar.valor)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dados Bancários */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dados Bancários
                </CardTitle>
                <CardDescription>
                  Selecione a conta bancária de origem e o número do cheque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Conta Bancária *</Label>
                    <Select
                      value={formData.contaBancariaId}
                      onValueChange={handleContaBancariaChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockContasBancarias.map((conta) => (
                          <SelectItem key={conta.id} value={conta.id.toString()}>
                            {conta.banco} - Ag. {conta.agencia} / CC {conta.conta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número do Cheque *</Label>
                    <Input
                      placeholder="000000"
                      value={formData.numeroCheque}
                      onChange={(e) => setFormData({ ...formData, numeroCheque: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>

                {selectedContaBancaria && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Banco</p>
                        <p className="font-medium">{selectedContaBancaria.banco}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Código</p>
                        <p className="font-medium font-mono">{selectedContaBancaria.codigoBanco}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Agência</p>
                        <p className="font-medium font-mono">{selectedContaBancaria.agencia}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conta</p>
                        <p className="font-medium font-mono">{selectedContaBancaria.conta}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorecido */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Favorecido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox
                    id="favorecidoManual"
                    checked={formData.usarFavorecidoManual}
                    onCheckedChange={(checked) => setFormData({ 
                      ...formData, 
                      usarFavorecidoManual: checked as boolean,
                      favorecidoId: "",
                      favorecidoManual: "",
                      cnpjManual: ""
                    })}
                  />
                  <Label htmlFor="favorecidoManual" className="cursor-pointer">
                    Informar favorecido manualmente
                  </Label>
                </div>

                {formData.usarFavorecidoManual ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nome do Favorecido *</Label>
                      <Input
                        placeholder="Nome completo ou razão social"
                        value={formData.favorecidoManual}
                        onChange={(e) => setFormData({ ...formData, favorecidoManual: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF / CNPJ</Label>
                      <Input
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        value={formData.cnpjManual}
                        onChange={(e) => setFormData({ ...formData, cnpjManual: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Favorecido *</Label>
                      <Select
                        value={formData.favorecidoId}
                        onValueChange={(value) => setFormData({ ...formData, favorecidoId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o favorecido" />
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
                )}
              </CardContent>
            </Card>

            {/* Valores e Datas */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Valores e Datas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Valor do Cheque *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        placeholder="0,00"
                        value={formData.valor}
                        onChange={(e) => handleValorChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Emissão</Label>
                    <Input
                      type="date"
                      value={formData.dataEmissao}
                      onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bom Para</Label>
                    <Input
                      type="date"
                      value={formData.dataBomPara}
                      onChange={(e) => setFormData({ ...formData, dataBomPara: e.target.value })}
                    />
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

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Descrição do pagamento..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações adicionais..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resumo */}
            {formData.valor && parseFloat(formData.valor) > 0 && (
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Resumo do Cheque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Número</p>
                      <p className="font-mono font-bold text-lg">{formData.numeroCheque || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Banco</p>
                      <p className="font-medium">{selectedContaBancaria?.banco || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Favorecido</p>
                      <p className="font-medium">
                        {formData.usarFavorecidoManual 
                          ? formData.favorecidoManual || "-"
                          : selectedFornecedor?.nome || "-"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-bold text-lg text-primary">
                        {formatCurrency(parseFloat(formData.valor) || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NovoChequeEmitido;

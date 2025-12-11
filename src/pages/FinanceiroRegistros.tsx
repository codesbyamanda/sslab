import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Wallet,
  Lock,
  Unlock,
  Printer,
  ExternalLink,
  CheckCircle
} from "lucide-react";

// Mock data - Registros de Caixa
const mockRegistros = [
  {
    id: 1,
    codigo: "RC-2024-045",
    periodoAbertura: "11/12/2025 07:00",
    periodoFechamento: null,
    atendente: "Maria Silva",
    valorDinheiro: 650.00,
    valorCartao: 320.00,
    valorCheque: 580.00,
    total: 1550.00,
    situacao: "Aberto"
  },
  {
    id: 2,
    codigo: "RC-2024-044",
    periodoAbertura: "10/12/2025 07:00",
    periodoFechamento: "10/12/2025 19:00",
    atendente: "João Santos",
    valorDinheiro: 1200.00,
    valorCartao: 850.00,
    valorCheque: 200.00,
    total: 2250.00,
    situacao: "Fechado"
  },
  {
    id: 3,
    codigo: "RC-2024-043",
    periodoAbertura: "09/12/2025 07:00",
    periodoFechamento: "09/12/2025 18:30",
    atendente: "Ana Costa",
    valorDinheiro: 980.00,
    valorCartao: 1100.00,
    valorCheque: 0,
    total: 2080.00,
    situacao: "Fechado"
  }
];

// Mock data - Detalhes do registro selecionado
const mockDetalhes = [
  {
    id: 1,
    data: "11/12/2025 08:32",
    requisicao: "2024001",
    paciente: "Carlos Oliveira",
    formaPagamento: "Dinheiro",
    valor: 150.00,
    observacoes: "Pagamento à vista"
  },
  {
    id: 2,
    data: "11/12/2025 09:15",
    requisicao: "2024002",
    paciente: "Maria Fernandes",
    formaPagamento: "Cartão Crédito",
    valor: 320.00,
    observacoes: "Parcelado 2x"
  },
  {
    id: 3,
    data: "11/12/2025 10:45",
    requisicao: "2024003",
    paciente: "João Pedro Lima",
    formaPagamento: "Dinheiro",
    valor: 500.00,
    observacoes: ""
  },
  {
    id: 4,
    data: "11/12/2025 11:30",
    requisicao: "2024004",
    paciente: "Ana Beatriz",
    formaPagamento: "Cheque",
    valor: 580.00,
    observacoes: "Banco Itaú - Cheque 789456"
  }
];

const FinanceiroRegistros = () => {
  const navigate = useNavigate();
  const [selectedRegistro, setSelectedRegistro] = useState<typeof mockRegistros[0] | null>(null);
  const [showFecharModal, setShowFecharModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const handleFecharRegistro = () => {
    toast({
      title: "Registro fechado com sucesso",
      description: "Os valores foram consolidados no Caixa da unidade. Deseja imprimir o relatório de movimentação?",
    });
    setShowFecharModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Registros de Caixa</h1>
            <p className="text-muted-foreground mt-1">
              Controle os períodos de atendimento e os movimentos financeiros de cada registro de caixa.
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-3 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/atendimento/financeiro/caixa")}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Ver Caixa da Unidade
            </Button>
          </div>

          {/* Grid de Registros */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Lista de Registros</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Código</TableHead>
                      <TableHead className="font-semibold">Período</TableHead>
                      <TableHead className="font-semibold">Atendente</TableHead>
                      <TableHead className="font-semibold text-right">Dinheiro</TableHead>
                      <TableHead className="font-semibold text-right">Cartão</TableHead>
                      <TableHead className="font-semibold text-right">Cheque</TableHead>
                      <TableHead className="font-semibold text-right">Total</TableHead>
                      <TableHead className="font-semibold text-center">Situação</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRegistros.map((registro) => (
                      <TableRow 
                        key={registro.id} 
                        className={`hover:bg-muted/20 cursor-pointer ${selectedRegistro?.id === registro.id ? 'bg-primary/5' : ''}`}
                        onClick={() => setSelectedRegistro(registro)}
                      >
                        <TableCell className="font-medium">{registro.codigo}</TableCell>
                        <TableCell className="text-sm">
                          <div>{registro.periodoAbertura}</div>
                          {registro.periodoFechamento && (
                            <div className="text-muted-foreground">até {registro.periodoFechamento}</div>
                          )}
                        </TableCell>
                        <TableCell>{registro.atendente}</TableCell>
                        <TableCell className="text-right text-emerald-600">{formatCurrency(registro.valorDinheiro)}</TableCell>
                        <TableCell className="text-right text-blue-600">{formatCurrency(registro.valorCartao)}</TableCell>
                        <TableCell className="text-right text-amber-600">{formatCurrency(registro.valorCheque)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(registro.total)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={registro.situacao === "Aberto" ? "default" : "secondary"}>
                            {registro.situacao === "Aberto" ? (
                              <><Unlock className="h-3 w-3 mr-1" /> Aberto</>
                            ) : (
                              <><Lock className="h-3 w-3 mr-1" /> Fechado</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            {registro.situacao === "Aberto" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRegistro(registro);
                                  setShowFecharModal(true);
                                }}
                              >
                                <Lock className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Registro Selecionado */}
          {selectedRegistro && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Detalhes do Registro: {selectedRegistro.codigo}
                  </CardTitle>
                  <Badge variant={selectedRegistro.situacao === "Aberto" ? "default" : "secondary"}>
                    {selectedRegistro.situacao}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Data</TableHead>
                        <TableHead className="font-semibold">Nº Requisição</TableHead>
                        <TableHead className="font-semibold">Paciente</TableHead>
                        <TableHead className="font-semibold">Forma de Pagamento</TableHead>
                        <TableHead className="font-semibold text-right">Valor</TableHead>
                        <TableHead className="font-semibold">Observações</TableHead>
                        <TableHead className="font-semibold text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDetalhes.map((detalhe) => (
                        <TableRow key={detalhe.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">{detalhe.data}</TableCell>
                          <TableCell className="text-primary font-medium">{detalhe.requisicao}</TableCell>
                          <TableCell>{detalhe.paciente}</TableCell>
                          <TableCell>{detalhe.formaPagamento}</TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600">
                            {formatCurrency(detalhe.valor)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {detalhe.observacoes || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modal de Confirmação de Fechamento */}
          <Dialog open={showFecharModal} onOpenChange={setShowFecharModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Fechar Registro de Caixa
                </DialogTitle>
                <DialogDescription>
                  Ao fechar este registro, os valores serão consolidados automaticamente no Caixa da unidade.
                </DialogDescription>
              </DialogHeader>
              
              {selectedRegistro && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Registro</p>
                      <p className="font-medium">{selectedRegistro.codigo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atendente</p>
                      <p className="font-medium">{selectedRegistro.atendente}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total a Consolidar</p>
                      <p className="font-bold text-primary text-lg">{formatCurrency(selectedRegistro.total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Deseja imprimir o relatório de movimentação do caixa?
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowFecharModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleFecharRegistro}>
                  <Lock className="h-4 w-4 mr-2" />
                  Fechar e Imprimir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default FinanceiroRegistros;

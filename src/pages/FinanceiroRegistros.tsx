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
import { toast } from "@/hooks/use-toast";
import { 
  Wallet,
  Lock,
  Unlock,
  Printer,
  ExternalLink,
  Plus,
  AlertCircle,
  Clock,
  User
} from "lucide-react";
import NovoRegistroModal from "@/components/financeiro/NovoRegistroModal";
import FecharRegistroModal from "@/components/financeiro/FecharRegistroModal";

// Mock data - Registros de Caixa
const initialMockRegistros = [
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
    saldoInicial: 200.00,
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
    saldoInicial: 150.00,
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
    saldoInicial: 100.00,
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
    origem: "Receita a Receber",
    observacoes: "Pagamento à vista"
  },
  {
    id: 2,
    data: "11/12/2025 09:15",
    requisicao: "2024002",
    paciente: "Maria Fernandes",
    formaPagamento: "Cartão Crédito",
    valor: 320.00,
    origem: "Receita a Receber",
    observacoes: "Parcelado 2x"
  },
  {
    id: 3,
    data: "11/12/2025 10:45",
    requisicao: "2024003",
    paciente: "João Pedro Lima",
    formaPagamento: "Dinheiro",
    valor: 500.00,
    origem: "Receita a Receber",
    observacoes: ""
  },
  {
    id: 4,
    data: "11/12/2025 11:30",
    requisicao: "2024004",
    paciente: "Ana Beatriz",
    formaPagamento: "Cheque",
    valor: 580.00,
    origem: "Receita a Receber",
    observacoes: "Banco Itaú - Cheque 789456"
  }
];

const FinanceiroRegistros = () => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState(initialMockRegistros);
  const [selectedRegistro, setSelectedRegistro] = useState<typeof registros[0] | null>(null);
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [showFecharModal, setShowFecharModal] = useState(false);

  // Simula atendente logado (em produção viria de autenticação)
  const atendenteLogado = "Maria Silva";

  // Verifica se o atendente logado já tem um registro aberto
  const registroAbertoAtendente = registros.find(
    r => r.atendente === atendenteLogado && r.situacao === "Aberto"
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const handleNovoRegistro = (data: { atendente: string; saldoInicial: number }) => {
    // Verifica se o atendente já tem registro aberto
    const existeAberto = registros.some(
      r => r.atendente === data.atendente && r.situacao === "Aberto"
    );

    if (existeAberto) {
      toast({
        title: "Registro já existente",
        description: `O atendente ${data.atendente} já possui um registro de caixa aberto. Feche o registro atual antes de abrir um novo.`,
        variant: "destructive",
      });
      return;
    }

    const novoRegistro = {
      id: registros.length + 1,
      codigo: `RC-2024-${String(registros.length + 46).padStart(3, '0')}`,
      periodoAbertura: new Date().toLocaleString("pt-BR"),
      periodoFechamento: null,
      atendente: data.atendente,
      valorDinheiro: 0,
      valorCartao: 0,
      valorCheque: 0,
      total: 0,
      saldoInicial: data.saldoInicial,
      situacao: "Aberto"
    };

    setRegistros([novoRegistro, ...registros]);
    setShowNovoModal(false);

    toast({
      title: "Registro aberto com sucesso",
      description: `Registro ${novoRegistro.codigo} criado para ${data.atendente}. Agora você pode receber movimentações de Receitas a Receber.`,
    });
  };

  const handleFecharRegistro = (imprimir: boolean) => {
    if (!selectedRegistro) return;

    setRegistros(registros.map(r => 
      r.id === selectedRegistro.id
        ? { ...r, situacao: "Fechado", periodoFechamento: new Date().toLocaleString("pt-BR") }
        : r
    ));

    setShowFecharModal(false);
    setSelectedRegistro(null);

    toast({
      title: "Registro fechado com sucesso",
      description: imprimir 
        ? "Os valores foram consolidados no Caixa da unidade. O relatório será impresso em instantes."
        : "Os valores foram consolidados no Caixa da unidade.",
    });
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
              Gerencie os registros individuais de caixa por atendente e turno.
            </p>
          </div>

          {/* Alerta se não houver registro aberto */}
          {!registroAbertoAtendente && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Você não possui um registro de caixa aberto
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Para receber movimentações de Receitas a Receber, é necessário abrir um novo registro de caixa.
                </p>
              </div>
            </div>
          )}

          {/* Status do Atendente Logado */}
          {registroAbertoAtendente && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-emerald-800 dark:text-emerald-200">
                  Registro de Caixa Ativo: {registroAbertoAtendente.codigo}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                  Aberto em {registroAbertoAtendente.periodoAbertura} • 
                  Movimentações de Receitas a Receber serão registradas automaticamente.
                </p>
              </div>
              <Badge variant="default" className="bg-emerald-600">
                <Unlock className="h-3 w-3 mr-1" /> Ativo
              </Badge>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <Button onClick={() => setShowNovoModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro de Caixa
            </Button>
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
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Lista de Registros
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Código</TableHead>
                      <TableHead className="font-semibold">Período</TableHead>
                      <TableHead className="font-semibold">Atendente</TableHead>
                      <TableHead className="font-semibold text-right">Saldo Inicial</TableHead>
                      <TableHead className="font-semibold text-right">Dinheiro</TableHead>
                      <TableHead className="font-semibold text-right">Cartão</TableHead>
                      <TableHead className="font-semibold text-right">Cheque</TableHead>
                      <TableHead className="font-semibold text-right">Total</TableHead>
                      <TableHead className="font-semibold text-center">Situação</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros.map((registro) => (
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
                        <TableCell className="text-right text-muted-foreground">{formatCurrency(registro.saldoInicial)}</TableCell>
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
                                title="Fechar Registro"
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
                              title="Imprimir"
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
                    Movimentações: {selectedRegistro.codigo}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedRegistro.situacao === "Aberto" ? "default" : "secondary"}>
                      {selectedRegistro.situacao}
                    </Badge>
                    {selectedRegistro.situacao === "Fechado" && (
                      <span className="text-xs text-muted-foreground">
                        Este registro está fechado e não pode receber novas movimentações.
                      </span>
                    )}
                  </div>
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
                        <TableHead className="font-semibold">Origem</TableHead>
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
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {detalhe.origem}
                            </Badge>
                          </TableCell>
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

          {/* Modais */}
          <NovoRegistroModal 
            open={showNovoModal}
            onOpenChange={setShowNovoModal}
            onConfirm={handleNovoRegistro}
          />

          <FecharRegistroModal
            open={showFecharModal}
            onOpenChange={setShowFecharModal}
            registro={selectedRegistro}
            onConfirm={handleFecharRegistro}
          />
        </main>
      </div>
    </div>
  );
};

export default FinanceiroRegistros;

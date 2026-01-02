import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SegurancaLayout } from "@/components/seguranca/SegurancaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Shield, Monitor, FileText, Eye, Plus, Edit, Trash2, Printer, Download, ToggleLeft, ChevronRight, Check, X, CircleDot, Square, List } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data - Módulos e Telas
const modulosConfig = [
  {
    id: "atendimento",
    nome: "Saúde Atendimento",
    telas: [
      {
        id: "atendimento-dashboard",
        nome: "Dashboard",
        acoes: [
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "exportar", nome: "Exportar", icon: Download },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
        ],
        controles: [
          { id: "filtro-periodo", nome: "Filtro de Período", tipo: "input" },
          { id: "filtro-unidade", nome: "Filtro de Unidade", tipo: "combo" },
          { id: "graficos", nome: "Gráficos", tipo: "grid" },
          { id: "kpis", nome: "Cards de KPIs", tipo: "grid" },
        ],
      },
      {
        id: "atendimento-cadastro",
        nome: "Cadastro de Atendimento",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "cancelar", nome: "Cancelar", icon: X },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
        ],
        controles: [
          { id: "dados-paciente", nome: "Dados do Paciente", tipo: "input" },
          { id: "convenio", nome: "Convênio", tipo: "combo" },
          { id: "servicos", nome: "Serviços", tipo: "grid" },
          { id: "observacoes", nome: "Observações", tipo: "input" },
        ],
      },
      {
        id: "atendimento-lista",
        nome: "Lista de Atendimentos",
        acoes: [
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "cancelar", nome: "Cancelar", icon: X },
          { id: "exportar", nome: "Exportar", icon: Download },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
        ],
        controles: [
          { id: "filtros", nome: "Painel de Filtros", tipo: "grid" },
          { id: "tabela", nome: "Tabela de Resultados", tipo: "grid" },
          { id: "paginacao", nome: "Paginação", tipo: "button" },
        ],
      },
    ],
  },
  {
    id: "financeiro",
    nome: "Saúde Financeiro",
    telas: [
      {
        id: "financeiro-caixas",
        nome: "Caixas",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "abrir-caixa", nome: "Abrir Caixa", icon: ToggleLeft },
          { id: "fechar-caixa", nome: "Fechar Caixa", icon: ToggleLeft },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
        ],
        controles: [
          { id: "lista-caixas", nome: "Lista de Caixas", tipo: "grid" },
          { id: "saldo", nome: "Saldo", tipo: "input" },
          { id: "movimentacoes", nome: "Movimentações", tipo: "grid" },
        ],
      },
      {
        id: "financeiro-contas",
        nome: "Contas Correntes",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "dados-bancarios", nome: "Dados Bancários", tipo: "input" },
          { id: "saldo", nome: "Saldo", tipo: "input" },
          { id: "historico", nome: "Histórico", tipo: "grid" },
        ],
      },
      {
        id: "financeiro-receber",
        nome: "Receitas a Receber",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "receber", nome: "Receber", icon: Check },
          { id: "estornar", nome: "Estornar", icon: X },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "filtros", nome: "Filtros", tipo: "grid" },
          { id: "valores", nome: "Valores", tipo: "input" },
          { id: "parcelas", nome: "Parcelas", tipo: "grid" },
          { id: "historico", nome: "Histórico", tipo: "grid" },
        ],
      },
      {
        id: "financeiro-pagar",
        nome: "Contas a Pagar",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "pagar", nome: "Pagar", icon: Check },
          { id: "cancelar", nome: "Cancelar", icon: X },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "dados-conta", nome: "Dados da Conta", tipo: "input" },
          { id: "parcelas", nome: "Parcelas", tipo: "grid" },
          { id: "anexos", nome: "Anexos", tipo: "button" },
        ],
      },
    ],
  },
  {
    id: "laboratorio",
    nome: "Saúde Laboratório",
    telas: [
      {
        id: "laboratorio-amostras",
        nome: "Amostras",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "imprimir-etiqueta", nome: "Imprimir Etiqueta", icon: Printer },
        ],
        controles: [
          { id: "dados-amostra", nome: "Dados da Amostra", tipo: "input" },
          { id: "exames", nome: "Exames", tipo: "grid" },
          { id: "status", nome: "Status", tipo: "combo" },
        ],
      },
      {
        id: "laboratorio-digitacao",
        nome: "Digitação de Resultados",
        acoes: [
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "liberar", nome: "Liberar", icon: Check },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
        ],
        controles: [
          { id: "resultados", nome: "Resultados", tipo: "grid" },
          { id: "observacoes", nome: "Observações", tipo: "input" },
          { id: "assinatura", nome: "Assinatura Digital", tipo: "button" },
        ],
      },
      {
        id: "laboratorio-laudos",
        nome: "Laudos",
        acoes: [
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "imprimir", nome: "Imprimir", icon: Printer },
          { id: "exportar", nome: "Exportar", icon: Download },
          { id: "enviar", nome: "Enviar", icon: Check },
        ],
        controles: [
          { id: "dados-laudo", nome: "Dados do Laudo", tipo: "input" },
          { id: "resultados", nome: "Resultados", tipo: "grid" },
          { id: "graficos", nome: "Gráficos", tipo: "grid" },
        ],
      },
    ],
  },
  {
    id: "faturamento",
    nome: "Saúde Faturamento",
    telas: [
      {
        id: "faturamento-guias",
        nome: "Guias",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "cancelar", nome: "Cancelar", icon: X },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "dados-guia", nome: "Dados da Guia", tipo: "input" },
          { id: "procedimentos", nome: "Procedimentos", tipo: "grid" },
          { id: "valores", nome: "Valores", tipo: "input" },
        ],
      },
      {
        id: "faturamento-lotes",
        nome: "Lotes de Faturamento",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "enviar", nome: "Enviar", icon: Check },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "guias-lote", nome: "Guias do Lote", tipo: "grid" },
          { id: "valores", nome: "Valores", tipo: "input" },
          { id: "status", nome: "Status", tipo: "combo" },
        ],
      },
    ],
  },
  {
    id: "transferencia",
    nome: "Saúde Transferência",
    telas: [
      {
        id: "transferencia-lista",
        nome: "Transferências",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "cancelar", nome: "Cancelar", icon: X },
        ],
        controles: [
          { id: "dados-paciente", nome: "Dados do Paciente", tipo: "input" },
          { id: "origem-destino", nome: "Origem/Destino", tipo: "combo" },
          { id: "prontuario", nome: "Prontuário", tipo: "grid" },
        ],
      },
      {
        id: "transferencia-historico",
        nome: "Histórico",
        acoes: [
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "exportar", nome: "Exportar", icon: Download },
        ],
        controles: [
          { id: "filtros", nome: "Filtros", tipo: "grid" },
          { id: "timeline", nome: "Timeline", tipo: "grid" },
        ],
      },
    ],
  },
  {
    id: "seguranca",
    nome: "Saúde Segurança",
    telas: [
      {
        id: "seguranca-perfis",
        nome: "Grupo de Controle de Acesso",
        acoes: [
          { id: "novo", nome: "Novo", icon: Plus },
          { id: "editar", nome: "Editar", icon: Edit },
          { id: "visualizar", nome: "Visualizar", icon: Eye },
          { id: "excluir", nome: "Excluir", icon: Trash2 },
        ],
        controles: [
          { id: "lista-perfis", nome: "Lista de Perfis", tipo: "grid" },
          { id: "filtros", nome: "Filtros", tipo: "input" },
        ],
      },
    ],
  },
];

// Mock data - Relatórios
const relatoriosConfig = [
  {
    modulo: "Saúde Atendimento",
    relatorios: [
      { id: "rel-atend-diario", nome: "Atendimento Diário" },
      { id: "rel-atend-convenio", nome: "Atendimento por Convênio" },
      { id: "rel-atend-particular", nome: "Atendimento Particular" },
      { id: "rel-promessa-entrega", nome: "Promessa de Entrega" },
    ],
  },
  {
    modulo: "Saúde Financeiro",
    relatorios: [
      { id: "rel-mov-financeira", nome: "Movimentação Financeira" },
      { id: "rel-devedores", nome: "Devedores" },
      { id: "rel-faturamentos", nome: "Faturamentos" },
      { id: "rel-itens-pendentes", nome: "Itens Pendentes" },
    ],
  },
  {
    modulo: "Saúde Faturamento",
    relatorios: [
      { id: "rel-clinica-analitico", nome: "Clínica Analítico" },
      { id: "rel-clinica-sintetico", nome: "Clínica Sintético" },
      { id: "rel-exames-servicos", nome: "Exames e Serviços" },
      { id: "rel-rendimentos", nome: "Rendimentos Solicitantes" },
    ],
  },
  {
    modulo: "Saúde Laboratório",
    relatorios: [
      { id: "rel-producao-lab", nome: "Produção Laboratorial" },
      { id: "rel-amostras-pendentes", nome: "Amostras Pendentes" },
      { id: "rel-laudos-emitidos", nome: "Laudos Emitidos" },
    ],
  },
  {
    modulo: "Saúde Transferência",
    relatorios: [
      { id: "rel-transferencias-periodo", nome: "Transferências por Período" },
      { id: "rel-transferencias-tipo", nome: "Transferências por Tipo" },
      { id: "rel-transferencias-unidade", nome: "Transferências por Unidade" },
    ],
  },
];

// Mock data para edição
const mockPerfilExistente = {
  id: 1,
  codigo: "ADM",
  descricao: "Administrador",
  ativo: true,
  permissoesTelas: {
    "atendimento-dashboard": {
      acoes: ["visualizar", "exportar", "imprimir"],
      controles: ["filtro-periodo", "filtro-unidade", "graficos", "kpis"],
    },
    "atendimento-cadastro": {
      acoes: ["novo", "editar", "visualizar", "cancelar", "imprimir"],
      controles: ["dados-paciente", "convenio", "servicos", "observacoes"],
    },
  },
  relatorios: ["rel-atend-diario", "rel-mov-financeira", "rel-clinica-analitico"],
};

const getControlIcon = (tipo: string) => {
  switch (tipo) {
    case "input":
      return Square;
    case "combo":
      return List;
    case "grid":
      return List;
    case "button":
      return CircleDot;
    case "checkbox":
      return Check;
    default:
      return Square;
  }
};

const getControlLabel = (tipo: string) => {
  switch (tipo) {
    case "input":
      return "Campo de texto";
    case "combo":
      return "Lista suspensa";
    case "grid":
      return "Grade/Tabela";
    case "button":
      return "Botão";
    case "checkbox":
      return "Checkbox";
    default:
      return "Controle";
  }
};

export default function PerfilAcesso() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "novo";

  const [descricao, setDescricao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [permissoesTelas, setPermissoesTelas] = useState<Record<string, { acoes: string[]; controles: string[] }>>({});
  const [relatoriosSelecionados, setRelatoriosSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados do perfil se estiver editando
  useEffect(() => {
    if (isEditing) {
      setDescricao(mockPerfilExistente.descricao);
      setCodigo(mockPerfilExistente.codigo);
      setAtivo(mockPerfilExistente.ativo);
      setPermissoesTelas(mockPerfilExistente.permissoesTelas);
      setRelatoriosSelecionados(mockPerfilExistente.relatorios);
    }
  }, [isEditing]);

  const handleToggleAcao = (telaId: string, acaoId: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      const acoes = telaPermissoes.acoes.includes(acaoId)
        ? telaPermissoes.acoes.filter((a) => a !== acaoId)
        : [...telaPermissoes.acoes, acaoId];
      return { ...prev, [telaId]: { ...telaPermissoes, acoes } };
    });
  };

  const handleToggleControle = (telaId: string, controleId: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      const controles = telaPermissoes.controles.includes(controleId)
        ? telaPermissoes.controles.filter((c) => c !== controleId)
        : [...telaPermissoes.controles, controleId];
      return { ...prev, [telaId]: { ...telaPermissoes, controles } };
    });
  };

  const handleToggleRelatorio = (relatorioId: string) => {
    setRelatoriosSelecionados((prev) =>
      prev.includes(relatorioId)
        ? prev.filter((r) => r !== relatorioId)
        : [...prev, relatorioId]
    );
  };

  const handleMarcarTodasAcoes = (telaId: string, acoes: { id: string }[]) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, acoes: acoes.map((a) => a.id) } };
    });
  };

  const handleDesmarcarTodasAcoes = (telaId: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, acoes: [] } };
    });
  };

  const handleMarcarTodosControles = (telaId: string, controles: { id: string }[]) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, controles: controles.map((c) => c.id) } };
    });
  };

  const handleDesmarcarTodosControles = (telaId: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, controles: [] } };
    });
  };

  const handleSalvar = () => {
    if (!descricao.trim()) {
      toast.error("Informe a descrição do perfil.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isEditing ? "Perfil atualizado com sucesso!" : "Perfil criado com sucesso!");
      navigate("/seguranca/grupo-controle-acesso");
    }, 1000);
  };

  const getTelaPermissionCount = (telaId: string, tela: typeof modulosConfig[0]["telas"][0]) => {
    const permissoes = permissoesTelas[telaId];
    if (!permissoes) return { acoes: 0, controles: 0, total: tela.acoes.length + tela.controles.length };
    return {
      acoes: permissoes.acoes.length,
      controles: permissoes.controles.length,
      total: tela.acoes.length + tela.controles.length,
    };
  };

  const getModuloPermissionCount = (modulo: typeof modulosConfig[0]) => {
    let acoesTotal = 0;
    let acoesHabilitadas = 0;
    let controlesTotal = 0;
    let controlesHabilitados = 0;

    modulo.telas.forEach((tela) => {
      acoesTotal += tela.acoes.length;
      controlesTotal += tela.controles.length;
      const permissoes = permissoesTelas[tela.id];
      if (permissoes) {
        acoesHabilitadas += permissoes.acoes.length;
        controlesHabilitados += permissoes.controles.length;
      }
    });

    return { acoesHabilitadas, acoesTotal, controlesHabilitados, controlesTotal };
  };

  return (
    <SegurancaLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Breadcrumb e Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/seguranca/grupo-controle-acesso")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Editar Perfil de Acesso" : "Novo Perfil de Acesso"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Grupo de Controle de Acesso <ChevronRight className="inline w-4 h-4" />{" "}
              {isEditing ? mockPerfilExistente.descricao : "Novo Perfil"}
            </p>
          </div>
          <Button onClick={handleSalvar} disabled={loading} className="gap-2">
            <Save className="w-4 h-4" />
            {loading ? "Salvando..." : "Salvar Perfil"}
          </Button>
        </div>

        {/* Dados do Perfil */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Dados do Perfil</CardTitle>
                <CardDescription>Informações básicas do perfil de acesso</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: ADM"
                  maxLength={10}
                  disabled={isEditing}
                  className={isEditing ? "bg-muted" : ""}
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    O código não pode ser alterado.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">
                  Descrição do Perfil <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Administrador"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch checked={ativo} onCheckedChange={setAtivo} />
                  <span className={cn("text-sm font-medium", ativo ? "text-green-600" : "text-muted-foreground")}>
                    {ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Configuração */}
        <Tabs defaultValue="telas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="telas" className="gap-2">
              <Monitor className="w-4 h-4" />
              Acesso às Telas
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Tab: Configuração de Telas por Módulo */}
          <TabsContent value="telas">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configuração de Acesso às Telas</CardTitle>
                    <CardDescription>
                      Defina as permissões de ações e controles para cada tela do sistema. Ações desmarcadas ficam desabilitadas na interface. Controles desmarcados ficam ocultos ou bloqueados.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="multiple" className="space-y-3">
                    {modulosConfig.map((modulo) => {
                      const counts = getModuloPermissionCount(modulo);
                      const hasPermissions = counts.acoesHabilitadas > 0 || counts.controlesHabilitados > 0;
                      
                      return (
                        <AccordionItem
                          key={modulo.id}
                          value={modulo.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center",
                                hasPermissions ? "bg-primary/10" : "bg-muted"
                              )}>
                                <Monitor className={cn("w-4 h-4", hasPermissions ? "text-primary" : "text-muted-foreground")} />
                              </div>
                              <span className="font-medium text-left">{modulo.nome}</span>
                              <div className="flex items-center gap-2 ml-auto mr-4">
                                <Badge variant={hasPermissions ? "default" : "secondary"} className="text-xs">
                                  {counts.acoesHabilitadas}/{counts.acoesTotal} ações
                                </Badge>
                                <Badge variant={hasPermissions ? "outline" : "secondary"} className="text-xs">
                                  {counts.controlesHabilitados}/{counts.controlesTotal} controles
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="space-y-3">
                              {modulo.telas.map((tela) => {
                                const counts = getTelaPermissionCount(tela.id, tela);
                                const telaPermissoes = permissoesTelas[tela.id] || { acoes: [], controles: [] };
                                
                                return (
                                  <div key={tela.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-background p-4">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-medium">{tela.nome}</h4>
                                          <span className="text-xs text-muted-foreground">
                                            ({counts.acoes + counts.controles}/{counts.total} habilitados)
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Ações */}
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <h5 className="font-medium text-sm">Ações</h5>
                                              <p className="text-xs text-muted-foreground">
                                                Botões, menus e atalhos da tela
                                              </p>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() => handleMarcarTodasAcoes(tela.id, tela.acoes)}
                                              >
                                                Marcar
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() => handleDesmarcarTodasAcoes(tela.id)}
                                              >
                                                Limpar
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            {tela.acoes.map((acao) => {
                                              const Icon = acao.icon;
                                              const isChecked = telaPermissoes.acoes.includes(acao.id);
                                              return (
                                                <label
                                                  key={acao.id}
                                                  className={cn(
                                                    "flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all",
                                                    isChecked 
                                                      ? "bg-primary/5 border-primary/30" 
                                                      : "hover:bg-muted/50"
                                                  )}
                                                >
                                                  <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleToggleAcao(tela.id, acao.id)}
                                                  />
                                                  <Icon className={cn("w-4 h-4", isChecked ? "text-primary" : "text-muted-foreground")} />
                                                  <span className="text-sm">{acao.nome}</span>
                                                </label>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        {/* Controles */}
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <h5 className="font-medium text-sm">Controles</h5>
                                              <p className="text-xs text-muted-foreground">
                                                Campos e elementos visuais
                                              </p>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() => handleMarcarTodosControles(tela.id, tela.controles)}
                                              >
                                                Marcar
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs"
                                                onClick={() => handleDesmarcarTodosControles(tela.id)}
                                              >
                                                Limpar
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            {tela.controles.map((controle) => {
                                              const Icon = getControlIcon(controle.tipo);
                                              const isChecked = telaPermissoes.controles.includes(controle.id);
                                              return (
                                                <label
                                                  key={controle.id}
                                                  className={cn(
                                                    "flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-all",
                                                    isChecked 
                                                      ? "bg-primary/5 border-primary/30" 
                                                      : "hover:bg-muted/50"
                                                  )}
                                                >
                                                  <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleToggleControle(tela.id, controle.id)}
                                                  />
                                                  <div className="flex-1">
                                                    <span className="text-sm font-medium">{controle.nome}</span>
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                      ({getControlLabel(controle.tipo)})
                                                    </span>
                                                  </div>
                                                  <Icon className={cn("w-4 h-4", isChecked ? "text-primary" : "text-muted-foreground")} />
                                                </label>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Relatórios */}
          <TabsContent value="relatorios">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configuração de Relatórios</CardTitle>
                    <CardDescription>
                      Selecione os relatórios que este perfil terá acesso. Relatórios habilitados aparecem no menu lateral de cada módulo.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <Accordion type="multiple" defaultValue={relatoriosConfig.map((g) => g.modulo)} className="space-y-3">
                    {relatoriosConfig.map((grupo) => {
                      const habilitados = grupo.relatorios.filter((r) => relatoriosSelecionados.includes(r.id)).length;
                      const hasRelatorios = habilitados > 0;
                      
                      return (
                        <AccordionItem
                          key={grupo.modulo}
                          value={grupo.modulo}
                          className="border rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/30 hover:bg-muted/50">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center",
                                hasRelatorios ? "bg-purple-100" : "bg-muted"
                              )}>
                                <FileText className={cn("w-4 h-4", hasRelatorios ? "text-purple-600" : "text-muted-foreground")} />
                              </div>
                              <span className="font-medium text-left">{grupo.modulo}</span>
                              <Badge 
                                variant={hasRelatorios ? "default" : "secondary"} 
                                className={cn("ml-auto mr-4 text-xs", hasRelatorios && "bg-purple-600")}
                              >
                                {habilitados}/{grupo.relatorios.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {grupo.relatorios.map((relatorio) => {
                                const isChecked = relatoriosSelecionados.includes(relatorio.id);
                                return (
                                  <label
                                    key={relatorio.id}
                                    className={cn(
                                      "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                                      isChecked 
                                        ? "bg-purple-50 border-purple-200" 
                                        : "hover:bg-muted/50"
                                    )}
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() => handleToggleRelatorio(relatorio.id)}
                                    />
                                    <FileText className={cn("w-4 h-4", isChecked ? "text-purple-600" : "text-muted-foreground")} />
                                    <span className="text-sm">{relatorio.nome}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ações fixas no rodapé */}
        <div className="flex items-center justify-between pt-4 border-t bg-background sticky bottom-0">
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Alterações serão aplicadas imediatamente após salvar." : "Preencha todos os campos obrigatórios."}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/seguranca/grupo-controle-acesso")}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </div>
        </div>
      </div>
    </SegurancaLayout>
  );
}

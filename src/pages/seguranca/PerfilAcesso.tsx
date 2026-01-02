import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SegurancaLayout } from "@/components/seguranca/SegurancaLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Shield, Monitor, FileText, Settings2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data - Módulos e Telas
const modulosConfig = [
  {
    id: "atendimento",
    nome: "Saúde Atendimento",
    telas: [
      {
        id: "atendimento-dashboard",
        nome: "Dashboard",
        acoes: ["Visualizar", "Exportar", "Imprimir"],
        controles: ["Filtro de Período", "Filtro de Unidade", "Gráficos"],
      },
      {
        id: "atendimento-cadastro",
        nome: "Cadastro de Atendimento",
        acoes: ["Novo", "Editar", "Visualizar", "Cancelar", "Imprimir"],
        controles: ["Dados do Paciente", "Convênio", "Serviços", "Observações"],
      },
      {
        id: "atendimento-lista",
        nome: "Lista de Atendimentos",
        acoes: ["Visualizar", "Editar", "Cancelar", "Exportar", "Imprimir"],
        controles: ["Filtros", "Tabela", "Paginação"],
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
        acoes: ["Novo", "Visualizar", "Abrir Caixa", "Fechar Caixa", "Imprimir"],
        controles: ["Lista de Caixas", "Saldo", "Movimentações"],
      },
      {
        id: "financeiro-contas",
        nome: "Contas Correntes",
        acoes: ["Novo", "Editar", "Visualizar", "Exportar"],
        controles: ["Dados Bancários", "Saldo", "Histórico"],
      },
      {
        id: "financeiro-receber",
        nome: "Receitas a Receber",
        acoes: ["Novo", "Editar", "Visualizar", "Receber", "Estornar", "Exportar"],
        controles: ["Filtros", "Valores", "Parcelas", "Histórico"],
      },
      {
        id: "financeiro-pagar",
        nome: "Contas a Pagar",
        acoes: ["Novo", "Editar", "Visualizar", "Pagar", "Cancelar", "Exportar"],
        controles: ["Dados da Conta", "Parcelas", "Anexos"],
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
        acoes: ["Novo", "Editar", "Visualizar", "Imprimir Etiqueta"],
        controles: ["Dados da Amostra", "Exames", "Status"],
      },
      {
        id: "laboratorio-digitacao",
        nome: "Digitação de Resultados",
        acoes: ["Editar", "Visualizar", "Liberar", "Imprimir"],
        controles: ["Resultados", "Observações", "Assinatura"],
      },
      {
        id: "laboratorio-laudos",
        nome: "Laudos",
        acoes: ["Visualizar", "Imprimir", "Exportar", "Enviar"],
        controles: ["Dados do Laudo", "Resultados", "Gráficos"],
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
        acoes: ["Novo", "Editar", "Visualizar", "Cancelar", "Exportar"],
        controles: ["Dados da Guia", "Procedimentos", "Valores"],
      },
      {
        id: "faturamento-lotes",
        nome: "Lotes de Faturamento",
        acoes: ["Novo", "Editar", "Visualizar", "Enviar", "Exportar"],
        controles: ["Guias do Lote", "Valores", "Status"],
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
        acoes: ["Novo", "Editar", "Visualizar", "Cancelar"],
        controles: ["Dados do Paciente", "Origem/Destino", "Prontuário"],
      },
      {
        id: "transferencia-historico",
        nome: "Histórico",
        acoes: ["Visualizar", "Exportar"],
        controles: ["Filtros", "Timeline"],
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
];

// Mock data para edição
const mockPerfilExistente = {
  id: 1,
  codigo: "ADM",
  descricao: "Administrador",
  permissoesTelas: {
    "atendimento-dashboard": {
      acoes: ["Visualizar", "Exportar", "Imprimir"],
      controles: ["Filtro de Período", "Filtro de Unidade", "Gráficos"],
    },
    "atendimento-cadastro": {
      acoes: ["Novo", "Editar", "Visualizar", "Cancelar", "Imprimir"],
      controles: ["Dados do Paciente", "Convênio", "Serviços", "Observações"],
    },
  },
  relatorios: ["rel-atend-diario", "rel-mov-financeira", "rel-clinica-analitico"],
};

export default function PerfilAcesso() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "novo";

  const [descricao, setDescricao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [moduloSelecionado, setModuloSelecionado] = useState("");
  const [telaSelecionada, setTelaSelecionada] = useState("");
  const [permissoesTelas, setPermissoesTelas] = useState<Record<string, { acoes: string[]; controles: string[] }>>({});
  const [relatoriosSelecionados, setRelatoriosSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados do perfil se estiver editando
  useEffect(() => {
    if (isEditing) {
      // Simular carregamento
      setDescricao(mockPerfilExistente.descricao);
      setCodigo(mockPerfilExistente.codigo);
      setPermissoesTelas(mockPerfilExistente.permissoesTelas);
      setRelatoriosSelecionados(mockPerfilExistente.relatorios);
    }
  }, [isEditing]);

  const moduloAtual = modulosConfig.find((m) => m.id === moduloSelecionado);
  const telaAtual = moduloAtual?.telas.find((t) => t.id === telaSelecionada);

  const handleToggleAcao = (telaId: string, acao: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      const acoes = telaPermissoes.acoes.includes(acao)
        ? telaPermissoes.acoes.filter((a) => a !== acao)
        : [...telaPermissoes.acoes, acao];
      return { ...prev, [telaId]: { ...telaPermissoes, acoes } };
    });
  };

  const handleToggleControle = (telaId: string, controle: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      const controles = telaPermissoes.controles.includes(controle)
        ? telaPermissoes.controles.filter((c) => c !== controle)
        : [...telaPermissoes.controles, controle];
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

  const handleMarcarTodasAcoes = (telaId: string, acoes: string[]) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, acoes } };
    });
  };

  const handleDesmarcarTodasAcoes = (telaId: string) => {
    setPermissoesTelas((prev) => {
      const telaPermissoes = prev[telaId] || { acoes: [], controles: [] };
      return { ...prev, [telaId]: { ...telaPermissoes, acoes: [] } };
    });
  };

  return (
    <SegurancaLayout>
      <div className="space-y-6">
        {/* Breadcrumb e Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/seguranca/grupo-controle-acesso")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Editar Perfil" : "Novo Perfil"}
            </h1>
            <p className="text-muted-foreground">
              Grupo de Controle de Acesso <ChevronRight className="inline w-4 h-4" />{" "}
              {isEditing ? mockPerfilExistente.descricao : "Novo Perfil"}
            </p>
          </div>
        </div>

        {/* Dados do Perfil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Dados do Perfil</CardTitle>
                <CardDescription>Informações básicas do perfil de acesso</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    O código não pode ser alterado após a criação.
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
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Configuração */}
        <Tabs defaultValue="telas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="telas" className="gap-2">
              <Monitor className="w-4 h-4" />
              Acesso às Telas
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Tab: Configuração de Telas */}
          <TabsContent value="telas" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Configuração de Acesso às Telas</CardTitle>
                    <CardDescription>
                      Defina as permissões de ações e controles para cada tela do sistema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seletores de Módulo e Tela */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Módulo</Label>
                    <Select value={moduloSelecionado} onValueChange={(v) => { setModuloSelecionado(v); setTelaSelecionada(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modulosConfig.map((modulo) => (
                          <SelectItem key={modulo.id} value={modulo.id}>
                            {modulo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tela do Módulo</Label>
                    <Select
                      value={telaSelecionada}
                      onValueChange={setTelaSelecionada}
                      disabled={!moduloSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma tela" />
                      </SelectTrigger>
                      <SelectContent>
                        {moduloAtual?.telas.map((tela) => (
                          <SelectItem key={tela.id} value={tela.id}>
                            {tela.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Configuração de Permissões da Tela */}
                {telaAtual && (
                  <div className="border rounded-lg p-6 bg-muted/30 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        {telaAtual.nome}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarcarTodasAcoes(telaAtual.id, telaAtual.acoes)}
                        >
                          Marcar Todas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDesmarcarTodasAcoes(telaAtual.id)}
                        >
                          Desmarcar Todas
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Ações */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-foreground mb-1">Ações</h4>
                          <p className="text-xs text-muted-foreground">
                            Botões, menus e atalhos disponíveis na tela
                          </p>
                        </div>
                        <div className="space-y-3">
                          {telaAtual.acoes.map((acao) => {
                            const isChecked = permissoesTelas[telaAtual.id]?.acoes.includes(acao) || false;
                            return (
                              <label
                                key={acao}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-background cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handleToggleAcao(telaAtual.id, acao)}
                                />
                                <span className="text-sm font-medium">{acao}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Controles */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-foreground mb-1">Controles</h4>
                          <p className="text-xs text-muted-foreground">
                            Campos, grids e elementos visíveis na tela
                          </p>
                        </div>
                        <div className="space-y-3">
                          {telaAtual.controles.map((controle) => {
                            const isChecked = permissoesTelas[telaAtual.id]?.controles.includes(controle) || false;
                            return (
                              <label
                                key={controle}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-background cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handleToggleControle(telaAtual.id, controle)}
                                />
                                <span className="text-sm font-medium">{controle}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estado vazio */}
                {!telaAtual && (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-1">
                      Selecione um módulo e uma tela
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Escolha acima para configurar as permissões de acesso
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Relatórios */}
          <TabsContent value="relatorios" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Configuração de Relatórios</CardTitle>
                    <CardDescription>
                      Selecione os relatórios que este perfil terá acesso em cada módulo
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <Accordion type="multiple" className="space-y-4">
                    {relatoriosConfig.map((grupo) => (
                      <AccordionItem
                        key={grupo.modulo}
                        value={grupo.modulo}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{grupo.modulo}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {grupo.relatorios.filter((r) => relatoriosSelecionados.includes(r.id)).length}/
                              {grupo.relatorios.length}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-2 pl-11">
                            {grupo.relatorios.map((relatorio) => {
                              const isChecked = relatoriosSelecionados.includes(relatorio.id);
                              return (
                                <label
                                  key={relatorio.id}
                                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => handleToggleRelatorio(relatorio.id)}
                                  />
                                  <span className="text-sm">{relatorio.nome}</span>
                                </label>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ações */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
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
    </SegurancaLayout>
  );
}

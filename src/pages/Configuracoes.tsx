import { useState } from "react";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Settings,
  Printer,
  FileText,
  Globe,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  FolderOpen
} from "lucide-react";

// Mock data - Empresas DataCenter
const mockEmpresas = [
  { id: 1, nome: "DataCenter Principal", servidor: "dc.saudesystems.com.br", chave: "ABC123XYZ" },
  { id: 2, nome: "DataCenter Backup", servidor: "dc2.saudesystems.com.br", chave: "DEF456UVW" }
];

const Configuracoes = () => {
  // Estado das abas
  const [activeTab, setActiveTab] = useState("geral");

  // Estados - Aba Geral
  const [tipoAtendimentoPadrao, setTipoAtendimentoPadrao] = useState("ambulatorial");
  const [convenioPadrao, setConvenioPadrao] = useState("");
  const [planoPadrao, setPlanoPadrao] = useState("");
  const [unidadePadrao, setUnidadePadrao] = useState("matriz");
  const [usuarioImpressao, setUsuarioImpressao] = useState("");
  const [destinoImpressoras, setDestinoImpressoras] = useState("");
  const [exigirDadosClinicos, setExigirDadosClinicos] = useState(false);
  const [obrigatoriedadeContato, setObrigatoriedadeContato] = useState(true);

  // Estados - Aba Impressão
  const [impressoraComprovante, setImpressoraComprovante] = useState("");
  const [layoutComprovante, setLayoutComprovante] = useState("");
  const [impressoraOrcamento, setImpressoraOrcamento] = useState("");
  const [layoutOrcamento, setLayoutOrcamento] = useState("");
  const [impressoraEtiquetas, setImpressoraEtiquetas] = useState("");
  const [layoutEtiquetas, setLayoutEtiquetas] = useState("");
  const [imprimirAutomaticamente, setImprimirAutomaticamente] = useState(true);
  const [imprimirDireto, setImprimirDireto] = useState(false);
  const [formComprovanteAtendimento, setFormComprovanteAtendimento] = useState(true);
  const [formGuiasConvenios, setFormGuiasConvenios] = useState(true);
  const [formEtiquetas, setFormEtiquetas] = useState(true);
  const [formOrcamento, setFormOrcamento] = useState(false);

  // Estados - Aba TISS
  const [caraterSolicitacao, setCaraterSolicitacao] = useState("eletivo");
  const [indicacaoAcidente, setIndicacaoAcidente] = useState("9");
  const [tipoAtendimentoTISS, setTipoAtendimentoTISS] = useState("01");
  const [tipoFaturamento, setTipoFaturamento] = useState("01");
  const [outrosCamposTISS, setOutrosCamposTISS] = useState("");

  // Estados - Aba Laudo Internet
  const [pastaLaudos, setPastaLaudos] = useState("C:\\Laudos\\Saude");
  const [empresas, setEmpresas] = useState(mockEmpresas);
  const [showAddEmpresa, setShowAddEmpresa] = useState(false);
  const [novaEmpresa, setNovaEmpresa] = useState({ nome: "", servidor: "", chave: "" });
  const [envioAutomatico, setEnvioAutomatico] = useState(true);

  const handleSalvar = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  const handleAddEmpresa = () => {
    if (!novaEmpresa.nome || !novaEmpresa.servidor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e servidor da empresa.",
        variant: "destructive"
      });
      return;
    }

    setEmpresas([...empresas, { ...novaEmpresa, id: Date.now() }]);
    setNovaEmpresa({ nome: "", servidor: "", chave: "" });
    setShowAddEmpresa(false);
    toast({
      title: "Empresa adicionada",
      description: "A empresa DataCenter foi adicionada com sucesso.",
    });
  };

  const handleRemoveEmpresa = (id: number) => {
    setEmpresas(empresas.filter(e => e.id !== id));
    toast({
      title: "Empresa removida",
      description: "A empresa DataCenter foi removida.",
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
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Configurações do Atendimento
            </h1>
            <p className="text-muted-foreground mt-1">
              Defina padrões e preferências do módulo de atendimento.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Geral</span>
              </TabsTrigger>
              <TabsTrigger value="impressao" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Impressão</span>
              </TabsTrigger>
              <TabsTrigger value="tiss" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">TISS</span>
              </TabsTrigger>
              <TabsTrigger value="laudo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Laudo Internet</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA GERAL */}
            <TabsContent value="geral" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Campos Padrões</CardTitle>
                  <CardDescription>
                    Defina os valores padrão que serão aplicados automaticamente em novas requisições.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Tipo de Atendimento Padrão</Label>
                      <Select value={tipoAtendimentoPadrao} onValueChange={setTipoAtendimentoPadrao}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                          <SelectItem value="internacao">Internação</SelectItem>
                          <SelectItem value="emergencia">Emergência</SelectItem>
                          <SelectItem value="domiciliar">Domiciliar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Convênio Padrão</Label>
                      <Select value={convenioPadrao} onValueChange={setConvenioPadrao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o convênio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particular">Particular</SelectItem>
                          <SelectItem value="unimed">Unimed</SelectItem>
                          <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                          <SelectItem value="sulamerica">SulAmérica</SelectItem>
                          <SelectItem value="amil">Amil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Plano Padrão</Label>
                      <Select value={planoPadrao} onValueChange={setPlanoPadrao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basico">Básico</SelectItem>
                          <SelectItem value="intermediario">Intermediário</SelectItem>
                          <SelectItem value="completo">Completo</SelectItem>
                          <SelectItem value="executivo">Executivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Unidade Padrão</Label>
                      <Select value={unidadePadrao} onValueChange={setUnidadePadrao}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matriz">Unidade Matriz</SelectItem>
                          <SelectItem value="filial-centro">Filial Centro</SelectItem>
                          <SelectItem value="filial-sul">Filial Sul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Usuário Padrão para Impressão</Label>
                      <Select value={usuarioImpressao} onValueChange={setUsuarioImpressao}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="recepcao">Recepção</SelectItem>
                          <SelectItem value="laboratorio">Laboratório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Destino Impressoras</Label>
                      <Input
                        placeholder="Ex: \\servidor\impressora"
                        value={destinoImpressoras}
                        onChange={(e) => setDestinoImpressoras(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Comportamentos</CardTitle>
                  <CardDescription>
                    Configure comportamentos obrigatórios na tela de atendimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="exigir-dados"
                      checked={exigirDadosClinicos}
                      onCheckedChange={(checked) => setExigirDadosClinicos(!!checked)}
                    />
                    <Label htmlFor="exigir-dados" className="cursor-pointer">
                      Exigir Dados Clínicos no Atendimento
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="obrig-contato"
                      checked={obrigatoriedadeContato}
                      onCheckedChange={(checked) => setObrigatoriedadeContato(!!checked)}
                    />
                    <Label htmlFor="obrig-contato" className="cursor-pointer">
                      Obrigatoriedade de Contato do Paciente
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA IMPRESSÃO */}
            <TabsContent value="impressao" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Configurações de Impressoras</CardTitle>
                  <CardDescription>
                    Defina as impressoras e layouts para cada tipo de documento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Comprovante Coleta */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-sm">Comprovante de Coleta</h4>
                      <div className="space-y-2">
                        <Label className="text-sm">Impressora</Label>
                        <Select value={impressoraComprovante} onValueChange={setImpressoraComprovante}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a impressora" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="imp1">Impressora Recepção 01</SelectItem>
                            <SelectItem value="imp2">Impressora Recepção 02</SelectItem>
                            <SelectItem value="imp3">Impressora Laboratório</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Layout</Label>
                        <Input
                          placeholder="Arquivo de layout"
                          value={layoutComprovante}
                          onChange={(e) => setLayoutComprovante(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Orçamento */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-sm">Orçamento</h4>
                      <div className="space-y-2">
                        <Label className="text-sm">Impressora</Label>
                        <Select value={impressoraOrcamento} onValueChange={setImpressoraOrcamento}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a impressora" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="imp1">Impressora Recepção 01</SelectItem>
                            <SelectItem value="imp2">Impressora Recepção 02</SelectItem>
                            <SelectItem value="imp3">Impressora Laboratório</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Layout</Label>
                        <Input
                          placeholder="Arquivo de layout"
                          value={layoutOrcamento}
                          onChange={(e) => setLayoutOrcamento(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Etiquetas */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg md:col-span-2">
                      <h4 className="font-medium text-sm">Etiquetas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Impressora</Label>
                          <Select value={impressoraEtiquetas} onValueChange={setImpressoraEtiquetas}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a impressora" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zebra1">Zebra Etiquetas 01</SelectItem>
                              <SelectItem value="zebra2">Zebra Etiquetas 02</SelectItem>
                              <SelectItem value="argox">Argox Laboratório</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Arquivo de Layout das Etiquetas</Label>
                          <Input
                            placeholder="C:\Layouts\etiqueta.zpl"
                            value={layoutEtiquetas}
                            onChange={(e) => setLayoutEtiquetas(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opções de Impressão */}
                  <div className="pt-4 border-t border-border/50 space-y-4">
                    <h4 className="font-medium text-sm">Opções de Impressão</h4>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="imprimir-auto"
                          checked={imprimirAutomaticamente}
                          onCheckedChange={(checked) => setImprimirAutomaticamente(!!checked)}
                        />
                        <Label htmlFor="imprimir-auto" className="cursor-pointer">
                          Imprimir Automaticamente
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="imprimir-direto"
                          checked={imprimirDireto}
                          onCheckedChange={(checked) => setImprimirDireto(!!checked)}
                        />
                        <Label htmlFor="imprimir-direto" className="cursor-pointer">
                          Imprimir Direto sem Visualização
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Formulários Automáticos</CardTitle>
                  <CardDescription>
                    Selecione os formulários que devem ser gerados automaticamente após o atendimento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        id="form-comprovante"
                        checked={formComprovanteAtendimento}
                        onCheckedChange={(checked) => setFormComprovanteAtendimento(!!checked)}
                      />
                      <Label htmlFor="form-comprovante" className="cursor-pointer">
                        Comprovante de Atendimento
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        id="form-guias"
                        checked={formGuiasConvenios}
                        onCheckedChange={(checked) => setFormGuiasConvenios(!!checked)}
                      />
                      <Label htmlFor="form-guias" className="cursor-pointer">
                        Guias dos Convênios
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        id="form-etiquetas"
                        checked={formEtiquetas}
                        onCheckedChange={(checked) => setFormEtiquetas(!!checked)}
                      />
                      <Label htmlFor="form-etiquetas" className="cursor-pointer">
                        Etiquetas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        id="form-orcamento"
                        checked={formOrcamento}
                        onCheckedChange={(checked) => setFormOrcamento(!!checked)}
                      />
                      <Label htmlFor="form-orcamento" className="cursor-pointer">
                        Orçamento
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA TISS */}
            <TabsContent value="tiss" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Campos Padrão da Guia TISS</CardTitle>
                  <CardDescription>
                    Defina os valores padrão que serão aplicados em todas as guias TISS geradas. 
                    Esses valores podem ser alterados manualmente no atendimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Caráter da Solicitação</Label>
                      <Select value={caraterSolicitacao} onValueChange={setCaraterSolicitacao}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eletivo">Eletivo</SelectItem>
                          <SelectItem value="urgencia">Urgência/Emergência</SelectItem>
                          <SelectItem value="ambulatorial">Ambulatorial</SelectItem>
                          <SelectItem value="internacao">Internação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Indicação de Acidente</Label>
                      <Select value={indicacaoAcidente} onValueChange={setIndicacaoAcidente}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Acidente de Trabalho</SelectItem>
                          <SelectItem value="1">1 - Acidente de Trânsito</SelectItem>
                          <SelectItem value="2">2 - Outros Acidentes</SelectItem>
                          <SelectItem value="9">9 - Não Acidente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Tipo de Atendimento TISS</Label>
                      <Select value={tipoAtendimentoTISS} onValueChange={setTipoAtendimentoTISS}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01 - Remoção</SelectItem>
                          <SelectItem value="02">02 - Pequena Cirurgia</SelectItem>
                          <SelectItem value="03">03 - Terapias</SelectItem>
                          <SelectItem value="04">04 - Consulta</SelectItem>
                          <SelectItem value="05">05 - Exame</SelectItem>
                          <SelectItem value="06">06 - Atendimento Domiciliar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Tipo de Faturamento</Label>
                      <Select value={tipoFaturamento} onValueChange={setTipoFaturamento}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">01 - Por Evento</SelectItem>
                          <SelectItem value="02">02 - Por Pacote</SelectItem>
                          <SelectItem value="03">03 - Por Conta Aberta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm">Outros Campos TISS Obrigatórios</Label>
                      <Input
                        placeholder="Informações adicionais para a guia TISS"
                        value={outrosCamposTISS}
                        onChange={(e) => setOutrosCamposTISS(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium">Informação</p>
                      <p className="mt-1">
                        Esses campos são aplicados em todas as guias TISS geradas automaticamente. 
                        O operador pode alterar manualmente os valores durante o atendimento, se necessário.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA LAUDO INTERNET */}
            <TabsContent value="laudo" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Configurações de Laudo Internet</CardTitle>
                  <CardDescription>
                    Configure o armazenamento e envio de laudos via DataCenter.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm">Pasta de Laudos</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="C:\Laudos\Saude"
                        value={pastaLaudos}
                        onChange={(e) => setPastaLaudos(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {envioAutomatico && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-300">
                        <p className="font-medium">Envio Automático Ativo</p>
                        <p className="mt-1">
                          Esta estação está configurada para envio automático de laudos ao DataCenter.
                          Os laudos serão enviados automaticamente após a liberação.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-medium">Empresas DataCenter</CardTitle>
                      <CardDescription>
                        Gerencie os servidores DataCenter para envio de laudos.
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowAddEmpresa(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Nome da Empresa</TableHead>
                        <TableHead className="font-semibold">Servidor</TableHead>
                        <TableHead className="font-semibold">Chave Temporária</TableHead>
                        <TableHead className="font-semibold text-center w-24">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {empresas.map((empresa) => (
                        <TableRow key={empresa.id}>
                          <TableCell className="font-medium">{empresa.nome}</TableCell>
                          <TableCell className="text-muted-foreground">{empresa.servidor}</TableCell>
                          <TableCell>
                            <code className="px-2 py-1 bg-muted rounded text-xs">{empresa.chave}</code>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveEmpresa(empresa.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {empresas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            Nenhuma empresa DataCenter cadastrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Rodapé com Botões */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border/50">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>
              <Save className="h-4 w-4 mr-2" />
              Salvar (F7)
            </Button>
          </div>

          {/* Modal Adicionar Empresa */}
          <Dialog open={showAddEmpresa} onOpenChange={setShowAddEmpresa}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Empresa DataCenter</DialogTitle>
                <DialogDescription>
                  Informe os dados do servidor DataCenter para envio de laudos.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa *</Label>
                  <Input
                    placeholder="Ex: DataCenter Principal"
                    value={novaEmpresa.nome}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Servidor *</Label>
                  <Input
                    placeholder="Ex: dc.empresa.com.br"
                    value={novaEmpresa.servidor}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, servidor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chave Temporária</Label>
                  <Input
                    placeholder="Chave de acesso ao DataCenter"
                    value={novaEmpresa.chave}
                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, chave: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddEmpresa(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddEmpresa}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Configuracoes;

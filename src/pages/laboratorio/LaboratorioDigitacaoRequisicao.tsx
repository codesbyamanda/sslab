import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  MoreVertical,
  AlertTriangle,
  History,
  Ban,
  RotateCcw,
  Info,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Exame {
  id: string;
  codigo: string;
  nome: string;
  parametros: Parametro[];
  validado: boolean;
  liberado: boolean;
}

interface Parametro {
  id: string;
  nome: string;
  tipo: "numerico" | "texto" | "combo" | "multilinhas";
  valor: string;
  unidade?: string;
  referencia?: string;
  opcoes?: string[];
}

const mockExamesBioquimica: Exame[] = [
  {
    id: "1",
    codigo: "GLI",
    nome: "Glicose",
    validado: false,
    liberado: false,
    parametros: [
      { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "mg/dL", referencia: "70-99" },
    ],
  },
  {
    id: "2",
    codigo: "COL",
    nome: "Colesterol Total",
    validado: true,
    liberado: false,
    parametros: [
      { id: "1", nome: "Resultado", tipo: "numerico", valor: "185", unidade: "mg/dL", referencia: "<200" },
    ],
  },
  {
    id: "3",
    codigo: "TGO",
    nome: "TGO (AST)",
    validado: false,
    liberado: false,
    parametros: [
      { id: "1", nome: "Resultado", tipo: "numerico", valor: "", unidade: "U/L", referencia: "10-40" },
    ],
  },
];

const mockExamesHematologia: Exame[] = [
  {
    id: "4",
    codigo: "HEM",
    nome: "Hemograma Completo",
    validado: false,
    liberado: false,
    parametros: [
      { id: "1", nome: "Hemácias", tipo: "numerico", valor: "", unidade: "milhões/mm³", referencia: "4.5-5.5" },
      { id: "2", nome: "Hemoglobina", tipo: "numerico", valor: "", unidade: "g/dL", referencia: "12-16" },
      { id: "3", nome: "Hematócrito", tipo: "numerico", valor: "", unidade: "%", referencia: "36-46" },
      { id: "4", nome: "Leucócitos", tipo: "numerico", valor: "", unidade: "/mm³", referencia: "4000-11000" },
      { id: "5", nome: "Observações", tipo: "multilinhas", valor: "", opcoes: ["Anisocitose discreta", "Poiquilocitose discreta", "Sem alterações morfológicas"] },
    ],
  },
];

const LaboratorioDigitacaoRequisicao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("bioquimica");
  const [examesBioquimica, setExamesBioquimica] = useState(mockExamesBioquimica);
  const [examesHematologia, setExamesHematologia] = useState(mockExamesHematologia);
  const [repeticaoDialogOpen, setRepeticaoDialogOpen] = useState(false);
  const [repeticaoTipo, setRepeticaoTipo] = useState<"interna" | "externa">("interna");
  const [repeticaoMotivo, setRepeticaoMotivo] = useState("");
  const [selectedExameId, setSelectedExameId] = useState<string | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const handleParametroChange = (exameId: string, parametroId: string, valor: string, bancada: string) => {
    if (bancada === "bioquimica") {
      setExamesBioquimica((prev) =>
        prev.map((e) =>
          e.id === exameId
            ? {
                ...e,
                parametros: e.parametros.map((p) =>
                  p.id === parametroId ? { ...p, valor } : p
                ),
              }
            : e
        )
      );
    } else {
      setExamesHematologia((prev) =>
        prev.map((e) =>
          e.id === exameId
            ? {
                ...e,
                parametros: e.parametros.map((p) =>
                  p.id === parametroId ? { ...p, valor } : p
                ),
              }
            : e
        )
      );
    }
  };

  const handleValidar = (exameId: string, bancada: string) => {
    if (bancada === "bioquimica") {
      setExamesBioquimica((prev) =>
        prev.map((e) => (e.id === exameId ? { ...e, validado: true } : e))
      );
    } else {
      setExamesHematologia((prev) =>
        prev.map((e) => (e.id === exameId ? { ...e, validado: true } : e))
      );
    }
    toast.success("Parâmetro validado");
  };

  const handleLiberarAba = () => {
    toast.success("Exames da aba liberados com sucesso!");
  };

  const handleLiberarRequisicao = () => {
    toast.success("Todos os exames da requisição foram liberados!");
  };

  const handleRepeticao = () => {
    if (!repeticaoMotivo) {
      toast.error("Informe o motivo da repetição");
      return;
    }
    toast.success(
      repeticaoTipo === "externa"
        ? "Marcado para repetição externa. Nova amostra poderá ser recebida no Atendimento."
        : "Marcado para repetição interna."
    );
    setRepeticaoDialogOpen(false);
    setRepeticaoMotivo("");
  };

  const renderParametro = (exame: Exame, param: Parametro, bancada: string) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.altKey) {
        e.preventDefault();
        handleValidar(exame.id, bancada);
      }
    };

    switch (param.tipo) {
      case "numerico":
        return (
          <div className="flex items-center gap-2">
            <Input
              value={param.valor}
              onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
              onKeyDown={handleKeyDown}
              className="w-24 text-center"
              placeholder="0.00"
            />
            <span className="text-sm text-muted-foreground">{param.unidade}</span>
            <span className="text-xs text-muted-foreground/70">Ref: {param.referencia}</span>
          </div>
        );
      case "texto":
        return (
          <Input
            value={param.valor}
            onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
            onKeyDown={handleKeyDown}
            className="w-48"
          />
        );
      case "combo":
        return (
          <Select
            value={param.valor}
            onValueChange={(v) => handleParametroChange(exame.id, param.id, v, bancada)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {param.opcoes?.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multilinhas":
        return (
          <div className="w-full max-w-md">
            <Textarea
              value={param.valor}
              onChange={(e) => handleParametroChange(exame.id, param.id, e.target.value, bancada)}
              className="resize-none"
              rows={2}
              placeholder="CTRL+↓ para lista de respostas • ALT+Enter para confirmar"
            />
            {param.opcoes && (
              <div className="flex flex-wrap gap-1 mt-1">
                {param.opcoes.map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      const newVal = param.valor ? `${param.valor}\n${op}` : op;
                      handleParametroChange(exame.id, param.id, newVal, bancada);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    + {op}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderExame = (exame: Exame, bancada: string) => (
    <div
      key={exame.id}
      className={`border rounded-lg p-4 transition-colors ${
        exame.validado ? "bg-accent/5 border-accent/30" : "bg-card"
      } ${exame.liberado ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{exame.codigo}</span>
          <span className="font-medium">{exame.nome}</span>
          {exame.validado && (
            <Badge variant="outline" className="text-accent border-accent">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Validado
            </Badge>
          )}
          {exame.liberado && (
            <Badge className="bg-accent text-accent-foreground">
              Liberado
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.info("Abrindo para digitação...")}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Abrir para Digitação
              <span className="ml-auto text-xs text-muted-foreground">F4</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Marcado como executado")}>
              <Check className="h-4 w-4 mr-2" />
              Marcar Executado
              <span className="ml-auto text-xs text-muted-foreground">Alt+F2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Exame liberado!")}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Liberar Exame
              <span className="ml-auto text-xs text-muted-foreground">F2</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedExameId(exame.id);
                setRepeticaoDialogOpen(true);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Marcar para Repetição
              <span className="ml-auto text-xs text-muted-foreground">Alt+F3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.warning("Marcado como não executado")}>
              <Ban className="h-4 w-4 mr-2" />
              Não Executado
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+F4</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setHistoricoOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              Histórico de Resultados
              <span className="ml-auto text-xs text-muted-foreground">F3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Abrindo detalhes...")}>
              <Info className="h-4 w-4 mr-2" />
              Mostrar Dados do Exame
              <span className="ml-auto text-xs text-muted-foreground">Alt+F10</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        {exame.parametros.map((param) => (
          <div key={param.id} className="flex items-center gap-4">
            <Label className="w-32 text-sm text-muted-foreground">{param.nome}</Label>
            {renderParametro(exame, param, bancada)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <LaboratorioLayout title="Digitação/Liberação">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/laboratorio/digitacao-paciente")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Digitação/Liberação – Requisição</h1>
            <p className="text-muted-foreground mt-1">REQ-2024-045678</p>
          </div>
        </div>

        {/* Resumo do Paciente */}
        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium">Maria Silva Santos</p>
                  <p className="text-xs text-muted-foreground">45 anos • Feminino</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contato</p>
                  <p className="font-medium">(11) 99999-8888</p>
                  <p className="text-xs text-muted-foreground">(11) 3333-4444</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requisição</p>
                  <p className="font-medium">Unidade Central</p>
                  <p className="text-xs text-muted-foreground">Atendente: Carlos Silva</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo de Entrega</p>
                  <p className="font-medium text-warning">17/12/2024 14:00</p>
                  <p className="text-xs text-muted-foreground">Em 28 horas</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <FileText className="h-4 w-4 inline mr-1" />
                Observações/Dados clínicos: Paciente em jejum de 12h. Investigação de diabetes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info de atalhos */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm flex items-center gap-4 flex-wrap">
          <span className="font-medium">Atalhos:</span>
          <span className="text-muted-foreground">ENTER = Validar • TAB = Navegar • F2 = Liberar • F3 = Histórico • F4 = Reabrir</span>
        </div>

        {/* Abas por Bancada */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="bioquimica">Bioquímica (3)</TabsTrigger>
            <TabsTrigger value="hematologia">Hematologia (1)</TabsTrigger>
          </TabsList>

          <TabsContent value="bioquimica" className="mt-4 space-y-4">
            {examesBioquimica.map((exame) => renderExame(exame, "bioquimica"))}
          </TabsContent>

          <TabsContent value="hematologia" className="mt-4 space-y-4">
            {examesHematologia.map((exame) => renderExame(exame, "hematologia"))}
          </TabsContent>
        </Tabs>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleLiberarAba}>
            Liberar Exames da Aba
          </Button>
          <Button onClick={handleLiberarRequisicao} className="btn-primary-premium">
            Liberar Exames da Requisição
          </Button>
        </div>

        {/* Dialog Repetição */}
        <Dialog open={repeticaoDialogOpen} onOpenChange={setRepeticaoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Marcar para Repetição</DialogTitle>
              <DialogDescription>
                Selecione o tipo de repetição e informe o motivo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={repeticaoTipo} onValueChange={(v) => setRepeticaoTipo(v as "interna" | "externa")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interna" id="interna" />
                  <Label htmlFor="interna">Interna (mesma amostra)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="externa" id="externa" />
                  <Label htmlFor="externa">Externa (nova amostra)</Label>
                </div>
              </RadioGroup>
              {repeticaoTipo === "externa" && (
                <div className="bg-warning/10 text-warning text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    A repetição externa mudará o status para "repetição" e disponibilizará o exame para o Atendimento receber nova amostra.
                  </span>
                </div>
              )}
              <div>
                <Label>Motivo</Label>
                <Textarea
                  value={repeticaoMotivo}
                  onChange={(e) => setRepeticaoMotivo(e.target.value)}
                  placeholder="Informe o motivo da repetição..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRepeticaoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRepeticao}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Histórico */}
        <Dialog open={historicoOpen} onOpenChange={setHistoricoOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Histórico de Resultados</DialogTitle>
              <DialogDescription>Resultados anteriores do paciente para este exame.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">10/11/2024</span>
                <span className="font-medium">92 mg/dL</span>
                <Badge variant="outline">Normal</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm">15/08/2024</span>
                <span className="font-medium">105 mg/dL</span>
                <Badge variant="outline" className="text-warning border-warning">Alterado</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">20/05/2024</span>
                <span className="font-medium">88 mg/dL</span>
                <Badge variant="outline">Normal</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoricoOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioDigitacaoRequisicao;

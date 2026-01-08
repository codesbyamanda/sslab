import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Upload, Download, FolderOpen, Globe, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const parceiros = [
  { id: "1", nome: "Lab Apoio Central", tipoIntegracao: "API" },
  { id: "2", nome: "Lab Análises Clínicas", tipoIntegracao: "Arquivo" },
  { id: "3", nome: "Clínica São Paulo", tipoIntegracao: "API" },
  { id: "4", nome: "Hospital Regional", tipoIntegracao: "Arquivo" },
  { id: "5", nome: "Lab Especializado", tipoIntegracao: "API" }
];

const lotesExistentes = [
  { id: "1", codigo: "LT-2026-0145", data: "02/01/2026", itens: 15 },
  { id: "2", codigo: "LT-2026-0144", data: "02/01/2026", itens: 8 },
  { id: "3", codigo: "LT-2026-0143", data: "01/01/2026", itens: 22 }
];

const ProcessarTransferencia = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNovoLote = searchParams.get("novoLote") === "true";
  
  const [parceiro, setParceiro] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState("exportar");
  const [tipoDados, setTipoDados] = useState("");
  const [tipoLote, setTipoLote] = useState(isNovoLote ? "novo" : "novo");
  const [loteExistente, setLoteExistente] = useState("");
  const [usarApi, setUsarApi] = useState(true);
  const [pastaOrigem, setPastaOrigem] = useState("");
  const [pastaDestino, setPastaDestino] = useState("");
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [loteGerado, setLoteGerado] = useState<string | null>(null);
  const [resumo, setResumo] = useState<{
    exportados: number;
    importados: number;
    processados: number;
    erros: number;
  } | null>(null);

  useEffect(() => {
    if (isNovoLote) {
      setTipoLote("novo");
    }
  }, [isNovoLote]);

  const parceiroSelecionado = parceiros.find(p => p.id === parceiro);

  const handleProcessar = () => {
    if (!parceiro || !tipoDados) {
      toast.error("Selecione o parceiro e o tipo de dados");
      return;
    }

    setProcessando(true);
    setProgresso(0);
    setResumo(null);

    // Simula processamento
    const novoLoteId = `LT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessando(false);
          setLoteGerado(novoLoteId);
          setResumo({
            exportados: tipoOperacao === "exportar" ? 15 : 0,
            importados: tipoOperacao === "importar" ? 12 : 0,
            processados: tipoOperacao === "exportar" ? 15 : 12,
            erros: 2
          });
          toast.success("Processamento concluído!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCancelar = () => {
    setProcessando(false);
    setProgresso(0);
    toast.info("Processamento cancelado");
  };

  return (
    <TransferenciaLayout title="Processar Transferência">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/transferencia")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <RefreshCw className="h-6 w-6" />
              Processar Transferência
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Execute integrações com laboratórios parceiros
            </p>
          </div>
        </div>

        {/* Seleção de Parceiro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parceiro</CardTitle>
            <CardDescription>Selecione o laboratório parceiro para a integração</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Parceiro</Label>
              <Select value={parceiro} onValueChange={setParceiro}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o parceiro" />
                </SelectTrigger>
                <SelectContent>
                  {parceiros.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} ({p.tipoIntegracao})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tipo de Operação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipo de Operação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              value={tipoOperacao} 
              onValueChange={setTipoOperacao}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exportar" id="exportar" />
                <Label htmlFor="exportar" className="font-normal cursor-pointer flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  Exportar
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="importar" id="importar" />
                <Label htmlFor="importar" className="font-normal cursor-pointer flex items-center gap-2">
                  <Download className="h-4 w-4 text-purple-600" />
                  Importar
                </Label>
              </div>
            </RadioGroup>

            <Separator />

            <div className="space-y-2">
              <Label>Tipo de Dados</Label>
              <Select value={tipoDados} onValueChange={setTipoDados}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de dados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requisicoes">Requisições</SelectItem>
                  <SelectItem value="amostras">Amostras</SelectItem>
                  <SelectItem value="laudos">Laudos</SelectItem>
                  <SelectItem value="valores_referencia">Valores de Referência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input type="date" defaultValue="2026-01-01" />
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input type="date" defaultValue="2026-01-02" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lote */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lote de Transferência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              value={tipoLote} 
              onValueChange={setTipoLote}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="novo" id="novo" />
                <Label htmlFor="novo" className="font-normal cursor-pointer">
                  Criar novo lote
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existente" id="existente" />
                <Label htmlFor="existente" className="font-normal cursor-pointer">
                  Usar lote existente
                </Label>
              </div>
            </RadioGroup>

            {tipoLote === "existente" && (
              <div className="space-y-2">
                <Label>Selecione o Lote</Label>
                <Select value={loteExistente} onValueChange={setLoteExistente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um lote" />
                  </SelectTrigger>
                  <SelectContent>
                    {lotesExistentes.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.codigo} - {l.data} ({l.itens} itens)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Método de Integração */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Método de Integração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {parceiroSelecionado?.tipoIntegracao === "API" && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">Integração via API</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar integração automática via API (recomendado)
                    </p>
                  </div>
                </div>
                <Switch checked={usarApi} onCheckedChange={setUsarApi} />
              </div>
            )}

            {(!usarApi || parceiroSelecionado?.tipoIntegracao === "Arquivo") && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-sm">Configuração de Pastas</span>
                </div>
                
                {tipoOperacao === "exportar" ? (
                  <div className="space-y-2">
                    <Label>Pasta de Destino</Label>
                    <Input 
                      placeholder="C:\Transferencias\Exportacao" 
                      value={pastaDestino}
                      onChange={(e) => setPastaDestino(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Pasta de Origem</Label>
                    <Input 
                      placeholder="C:\Transferencias\Importacao" 
                      value={pastaOrigem}
                      onChange={(e) => setPastaOrigem(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo em Tempo Real */}
        {(processando || resumo) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo do Processamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {processando && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processando...</span>
                    <span>{progresso}%</span>
                  </div>
                  <Progress value={progresso} />
                </div>
              )}

              {resumo && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <Upload className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-600">{resumo.exportados}</p>
                    <p className="text-xs text-muted-foreground">Exportados</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <Download className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-purple-600">{resumo.importados}</p>
                    <p className="text-xs text-muted-foreground">Importados</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <CheckCircle className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
                    <p className="text-2xl font-bold text-emerald-600">{resumo.processados}</p>
                    <p className="text-xs text-muted-foreground">Processados</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <XCircle className="h-5 w-5 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">{resumo.erros}</p>
                    <p className="text-xs text-muted-foreground">Erros</p>
                  </div>
                </div>
              )}

              {resumo && resumo.erros > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Foram encontrados {resumo.erros} erros durante o processamento. Verifique o lote para mais detalhes.</span>
                </div>
              )}

              {loteGerado && (
                <div className="flex justify-end">
                  <Button onClick={() => navigate(`/transferencia/lotes/1`)}>
                    Visualizar Lote {loteGerado}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={processando ? handleCancelar : () => navigate("/transferencia")}
          >
            {processando ? "Cancelar" : "Voltar"}
          </Button>
          <Button 
            onClick={handleProcessar} 
            disabled={processando || !parceiro || !tipoDados}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${processando ? 'animate-spin' : ''}`} />
            {processando ? "Processando..." : "Confirmar Processamento"}
          </Button>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default ProcessarTransferencia;

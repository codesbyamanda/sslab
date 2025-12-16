import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Files, Filter, Play, FileCheck, Printer, Cloud, X } from "lucide-react";
import { toast } from "sonner";

const LaboratorioGerarLaudosLote = () => {
  const [dataInicialEntrega, setDataInicialEntrega] = useState("");
  const [dataFinalEntrega, setDataFinalEntrega] = useState("");
  const [unidade, setUnidade] = useState("");
  const [convenio, setConvenio] = useState("");
  const [plano, setPlano] = useState("");
  const [requisitante, setRequisitante] = useState("");

  const [laudosProntos, setLaudosProntos] = useState(true);
  const [imprimir, setImprimir] = useState(false);
  const [enviarDataCenter, setEnviarDataCenter] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    laudosAGerar: 42,
    laudosProntos: 38,
    laudosGerados: 0,
    laudosNaoGerados: 0,
    impressos: 0,
    enviadosDataCenter: 0,
  });

  const handleGerar = () => {
    if (!dataInicialEntrega || !dataFinalEntrega) {
      toast.error("Preencha as datas de entrega");
      return;
    }

    setIsGenerating(true);
    
    // Simular geração
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        laudosGerados: prev.laudosProntos,
        laudosNaoGerados: 4,
        impressos: imprimir ? prev.laudosProntos : 0,
        enviadosDataCenter: enviarDataCenter ? prev.laudosProntos : 0,
      }));
      setIsGenerating(false);
      toast.success("Laudos gerados com sucesso!");
    }, 2000);
  };

  return (
    <LaboratorioLayout title="Gerar Laudos Lote">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerar Laudos em Lote</h1>
          <p className="text-muted-foreground mt-1">
            Emissão de laudos em lote por período de entrega.
          </p>
        </div>

        {/* Filtros */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="dataInicialEntrega">Data Inicial Entrega *</Label>
                <Input
                  id="dataInicialEntrega"
                  type="date"
                  value={dataInicialEntrega}
                  onChange={(e) => setDataInicialEntrega(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dataFinalEntrega">Data Final Entrega *</Label>
                <Input
                  id="dataFinalEntrega"
                  type="date"
                  value={dataFinalEntrega}
                  onChange={(e) => setDataFinalEntrega(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="central">Unidade Central</SelectItem>
                    <SelectItem value="norte">Unidade Norte</SelectItem>
                    <SelectItem value="sul">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Convênio</Label>
                <Select value={convenio} onValueChange={setConvenio}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plano</Label>
                <Select value={plano} onValueChange={setPlano}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="completo">Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Requisitante</Label>
                <Select value={requisitante} onValueChange={setRequisitante}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="dr-carlos">Dr. Carlos Silva</SelectItem>
                    <SelectItem value="dra-ana">Dra. Ana Souza</SelectItem>
                    <SelectItem value="dr-pedro">Dr. Pedro Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="ghost">Limpar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Opções */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Opções de Geração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="laudosProntos"
                  checked={laudosProntos}
                  onCheckedChange={(checked) => setLaudosProntos(checked as boolean)}
                />
                <Label htmlFor="laudosProntos" className="text-sm font-normal cursor-pointer">
                  Laudos Prontos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="imprimir"
                  checked={imprimir}
                  onCheckedChange={(checked) => setImprimir(checked as boolean)}
                />
                <Label htmlFor="imprimir" className="text-sm font-normal cursor-pointer">
                  Imprimir
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enviarDataCenter"
                  checked={enviarDataCenter}
                  onCheckedChange={(checked) => setEnviarDataCenter(checked as boolean)}
                />
                <Label htmlFor="enviarDataCenter" className="text-sm font-normal cursor-pointer">
                  Enviar Data Center
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contadores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Files className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.laudosAGerar}</p>
              <p className="text-xs text-muted-foreground">Laudos a Gerar</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.laudosProntos}</p>
              <p className="text-xs text-muted-foreground">Laudos Prontos</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <FileCheck className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{stats.laudosGerados}</p>
              <p className="text-xs text-muted-foreground">Laudos Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <X className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">{stats.laudosNaoGerados}</p>
              <p className="text-xs text-muted-foreground">Não Gerados</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Printer className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.impressos}</p>
              <p className="text-xs text-muted-foreground">Impressos</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <Cloud className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.enviadosDataCenter}</p>
              <p className="text-xs text-muted-foreground">Enviados DC</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">
            Fechar
          </Button>
          <Button onClick={handleGerar} disabled={isGenerating} className="btn-primary-premium">
            <Play className="h-4 w-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar"}
          </Button>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioGerarLaudosLote;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Eye, Tag, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";

interface Amostra {
  id: string;
  amostra: string;
  material: string;
  recipiente: string;
  complemento: string;
  dataHoraColeta: string;
}

interface Guia {
  id: string;
  convenio: string;
  numeroGuia: string;
  itens: string[];
}

const mockAmostras: Amostra[] = [
  {
    id: "1",
    amostra: "001-2024",
    material: "Sangue Total EDTA",
    recipiente: "Tubo EDTA 4mL",
    complemento: "Jejum 12h",
    dataHoraColeta: "2024-01-15 08:30",
  },
  {
    id: "2",
    amostra: "002-2024",
    material: "Soro",
    recipiente: "Tubo Seco 5mL",
    complemento: "",
    dataHoraColeta: "2024-01-15 08:32",
  },
  {
    id: "3",
    amostra: "003-2024",
    material: "Sangue Total Fluoreto",
    recipiente: "Tubo Fluoreto 2mL",
    complemento: "Glicemia",
    dataHoraColeta: "2024-01-15 08:35",
  },
];

const mockAmostrasParceiros: Amostra[] = [
  {
    id: "4",
    amostra: "LAB-001",
    material: "Soro",
    recipiente: "Tubo Seco 10mL",
    complemento: "Envio Lab Externo",
    dataHoraColeta: "2024-01-15 09:00",
  },
];

const mockGuias: Guia[] = [
  {
    id: "1",
    convenio: "Unimed",
    numeroGuia: "GUI-2024-0001",
    itens: ["Hemograma Completo", "Glicemia de Jejum", "Colesterol Total"],
  },
  {
    id: "2",
    convenio: "Bradesco Saúde",
    numeroGuia: "GUI-2024-0002",
    itens: ["TSH", "T4 Livre"],
  },
];

const ImpressoesAtendimento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAmostras, setSelectedAmostras] = useState<string[]>([]);
  const [selectedGuias, setSelectedGuias] = useState<string[]>([]);
  const [printComprovante, setPrintComprovante] = useState(false);

  // Mock data
  const requisicao = {
    numero: `REQ-2024-00${id}`,
    paciente: "Maria Silva Santos",
    dataAtendimento: "15/01/2024",
  };

  const handleToggleAmostra = (amostraId: string) => {
    setSelectedAmostras((prev) =>
      prev.includes(amostraId)
        ? prev.filter((id) => id !== amostraId)
        : [...prev, amostraId]
    );
  };

  const handleToggleGuia = (guiaId: string) => {
    setSelectedGuias((prev) =>
      prev.includes(guiaId)
        ? prev.filter((id) => id !== guiaId)
        : [...prev, guiaId]
    );
  };

  const handleSelectAllAmostras = (amostras: Amostra[]) => {
    const ids = amostras.map((a) => a.id);
    const allSelected = ids.every((id) => selectedAmostras.includes(id));
    if (allSelected) {
      setSelectedAmostras((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedAmostras((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleVisualizarPDF = () => {
    const hasSelection =
      selectedAmostras.length > 0 || selectedGuias.length > 0 || printComprovante;
    if (!hasSelection) {
      toast.error("Selecione ao menos um item para visualizar");
      return;
    }
    toast.success("Abrindo visualização...");
  };

  const handleImprimir = () => {
    const hasSelection =
      selectedAmostras.length > 0 || selectedGuias.length > 0 || printComprovante;
    if (!hasSelection) {
      toast.error("Selecione ao menos um item para imprimir");
      return;
    }
    const total =
      selectedAmostras.length + selectedGuias.length + (printComprovante ? 1 : 0);
    toast.success(`Imprimindo ${total} item(s)...`);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-services">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/atendimento/atendimentos")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-4 animate-fade-in"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Atendimentos</span>
          </button>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Printer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Impressões do Atendimento
                </h1>
                <p className="text-sm text-muted-foreground">
                  Imprima etiquetas, guias e comprovantes da requisição
                </p>
              </div>
            </div>
          </div>

          {/* Informações da Requisição */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nº Requisição
                  </label>
                  <p className="font-mono text-sm font-medium text-primary">
                    {requisicao.numero}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Paciente
                  </label>
                  <p className="font-medium text-foreground">{requisicao.paciente}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Data Atendimento
                  </label>
                  <p className="text-foreground">{requisicao.dataAtendimento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção Etiquetas */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Etiquetas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="amostras" className="w-full">
                <div className="px-6 border-b">
                  <TabsList className="h-10 bg-transparent p-0 gap-4">
                    <TabsTrigger
                      value="amostras"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                    >
                      Amostras ({mockAmostras.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="parceiros"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                    >
                      Amostras Parceiros ({mockAmostrasParceiros.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="amostras" className="mt-0">
                  <div className="p-4 border-b bg-muted/20">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllAmostras(mockAmostras)}
                    >
                      {mockAmostras.every((a) => selectedAmostras.includes(a.id))
                        ? "Desmarcar Todas"
                        : "Selecionar Todas"}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-12" />
                        <TableHead className="font-semibold">Amostra</TableHead>
                        <TableHead className="font-semibold">Material</TableHead>
                        <TableHead className="font-semibold">Recipiente</TableHead>
                        <TableHead className="font-semibold">Complemento</TableHead>
                        <TableHead className="font-semibold">Data/Hora Coleta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAmostras.map((amostra) => (
                        <TableRow
                          key={amostra.id}
                          className={`cursor-pointer transition-colors ${
                            selectedAmostras.includes(amostra.id)
                              ? "bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleToggleAmostra(amostra.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedAmostras.includes(amostra.id)}
                              onCheckedChange={() => handleToggleAmostra(amostra.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono font-medium text-primary">
                            {amostra.amostra}
                          </TableCell>
                          <TableCell>{amostra.material}</TableCell>
                          <TableCell>{amostra.recipiente}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {amostra.complemento || "-"}
                          </TableCell>
                          <TableCell>
                            {new Date(amostra.dataHoraColeta).toLocaleString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="parceiros" className="mt-0">
                  <div className="p-4 border-b bg-muted/20">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllAmostras(mockAmostrasParceiros)}
                    >
                      {mockAmostrasParceiros.every((a) =>
                        selectedAmostras.includes(a.id)
                      )
                        ? "Desmarcar Todas"
                        : "Selecionar Todas"}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-12" />
                        <TableHead className="font-semibold">Amostra</TableHead>
                        <TableHead className="font-semibold">Material</TableHead>
                        <TableHead className="font-semibold">Recipiente</TableHead>
                        <TableHead className="font-semibold">Complemento</TableHead>
                        <TableHead className="font-semibold">Data/Hora Coleta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAmostrasParceiros.map((amostra) => (
                        <TableRow
                          key={amostra.id}
                          className={`cursor-pointer transition-colors ${
                            selectedAmostras.includes(amostra.id)
                              ? "bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleToggleAmostra(amostra.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedAmostras.includes(amostra.id)}
                              onCheckedChange={() => handleToggleAmostra(amostra.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono font-medium text-primary">
                            {amostra.amostra}
                          </TableCell>
                          <TableCell>{amostra.material}</TableCell>
                          <TableCell>{amostra.recipiente}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {amostra.complemento || "-"}
                          </TableCell>
                          <TableCell>
                            {new Date(amostra.dataHoraColeta).toLocaleString("pt-BR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Seção Guias */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Guias</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-12" />
                    <TableHead className="font-semibold">Convênio</TableHead>
                    <TableHead className="font-semibold">Nº Guia</TableHead>
                    <TableHead className="font-semibold">Itens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGuias.map((guia) => (
                    <TableRow
                      key={guia.id}
                      className={`cursor-pointer transition-colors ${
                        selectedGuias.includes(guia.id)
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleToggleGuia(guia.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedGuias.includes(guia.id)}
                          onCheckedChange={() => handleToggleGuia(guia.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{guia.convenio}</TableCell>
                      <TableCell className="font-mono text-primary">
                        {guia.numeroGuia}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {guia.itens.slice(0, 2).map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                          {guia.itens.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{guia.itens.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Seção Comprovante */}
          <Card className="mb-6 card-elevated animate-fade-in">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="comprovante"
                  checked={printComprovante}
                  onCheckedChange={(checked) => setPrintComprovante(!!checked)}
                />
                <label
                  htmlFor="comprovante"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Imprimir comprovante de coleta</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => navigate("/atendimento/atendimentos")}
            >
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={handleVisualizarPDF}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Visualizar PDF
            </Button>
            <Button onClick={handleImprimir} className="btn-primary-premium gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Selecionados
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImpressoesAtendimento;

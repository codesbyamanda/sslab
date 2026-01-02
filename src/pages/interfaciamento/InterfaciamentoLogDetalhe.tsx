import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronRight, 
  Home, 
  ArrowLeft,
  FileText,
  Monitor,
  Cable,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy
} from "lucide-react";
import { toast } from "sonner";

const logDetalhe = {
  id: 1,
  dataHora: "02/01/2026 14:32:45",
  equipamento: "Analisador Hematológico XN-1000",
  protocolo: "ASTM E1381",
  tipo: "Recebimento",
  resultado: "sucesso",
  tempoResposta: "120ms",
  mensagemCompleta: `H|\\^&|||XN-1000^Sysmex^Host||||||LIS2-A2||P|1|20260102143245
P|1||12345||Silva^Maria||19850315|F|||||||||||||||||||
O|1|202601020001||^^^HMG||20260102||||||||Serum||||||||||F
R|1|^^^WBC^XN-1000|7.5|10^3/uL||N||F||||20260102143200
R|2|^^^RBC^XN-1000|4.52|10^6/uL||N||F||||20260102143200
R|3|^^^HGB^XN-1000|13.8|g/dL||N||F||||20260102143200
R|4|^^^HCT^XN-1000|41.2|%||N||F||||20260102143200
R|5|^^^MCV^XN-1000|91.2|fL||N||F||||20260102143200
R|6|^^^MCH^XN-1000|30.5|pg||N||F||||20260102143200
R|7|^^^MCHC^XN-1000|33.5|g/dL||N||F||||20260102143200
R|8|^^^PLT^XN-1000|245|10^3/uL||N||F||||20260102143200
L|1|N`,
  interpretacao: {
    paciente: "Maria Silva",
    numeroRequisicao: "202601020001",
    exame: "Hemograma Completo (HMG)",
    resultados: [
      { parametro: "WBC (Leucócitos)", valor: "7.5", unidade: "10³/µL", referencia: "4.0 - 11.0" },
      { parametro: "RBC (Hemácias)", valor: "4.52", unidade: "10⁶/µL", referencia: "4.0 - 5.5" },
      { parametro: "HGB (Hemoglobina)", valor: "13.8", unidade: "g/dL", referencia: "12.0 - 16.0" },
      { parametro: "HCT (Hematócrito)", valor: "41.2", unidade: "%", referencia: "36.0 - 46.0" },
      { parametro: "MCV (VCM)", valor: "91.2", unidade: "fL", referencia: "80.0 - 100.0" },
      { parametro: "MCH (HCM)", valor: "30.5", unidade: "pg", referencia: "27.0 - 33.0" },
      { parametro: "MCHC (CHCM)", valor: "33.5", unidade: "g/dL", referencia: "32.0 - 36.0" },
      { parametro: "PLT (Plaquetas)", valor: "245", unidade: "10³/µL", referencia: "150 - 400" },
    ]
  },
  errosIdentificados: []
};

export default function InterfaciamentoLogDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const copiarMensagem = () => {
    navigator.clipboard.writeText(logDetalhe.mensagemCompleta);
    toast.success("Mensagem copiada para a área de transferência");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/interfaciamento/logs" className="hover:text-foreground">
          Logs de Comunicação
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Detalhes do Log #{id}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Detalhes do Log</h1>
          <p className="text-muted-foreground mt-1">
            Visualização completa da mensagem de comunicação
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/interfaciamento/logs")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Data/Hora</p>
                <p className="font-medium">{logDetalhe.dataHora}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Equipamento</p>
                <p className="font-medium text-sm">{logDetalhe.equipamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cable className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Protocolo</p>
                <p className="font-medium">{logDetalhe.protocolo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {logDetalhe.resultado === "sucesso" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : logDetalhe.resultado === "erro" ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Resultado</p>
                <Badge 
                  className={
                    logDetalhe.resultado === "sucesso" 
                      ? "bg-green-100 text-green-700" 
                      : logDetalhe.resultado === "erro"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {logDetalhe.resultado === "sucesso" ? "Sucesso" : 
                   logDetalhe.resultado === "erro" ? "Erro" : "Aviso"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mensagem Completa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mensagem Completa
            </CardTitle>
            <Button variant="outline" size="sm" onClick={copiarMensagem}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {logDetalhe.mensagemCompleta}
            </pre>
          </CardContent>
        </Card>

        {/* Interpretação do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interpretação do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Paciente</p>
                <p className="font-medium">{logDetalhe.interpretacao.paciente}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nº Requisição</p>
                <p className="font-medium">{logDetalhe.interpretacao.numeroRequisicao}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Exame</p>
                <p className="font-medium">{logDetalhe.interpretacao.exame}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Resultados Interpretados</p>
              <div className="space-y-2">
                {logDetalhe.interpretacao.resultados.map((resultado, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded"
                  >
                    <span className="text-sm">{resultado.parametro}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-medium">
                        {resultado.valor} {resultado.unidade}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({resultado.referencia})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Erros Identificados */}
      {logDetalhe.errosIdentificados.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Erros Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {logDetalhe.errosIdentificados.map((erro, index) => (
                <li key={index} className="text-red-700">{erro}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

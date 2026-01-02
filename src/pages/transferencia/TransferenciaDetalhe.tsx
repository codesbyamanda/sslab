import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, MapPin, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const transferencia = {
  id: "1",
  paciente: {
    nome: "Maria Silva Santos",
    documento: "123.456.789-00",
    dataNascimento: "15/03/1985",
    telefone: "(11) 98765-4321",
    atendimento: "ATD-2026-00145"
  },
  tipo: "Interna",
  origem: "UTI Adulto",
  destino: "Enfermaria 3",
  dataEmissao: "02/01/2026",
  horaEmissao: "14:30",
  dataEfetivacao: "02/01/2026",
  horaEfetivacao: "15:45",
  situacao: "Concluída",
  prontuario: "Completo",
  documentos: [
    { nome: "Prontuário Médico", incluido: true },
    { nome: "Resultados de Exames", incluido: true },
    { nome: "Prescrições Médicas", incluido: true },
    { nome: "Evolução de Enfermagem", incluido: true },
    { nome: "Laudos de Imagem", incluido: false }
  ],
  observacoes: "Paciente estável, transferência realizada por necessidade de leito na UTI. Acompanhada por familiar.",
  responsavel: "Dr. Carlos Eduardo",
  historico: [
    {
      data: "02/01/2026 14:30",
      usuario: "Maria Enfermeira",
      acao: "Transferência solicitada",
      detalhes: "Origem: UTI Adulto → Destino: Enfermaria 3"
    },
    {
      data: "02/01/2026 14:45",
      usuario: "Dr. Carlos Eduardo",
      acao: "Transferência aprovada",
      detalhes: "Autorização médica concedida"
    },
    {
      data: "02/01/2026 15:30",
      usuario: "João Técnico",
      acao: "Transporte iniciado",
      detalhes: "Paciente em transporte com equipe"
    },
    {
      data: "02/01/2026 15:45",
      usuario: "Ana Paula Enfermeira",
      acao: "Transferência concluída",
      detalhes: "Paciente recebida na Enfermaria 3"
    }
  ]
};

const getSituacaoBadge = (situacao: string) => {
  switch (situacao) {
    case "Concluída":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Concluída</Badge>;
    case "Pendente":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>;
    case "Em andamento":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Em andamento</Badge>;
    case "Cancelada":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelada</Badge>;
    default:
      return <Badge variant="secondary">{situacao}</Badge>;
  }
};

const TransferenciaDetalhe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const canEdit = transferencia.situacao !== "Concluída" && transferencia.situacao !== "Cancelada";
  const canCancel = transferencia.situacao === "Pendente" || transferencia.situacao === "Em andamento";
  const canConclude = transferencia.situacao === "Em andamento";

  return (
    <TransferenciaLayout title="Detalhes da Transferência">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/transferencia/lista")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Transferência #{id}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {transferencia.dataEmissao} às {transferencia.horaEmissao}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getSituacaoBadge(transferencia.situacao)}
            {canEdit && (
              <Button variant="outline" onClick={() => navigate(`/transferencia/${id}/editar`)}>
                Editar
              </Button>
            )}
            {canConclude && (
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Concluir
              </Button>
            )}
            {canCancel && (
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{transferencia.paciente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documento</p>
                    <p className="font-medium">{transferencia.paciente.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{transferencia.paciente.dataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{transferencia.paciente.telefone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Atendimento Vinculado</p>
                    <p className="font-medium text-primary">{transferencia.paciente.atendimento}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dados da Transferência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <Badge variant="outline" className="mt-1">
                      {transferencia.tipo}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium">{transferencia.responsavel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origem</p>
                    <p className="font-medium">{transferencia.origem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destino</p>
                    <p className="font-medium">{transferencia.destino}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data/Hora Solicitação</p>
                    <p className="font-medium">{transferencia.dataEmissao} {transferencia.horaEmissao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data/Hora Efetivação</p>
                    <p className="font-medium">
                      {transferencia.dataEfetivacao ? `${transferencia.dataEfetivacao} ${transferencia.horaEfetivacao}` : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prontuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Tipo de Transferência</p>
                  <Badge variant="outline" className="mt-1">{transferencia.prontuario}</Badge>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground mb-3">Documentos Incluídos</p>
                <div className="space-y-2">
                  {transferencia.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {doc.incluido ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={doc.incluido ? "text-foreground" : "text-muted-foreground"}>
                        {doc.nome}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {transferencia.observacoes || "Nenhuma observação registrada."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transferencia.historico.map((item, index) => (
                    <div key={index} className="relative pl-6 pb-4 last:pb-0">
                      {index !== transferencia.historico.length - 1 && (
                        <div className="absolute left-[9px] top-6 bottom-0 w-[2px] bg-border" />
                      )}
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.data}</p>
                        <p className="font-medium text-sm">{item.acao}</p>
                        <p className="text-xs text-muted-foreground">{item.usuario}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.detalhes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaDetalhe;

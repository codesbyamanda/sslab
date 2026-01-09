import { useParams, useNavigate } from "react-router-dom";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
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
import { ArrowLeft, Package, FlaskConical, AlertTriangle } from "lucide-react";

interface AmostraLote {
  id: string;
  numeroAmostra: string;
  numeroRequisicao: string;
  paciente: string;
  material: string;
  exameServico: string;
  situacao: "pendente" | "em_analise" | "concluido";
  urgente: boolean;
  dataHoraColeta: string;
}

const mockLoteData = {
  id: "1",
  numeroLote: "L-2024-001234",
  dataHora: "16/12/2024 08:30",
  unidade: "Unidade Central",
  setorBancada: "Bioquímica / Bancada 01",
  qtdAmostras: 45,
  status: "em_transicao" as const,
};

const mockAmostras: AmostraLote[] = [
  { id: "1", numeroAmostra: "A-001234-01", numeroRequisicao: "REQ-2024-005678", paciente: "Maria Silva Santos", material: "Sangue Total", exameServico: "Hemograma Completo", situacao: "em_analise", urgente: true, dataHoraColeta: "16/12/2024 07:45" },
  { id: "2", numeroAmostra: "A-001234-02", numeroRequisicao: "REQ-2024-005678", paciente: "Maria Silva Santos", material: "Soro", exameServico: "Glicose", situacao: "concluido", urgente: false, dataHoraColeta: "16/12/2024 07:45" },
  { id: "3", numeroAmostra: "A-001234-03", numeroRequisicao: "REQ-2024-005679", paciente: "João Carlos Oliveira", material: "Sangue Total", exameServico: "Hemograma Completo", situacao: "em_analise", urgente: false, dataHoraColeta: "16/12/2024 07:50" },
  { id: "4", numeroAmostra: "A-001234-04", numeroRequisicao: "REQ-2024-005679", paciente: "João Carlos Oliveira", material: "Urina", exameServico: "EAS", situacao: "pendente", urgente: false, dataHoraColeta: "16/12/2024 07:52" },
  { id: "5", numeroAmostra: "A-001234-05", numeroRequisicao: "REQ-2024-005680", paciente: "Ana Paula Ferreira", material: "Soro", exameServico: "TSH", situacao: "em_analise", urgente: true, dataHoraColeta: "16/12/2024 08:00" },
  { id: "6", numeroAmostra: "A-001234-06", numeroRequisicao: "REQ-2024-005680", paciente: "Ana Paula Ferreira", material: "Soro", exameServico: "T4 Livre", situacao: "em_analise", urgente: true, dataHoraColeta: "16/12/2024 08:00" },
  { id: "7", numeroAmostra: "A-001234-07", numeroRequisicao: "REQ-2024-005681", paciente: "Carlos Eduardo Lima", material: "Sangue Total", exameServico: "Coagulograma", situacao: "concluido", urgente: false, dataHoraColeta: "16/12/2024 08:10" },
  { id: "8", numeroAmostra: "A-001234-08", numeroRequisicao: "REQ-2024-005682", paciente: "Fernanda Costa Souza", material: "Fezes", exameServico: "Parasitológico", situacao: "pendente", urgente: false, dataHoraColeta: "16/12/2024 08:15" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  aberto: { label: "Aberto", className: "badge-success" },
  em_transicao: { label: "Em Transição", className: "badge-warning" },
  fechado: { label: "Fechado", className: "badge-neutral" },
};

const situacaoConfig = {
  pendente: { label: "Pendente", className: "badge-warning" },
  em_analise: { label: "Em Análise", className: "badge-neutral" },
  concluido: { label: "Concluído", className: "badge-success" },
};

const LaboratorioLoteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const lote = mockLoteData;
  const amostras = mockAmostras;

  const statusBadge = statusConfig[lote.status];

  return (
    <LaboratorioLayout title="Lote de Amostras">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/laboratorio/lotes-amostras")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Lote de Amostras</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
              <span className="font-mono font-medium text-foreground">{lote.numeroLote}</span>
              <span>•</span>
              <span>{lote.dataHora}</span>
              <span>•</span>
              <span>{lote.unidade}</span>
              <span>•</span>
              <span>{lote.setorBancada}</span>
              <span>•</span>
              <span className={statusBadge.className}>{statusBadge.label}</span>
            </div>
          </div>
        </div>

        {/* Informações do Lote */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Informações do Lote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nº do Lote</p>
                <p className="font-mono font-medium text-foreground">{lote.numeroLote}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Data/Hora Criação</p>
                <p className="font-medium text-foreground">{lote.dataHora}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Unidade</p>
                <p className="font-medium text-foreground">{lote.unidade}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Setor/Bancada</p>
                <p className="font-medium text-foreground">{lote.setorBancada}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                <span className={statusBadge.className}>{statusBadge.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total de Amostras</p>
                <p className="font-medium text-foreground">{lote.qtdAmostras}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Amostras */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Amostras do Lote
              </CardTitle>
              <span className="text-sm text-muted-foreground">{amostras.length} amostras</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Amostra</TableHead>
                  <TableHead>Nº Requisição</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Exame/Serviço</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-center">Urgente</TableHead>
                  <TableHead>Data/Hora Coleta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amostras.map((amostra) => {
                  const situacao = situacaoConfig[amostra.situacao];
                  return (
                    <TableRow key={amostra.id}>
                      <TableCell className="font-mono font-medium">{amostra.numeroAmostra}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{amostra.numeroRequisicao}</TableCell>
                      <TableCell>{amostra.paciente}</TableCell>
                      <TableCell>{amostra.material}</TableCell>
                      <TableCell>{amostra.exameServico}</TableCell>
                      <TableCell>
                        <span className={situacao.className}>{situacao.label}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {amostra.urgente ? (
                          <span className="inline-flex items-center gap-1 badge-error">
                            <AlertTriangle className="h-3 w-3" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell>{amostra.dataHoraColeta}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioLoteDetalhe;
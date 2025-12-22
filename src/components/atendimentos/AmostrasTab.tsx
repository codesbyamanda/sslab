import { useMemo, useState } from "react";
import { Eye, FlaskConical, TestTubes, Info, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Servico {
  id: number;
  codigo: string;
  mnemonico: string;
  descricao: string;
  situacao: "aberto" | "pendente" | "cancelado" | "executado" | "liberado";
  urgencia: boolean;
  materialColhido: boolean;
  dataColeta: string;
  horaColeta: string;
  convenio: string;
  medicoSolicitante: string;
  valor: number;
}

export interface AmostraGerada {
  id: number;
  nome: string;
  material: string;
  servicos: Servico[];
  origem: string;
  status: "aguardando_coleta" | "coletada" | "em_analise" | "finalizada";
}

interface AmostrasTabProps {
  servicos: Servico[];
}

// Mapeamento de mnemônicos para materiais (simulando lógica de negócio)
const MATERIAL_MAP: Record<string, { material: string; grupo: string }> = {
  "COL": { material: "Sangue Total", grupo: "bioquimica" },
  "TRI": { material: "Sangue Total", grupo: "bioquimica" },
  "HDL": { material: "Sangue Total", grupo: "bioquimica" },
  "GLI": { material: "Sangue Total", grupo: "bioquimica" },
  "HEMO": { material: "Sangue Total", grupo: "hematologia" },
  "HEM": { material: "Sangue Total", grupo: "hematologia" },
  "URIN": { material: "Urina", grupo: "urina" },
  "EAS": { material: "Urina", grupo: "urina" },
  "URO": { material: "Urina", grupo: "urina" },
  "SWAB": { material: "Swab Nasal", grupo: "swab" },
  "PCR": { material: "Swab Nasal", grupo: "swab" },
  "COVID": { material: "Swab Nasal", grupo: "swab" },
  "FEZES": { material: "Fezes", grupo: "fezes" },
  "EPF": { material: "Fezes", grupo: "fezes" },
};

const getStatusStyle = (status: AmostraGerada["status"]) => {
  switch (status) {
    case "aguardando_coleta":
      return "bg-ambar-suave/20 text-ambar-suave border border-ambar-suave/30";
    case "coletada":
      return "bg-petroleo/20 text-petroleo border border-petroleo/30";
    case "em_analise":
      return "bg-primary/20 text-primary border border-primary/30";
    case "finalizada":
      return "bg-verde-clinico/20 text-verde-clinico border border-verde-clinico/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusLabel = (status: AmostraGerada["status"]) => {
  const labels: Record<string, string> = {
    aguardando_coleta: "Aguardando Coleta",
    coletada: "Coletada",
    em_analise: "Em Análise",
    finalizada: "Finalizada",
  };
  return labels[status] || status;
};

const AmostrasTab = ({ servicos }: AmostrasTabProps) => {
  const [viewingAmostra, setViewingAmostra] = useState<AmostraGerada | null>(null);

  // Gera amostras automaticamente baseado nos serviços
  const amostrasGeradas = useMemo(() => {
    // Filtrar serviços não cancelados
    const servicosAtivos = servicos.filter((s) => s.situacao !== "cancelado");

    if (servicosAtivos.length === 0) return [];

    // Agrupar serviços por material e grupo
    const grupos: Record<string, Servico[]> = {};

    servicosAtivos.forEach((servico) => {
      const mnemonico = servico.mnemonico.toUpperCase();
      const config = MATERIAL_MAP[mnemonico] || { material: "Sangue Total", grupo: "outros" };
      const key = `${config.material}_${config.grupo}`;

      if (!grupos[key]) {
        grupos[key] = [];
      }
      grupos[key].push(servico);
    });

    // Criar amostras a partir dos grupos
    const amostras: AmostraGerada[] = [];
    let id = 1;

    Object.entries(grupos).forEach(([key, servicosGrupo]) => {
      const [material, grupo] = key.split("_");
      
      // Determinar nome da amostra baseado no grupo
      let nomeAmostra = material;
      if (grupo === "hematologia") {
        nomeAmostra = "HMO";
      } else if (grupo === "bioquimica") {
        nomeAmostra = material;
      }

      amostras.push({
        id: id++,
        nome: nomeAmostra,
        material: material,
        servicos: servicosGrupo,
        origem: "Triagem",
        status: "aguardando_coleta",
      });
    });

    return amostras;
  }, [servicos]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Amostras</h3>
          <p className="text-sm text-muted-foreground">
            Visualização das amostras geradas automaticamente.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Info className="h-5 w-5 text-primary flex-shrink-0" />
        <p className="text-sm text-foreground">
          As amostras são geradas automaticamente com base nos serviços adicionados.
        </p>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Nome da Amostra</th>
                <th>Tipo de Material</th>
                <th>Serviços Vinculados</th>
                <th>Origem</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {amostrasGeradas.map((amostra) => (
                <tr key={amostra.id} className="hover:bg-muted/30">
                  <td>
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-primary" />
                      <span className="font-medium">{amostra.nome}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Beaker className="h-4 w-4 text-muted-foreground" />
                      <span>{amostra.material}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {amostra.servicos.slice(0, 3).map((servico) => (
                        <Badge
                          key={servico.id}
                          variant="secondary"
                          className="text-xs font-mono"
                        >
                          {servico.mnemonico}
                        </Badge>
                      ))}
                      {amostra.servicos.length > 3 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs">
                                +{amostra.servicos.length - 3}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                {amostra.servicos.slice(3).map((servico) => (
                                  <div key={servico.id} className="text-xs">
                                    {servico.mnemonico} - {servico.descricao}
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">{amostra.origem}</span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getStatusStyle(
                        amostra.status
                      )}`}
                    >
                      {getStatusLabel(amostra.status)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setViewingAmostra(amostra)}
                        title="Visualizar"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {amostrasGeradas.length === 0 && (
          <div className="p-12 text-center">
            <TestTubes className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Nenhuma amostra gerada
            </h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Adicione serviços para que as amostras sejam geradas automaticamente.
            </p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingAmostra && (
        <AmostraViewModal
          open={!!viewingAmostra}
          onClose={() => setViewingAmostra(null)}
          amostra={viewingAmostra}
        />
      )}
    </div>
  );
};

// View Modal Component
interface AmostraViewModalProps {
  open: boolean;
  onClose: () => void;
  amostra: AmostraGerada;
}

const AmostraViewModal = ({ open, onClose, amostra }: AmostraViewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            {amostra.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Tipo de Material
              </h4>
              <p className="text-sm font-medium">{amostra.material}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Origem
              </h4>
              <p className="text-sm font-medium">{amostra.origem}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Status
            </h4>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getStatusStyle(
                amostra.status
              )}`}
            >
              {getStatusLabel(amostra.status)}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Serviços Vinculados ({amostra.servicos.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amostra.servicos.map((servico) => (
                <div
                  key={servico.id}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary font-medium">
                      {servico.mnemonico}
                    </span>
                    <span className="text-sm">{servico.descricao}</span>
                  </div>
                  {servico.urgencia && (
                    <Badge variant="destructive" className="text-xs">
                      Urgente
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmostrasTab;

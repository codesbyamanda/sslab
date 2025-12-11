import { CheckCircle, TestTube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AmostraColhida } from "@/pages/RecebimentoDetalhe";

interface AmostrasColhidasTabProps {
  amostras: AmostraColhida[];
}

const AmostrasColhidasTab = ({ amostras }: AmostrasColhidasTabProps) => {
  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "Recebido":
        return (
          <Badge className="gap-1 bg-verde-sucesso hover:bg-verde-sucesso/90">
            <CheckCircle className="h-3 w-3" />
            Recebido
          </Badge>
        );
      case "Em Análise":
        return (
          <Badge variant="secondary" className="gap-1">
            Em Análise
          </Badge>
        );
      case "Liberado":
        return (
          <Badge variant="default" className="gap-1 bg-primary">
            Liberado
          </Badge>
        );
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Serviço</TableHead>
              <TableHead className="font-semibold">Nº Amostra</TableHead>
              <TableHead className="font-semibold">Data da Coleta</TableHead>
              <TableHead className="font-semibold">Material</TableHead>
              <TableHead className="font-semibold">Convênio</TableHead>
              <TableHead className="font-semibold text-center">
                Situação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amostras.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  <TestTube className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma amostra colhida</p>
                </TableCell>
              </TableRow>
            ) : (
              amostras.map((amostra) => (
                <TableRow key={amostra.id}>
                  <TableCell className="font-medium">
                    {amostra.servico}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-primary font-medium">
                    {amostra.numeroAmostra}
                  </TableCell>
                  <TableCell>
                    {new Date(amostra.dataColeta).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{amostra.material}</TableCell>
                  <TableCell>{amostra.convenio}</TableCell>
                  <TableCell className="text-center">
                    {getSituacaoBadge(amostra.situacao)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {amostras.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Esta aba exibe apenas para visualização as amostras já coletadas.
        </p>
      )}
    </div>
  );
};

export default AmostrasColhidasTab;

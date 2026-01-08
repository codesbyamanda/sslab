import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Upload, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const loteInfo = {
  codigo: "LT-2026-0145",
  sequencial: 145,
  dataGeracao: "02/01/2026 14:30",
  usuario: "Maria Silva",
  parceiro: "Lab Apoio Central",
  tipoOperacao: "Exportação",
  tipoDados: "Requisições",
  totalItens: 15,
  processados: 13,
  erros: 2
};

const requisicoesExportadas = [
  { id: "1", requisicao: "REQ-2026-001234", paciente: "João da Silva", exames: 3, status: "Enviado", dataEnvio: "02/01/2026 14:31" },
  { id: "2", requisicao: "REQ-2026-001235", paciente: "Maria Santos", exames: 5, status: "Enviado", dataEnvio: "02/01/2026 14:31" },
  { id: "3", requisicao: "REQ-2026-001236", paciente: "Carlos Pereira", exames: 2, status: "Enviado", dataEnvio: "02/01/2026 14:32" },
  { id: "4", requisicao: "REQ-2026-001237", paciente: "Ana Costa", exames: 4, status: "Enviado", dataEnvio: "02/01/2026 14:32" },
  { id: "5", requisicao: "REQ-2026-001238", paciente: "Roberto Lima", exames: 1, status: "Enviado", dataEnvio: "02/01/2026 14:33" }
];

const laudosImportados = [
  { id: "1", requisicao: "REQ-2026-001200", paciente: "Pedro Alves", exame: "Hemograma", status: "Importado", dataImportacao: "02/01/2026 14:35" },
  { id: "2", requisicao: "REQ-2026-001201", paciente: "Lucia Ferreira", exame: "Glicemia", status: "Importado", dataImportacao: "02/01/2026 14:35" },
  { id: "3", requisicao: "REQ-2026-001202", paciente: "Fernando Costa", exame: "Colesterol Total", status: "Importado", dataImportacao: "02/01/2026 14:36" }
];

const itensComErro = [
  { id: "1", requisicao: "REQ-2026-001239", paciente: "Marcos Oliveira", erro: "Exame não cadastrado no parceiro", tentativas: 2 },
  { id: "2", requisicao: "REQ-2026-001240", paciente: "Juliana Santos", erro: "Timeout na comunicação", tentativas: 3 }
];

const LoteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <TransferenciaLayout title="Detalhe do Lote">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/transferencia/lotes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">{loteInfo.codigo}</h1>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                <Upload className="h-3 w-3 mr-1" />
                {loteInfo.tipoOperacao}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Detalhes completos do lote de transferência
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Parceiro</p>
              <p className="text-lg font-semibold">{loteInfo.parceiro}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tipo de Dados</p>
              <p className="text-lg font-semibold">{loteInfo.tipoDados}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Data/Hora</p>
              <p className="text-lg font-semibold">{loteInfo.dataGeracao}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Usuário</p>
              <p className="text-lg font-semibold">{loteInfo.usuario}</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo do Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{loteInfo.totalItens}</p>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-600">{loteInfo.processados}</p>
                <p className="text-sm text-muted-foreground">Processados</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{loteInfo.erros}</p>
                <p className="text-sm text-muted-foreground">Erros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs com detalhes */}
        <Tabs defaultValue="exportadas">
          <TabsList>
            <TabsTrigger value="exportadas" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Requisições Exportadas
            </TabsTrigger>
            <TabsTrigger value="importadas" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Laudos Importados
            </TabsTrigger>
            <TabsTrigger value="erros" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Itens com Erro
              {loteInfo.erros > 0 && (
                <Badge variant="destructive" className="ml-1">{loteInfo.erros}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exportadas" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisição</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead className="text-center">Exames</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data/Hora Envio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisicoesExportadas.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono font-medium text-primary">
                          {req.requisicao}
                        </TableCell>
                        <TableCell>{req.paciente}</TableCell>
                        <TableCell className="text-center">{req.exames}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{req.dataEnvio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="importadas" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisição</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Exame</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data/Hora Importação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laudosImportados.map((laudo) => (
                      <TableRow key={laudo.id}>
                        <TableCell className="font-mono font-medium text-primary">
                          {laudo.requisicao}
                        </TableCell>
                        <TableCell>{laudo.paciente}</TableCell>
                        <TableCell>{laudo.exame}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            {laudo.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{laudo.dataImportacao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="erros" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisição</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Descrição do Erro</TableHead>
                      <TableHead className="text-center">Tentativas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itensComErro.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum erro encontrado neste lote
                        </TableCell>
                      </TableRow>
                    ) : (
                      itensComErro.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono font-medium text-primary">
                            {item.requisicao}
                          </TableCell>
                          <TableCell>{item.paciente}</TableCell>
                          <TableCell className="text-red-600">{item.erro}</TableCell>
                          <TableCell className="text-center">{item.tentativas}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Reprocessar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/transferencia/lotes")}>
            Voltar
          </Button>
          {loteInfo.erros > 0 && (
            <Button>
              Reprocessar Erros
            </Button>
          )}
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default LoteDetalhe;

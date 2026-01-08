import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Upload, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const transferencias = [
  {
    id: "1",
    lote: "LT-2026-0145",
    parceiro: "Lab Apoio Central",
    tipoOperacao: "Exportação",
    tipoDados: "Requisições",
    dataGeracao: "02/01/2026 14:30",
    usuario: "Maria Silva",
    situacao: "Concluída"
  },
  {
    id: "2",
    lote: "LT-2026-0144",
    parceiro: "Lab Análises Clínicas",
    tipoOperacao: "Importação",
    tipoDados: "Laudos",
    dataGeracao: "02/01/2026 11:15",
    usuario: "João Pereira",
    situacao: "Concluída"
  },
  {
    id: "3",
    lote: "LT-2026-0143",
    parceiro: "Clínica São Paulo",
    tipoOperacao: "Exportação",
    tipoDados: "Requisições",
    dataGeracao: "02/01/2026 09:45",
    usuario: "Ana Costa",
    situacao: "Pendente"
  },
  {
    id: "4",
    lote: "LT-2026-0142",
    parceiro: "Lab Apoio Central",
    tipoOperacao: "Importação",
    tipoDados: "Laudos",
    dataGeracao: "01/01/2026 16:20",
    usuario: "Carlos Eduardo",
    situacao: "Erro"
  },
  {
    id: "5",
    lote: "LT-2026-0141",
    parceiro: "Hospital Regional",
    tipoOperacao: "Exportação",
    tipoDados: "Requisições",
    dataGeracao: "01/01/2026 10:00",
    usuario: "Maria Silva",
    situacao: "Concluída"
  },
  {
    id: "6",
    lote: "LT-2026-0140",
    parceiro: "Lab Especializado",
    tipoOperacao: "Importação",
    tipoDados: "Valores de Referência",
    dataGeracao: "31/12/2025 15:30",
    usuario: "Fernanda Lima",
    situacao: "Concluída"
  }
];

const getSituacaoBadge = (situacao: string) => {
  switch (situacao) {
    case "Concluída":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Concluída</Badge>;
    case "Pendente":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>;
    case "Erro":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Erro</Badge>;
    case "Processando":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processando</Badge>;
    default:
      return <Badge variant="secondary">{situacao}</Badge>;
  }
};

const getTipoBadge = (tipo: string) => {
  switch (tipo) {
    case "Exportação":
      return (
        <Badge variant="outline" className="border-blue-300 text-blue-700">
          <Upload className="h-3 w-3 mr-1" />
          Exportação
        </Badge>
      );
    case "Importação":
      return (
        <Badge variant="outline" className="border-purple-300 text-purple-700">
          <Download className="h-3 w-3 mr-1" />
          Importação
        </Badge>
      );
    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};

const TransferenciaLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [situacaoFilter, setSituacaoFilter] = useState("todos");
  const [dadosFilter, setDadosFilter] = useState("todos");

  const filteredTransferencias = transferencias.filter((t) => {
    const matchesSearch = 
      t.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || t.tipoOperacao === tipoFilter;
    const matchesSituacao = situacaoFilter === "todos" || t.situacao === situacaoFilter;
    const matchesDados = dadosFilter === "todos" || t.tipoDados === dadosFilter;
    
    return matchesSearch && matchesTipo && matchesSituacao && matchesDados;
  });

  return (
    <TransferenciaLayout title="Transferências">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Transferências</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Todas as transferências realizadas com laboratórios parceiros
            </p>
          </div>
          <Button onClick={() => navigate("/transferencia/processar")}>
            Processar Transferência
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por parceiro, lote ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="w-40">
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Operação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas Operações</SelectItem>
                    <SelectItem value="Exportação">Exportação</SelectItem>
                    <SelectItem value="Importação">Importação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-44">
                <Select value={dadosFilter} onValueChange={setDadosFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Dados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Dados</SelectItem>
                    <SelectItem value="Requisições">Requisições</SelectItem>
                    <SelectItem value="Laudos">Laudos</SelectItem>
                    <SelectItem value="Valores de Referência">Valores de Referência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas Situações</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Processando">Processando</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Erro">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Input type="date" className="w-40" />
                <Input type="date" className="w-40" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código do Lote</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Operação</TableHead>
                  <TableHead>Tipo de Dados</TableHead>
                  <TableHead>Data de Geração</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransferencias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma transferência encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransferencias.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-primary">
                        {transfer.lote}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transfer.parceiro}
                      </TableCell>
                      <TableCell>{getTipoBadge(transfer.tipoOperacao)}</TableCell>
                      <TableCell className="text-muted-foreground">{transfer.tipoDados}</TableCell>
                      <TableCell className="text-muted-foreground">{transfer.dataGeracao}</TableCell>
                      <TableCell className="text-muted-foreground">{transfer.usuario}</TableCell>
                      <TableCell>{getSituacaoBadge(transfer.situacao)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/transferencia/lotes/${transfer.id}`)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaLista;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Package, Upload, Download } from "lucide-react";
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

const lotes = [
  {
    id: "1",
    codigo: "LT-2026-0145",
    sequencial: 145,
    dataGeracao: "02/01/2026 14:30",
    usuario: "Maria Silva",
    parceiro: "Lab Apoio Central",
    tipoOperacao: "Exportação",
    itens: 15,
    processados: 15,
    erros: 0
  },
  {
    id: "2",
    codigo: "LT-2026-0144",
    sequencial: 144,
    dataGeracao: "02/01/2026 11:15",
    usuario: "João Pereira",
    parceiro: "Lab Análises Clínicas",
    tipoOperacao: "Importação",
    itens: 12,
    processados: 10,
    erros: 2
  },
  {
    id: "3",
    codigo: "LT-2026-0143",
    sequencial: 143,
    dataGeracao: "02/01/2026 09:45",
    usuario: "Ana Costa",
    parceiro: "Clínica São Paulo",
    tipoOperacao: "Exportação",
    itens: 22,
    processados: 22,
    erros: 0
  },
  {
    id: "4",
    codigo: "LT-2026-0142",
    sequencial: 142,
    dataGeracao: "01/01/2026 16:20",
    usuario: "Carlos Eduardo",
    parceiro: "Lab Apoio Central",
    tipoOperacao: "Importação",
    itens: 8,
    processados: 5,
    erros: 3
  },
  {
    id: "5",
    codigo: "LT-2026-0141",
    sequencial: 141,
    dataGeracao: "01/01/2026 10:00",
    usuario: "Maria Silva",
    parceiro: "Hospital Regional",
    tipoOperacao: "Exportação",
    itens: 18,
    processados: 18,
    erros: 0
  }
];

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

const LotesTransferencia = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const filteredLotes = lotes.filter((l) => {
    const matchesSearch = 
      l.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || l.tipoOperacao === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  return (
    <TransferenciaLayout title="Lotes de Transferência">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6" />
              Lotes de Transferência
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Consulte todos os lotes gerados nas transferências
            </p>
          </div>
          <Button onClick={() => navigate("/transferencia/processar")}>
            Novo Lote
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
                    placeholder="Buscar por código, parceiro ou usuário..."
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
                  <TableHead>Seq.</TableHead>
                  <TableHead>Data de Geração</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Operação</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead className="text-center">Processados</TableHead>
                  <TableHead className="text-center">Erros</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nenhum lote encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLotes.map((lote) => (
                    <TableRow key={lote.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-primary">
                        {lote.codigo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lote.sequencial}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lote.dataGeracao}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lote.usuario}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lote.parceiro}
                      </TableCell>
                      <TableCell>{getTipoBadge(lote.tipoOperacao)}</TableCell>
                      <TableCell className="text-center">{lote.itens}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-emerald-600 font-medium">{lote.processados}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {lote.erros > 0 ? (
                          <span className="text-red-600 font-medium">{lote.erros}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/transferencia/lotes/${lote.id}`)}
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

export default LotesTransferencia;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, History, Upload, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const historico = [
  {
    id: "1",
    data: "02/01/2026",
    hora: "15:45",
    acao: "Exportação concluída",
    lote: "LT-2026-0145",
    parceiro: "Lab Apoio Central",
    tipo: "Exportação",
    tipoDados: "Requisições",
    usuario: "Maria Silva",
    detalhes: "15 requisições exportadas com sucesso"
  },
  {
    id: "2",
    data: "02/01/2026",
    hora: "11:20",
    acao: "Importação concluída",
    lote: "LT-2026-0144",
    parceiro: "Lab Análises Clínicas",
    tipo: "Importação",
    tipoDados: "Laudos",
    usuario: "João Pereira",
    detalhes: "10 laudos importados, 2 com erro"
  },
  {
    id: "3",
    data: "02/01/2026",
    hora: "09:50",
    acao: "Exportação iniciada",
    lote: "LT-2026-0143",
    parceiro: "Clínica São Paulo",
    tipo: "Exportação",
    tipoDados: "Requisições",
    usuario: "Ana Costa",
    detalhes: "Processando 22 requisições"
  },
  {
    id: "4",
    data: "01/01/2026",
    hora: "16:25",
    acao: "Erro de importação",
    lote: "LT-2026-0142",
    parceiro: "Lab Apoio Central",
    tipo: "Importação",
    tipoDados: "Laudos",
    usuario: "Carlos Eduardo",
    detalhes: "Falha na conexão com servidor do parceiro"
  },
  {
    id: "5",
    data: "01/01/2026",
    hora: "10:05",
    acao: "Exportação concluída",
    lote: "LT-2026-0141",
    parceiro: "Hospital Regional",
    tipo: "Exportação",
    tipoDados: "Requisições",
    usuario: "Maria Silva",
    detalhes: "18 requisições exportadas com sucesso"
  },
  {
    id: "6",
    data: "31/12/2025",
    hora: "15:35",
    acao: "Configuração alterada",
    lote: "-",
    parceiro: "Lab Especializado",
    tipo: "Sistema",
    tipoDados: "-",
    usuario: "Fernanda Lima",
    detalhes: "Atualização de De/Para de serviços"
  },
  {
    id: "7",
    data: "31/12/2025",
    hora: "14:00",
    acao: "Novo parceiro cadastrado",
    lote: "-",
    parceiro: "Clínica Nova Esperança",
    tipo: "Sistema",
    tipoDados: "-",
    usuario: "Admin",
    detalhes: "Parceiro configurado para integração via API"
  }
];

const getAcaoBadge = (acao: string) => {
  if (acao.includes("concluída")) {
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{acao}</Badge>;
  }
  if (acao.includes("Erro")) {
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{acao}</Badge>;
  }
  if (acao.includes("iniciada")) {
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{acao}</Badge>;
  }
  return <Badge variant="secondary">{acao}</Badge>;
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
    case "Sistema":
      return (
        <Badge variant="outline" className="border-gray-300 text-gray-700">
          Sistema
        </Badge>
      );
    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};

const TransferenciaHistorico = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const filteredHistorico = historico.filter((h) => {
    const matchesSearch = 
      h.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.detalhes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || h.tipo === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  return (
    <TransferenciaLayout title="Histórico">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <History className="h-6 w-6" />
            Histórico de Integrações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Registro completo de todas as operações de integração para auditoria
          </p>
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
                    placeholder="Buscar por parceiro, lote, usuário ou detalhes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="w-40">
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="Exportação">Exportação</SelectItem>
                    <SelectItem value="Importação">Importação</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
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
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="text-right">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistorico.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistorico.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <span className="font-medium">{item.data}</span>
                          <span className="text-muted-foreground text-sm ml-2">{item.hora}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getAcaoBadge(item.acao)}</TableCell>
                      <TableCell className="font-mono text-primary">
                        {item.lote !== "-" ? item.lote : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="font-medium">{item.parceiro}</TableCell>
                      <TableCell>{getTipoBadge(item.tipo)}</TableCell>
                      <TableCell className="text-muted-foreground">{item.usuario}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                        {item.detalhes}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.lote !== "-" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/transferencia/lotes/${item.id}`)}
                            title="Visualizar lote"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
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

export default TransferenciaHistorico;

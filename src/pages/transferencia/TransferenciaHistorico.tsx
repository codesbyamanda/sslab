import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, History } from "lucide-react";
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
    paciente: "Maria Silva Santos",
    documento: "123.456.789-00",
    origem: "UTI Adulto",
    destino: "Enfermaria 3",
    tipo: "Interna",
    situacao: "Concluída",
    usuario: "Ana Paula Enfermeira"
  },
  {
    id: "2",
    data: "01/01/2026",
    hora: "16:30",
    paciente: "Carlos Alberto Souza",
    documento: "789.123.456-00",
    origem: "Enfermaria 2",
    destino: "UTI Coronariana",
    tipo: "Interna",
    situacao: "Concluída",
    usuario: "Dr. Carlos Eduardo"
  },
  {
    id: "3",
    data: "31/12/2025",
    hora: "14:00",
    paciente: "Fernanda Costa Pereira",
    documento: "321.654.987-00",
    origem: "Ambulatório",
    destino: "Internação",
    tipo: "Interna",
    situacao: "Cancelada",
    usuario: "Maria Enfermeira"
  },
  {
    id: "4",
    data: "30/12/2025",
    hora: "10:15",
    paciente: "Roberto Mendes",
    documento: "654.987.321-00",
    origem: "Pronto Socorro",
    destino: "Hospital Especializado",
    tipo: "Externa",
    situacao: "Concluída",
    usuario: "Dr. Fernando Alves"
  },
  {
    id: "5",
    data: "29/12/2025",
    hora: "09:30",
    paciente: "Lucia Helena Costa",
    documento: "147.258.369-00",
    origem: "Emergência",
    destino: "Centro Cirúrgico",
    tipo: "Interna",
    situacao: "Concluída",
    usuario: "Patrícia Técnica"
  },
  {
    id: "6",
    data: "28/12/2025",
    hora: "11:00",
    paciente: "Pedro Santos Lima",
    documento: "963.852.741-00",
    origem: "UTI Pediátrica",
    destino: "Enfermaria Pediátrica",
    tipo: "Interna",
    situacao: "Concluída",
    usuario: "Dra. Carla Mendes"
  },
  {
    id: "7",
    data: "27/12/2025",
    hora: "08:45",
    paciente: "Ana Beatriz Ferreira",
    documento: "159.357.486-00",
    origem: "Hospital Central",
    destino: "Clínica São Paulo",
    tipo: "Externa",
    situacao: "Concluída",
    usuario: "Ricardo Enfermeiro"
  }
];

const getSituacaoBadge = (situacao: string) => {
  switch (situacao) {
    case "Concluída":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Concluída</Badge>;
    case "Cancelada":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelada</Badge>;
    default:
      return <Badge variant="secondary">{situacao}</Badge>;
  }
};

const getTipoBadge = (tipo: string) => {
  switch (tipo) {
    case "Interna":
      return <Badge variant="outline" className="border-blue-300 text-blue-700">Interna</Badge>;
    case "Externa":
      return <Badge variant="outline" className="border-purple-300 text-purple-700">Externa</Badge>;
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
      h.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.documento.includes(searchTerm) ||
      h.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || h.tipo === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  return (
    <TransferenciaLayout title="Histórico de Transferências">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <History className="h-6 w-6" />
            Histórico de Transferências
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Registro completo de todas as transferências realizadas para auditoria
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
                    placeholder="Buscar por paciente, documento ou usuário..."
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
                    <SelectItem value="Interna">Interna</SelectItem>
                    <SelectItem value="Externa">Externa</SelectItem>
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
                  <TableHead>Paciente</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Usuário Responsável</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
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
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.paciente}</p>
                          <p className="text-xs text-muted-foreground">{item.documento}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.origem}</TableCell>
                      <TableCell className="text-muted-foreground">{item.destino}</TableCell>
                      <TableCell>{getTipoBadge(item.tipo)}</TableCell>
                      <TableCell className="text-muted-foreground">{item.usuario}</TableCell>
                      <TableCell>{getSituacaoBadge(item.situacao)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/transferencia/${item.id}`)}
                          title="Visualizar"
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

export default TransferenciaHistorico;

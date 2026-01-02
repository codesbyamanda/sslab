import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Eye, Edit } from "lucide-react";
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
    data: "02/01/2026",
    hora: "14:30",
    paciente: "Maria Silva Santos",
    documento: "123.456.789-00",
    origem: "UTI Adulto",
    destino: "Enfermaria 3",
    tipo: "Interna",
    situacao: "Concluída"
  },
  {
    id: "2",
    data: "02/01/2026",
    hora: "10:15",
    paciente: "João Pedro Oliveira",
    documento: "987.654.321-00",
    origem: "Emergência",
    destino: "Centro Cirúrgico",
    tipo: "Interna",
    situacao: "Em andamento"
  },
  {
    id: "3",
    data: "01/01/2026",
    hora: "16:45",
    paciente: "Ana Carolina Lima",
    documento: "456.789.123-00",
    origem: "Hospital Central",
    destino: "Hospital Regional",
    tipo: "Externa",
    situacao: "Pendente"
  },
  {
    id: "4",
    data: "01/01/2026",
    hora: "09:00",
    paciente: "Carlos Alberto Souza",
    documento: "789.123.456-00",
    origem: "Enfermaria 2",
    destino: "UTI Coronariana",
    tipo: "Interna",
    situacao: "Concluída"
  },
  {
    id: "5",
    data: "31/12/2025",
    hora: "11:30",
    paciente: "Fernanda Costa Pereira",
    documento: "321.654.987-00",
    origem: "Ambulatório",
    destino: "Internação",
    tipo: "Interna",
    situacao: "Cancelada"
  },
  {
    id: "6",
    data: "30/12/2025",
    hora: "08:00",
    paciente: "Roberto Mendes",
    documento: "654.987.321-00",
    origem: "Pronto Socorro",
    destino: "Hospital Especializado",
    tipo: "Externa",
    situacao: "Concluída"
  }
];

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

const TransferenciaLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [situacaoFilter, setSituacaoFilter] = useState("todos");

  const filteredTransferencias = transferencias.filter((t) => {
    const matchesSearch = 
      t.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.documento.includes(searchTerm) ||
      t.origem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destino.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || t.tipo === tipoFilter;
    const matchesSituacao = situacaoFilter === "todos" || t.situacao === situacaoFilter;
    
    return matchesSearch && matchesTipo && matchesSituacao;
  });

  return (
    <TransferenciaLayout title="Transferências">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Transferências</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie as transferências de pacientes e prontuários
            </p>
          </div>
          <Button onClick={() => navigate("/transferencia/nova")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transferência
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
                    placeholder="Buscar por paciente, documento, origem ou destino..."
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

              <div className="w-44">
                <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Situações</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
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
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransferencias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma transferência encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransferencias.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <span className="font-medium">{transfer.data}</span>
                          <span className="text-muted-foreground text-sm ml-2">{transfer.hora}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transfer.paciente}</p>
                          <p className="text-xs text-muted-foreground">{transfer.documento}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{transfer.origem}</TableCell>
                      <TableCell className="text-muted-foreground">{transfer.destino}</TableCell>
                      <TableCell>{getTipoBadge(transfer.tipo)}</TableCell>
                      <TableCell>{getSituacaoBadge(transfer.situacao)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/transferencia/${transfer.id}`)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transfer.situacao !== "Concluída" && transfer.situacao !== "Cancelada" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/transferencia/${transfer.id}/editar`)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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

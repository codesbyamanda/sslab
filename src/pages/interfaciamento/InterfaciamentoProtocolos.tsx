import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Cable,
  ChevronRight,
  Home,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const protocolos = [
  {
    id: 1,
    nome: "ASTM E1381",
    tipo: "ASTM",
    direcao: "Bidirecional",
    status: "ativo",
    equipamentosVinculados: 5
  },
  {
    id: 2,
    nome: "HL7 v2.5",
    tipo: "HL7",
    direcao: "Bidirecional",
    status: "ativo",
    equipamentosVinculados: 3
  },
  {
    id: 3,
    nome: "Serial RS-232",
    tipo: "Serial",
    direcao: "Recebimento",
    status: "ativo",
    equipamentosVinculados: 2
  },
  {
    id: 4,
    nome: "Sysmex Proprietário",
    tipo: "Proprietário",
    direcao: "Bidirecional",
    status: "ativo",
    equipamentosVinculados: 4
  },
  {
    id: 5,
    nome: "TCP/IP Custom",
    tipo: "TCP/IP",
    direcao: "Envio",
    status: "inativo",
    equipamentosVinculados: 0
  },
];

export default function InterfaciamentoProtocolos() {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const getTipoBadge = (tipo: string) => {
    const cores: Record<string, string> = {
      "ASTM": "bg-blue-100 text-blue-700",
      "HL7": "bg-purple-100 text-purple-700",
      "Serial": "bg-orange-100 text-orange-700",
      "Proprietário": "bg-gray-100 text-gray-700",
      "TCP/IP": "bg-green-100 text-green-700",
    };
    return <Badge className={cores[tipo] || "bg-gray-100"}>{tipo}</Badge>;
  };

  const getDirecaoIcon = (direcao: string) => {
    switch (direcao) {
      case "Bidirecional":
        return <ArrowUpDown className="w-4 h-4 text-blue-600" />;
      case "Envio":
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case "Recebimento":
        return <ArrowDown className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const protocolosFiltrados = protocolos.filter((p) => {
    const matchNome = p.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchTipo = filtroTipo === "todos" || p.tipo === filtroTipo;
    return matchNome && matchTipo;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Protocolos</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Protocolos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os protocolos de comunicação com equipamentos
          </p>
        </div>
        <Link to="/interfaciamento/protocolos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Protocolo
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do protocolo..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="ASTM">ASTM</SelectItem>
                <SelectItem value="HL7">HL7</SelectItem>
                <SelectItem value="Serial">Serial</SelectItem>
                <SelectItem value="Proprietário">Proprietário</SelectItem>
                <SelectItem value="TCP/IP">TCP/IP</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { setFiltroNome(""); setFiltroTipo("todos"); }}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Protocolo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Direção</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Equipamentos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocolosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Cable className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Nenhum protocolo encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                protocolosFiltrados.map((protocolo) => (
                  <TableRow key={protocolo.id}>
                    <TableCell className="font-medium">{protocolo.nome}</TableCell>
                    <TableCell>{getTipoBadge(protocolo.tipo)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDirecaoIcon(protocolo.direcao)}
                        <span>{protocolo.direcao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={protocolo.status === "ativo" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-700"}
                      >
                        {protocolo.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {protocolo.equipamentosVinculados} equipamento(s)
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/interfaciamento/protocolos/${protocolo.id}`}>
                        <Button variant="ghost" size="icon" title="Visualizar/Editar">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

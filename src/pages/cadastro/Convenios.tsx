import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Handshake, Search, Plus, Eye, Trash2, FileText } from "lucide-react";

const mockConvenios = [
  { id: 1, codigo: "CON001", nome: "Unimed", registroANS: "123456", tabelaBase: "Tabela Convênios", planos: 3, status: "ativo" },
  { id: 2, codigo: "CON002", nome: "Bradesco Saúde", registroANS: "234567", tabelaBase: "Tabela Convênios", planos: 5, status: "ativo" },
  { id: 3, codigo: "CON003", nome: "Amil", registroANS: "345678", tabelaBase: "Tabela Convênios", planos: 4, status: "ativo" },
  { id: 4, codigo: "CON004", nome: "SUS", registroANS: "-", tabelaBase: "Tabela SUS", planos: 1, status: "ativo" },
  { id: 5, codigo: "CON005", nome: "Particular", registroANS: "-", tabelaBase: "Tabela Particular", planos: 1, status: "ativo" },
];

export default function Convenios() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockConvenios.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Convênios</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Handshake className="h-6 w-6 text-primary" />
            Convênios
          </h1>
          <p className="text-muted-foreground">Convênios, operadoras e planos de saúde</p>
        </div>
        <Button onClick={() => navigate("/cadastro/convenios/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Convênio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total de Convênios</p><p className="text-2xl font-bold">{mockConvenios.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Convênios Ativos</p><p className="text-2xl font-bold text-green-600">{mockConvenios.filter((c) => c.status === "ativo").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total de Planos</p><p className="text-2xl font-bold text-blue-600">{mockConvenios.reduce((acc, c) => acc + c.planos, 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Com Registro ANS</p><p className="text-2xl font-bold text-purple-600">{mockConvenios.filter((c) => c.registroANS !== "-").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar convênio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Registro ANS</TableHead>
                <TableHead>Tabela Base</TableHead>
                <TableHead className="text-center">Planos</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.registroANS}</TableCell>
                  <TableCell className="text-muted-foreground">{item.tabelaBase}</TableCell>
                  <TableCell className="text-center">{item.planos}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"}>{item.status === "ativo" ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/convenios/${item.id}/planos`)} title="Planos">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/convenios/${item.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" disabled={item.status === "ativo"}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

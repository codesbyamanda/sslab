import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Users, Search, Plus, Eye, Trash2, Filter, X } from "lucide-react";

const mockPessoas = [
  { id: 1, codigo: "PES001", nome: "João Silva Santos", cpf: "123.456.789-00", tipo: "Paciente", status: "ativo" },
  { id: 2, codigo: "PES002", nome: "Maria Oliveira", cpf: "987.654.321-00", tipo: "Funcionário", status: "ativo" },
  { id: 3, codigo: "PES003", nome: "Carlos Souza", cpf: "456.789.123-00", tipo: "Médico", status: "ativo" },
  { id: 4, codigo: "PES004", nome: "Ana Costa", cpf: "789.123.456-00", tipo: "Paciente", status: "inativo" },
];

export default function Pessoas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPessoas = mockPessoas.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Pessoas</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Pessoas
          </h1>
          <p className="text-muted-foreground">Cadastro geral de pessoas</p>
        </div>
        <Button onClick={() => navigate("/cadastro/pessoas/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pessoa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{mockPessoas.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pacientes</p><p className="text-2xl font-bold text-blue-600">{mockPessoas.filter((p) => p.tipo === "Paciente").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Funcionários</p><p className="text-2xl font-bold text-green-600">{mockPessoas.filter((p) => p.tipo === "Funcionário").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Médicos</p><p className="text-2xl font-bold text-purple-600">{mockPessoas.filter((p) => p.tipo === "Médico").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm text-muted-foreground mb-1 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Nome ou CPF..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Button variant="secondary"><Filter className="h-4 w-4 mr-2" />Filtrar</Button>
            <Button variant="ghost" onClick={() => setSearchTerm("")}><X className="h-4 w-4 mr-2" />Limpar</Button>
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
                <TableHead>CPF</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPessoas.map((pessoa) => (
                <TableRow key={pessoa.id}>
                  <TableCell className="font-mono">{pessoa.codigo}</TableCell>
                  <TableCell className="font-medium">{pessoa.nome}</TableCell>
                  <TableCell>{pessoa.cpf}</TableCell>
                  <TableCell><Badge variant="outline">{pessoa.tipo}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={pessoa.status === "ativo" ? "default" : "secondary"}>{pessoa.status === "ativo" ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/pessoas/${pessoa.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={pessoa.status === "ativo"}><Trash2 className="h-4 w-4" /></Button>
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

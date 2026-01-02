import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { UserCheck, Search, Plus, Eye, Trash2 } from "lucide-react";

const mockTerceiros = [
  { id: 1, codigo: "TER001", nome: "Laboratório Apoio SP", cnpj: "12.345.678/0001-00", retencaoIR: 1.5, retencaoISS: 5, status: "ativo" },
  { id: 2, codigo: "TER002", nome: "Transporte Médico Ltda", cnpj: "98.765.432/0001-00", retencaoIR: 1.5, retencaoISS: 2, status: "ativo" },
  { id: 3, codigo: "TER003", nome: "Fornecedor Insumos", cnpj: "11.222.333/0001-00", retencaoIR: 0, retencaoISS: 0, status: "inativo" },
];

export default function Terceiros() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockTerceiros.filter((t) =>
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cnpj.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Terceiros</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            Terceiros
          </h1>
          <p className="text-muted-foreground">Fornecedores e prestadores com retenções fiscais</p>
        </div>
        <Button onClick={() => navigate("/cadastro/terceiros/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Terceiro
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar terceiro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Ret. IR (%)</TableHead>
                <TableHead className="text-center">Ret. ISS (%)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell className="text-center">{item.retencaoIR}%</TableCell>
                  <TableCell className="text-center">{item.retencaoISS}%</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"}>{item.status === "ativo" ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/terceiros/${item.id}`)}><Eye className="h-4 w-4" /></Button>
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

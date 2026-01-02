import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileOutput, Search, Plus, Eye, Trash2 } from "lucide-react";

const mockDestinos = [
  { id: 1, codigo: "DES001", descricao: "Impressão Local", tipo: "Impressão", status: "ativo" },
  { id: 2, codigo: "DES002", descricao: "Internet - Portal Paciente", tipo: "Internet", status: "ativo" },
  { id: 3, codigo: "DES003", descricao: "E-mail Automático", tipo: "E-mail", status: "ativo" },
  { id: 4, codigo: "DES004", descricao: "Fax", tipo: "Fax", status: "inativo" },
];

export default function DestinoLaudo() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockDestinos.filter((d) =>
    d.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Destino de Laudo</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileOutput className="h-6 w-6 text-primary" />
            Destino de Laudo
          </h1>
          <p className="text-muted-foreground">Formas de entrega do laudo ao paciente</p>
        </div>
        <Button onClick={() => navigate("/cadastro/destino-laudo/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Destino
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar destino..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell><Badge variant="outline">{item.tipo}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"}>{item.status === "ativo" ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/destino-laudo/${item.id}`)}><Eye className="h-4 w-4" /></Button>
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

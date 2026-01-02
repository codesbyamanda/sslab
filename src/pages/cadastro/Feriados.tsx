import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Calendar, Search, Plus, Eye, Trash2 } from "lucide-react";

const mockFeriados = [
  { id: 1, data: "2024-01-01", descricao: "Confraternização Universal", tipo: "Nacional", impactaPrazo: true },
  { id: 2, data: "2024-04-21", descricao: "Tiradentes", tipo: "Nacional", impactaPrazo: true },
  { id: 3, data: "2024-05-01", descricao: "Dia do Trabalho", tipo: "Nacional", impactaPrazo: true },
  { id: 4, data: "2024-01-25", descricao: "Aniversário de São Paulo", tipo: "Municipal", impactaPrazo: true },
];

export default function Feriados() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockFeriados.filter((f) =>
    f.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Feriados</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Feriados
          </h1>
          <p className="text-muted-foreground">Feriados que impactam prazos de entrega</p>
        </div>
        <Button onClick={() => navigate("/cadastro/feriados/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Feriado
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar feriado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Impacta Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={item.tipo === "Nacional" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.impactaPrazo ? "default" : "secondary"}>{item.impactaPrazo ? "Sim" : "Não"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/feriados/${item.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

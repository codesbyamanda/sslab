import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Coins, Search, Plus, Eye, Trash2 } from "lucide-react";

const mockMoedas = [
  { id: 1, codigo: "BRL", descricao: "Real Brasileiro", simbolo: "R$", padrao: true, status: "ativo" },
  { id: 2, codigo: "USD", descricao: "Dólar Americano", simbolo: "$", padrao: false, status: "ativo" },
  { id: 3, codigo: "EUR", descricao: "Euro", simbolo: "€", padrao: false, status: "ativo" },
];

export default function UnidadeMonetaria() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockMoedas.filter((m) =>
    m.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Unidade Monetária</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            Unidade Monetária
          </h1>
          <p className="text-muted-foreground">Moedas utilizadas no sistema</p>
        </div>
        <Button onClick={() => navigate("/cadastro/unidade-monetaria/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Moeda
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar moeda..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Símbolo</TableHead>
                <TableHead className="text-center">Padrão</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell className="text-lg font-semibold">{item.simbolo}</TableCell>
                  <TableCell className="text-center">
                    {item.padrao && <Badge className="bg-green-100 text-green-700">Padrão</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"}>{item.status === "ativo" ? "Ativo" : "Inativo"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/cadastro/unidade-monetaria/${item.id}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" disabled={item.padrao}><Trash2 className="h-4 w-4" /></Button>
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

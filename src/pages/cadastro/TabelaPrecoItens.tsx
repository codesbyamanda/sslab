import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { List, Search, Plus, Edit, ArrowLeft, Save } from "lucide-react";

const mockItens = [
  { id: 1, codigo: "EXA001", descricao: "Hemograma Completo", codigoFaturamento: "40304361", valor: 25.00 },
  { id: 2, codigo: "EXA002", descricao: "Glicemia de Jejum", codigoFaturamento: "40301630", valor: 15.00 },
  { id: 3, codigo: "EXA003", descricao: "Colesterol Total", codigoFaturamento: "40301400", valor: 18.00 },
  { id: 4, codigo: "EXA004", descricao: "TSH", codigoFaturamento: "40316521", valor: 35.00 },
  { id: 5, codigo: "EXA005", descricao: "Urina Tipo I", codigoFaturamento: "40311040", valor: 12.00 },
];

export default function TabelaPrecoItens() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = mockItens.filter((item) =>
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (itemId: number, currentValue: number) => {
    setEditingId(itemId);
    setEditValue(currentValue.toString());
  };

  const handleSave = () => {
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/cadastro/tabelas-preco">Tabelas de Preço</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Itens da Tabela</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cadastro/tabelas-preco")}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <List className="h-6 w-6 text-primary" />
              Itens da Tabela
            </h1>
            <p className="text-muted-foreground">Tabela Particular - TAB001</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/cadastro/tabelas-preco/${id}/itens/novo`)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total de Itens</p><p className="text-2xl font-bold">{mockItens.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Valor Médio</p><p className="text-2xl font-bold text-green-600">R$ {(mockItens.reduce((acc, i) => acc + i.valor, 0) / mockItens.length).toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Soma Total</p><p className="text-2xl font-bold text-blue-600">R$ {mockItens.reduce((acc, i) => acc + i.valor, 0).toFixed(2)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Cód. Faturamento</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.codigoFaturamento}</TableCell>
                  <TableCell className="text-right">
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 text-right"
                        step="0.01"
                      />
                    ) : (
                      <span className="font-semibold">{item.valor.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === item.id ? (
                      <Button variant="ghost" size="icon" onClick={handleSave}><Save className="h-4 w-4 text-green-600" /></Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id, item.valor)}><Edit className="h-4 w-4" /></Button>
                    )}
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

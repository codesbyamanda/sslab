import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { TableProperties, Search, Plus, List } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockTabelas = [
  { id: 1, codigo: "TAB001", descricao: "Tabela Particular", moeda: "BRL", itens: 320, status: "ativo" },
  { id: 2, codigo: "TAB002", descricao: "Tabela Convênios", moeda: "BRL", itens: 320, status: "ativo" },
  { id: 3, codigo: "TAB003", descricao: "Tabela SUS", moeda: "BRL", itens: 280, status: "ativo" },
  { id: 4, codigo: "TAB004", descricao: "Tabela Promocional", moeda: "BRL", itens: 50, status: "inativo" },
];

export default function TabelasPreco() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockTabelas.filter((t) =>
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAtivas = mockTabelas.filter((t) => t.status === "ativo").length;
  const totalItens = mockTabelas.reduce((acc, t) => acc + t.itens, 0);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Tabelas de Preço</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TableProperties className="h-6 w-6 text-primary" />
            Tabelas de Preço
          </h1>
          <p className="text-muted-foreground">Tabelas de preços e valores de serviços</p>
        </div>
        <Button onClick={() => navigate("/cadastro/tabelas-preco/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tabela
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Tabelas"
          value={mockTabelas.length}
          icon={TableProperties}
          variant="primary"
        />
        <StatCard
          title="Tabelas Ativas"
          value={totalAtivas}
          variant="success"
        />
        <StatCard
          title="Total de Itens"
          value={totalItens}
          variant="primary"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar tabela..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Moeda</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.moeda}</TableCell>
                  <TableCell className="text-center">{item.itens}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/tabelas-preco/${item.id}`)}
                      onDelete={item.status === "inativo" ? () => {} : undefined}
                      isActive={item.status === "ativo"}
                      additionalActions={[
                        {
                          icon: List,
                          label: "Itens da Tabela",
                          onClick: () => navigate(`/cadastro/tabelas-preco/${item.id}/itens`),
                        },
                      ]}
                    />
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

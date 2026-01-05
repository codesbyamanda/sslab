import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Briefcase, Search, Plus } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockProfissoes = [
  { id: 1, codigo: "PRO001", descricao: "Engenheiro Civil", cbo: "2142-05", status: "ativo" },
  { id: 2, codigo: "PRO002", descricao: "Médico", cbo: "2251-01", status: "ativo" },
  { id: 3, codigo: "PRO003", descricao: "Professor", cbo: "2311-00", status: "ativo" },
  { id: 4, codigo: "PRO004", descricao: "Enfermeiro", cbo: "2235-05", status: "inativo" },
];

export default function Profissoes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockProfissoes.filter((p) =>
    p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAtivos = mockProfissoes.filter((p) => p.status === "ativo").length;
  const totalInativos = mockProfissoes.filter((p) => p.status === "inativo").length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Profissões</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Profissões
          </h1>
          <p className="text-muted-foreground">Cadastro de profissões (CBO)</p>
        </div>
        <Button onClick={() => navigate("/cadastro/profissoes/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Profissão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Profissões"
          value={mockProfissoes.length}
          icon={Briefcase}
          variant="primary"
        />
        <StatCard
          title="Profissões Ativas"
          value={totalAtivos}
          variant="success"
        />
        <StatCard
          title="Profissões Inativas"
          value={totalInativos}
          variant="default"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar profissão..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>CBO</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.cbo}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/profissoes/${item.id}`)}
                      onDelete={item.status === "inativo" ? () => {} : undefined}
                      isActive={item.status === "ativo"}
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

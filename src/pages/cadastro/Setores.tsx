import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Layers, Search, Plus, Filter, X } from "lucide-react";
import { StatusBadge, TableActions, StatCard } from "@/components/shared";

const mockSetores = [
  { id: 1, codigo: "SET001", nome: "Recepção", unidade: "Unidade Centro", tipo: "Administrativo", status: "ativo" },
  { id: 2, codigo: "SET002", nome: "Coleta", unidade: "Unidade Centro", tipo: "Técnico", status: "ativo" },
  { id: 3, codigo: "SET003", nome: "Bioquímica", unidade: "Unidade Centro", tipo: "Técnico", status: "ativo" },
  { id: 4, codigo: "SET004", nome: "Hematologia", unidade: "Unidade Zona Sul", tipo: "Técnico", status: "ativo" },
  { id: 5, codigo: "SET005", nome: "Microbiologia", unidade: "Unidade Campinas", tipo: "Técnico", status: "inativo" },
];

export default function Setores() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSetores = mockSetores.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tecnicos = mockSetores.filter((s) => s.tipo === "Técnico").length;
  const administrativos = mockSetores.filter((s) => s.tipo === "Administrativo").length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Setores</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Setores
          </h1>
          <p className="text-muted-foreground">Gerencie os setores organizacionais</p>
        </div>
        <Button onClick={() => navigate("/cadastro/setores/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Setor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Setores"
          value={mockSetores.length}
          icon={Layers}
          variant="primary"
        />
        <StatCard
          title="Setores Técnicos"
          value={tecnicos}
          variant="primary"
        />
        <StatCard
          title="Setores Administrativos"
          value={administrativos}
          variant="success"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm text-muted-foreground mb-1 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Código ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
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
                <TableHead>Unidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSetores.map((setor) => (
                <TableRow key={setor.id}>
                  <TableCell className="font-mono">{setor.codigo}</TableCell>
                  <TableCell className="font-medium">{setor.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{setor.unidade}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={setor.tipo === "Técnico" ? "border-primary/30 bg-primary/5 text-primary" : "border-verde-clinico/30 bg-verde-clinico/5 text-verde-clinico"}>
                      {setor.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={setor.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onView={() => navigate(`/cadastro/setores/${setor.id}`)}
                      onDelete={setor.status === "inativo" ? () => {} : undefined}
                      isActive={setor.status === "ativo"}
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

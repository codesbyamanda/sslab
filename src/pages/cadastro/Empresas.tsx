import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Building2, Search, Plus, Eye, Trash2, Filter, X } from "lucide-react";

const mockEmpresas = [
  { id: 1, codigo: "EMP001", razaoSocial: "Laboratório Central Ltda", cnpj: "12.345.678/0001-90", status: "ativo", unidades: 3 },
  { id: 2, codigo: "EMP002", razaoSocial: "Clínica Saúde Total S.A.", cnpj: "98.765.432/0001-10", status: "ativo", unidades: 5 },
  { id: 3, codigo: "EMP003", razaoSocial: "Centro Diagnóstico Vida", cnpj: "11.222.333/0001-44", status: "inativo", unidades: 2 },
];

export default function Empresas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmpresas = mockEmpresas.filter(
    (emp) =>
      emp.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/cadastro">Cadastro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Empresas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Empresas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as empresas do grupo (estrutura hierárquica)
          </p>
        </div>
        <Button onClick={() => navigate("/cadastro/empresas/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Empresas</p>
                <p className="text-2xl font-bold">{mockEmpresas.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empresas Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockEmpresas.filter((e) => e.status === "ativo").length}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Unidades</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockEmpresas.reduce((acc, e) => acc + e.unidades, 0)}
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">Vinculadas</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm text-muted-foreground mb-1 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Código ou Razão Social..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="ghost" onClick={() => setSearchTerm("")}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Unidades</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-mono">{empresa.codigo}</TableCell>
                  <TableCell className="font-medium">{empresa.razaoSocial}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell className="text-center">{empresa.unidades}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={empresa.status === "ativo" ? "default" : "secondary"}>
                      {empresa.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/cadastro/empresas/${empresa.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        disabled={empresa.status === "ativo"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmpresas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  Building2, 
  Filter, 
  Plus,
  Eye,
  Edit,
  CreditCard,
  FileText,
  Printer,
  FileCheck,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for demonstration
const mockAtendimentos = [
  {
    id: "REQ-2024-001234",
    paciente: "Maria Silva Santos",
    data: "10/12/2024",
    convenios: ["Unimed", "SulAmérica"],
    situacao: "Liberado",
    medico: "Dr. João Carlos",
    unidade: "Unidade Centro"
  },
  {
    id: "REQ-2024-001235",
    paciente: "José Oliveira",
    data: "10/12/2024",
    convenios: ["Bradesco Saúde"],
    situacao: "Pendente",
    medico: "Dra. Ana Paula",
    unidade: "Unidade Norte"
  },
  {
    id: "REQ-2024-001236",
    paciente: "Ana Carolina Mendes",
    data: "09/12/2024",
    convenios: ["Particular"],
    situacao: "Executado",
    medico: "Dr. Roberto Lima",
    unidade: "Unidade Centro"
  },
  {
    id: "REQ-2024-001237",
    paciente: "Carlos Eduardo Silva",
    data: "09/12/2024",
    convenios: ["Amil"],
    situacao: "Aberto",
    medico: "Dra. Fernanda Costa",
    unidade: "Unidade Sul"
  },
  {
    id: "REQ-2024-001238",
    paciente: "Fernanda Almeida",
    data: "08/12/2024",
    convenios: ["Unimed"],
    situacao: "Cancelado",
    medico: "Dr. Pedro Henrique",
    unidade: "Unidade Centro"
  },
];

const situacaoStyles: Record<string, string> = {
  "Liberado": "bg-verde-clinico/10 text-verde-clinico",
  "Pendente": "bg-ambar-suave/10 text-ambar-suave",
  "Executado": "bg-primary/10 text-primary",
  "Aberto": "bg-muted text-muted-foreground",
  "Cancelado": "bg-vermelho-moderno/10 text-vermelho-moderno",
};

const AtendimentosListagem = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [convenioFilter, setConvenioFilter] = useState("");
  const [situacaoFilter, setSituacaoFilter] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Listagem de Atendimentos</h1>
        <p className="text-muted-foreground mt-1">Gestão e consulta de requisições de atendimento</p>
      </div>

      {/* Filters Card */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Filtros de Pesquisa</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Field */}
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Buscar por nome, CPF ou nº da requisição
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Digite para buscar..." 
                className="pl-10 input-premium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Data do atendimento
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                className="pl-10 input-premium"
              />
            </div>
          </div>

          {/* Convenio Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Convênio
            </label>
            <Select value={convenioFilter} onValueChange={setConvenioFilter}>
              <SelectTrigger className="input-premium">
                <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Todos os convênios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os convênios</SelectItem>
                <SelectItem value="unimed">Unimed</SelectItem>
                <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                <SelectItem value="sulamerica">SulAmérica</SelectItem>
                <SelectItem value="amil">Amil</SelectItem>
                <SelectItem value="particular">Particular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Situacao Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Situação
            </label>
            <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
              <SelectTrigger className="input-premium">
                <SelectValue placeholder="Todas as situações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as situações</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="executado">Executado</SelectItem>
                <SelectItem value="liberado">Liberado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-3 flex items-end gap-3">
            <Button className="btn-secondary-premium">
              <Filter className="h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="ghost" className="btn-ghost-premium">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Resultados</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mockAtendimentos.length} atendimentos encontrados
            </p>
          </div>
          <Button 
            className="btn-primary-premium"
            onClick={() => navigate("/atendimento/atendimentos/novo")}
          >
            <Plus className="h-4 w-4" />
            Novo Atendimento
          </Button>
        </div>

        <Table className="table-premium">
          <TableHeader>
            <TableRow>
              <TableHead>Nº Requisição</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Convênio(s)</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Médico Solicitante</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAtendimentos.map((atendimento) => (
              <TableRow key={atendimento.id}>
                <TableCell className="font-medium text-primary">
                  {atendimento.id}
                </TableCell>
                <TableCell className="font-medium">{atendimento.paciente}</TableCell>
                <TableCell>{atendimento.data}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {atendimento.convenios.map((convenio, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                      >
                        {convenio}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${situacaoStyles[atendimento.situacao]}`}>
                    {atendimento.situacao}
                  </span>
                </TableCell>
                <TableCell>{atendimento.medico}</TableCell>
                <TableCell>{atendimento.unidade}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Abrir requisição</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Pagamentos</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Laudos</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Imprimir</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Exibir guias</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Exibindo 1-5 de 156 resultados
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendimentosListagem;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList,
  Building2,
  Settings,
  Stethoscope,
  Beaker,
  Save,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";
import ServicoModal from "@/components/atendimento/ServicoModal";

// Mock data
const mockConvenios = [
  { id: 1, nome: "Unimed", plano: "Executivo", matricula: "0001234567", situacao: "Ativo" },
];

const mockMedicos = [
  { id: 1, nome: "Dr. João Carlos", crm: "12345-SP", especialidade: "Clínico Geral" },
];

const mockServicos = [
  { 
    id: 1, 
    codigo: "HMG", 
    descricao: "Hemograma Completo", 
    situacao: "Colhido",
    urgencia: "Normal",
    convenio: "Unimed",
    medico: "Dr. João Carlos",
    material: "Sangue Total",
    dataColeta: "10/12/2024",
    horaColeta: "08:30",
    valor: 45.00
  },
  { 
    id: 2, 
    codigo: "GLICO", 
    descricao: "Glicose", 
    situacao: "Pendente",
    urgencia: "Urgente",
    convenio: "Unimed",
    medico: "Dr. João Carlos",
    material: "Soro",
    dataColeta: "-",
    horaColeta: "-",
    valor: 25.00
  },
];

const situacaoStyles: Record<string, string> = {
  "Colhido": "bg-verde-clinico/10 text-verde-clinico",
  "Pendente": "bg-ambar-suave/10 text-ambar-suave",
  "Executado": "bg-primary/10 text-primary",
  "Cancelado": "bg-vermelho-moderno/10 text-vermelho-moderno",
};

const RequisicaoCadastro = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("convenios");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [servicoModalOpen, setServicoModalOpen] = useState(false);

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro de Requisição</h1>
          <p className="text-muted-foreground mt-1">Registro de atendimento e serviços</p>
        </div>
      </div>

      {/* Initial Info Card */}
      <div className="card-premium p-6">
        <h2 className="font-semibold text-foreground mb-4">Informações Iniciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Nº Requisição */}
          <div>
            <Label className="text-sm font-medium text-foreground">Nº da Requisição</Label>
            <Input 
              className="input-premium mt-1.5 bg-muted" 
              value="REQ-2024-001239" 
              disabled 
            />
          </div>

          {/* Data do Atendimento */}
          <div>
            <Label className="text-sm font-medium text-foreground">Data do Atendimento</Label>
            <Input 
              type="date" 
              className="input-premium mt-1.5" 
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Tipo de Atendimento */}
          <div>
            <Label className="text-sm font-medium text-foreground">Tipo de Atendimento</Label>
            <Select>
              <SelectTrigger className="input-premium mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rotina">Rotina</SelectItem>
                <SelectItem value="urgencia">Urgência</SelectItem>
                <SelectItem value="emergencia">Emergência</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Empresa */}
          <div>
            <Label className="text-sm font-medium text-foreground">Empresa</Label>
            <Select>
              <SelectTrigger className="input-premium mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matriz">Matriz</SelectItem>
                <SelectItem value="filial1">Filial 1</SelectItem>
                <SelectItem value="filial2">Filial 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unidade */}
          <div>
            <Label className="text-sm font-medium text-foreground">Unidade</Label>
            <Select>
              <SelectTrigger className="input-premium mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centro">Unidade Centro</SelectItem>
                <SelectItem value="norte">Unidade Norte</SelectItem>
                <SelectItem value="sul">Unidade Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paciente */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium text-foreground">Paciente *</Label>
            <div className="flex gap-2 mt-1.5">
              <Input className="input-premium flex-1" placeholder="Digite para buscar paciente..." />
              <Button className="btn-secondary-premium px-3">
                <Search className="h-4 w-4" />
              </Button>
              <Button className="btn-secondary-premium px-3">
                <Edit className="h-4 w-4" />
              </Button>
              <Button className="btn-primary-premium px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="card-premium">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="bg-transparent h-auto p-0 gap-6">
              <TabsTrigger 
                value="convenios" 
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Convênios
              </TabsTrigger>
              <TabsTrigger 
                value="geral"
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <Settings className="h-4 w-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger 
                value="medicos"
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Médicos Solicitantes
              </TabsTrigger>
              <TabsTrigger 
                value="servicos"
                className={cn(
                  "pb-3 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "text-muted-foreground data-[state=active]:text-foreground font-medium"
                )}
              >
                <Beaker className="h-4 w-4 mr-2" />
                Serviços
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1 - Convênios */}
          <TabsContent value="convenios" className="p-6 mt-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Gerencie os convênios vinculados a esta requisição
              </p>
              <div className="flex gap-2">
                <Button className="btn-primary-premium">
                  <Plus className="h-4 w-4" />
                  Adicionar Convênio
                </Button>
              </div>
            </div>

            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockConvenios.map((convenio) => (
                  <TableRow key={convenio.id}>
                    <TableCell className="font-medium">{convenio.nome}</TableCell>
                    <TableCell>{convenio.plano}</TableCell>
                    <TableCell>{convenio.matricula}</TableCell>
                    <TableCell>
                      <span className="badge-success">{convenio.situacao}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Tab 2 - Geral */}
          <TabsContent value="geral" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CID */}
              <div>
                <Label className="text-sm font-medium text-foreground">CID</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input className="input-premium flex-1" placeholder="Buscar CID..." />
                  <Button className="btn-secondary-premium px-3">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tipo Doença */}
              <div>
                <Label className="text-sm font-medium text-foreground">Tipo Doença</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aguda">Aguda</SelectItem>
                    <SelectItem value="cronica">Crônica</SelectItem>
                    <SelectItem value="naoInformado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tempo de Doença */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-foreground">Tempo de Doença</Label>
                  <Input type="number" className="input-premium mt-1.5" placeholder="0" />
                </div>
                <div className="w-32">
                  <Label className="text-sm font-medium text-foreground">Unidade</Label>
                  <Select>
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue placeholder="Dias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dias">Dias</SelectItem>
                      <SelectItem value="meses">Meses</SelectItem>
                      <SelectItem value="anos">Anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tipo de Saída */}
              <div>
                <Label className="text-sm font-medium text-foreground">Tipo de Saída</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="obito">Óbito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicação de Acidente */}
              <div>
                <Label className="text-sm font-medium text-foreground">Indicação de Acidente</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="trabalho">Acidente de Trabalho</SelectItem>
                    <SelectItem value="transito">Acidente de Trânsito</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data da Solicitação */}
              <div>
                <Label className="text-sm font-medium text-foreground">Data da Solicitação</Label>
                <Input type="date" className="input-premium mt-1.5" />
              </div>

              {/* Caráter da Solicitação */}
              <div>
                <Label className="text-sm font-medium text-foreground">Caráter da Solicitação</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eletivo">Eletivo</SelectItem>
                    <SelectItem value="urgencia">Urgência/Emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicação Clínica */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium text-foreground">Indicação Clínica</Label>
                <Input className="input-premium mt-1.5" placeholder="Descreva a indicação clínica" />
              </div>

              {/* Divisor - Entrega */}
              <div className="lg:col-span-3 border-t border-border pt-6 mt-2">
                <h3 className="font-semibold text-foreground mb-4">Informações de Entrega</h3>
              </div>

              {/* Data de Entrega */}
              <div>
                <Label className="text-sm font-medium text-foreground">Data de Entrega (calculada)</Label>
                <Input type="date" className="input-premium mt-1.5 bg-muted" disabled />
              </div>

              {/* Adicional de Dias */}
              <div>
                <Label className="text-sm font-medium text-foreground">Adicional de Dias</Label>
                <Input type="number" className="input-premium mt-1.5" placeholder="0" />
              </div>

              {/* Hora de Entrega */}
              <div>
                <Label className="text-sm font-medium text-foreground">Hora de Entrega</Label>
                <Input type="time" className="input-premium mt-1.5" />
              </div>

              {/* Destino do Laudo */}
              <div>
                <Label className="text-sm font-medium text-foreground">Destino do Laudo</Label>
                <Select>
                  <SelectTrigger className="input-premium mt-1.5">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balcao">Retirar no Balcão</SelectItem>
                    <SelectItem value="email">Enviar por E-mail</SelectItem>
                    <SelectItem value="correio">Enviar por Correio</SelectItem>
                    <SelectItem value="medico">Entregar ao Médico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dados Clínicos */}
              <div className="lg:col-span-3">
                <Label className="text-sm font-medium text-foreground">Dados Clínicos (observações para área técnica)</Label>
                <Textarea 
                  className="input-premium mt-1.5 min-h-[100px] resize-none" 
                  placeholder="Observações relevantes para a área técnica..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3 - Médicos Solicitantes */}
          <TabsContent value="medicos" className="p-6 mt-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Gerencie os médicos solicitantes vinculados a esta requisição
              </p>
              <Button className="btn-primary-premium">
                <Plus className="h-4 w-4" />
                Adicionar Médico
              </Button>
            </div>

            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRM</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMedicos.map((medico) => (
                  <TableRow key={medico.id}>
                    <TableCell className="font-medium">{medico.nome}</TableCell>
                    <TableCell>{medico.crm}</TableCell>
                    <TableCell>{medico.especialidade}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Tab 4 - Serviços */}
          <TabsContent value="servicos" className="p-6 mt-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Serviços/exames vinculados a esta requisição
              </p>
              <Button 
                className="btn-primary-premium"
                onClick={() => setServicoModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar Serviço
              </Button>
            </div>

            <Table className="table-premium">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Data/Hora Coleta</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockServicos.map((servico) => (
                  <>
                    <TableRow key={servico.id}>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => toggleRowExpansion(servico.id)}
                        >
                          {expandedRows.includes(servico.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono font-medium text-primary">
                        {servico.codigo}
                      </TableCell>
                      <TableCell className="font-medium">{servico.descricao}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${situacaoStyles[servico.situacao]}`}>
                          {servico.situacao}
                        </span>
                      </TableCell>
                      <TableCell>
                        {servico.urgencia === "Urgente" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-vermelho-moderno">
                            <AlertTriangle className="h-3 w-3" />
                            {servico.urgencia}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{servico.urgencia}</span>
                        )}
                      </TableCell>
                      <TableCell>{servico.convenio}</TableCell>
                      <TableCell>{servico.material}</TableCell>
                      <TableCell>
                        {servico.dataColeta !== "-" 
                          ? `${servico.dataColeta} ${servico.horaColeta}`
                          : <span className="text-muted-foreground">-</span>
                        }
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {servico.valor.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancelar serviço</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row */}
                    {expandedRows.includes(servico.id) && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={10} className="p-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                Informações do Convênio
                              </h4>
                              <div className="text-sm space-y-1 pl-6">
                                <p><span className="text-muted-foreground">Convênio:</span> {servico.convenio}</p>
                                <p><span className="text-muted-foreground">Tabela:</span> CBHPM 5ª Edição</p>
                                <p><span className="text-muted-foreground">Valor Tabela:</span> R$ {servico.valor.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Médico(s) Solicitante(s)
                              </h4>
                              <div className="text-sm space-y-1 pl-6">
                                <p><span className="text-muted-foreground">Médico:</span> {servico.medico}</p>
                                <p><span className="text-muted-foreground">CRM:</span> 12345-SP</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>

            {/* Total */}
            <div className="flex justify-end mt-4 pt-4 border-t border-border">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total dos Serviços</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {mockServicos.reduce((acc, s) => acc + s.valor, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button variant="outline" className="btn-secondary-premium" onClick={() => navigate(-1)}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button className="btn-primary-premium">
            <Save className="h-4 w-4" />
            Salvar Requisição
          </Button>
        </div>
      </div>

      {/* Serviço Modal */}
      <ServicoModal 
        open={servicoModalOpen} 
        onOpenChange={setServicoModalOpen} 
      />
    </div>
  );
};

export default RequisicaoCadastro;

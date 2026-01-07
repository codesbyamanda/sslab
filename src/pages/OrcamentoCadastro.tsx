import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Printer, X, Plus, Trash2, Search, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";

// Mock patients
const mockPatients = [
  { id: 1, nome: "Maria Silva Santos", cpf: "123.456.789-00", codigo: "PAC001" },
  { id: 2, nome: "João Pedro Oliveira", cpf: "234.567.890-11", codigo: "PAC002" },
  { id: 3, nome: "Ana Carolina Souza", cpf: "345.678.901-22", codigo: "PAC003" },
  { id: 4, nome: "Carlos Eduardo Lima", cpf: "456.789.012-33", codigo: "PAC004" },
  { id: 5, nome: "Fernanda Costa", cpf: "567.890.123-44", codigo: "PAC005" },
];

// Mock services/exams
const mockServices = [
  { id: 1, codigo: "HEM001", descricao: "Hemograma Completo", precoBase: 35.00, precoUnimed: 28.00, precoBradesco: 30.00, precoSulamerica: 29.00 },
  { id: 2, codigo: "GLI001", descricao: "Glicemia em Jejum", precoBase: 15.00, precoUnimed: 12.00, precoBradesco: 13.00, precoSulamerica: 12.50 },
  { id: 3, codigo: "COL001", descricao: "Colesterol Total e Frações", precoBase: 45.00, precoUnimed: 38.00, precoBradesco: 40.00, precoSulamerica: 39.00 },
  { id: 4, codigo: "TIR001", descricao: "TSH e T4 Livre", precoBase: 80.00, precoUnimed: 65.00, precoBradesco: 70.00, precoSulamerica: 68.00 },
  { id: 5, codigo: "URI001", descricao: "Urina Tipo 1", precoBase: 20.00, precoUnimed: 16.00, precoBradesco: 17.00, precoSulamerica: 16.50 },
  { id: 6, codigo: "CRE001", descricao: "Creatinina", precoBase: 18.00, precoUnimed: 14.00, precoBradesco: 15.00, precoSulamerica: 14.50 },
  { id: 7, codigo: "URE001", descricao: "Ureia", precoBase: 18.00, precoUnimed: 14.00, precoBradesco: 15.00, precoSulamerica: 14.50 },
  { id: 8, codigo: "TGO001", descricao: "TGO/TGP", precoBase: 30.00, precoUnimed: 24.00, precoBradesco: 26.00, precoSulamerica: 25.00 },
];

interface ServiceItem {
  id: number;
  codigo: string;
  descricao: string;
  precoBase: number;
  precoConvenio: number;
  quantidade: number;
  subtotal: number;
}

const OrcamentoCadastro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "novo";

  // Patient selection
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [manualPatientName, setManualPatientName] = useState(""); // For non-registered patients

  // Form fields
  const [convenio, setConvenio] = useState("");
  const [plano, setPlano] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Services
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState(mockServices);

  // Financial summary
  const [desconto, setDesconto] = useState(0);
  const totalExames = services.reduce((acc, s) => acc + s.subtotal, 0);
  const valorFinal = Math.max(0, totalExames - desconto);

  // Print modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Filter patients
  useEffect(() => {
    if (patientSearch) {
      const filtered = mockPatients.filter(p =>
        p.nome.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.cpf.includes(patientSearch) ||
        p.codigo.toLowerCase().includes(patientSearch.toLowerCase())
      );
      setFilteredPatients(filtered);
      setPatientDropdownOpen(filtered.length > 0);
    } else {
      setFilteredPatients(mockPatients);
      setPatientDropdownOpen(false);
    }
  }, [patientSearch]);

  // Handle blur - if no patient selected, use typed name as manual patient
  const handlePatientInputBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      if (!selectedPatient && patientSearch.trim()) {
        setManualPatientName(patientSearch.trim());
      }
      setPatientDropdownOpen(false);
    }, 200);
  };

  // Clear manual patient when a registered patient is selected
  const selectPatientAndClearManual = (patient: typeof mockPatients[0]) => {
    setSelectedPatient(patient);
    setManualPatientName("");
    setPatientSearch("");
    setPatientDropdownOpen(false);
  };

  // Filter services
  useEffect(() => {
    if (serviceSearch) {
      const filtered = mockServices.filter(s =>
        s.descricao.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.codigo.toLowerCase().includes(serviceSearch.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(mockServices);
    }
  }, [serviceSearch]);

  const clearPatientSelection = () => {
    setSelectedPatient(null);
    setManualPatientName("");
    setPatientSearch("");
  };

  const getServicePrice = (service: typeof mockServices[0], convenioName: string): number => {
    switch (convenioName) {
      case "Unimed":
        return service.precoUnimed;
      case "Bradesco Saúde":
        return service.precoBradesco;
      case "SulAmérica":
        return service.precoSulamerica;
      default:
        return service.precoBase;
    }
  };

  const addService = (service: typeof mockServices[0]) => {
    const existingIndex = services.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      // Increment quantity
      const updated = [...services];
      updated[existingIndex].quantidade += 1;
      updated[existingIndex].subtotal = updated[existingIndex].quantidade * updated[existingIndex].precoConvenio;
      setServices(updated);
    } else {
      // Add new service
      const precoConvenio = getServicePrice(service, convenio);
      setServices([
        ...services,
        {
          id: service.id,
          codigo: service.codigo,
          descricao: service.descricao,
          precoBase: service.precoBase,
          precoConvenio,
          quantidade: 1,
          subtotal: precoConvenio
        }
      ]);
    }
    
    setServiceModalOpen(false);
    setServiceSearch("");
    toast({
      title: "Serviço adicionado",
      description: `${service.descricao} foi adicionado ao orçamento.`
    });
  };

  const removeService = (serviceId: number) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, quantity: number) => {
    if (quantity < 1) return;
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          quantidade: quantity,
          subtotal: quantity * s.precoConvenio
        };
      }
      return s;
    });
    setServices(updated);
  };

  // Update prices when convenio changes
  useEffect(() => {
    if (services.length > 0) {
      const updated = services.map(s => {
        const originalService = mockServices.find(ms => ms.id === s.id);
        if (originalService) {
          const precoConvenio = getServicePrice(originalService, convenio);
          return {
            ...s,
            precoConvenio,
            subtotal: s.quantidade * precoConvenio
          };
        }
        return s;
      });
      setServices(updated);
    }
  }, [convenio]);

  // Get patient name for display (registered or manual)
  const getPatientDisplayName = () => {
    if (selectedPatient) return selectedPatient.nome;
    if (manualPatientName) return manualPatientName;
    return "-";
  };

  const handleSave = () => {
    if (!selectedPatient && !manualPatientName) {
      toast({
        title: "Erro",
        description: "Informe o nome do paciente para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (services.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um serviço ao orçamento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Orçamento salvo",
      description: "O orçamento foi salvo com sucesso."
    });
    navigate("/atendimento/orcamento");
  };

  const handleSaveAndPrint = () => {
    if (!selectedPatient && !manualPatientName) {
      toast({
        title: "Erro",
        description: "Informe o nome do paciente para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (services.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um serviço ao orçamento.",
        variant: "destructive"
      });
      return;
    }

    setPrintModalOpen(true);
  };

  const handleDownloadPdf = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast({
        title: "PDF gerado com sucesso",
        description: "O arquivo foi baixado para sua máquina."
      });
      setPrintModalOpen(false);
      navigate("/atendimento/orcamento");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AtendimentoSidebar />
      
      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isEditing ? "Editar Orçamento" : "Novo Orçamento"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Crie uma simulação de preços de exames para o paciente.
              </p>
            </div>

            {/* Seção 1 - Dados do Paciente */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Dados do Paciente</CardTitle>
                <CardDescription>Selecione o paciente e informe o convênio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Search */}
                <div className="relative">
                  <Label className="mb-1.5 block">Paciente</Label>
                  {selectedPatient ? (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div>
                        <p className="font-medium">{selectedPatient.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPatient.codigo} • {selectedPatient.cpf}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearPatientSelection}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : manualPatientName ? (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-amber-400">
                      <div>
                        <p className="font-medium">{manualPatientName}</p>
                        <p className="text-sm text-amber-600">
                          Paciente não cadastrado
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearPatientSelection}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Digite o nome ou busque por CPF/código..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          onBlur={handlePatientInputBlur}
                          className="pl-9"
                        />
                      </div>
                      {patientDropdownOpen && filteredPatients.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredPatients.map(patient => (
                            <button
                              key={patient.id}
                              onClick={() => selectPatientAndClearManual(patient)}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors border-b last:border-0"
                            >
                              <p className="font-medium">{patient.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {patient.codigo} • {patient.cpf}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                      {patientSearch && filteredPatients.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Nenhum paciente encontrado. O nome digitado será usado como paciente avulso.
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 block">Convênio</Label>
                    <Select value={convenio} onValueChange={setConvenio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o convênio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Particular">Particular</SelectItem>
                        <SelectItem value="Unimed">Unimed</SelectItem>
                        <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                        <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-1.5 block">Plano</Label>
                    <Select value={plano} onValueChange={setPlano}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="executivo">Executivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block">Observações Gerais</Label>
                  <Textarea
                    placeholder="Observações sobre o orçamento..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção 2 - Serviços/Exames */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Serviços / Exames</CardTitle>
                    <CardDescription>Adicione os exames ao orçamento.</CardDescription>
                  </div>
                  <Button onClick={() => setServiceModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Serviço
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Código</TableHead>
                        <TableHead className="font-semibold">Descrição</TableHead>
                        <TableHead className="font-semibold text-right">Preço Base</TableHead>
                        <TableHead className="font-semibold text-right">Preço Convênio</TableHead>
                        <TableHead className="font-semibold text-center w-24">Qtd</TableHead>
                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                        <TableHead className="font-semibold text-center w-16">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.codigo}</TableCell>
                            <TableCell>{service.descricao}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              R$ {service.precoBase.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {service.precoConvenio.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min={1}
                                value={service.quantidade}
                                onChange={(e) => updateQuantity(service.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center mx-auto"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {service.subtotal.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeService(service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Seção 3 - Resumo Financeiro */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total dos Exames</p>
                    <p className="text-xl font-semibold">
                      R$ {totalExames.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm text-muted-foreground mb-1 block">Desconto (R$)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={desconto}
                      onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Valor Final</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {valorFinal.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate("/atendimento/orcamento")} className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button variant="secondary" onClick={handleSaveAndPrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Salvar e Imprimir
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Service Selection Modal */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>
              Busque e selecione o exame para adicionar ao orçamento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou descrição..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-64 overflow-auto border rounded-md">
              {filteredServices.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum serviço encontrado.
                </div>
              ) : (
                filteredServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => addService(service)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-0 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{service.descricao}</p>
                      <p className="text-sm text-muted-foreground">{service.codigo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        R$ {getServicePrice(service, convenio).toFixed(2).replace(".", ",")}
                      </p>
                      {convenio && convenio !== "Particular" && (
                        <p className="text-xs text-muted-foreground line-through">
                          R$ {service.precoBase.toFixed(2).replace(".", ",")}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={printModalOpen} onOpenChange={setPrintModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Impressão do Orçamento
            </DialogTitle>
            <DialogDescription>
              Visualize o resumo e baixe o PDF do orçamento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paciente:</span>
                <span className="text-sm font-medium">{getPatientDisplayName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Convênio:</span>
                <span className="text-sm font-medium">{convenio || "Particular"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Qtd. Exames:</span>
                <span className="text-sm font-medium">{services.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Exames:</span>
                <span className="text-sm font-medium">
                  R$ {totalExames.toFixed(2).replace(".", ",")}
                </span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Desconto:</span>
                  <span className="text-sm font-medium text-destructive">
                    - R$ {desconto.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Valor Final:</span>
                <span className="text-base font-semibold text-primary">
                  R$ {valorFinal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isPrinting} className="gap-2">
              {isPrinting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrcamentoCadastro;

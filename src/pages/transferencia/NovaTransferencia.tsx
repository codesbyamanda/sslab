import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, FileText, Save, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const documentos = [
  { id: "prontuario", label: "Prontuário Médico" },
  { id: "exames", label: "Resultados de Exames" },
  { id: "prescricoes", label: "Prescrições Médicas" },
  { id: "evolucao", label: "Evolução de Enfermagem" },
  { id: "laudos", label: "Laudos de Imagem" },
  { id: "outros", label: "Outros Documentos" }
];

const unidades = [
  "UTI Adulto",
  "UTI Pediátrica",
  "UTI Coronariana",
  "Centro Cirúrgico",
  "Emergência",
  "Pronto Socorro",
  "Enfermaria 1",
  "Enfermaria 2",
  "Enfermaria 3",
  "Ambulatório",
  "Internação"
];

const instituicoes = [
  "Hospital Central",
  "Hospital Regional",
  "Hospital Especializado",
  "Clínica São Paulo",
  "UPA Centro"
];

const NovaTransferencia = () => {
  const navigate = useNavigate();
  const [tipoTransferencia, setTipoTransferencia] = useState("interna");
  const [tipoProntuario, setTipoProntuario] = useState("completo");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [paciente, setPaciente] = useState({
    nome: "",
    documento: "",
    atendimento: ""
  });

  const handleDocChange = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, docId]);
    } else {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    }
  };

  const handleSelectAllDocs = () => {
    if (selectedDocs.length === documentos.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documentos.map(d => d.id));
    }
  };

  const handleSubmit = () => {
    toast.success("Transferência criada com sucesso!");
    navigate("/transferencia/lista");
  };

  const handleSearchPatient = () => {
    // Simula busca de paciente
    setPaciente({
      nome: "Maria Silva Santos",
      documento: "123.456.789-00",
      atendimento: "ATD-2026-00145"
    });
    toast.info("Paciente encontrado!");
  };

  return (
    <TransferenciaLayout title="Nova Transferência">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/transferencia/lista")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Nova Transferência</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Registre uma nova transferência de paciente ou prontuário
            </p>
          </div>
        </div>

        {/* Patient Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="searchPatient">Buscar Paciente</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="searchPatient"
                    placeholder="Nome, CPF ou código do atendimento..."
                    className="flex-1"
                  />
                  <Button variant="secondary" onClick={handleSearchPatient}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            {paciente.nome && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{paciente.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{paciente.documento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atendimento</p>
                  <p className="font-medium text-primary">{paciente.atendimento}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transfer Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dados da Transferência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Transferência */}
            <div className="space-y-3">
              <Label>Tipo de Transferência</Label>
              <RadioGroup 
                value={tipoTransferencia} 
                onValueChange={setTipoTransferencia}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interna" id="interna" />
                  <Label htmlFor="interna" className="font-normal cursor-pointer">
                    Interna (setor/unidade)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="externa" id="externa" />
                  <Label htmlFor="externa" className="font-normal cursor-pointer">
                    Externa (outra instituição)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Origem e Destino */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoTransferencia === "interna" ? (
                      unidades.map((unidade) => (
                        <SelectItem key={unidade} value={unidade}>
                          {unidade}
                        </SelectItem>
                      ))
                    ) : (
                      instituicoes.map((inst) => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input type="date" id="data" defaultValue="2026-01-02" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora</Label>
                <Input type="time" id="hora" defaultValue="14:30" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prontuário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prontuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Prontuário */}
            <div className="space-y-3">
              <Label>Transferência de Prontuário</Label>
              <RadioGroup 
                value={tipoProntuario} 
                onValueChange={setTipoProntuario}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completo" id="completo" />
                  <Label htmlFor="completo" className="font-normal cursor-pointer">
                    Completo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parcial" id="parcial" />
                  <Label htmlFor="parcial" className="font-normal cursor-pointer">
                    Parcial
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {tipoProntuario === "parcial" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Documentos a Transferir</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSelectAllDocs}
                    >
                      {selectedDocs.length === documentos.length ? "Desmarcar todos" : "Selecionar todos"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {documentos.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={doc.id}
                          checked={selectedDocs.includes(doc.id)}
                          onCheckedChange={(checked) => handleDocChange(doc.id, checked as boolean)}
                        />
                        <Label htmlFor={doc.id} className="font-normal cursor-pointer">
                          {doc.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Observações adicionais sobre a transferência..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/transferencia/lista")}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Transferência
          </Button>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default NovaTransferencia;

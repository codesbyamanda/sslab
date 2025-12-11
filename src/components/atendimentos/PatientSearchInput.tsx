import { useState, useRef, useEffect } from "react";
import { Search, Plus, Edit, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Patient {
  id: number;
  codigo: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  convenio?: string;
}

const mockPatients: Patient[] = [
  { id: 1, codigo: "PAC001", nome: "Maria Santos Silva", cpf: "123.456.789-00", dataNascimento: "1985-03-15", convenio: "Unimed" },
  { id: 2, codigo: "PAC002", nome: "João Pedro Oliveira", cpf: "234.567.890-11", dataNascimento: "1990-07-22", convenio: "Bradesco Saúde" },
  { id: 3, codigo: "PAC003", nome: "Fernanda Lima Costa", cpf: "345.678.901-22", dataNascimento: "1978-11-08", convenio: "Particular" },
  { id: 4, codigo: "PAC004", nome: "Carlos Alberto Nunes", cpf: "456.789.012-33", dataNascimento: "1965-05-30", convenio: "SulAmérica" },
  { id: 5, codigo: "PAC005", nome: "Ana Beatriz Ferreira", cpf: "567.890.123-44", dataNascimento: "2000-01-12", convenio: "Amil" },
];

interface PatientSearchInputProps {
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
  onAddNew?: () => void;
  onEdit?: (patient: Patient) => void;
}

const PatientSearchInput = ({ selectedPatient, onSelectPatient, onAddNew, onEdit }: PatientSearchInputProps) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.length >= 2) {
      const filtered = mockPatients.filter(
        (p) =>
          p.nome.toLowerCase().includes(search.toLowerCase()) ||
          p.cpf.includes(search) ||
          p.codigo.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowDropdown(true);
    } else {
      setFilteredPatients([]);
      setShowDropdown(false);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    setSearch("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.length >= 2) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          {selectedPatient ? (
            <div className="flex items-center gap-3 h-11 px-4 rounded-lg border border-border bg-muted/50">
              <User className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <span className="font-medium text-foreground">{selectedPatient.nome}</span>
                <span className="text-muted-foreground ml-2">({selectedPatient.codigo})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                onClick={() => onSelectPatient(null)}
              >
                Limpar
              </Button>
            </div>
          ) : (
            <>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Digite o nome, CPF ou código do paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 input-premium"
              />
            </>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => inputRef.current?.focus()}>
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Pesquisar Paciente</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11" onClick={onAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Adicionar Novo Paciente</TooltipContent>
        </Tooltip>

        {selectedPatient && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => onEdit?.(selectedPatient)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar Paciente</TooltipContent>
          </Tooltip>
        )}
      </div>

      {showDropdown && filteredPatients.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-0"
                onClick={() => handleSelectPatient(patient)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{patient.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient.codigo} • CPF: {patient.cpf}
                    </div>
                  </div>
                  {patient.convenio && (
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {patient.convenio}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDropdown && search.length >= 2 && filteredPatients.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground">
          Nenhum paciente encontrado.
        </div>
      )}
    </div>
  );
};

export default PatientSearchInput;

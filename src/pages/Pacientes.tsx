import { useState } from "react";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AtendimentoSidebar from "@/components/atendimento/AtendimentoSidebar";
import AtendimentoNavbar from "@/components/atendimento/AtendimentoNavbar";
import PatientFilters from "@/components/pacientes/PatientFilters";
import PatientTable from "@/components/pacientes/PatientTable";
import { toast } from "sonner";

// Mock data
const mockPatients = [{
  id: "1",
  codigo: "PAC001",
  nome: "Maria Silva Santos",
  cpf: "123.456.789-00",
  telefone: "(11) 99999-9999",
  situacao: "ativo" as const
}, {
  id: "2",
  codigo: "PAC002",
  nome: "João Pedro Oliveira",
  cpf: "987.654.321-00",
  telefone: "(11) 98888-8888",
  situacao: "ativo" as const
}, {
  id: "3",
  codigo: "PAC003",
  nome: "Ana Carolina Ferreira",
  cpf: "456.789.123-00",
  telefone: "(11) 97777-7777",
  situacao: "inativo" as const
}, {
  id: "4",
  codigo: "PAC004",
  nome: "Carlos Eduardo Lima",
  cpf: "321.654.987-00",
  telefone: "(11) 96666-6666",
  situacao: "ativo" as const
}, {
  id: "5",
  codigo: "PAC005",
  nome: "Fernanda Rodrigues",
  cpf: "789.123.456-00",
  telefone: "(11) 95555-5555",
  situacao: "ativo" as const
}];
const Pacientes = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(mockPatients);
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const handleSearch = (filters: {
    search: string;
    showInactive: boolean;
    anyPart: boolean;
  }) => {
    let result = patients;
    if (!filters.showInactive) {
      result = result.filter(p => p.situacao === "ativo");
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => {
        if (filters.anyPart) {
          return p.nome.toLowerCase().includes(searchLower) || p.cpf.includes(filters.search) || p.codigo.toLowerCase().includes(searchLower) || p.telefone.includes(filters.search);
        } else {
          return p.nome.toLowerCase().startsWith(searchLower) || p.cpf.startsWith(filters.search) || p.codigo.toLowerCase().startsWith(searchLower);
        }
      });
    }
    setFilteredPatients(result);
  };
  const handleEdit = (patient: any) => {
    navigate(`/atendimento/pacientes/${patient.id}`);
  };
  const handleView = (patient: any) => {
    toast.info(`Visualizando paciente: ${patient.nome}`);
  };
  const handleDelete = (patient: any) => {
    toast.error(`Paciente ${patient.nome} excluído`);
    const updated = patients.filter(p => p.id !== patient.id);
    setPatients(updated);
    setFilteredPatients(updated);
  };
  return <div className="min-h-screen bg-background flex">
      <AtendimentoSidebar />

      <div className="flex-1 flex flex-col">
        <AtendimentoNavbar />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Breadcrumb */}
          

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Pacientes
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie os cadastros de pacientes para atendimento e faturamento.
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/atendimento/pacientes/novo")} className="btn-primary-premium">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <PatientFilters onSearch={handleSearch} />
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredPatients.length} paciente(s) encontrado(s)
            </p>
          </div>

          {/* Table */}
          <PatientTable patients={filteredPatients} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
        </main>
      </div>
    </div>;
};
export default Pacientes;
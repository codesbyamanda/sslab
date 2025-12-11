import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Patient {
  id: string;
  codigo: string;
  nome: string;
  cpf: string;
  telefone: string;
  situacao: "ativo" | "inativo";
}

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const PatientTable = ({ patients, onEdit, onView, onDelete }: PatientTableProps) => {
  return (
    <div className="card-premium overflow-hidden">
      <Table className="table-premium">
        <TableHeader>
          <TableRow className="bg-navy hover:bg-navy border-b-0">
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4">
              Código
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4">
              Nome Completo
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4">
              CPF
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4">
              Telefone
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4">
              Situação
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-4 text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                Nenhum paciente encontrado
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient, index) => (
              <TableRow
                key={patient.id}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}
              >
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {patient.codigo}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {patient.nome}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {patient.cpf}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {patient.telefone}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      patient.situacao === "ativo"
                        ? "badge-success"
                        : "badge-neutral"
                    }
                  >
                    {patient.situacao === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(patient)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(patient)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem
                          onClick={() => onDelete(patient)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;

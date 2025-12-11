import { Eye, MoreHorizontal } from "lucide-react";

const exams = [
  { id: "EX-2025-001", patient: "Maria Santos", type: "Hemograma Completo", status: "Concluído", date: "11/12/2025" },
  { id: "EX-2025-002", patient: "João Oliveira", type: "Glicemia", status: "Em análise", date: "11/12/2025" },
  { id: "EX-2025-003", patient: "Ana Costa", type: "TSH", status: "Concluído", date: "10/12/2025" },
  { id: "EX-2025-004", patient: "Pedro Lima", type: "Colesterol Total", status: "Pendente", date: "10/12/2025" },
  { id: "EX-2025-005", patient: "Carla Mendes", type: "Ureia e Creatinina", status: "Concluído", date: "09/12/2025" },
];

const statusStyles: Record<string, string> = {
  "Concluído": "badge-success",
  "Em análise": "badge-warning",
  "Pendente": "badge-neutral",
};

const RecentExamsTable = () => {
  return (
    <div className="card-premium overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Exames Recentes</h3>
          <button className="link-premium text-sm">Ver todos</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Código</th>
              <th>Paciente</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Data</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr 
                key={exam.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="font-medium text-foreground">{exam.id}</td>
                <td>{exam.patient}</td>
                <td>{exam.type}</td>
                <td>
                  <span className={statusStyles[exam.status]}>{exam.status}</span>
                </td>
                <td className="text-muted-foreground">{exam.date}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="btn-ghost-premium h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="btn-ghost-premium h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentExamsTable;

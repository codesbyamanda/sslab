import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Search, X, TestTube2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Amostra {
  id: string;
  codigo: string;
  paciente: string;
  setorBancada: string;
  dataHora: string;
  material: string;
}

interface NovoLoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoteCriado?: (loteId: string) => void;
}

// Mock de amostras não loteadas por unidade
const mockAmostrasDisponiveis: Record<string, Amostra[]> = {
  central: [
    { id: "a1", codigo: "AM-2024-005432", paciente: "Maria Silva Santos", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 08:15", material: "Sangue" },
    { id: "a2", codigo: "AM-2024-005433", paciente: "João Pedro Oliveira", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 08:22", material: "Sangue" },
    { id: "a3", codigo: "AM-2024-005434", paciente: "Ana Carolina Lima", setorBancada: "Hematologia / Bancada 01", dataHora: "09/01/2026 08:30", material: "Sangue" },
    { id: "a4", codigo: "AM-2024-005435", paciente: "Carlos Eduardo Reis", setorBancada: "Hematologia / Bancada 01", dataHora: "09/01/2026 08:45", material: "Sangue" },
    { id: "a5", codigo: "AM-2024-005436", paciente: "Fernanda Costa Souza", setorBancada: "Bioquímica / Bancada 02", dataHora: "09/01/2026 09:00", material: "Urina" },
    { id: "a6", codigo: "AM-2024-005437", paciente: "Ricardo Alves Neto", setorBancada: "Microbiologia / Bancada 01", dataHora: "09/01/2026 09:10", material: "Fezes" },
    { id: "a7", codigo: "AM-2024-005438", paciente: "Patricia Mendes", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 09:20", material: "Sangue" },
    { id: "a8", codigo: "AM-2024-005439", paciente: "Bruno Henrique Silva", setorBancada: "Hematologia / Bancada 01", dataHora: "09/01/2026 09:35", material: "Sangue" },
  ],
  norte: [
    { id: "a9", codigo: "AM-2024-005440", paciente: "Luciana Ferreira", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 07:45", material: "Sangue" },
    { id: "a10", codigo: "AM-2024-005441", paciente: "Marcelo Dias", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 08:00", material: "Sangue" },
    { id: "a11", codigo: "AM-2024-005442", paciente: "Julia Andrade", setorBancada: "Urinálise / Bancada 01", dataHora: "09/01/2026 08:20", material: "Urina" },
  ],
  sul: [
    { id: "a12", codigo: "AM-2024-005443", paciente: "Rodrigo Martins", setorBancada: "Hematologia / Bancada 01", dataHora: "09/01/2026 07:30", material: "Sangue" },
    { id: "a13", codigo: "AM-2024-005444", paciente: "Camila Rocha", setorBancada: "Bioquímica / Bancada 01", dataHora: "09/01/2026 08:10", material: "Sangue" },
  ],
};

const unidades = [
  { value: "central", label: "Unidade Central" },
  { value: "norte", label: "Unidade Norte" },
  { value: "sul", label: "Unidade Sul" },
];

const NovoLoteModal = ({ open, onOpenChange, onLoteCriado }: NovoLoteModalProps) => {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("");
  const [amostrasSelecionadas, setAmostrasSelecionadas] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const amostrasDisponiveis = unidadeSelecionada 
    ? mockAmostrasDisponiveis[unidadeSelecionada] || [] 
    : [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setAmostrasSelecionadas(amostrasDisponiveis.map(a => a.id));
    } else {
      setAmostrasSelecionadas([]);
    }
  };

  const handleSelectAmostra = (amostraId: string, checked: boolean) => {
    if (checked) {
      setAmostrasSelecionadas(prev => [...prev, amostraId]);
    } else {
      setAmostrasSelecionadas(prev => prev.filter(id => id !== amostraId));
    }
  };

  const handleRemoverSelecionada = (amostraId: string) => {
    setAmostrasSelecionadas(prev => prev.filter(id => id !== amostraId));
  };

  const handleCriarLote = async () => {
    if (amostrasSelecionadas.length === 0) {
      toast.error("Selecione pelo menos uma amostra para criar o lote.");
      return;
    }

    setIsCreating(true);
    
    // Simula criação do lote
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const novoLoteId = `L-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    
    toast.success(`Lote ${novoLoteId} criado com sucesso!`, {
      description: `${amostrasSelecionadas.length} amostra(s) incluída(s) no lote.`
    });
    
    setIsCreating(false);
    setUnidadeSelecionada("");
    setAmostrasSelecionadas([]);
    onOpenChange(false);
    
    if (onLoteCriado) {
      onLoteCriado(novoLoteId);
    }
  };

  const handleClose = () => {
    setUnidadeSelecionada("");
    setAmostrasSelecionadas([]);
    onOpenChange(false);
  };

  const isAllSelected = amostrasDisponiveis.length > 0 && 
    amostrasSelecionadas.length === amostrasDisponiveis.length;

  const amostrasSelecionadasDetalhes = amostrasDisponiveis.filter(a => 
    amostrasSelecionadas.includes(a.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Novo Lote de Amostras
          </DialogTitle>
          <DialogDescription>
            Selecione a unidade e as amostras disponíveis para criar um novo lote.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* Seleção de Unidade */}
          <div className="flex items-end gap-4">
            <div className="w-64">
              <Label>Unidade</Label>
              <Select value={unidadeSelecionada} onValueChange={(value) => {
                setUnidadeSelecionada(value);
                setAmostrasSelecionadas([]);
              }}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map(u => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {unidadeSelecionada && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TestTube2 className="h-4 w-4" />
                <span>{amostrasDisponiveis.length} amostra(s) disponível(is)</span>
              </div>
            )}
          </div>

          {/* Conteúdo Principal */}
          {!unidadeSelecionada ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-medium">Selecione uma unidade</p>
              <p className="text-sm">Para visualizar as amostras disponíveis para loteamento</p>
            </div>
          ) : amostrasDisponiveis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-medium">Nenhuma amostra disponível</p>
              <p className="text-sm">Todas as amostras desta unidade já estão vinculadas a lotes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
              {/* Lista de Amostras Disponíveis */}
              <div className="border rounded-lg flex flex-col">
                <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-medium">Amostras Disponíveis</span>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="selectAll"
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll" className="text-xs cursor-pointer">
                      Selecionar todas
                    </Label>
                  </div>
                </div>
                <ScrollArea className="flex-1 max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Setor/Bancada</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {amostrasDisponiveis.map((amostra) => (
                        <TableRow key={amostra.id}>
                          <TableCell>
                            <Checkbox 
                              checked={amostrasSelecionadas.includes(amostra.id)}
                              onCheckedChange={(checked) => handleSelectAmostra(amostra.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{amostra.codigo}</TableCell>
                          <TableCell className="text-sm">{amostra.paciente}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{amostra.setorBancada}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {/* Amostras Selecionadas para o Lote */}
              <div className="border rounded-lg flex flex-col">
                <div className="p-3 border-b bg-primary/5 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    Amostras no Lote ({amostrasSelecionadas.length})
                  </span>
                </div>
                <ScrollArea className="flex-1 max-h-[300px]">
                  {amostrasSelecionadasDetalhes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <Package className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma amostra selecionada</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amostrasSelecionadasDetalhes.map((amostra) => (
                          <TableRow key={amostra.id}>
                            <TableCell className="font-mono text-xs">{amostra.codigo}</TableCell>
                            <TableCell className="text-sm">{amostra.paciente}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{amostra.dataHora}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoverSelecionada(amostra.id)}
                                title="Remover do lote"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCriarLote} 
            disabled={amostrasSelecionadas.length === 0 || isCreating}
          >
            {isCreating ? (
              <>Criando...</>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Criar Lote ({amostrasSelecionadas.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoLoteModal;

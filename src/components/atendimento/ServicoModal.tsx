import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Search, 
  Beaker, 
  AlertTriangle, 
  CheckCircle, 
  Package,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock service data
const mockServico = {
  codigo: "HMG",
  descricao: "Hemograma Completo",
  recipiente: "Tubo EDTA (Roxo)",
  valor: 45.00,
  prazo: "1 dia útil",
  material: "Sangue Total",
  isKit: false,
  restricoes: [] as string[],
};

const mockKit = {
  codigo: "CHECKUP",
  descricao: "Check-up Básico",
  recipiente: "Diversos",
  valor: 180.00,
  prazo: "3 dias úteis",
  material: "Sangue/Urina",
  isKit: true,
  servicos: [
    { codigo: "HMG", descricao: "Hemograma Completo" },
    { codigo: "GLICO", descricao: "Glicose" },
    { codigo: "CREAT", descricao: "Creatinina" },
    { codigo: "UREIA", descricao: "Ureia" },
    { codigo: "TGO", descricao: "TGO (AST)" },
    { codigo: "TGP", descricao: "TGP (ALT)" },
  ],
  restricoes: [] as string[],
};

const ServicoModal = ({ open, onOpenChange }: ServicoModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState<typeof mockServico | typeof mockKit | null>(null);
  const [showRestrictions, setShowRestrictions] = useState(false);

  const handleSearch = () => {
    // Simulate search - in real app would call API
    if (searchTerm.toLowerCase() === "checkup") {
      setServicoSelecionado(mockKit);
    } else if (searchTerm.length >= 2) {
      setServicoSelecionado(mockServico);
    } else {
      setServicoSelecionado(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setServicoSelecionado(null);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    // Add service logic here
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Beaker className="h-5 w-5 text-primary" />
            Adicionar Serviço
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Search Field */}
          <div>
            <Label className="text-sm font-medium text-foreground">Buscar por Mnemônico</Label>
            <div className="flex gap-2 mt-1.5">
              <Input 
                className="input-premium flex-1 font-mono" 
                placeholder="Digite o código do serviço (ex: HMG, GLICO, CHECKUP)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
              />
              <Button className="btn-primary-premium px-4" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Service Details */}
          {servicoSelecionado && (
            <div className="space-y-4 animate-fade-in">
              {/* Service Info Card */}
              <div className="card-premium p-4 border-2 border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-lg">
                        {servicoSelecionado.codigo}
                      </span>
                      {'isKit' in servicoSelecionado && servicoSelecionado.isKit && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-ambar-suave/10 text-ambar-suave">
                          <Package className="h-3 w-3 mr-1" />
                          KIT
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mt-1">
                      {servicoSelecionado.descricao}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="text-xl font-bold text-foreground">
                      R$ {servicoSelecionado.valor.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Recipiente</p>
                    <p className="text-sm font-medium">{servicoSelecionado.recipiente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Material</p>
                    <p className="text-sm font-medium">{servicoSelecionado.material}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prazo</p>
                    <p className="text-sm font-medium">{servicoSelecionado.prazo}</p>
                  </div>
                </div>
              </div>

              {/* Kit Services List */}
              {'isKit' in servicoSelecionado && servicoSelecionado.isKit && 'servicos' in servicoSelecionado && (
                <div className="card-premium p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4 text-ambar-suave" />
                    Serviços inclusos no Kit ({servicoSelecionado.servicos.length})
                  </h4>
                  <div className="space-y-2">
                    {servicoSelecionado.servicos.map((s, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <CheckCircle className="h-4 w-4 text-verde-clinico flex-shrink-0" />
                        <span className="font-mono text-xs text-primary font-medium">{s.codigo}</span>
                        <span className="text-sm">{s.descricao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restrictions Warning */}
              {servicoSelecionado.restricoes.length > 0 && (
                <div className="card-premium p-4 border-vermelho-moderno/30 bg-vermelho-moderno/5">
                  <h4 className="text-sm font-semibold text-vermelho-moderno mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Restrições do Convênio
                  </h4>
                  <ul className="space-y-1">
                    {servicoSelecionado.restricoes.map((restricao, idx) => (
                      <li key={idx} className="text-sm text-vermelho-moderno">
                        • {restricao}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* No restrictions */}
              {servicoSelecionado.restricoes.length === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-verde-clinico/10 text-verde-clinico">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Serviço autorizado pelo convênio</span>
                </div>
              )}

              {/* Additional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Urgência</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Convênio</Label>
                  <Select defaultValue="unimed">
                    <SelectTrigger className="input-premium mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unimed">Unimed</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!servicoSelecionado && searchTerm === "" && (
            <div className="text-center py-8">
              <Beaker className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Digite o mnemônico do serviço para buscar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ex: HMG (Hemograma), GLICO (Glicose), CHECKUP (Kit Check-up)
              </p>
            </div>
          )}

          {/* Not found */}
          {!servicoSelecionado && searchTerm !== "" && (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum serviço encontrado com o código "{searchTerm}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Verifique o código e tente novamente
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-border bg-muted/30">
          <Button variant="outline" className="btn-secondary-premium" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            className="btn-primary-premium" 
            onClick={handleConfirm}
            disabled={!servicoSelecionado}
          >
            Confirmar Adição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServicoModal;

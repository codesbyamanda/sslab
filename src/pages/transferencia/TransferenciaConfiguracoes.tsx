import { useState } from "react";
import { Settings, Plus, Edit, Building2, ArrowLeftRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import TransferenciaLayout from "@/components/transferencia/TransferenciaLayout";

const tiposTransferencia = [
  { id: "1", nome: "Interna - Setor", ativo: true },
  { id: "2", nome: "Interna - Unidade", ativo: true },
  { id: "3", nome: "Externa - Hospital", ativo: true },
  { id: "4", nome: "Externa - Clínica", ativo: true },
  { id: "5", nome: "Externa - UPA", ativo: false }
];

const unidades = [
  { id: "1", nome: "UTI Adulto", tipo: "Interna", ativo: true },
  { id: "2", nome: "UTI Pediátrica", tipo: "Interna", ativo: true },
  { id: "3", nome: "UTI Coronariana", tipo: "Interna", ativo: true },
  { id: "4", nome: "Centro Cirúrgico", tipo: "Interna", ativo: true },
  { id: "5", nome: "Emergência", tipo: "Interna", ativo: true },
  { id: "6", nome: "Pronto Socorro", tipo: "Interna", ativo: true },
  { id: "7", nome: "Enfermaria 1", tipo: "Interna", ativo: true },
  { id: "8", nome: "Enfermaria 2", tipo: "Interna", ativo: true },
  { id: "9", nome: "Enfermaria 3", tipo: "Interna", ativo: true },
  { id: "10", nome: "Hospital Central", tipo: "Externa", ativo: true },
  { id: "11", nome: "Hospital Regional", tipo: "Externa", ativo: true }
];

const TransferenciaConfiguracoes = () => {
  const [camposObrigatorios, setCamposObrigatorios] = useState({
    observacao: true,
    documentos: false,
    responsavel: true
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <TransferenciaLayout title="Configurações">
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os tipos de transferência, unidades e regras do módulo
          </p>
        </div>

        {/* Tipos de Transferência */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Tipos de Transferência
              </CardTitle>
              <CardDescription>
                Configure os tipos de transferência disponíveis no sistema
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiposTransferencia.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell className="font-medium">{tipo.nome}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={tipo.ativo ? "default" : "secondary"}
                        className={tipo.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                      >
                        {tipo.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Unidades e Setores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Unidades / Setores
              </CardTitle>
              <CardDescription>
                Configure as unidades e setores disponíveis para transferência
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Unidade
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unidades.map((unidade) => (
                  <TableRow key={unidade.id}>
                    <TableCell className="font-medium">{unidade.nome}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={unidade.tipo === "Interna" ? "border-blue-300 text-blue-700" : "border-purple-300 text-purple-700"}
                      >
                        {unidade.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={unidade.ativo ? "default" : "secondary"}
                        className={unidade.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                      >
                        {unidade.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Regras Visuais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Regras de Validação
            </CardTitle>
            <CardDescription>
              Configure os campos obrigatórios e regras de validação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Campos Obrigatórios</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="observacao">Observações</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir observações ao criar transferência
                  </p>
                </div>
                <Switch
                  id="observacao"
                  checked={camposObrigatorios.observacao}
                  onCheckedChange={(checked) => 
                    setCamposObrigatorios({ ...camposObrigatorios, observacao: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="documentos">Seleção de Documentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Obrigar seleção de documentos para prontuário parcial
                  </p>
                </div>
                <Switch
                  id="documentos"
                  checked={camposObrigatorios.documentos}
                  onCheckedChange={(checked) => 
                    setCamposObrigatorios({ ...camposObrigatorios, documentos: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="responsavel">Responsável Médico</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir autorização médica para transferências
                  </p>
                </div>
                <Switch
                  id="responsavel"
                  checked={camposObrigatorios.responsavel}
                  onCheckedChange={(checked) => 
                    setCamposObrigatorios({ ...camposObrigatorios, responsavel: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </TransferenciaLayout>
  );
};

export default TransferenciaConfiguracoes;

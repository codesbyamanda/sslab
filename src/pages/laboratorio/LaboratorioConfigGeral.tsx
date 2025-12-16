import { useState } from "react";
import LaboratorioLayout from "@/components/laboratorio/LaboratorioLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, FolderOpen } from "lucide-react";
import { toast } from "sonner";

const LaboratorioConfigGeral = () => {
  const [empresaPadrao, setEmpresaPadrao] = useState("1");
  const [unidadePadrao, setUnidadePadrao] = useState("1");
  const [pastaModelos, setPastaModelos] = useState("C:\\SaudeSystems\\Modelos\\Relatorios");
  const [filtroMapaPadrao, setFiltroMapaPadrao] = useState("");
  const [modeloMapaPadrao, setModeloMapaPadrao] = useState("");

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <LaboratorioLayout title="Configurações Geral">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações Gerais</h1>
          <p className="text-muted-foreground mt-1">
            Configure empresa/unidade padrão e padrões para impressão de mapa.
          </p>
        </div>

        {/* Configurações */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Configurações Padrão</CardTitle>
            </div>
            <CardDescription>
              Defina os valores padrão que serão utilizados ao abrir o módulo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Empresa Padrão</Label>
                <Select value={empresaPadrao} onValueChange={setEmpresaPadrao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Laboratório Central</SelectItem>
                    <SelectItem value="2">Laboratório Norte</SelectItem>
                    <SelectItem value="3">Laboratório Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Unidade Padrão</Label>
                <Select value={unidadePadrao} onValueChange={setUnidadePadrao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unidade Central</SelectItem>
                    <SelectItem value="2">Unidade Norte</SelectItem>
                    <SelectItem value="3">Unidade Sul</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Pasta de Modelos de Relatório</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={pastaModelos}
                    onChange={(e) => setPastaModelos(e.target.value)}
                    placeholder="Caminho da pasta de modelos"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => toast.info("Selecionando pasta...")}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Selecionar
                  </Button>
                </div>
              </div>

              <div>
                <Label>Filtro do Mapa Padrão</Label>
                <Select value={filtroMapaPadrao} onValueChange={setFiltroMapaPadrao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="1">Bioquímica Geral</SelectItem>
                    <SelectItem value="2">Hematologia</SelectItem>
                    <SelectItem value="3">Microbiologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Modelo de Mapa Padrão</Label>
                <Select value={modeloMapaPadrao} onValueChange={setModeloMapaPadrao}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="1">Modelo Padrão</SelectItem>
                    <SelectItem value="2">Modelo Resumido</SelectItem>
                    <SelectItem value="3">Modelo Detalhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave} className="btn-primary-premium">
            Salvar
          </Button>
        </div>
      </div>
    </LaboratorioLayout>
  );
};

export default LaboratorioConfigGeral;

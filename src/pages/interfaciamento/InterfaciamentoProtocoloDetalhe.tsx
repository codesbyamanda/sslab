import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, 
  Home, 
  Save, 
  ArrowLeft,
  Cable,
  FileCode,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function InterfaciamentoProtocoloDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "novo";

  const [formData, setFormData] = useState({
    nome: isNew ? "" : "ASTM E1381",
    tipo: isNew ? "" : "astm",
    direcao: isNew ? "" : "bidirecional",
    formatoMensagens: isNew ? "" : "ASCII delimitado por caracteres de controle",
    regrasLeitura: isNew ? "" : "STX ... ETX com checksum LRC",
    regrasEscrita: isNew ? "" : "ENQ/ACK handshake antes do envio",
    tratamentoErros: isNew ? "" : "Retentativa até 3 vezes com intervalo de 5 segundos",
    timeout: isNew ? "30" : "30",
    ativo: !isNew,
    observacoes: isNew ? "" : "Protocolo padrão para equipamentos Sysmex e Beckman Coulter.",
  });

  const handleSave = () => {
    if (!formData.nome || !formData.tipo || !formData.direcao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    toast.success(isNew ? "Protocolo cadastrado com sucesso" : "Protocolo atualizado com sucesso");
    navigate("/interfaciamento/protocolos");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/interfaciamento" className="hover:text-foreground flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/interfaciamento/protocolos" className="hover:text-foreground">
          Protocolos
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{isNew ? "Novo Protocolo" : "Editar Protocolo"}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? "Novo Protocolo" : "Editar Protocolo"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? "Configure um novo protocolo de comunicação" : "Edite as configurações do protocolo"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/interfaciamento/protocolos")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados do Protocolo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cable className="w-5 h-5" />
              Dados do Protocolo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Protocolo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: ASTM E1381"
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de Protocolo *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="astm">ASTM</SelectItem>
                  <SelectItem value="hl7">HL7</SelectItem>
                  <SelectItem value="proprietario">Proprietário</SelectItem>
                  <SelectItem value="serial">Serial</SelectItem>
                  <SelectItem value="tcpip">TCP/IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="direcao">Direção *</Label>
              <Select 
                value={formData.direcao} 
                onValueChange={(value) => setFormData({ ...formData, direcao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a direção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="envio">Envio</SelectItem>
                  <SelectItem value="recebimento">Recebimento</SelectItem>
                  <SelectItem value="bidirecional">Bidirecional</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Define se o protocolo envia, recebe ou faz ambos
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
              <Label htmlFor="ativo">Protocolo Ativo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Formato de Mensagens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Formato de Mensagens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="formatoMensagens">Formato das Mensagens</Label>
              <Textarea
                id="formatoMensagens"
                value={formData.formatoMensagens}
                onChange={(e) => setFormData({ ...formData, formatoMensagens: e.target.value })}
                placeholder="Descreva o formato das mensagens (delimitadores, encoding, estrutura)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="regrasLeitura">Regras de Leitura</Label>
              <Textarea
                id="regrasLeitura"
                value={formData.regrasLeitura}
                onChange={(e) => setFormData({ ...formData, regrasLeitura: e.target.value })}
                placeholder="Descreva como o sistema deve interpretar mensagens recebidas"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="regrasEscrita">Regras de Escrita</Label>
              <Textarea
                id="regrasEscrita"
                value={formData.regrasEscrita}
                onChange={(e) => setFormData({ ...formData, regrasEscrita: e.target.value })}
                placeholder="Descreva como o sistema deve formatar mensagens enviadas"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tratamento de Erros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tratamento de Erros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tratamentoErros">Política de Erros</Label>
              <Textarea
                id="tratamentoErros"
                value={formData.tratamentoErros}
                onChange={(e) => setFormData({ ...formData, tratamentoErros: e.target.value })}
                placeholder="Descreva como o sistema deve tratar erros de comunicação"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="timeout">Timeout (segundos)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                placeholder="Ex: 30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tempo máximo de espera por resposta do equipamento
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o protocolo"
              rows={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

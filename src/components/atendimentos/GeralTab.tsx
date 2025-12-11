import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface GeralTabData {
  cid: string;
  tipoDoenca: string;
  tempoDoenca: string;
  unidadeTempo: string;
  tipoSaida: string;
  indicacaoAcidente: string;
  dataSolicitacao: string;
  caraterSolicitacao: string;
  indicacaoClinica: string;
  dataEntrega: string;
  adicionalDias: string;
  horaEntrega: string;
  destinoLaudo: string;
  dadosClinicos: string;
  urgencia: boolean;
}

interface GeralTabProps {
  data: GeralTabData;
  onChange: (data: GeralTabData) => void;
}

const GeralTab = ({ data, onChange }: GeralTabProps) => {
  const handleChange = (field: keyof GeralTabData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* CID e Tipo de Doença */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="cid">CID</Label>
          <div className="relative">
            <Input
              id="cid"
              value={data.cid}
              onChange={(e) => handleChange("cid", e.target.value)}
              className="input-premium pr-10"
              placeholder="Buscar CID..."
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="tipoDoenca">Tipo de Doença</Label>
          <Select value={data.tipoDoenca} onValueChange={(v) => handleChange("tipoDoenca", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aguda">Aguda</SelectItem>
              <SelectItem value="cronica">Crônica</SelectItem>
              <SelectItem value="subaguda">Subaguda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tempoDoenca">Tempo de Doença</Label>
          <Input
            id="tempoDoenca"
            type="number"
            value={data.tempoDoenca}
            onChange={(e) => handleChange("tempoDoenca", e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <Label htmlFor="unidadeTempo">Unidade</Label>
          <Select value={data.unidadeTempo} onValueChange={(v) => handleChange("unidadeTempo", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dias">Dias</SelectItem>
              <SelectItem value="semanas">Semanas</SelectItem>
              <SelectItem value="meses">Meses</SelectItem>
              <SelectItem value="anos">Anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tipo de Saída e Acidente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="tipoSaida">Tipo de Saída</Label>
          <Select value={data.tipoSaida} onValueChange={(v) => handleChange("tipoSaida", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="transferencia">Transferência</SelectItem>
              <SelectItem value="obito">Óbito</SelectItem>
              <SelectItem value="evasao">Evasão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="indicacaoAcidente">Indicação de Acidente</Label>
          <Select value={data.indicacaoAcidente} onValueChange={(v) => handleChange("indicacaoAcidente", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nao">Não</SelectItem>
              <SelectItem value="trabalho">Trabalho</SelectItem>
              <SelectItem value="transito">Trânsito</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dataSolicitacao">Data da Solicitação</Label>
          <Input
            id="dataSolicitacao"
            type="date"
            value={data.dataSolicitacao}
            onChange={(e) => handleChange("dataSolicitacao", e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <Label htmlFor="caraterSolicitacao">Caráter da Solicitação</Label>
          <Select value={data.caraterSolicitacao} onValueChange={(v) => handleChange("caraterSolicitacao", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eletivo">Eletivo</SelectItem>
              <SelectItem value="urgencia">Urgência/Emergência</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicação Clínica */}
      <div>
        <Label htmlFor="indicacaoClinica">Indicação Clínica</Label>
        <Input
          id="indicacaoClinica"
          value={data.indicacaoClinica}
          onChange={(e) => handleChange("indicacaoClinica", e.target.value)}
          className="input-premium"
          placeholder="Digite a indicação clínica..."
        />
      </div>

      {/* Entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="dataEntrega">Data de Entrega</Label>
          <Input
            id="dataEntrega"
            type="date"
            value={data.dataEntrega}
            onChange={(e) => handleChange("dataEntrega", e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <Label htmlFor="adicionalDias">Adicional de Dias</Label>
          <Input
            id="adicionalDias"
            type="number"
            value={data.adicionalDias}
            onChange={(e) => handleChange("adicionalDias", e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <Label htmlFor="horaEntrega">Hora de Entrega</Label>
          <Input
            id="horaEntrega"
            type="time"
            value={data.horaEntrega}
            onChange={(e) => handleChange("horaEntrega", e.target.value)}
            className="input-premium"
          />
        </div>

        <div>
          <Label htmlFor="destinoLaudo">Destino do Laudo</Label>
          <Select value={data.destinoLaudo} onValueChange={(v) => handleChange("destinoLaudo", v)}>
            <SelectTrigger className="input-premium">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paciente">Paciente</SelectItem>
              <SelectItem value="medico">Médico Solicitante</SelectItem>
              <SelectItem value="convenio">Convênio</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dados Clínicos */}
      <div>
        <Label htmlFor="dadosClinicos">Dados Clínicos</Label>
        <Textarea
          id="dadosClinicos"
          value={data.dadosClinicos}
          onChange={(e) => handleChange("dadosClinicos", e.target.value)}
          className="min-h-[120px] input-premium"
          placeholder="Digite os dados clínicos relevantes..."
        />
      </div>

      {/* Urgência */}
      <div className="flex items-center gap-3 p-4 bg-ambar-suave/10 rounded-lg border border-ambar-suave/30">
        <Checkbox
          id="urgencia"
          checked={data.urgencia}
          onCheckedChange={(checked) => handleChange("urgencia", checked === true)}
        />
        <Label htmlFor="urgencia" className="cursor-pointer font-medium text-ambar-suave">
          Marcar como URGÊNCIA (aplicar a todos os serviços)
        </Label>
      </div>
    </div>
  );
};

export default GeralTab;

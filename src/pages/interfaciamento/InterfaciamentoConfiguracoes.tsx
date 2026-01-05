import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Home, Save, Settings, Clock, RefreshCw, Bell, Link2 } from "lucide-react";
import { toast } from "sonner";
export default function InterfaciamentoConfiguracoes() {
  const [config, setConfig] = useState({
    intervaloComPadrao: "30",
    retentativasAuto: true,
    maxRetentativas: "3",
    intervaloRetentativa: "5",
    notificacaoFalhas: true,
    notificacaoEmail: true,
    emailNotificacao: "ti@laboratorio.com",
    integracaoSaudeLab: true,
    modoDebug: false,
    logRetentionDays: "90"
  });
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso");
  };
  return <div className="space-y-6">
      {/* Breadcrumb */}
      

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Configure os parâmetros gerais do módulo de interfaciamento
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comunicação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Comunicação
            </CardTitle>
            <CardDescription>
              Configure os parâmetros de comunicação com os equipamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="intervaloComPadrao">Intervalo Padrão de Comunicação (segundos)</Label>
              <Input id="intervaloComPadrao" type="number" value={config.intervaloComPadrao} onChange={e => setConfig({
              ...config,
              intervaloComPadrao: e.target.value
            })} />
              <p className="text-xs text-muted-foreground mt-1">
                Tempo entre verificações de novos dados nos equipamentos
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Retentativas Automáticas</Label>
                <p className="text-xs text-muted-foreground">
                  Retentar automaticamente em caso de falha
                </p>
              </div>
              <Switch checked={config.retentativasAuto} onCheckedChange={checked => setConfig({
              ...config,
              retentativasAuto: checked
            })} />
            </div>

            {config.retentativasAuto && <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
                <div>
                  <Label htmlFor="maxRetentativas">Máximo de Retentativas</Label>
                  <Input id="maxRetentativas" type="number" value={config.maxRetentativas} onChange={e => setConfig({
                ...config,
                maxRetentativas: e.target.value
              })} />
                </div>
                <div>
                  <Label htmlFor="intervaloRetentativa">Intervalo (segundos)</Label>
                  <Input id="intervaloRetentativa" type="number" value={config.intervaloRetentativa} onChange={e => setConfig({
                ...config,
                intervaloRetentativa: e.target.value
              })} />
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure alertas para falhas de comunicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificação de Falhas</Label>
                <p className="text-xs text-muted-foreground">
                  Exibir alertas visuais no sistema
                </p>
              </div>
              <Switch checked={config.notificacaoFalhas} onCheckedChange={checked => setConfig({
              ...config,
              notificacaoFalhas: checked
            })} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificação por E-mail</Label>
                <p className="text-xs text-muted-foreground">
                  Enviar e-mail em caso de falhas críticas
                </p>
              </div>
              <Switch checked={config.notificacaoEmail} onCheckedChange={checked => setConfig({
              ...config,
              notificacaoEmail: checked
            })} />
            </div>

            {config.notificacaoEmail && <div className="pl-4 border-l-2 border-primary/20">
                <Label htmlFor="emailNotificacao">E-mail para Notificações</Label>
                <Input id="emailNotificacao" type="email" value={config.emailNotificacao} onChange={e => setConfig({
              ...config,
              emailNotificacao: e.target.value
            })} placeholder="email@exemplo.com" />
              </div>}
          </CardContent>
        </Card>

        {/* Integração */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Integração com SaúdeLab
            </CardTitle>
            <CardDescription>
              Configure a integração com o módulo laboratorial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Integração Obrigatória</Label>
                <p className="text-xs text-muted-foreground">
                  Resultados só são aceitos se existir exame no SaúdeLab
                </p>
              </div>
              <Switch checked={config.integracaoSaudeLab} onCheckedChange={checked => setConfig({
              ...config,
              integracaoSaudeLab: checked
            })} />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Quando ativado, os resultados recebidos dos equipamentos serão automaticamente 
                vinculados aos exames do SaúdeLab, reduzindo a necessidade de digitação manual.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configurações avançadas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo Debug</Label>
                <p className="text-xs text-muted-foreground">
                  Registrar informações detalhadas nos logs
                </p>
              </div>
              <Switch checked={config.modoDebug} onCheckedChange={checked => setConfig({
              ...config,
              modoDebug: checked
            })} />
            </div>

            <Separator />

            <div>
              <Label htmlFor="logRetentionDays">Retenção de Logs (dias)</Label>
              <Select value={config.logRetentionDays} onValueChange={value => setConfig({
              ...config,
              logRetentionDays: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="180">180 dias</SelectItem>
                  <SelectItem value="365">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Tempo de retenção dos logs de comunicação
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}
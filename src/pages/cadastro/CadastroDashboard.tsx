import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Layers,
  Users,
  Handshake,
  TableProperties,
  Stethoscope,
  UserCog,
  FlaskConical,
  TestTube,
  FileText,
  Variable,
} from "lucide-react";

const quickAccessItems = [
  { title: "Empresas", description: "Gestão de empresas", icon: Building2, url: "/cadastro/empresas", count: 3 },
  { title: "Unidades", description: "Unidades de atendimento", icon: MapPin, url: "/cadastro/unidades", count: 8 },
  { title: "Setores", description: "Setores organizacionais", icon: Layers, url: "/cadastro/setores", count: 15 },
  { title: "Pessoas", description: "Cadastro de pessoas", icon: Users, url: "/cadastro/pessoas", count: 1250 },
  { title: "Convênios", description: "Convênios e planos", icon: Handshake, url: "/cadastro/convenios", count: 24 },
  { title: "Tabelas de Preço", description: "Tabelas e valores", icon: TableProperties, url: "/cadastro/tabelas-preco", count: 12 },
  { title: "Especialidades", description: "Especialidades médicas", icon: Stethoscope, url: "/cadastro/especialidades", count: 45 },
  { title: "Profissionais", description: "Profissionais de saúde", icon: UserCog, url: "/cadastro/profissionais-saude", count: 87 },
  { title: "Serviços", description: "Serviços laboratoriais", icon: FlaskConical, url: "/cadastro/servicos", count: 320 },
  { title: "Materiais", description: "Materiais biológicos", icon: TestTube, url: "/cadastro/materiais-biologicos", count: 28 },
  { title: "Modelos de Laudo", description: "Templates de laudo", icon: FileText, url: "/cadastro/modelos-laudo", count: 15 },
  { title: "Parâmetros", description: "Parâmetros de exames", icon: Variable, url: "/cadastro/parametros", count: 480 },
];

export default function CadastroDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel de Cadastros</h1>
        <p className="text-muted-foreground">
          Gerencie todos os cadastros e parametrizações do sistema
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrativo</p>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">cadastros</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Financeiro</p>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">cadastros</p>
              </div>
              <TableProperties className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Médico</p>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">cadastros</p>
              </div>
              <Stethoscope className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Laboratório</p>
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-xs text-muted-foreground">cadastros</p>
              </div>
              <FlaskConical className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acesso Rápido */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => (
            <Card
              key={item.title}
              className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
              onClick={() => navigate(item.url)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    <p className="text-sm font-semibold text-primary mt-1">{item.count} registros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, TrendingUp, TrendingDown, Wallet, ArrowRightLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroNavbar from "@/components/financeiro/FinanceiroNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SaudeFinanceiro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainRoute = location.pathname === "/financeiro";

  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <FinanceiroNavbar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Serviços
            </button>

            {isMainRoute ? (
              <>
                {/* Page Header */}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Dashboard – Saúde Financeiro
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Gerenciamento financeiro integrado aos módulos de atendimento e faturamento.
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-card border-border shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total a Receber
                      </CardTitle>
                      <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">R$ 45.231,89</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +12% em relação ao mês anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total a Pagar
                      </CardTitle>
                      <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">R$ 12.543,00</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        -8% em relação ao mês anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Saldo de Caixas
                      </CardTitle>
                      <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">R$ 8.920,45</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Atualizado há 2 horas
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Movimentações Recentes
                      </CardTitle>
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">127</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Últimos 7 dias
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Placeholder Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card border-border shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Resumo de Recebimentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground text-sm">
                          Gráfico de recebimentos em breve
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-card">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Resumo de Pagamentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground text-sm">
                          Gráfico de pagamentos em breve
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Placeholder */}
                <Card className="bg-card border-border shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground text-sm">
                        Lista de movimentações recentes em breve
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Placeholder for sub-routes */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Wallet className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Selecione uma opção no menu ao lado
                  </h2>
                  <p className="text-muted-foreground">
                    Escolha uma das opções do menu lateral para acessar as funcionalidades financeiras.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SaudeFinanceiro;

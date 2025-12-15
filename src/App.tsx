import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import SaudeAtendimento from "./pages/SaudeAtendimento";
import Pacientes from "./pages/Pacientes";
import Atendimentos from "./pages/Atendimentos";
import AtendimentoCadastro from "./pages/AtendimentoCadastro";
import RecebimentoMaterial from "./pages/RecebimentoMaterial";
import RecebimentoDetalhe from "./pages/RecebimentoDetalhe";
import ImpressaoLaudos from "./pages/ImpressaoLaudos";
import Orcamentos from "./pages/Orcamentos";
import OrcamentoCadastro from "./pages/OrcamentoCadastro";
import Profissionais from "./pages/Profissionais";
import ProfissionalCadastro from "./pages/ProfissionalCadastro";
import FinanceiroCaixa from "./pages/FinanceiroCaixa";
import FinanceiroRegistros from "./pages/FinanceiroRegistros";
import FinanceiroTransferencia from "./pages/FinanceiroTransferencia";
import RelatorioAtendimentoDiario from "./pages/relatorios/RelatorioAtendimentoDiario";
import RelatorioAtendimentoConvenio from "./pages/relatorios/RelatorioAtendimentoConvenio";
import RelatorioAtendimentoParticular from "./pages/relatorios/RelatorioAtendimentoParticular";
import RelatorioMovimentacaoFinanceira from "./pages/relatorios/RelatorioMovimentacaoFinanceira";
import RelatorioDevedores from "./pages/relatorios/RelatorioDevedores";
import RelatorioPromessaEntrega from "./pages/relatorios/RelatorioPromessaEntrega";
import RelatorioItensPendentes from "./pages/relatorios/RelatorioItensPendentes";
import RelatorioFaturamentos from "./pages/relatorios/RelatorioFaturamentos";
import Configuracoes from "./pages/Configuracoes";
import SaudeFaturamento from "./pages/SaudeFaturamento";
import PreFaturamento from "./pages/PreFaturamento";
import Faturamento from "./pages/Faturamento";
import SaudeFinanceiro from "./pages/SaudeFinanceiro";
import ReceitasReceber from "./pages/financeiro/ReceitasReceber";
import Cheques from "./pages/financeiro/Cheques";
import TransacoesCartao from "./pages/financeiro/TransacoesCartao";
import Depositos from "./pages/financeiro/Depositos";
import RepasseCartao from "./pages/financeiro/RepasseCartao";
import WorkspaceVisaoGeral from "./pages/workspace/WorkspaceVisaoGeral";
import WorkspaceAtendimento from "./pages/workspace/WorkspaceAtendimento";
import WorkspaceFinanceiro from "./pages/workspace/WorkspaceFinanceiro";
import WorkspaceAtendimentoFinanceiro from "./pages/workspace/WorkspaceAtendimentoFinanceiro";
import WorkspaceLaboratorio from "./pages/workspace/WorkspaceLaboratorio";
import WorkspacePersonalizados from "./pages/workspace/WorkspacePersonalizados";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/atendimento" element={<SaudeAtendimento />} />
          <Route path="/atendimento/pacientes" element={<Pacientes />} />
          <Route path="/atendimento/atendimentos" element={<Atendimentos />} />
          <Route path="/atendimento/requisicao/:id" element={<AtendimentoCadastro />} />
          <Route path="/atendimento/recebimento" element={<RecebimentoMaterial />} />
          <Route path="/atendimento/recebimento/:id" element={<RecebimentoDetalhe />} />
          <Route path="/atendimento/laudos" element={<ImpressaoLaudos />} />
          <Route path="/atendimento/orcamento" element={<Orcamentos />} />
          <Route path="/atendimento/orcamento/:id" element={<OrcamentoCadastro />} />
          <Route path="/atendimento/profissionais" element={<Profissionais />} />
          <Route path="/atendimento/profissionais/:id" element={<ProfissionalCadastro />} />
          <Route path="/atendimento/financeiro/caixa" element={<FinanceiroCaixa />} />
          <Route path="/atendimento/financeiro/registros" element={<FinanceiroRegistros />} />
          <Route path="/atendimento/financeiro/transferencia" element={<FinanceiroTransferencia />} />
          <Route path="/atendimento/relatorios/diario" element={<RelatorioAtendimentoDiario />} />
          <Route path="/atendimento/relatorios/convenio" element={<RelatorioAtendimentoConvenio />} />
          <Route path="/atendimento/relatorios/particular" element={<RelatorioAtendimentoParticular />} />
          <Route path="/atendimento/relatorios/financeiro" element={<RelatorioMovimentacaoFinanceira />} />
          <Route path="/atendimento/relatorios/devedores" element={<RelatorioDevedores />} />
          <Route path="/atendimento/relatorios/promessa" element={<RelatorioPromessaEntrega />} />
          <Route path="/atendimento/relatorios/pendentes" element={<RelatorioItensPendentes />} />
          <Route path="/atendimento/relatorios/faturamentos" element={<RelatorioFaturamentos />} />
          <Route path="/atendimento/configuracoes" element={<Configuracoes />} />
          <Route path="/faturamento" element={<SaudeFaturamento />} />
          <Route path="/faturamento/pre-faturamento" element={<PreFaturamento />} />
          <Route path="/faturamento/faturamento" element={<Faturamento />} />
          <Route path="/financeiro" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/receitas" element={<ReceitasReceber />} />
          <Route path="/financeiro/cheques" element={<Cheques />} />
          <Route path="/financeiro/transacoes-cartao" element={<TransacoesCartao />} />
          <Route path="/financeiro/depositos" element={<Depositos />} />
          <Route path="/financeiro/repasse-cartao" element={<RepasseCartao />} />
          <Route path="/financeiro/contas-pagar" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/cheques-emitidos" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/caixas" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/contas-correntes" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/transferencias-caixas" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/transferencias-bancarias" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/configuracoes" element={<SaudeFinanceiro />} />
          <Route path="/workspace" element={<WorkspaceVisaoGeral />} />
          <Route path="/workspace/atendimento" element={<WorkspaceAtendimento />} />
          <Route path="/workspace/financeiro" element={<WorkspaceFinanceiro />} />
          <Route path="/workspace/atendimento-financeiro" element={<WorkspaceAtendimentoFinanceiro />} />
          <Route path="/workspace/laboratorio" element={<WorkspaceLaboratorio />} />
          <Route path="/workspace/personalizados" element={<WorkspacePersonalizados />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

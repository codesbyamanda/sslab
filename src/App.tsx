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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

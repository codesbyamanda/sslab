import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import SaudeAtendimento from "./pages/SaudeAtendimento";
import Pacientes from "./pages/Pacientes";
import PacienteCadastro from "./pages/PacienteCadastro";
import Atendimentos from "./pages/Atendimentos";
import AtendimentoCadastro from "./pages/AtendimentoCadastro";
import RecebimentoMaterial from "./pages/RecebimentoMaterial";
import RecebimentoDetalhe from "./pages/RecebimentoDetalhe";
import ImpressaoLaudos from "./pages/ImpressaoLaudos";
import ImpressaoLaudoPaciente from "./pages/ImpressaoLaudoPaciente";
import ImpressoesAtendimento from "./pages/ImpressoesAtendimento";
import GuiasAtendimento from "./pages/GuiasAtendimento";
import GuiaCadastro from "./pages/GuiaCadastro";
import ReceitaReceberDetalhe from "./pages/ReceitaReceberDetalhe";
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
import PreFaturamentoLoteDetalhe from "./pages/faturamento/PreFaturamentoLoteDetalhe";
import Faturamento from "./pages/Faturamento";
import GuiasFaturamento from "./pages/faturamento/Guias";
import RecalculoGuias from "./pages/faturamento/RecalculoGuias";
import ListagemFaturamentoGuias from "./pages/faturamento/ListagemFaturamentoGuias";
import FaturaVisualizacao from "./pages/faturamento/FaturaVisualizacao";
import RelatoriosLanding from "./pages/faturamento/RelatoriosLanding";
import RelatorioClinicaSintetico from "./pages/faturamento/RelatorioClinicaSintetico";
import RelatorioClinicaAnalitico from "./pages/faturamento/RelatorioClinicaAnalitico";
import RelatorioRendimentosSolicitantes from "./pages/faturamento/RelatorioRendimentosSolicitantes";
import RelatorioExamesServicos from "./pages/faturamento/RelatorioExamesServicos";
import SaudeFinanceiro from "./pages/SaudeFinanceiro";
import ReceitasReceber from "./pages/financeiro/ReceitasReceber";
import ReceitaDetalhe from "./pages/financeiro/ReceitaDetalhe";
import ReceitaRecebimento from "./pages/financeiro/ReceitaRecebimento";
import ReceitaExtorno from "./pages/financeiro/ReceitaExtorno";
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
import LaboratorioHome from "./pages/laboratorio/LaboratorioHome";
import LaboratorioFiltroMapa from "./pages/laboratorio/LaboratorioFiltroMapa";
import LaboratorioFiltroMapaCadastro from "./pages/laboratorio/LaboratorioFiltroMapaCadastro";
import LaboratorioMapasLista from "./pages/laboratorio/LaboratorioMapasLista";
import LaboratorioMapaTrabalhoNovo from "./pages/laboratorio/LaboratorioMapaTrabalhoNovo";
import LaboratorioLotesAmostras from "./pages/laboratorio/LaboratorioLotesAmostras";
import LaboratorioLoteDetalhe from "./pages/laboratorio/LaboratorioLoteDetalhe";
import LaboratorioAmostras from "./pages/laboratorio/LaboratorioAmostras";
import LaboratorioAmostraDetalhe from "./pages/laboratorio/LaboratorioAmostraDetalhe";
import LaboratorioDigitacaoPaciente from "./pages/laboratorio/LaboratorioDigitacaoPaciente";
import LaboratorioDigitacaoRequisicao from "./pages/laboratorio/LaboratorioDigitacaoRequisicao";
import LaboratorioDigitacaoMapa from "./pages/laboratorio/LaboratorioDigitacaoMapa";
import LaboratorioDigitacaoMapaDetalhe from "./pages/laboratorio/LaboratorioDigitacaoMapaDetalhe";
import LaboratorioImpressaoLaudo from "./pages/laboratorio/LaboratorioImpressaoLaudo";
import LaboratorioGerarLaudosLote from "./pages/laboratorio/LaboratorioGerarLaudosLote";
import LaboratorioConfigGeral from "./pages/laboratorio/LaboratorioConfigGeral";
import LaboratorioConfigImpressao from "./pages/laboratorio/LaboratorioConfigImpressao";
import LaboratorioConfigLaudoInternet from "./pages/laboratorio/LaboratorioConfigLaudoInternet";
import LaboratorioRelatorios from "./pages/laboratorio/LaboratorioRelatorios";
import NotFound from "./pages/NotFound";
import ModuloEmConfiguracao from "./pages/ModuloEmConfiguracao";

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
          <Route path="/atendimento/pacientes/:id" element={<PacienteCadastro />} />
          <Route path="/atendimento/atendimentos" element={<Atendimentos />} />
          <Route path="/atendimento/requisicao/:id" element={<AtendimentoCadastro />} />
          <Route path="/atendimento/recebimento" element={<RecebimentoMaterial />} />
          <Route path="/atendimento/recebimento/:id" element={<RecebimentoDetalhe />} />
          <Route path="/atendimento/laudos" element={<ImpressaoLaudos />} />
          <Route path="/atendimento/laudo-paciente/:id" element={<ImpressaoLaudoPaciente />} />
          <Route path="/atendimento/impressoes/:id" element={<ImpressoesAtendimento />} />
          <Route path="/atendimento/guias/:id" element={<GuiasAtendimento />} />
          <Route path="/atendimento/guias/:id/nova" element={<GuiaCadastro />} />
          <Route path="/atendimento/guias/:id/editar/:guiaId" element={<GuiaCadastro />} />
          <Route path="/atendimento/receita/:id" element={<ReceitaReceberDetalhe />} />
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
          <Route path="/faturamento/pre-faturamento/:id" element={<PreFaturamentoLoteDetalhe />} />
          <Route path="/faturamento/faturamento" element={<Faturamento />} />
          <Route path="/faturamento/guias" element={<GuiasFaturamento />} />
          <Route path="/faturamento/listagem-faturamento" element={<ListagemFaturamentoGuias />} />
          <Route path="/faturamento/listagem-faturamento/:id" element={<FaturaVisualizacao />} />
          {/* Relatórios Faturamento */}
          <Route path="/faturamento/relatorios" element={<RelatoriosLanding />} />
          <Route path="/faturamento/relatorios/clinica-sintetico" element={<RelatorioClinicaSintetico />} />
          <Route path="/faturamento/relatorios/clinica-analitico" element={<RelatorioClinicaAnalitico />} />
          <Route path="/faturamento/relatorios/rendimentos-solicitantes" element={<RelatorioRendimentosSolicitantes />} />
          <Route path="/faturamento/relatorios/exames-servicos" element={<RelatorioExamesServicos />} />
          <Route path="/financeiro" element={<SaudeFinanceiro />} />
          <Route path="/financeiro/receitas" element={<ReceitasReceber />} />
          <Route path="/financeiro/receitas/:id" element={<ReceitaDetalhe />} />
          <Route path="/financeiro/receitas/:id/recebimento" element={<ReceitaRecebimento />} />
          <Route path="/financeiro/receitas/:id/extorno" element={<ReceitaExtorno />} />
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
          {/* Laboratório */}
          <Route path="/laboratorio" element={<LaboratorioHome />} />
          <Route path="/laboratorio/filtro-mapa" element={<LaboratorioFiltroMapa />} />
          <Route path="/laboratorio/filtro-mapa/novo" element={<LaboratorioFiltroMapaCadastro />} />
          <Route path="/laboratorio/filtro-mapa/:id" element={<LaboratorioFiltroMapaCadastro />} />
          <Route path="/laboratorio/filtro-mapa/:id/editar" element={<LaboratorioFiltroMapaCadastro />} />
          <Route path="/laboratorio/mapa-trabalho" element={<LaboratorioMapasLista />} />
          <Route path="/laboratorio/mapa-trabalho/novo" element={<LaboratorioMapaTrabalhoNovo />} />
          <Route path="/laboratorio/lotes-amostras" element={<LaboratorioLotesAmostras />} />
          <Route path="/laboratorio/lotes-amostras/:id" element={<LaboratorioLoteDetalhe />} />
          <Route path="/laboratorio/amostras" element={<LaboratorioAmostras />} />
          <Route path="/laboratorio/amostras/:id" element={<LaboratorioAmostraDetalhe />} />
          <Route path="/laboratorio/digitacao-paciente" element={<LaboratorioDigitacaoPaciente />} />
          <Route path="/laboratorio/digitacao-paciente/:id" element={<LaboratorioDigitacaoRequisicao />} />
          <Route path="/laboratorio/digitacao-mapa" element={<LaboratorioDigitacaoMapa />} />
          <Route path="/laboratorio/digitacao-mapa/:id" element={<LaboratorioDigitacaoMapaDetalhe />} />
          <Route path="/laboratorio/impressao-laudo" element={<LaboratorioImpressaoLaudo />} />
          <Route path="/laboratorio/gerar-laudos-lote" element={<LaboratorioGerarLaudosLote />} />
          <Route path="/laboratorio/config-geral" element={<LaboratorioConfigGeral />} />
          <Route path="/laboratorio/config-impressao" element={<LaboratorioConfigImpressao />} />
          <Route path="/laboratorio/config-laudo-internet" element={<LaboratorioConfigLaudoInternet />} />
          <Route path="/laboratorio/relatorios" element={<LaboratorioRelatorios />} />
          {/* Módulos em configuração */}
          <Route path="/cadastro" element={<ModuloEmConfiguracao />} />
          <Route path="/informatica" element={<ModuloEmConfiguracao />} />
          <Route path="/seguranca" element={<ModuloEmConfiguracao />} />
          <Route path="/transferencia" element={<ModuloEmConfiguracao />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

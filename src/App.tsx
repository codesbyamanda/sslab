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
import ChequeDetalhe from "./pages/financeiro/ChequeDetalhe";
import TransacoesCartao from "./pages/financeiro/TransacoesCartao";
import TransacaoCartaoDetalhe from "./pages/financeiro/TransacaoCartaoDetalhe";
import Depositos from "./pages/financeiro/Depositos";
import DepositoDetalhe from "./pages/financeiro/DepositoDetalhe";
import NovoDeposito from "./pages/financeiro/NovoDeposito";
import RepasseCartao from "./pages/financeiro/RepasseCartao";
import RepasseCartaoDetalhe from "./pages/financeiro/RepasseCartaoDetalhe";
import ContasPagar from "./pages/financeiro/ContasPagar";
import ContaPagarDetalhe from "./pages/financeiro/ContaPagarDetalhe";
import NovaContaPagar from "./pages/financeiro/NovaContaPagar";
import ContaPagarPagamento from "./pages/financeiro/ContaPagarPagamento";
import ChequesEmitidos from "./pages/financeiro/ChequesEmitidos";
import ChequeEmitidoDetalhe from "./pages/financeiro/ChequeEmitidoDetalhe";
import NovoChequeEmitido from "./pages/financeiro/NovoChequeEmitido";
import Caixas from "./pages/financeiro/Caixas";
import CaixaDetalhe from "./pages/financeiro/CaixaDetalhe";
import ContasCorrentes from "./pages/financeiro/ContasCorrentes";
import ContaCorrenteDetalhe from "./pages/financeiro/ContaCorrenteDetalhe";
import TransferenciasCaixas from "./pages/financeiro/TransferenciasCaixas";
import TransferenciaCaixaDetalhe from "./pages/financeiro/TransferenciaCaixaDetalhe";
import NovaTransferenciaCaixa from "./pages/financeiro/NovaTransferenciaCaixa";
import TransferenciasBancarias from "./pages/financeiro/TransferenciasBancarias";
import TransferenciaBancariaDetalhe from "./pages/financeiro/TransferenciaBancariaDetalhe";
import NovaTransferenciaBancaria from "./pages/financeiro/NovaTransferenciaBancaria";
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
import TransferenciaDashboard from "./pages/transferencia/TransferenciaDashboard";
import TransferenciaLista from "./pages/transferencia/TransferenciaLista";
import TransferenciaDetalhe from "./pages/transferencia/TransferenciaDetalhe";
import NovaTransferencia from "./pages/transferencia/NovaTransferencia";
import TransferenciaHistorico from "./pages/transferencia/TransferenciaHistorico";
import TransferenciaRelatorios from "./pages/transferencia/TransferenciaRelatorios";
import TransferenciaConfiguracoes from "./pages/transferencia/TransferenciaConfiguracoes";
import NotFound from "./pages/NotFound";
import ModuloEmConfiguracao from "./pages/ModuloEmConfiguracao";
import GrupoControleAcesso from "./pages/seguranca/GrupoControleAcesso";
import PerfilAcesso from "./pages/seguranca/PerfilAcesso";
import { InterfaciamentoLayout } from "./components/interfaciamento/InterfaciamentoLayout";
import InterfaciamentoDashboard from "./pages/interfaciamento/InterfaciamentoDashboard";
import InterfaciamentoEquipamentos from "./pages/interfaciamento/InterfaciamentoEquipamentos";
import InterfaciamentoEquipamentoDetalhe from "./pages/interfaciamento/InterfaciamentoEquipamentoDetalhe";
import InterfaciamentoProtocolos from "./pages/interfaciamento/InterfaciamentoProtocolos";
import InterfaciamentoProtocoloDetalhe from "./pages/interfaciamento/InterfaciamentoProtocoloDetalhe";
import InterfaciamentoMapeamento from "./pages/interfaciamento/InterfaciamentoMapeamento";
import InterfaciamentoMonitoramento from "./pages/interfaciamento/InterfaciamentoMonitoramento";
import InterfaciamentoLogs from "./pages/interfaciamento/InterfaciamentoLogs";
import InterfaciamentoLogDetalhe from "./pages/interfaciamento/InterfaciamentoLogDetalhe";
import InterfaciamentoConfiguracoes from "./pages/interfaciamento/InterfaciamentoConfiguracoes";
import { CadastroLayout } from "./components/cadastro/CadastroLayout";
import CadastroDashboard from "./pages/cadastro/CadastroDashboard";
import Empresas from "./pages/cadastro/Empresas";
import EmpresaDetalhe from "./pages/cadastro/EmpresaDetalhe";
import Unidades from "./pages/cadastro/Unidades";
import UnidadeDetalhe from "./pages/cadastro/UnidadeDetalhe";
import Setores from "./pages/cadastro/Setores";
import SetorDetalhe from "./pages/cadastro/SetorDetalhe";
import Pessoas from "./pages/cadastro/Pessoas";
import PessoaDetalhe from "./pages/cadastro/PessoaDetalhe";
import ProfissoesCad from "./pages/cadastro/Profissoes";
import Feriados from "./pages/cadastro/Feriados";
import DestinoLaudo from "./pages/cadastro/DestinoLaudo";
import Terceiros from "./pages/cadastro/Terceiros";
import UnidadeMonetaria from "./pages/cadastro/UnidadeMonetaria";
import TabelasPreco from "./pages/cadastro/TabelasPreco";
import TabelaPrecoItens from "./pages/cadastro/TabelaPrecoItens";
import Convenios from "./pages/cadastro/Convenios";
import CID from "./pages/cadastro/CID";
import CIDDetalhe from "./pages/cadastro/CIDDetalhe";
import EspecialidadesMedicas from "./pages/cadastro/EspecialidadesMedicas";
import EspecialidadeDetalhe from "./pages/cadastro/EspecialidadeDetalhe";
import ConselhosProfissionais from "./pages/cadastro/ConselhosProfissionais";
import ConselhoDetalhe from "./pages/cadastro/ConselhoDetalhe";
import ProfissionaisSaude from "./pages/cadastro/ProfissionaisSaude";
import ProfissionalSaudeDetalhe from "./pages/cadastro/ProfissionalSaudeDetalhe";
import Clinicas from "./pages/cadastro/Clinicas";
import ClinicaDetalhe from "./pages/cadastro/ClinicaDetalhe";
import Conservantes from "./pages/cadastro/Conservantes";
import ConservanteDetalhe from "./pages/cadastro/ConservanteDetalhe";
import MateriaisBiologicos from "./pages/cadastro/MateriaisBiologicos";
import MaterialBiologicoDetalhe from "./pages/cadastro/MaterialBiologicoDetalhe";
import Recipientes from "./pages/cadastro/Recipientes";
import RecipienteDetalhe from "./pages/cadastro/RecipienteDetalhe";
import PrazosEntrega from "./pages/cadastro/PrazosEntrega";
import PrazoEntregaDetalhe from "./pages/cadastro/PrazoEntregaDetalhe";
import Bancadas from "./pages/cadastro/Bancadas";
import BancadaDetalhe from "./pages/cadastro/BancadaDetalhe";
import ServicosCad from "./pages/cadastro/Servicos";
import ServicoDetalhe from "./pages/cadastro/ServicoDetalhe";
import KitsServico from "./pages/cadastro/KitsServico";
import KitServicoDetalhe from "./pages/cadastro/KitServicoDetalhe";

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
          <Route path="/financeiro/cheques/:id" element={<ChequeDetalhe />} />
          <Route path="/financeiro/transacoes-cartao" element={<TransacoesCartao />} />
          <Route path="/financeiro/transacoes-cartao/:id" element={<TransacaoCartaoDetalhe />} />
          <Route path="/financeiro/depositos" element={<Depositos />} />
          <Route path="/financeiro/depositos/novo" element={<NovoDeposito />} />
          <Route path="/financeiro/depositos/:id" element={<DepositoDetalhe />} />
          <Route path="/financeiro/repasse-cartao" element={<RepasseCartao />} />
          <Route path="/financeiro/repasse-cartao/:id" element={<RepasseCartaoDetalhe />} />
          <Route path="/financeiro/contas-pagar" element={<ContasPagar />} />
          <Route path="/financeiro/contas-pagar/nova" element={<NovaContaPagar />} />
          <Route path="/financeiro/contas-pagar/:id" element={<ContaPagarDetalhe />} />
          <Route path="/financeiro/contas-pagar/:id/pagamento" element={<ContaPagarPagamento />} />
          <Route path="/financeiro/cheques-emitidos" element={<ChequesEmitidos />} />
          <Route path="/financeiro/cheques-emitidos/novo" element={<NovoChequeEmitido />} />
          <Route path="/financeiro/cheques-emitidos/:id" element={<ChequeEmitidoDetalhe />} />
          {/* Fluxos Monetários */}
          <Route path="/financeiro/caixas" element={<Caixas />} />
          <Route path="/financeiro/caixas/:id" element={<CaixaDetalhe />} />
          <Route path="/financeiro/contas-correntes" element={<ContasCorrentes />} />
          <Route path="/financeiro/contas-correntes/:id" element={<ContaCorrenteDetalhe />} />
          <Route path="/financeiro/transferencias-caixas" element={<TransferenciasCaixas />} />
          <Route path="/financeiro/transferencias-caixas/nova" element={<NovaTransferenciaCaixa />} />
          <Route path="/financeiro/transferencias-caixas/:id" element={<TransferenciaCaixaDetalhe />} />
          <Route path="/financeiro/transferencias-bancarias" element={<TransferenciasBancarias />} />
          <Route path="/financeiro/transferencias-bancarias/nova" element={<NovaTransferenciaBancaria />} />
          <Route path="/financeiro/transferencias-bancarias/:id" element={<TransferenciaBancariaDetalhe />} />
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
          {/* Segurança */}
          <Route path="/seguranca" element={<GrupoControleAcesso />} />
          <Route path="/seguranca/grupo-controle-acesso" element={<GrupoControleAcesso />} />
          <Route path="/seguranca/perfil/novo" element={<PerfilAcesso />} />
          <Route path="/seguranca/perfil/:id" element={<PerfilAcesso />} />
          <Route path="/seguranca" element={<ModuloEmConfiguracao />} />
          {/* Transferência */}
          <Route path="/transferencia" element={<TransferenciaDashboard />} />
          <Route path="/transferencia/lista" element={<TransferenciaLista />} />
          <Route path="/transferencia/nova" element={<NovaTransferencia />} />
          <Route path="/transferencia/:id" element={<TransferenciaDetalhe />} />
          <Route path="/transferencia/:id/editar" element={<NovaTransferencia />} />
          <Route path="/transferencia/historico" element={<TransferenciaHistorico />} />
          <Route path="/transferencia/relatorios" element={<TransferenciaRelatorios />} />
          <Route path="/transferencia/configuracoes" element={<TransferenciaConfiguracoes />} />
          {/* Cadastro */}
          <Route path="/cadastro" element={<CadastroLayout />}>
            <Route index element={<CadastroDashboard />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="empresas/:id" element={<EmpresaDetalhe />} />
            <Route path="unidades" element={<Unidades />} />
            <Route path="unidades/:id" element={<UnidadeDetalhe />} />
            <Route path="setores" element={<Setores />} />
            <Route path="setores/:id" element={<SetorDetalhe />} />
            <Route path="pessoas" element={<Pessoas />} />
            <Route path="pessoas/:id" element={<PessoaDetalhe />} />
            <Route path="profissoes" element={<ProfissoesCad />} />
            <Route path="profissoes/:id" element={<ProfissoesCad />} />
            <Route path="feriados" element={<Feriados />} />
            <Route path="feriados/:id" element={<Feriados />} />
            <Route path="destino-laudo" element={<DestinoLaudo />} />
            <Route path="destino-laudo/:id" element={<DestinoLaudo />} />
            <Route path="terceiros" element={<Terceiros />} />
            <Route path="terceiros/:id" element={<Terceiros />} />
            <Route path="unidade-monetaria" element={<UnidadeMonetaria />} />
            <Route path="unidade-monetaria/:id" element={<UnidadeMonetaria />} />
            <Route path="tabelas-preco" element={<TabelasPreco />} />
            <Route path="tabelas-preco/:id" element={<TabelasPreco />} />
            <Route path="tabelas-preco/:id/itens" element={<TabelaPrecoItens />} />
            <Route path="convenios" element={<Convenios />} />
            <Route path="convenios/:id" element={<Convenios />} />
            {/* Médico */}
            <Route path="cid" element={<CID />} />
            <Route path="cid/:id" element={<CIDDetalhe />} />
            <Route path="especialidades" element={<EspecialidadesMedicas />} />
            <Route path="especialidades/:id" element={<EspecialidadeDetalhe />} />
            <Route path="conselhos" element={<ConselhosProfissionais />} />
            <Route path="conselhos/:id" element={<ConselhoDetalhe />} />
            <Route path="profissionais-saude" element={<ProfissionaisSaude />} />
            <Route path="profissionais-saude/:id" element={<ProfissionalSaudeDetalhe />} />
            <Route path="clinicas" element={<Clinicas />} />
            <Route path="clinicas/:id" element={<ClinicaDetalhe />} />
            {/* Laboratório */}
            <Route path="conservantes" element={<Conservantes />} />
            <Route path="conservantes/:id" element={<ConservanteDetalhe />} />
            <Route path="materiais-biologicos" element={<MateriaisBiologicos />} />
            <Route path="materiais-biologicos/:id" element={<MaterialBiologicoDetalhe />} />
            <Route path="recipientes" element={<Recipientes />} />
            <Route path="recipientes/:id" element={<RecipienteDetalhe />} />
            <Route path="prazos-entrega" element={<PrazosEntrega />} />
            <Route path="prazos-entrega/:id" element={<PrazoEntregaDetalhe />} />
            <Route path="bancadas" element={<Bancadas />} />
            <Route path="bancadas/:id" element={<BancadaDetalhe />} />
            <Route path="servicos" element={<ServicosCad />} />
            <Route path="servicos/:id" element={<ServicoDetalhe />} />
            <Route path="kits-servico" element={<KitsServico />} />
            <Route path="kits-servico/:id" element={<KitServicoDetalhe />} />
          </Route>
          <Route path="/interfaciamento" element={<InterfaciamentoLayout />}>
            <Route index element={<InterfaciamentoDashboard />} />
            <Route path="equipamentos" element={<InterfaciamentoEquipamentos />} />
            <Route path="equipamentos/:id" element={<InterfaciamentoEquipamentoDetalhe />} />
            <Route path="protocolos" element={<InterfaciamentoProtocolos />} />
            <Route path="protocolos/:id" element={<InterfaciamentoProtocoloDetalhe />} />
            <Route path="mapeamento" element={<InterfaciamentoMapeamento />} />
            <Route path="monitoramento" element={<InterfaciamentoMonitoramento />} />
            <Route path="logs" element={<InterfaciamentoLogs />} />
            <Route path="logs/:id" element={<InterfaciamentoLogDetalhe />} />
            <Route path="configuracoes" element={<InterfaciamentoConfiguracoes />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

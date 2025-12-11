import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import SaudeAtendimento from "./pages/SaudeAtendimento";
import AtendimentoHub from "./pages/AtendimentoHub";
import AtendimentosListagem from "./pages/atendimento/AtendimentosListagem";
import PacienteCadastro from "./pages/atendimento/PacienteCadastro";
import RequisicaoCadastro from "./pages/atendimento/RequisicaoCadastro";
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
          <Route path="/atendimento/hub" element={<AtendimentoHub />} />
          <Route path="/atendimento/atendimentos" element={<AtendimentosListagem />} />
          <Route path="/atendimento/atendimentos/novo" element={<RequisicaoCadastro />} />
          <Route path="/atendimento/paciente" element={<PacienteCadastro />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

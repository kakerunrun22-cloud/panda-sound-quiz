import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ModeA from "./pages/ModeA.tsx";
import ModeB from "./pages/ModeB.tsx";
import Memory from "./pages/Memory.tsx";
import Encyclopedia from "./pages/Encyclopedia.tsx";
import Stats from "./pages/Stats.tsx";
import Ranking from "./pages/Ranking.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mode-a" element={<ModeA />} />
          <Route path="/mode-b" element={<ModeB />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/ranking" element={<Ranking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

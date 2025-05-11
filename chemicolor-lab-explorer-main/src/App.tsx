import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import Reactions from "./pages/Reactions";
import ElementaryReactions from "./pages/ElementaryReactions";
import FreeMode from "./pages/FreeMode";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { SimulationProvider } from "./context/SimulationContext";
import { useEffect } from "react";

// Configure the QueryClient with better mobile support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Add mobile viewport meta tag dynamically for better mobile support
  useEffect(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    const style = document.createElement('style');
    style.textContent = `
      * {
        touch-action: manipulation;
      }
      html, body {
        overscroll-behavior: none;
        overflow-x: hidden;
        position: relative;
        height: 100%;
        width: 100%;
      }
      button, a, [role="button"] {
        min-height: 44px;
        min-width: 44px;
      }
      input, select, textarea {
        font-size: 16px;
      }
      .scrollable {
        -webkit-overflow-scrolling: touch;
      }
      @media screen and (orientation: portrait) {
        .landscape-only {
          display: none;
        }
      }
      @media screen and (orientation: landscape) {
        .portrait-only {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SimulationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* الصفحة الافتراضية (Index) تظهر عند الدخول إلى المسار الجذر "/" */}
                <Route path="/" element={<Index />} />
                {/* صفحة تسجيل الدخول */}
                <Route path="/login" element={<Login />} />
                {/* صفحات المحاكاة التي تستخدم SimulationProvider */}
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/free-mode" element={<FreeMode />} />
                <Route path="/reactions" element={<Reactions />} />
                <Route path="/elementary-reactions" element={<ElementaryReactions />} />
                {/* مسار شامل لمعالجة أي مسار غير معرف (404) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SimulationProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
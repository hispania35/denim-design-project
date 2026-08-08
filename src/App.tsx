import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { citySlugs } from "@/data/cities";
import { tutorSlugs } from "@/data/tutors";

const CallbackButton = lazyWithRetry(() => import("./components/CallbackButton"));

const FloatingCallback = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <Suspense fallback={null}>
      <CallbackButton />
    </Suspense>
  );
};

const Index = lazyWithRetry(() => import("./pages/Index"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const Oferta = lazyWithRetry(() => import("./pages/Oferta"));
const CityPage = lazyWithRetry(() => import("./pages/CityPage"));
const BelarusPage = lazyWithRetry(() => import("./pages/BelarusPage"));
const NativeSpanish = lazyWithRetry(() => import("./pages/NativeSpanish"));
const TutorPage = lazyWithRetry(() => import("./pages/TutorPage"));
const AdminPricing = lazyWithRetry(() => import("./pages/AdminPricing"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const NotFound = lazyWithRetry(() => import("./pages/NotFoundPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/oferta" element={<Oferta />} />
            <Route path="/belarus" element={<BelarusPage />} />
            <Route path="/native" element={<NativeSpanish />} />
            <Route path="/admin" element={<AdminPricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {tutorSlugs.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<TutorPage />} />
            ))}
            {citySlugs.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<CityPage />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <FloatingCallback />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
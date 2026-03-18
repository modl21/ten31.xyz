import { useSeoMeta } from "@unhead/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 Not Found | TEN31",
    description: "The page you are looking for could not be found.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <span className="text-[30vw] font-heading font-black text-white/5 select-none leading-none">404</span>
        </div>

        <div className="text-center relative z-10 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tighter">PAGE NOT FOUND.</h1>
          <p className="text-xl text-white/50 mb-10 max-w-lg mx-auto font-medium">
            The resource you are looking for has been moved, removed, or does not exist.
          </p>
          <Button className="bg-white text-black hover:bg-white/90 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-3" />
              RETURN TO HOME
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

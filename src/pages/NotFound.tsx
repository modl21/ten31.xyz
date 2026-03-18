import { useSeoMeta } from "@unhead/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 - Page Not Found | TEN31",
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

      <main className="flex-grow flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-8xl font-heading font-bold text-white/10 mb-6">404</p>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4">Page Not Found</h1>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            The resource you are looking for has been moved, removed, or does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-white text-black hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Return to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

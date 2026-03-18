import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Blog", href: "/insights" },
    { name: "Team", href: "/team" },
    { name: "Funds", href: "/funds" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/90 backdrop-blur-sm border-b border-white/10 py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between">
        <Link to="/" className="text-white font-heading font-bold text-lg tracking-tight">
          TEN31
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.ten31timestamp.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Newsletter
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-black z-40 p-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-heading font-bold text-white border-b border-white/10 pb-4"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://www.ten31timestamp.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl font-heading font-bold text-white border-b border-white/10 pb-4"
          >
            Newsletter
          </a>
        </div>
      )}
    </header>
  );
};

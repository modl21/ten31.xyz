import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHash = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleHashClick = useCallback((e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname === "/") {
      scrollToHash(hash);
    } else {
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => scrollToHash(hash), 100);
    }
  }, [location.pathname, navigate, scrollToHash]);

  const navLinks = [
    { name: "Portfolio", href: "/#portfolio", hash: "#portfolio" },
    { name: "Blog", href: "/insights", hash: null },
    { name: "Team", href: "/team", hash: null },
    { name: "Funds", href: "/funds", hash: null },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-sm border-b border-border py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-lg tracking-tight text-foreground">
          TEN31
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.hash ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.hash)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            )
          )}
          <a
            href="https://www.ten31timestamp.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Newsletter
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-background z-40 p-6 flex flex-col gap-6">
          {navLinks.map((link) =>
            link.hash ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.hash)}
                className="text-xl font-heading font-bold text-foreground border-b border-border pb-4"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-heading font-bold text-foreground border-b border-border pb-4"
              >
                {link.name}
              </Link>
            )
          )}
          <a
            href="https://www.ten31timestamp.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl font-heading font-bold text-foreground border-b border-border pb-4"
          >
            Newsletter
          </a>
        </div>
      )}
    </header>
  );
};

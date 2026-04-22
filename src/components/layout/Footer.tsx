import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-16 bg-card">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="font-heading font-bold text-lg tracking-tight text-foreground block mb-4">
              TEN31
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-serif italic">
              Backing the people building what bitcoin needs next.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground/60 mb-4 font-medium">Navigate</p>
            <ul className="space-y-3">
              <li><a href="/#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</a></li>
              <li><Link to="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Team</Link></li>
              <li><Link to="/funds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funds</Link></li>
              <li><Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/white-paper" className="text-sm text-muted-foreground hover:text-foreground transition-colors">White Paper</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground/60 mb-4 font-medium">Contact</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:ir@ten31.vc" className="hover:text-foreground transition-colors">ir@ten31.vc</a>
              </li>
              <li>Bitcoin Park Nashville</li>
              <li>1910 21st Ave, Nashville, TN 37212</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] tracking-wider uppercase text-muted-foreground/40">
            &copy; {new Date().getFullYear()} TEN31 LLC
          </p>
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] tracking-wider text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            Vibed with Shakespeare
          </a>
        </div>
      </div>
    </footer>
  );
};

import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="font-heading font-bold text-lg tracking-tight text-white block mb-4">
              TEN31
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The world's leading investor in bitcoin infrastructure, open-source software, and freedom technology.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4">Navigate</p>
            <ul className="space-y-3">
              <li><a href="/#portfolio" className="text-sm text-white/50 hover:text-white transition-colors">Portfolio</a></li>
              <li><Link to="/team" className="text-sm text-white/50 hover:text-white transition-colors">Team</Link></li>
              <li><Link to="/funds" className="text-sm text-white/50 hover:text-white transition-colors">Funds</Link></li>
              <li><Link to="/insights" className="text-sm text-white/50 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/white-paper" className="text-sm text-white/50 hover:text-white transition-colors">White Paper</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <a href="mailto:ir@ten31.vc" className="hover:text-white transition-colors">ir@ten31.vc</a>
              </li>
              <li>Bitcoin Park Nashville</li>
              <li>1910 21st Ave, Nashville, TN 37212</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] tracking-wider uppercase text-white/20">
            &copy; {new Date().getFullYear()} TEN31 LLC
          </p>
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] tracking-wider text-white/20 hover:text-white/40 transition-colors"
          >
            Vibed with Shakespeare
          </a>
        </div>
      </div>
    </footer>
  );
};

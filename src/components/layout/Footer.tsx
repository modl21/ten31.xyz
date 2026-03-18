import { Link } from "react-router-dom";
import { Mail, MapPin, Twitter, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 relative isolate">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-[50%] -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-8">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center transition-transform group-hover:rotate-12">
                 <span className="text-black font-heading font-bold text-lg">10</span>
              </div>
              <span className="text-white font-heading font-bold text-2xl tracking-tighter uppercase">TEN31</span>
            </Link>
            <p className="text-white/50 text-lg max-w-sm font-medium leading-relaxed">
              The world’s leading partner for founders building the financial and informational infrastructure of the future.
            </p>
          </div>

          <div>
             <h4 className="text-white font-heading font-bold uppercase text-sm tracking-[0.2em] mb-6">EXPLORE</h4>
             <ul className="space-y-4">
               <li><a href="/#portfolio" className="text-white/60 hover:text-white transition-colors">Portfolio</a></li>
               <li><Link to="/team" className="text-white/60 hover:text-white transition-colors">Team</Link></li>
               <li><Link to="/funds" className="text-white/60 hover:text-white transition-colors">Funds</Link></li>
               <li><Link to="/invest" className="text-white/60 hover:text-white transition-colors">Invest</Link></li>
               <li><Link to="/white-paper" className="text-white/60 hover:text-white transition-colors">White Paper</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-heading font-bold uppercase text-sm tracking-[0.2em] mb-6">LOCATIONS</h4>
             <ul className="space-y-6">
               <li className="flex items-start space-x-3 text-white/60">
                 <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-white/30" />
                 <span>Bitcoin Park Nashville<br />1910 21st Ave, Nashville, TN 37212</span>
               </li>
               <li className="flex items-start space-x-3 text-white/60">
                 <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-white/30" />
                 <span>Bitcoin Park Austin<br />601 Congress Ave, Austin, TX 78701</span>
               </li>
               <li className="flex items-center space-x-3 text-white/60">
                 <Mail className="w-5 h-5 shrink-0 text-white/30" />
                 <a href="mailto:ir@ten31.vc" className="hover:text-white transition-colors">ir@ten31.vc</a>
               </li>
             </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 text-[10px] tracking-[0.25em] text-white/30 uppercase font-black font-heading">
          <p>© 2026 TEN31 LLC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-12 mt-6 md:mt-0">
             <span>VIBED WITH SHAKESPEARE</span>
             <a href="https://shakespeare.diy" target="_blank" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 decoration-2">GET STARTED</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

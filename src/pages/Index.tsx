import { useSeoMeta } from '@unhead/react';
import { ArrowRight, ChevronRight, Activity, Network, Shield, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PORTFOLIO = [
  { name: 'Anchor Watch', desc: 'Regulated bitcoin insurance and enterprise-grade multi-institutional custody', category: 'Insurance', link: 'https://www.anchorwatch.com' },
  { name: 'Battery', desc: 'Project finance vehicle integrating bitcoin as collateral', category: 'Credit products', link: 'https://www.batteryfinance.io/' },
  { name: 'Bitnob', desc: 'Africa-based bitcoin and lightning financial services platform', category: 'Financial services', link: 'https://bitnob.com/' },
  { name: 'Cathedra', desc: 'Miner focused on off-grid, stranded, and waste gas opportunities', category: 'Bitcoin mining', link: 'https://cathedra.com/' },
  { name: 'Coinkite', desc: 'Premier manufacturer of consumer tools for custody and security', category: 'Hardware', link: 'https://www.coinkite.com' },
  { name: 'debifi', desc: 'Non-custodial P2P lending platform focused on institutions', category: 'Credit products', link: 'https://debifi.com/' },
  { name: 'Fedi', desc: 'Platform enhancing the ease and privacy of bitcoin custody', category: 'Lightning', link: 'https://www.fedi.xyz/' },
  { name: 'Fold', desc: 'Bitcoin-linked consumer rewards', category: 'Consumer products', link: 'https://foldapp.com/' },
  { name: 'Giga Energy', desc: 'Texas-based natural gas bitcoin mining infrastructure provider', category: 'Bitcoin mining', link: 'https://www.gigaenergy.com/' },
  { name: 'GRIID', desc: 'Miner focused on vertical integration with nuclear / hydro power assets', category: 'Bitcoin mining', link: 'https://www.griid.com/' },
  { name: 'Hodl Hodl', desc: 'Non-custodial P2P bitcoin lending and trading platform', category: 'Trading', link: 'https://hodlhodl.com/' },
  { name: 'hoseki', desc: 'Non-custodial proof of ownership platform for bitcoin holders', category: 'Financial products', link: 'https://www.hoseki.app/' },
  { name: 'IBEX', desc: 'Latin America-based lightning infrastructure business', category: 'Lightning', link: 'https://www.poweredbyibex.io/' },
  { name: 'mempool.space', desc: 'The leading analytics platform for the bitcoin ecosystem', category: 'Analytics', link: 'https://mempool.space/' },
  { name: 'Mutiny', desc: 'Unique privacy-focused lightning platform with web-first design', category: 'Tools', link: 'https://www.mutinywallet.com/' },
  { name: 'nodl', desc: 'Sovereign and cloud-based bitcoin node infrastructure provider', category: 'Security infrastructure', link: 'https://www.nodl.eu/' },
  { name: 'Oshi', desc: 'Bitcoin-linked consumer rewards tailored to local markets', category: 'Consumer products', link: 'https://www.oshi.tech/' },
  { name: 'Peach', desc: 'P2P, non-custodial bitcoin exchange', category: 'Trading tools', link: 'https://peachbitcoin.com/' },
  { name: 'Primal', desc: 'Open source nostr client and caching provider', category: 'Nostr', link: 'https://primal.net/' },
  { name: 'River', desc: 'Bitcoin exchange and financial services provider', category: 'Trading', link: 'https://river.com/' },
  { name: 'Satoshi Energy', desc: 'Mining services provider focused on smart power contracts', category: 'Mining services', link: 'https://satoshienergy.com/' },
  { name: 'Sphinx', desc: 'Lightning-based social media and chat application', category: 'Consumer tech', link: 'https://sphinx.chat/' },
  { name: 'Stakwork', desc: 'Lightning-based platform for remote tasks and AI training', category: 'AI tools', link: 'https://stakwork.com/' },
  { name: 'Standard Bitcoin', desc: 'Hosted bitcoin mining operator providing on- and off-grid solutions', category: 'Bitcoin mining', link: 'https://standardbitcoin.com/' },
  { name: 'Start9', desc: 'Developer of OS and personal server for self-hosting software', category: 'Freedom tech', link: 'https://start9.com/' },
  { name: 'StatMuse', desc: 'AI/ML-based knowledge platform for sports, media, and bitcoin', category: 'AI', link: 'https://www.statmuse.com/' },
  { name: 'Strike', desc: 'Leading bitcoin and lightning financial services platform', category: 'Lightning', link: 'https://strike.me/' },
  { name: 'Unchained', desc: 'Collaborative custody platform offering suite of financial services', category: 'Financial services', link: 'https://unchained.com/' },
  { name: 'Upstream Data', desc: 'Leading services provider for oil & gas producers mining bitcoin', category: 'Mining infrastructure', link: 'https://upstreamdata.com/' },
  { name: 'Vida', desc: 'Lightning-powered content distribution and telecom platform', category: 'Lightning', link: 'https://vida.page/' },
  { name: 'zaprite', desc: 'Bitcoin invoicing, project management, and expense tracking', category: 'Commercial services', link: 'https://zaprite.com/' },
];

const Index = () => {
  useSeoMeta({
    title: 'TEN31 | Investors in Freedom Tech',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 isolate">
        <div className="absolute inset-0 z-[-1]">
          {/* Subtle geometric background or grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_80%)]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full animate-pulse blur-[180px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-4 py-1.5 mb-10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">Committed to Freedom</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-heading font-bold leading-[0.85] tracking-tighter mb-8 max-w-6xl text-gradient">
            BUILDING THE<br />NEW FRONT.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-medium leading-relaxed mb-12">
            The world's leading investor in bitcoin infrastructure, open-source software, and freedom technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button size="lg" variant="outline" className="border-white/20 bg-black text-white hover:bg-white/10 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all hover:scale-105" asChild>
              <a href="#portfolio">VIEW PORTFOLIO</a>
            </Button>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all" asChild>
              <Link to="/funds">EXPLORE FUNDS</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-black text-white hover:bg-white/10 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all" asChild>
              <a href="https://www.ten31timestamp.com" target="_blank" rel="noreferrer">NEWSLETTER</a>
            </Button>
          </div>

          {/* Inline Stats Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl mx-auto pt-10 border-t border-white/10">
            <div className="text-center group">
              <p className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-2 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">$250M+</p>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 font-bold group-hover:text-white transition-colors">Capital Deployed</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-2 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">30+</p>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 font-bold group-hover:text-white transition-colors">Portfolio Companies</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-2 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">90%</p>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 font-bold group-hover:text-white transition-colors">Lead Investor Rate</p>
            </div>
            <div className="text-center group">
              <p className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-2 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">2013</p>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/50 font-bold group-hover:text-white transition-colors">Year Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thesis Section */}
      <section id="thesis" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8 leading-tight">GENERATIONAL<br /><span className="text-white/40">TAILWINDS.</span></h2>
              <p className="text-xl text-white/60 leading-relaxed font-medium mb-12">
                We partner with next-generation companies building foundational technologies for the financial and informational infrastructure of the future. Our portfolio sits at the intersection of powerful secular trends, backing enterprises that secure American sovereignty through energy resilience, decentralized systems, and uncompromising financial architecture.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: "Bitcoin Native", desc: "Trading, payments, custody, security, and computing infrastructure.", icon: <Activity className="w-6 h-6" /> },
                  { title: "Open Source Software", desc: "The proliferation and virality of decentralized, permissionless code.", icon: <Network className="w-6 h-6" /> },
                  { title: "Nostr & Communications", desc: "New communications and media applications catalyzed by the nostr ecosystem.", icon: <Zap className="w-6 h-6" /> },
                  { title: "Artificial Intelligence", desc: "Unprecedented productivity improvements progressively converging with bitcoin.", icon: <Shield className="w-6 h-6" /> }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6 items-start group">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual element */}
            <div className="relative h-[600px] rounded-sm overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center isolate">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
              {/* Abstract decorative graphic representing connectivity */}
              <div className="relative w-full h-full flex items-center justify-center opacity-40">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute border border-white/20 rounded-[40%] animate-[spin_20s_linear_infinite]" 
                       style={{ 
                         width: `${300 + i * 100}px`, 
                         height: `${300 + i * 100}px`,
                         animationDuration: `${20 + i * 5}s`,
                         animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                       }}>
                  </div>
                ))}
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.5)] z-10">
                   <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                     <span className="text-white font-heading font-bold text-3xl">₿</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-6 leading-tight">UNMATCHED<br /><span className="text-white/40">GLOBAL PORTFOLIO.</span></h2>
              <p className="text-xl text-white/60 max-w-2xl font-medium">The founders leading the charge across the spectrum of freedom tech.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm font-bold tracking-[0.2em] uppercase text-white/50 border-b border-white/20 pb-2">
              <span>{PORTFOLIO.length} Active Investments</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {PORTFOLIO.map((item, i) => (
              <a 
                key={i} 
                href={item.link} 
                target="_blank" 
                rel="noreferrer"
                className="group border-t border-white/10 pt-6 hover:border-white/50 transition-colors block"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-heading font-bold group-hover:text-white transition-colors">{item.name}</h3>
                  <ArrowRight className="w-5 h-5 text-white/0 group-hover:text-white transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                </div>
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-white/40 mb-3">{item.category}</p>
                <p className="text-sm text-white/60 leading-relaxed font-medium">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8">PIONEERED BY<br />VETERANS.</h2>
          <p className="text-xl text-white/60 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
            Led by experts with decades of experience in private equity, venture capital, and deep roots in the bitcoin ecosystem since 2013.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all hover:scale-105 inline-flex items-center space-x-2" asChild>
            <Link to="/team">
              <span>MEET THE TEAM</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

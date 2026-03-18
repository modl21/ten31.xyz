import { useSeoMeta } from '@unhead/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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

      {/* Hero Section — everything above the fold */}
      <section className="min-h-[100vh] flex flex-col justify-between px-6 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto max-w-6xl flex-1 flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-bold leading-[1.05] tracking-tight mb-6 md:mb-8">
            <span className="md:hidden">Leading investor in freedom technology.</span>
            <span className="hidden md:inline">The world's leading investor<br className="hidden lg:inline" /> in freedom technology.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-8 md:mb-12">
            <span className="md:hidden">$250M+ deployed across 30+ companies since 2020.</span>
            <span className="hidden md:inline">Since 2020, we have deployed over $250M across 30+ companies building foundational technologies for the financial infrastructure of the future.</span>
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
            >
              Portfolio
            </a>
            <Link
              to="/funds"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-white text-black hover:bg-white/90 transition-colors"
            >
              Explore Funds
            </Link>
            <a
              href="https://www.ten31timestamp.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              Newsletter
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Stats pinned to bottom of viewport */}
        <div className="container mx-auto max-w-6xl pt-10 md:pt-12 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {[
            { value: '$250M+', label: 'Capital Deployed' },
            { value: '30+', label: 'Portfolio Companies' },
            { value: '90%', label: 'Lead Investor Rate' },
            { value: '2013', label: 'Year Established' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-4xl font-heading font-bold tracking-tight mb-1">{stat.value}</p>
              <p className="text-[10px] md:text-xs tracking-widest uppercase text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Investments — Strike & Giga highlighted */}
      <section className="py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs tracking-widest uppercase text-white/40 mb-10">Featured Investments</p>

          <div className="grid md:grid-cols-2 gap-px bg-white/10">
            {/* Strike */}
            <a
              href="https://strike.me"
              target="_blank"
              rel="noreferrer"
              className="bg-black p-10 md:p-14 group hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/10 px-3 py-1">Largest Investor</span>
                <ArrowUpRight className="w-5 h-5 text-white/0 group-hover:text-white/60 transition-colors" />
              </div>
              <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">Strike</h3>
              <p className="text-white/50 leading-relaxed max-w-md">
                <span className="md:hidden">Bitcoin and lightning financial services. TEN31 is Strike's largest investor.</span>
                <span className="hidden md:inline">The leading bitcoin and lightning financial services platform. TEN31 is the largest investor in Strike, reflecting our deep conviction in the company's mission to build the future of payments.</span>
              </p>
            </a>

            {/* Giga Energy */}
            <a
              href="https://www.gigaenergy.com"
              target="_blank"
              rel="noreferrer"
              className="bg-black p-10 md:p-14 group hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/10 px-3 py-1">First Investor</span>
                <ArrowUpRight className="w-5 h-5 text-white/0 group-hover:text-white/60 transition-colors" />
              </div>
              <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">Giga Energy</h3>
              <p className="text-white/50 leading-relaxed max-w-md">
                <span className="md:hidden">Natural gas bitcoin mining infrastructure. TEN31 was Giga's first investor.</span>
                <span className="hidden md:inline">Texas-based natural gas bitcoin mining infrastructure provider. TEN31 was the first institutional investor in Giga, backing the company from its earliest days.</span>
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Thesis Section — clean and direct */}
      <section id="thesis" className="py-28 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-8">
                Investment Thesis
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-12">
                <span className="md:hidden">Backing companies at the intersection of bitcoin, energy, decentralized systems, and open financial architecture.</span>
                <span className="hidden md:inline">We partner with next-generation companies building foundational technologies for the financial and informational infrastructure of the future. Our portfolio sits at the intersection of powerful secular trends, backing enterprises that secure sovereignty through energy resilience, decentralized systems, and uncompromising financial architecture.</span>
              </p>
            </div>

            <div className="space-y-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10 lg:pl-20 pt-8 lg:pt-0">
              {[
                { title: 'Bitcoin Native', desc: 'Trading, payments, custody, security, and computing infrastructure.' },
                { title: 'Open Source Software', desc: 'The proliferation and virality of decentralized, permissionless code.' },
                { title: 'Nostr & Communications', desc: 'New communications and media applications catalyzed by the nostr ecosystem.' },
                { title: 'Artificial Intelligence', desc: 'Unprecedented productivity improvements progressively converging with bitcoin.' },
              ].map((item, i) => (
                <div key={i} className="py-6 border-b border-white/10 last:border-b-0">
                  <h3 className="text-lg font-heading font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-28 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">Portfolio</h2>
              <p className="text-lg text-white/50 max-w-xl">
                <span className="md:hidden">30+ companies across freedom tech.</span>
                <span className="hidden md:inline">The founders leading the charge across the spectrum of freedom tech.</span>
              </p>
            </div>
            <p className="text-xs tracking-widest uppercase text-white/30">{PORTFOLIO.length} Companies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-0">
            {PORTFOLIO.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="group py-6 border-b border-white/10 hover:border-white/30 transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-heading font-bold group-hover:text-white transition-colors">{item.name}</h3>
                  <p className="text-xs text-white/30 mt-0.5">{item.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/60 transition-colors shrink-0 ml-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-28 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Pioneered by Veterans</h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
            <span className="md:hidden">Decades of experience in PE, VC, and bitcoin since 2013.</span>
            <span className="hidden md:inline">Led by experts with decades of experience in private equity, venture capital, and deep roots in the bitcoin ecosystem since 2013.</span>
          </p>
          <Link
            to="/team"
            className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-white text-black hover:bg-white/90 transition-colors"
          >
            Meet the Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

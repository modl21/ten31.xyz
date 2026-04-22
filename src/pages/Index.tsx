import { useSeoMeta } from '@unhead/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const PORTFOLIO = [
  { name: 'Anchor Watch', desc: 'Regulated bitcoin insurance, built on multi-institutional custody', category: 'Insurance', link: 'https://www.anchorwatch.com' },
  { name: 'Battery', desc: 'Project finance that treats bitcoin as the collateral it is', category: 'Credit', link: 'https://www.batteryfinance.io/' },
  { name: 'Bitnob', desc: 'Bitcoin and Lightning for Africa — remittances that actually work', category: 'Financial services', link: 'https://bitnob.com/' },
  { name: 'Cathedra', desc: 'Mining the stranded, off-grid, and otherwise wasted energy', category: 'Mining', link: 'https://cathedra.com/' },
  { name: 'Coinkite', desc: 'The people who made Coldcard. Enough said.', category: 'Hardware', link: 'https://www.coinkite.com' },
  { name: 'debifi', desc: 'Non-custodial P2P lending for institutions who know better than to rehypothecate', category: 'Credit', link: 'https://debifi.com/' },
  { name: 'Fedi', desc: 'Fedimint in your pocket — community custody that respects privacy', category: 'Lightning', link: 'https://www.fedi.xyz/' },
  { name: 'Fold', desc: 'Spend dollars, stack sats. The gateway drug.', category: 'Consumer', link: 'https://foldapp.com/' },
  { name: 'Giga Energy', desc: 'Flare gas to hashrate to AI compute, out of Texas', category: 'Mining', link: 'https://www.gigaenergy.com/' },
  { name: 'GRIID', desc: 'Vertically integrated miner with nuclear and hydro power', category: 'Mining', link: 'https://www.griid.com/' },
  { name: 'Hodl Hodl', desc: 'P2P trading and lending. No custody. No KYC theater.', category: 'Trading', link: 'https://hodlhodl.com/' },
  { name: 'hoseki', desc: 'Prove you own your bitcoin without handing it over', category: 'Tools', link: 'https://www.hoseki.app/' },
  { name: 'IBEX', desc: 'Lightning rails across Latin America', category: 'Lightning', link: 'https://www.poweredbyibex.io/' },
  { name: 'mempool.space', desc: 'The block explorer. You already have it bookmarked.', category: 'Analytics', link: 'https://mempool.space/' },
  { name: 'Mutiny', desc: 'Self-custodial Lightning that runs in your browser', category: 'Wallets', link: 'https://www.mutinywallet.com/' },
  { name: 'nodl', desc: 'Bitcoin nodes, sovereign or cloud — your choice', category: 'Infrastructure', link: 'https://www.nodl.eu/' },
  { name: 'Oshi', desc: 'Local bitcoin rewards for everyday spending', category: 'Consumer', link: 'https://www.oshi.tech/' },
  { name: 'Peach', desc: 'P2P bitcoin exchange, no custody involved', category: 'Trading', link: 'https://peachbitcoin.com/' },
  { name: 'Primal', desc: 'The nostr client that finally feels like an app', category: 'Nostr', link: 'https://primal.net/' },
  { name: 'River', desc: 'Bitcoin-only financial services, built to last', category: 'Trading', link: 'https://river.com/' },
  { name: 'Satoshi Energy', desc: 'Smart power contracts connecting miners and grids', category: 'Mining services', link: 'https://satoshienergy.com/' },
  { name: 'Sphinx', desc: 'Chat and social, paid for with sats', category: 'Consumer', link: 'https://sphinx.chat/' },
  { name: 'Stakwork', desc: 'Remote work and AI training, settled over Lightning', category: 'AI', link: 'https://stakwork.com/' },
  { name: 'Standard Bitcoin', desc: 'Hosted mining, on-grid or off', category: 'Mining', link: 'https://standardbitcoin.com/' },
  { name: 'Start9', desc: 'A personal server for the software you don\'t want to rent', category: 'Freedom tech', link: 'https://start9.com/' },
  { name: 'StatMuse', desc: 'AI-native search for sports, media, and bitcoin', category: 'AI', link: 'https://www.statmuse.com/' },
  { name: 'Strike', desc: 'Bitcoin and Lightning, for payments that just work', category: 'Lightning', link: 'https://strike.me/' },
  { name: 'Unchained', desc: 'Collaborative custody and loans, done with your keys', category: 'Financial services', link: 'https://unchained.com/' },
  { name: 'Upstream Data', desc: 'Mining rigs built for the oil patch', category: 'Mining infrastructure', link: 'https://upstreamdata.com/' },
  { name: 'Vida', desc: 'Lightning-powered publishing and telecom', category: 'Lightning', link: 'https://vida.page/' },
  { name: 'zaprite', desc: 'Invoicing and payments for businesses that take bitcoin', category: 'Commerce', link: 'https://zaprite.com/' },
];

const Index = () => {
  useSeoMeta({
    title: 'TEN31 | Investors in Freedom Tech',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="min-h-[100vh] flex flex-col justify-between px-6 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto max-w-6xl flex-1 flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-bold leading-[1.05] tracking-tight mb-6 md:mb-8">
            <span className="md:hidden">We back the builders of freedom tech.</span>
            <span className="hidden md:inline">We back the builders<br className="hidden lg:inline" /> of freedom tech.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8 md:mb-12 font-serif">
            <span className="md:hidden">$250M+ deployed into 30+ bitcoin companies since 2020.</span>
            <span className="hidden md:inline">Since 2020 we've put more than $250M to work across 30+ companies — mostly as lead, often first check. We write conviction-sized checks into the teams building what bitcoin needs next.</span>
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide border border-border text-foreground hover:bg-foreground hover:text-background transition-colors rounded-md"
            >
              Portfolio
            </a>
            <Link
              to="/funds"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
            >
              Explore Funds
            </Link>
            <a
              href="https://www.ten31timestamp.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors rounded-md"
            >
              Newsletter
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Stats pinned to bottom of viewport */}
        <div className="container mx-auto max-w-6xl pt-10 md:pt-12 border-t border-border grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {[
            { value: '$250M+', label: 'Capital Deployed' },
            { value: '30+', label: 'Portfolio Companies' },
            { value: '90%', label: 'Lead Investor Rate' },
            { value: '2013', label: 'Year Established' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-4xl font-heading font-bold tracking-tight mb-1">{stat.value}</p>
              <p className="text-[10px] md:text-xs tracking-widest uppercase text-muted-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Investments — Strike & Giga */}
      <section className="py-24 md:py-28 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground/60 mb-10 font-medium">Featured Investments</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Strike */}
            <a
              href="https://strike.me"
              target="_blank"
              rel="noreferrer"
              className="group p-8 md:p-12 border border-border rounded-lg hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/50 bg-muted px-3 py-1 rounded-full">Largest Investor</span>
                <ArrowUpRight className="w-5 h-5 text-transparent group-hover:text-muted-foreground transition-colors" />
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-4">Strike</h3>
              <p className="text-muted-foreground leading-relaxed font-serif">
                <span className="md:hidden">Bitcoin and lightning, done right. We're Strike's largest investor.</span>
                <span className="hidden md:inline">Bitcoin-native payments that actually work. We're Strike's largest investor — and have been backing Jack and the team since before most people understood what Lightning was for.</span>
              </p>
            </a>

            {/* Giga Energy */}
            <a
              href="https://www.gigaenergy.com"
              target="_blank"
              rel="noreferrer"
              className="group p-8 md:p-12 border border-border rounded-lg hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/50 bg-muted px-3 py-1 rounded-full">First Investor</span>
                <ArrowUpRight className="w-5 h-5 text-transparent group-hover:text-muted-foreground transition-colors" />
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-4">Giga Energy</h3>
              <p className="text-muted-foreground leading-relaxed font-serif">
                <span className="md:hidden">Turning stranded gas into hashrate (and now AI). We were first check.</span>
                <span className="hidden md:inline">A Texas outfit turning stranded natural gas into hashrate — and now AI compute. We wrote the first institutional check when they were still a handful of guys in the oil patch.</span>
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Thesis Section */}
      <section id="thesis" className="py-24 md:py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-8">
                How we think
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                Freedom doesn't scale through ideology. It scales through businesses people actually want to use.
              </p>
              <p className="text-base text-muted-foreground/80 leading-relaxed font-serif mt-6 max-w-md">
                So we invest in the unsexy work — rails, custody, mining, tools — that makes the rest of it possible.
              </p>
            </div>

            <div className="space-y-0 border-t border-border lg:border-t-0 lg:border-l lg:border-border lg:pl-16 xl:pl-20 pt-8 lg:pt-0">
              {[
                { title: 'Bitcoin, first', desc: 'Sound money is the load-bearing wall. Everything we fund either strengthens it or runs on it.' },
                { title: 'Open source', desc: 'Protocols beat platforms. Permissionless beats permissioned. Every time.' },
                { title: 'AI, on our terms', desc: 'The compute buildout is happening whether we like it or not. We\'d rather it happen with bitcoiners in the room.' },
              ].map((item, i) => (
                <div key={i} className="py-6 border-b border-border last:border-b-0">
                  <h3 className="text-lg font-heading font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed font-serif">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 md:py-28 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">Portfolio</h2>
              <p className="text-lg text-muted-foreground max-w-xl font-serif">
                <span className="md:hidden">The teams we've bet on.</span>
                <span className="hidden md:inline">The teams we've bet on — from miners and custodians to the consumer apps your parents might eventually use.</span>
              </p>
            </div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground/50 font-medium">{PORTFOLIO.length} Companies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-0">
            {PORTFOLIO.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="group py-5 border-b border-border hover:border-foreground/30 transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-base font-heading font-bold group-hover:text-foreground transition-colors">{item.name}</h3>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{item.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-transparent group-hover:text-muted-foreground transition-colors shrink-0 ml-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 md:py-28 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Run by people who've been here a while</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 font-serif">
            <span className="md:hidden">Bitcoin since 2013. Careers in PE and VC. Still showing up.</span>
            <span className="hidden md:inline">We've been around bitcoin since 2013, with careers in private equity and venture capital before that. Long enough to know which cycles matter and which are noise.</span>
          </p>
          <Link
            to="/team"
            className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
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

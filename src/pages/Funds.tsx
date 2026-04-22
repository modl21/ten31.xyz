import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowUpRight } from 'lucide-react';

export const Funds = () => {
  useSeoMeta({
    title: 'Funds | TEN31',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-20">
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-6">Funds</h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-serif">
              Three vehicles, one thesis. We lead about 90% of our rounds — which means we do real diligence, write the term sheet, and usually take a board seat. No spray and pray.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Fund I & II */}
            <div className="border border-border rounded-lg p-8 md:p-10 flex flex-col bg-card">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mb-8 font-medium">Fully Invested</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Low Time Preference Funds I & II</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1">Deployed Capital</p>
                  <p className="text-2xl font-heading font-bold">$130M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Vintages</span><span className="font-medium">2020, 2022</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Stage</span><span className="font-medium">Pre-seed to Series B</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Companies</span><span className="font-medium">40 Total</span></div>
                </div>
                <a href="/#portfolio" className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide border border-border text-foreground hover:bg-foreground hover:text-background transition-colors mt-4 w-full justify-center rounded-md">
                  Review Portfolio
                </a>
              </div>
            </div>

            {/* Fund III */}
            <div className="border-2 border-foreground rounded-lg p-8 md:p-10 flex flex-col bg-card shadow-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground font-bold mb-8">Active</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Low Time Preference Fund III</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1">Target</p>
                  <p className="text-2xl font-heading font-bold">$100–150M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Eligibility</span><span className="font-medium text-right">Institutional / Qualified</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Minimum</span><span className="font-medium">$1,000,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Stage</span><span className="font-medium">Pre-seed to Series B</span></div>
                </div>
                <a href="/invest" className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-colors mt-4 w-full justify-center rounded-md">
                  Inquire to Invest
                  <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>

            {/* Tactical Fund */}
            <div className="border border-border rounded-lg p-8 md:p-10 flex flex-col bg-card">
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground font-bold mb-8">Active</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Ten31 Tactical Fund</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1">Target</p>
                  <p className="text-2xl font-heading font-bold">$10M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Eligibility</span><span className="font-medium">Accredited Investors</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Minimum</span><span className="font-medium">$100,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Strategy</span><span className="font-medium">Co-investments</span></div>
                </div>
                <a
                  href="https://portal.angellist.com/l/dr/wbpfv-u"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide border border-border text-foreground hover:bg-foreground hover:text-background transition-colors mt-4 w-full justify-center rounded-md"
                >
                  Inquire via AngelList
                  <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 border-l-2 border-border pl-6">
            <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-2xl font-serif italic">
              Nothing on this page is a solicitation or an offer to sell securities. Past performance doesn't tell you what happens next. You know the drill.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Funds;

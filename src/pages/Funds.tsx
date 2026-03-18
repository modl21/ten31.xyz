import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowUpRight } from 'lucide-react';

export const Funds = () => {
  useSeoMeta({
    title: 'Funds | TEN31',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-20">
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-6">Funds</h1>
            <p className="text-lg text-white/50 leading-relaxed">
              Providing investors with diversified exposure across all verticals of the bitcoin ecosystem, leading with 90% deployment as lead investor.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-white/10">

            {/* Fund I & II */}
            <div className="bg-black p-10 flex flex-col">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-8">Fully Invested</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Low Time Preference Funds I & II</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/30 mb-1">Deployed Capital</p>
                  <p className="text-2xl font-heading font-bold">$130M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Vintages</span><span>2020, 2022</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Stage</span><span>Pre-seed to Series B</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Companies</span><span>40 Total</span></div>
                </div>
                <a href="/#portfolio" className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide border border-white/20 text-white hover:bg-white hover:text-black transition-colors mt-4 w-full justify-center">
                  Review Portfolio
                </a>
              </div>
            </div>

            {/* Fund III */}
            <div className="bg-black p-10 flex flex-col border-x border-white/10 lg:border-x-0">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white mb-8">Active</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Low Time Preference Fund III</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/30 mb-1">Target</p>
                  <p className="text-2xl font-heading font-bold">$100–150M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Eligibility</span><span className="text-right">Institutional / Qualified</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Minimum</span><span>$1,000,000</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Stage</span><span>Pre-seed to Series B</span></div>
                </div>
                <a href="/invest" className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide bg-white text-black hover:bg-white/90 transition-colors mt-4 w-full justify-center">
                  Inquire to Invest
                  <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>

            {/* Tactical Fund */}
            <div className="bg-black p-10 flex flex-col">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white mb-8">Active</p>
              <h2 className="text-2xl font-heading font-bold mb-2">Ten31 Tactical Fund</h2>
              <div className="mt-auto pt-10 space-y-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/30 mb-1">Target</p>
                  <p className="text-2xl font-heading font-bold">$10M</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Eligibility</span><span>Accredited Investors</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Minimum</span><span>$100,000</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Strategy</span><span>Co-investments</span></div>
                </div>
                <a
                  href="https://portal.angellist.com/l/dr/wbpfv-u"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center h-10 px-5 text-xs font-medium tracking-wide border border-white/20 text-white hover:bg-white hover:text-black transition-colors mt-4 w-full justify-center"
                >
                  Inquire via AngelList
                  <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 border-l-2 border-white/10 pl-6">
            <p className="text-xs text-white/30 leading-relaxed max-w-2xl">
              Disclaimer: The information provided on this website is for informational purposes only and is not intended as a solicitation for investment in any of our funds. Past performance is not necessarily indicative of future results.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Funds;

import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShieldAlert, Activity, GitBranch } from 'lucide-react';

export const Funds = () => {
  useSeoMeta({
    title: 'Funds | TEN31',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-white/5 blur-[200px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-24">
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 text-white">STRATEGIC<br /><span className="text-white/40">VEHICLES.</span></h1>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium">
              Providing investors with diversified exposure across all verticals of the bitcoin ecosystem, leading with 90% deployment as lead investor.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Fund I & II */}
            <div className="border border-white/10 bg-white/5 p-10 flex flex-col group hover:border-white/30 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 flex justify-end">
                 <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 border border-white/10 px-2 py-1 bg-black">INVESTED</div>
               </div>
               
               <Activity className="w-10 h-10 text-white/30 mb-8 group-hover:text-white transition-colors" />
               
               <h2 className="text-3xl font-heading font-bold mb-4">Low Time Preference<br />Funds I & II</h2>
               
               <div className="space-y-6 mt-auto pt-10">
                 <div>
                   <p className="text-xs font-bold tracking-[0.1em] uppercase text-white/40 mb-1">Deployed Capital</p>
                   <p className="text-2xl font-bold font-heading text-white">$130M</p>
                 </div>
                 
                 <ul className="space-y-3 border-t border-white/10 pt-6">
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Vintages</span>
                     <span className="font-bold">2020, 2022</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Stage</span>
                     <span className="font-bold">Pre-seed to Series B</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Companies</span>
                     <span className="font-bold">40 Total</span>
                   </li>
                 </ul>
                 
                 <Button variant="outline" className="w-full mt-6 rounded-none border-white/20 hover:bg-white hover:text-black font-bold tracking-[0.1em] transition-all" asChild>
                   <a href="/#portfolio">REVIEW PORTFOLIO</a>
                 </Button>
               </div>
            </div>

            {/* Fund III */}
            <div className="border border-white hover:border-white bg-white/5 p-10 flex flex-col group relative overflow-hidden ring-1 ring-white/20 shadow-[0_0_40px_-15px_rgba(255,255,255,0.2)]">
               <div className="absolute top-0 right-0 p-6 flex justify-end z-10">
                 <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-black bg-white px-2 py-1 animate-pulse">ACTIVE</div>
               </div>

               {/* subtle highlight effect inner */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               <ShieldAlert className="w-10 h-10 text-white mb-8 relative z-10" />
               
               <h2 className="text-3xl font-heading font-bold mb-4 relative z-10">Low Time Preference<br />Fund III</h2>
               
               <div className="space-y-6 mt-auto pt-10 relative z-10">
                 <div>
                   <p className="text-xs font-bold tracking-[0.1em] uppercase text-white/60 mb-1">Target</p>
                   <p className="text-3xl font-bold font-heading text-white">$100-150M</p>
                 </div>
                 
                 <ul className="space-y-3 border-t border-white/20 pt-6">
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/80">Eligibility</span>
                     <span className="font-bold text-right">Institutional /<br/>Qualified Purchasers</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/80">Minimum</span>
                     <span className="font-bold">$1,000,000</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/80">Stage</span>
                     <span className="font-bold">Pre-seed to Series B</span>
                   </li>
                 </ul>
                 
                 <Button className="w-full mt-6 rounded-none bg-white text-black hover:bg-white/90 font-bold tracking-[0.1em] transition-all flex items-center justify-center space-x-2 h-12" asChild>
                   <a href="/invest">INQUIRE TO INVEST <ExternalLink className="w-4 h-4 ml-2" /></a>
                 </Button>
               </div>
            </div>

            {/* Tactical Fund */}
            <div className="border border-white/10 bg-white/5 p-10 flex flex-col group hover:border-white/30 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 flex justify-end">
                 <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white border border-white/30 px-2 py-1">ACTIVE</div>
               </div>
               
               <GitBranch className="w-10 h-10 text-white/30 mb-8 group-hover:text-white transition-colors" />
               
               <h2 className="text-3xl font-heading font-bold mb-4">Ten31 Tactical<br />Fund</h2>
               
               <div className="space-y-6 mt-auto pt-10">
                 <div>
                   <p className="text-xs font-bold tracking-[0.1em] uppercase text-white/40 mb-1">Target</p>
                   <p className="text-2xl font-bold font-heading text-white">$10M</p>
                 </div>
                 
                 <ul className="space-y-3 border-t border-white/10 pt-6">
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Eligibility</span>
                     <span className="font-bold">Accredited Investors</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Minimum</span>
                     <span className="font-bold">$100,000</span>
                   </li>
                   <li className="flex items-center justify-between text-sm">
                     <span className="text-white/60">Strategy</span>
                     <span className="font-bold text-right">Co-investments</span>
                   </li>
                 </ul>
                 
                 <Button variant="outline" className="w-full mt-6 rounded-none border-white/20 hover:bg-white hover:text-black font-bold tracking-[0.1em] transition-all flex items-center justify-center" asChild>
                   <a href="https://portal.angellist.com/l/dr/wbpfv-u" target="_blank" rel="noreferrer">INQUIRE (ANGELLIST) <ExternalLink className="w-4 h-4 ml-2" /></a>
                 </Button>
               </div>
            </div>

          </div>

          <div className="mt-24 max-w-3xl border-l-[3px] border-white/20 pl-6 py-2">
            <p className="text-sm text-white/40 italic leading-relaxed">
              Disclaimer: The information provided on this website is for informational purposes only and is not intended as a solicitation for investment in any of our funds. Past performance is not necessarily indicative of future results and should not be used as the sole basis for making investment decisions.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Funds;

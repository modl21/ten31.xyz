import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Map, Users } from 'lucide-react';

export const Invest = () => {
  useSeoMeta({
    title: 'Invest | TEN31',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Abstract background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" stroke="white" strokeWidth="0.5"/>
             <path d="M50 5L88.9711 27.5V72.5L50 95L11.0289 72.5V27.5L50 5Z" stroke="white" strokeWidth="0.5"/>
             <path d="M50 10L84.641 30V70L50 90L15.359 70V30L50 10Z" stroke="white" strokeWidth="0.5"/>
             <path d="M50 15L80.3109 32.5V67.5L50 85L19.6891 67.5V32.5L50 15Z" stroke="white" strokeWidth="0.5"/>
             <path d="M50 20L75.9808 35V65L50 80L24.0192 65V35L50 20Z" stroke="white" strokeWidth="0.5"/>
             <path d="M50 25L71.6506 37.5V62.5L50 75L28.3494 62.5V37.5L50 25Z" stroke="white" strokeWidth="0.5"/>
             <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5"/>
             <line x1="6.69873" y1="25" x2="93.3013" y2="75" stroke="white" strokeWidth="0.5"/>
             <line x1="6.69873" y1="75" x2="93.3013" y2="25" stroke="white" strokeWidth="0.5"/>
           </svg>
         </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-4 py-1.5 mb-10 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">ALLOCATE CAPITAL</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">PARTNER<br />WITH TEN31.</h1>
            
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <p className="text-xl text-white/70 font-medium leading-relaxed mb-6">
                Ten31 invests across all verticals in the bitcoin ecosystem. The Ten31 funds aim to provide investors with diversified exposure to critical bitcoin infrastructure and tangential freedom technology applications, including open source software, AI and nostr.
              </p>
              <p className="text-white/50 mb-8 border-l border-white/20 pl-6">
                Ten31 has deployed nearly <strong className="text-white">\$250 million</strong> since its inception. Funds are available to accredited investors, with minimums of \$100,000 or more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <a href="mailto:ir@ten31.vc" className="group p-8 border border-white/10 bg-white/5 hover:border-white/40 transition-colors flex flex-col items-center text-center">
                <Mail className="w-8 h-8 text-white/50 group-hover:text-white mb-4 transition-colors" />
                <h3 className="font-heading font-bold text-xl mb-2">Contact Investor Relations</h3>
                <p className="text-white/50 text-sm mb-6">Email us directly for more information regarding allocations.</p>
                <div className="mt-auto font-bold tracking-[0.1em] text-sm group-hover:underline underline-offset-4">ir@ten31.vc</div>
              </a>
              
              <a href="https://portal.angellist.com/l/dr/wbpfv-u" target="_blank" rel="noreferrer" className="group p-8 border border-white/10 bg-white/5 hover:border-white/40 transition-colors flex flex-col items-center text-center">
                <Users className="w-8 h-8 text-white/50 group-hover:text-white mb-4 transition-colors" />
                <h3 className="font-heading font-bold text-xl mb-2">Tactical Fund</h3>
                <p className="text-white/50 text-sm mb-6">Via AngelList. Co-investments with the Low Time Preference Funds.</p>
                <div className="mt-auto flex items-center font-bold tracking-[0.1em] text-sm group-hover:underline underline-offset-4">
                   APPLY NOW <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Invest;

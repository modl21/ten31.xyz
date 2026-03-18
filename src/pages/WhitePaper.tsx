import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export const WhitePaper = () => {
  useSeoMeta({
    title: 'White Paper | TEN31',
    description: 'Read the Ten31 White Paper on Bitcoin, Freedom Tech, and Generational Secular Tailwinds.',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center space-x-2 border border-white/20 rounded-full px-4 py-1.5 mb-10 bg-white/5">
              <FileText className="w-4 h-4 text-white/80" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">RESEARCH</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">THE BITCOIN<br />THESIS.</h1>
            
            <p className="text-xl text-white/60 font-medium leading-relaxed mb-10">
              Our comprehensive research on the continued adoption of bitcoin and its enabling technologies, the proliferation of open source software, and the development of new communications paradigms.
            </p>

            <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-none h-14 px-8 text-sm font-bold tracking-[0.1em] transition-all group shrink-0" asChild>
              <a href="https://ten31.xyz/s/bitcoin.pdf" target="_blank" rel="noreferrer">
                <Download className="w-4 h-4 mr-3" />
                DOWNLOAD PDF
              </a>
            </Button>
          </div>

          <div className="flex-1 w-full max-w-lg aspect-[8.5/11] bg-white border-2 border-white/20 relative shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] group cursor-pointer transition-transform duration-500 hover:scale-105">
            {/* Minimalist document preview representation */}
            <div className="absolute inset-0 bg-[#f9f9f9]">
              <div className="absolute top-12 left-12 right-12 bottom-12 border-2 border-black/10 p-8 flex flex-col justify-between">
                <div>
                   <div className="w-12 h-12 bg-black mb-8 flex items-center justify-center">
                     <span className="text-white font-heading font-bold">10</span>
                   </div>
                   <h3 className="font-heading font-black text-4xl text-black leading-tight tracking-tighter mb-4">THE<br/>NEW<br/>FRONT</h3>
                   <div className="w-16 h-1 bg-black"></div>
                </div>
                <div className="text-black/40 font-bold tracking-[0.2em] text-[10px]">RESEARCH REPORT</div>
              </div>
            </div>
            
            {/* Hover overlay */}
            <a href="https://ten31.xyz/s/bitcoin.pdf" target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhitePaper;

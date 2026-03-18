import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Download } from 'lucide-react';

export const WhitePaper = () => {
  useSeoMeta({
    title: 'White Paper | TEN31',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24 px-6 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground/60 mb-6 font-medium">Research</p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">The Bitcoin Thesis</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-serif">
                Our comprehensive research on the continued adoption of bitcoin and its enabling technologies, the proliferation of open source software, and the development of new communications paradigms.
              </p>
              <a
                href="https://ten31.xyz/s/bitcoin.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center h-12 px-7 text-sm font-medium tracking-wide bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md"
              >
                <Download className="w-4 h-4 mr-3" />
                Download PDF
              </a>
            </div>

            {/* Minimal document preview */}
            <a
              href="https://ten31.xyz/s/bitcoin.pdf"
              target="_blank"
              rel="noreferrer"
              className="group aspect-[8.5/11] w-full max-w-md mx-auto bg-white border border-border rounded-lg relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute inset-10 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-black text-3xl text-foreground leading-tight tracking-tight mb-3 pt-6">THE NEW FRONT</h3>
                  <div className="w-12 h-0.5 bg-foreground"></div>
                </div>
                <p className="text-muted-foreground/40 text-[10px] tracking-[0.2em] font-bold uppercase">Research Report</p>
              </div>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/80 transition-colors flex items-center justify-center rounded-lg">
                <Download className="w-8 h-8 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
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

import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INSIGHTS } from '@/data/insights';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Insights = () => {
  useSeoMeta({
    title: 'Insights | TEN31',
    description: 'Read the latest essays, research, and insights on bitcoin and freedom technology from the Ten31 team.',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.10] mix-blend-overlay pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-24">
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">INSIGHTS.</h1>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium">
              Essays, research, and analysis on bitcoin and the architecture of freedom technology.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 max-w-5xl">
            {INSIGHTS.map((insight, i) => (
              <Link 
                key={insight.slug} 
                to={`/insights/${insight.slug}`}
                className="group border border-white/10 bg-white/5 p-8 md:p-12 hover:border-white/40 transition-colors block relative"
              >
                {insight.image && i === 0 && (
                  <div className="hidden md:block absolute top-0 right-0 w-1/3 h-full opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none [mask-image:linear-gradient(to_left,black,transparent)]">
                    <img src={insight.image} alt={insight.title} className="w-full h-full object-cover filter grayscale" />
                  </div>
                )}
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">{insight.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30"></span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">{insight.author}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tighter mb-6 group-hover:block transition-colors">{insight.title}</h2>
                  <p className="text-lg text-white/60 font-medium leading-relaxed mb-8">{insight.excerpt}</p>
                  
                  <div className="flex items-center text-sm font-bold tracking-[0.1em] text-white">
                    READ ARTICLE <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;

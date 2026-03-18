import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INSIGHTS } from '@/data/insights';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Insights = () => {
  useSeoMeta({
    title: 'Insights | TEN31',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-20">
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-6">Insights</h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-serif">
              Essays, research, and analysis on bitcoin and the architecture of freedom technology.
            </p>
          </div>

          <div className="space-y-0 border-t border-border">
            {INSIGHTS.map((insight) => (
              <Link
                key={insight.slug}
                to={`/insights/${insight.slug}`}
                className="group py-8 border-b border-border hover:border-foreground/20 transition-colors flex items-start justify-between gap-8"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground/60">{insight.date}</span>
                    <span className="text-xs text-muted-foreground/60">{insight.author}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight mb-2 group-hover:text-foreground transition-colors">{insight.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-serif">{insight.excerpt}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-transparent group-hover:text-muted-foreground transition-colors shrink-0 mt-2" />
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

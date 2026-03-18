import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INSIGHTS } from '@/data/insights';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const InsightPost = () => {
  const { slug } = useParams();
  const post = INSIGHTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  useSeoMeta({
    title: `${post.title} | TEN31`,
    description: post.excerpt,
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          
          <Link to="/insights" className="inline-flex items-center text-xs font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white mb-16 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Link>

          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 bg-white/10 px-3 py-1.5">{post.author}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter rendering-match leading-[1.1] mb-8">
              {post.title}
            </h1>
          </header>

          {post.image && (
            <div className="aspect-[21/9] w-full mb-16 border border-white/10 overflow-hidden bg-white/5">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover filter grayscale contrast-125" />
            </div>
          )}

          <div 
            className="prose prose-invert prose-lg md:prose-xl max-w-none font-medium leading-relaxed
              prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight 
              prose-a:text-white prose-a:underline-offset-4 prose-a:decoration-white/30 hover:prose-a:decoration-white
              prose-p:text-white/70 prose-strong:text-white prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InsightPost;

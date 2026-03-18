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
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />

      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-3xl">

          <Link to="/insights" className="inline-flex items-center text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-white/30">{post.date}</span>
              <span className="text-xs text-white/30">{post.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight leading-[1.1]">
              {post.title}
            </h1>
          </header>

          {post.image && (
            <div className="aspect-[21/9] w-full mb-12 overflow-hidden bg-white/5">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale" />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-white prose-a:underline-offset-4 prose-a:decoration-white/30 hover:prose-a:decoration-white
              prose-p:text-white/60 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InsightPost;

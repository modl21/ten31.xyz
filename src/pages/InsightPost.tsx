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
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="container mx-auto max-w-3xl">

          <Link to="/insights" className="inline-flex items-center text-xs tracking-widest uppercase text-muted-foreground/60 hover:text-foreground transition-colors mb-12 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-muted-foreground/60">{post.date}</span>
              <span className="text-xs text-muted-foreground/60">{post.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight leading-[1.1]">
              {post.title}
            </h1>
          </header>

          {post.image && (
            <div className="aspect-[21/9] w-full mb-12 overflow-hidden bg-muted rounded-lg">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none font-serif
              prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:font-sans
              prose-a:text-foreground prose-a:underline-offset-4 prose-a:decoration-border hover:prose-a:decoration-foreground
              prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InsightPost;

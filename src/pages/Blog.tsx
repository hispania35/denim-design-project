import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Icon from "@/components/ui/icon";
import { useBlogList, formatDate } from "@/hooks/useBlog";
import { useMeta } from "@/hooks/useMeta";

const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const Blog = () => {
  useMeta({
    title: "Блог — Языковая студия Hispania",
    description:
      "Статьи о том, как учить иностранные языки: советы, методики и полезные материалы от преподавателей студии Hispania.",
    canonical: "https://hispania35.ru/blog",
  });

  const { posts, loading } = useBlogList();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="font-heading font-900 text-4xl lg:text-5xl mb-3">
          <span className="gradient-text">Блог</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Советы, методики и полезные материалы об изучении языков
        </p>

        {loading && <p className="text-muted-foreground">Загрузка...</p>}

        {!loading && posts.length === 0 && (
          <p className="text-muted-foreground">Пока нет статей. Скоро здесь появятся публикации.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-border/50 shadow-sm hover-lift bg-white flex flex-col"
            >
              {post.coverImage ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-48 gradient-primary flex items-center justify-center">
                  <Icon name="BookOpen" size={48} className="text-white/80" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-muted-foreground mb-2">
                  {formatDate(post.createdAt)}
                </div>
                <h2 className="font-heading font-bold text-xl mb-2 group-hover:gradient-text transition-all">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 text-purple-600 text-sm font-medium mt-4">
                  Читать
                  <Icon name="ArrowRight" size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <Footer />
        <CookieBanner />
      </Suspense>
    </div>
  );
};

export default Blog;
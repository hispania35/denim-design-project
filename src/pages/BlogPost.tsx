import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import SectionFallback from "@/components/SectionFallback";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useBlogPost, formatDate } from "@/hooks/useBlog";
import { useMeta } from "@/hooks/useMeta";

const BookingSection = lazyWithRetry(() => import("@/components/BookingSection"));
const ContactsSection = lazyWithRetry(() => import("@/components/ContactsSection"));
const Footer = lazyWithRetry(() => import("@/components/Footer"));
const CookieBanner = lazyWithRetry(() => import("@/components/CookieBanner"));

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, notFound } = useBlogPost(slug);

  useMeta({
    title: post ? `${post.title} — Блог Hispania` : "Блог — Hispania",
    description: post?.excerpt || "",
    canonical: `https://hispania35.ru/blog/${slug || ""}`,
  });

  return (
    <div className="min-h-screen">
      <Header />
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-purple-600 mb-8"
        >
          <Icon name="ArrowLeft" size={16} />
          Все статьи
        </Link>

        {loading && <p className="text-muted-foreground">Загрузка...</p>}

        {notFound && (
          <div className="text-center py-16">
            <h1 className="font-heading font-bold text-2xl mb-3">Статья не найдена</h1>
            <Link to="/blog" className="text-purple-600 font-medium">
              Вернуться в блог
            </Link>
          </div>
        )}

        {post && (
          <>
            <div className="text-sm text-muted-foreground mb-3">
              {formatDate(post.createdAt)}
            </div>
            <h1 className="font-heading font-900 text-3xl lg:text-4xl mb-6 leading-tight">
              {post.title}
            </h1>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-2xl mb-8 object-cover max-h-[420px]"
              />
            )}

            <div className="prose max-w-none">
              {(post.content || "").split("\n").map((para, i) =>
                para.trim() ? (
                  <p key={i} className="text-foreground/80 leading-relaxed mb-4 text-lg">
                    {para}
                  </p>
                ) : null,
              )}
            </div>

            <div className="mt-12 rounded-2xl gradient-primary p-6 sm:p-8 text-center text-white">
              <h2 className="font-heading font-800 text-xl sm:text-2xl mb-2">
                Хотите так же свободно говорить на языке?
              </h2>
              <p className="text-white/90 text-sm sm:text-base mb-6">
                Запишитесь на бесплатное пробное занятие — подберём программу под вашу цель
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto font-heading font-semibold text-base px-8 h-14 rounded-xl"
                onClick={scrollToBooking}
              >
                Записаться на пробное
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </>
        )}
      </article>

      {post && (
        <Suspense fallback={<SectionFallback cards={2} />}>
          <BookingSection />
          <ContactsSection />
          <Footer />
          <CookieBanner />
        </Suspense>
      )}
    </div>
  );
};

export default BlogPost;
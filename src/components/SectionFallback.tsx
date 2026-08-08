import { Skeleton } from "@/components/ui/skeleton";

interface SectionFallbackProps {
  cards?: number;
  tall?: boolean;
}

const SectionFallback = ({ cards = 3, tall = false }: SectionFallbackProps) => (
  <section className="py-24" aria-hidden="true">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4 mb-16">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-10 w-72 max-w-full rounded-xl" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {Array.from({ length: cards }).map((_, i) => (
          <Skeleton key={i} className={`rounded-3xl ${tall ? "h-96" : "h-64"}`} />
        ))}
      </div>
    </div>
  </section>
);

export default SectionFallback;

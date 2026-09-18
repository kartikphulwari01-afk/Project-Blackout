import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const trendingProducts = await prisma.product.findMany({
    take: 4,
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      reviews: true
    },
    orderBy: { reviews: { _count: 'desc' } } // most reviewed
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background" 
            fill 
            className="object-cover opacity-[0.15] dark:opacity-20 scale-105 transform-gpu motion-safe:animate-[pulse_10s_ease-in-out_infinite_alternate]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container z-10 text-center flex flex-col items-center">
          <span className="px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-md text-xs font-semibold tracking-widest uppercase mb-6 inline-block">
            New Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-4xl mb-6 text-balance leading-none">
            Everything. <span className="text-primary italic">Together.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance leading-relaxed">
            Discover a curated universe of premium products. Meticulously designed for your modern lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full w-full h-14 px-8 text-base group">
                Shop Collection 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop?category=electronics" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="rounded-full w-full h-14 px-8 text-base bg-background/50 backdrop-blur-md">
                Explore Tech
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories (Bento Grid) */}
      <section className="py-20 container">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Curated Spaces</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          <Link href="/shop?category=electronics" className="group relative rounded-3xl overflow-hidden md:col-span-2 bg-secondary">
            <Image src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200" alt="Electronics" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-bold text-white mb-2">Technology</h3>
              <p className="text-white/80">Pro-grade gear for creators.</p>
            </div>
          </Link>
          
          <Link href="/shop?category=fashion" className="group relative rounded-3xl overflow-hidden bg-secondary">
            <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800" alt="Fashion" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-bold text-white mb-2">Fashion</h3>
              <p className="text-white/80">Everyday essentials.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Trending Now</h2>
              <p className="text-muted-foreground">The most loved items this week.</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="rounded-full group">
                View all <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => {
              const avgRating = product.reviews.length > 0 
                ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length 
                : 0;

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="group cursor-pointer block bg-background p-3 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
                    {product.images[0] && (
                      <Image 
                        src={product.images[0].url} 
                        alt={product.images[0].alt || product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="space-y-1 px-2 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium leading-tight line-clamp-1">{product.name}</h3>
                      {avgRating > 0 && (
                        <div className="flex items-center text-xs font-medium shrink-0 bg-secondary px-1.5 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-primary text-primary mr-1" />
                          {avgRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

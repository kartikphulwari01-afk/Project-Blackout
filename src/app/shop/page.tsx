/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = searchParams.category as string | undefined;
  const qParam = searchParams.q as string | undefined;
  const sortParam = searchParams.sort as string | undefined;

  const where: any = {};
  if (categoryParam) {
    where.category = { slug: categoryParam };
  }
  if (qParam) {
    where.name = { contains: qParam };
  }
  
  let orderBy: any = { createdAt: 'desc' };
  if (sortParam === 'price_asc') orderBy = { price: 'asc' };
  if (sortParam === 'price_desc') orderBy = { price: 'desc' };

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      reviews: true
    },
    orderBy
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="container py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">The Collection</h1>
          <p className="text-muted-foreground text-lg">
            {qParam ? `Search results for "${qParam}"` : categoryParam ? `Browsing ${categoryParam}` : "Discover our premium range of products."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group z-30">
            <Button variant="outline" className="gap-2">
              Sort by: {sortParam === 'price_asc' ? 'Price: Low to High' : sortParam === 'price_desc' ? 'Price: High to Low' : 'Featured'} <ChevronDown className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
              <Link href={`/shop?${new URLSearchParams({...searchParams as Record<string, string>, sort: 'featured'}).toString()}`} className="block px-4 py-2 hover:bg-secondary text-sm">Featured</Link>
              <Link href={`/shop?${new URLSearchParams({...searchParams as Record<string, string>, sort: 'price_asc'}).toString()}`} className="block px-4 py-2 hover:bg-secondary text-sm">Price: Low to High</Link>
              <Link href={`/shop?${new URLSearchParams({...searchParams as Record<string, string>, sort: 'price_desc'}).toString()}`} className="block px-4 py-2 hover:bg-secondary text-sm">Price: High to Low</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 shrink-0 hidden lg:block">
          <div className="sticky top-28">
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className={`text-sm transition-colors ${!categoryParam ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  All Categories
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?category=${c.slug}`} className={`text-sm transition-colors ${categoryParam === c.slug ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border rounded-2xl">
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Link href="/shop">
                <Button className="mt-6 rounded-full">Clear Filters</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
              {products.map((product) => {
                const avgRating = product.reviews.length > 0 
                  ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length 
                  : 0;

                return (
                  <Link href={`/product/${product.slug}`} key={product.id} className="group cursor-pointer block">
                    <div className="relative aspect-[4/5] bg-secondary rounded-2xl overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                      {product.images[0] && (
                        <Image 
                          src={product.images[0].url} 
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="space-y-1 px-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium leading-tight line-clamp-1">{product.name}</h3>
                        {avgRating > 0 && (
                          <div className="flex items-center text-xs font-medium shrink-0">
                            <Star className="w-3 h-3 fill-primary text-primary mr-1" />
                            {avgRating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        {product.compareAt && (
                          <span className="text-sm text-muted-foreground line-through">${product.compareAt.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

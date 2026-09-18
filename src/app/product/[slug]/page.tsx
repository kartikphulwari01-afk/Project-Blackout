import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ProductActions } from "@/components/shop/ProductActions";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: true,
      reviews: { include: { user: true } },
      inventory: true,
    }
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { images: true }
  });

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const avgRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length 
    : 0;

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative aspect-square bg-secondary rounded-3xl overflow-hidden">
            {primaryImage && (
              <Image 
                src={primaryImage.url} 
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          {/* Thumbnails placeholder */}
          <div className="flex gap-4">
            {product.images.map((img, i) => (
              <div key={img.id} className={`relative w-24 h-24 bg-secondary rounded-xl overflow-hidden cursor-pointer ${img.isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {product.category.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-balance">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium underline underline-offset-4 cursor-pointer text-muted-foreground hover:text-foreground">
              {product.reviews.length} Reviews
            </span>
          </div>

          <div className="text-3xl font-semibold mb-8 flex items-end gap-3">
            ${product.price.toFixed(2)}
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through mb-1">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
            {product.description}
          </p>

          <ProductActions product={product} />
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link href={`/product/${rel.slug}`} key={rel.id} className="group block">
                <div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
                  {rel.images[0] && (
                    <Image 
                      src={rel.images[0].url} 
                      alt={rel.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  )}
                </div>
                <h3 className="font-medium leading-tight line-clamp-1">{rel.name}</h3>
                <p className="text-sm font-semibold mt-1">${rel.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Reviews Section */}
      <div className="mt-24 pt-12 border-t border-border">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-secondary/30 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted'}`} 
                    />
                  ))}
                </div>
                <p className="font-medium mb-1">{review.user.name || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground mb-4">{new Date(review.createdAt).toLocaleDateString()}</p>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { Heart, Truck, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProductActions({ product }: { product: any }) {
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images.find((i: any) => i.isPrimary)?.url || '';

  const handleAddToCart = () => {
    setAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      quantity: 1
    });
    setTimeout(() => {
      setAdding(false);
      router.push('/cart');
    }, 500);
  };

  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center gap-4">
        <Button size="lg" className="flex-1 rounded-full text-base h-14" onClick={handleAddToCart} disabled={adding}>
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="w-14 h-14 rounded-full shrink-0"
          onClick={() => toggleItem(product.id)}
        >
          <Heart className={`w-6 h-6 ${hasItem(product.id) ? 'fill-destructive text-destructive' : ''}`} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="w-5 h-5" /> Free Premium Delivery
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="w-5 h-5" /> 2-Year Warranty
        </div>
      </div>
    </div>
  );
}

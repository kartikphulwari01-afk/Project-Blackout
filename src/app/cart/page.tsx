'use client';

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center max-w-md">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet. Discover our premium collections.
        </p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full w-full">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold tracking-tighter mb-12">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 rounded-2xl border border-border bg-card">
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-secondary rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-secondary rounded-full px-2 py-1">
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="p-6 rounded-3xl bg-secondary/30 border border-border sticky top-28">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-primary">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (Estimated)</span>
                <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button size="lg" className="w-full rounded-full text-base h-14">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

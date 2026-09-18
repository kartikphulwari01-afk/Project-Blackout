'use client';

import { useState } from "react";
import { Check, CreditCard, MapPin, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { items, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  // Address state
  const [address] = useState({
    street: '123 Cyber Street',
    city: 'Tech City',
    postalCode: '10001'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));

  const placeOrder = async () => {
    if (!session) {
      alert("Please sign in to place an order");
      router.push("/login");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: total * 1.08,
          address
        })
      });

      if (res.ok) {
        setStep(4);
        clearCart();
      } else {
        alert("Failed to place order.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred.");
    }
    setLoading(false);
  };

  if (step === 4) {
    return (
      <div className="container py-24 text-center max-w-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Order Confirmed</h1>
        <p className="text-muted-foreground mb-8 text-balance">
          Thank you for your purchase. Your premium items will be shipped shortly. Order #MS-{Math.floor(Math.random() * 100000)}
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full w-full" onClick={clearCart}>
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg mb-8 text-center font-medium">
        Simulation Mode: This is a demo. Do not enter real payment information.
      </div>
      
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
        {[
          { num: 1, title: 'Address', icon: MapPin },
          { num: 2, title: 'Shipping', icon: Truck },
          { num: 3, title: 'Payment', icon: CreditCard }
        ].map((s) => (
          <div key={s.num} className={`flex items-center gap-3 shrink-0 ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === s.num ? 'bg-primary text-primary-foreground' : step > s.num ? 'bg-primary/20 text-primary' : 'bg-secondary'}`}>
              {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className="font-semibold">{s.title}</span>
            {s.num < 3 && <div className="w-12 h-[2px] bg-border mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="Demo" />
                <input type="text" placeholder="Last Name" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="User" />
              </div>
              <input type="text" placeholder="Address" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="123 Cyber Street" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="Tech City" />
                <input type="text" placeholder="Postal Code" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="10001" />
              </div>
              <Button size="lg" className="rounded-full w-full mt-4" onClick={handleNext}>Continue to Shipping</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
              <div className="border border-primary bg-primary/5 rounded-xl p-4 flex items-center justify-between cursor-pointer">
                <div>
                  <h4 className="font-bold">Premium Express</h4>
                  <p className="text-sm text-muted-foreground">1-2 Business Days</p>
                </div>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border border-border rounded-xl p-4 flex items-center justify-between cursor-pointer opacity-50">
                <div>
                  <h4 className="font-bold">Standard</h4>
                  <p className="text-sm text-muted-foreground">3-5 Business Days</p>
                </div>
                <span className="font-semibold">Free</span>
              </div>
              <Button size="lg" className="rounded-full w-full mt-4" onClick={handleNext}>Continue to Payment</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Payment</h2>
              <input type="text" placeholder="Card Number (DEMO)" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="12/25" />
                <input type="text" placeholder="CVC" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none" defaultValue="123" />
              </div>
              <Button size="lg" className="rounded-full w-full mt-4" onClick={placeOrder} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Place Order (Demo)
              </Button>
            </div>
          )}
        </div>

        <div>
          <div className="p-6 rounded-3xl bg-secondary/30 border border-border sticky top-28">
            <h3 className="font-bold mb-4">Summary</h3>
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-muted-foreground">
              <span>Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

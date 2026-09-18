import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tighter mb-4">MOSAIC</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs text-balance">
              Everything. Together. A premium destination for discovering and collecting exceptional products.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/new" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link href="/trending" className="hover:text-foreground transition-colors">Trending</Link></li>
              <li><Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
              <li><Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-foreground transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin/security" className="hover:text-primary transition-colors">Security Overview</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MOSAIC. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Demo Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

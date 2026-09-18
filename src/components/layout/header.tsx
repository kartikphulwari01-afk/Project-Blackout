'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Menu, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';
import { SearchBar } from './SearchBar';

import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 z-50">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link href="/" className="flex items-center">
            <div className="relative w-[120px] h-[40px] md:w-[140px] md:h-[48px]">
              <Image 
                src="/images/mosaic-logo.png" 
                alt="MOSAIC" 
                fill 
                className="object-contain object-left" 
                priority
              />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground ml-4">
            <Link href="/shop?category=electronics" className="hover:text-foreground transition-colors">Electronics</Link>
            <Link href="/shop?category=fashion" className="hover:text-foreground transition-colors">Fashion</Link>
            <Link href="/shop?category=home-living" className="hover:text-foreground transition-colors">Home & Living</Link>
            <Link href="/shop?category=accessories" className="hover:text-foreground transition-colors">Accessories</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <SearchBar />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>
          
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" className="text-sm font-medium hidden sm:flex">
                  Hi, {session.user?.name?.split(' ')[0]}
                </Button>
              </Link>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="hidden sm:flex rounded-full text-xs h-8">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden pt-20 px-4">
          <nav className="flex flex-col gap-6 text-xl font-medium mt-8">
            <Link href="/shop?category=electronics" onClick={() => setIsMobileMenuOpen(false)}>Electronics</Link>
            <Link href="/shop?category=fashion" onClick={() => setIsMobileMenuOpen(false)}>Fashion</Link>
            <Link href="/shop?category=home-living" onClick={() => setIsMobileMenuOpen(false)}>Home & Living</Link>
            <Link href="/shop?category=accessories" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
            
            <div className="pt-8 border-t border-border flex flex-col gap-4">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                  )}
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect("/login");
  }

  return (
    <div className="container py-8">
      <div className="flex min-h-[calc(100vh-144px)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-border bg-secondary/30 p-6 hidden md:block shrink-0">
          <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium text-sm">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" /> Orders
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium text-sm text-muted-foreground">
              <Package className="w-4 h-4" /> Products
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium text-sm text-muted-foreground">
              <Users className="w-4 h-4" /> Users
            </Link>
            
            <div className="pt-6 mt-6 border-t border-border">
              <Link href="/admin/security" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors font-bold text-sm">
                <Shield className="w-4 h-4" /> Security Sims
              </Link>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, MapPin, Bell, Clock } from "lucide-react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { name: "Overview & Orders", href: "/account", icon: Package },
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Notifications", href: "/account/notifications", icon: Bell },
    { name: "Recently Viewed", href: "/account/recently-viewed", icon: Clock },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {session.user?.name}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
              >
                <item.icon className="w-4 h-4 text-muted-foreground" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  );
}

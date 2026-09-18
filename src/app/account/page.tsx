import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { include: { images: true } } } } }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order History & Tracking</h2>
      {user.orders.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">When you place orders, they will appear here along with tracking timelines.</p>
          <Link href="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {user.orders.map(order => (
            <div key={order.id} className="border border-border rounded-xl p-6 bg-background shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()} • ${order.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-secondary text-sm font-medium border border-border">
                    Status: {order.status}
                  </span>
                  <Button variant="outline" size="sm">Track Package</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative bg-secondary rounded overflow-hidden">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

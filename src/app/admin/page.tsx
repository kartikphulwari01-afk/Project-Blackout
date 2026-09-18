import { prisma } from "@/lib/prisma";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [userCount, orderCount, productCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({ _sum: { total: true } })
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">Total Revenue</h3>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">${(totalRevenue._sum.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">Orders</h3>
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">Products</h3>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-muted-foreground">Users</h3>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-6">Recent Orders</h2>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Placeholder table, fetch real recent orders in production */}
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-6 py-4 font-mono text-xs">#MS-10492</td>
              <td className="px-6 py-4 font-medium">Demo User</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold bg-primary/20 text-primary">DELIVERED</span></td>
              <td className="px-6 py-4 font-medium">$2,199.98</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

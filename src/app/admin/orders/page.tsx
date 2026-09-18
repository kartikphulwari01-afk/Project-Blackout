import { prisma } from "@/lib/prisma";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-mono text-xs">{o.id.slice(-8).toUpperCase()}</td>
                <td className="px-6 py-4">{o.user.name}</td>
                <td className="px-6 py-4 font-medium">${o.total.toFixed(2)}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-secondary text-xs font-bold">{o.status}</span></td>
                <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

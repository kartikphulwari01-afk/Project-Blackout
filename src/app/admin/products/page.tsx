import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ include: { category: true, inventory: true, images: { take: 1 } } });
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 flex items-center gap-3">
                  {p.images[0] && <div className="w-10 h-10 relative rounded overflow-hidden bg-secondary"><Image src={p.images[0].url} fill alt="" className="object-cover" /></div>}
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-6 py-4">{p.category.name}</td>
                <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4">{p.inventory?.quantity ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-secondary text-xs font-bold">{u.role}</span></td>
                <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const fs = require('fs');
const dirs = ['profile', 'wishlist', 'addresses', 'notifications', 'recently-viewed'];
dirs.forEach(d => {
  fs.writeFileSync(`src/app/account/${d}/page.tsx`, `export default function Page() { return <div className="py-8 text-xl text-muted-foreground">This section is currently under construction.</div>; }`, 'utf8');
});

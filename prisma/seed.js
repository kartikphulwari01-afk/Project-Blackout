const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fashion', slug: 'fashion', description: 'Trending clothing and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { name: 'Home & Living', slug: 'home-living', description: 'Everything for your home', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800' },
  { name: 'Accessories', slug: 'accessories', description: 'Premium accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare and beauty products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sports', slug: 'sports', description: 'Sporting goods and equipment', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Books', slug: 'books', description: 'Bestsellers and classics', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gaming', slug: 'gaming', description: 'Consoles, games, and gear', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800' },
];

const adjectives = ['Premium', 'Pro', 'Ultra', 'Essential', 'Classic', 'Modern', 'Sleek', 'Minimal', 'Smart', 'Elite'];
const nouns = {
  'electronics': ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Monitor', 'Camera'],
  'fashion': ['Jacket', 'Sneakers', 'T-Shirt', 'Jeans', 'Sweater', 'Dress'],
  'home-living': ['Chair', 'Desk', 'Lamp', 'Sofa', 'Rug', 'Vase'],
  'accessories': ['Watch', 'Wallet', 'Sunglasses', 'Belt', 'Bag', 'Backpack'],
  'beauty': ['Serum', 'Moisturizer', 'Perfume', 'Cleanser', 'Mask', 'Lipstick'],
  'sports': ['Yoga Mat', 'Dumbbells', 'Water Bottle', 'Running Shoes', 'Tennis Racket', 'Gym Bag'],
  'books': ['Novel', 'Biography', 'Cookbook', 'Notebook', 'Planner', 'Journal'],
  'gaming': ['Controller', 'Headset', 'Keyboard', 'Mouse', 'Console', 'Mousepad']
};

const images = {
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
  'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
  'home-living': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
  'accessories': 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800',
  'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800',
  'sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
  'books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
  'gaming': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
};

async function generateProducts(categoryMap, users) {
  const products = [];
  
  for (const cat of categories) {
    const categoryId = categoryMap[cat.slug];
    const catNouns = nouns[cat.slug];
    
    // Generate 6 products per category (total 48)
    for (let i = 0; i < 6; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = catNouns[Math.floor(Math.random() * catNouns.length)];
      const name = `${adj} ${noun} ${i + 1}`;
      const slug = name.toLowerCase().replace(/ /g, '-');
      
      const price = Math.floor(Math.random() * 500) + 19.99;
      const compareAt = Math.random() > 0.5 ? price * (1 + Math.random() * 0.5) : null;
      
      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description: `Experience the finest quality with our ${name}. Carefully crafted for everyday use and built to last.`,
          price,
          compareAt,
          categoryId,
          inventory: {
            create: {
              quantity: Math.floor(Math.random() * 100),
              sku: `SKU-${cat.slug.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`
            }
          },
          images: {
            create: [
              { url: images[cat.slug], isPrimary: true, alt: name }
            ]
          }
        }
      });
      
      // Add random reviews
      const numReviews = Math.floor(Math.random() * 5);
      for (let j = 0; j < numReviews; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        await prisma.review.create({
          data: {
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
            comment: 'Great product, highly recommended!',
            productId: product.id,
            userId: randomUser.id
          }
        });
      }
      
      products.push(product);
    }
  }
  
  return products;
}

async function main() {
  console.log('Cleaning up database...');
  await prisma.securityEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@mosaic.com', password: passwordHash, role: 'ADMIN' }
  });
  
  const user = await prisma.user.create({
    data: { name: 'Demo User', email: 'user@mosaic.com', password: passwordHash, role: 'USER' }
  });
  
  // Some dummy users for reviews
  const dummyUsers = [];
  for (let i = 0; i < 5; i++) {
    const dummy = await prisma.user.create({
      data: { name: `Customer ${i+1}`, email: `customer${i+1}@example.com`, password: passwordHash, role: 'USER' }
    });
    dummyUsers.push(dummy);
  }

  console.log('Creating categories...');
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  console.log('Creating products (48 total)...');
  const allUsers = [admin, user, ...dummyUsers];
  const products = await generateProducts(categoryMap, allUsers);

  console.log('Creating demo orders...');
  // Create an address for the user
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      street: '123 E-Commerce Blvd',
      city: 'Tech City',
      state: 'CA',
      postalCode: '90210',
      country: 'USA',
      isDefault: true
    }
  });

  // Create a sample order
  await prisma.order.create({
    data: {
      userId: user.id,
      addressId: address.id,
      total: products[0].price + products[1].price,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: products[0].price },
          { productId: products[1].id, quantity: 1, price: products[1].price }
        ]
      }
    }
  });

  console.log('Creating security events...');
  await prisma.securityEvent.createMany({
    data: [
      { type: 'SIMULATED_MALICIOUS_CLICK', severity: 'LOW', source: 'Frontend.ProductCard', status: 'LOGGED' },
      { type: 'SIMULATED_PAYLOAD', severity: 'HIGH', source: 'API.Search', status: 'INVESTIGATING', metadata: '{"query": "<script>"}' }
    ]
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { items, total, address } = body;

    // In a real app, we would validate product prices and inventory here
    // Create an address
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        street: address.street,
        city: address.city,
        state: 'N/A',
        postalCode: address.postalCode,
        country: 'N/A'
      }
    });

    // Create the order and update inventory in a transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: user.id,
          addressId: newAddress.id,
          total: total,
          status: 'PROCESSING',
          paymentStatus: 'PAID', // Simulated
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      }),
      // Decrement inventory for all items
      ...items.map((item: any) => 
        prisma.inventory.updateMany({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } }
        })
      )
    ]);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}

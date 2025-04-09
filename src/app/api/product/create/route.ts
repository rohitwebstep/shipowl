import { NextRequest, NextResponse } from 'next/server';
import { isUserExist } from '@/utils/authUtils';

export async function POST(req: NextRequest) {
  try {
    // Retrieve x-admin-id from request headers
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      return NextResponse.json(
        { error: 'User ID is missing or invalid in request' },
        { status: 400 }
      );
    }

    // Check if admin exists
    const result = await isUserExist(Number(adminId), String(adminRole));
    if (!result.status) {
      return NextResponse.json({ error: `User Not Found 1: ${result.message}` }, { status: 404 });
    }

    const products = [
      {
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        image: 'image1.jpg',
        category: 'Category 1',
        stock: 10,
        sku: 'SKU1',
        tags: ['tag1', 'tag2'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 2',
        price: 150,
        description: 'Description 2',
        image: 'image2.jpg',
        category: 'Category 2',
        stock: 20,
        sku: 'SKU2',
        tags: ['tag3', 'tag4'],
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 3',
        price: 200,
        description: 'Description 3',
        image: 'image3.jpg',
        category: 'Category 1',
        stock: 5,
        sku: 'SKU3',
        tags: ['tag1', 'tag5'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 4',
        price: 50,
        description: 'Description 4',
        image: 'image4.jpg',
        category: 'Category 3',
        stock: 30,
        sku: 'SKU4',
        tags: ['tag6'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 5',
        price: 120,
        description: 'Description 5',
        image: 'image5.jpg',
        category: 'Category 2',
        stock: 15,
        sku: 'SKU5',
        tags: ['tag3', 'tag7'],
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 6',
        price: 250,
        description: 'Description 6',
        image: 'image6.jpg',
        category: 'Category 1',
        stock: 12,
        sku: 'SKU6',
        tags: ['tag2', 'tag8'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 7',
        price: 90,
        description: 'Description 7',
        image: 'image7.jpg',
        category: 'Category 4',
        stock: 50,
        sku: 'SKU7',
        tags: ['tag9'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 8',
        price: 180,
        description: 'Description 8',
        image: 'image8.jpg',
        category: 'Category 5',
        stock: 25,
        sku: 'SKU8',
        tags: ['tag10', 'tag11'],
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 9',
        price: 160,
        description: 'Description 9',
        image: 'image9.jpg',
        category: 'Category 3',
        stock: 8,
        sku: 'SKU9',
        tags: ['tag4', 'tag12'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 10',
        price: 220,
        description: 'Description 10',
        image: 'image10.jpg',
        category: 'Category 2',
        stock: 18,
        sku: 'SKU10',
        tags: ['tag5', 'tag13'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 11',
        price: 140,
        description: 'Description 11',
        image: 'image11.jpg',
        category: 'Category 4',
        stock: 35,
        sku: 'SKU11',
        tags: ['tag6', 'tag14'],
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 12',
        price: 110,
        description: 'Description 12',
        image: 'image12.jpg',
        category: 'Category 1',
        stock: 40,
        sku: 'SKU12',
        tags: ['tag7', 'tag15'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 13',
        price: 300,
        description: 'Description 13',
        image: 'image13.jpg',
        category: 'Category 5',
        stock: 7,
        sku: 'SKU13',
        tags: ['tag8', 'tag16'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 14',
        price: 80,
        description: 'Description 14',
        image: 'image14.jpg',
        category: 'Category 3',
        stock: 22,
        sku: 'SKU14',
        tags: ['tag9', 'tag17'],
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 15',
        price: 130,
        description: 'Description 15',
        image: 'image15.jpg',
        category: 'Category 2',
        stock: 12,
        sku: 'SKU15',
        tags: ['tag10', 'tag18'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return NextResponse.json({ success: true, data: { products } }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admins' }, { status: 500 });
  }
}

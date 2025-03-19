import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Here you would typically fetch data from your database
    // This is where you'll integrate with your backend service
    // For now, we'll return a mock response
    const recommendations = {
      "Living Room": [
        {
          id: 1,
          title: "Modern Sectional Sofa",
          category: "Living Room",
          price: "899$",
          rating: 5,
          description:
            "Contemporary L-shaped sectional with premium upholstery",
          image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
        },
        // Add more items...
      ],
      Kitchen: [
        {
          id: 5,
          title: "Premium Kitchen Set",
          category: "Kitchen",
          price: "1299$",
          rating: 5,
          description: "Complete modern kitchen set with smart appliances",
          image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
        },
        // Add more items...
      ],
      // Add more categories...
    };

    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

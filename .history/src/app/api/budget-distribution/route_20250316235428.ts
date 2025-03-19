import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Here you would typically fetch data from your database
    // This is where you'll integrate with your backend service
    // For now, we'll return a mock response
    const budgetData = [
      { name: "Living Room", value: 35 },
      { name: "Kitchen", value: 25 },
      { name: "Bedrooms", value: 20 },
      { name: "Bathrooms", value: 15 },
      { name: "Other Rooms", value: 5 },
    ];

    return NextResponse.json(budgetData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budget distribution" },
      { status: 500 }
    );
  }
}

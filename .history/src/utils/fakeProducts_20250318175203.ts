import { Product, Category } from "@/types/product";

export function generateSampleProducts(): Product[] {
  const categories: Category[] = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Other Rooms",
  ];
  const products: Product[] = [];

  for (let i = 0; i < 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 1000) + 100;
    const rating = Math.random() * 2 + 3; // Random rating between 3-5
    const lat = 37.7749 + (Math.random() - 0.5) * 0.1; // Random latitude near San Francisco
    const lon = -122.4194 + (Math.random() - 0.5) * 0.1; // Random longitude near San Francisco

    products.push({
      id: `product-${i + 1}`,
      title: `${category} Item ${i + 1}`,
      category,
      image: {
        url: `https://picsum.photos/400/300?random=${i}`,
        alt: `${category} Item ${i + 1}`,
        thumbnailUrl: `https://picsum.photos/100/100?random=${i}`,
      },
      price,
      store: {
        id: `store-${i + 1}`,
        name: `Store ${i + 1}`,
        location: {
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: "San Francisco",
          country: "USA",
        },
        contact: {
          phone: `(555) ${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          email: `store${i + 1}@example.com`,
        },
        operatingHours: {
          days: "Mon-Sun",
          hours: "9:00 AM - 6:00 PM",
        },
      },
      rating,
      location: "San Francisco",
      coordinates: [lat, lon],
    });
  }

  return products;
}

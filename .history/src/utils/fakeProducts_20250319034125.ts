import { Product, Category } from "@/types/product";

export const fakeProductsData: Product[] = [
  {
    id: "1",
    title: "Modern Sofa Set",
    category: "Living Room",
    image: {
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      alt: "Modern Sofa Set",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150",
    },
    price: 1299.99,
    store: {
      id: "store1",
      name: "Home Furnishings Plus",
      location: {
        address: "123 Main Street",
        city: "San Francisco",
        country: "USA",
      },
      contact: {
        phone: "(555) 123-4567",
        email: "info@homefurnishings.com",
      },
      operatingHours: {
        days: "Mon-Sat",
        hours: "9:00 AM - 6:00 PM",
      },
    },
    rating: 4.5,
    location: "San Francisco",
    coordinates: [37.7749, -122.4194],
  },
  {
    id: "2",
    title: "Smart Refrigerator",
    category: "Kitchen",
    image: {
      url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5",
      alt: "Smart Refrigerator",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=150",
    },
    price: 2499.99,
    store: {
      id: "store2",
      name: "Tech Appliances",
      location: {
        address: "456 Market Street",
        city: "San Francisco",
        country: "USA",
      },
      contact: {
        phone: "(555) 234-5678",
        email: "sales@techappliances.com",
      },
      operatingHours: {
        days: "Mon-Sun",
        hours: "10:00 AM - 8:00 PM",
      },
    },
    rating: 4.8,
    location: "San Francisco",
    coordinates: [37.7833, -122.4167],
  },
  {
    id: "3",
    title: "Queen Size Bed",
    category: "Bedroom",
    image: {
      url: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
      alt: "Queen Size Bed",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=150",
    },
    price: 899.99,
    store: {
      id: "store3",
      name: "Sleep Haven",
      location: {
        address: "789 Mission Street",
        city: "San Francisco",
        country: "USA",
      },
      contact: {
        phone: "(555) 345-6789",
        email: "info@sleephaven.com",
      },
      operatingHours: {
        days: "Mon-Sat",
        hours: "10:00 AM - 7:00 PM",
      },
    },
    rating: 4.3,
    location: "San Francisco",
    coordinates: [37.7833, -122.4083],
  },
  {
    id: "4",
    title: "Smart Toilet",
    category: "Bathroom",
    image: {
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      alt: "Smart Toilet",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150",
    },
    price: 799.99,
    store: {
      id: "store4",
      name: "Bath & Beyond",
      location: {
        address: "321 Howard Street",
        city: "San Francisco",
        country: "USA",
      },
      contact: {
        phone: "(555) 456-7890",
        email: "sales@bathandbeyond.com",
      },
      operatingHours: {
        days: "Mon-Sun",
        hours: "9:00 AM - 9:00 PM",
      },
    },
    rating: 4.6,
    location: "San Francisco",
    coordinates: [37.7917, -122.4083],
  },
  {
    id: "5",
    title: "Smart TV",
    category: "Other Rooms",
    image: {
      url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
      alt: "Smart TV",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150",
    },
    price: 1499.99,
    store: {
      id: "store5",
      name: "Electronics Hub",
      location: {
        address: "654 Folsom Street",
        city: "San Francisco",
        country: "USA",
      },
      contact: {
        phone: "(555) 567-8901",
        email: "info@electronicshub.com",
      },
      operatingHours: {
        days: "Mon-Sat",
        hours: "10:00 AM - 8:00 PM",
      },
    },
    rating: 4.7,
    location: "San Francisco",
    coordinates: [37.7833, -122.4],
  },
];

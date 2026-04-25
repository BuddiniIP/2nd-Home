// Sample Data for the application

export const users = [
  {
    id: "u1",
    username: "student1",
    password: "password123",
    role: "student",
    name: "John Doe",
    email: "john@student.edu",
    phone: "555-0101",
    university: "State University",
    savedProperties: ["p1", "p3"],
    applications: [
      { id: "a1", propertyId: "p2", status: "pending", dateApplied: "2024-03-15" }
    ]
  },
  {
    id: "u2",
    username: "owner1",
    password: "password123",
    role: "owner",
    name: "Jane Smith",
    email: "jane.smith@properties.com",
    phone: "555-0202",
    propertiesOwned: ["p1", "p2", "p3"]
  },
  {
    id: "u3",
    username: "admin",
    password: "password123",
    role: "admin",
    name: "System Admin",
    email: "admin@unistay.lk",
    phone: "555-0000"
  },
  {
    id: "u4",
    username: "verifier",
    password: "password123",
    role: "verifier",
    name: "Ruwan Jayasena",
    email: "ruwan@unistay.lk",
    phone: "555-4444"
  }
];

export const properties = [
  // University of Colombo
  {
    id: "p1",
    title: "Green View Hostel",
    type: "Boarding House",
    location: "Colombo 03",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "Laundry", "Kitchen"],
    description: "A perfect quiet room for a focused student. Just a 10-minute walk from the University of Colombo main campus.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u2",
    rating: 4.8,
    reviews: 12,
    available: true
  },
  {
    id: "p2",
    title: "Premium Student Residence",
    type: "Apartment",
    location: "Colombo 07",
    price: 22000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "AC", "Gym", "Laundry", "Kitchen"],
    description: "Premium student living with all utilities included near University of Colombo. Top floor gym available.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u3",
    rating: 4.9,
    reviews: 24,
    available: true
  },
  {
    id: "p3",
    title: "Colombo City Annex",
    type: "Annex",
    location: "Colombo 04",
    price: 14000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Kitchen", "Furnished"],
    description: "Affordable shared annex for University of Colombo students. Very convenient location near bus routes.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u2",
    rating: 4.3,
    reviews: 8,
    available: true
  },

  // University of Peradeniya
  {
    id: "p4",
    title: "Student Comfort Home",
    type: "Boarding House",
    location: "Kandy (Peradeniya)",
    price: 12000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Parking", "Study Area"],
    description: "Peaceful environment surrounded by nature. Very close to the University of Peradeniya gates.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u4",
    rating: 4.2,
    reviews: 15,
    available: true
  },
  {
    id: "p5",
    title: "Hillside Student Dorm",
    type: "Hostel",
    location: "Peradeniya",
    price: 9000,
    bedrooms: 4,
    bathrooms: 2,
    amenities: ["Furnished", "Study Area", "Meals Available"],
    description: "Budget-friendly dorm setup for University of Peradeniya students. Beautiful view of the mountains.",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u2",
    rating: 4.0,
    reviews: 32,
    available: true
  },

  // University of Moratuwa
  {
    id: "p6",
    title: "University Heights",
    type: "Boarding House",
    location: "Moratuwa",
    price: 15000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Gym", "Common Area", "Security"],
    description: "Modern facility tailored for Engineering and IT students at the University of Moratuwa. Fast internet.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u3",
    rating: 4.5,
    reviews: 18,
    available: true
  },
  {
    id: "p7",
    title: "Katubedda Single Rooms",
    type: "Room",
    location: "Katubedda (Moratuwa)",
    price: 11000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Furnished", "Laundry"],
    description: "Quiet single rooms right next to the University of Moratuwa. Perfect for final year students.",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u4",
    rating: 4.6,
    reviews: 21,
    available: true
  },

  // University of Kelaniya
  {
    id: "p8",
    title: "Budget Stay Hostel",
    type: "Hostel",
    location: "Kelaniya",
    price: 10000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Common Area"],
    description: "Safe and secure hostel for University of Kelaniya students. Shared kitchen available.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u2",
    rating: 3.9,
    reviews: 14,
    available: true
  },
  {
    id: "p9",
    title: "Kelaniya Student Annex",
    type: "Annex",
    location: "Dalugama (Kelaniya)",
    price: 13000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Private Entrance", "Kitchen"],
    description: "Fully private annex ideal for a couple of friends attending University of Kelaniya.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5250ff5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u3",
    rating: 4.4,
    reviews: 9,
    available: true
  },

  // University of Sri Jayewardenepura
  {
    id: "p10",
    title: "Garden View Boarding",
    type: "Boarding House",
    location: "Nugegoda (SJP)",
    price: 16000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Garden", "Kitchen", "Security"],
    description: "A beautiful boarding house with a garden, close to the University of Sri Jayewardenepura.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u4",
    rating: 4.7,
    reviews: 27,
    available: true
  },
  {
    id: "p11",
    title: "Japura Student Rooms",
    type: "Room",
    location: "Maharagama",
    price: 10500,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Laundry", "Study Area"],
    description: "Conveniently located for University of Sri Jayewardenepura students. Close to High Level road.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    ownerId: "u2",
    rating: 4.1,
    reviews: 19,
    available: true
  }
];

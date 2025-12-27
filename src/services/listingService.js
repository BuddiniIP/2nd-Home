// src/services/listingService.js

/* =========================
   MOCK LISTINGS DATA
========================= */

const listings = [
  {
    id: "1",
    title: "Green View Hostel",
    location: "Near University of Sri Jayewardenepura",
    price: 18000,
    rating: 4.5,
    gender: "mixed",
    images: [
      "/src/assets/images/boarding1.jpg",
      "/src/assets/images/boarding2.jpg",
      "/src/assets/images/boarding3.jpg",
    ],
    description:
      "Comfortable and secure boarding facility with all essential amenities for university students.",
    amenities: [
      "Free Wi-Fi",
      "Attached Bathroom",
      "Laundry",
      "Parking",
      "24/7 Security",
      "Study Area",
    ],
    rules: [
      "No smoking inside rooms",
      "Visitors allowed until 9 PM",
      "Maintain cleanliness",
    ],
    owner: {
      id: "101",
      name: "Mr. Kapila Silva",
      avatar: "/src/assets/images/uniforma.jpg",
    },
    status: "approved",
  },
  {
    id: "2",
    title: "Sunrise Boarding",
    location: "Homagama",
    price: 12000,
    rating: 4.2,
    gender: "boys",
    images: [
      "/src/assets/images/bluedoor.jpg",
      "/src/assets/images/boarding2.jpg",
    ],
    description:
      "Affordable boarding house with calm environment and easy transport access.",
    amenities: ["Wi-Fi", "Meals", "Parking"],
    rules: ["No loud music after 10 PM"],
    owner: {
      id: "102",
      name: "Mrs. Nirmala Fernando",
      avatar: "/src/assets/images/owner2.jpg",
    },
    status: "approved",
  },
  {
    id: "3",
    title: "City Stay",
    location: "Nugegoda",
    price: 15000,
    rating: 4.7,
    gender: "girls",
    images: [
      "/src/assets/images/girlNearWindow.jpg",
      "/src/assets/images/boarding1.jpg",
    ],
    description:
      "Modern city boarding with clean rooms and CCTV security.",
    amenities: ["Wi-Fi", "CCTV", "Laundry"],
    rules: ["Girls only", "Visitors restricted"],
    owner: {
      id: "103",
      name: "Ms. Dilani Perera",
      avatar: "/src/assets/images/owner.jpg",
    },
    status: "approved",
  },
];

/* =========================
   SERVICE FUNCTIONS
========================= */

export const getAllListings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(listings.filter((l) => l.status === "approved"));
    }, 400);
  });
};

export const getListingById = (id) => {
  return listings.find((l) => l.id === id);
};

export const getListingsByOwner = (ownerId) => {
  return listings.filter((l) => l.owner.id === ownerId);
};

export const getPendingListings = () => {
  return listings.filter((l) => l.status === "pending");
};

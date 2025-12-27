import { useState } from "react";
import BoardingCard from "../../components/BoardingCard";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("saved");

  // TEMP DATA (replace with backend later)
  const savedListings = [
    {
      id: 1,
      title: "Comfort Boys Boarding",
      location: "Nugegoda",
      price: 12000,
      image: "/src/assets/images/boarding1.jpg",
    },
    {
      id: 2,
      title: "Girls Hostel Near Campus",
      location: "Maharagama",
      price: 15000,
      image: "/src/assets/images/boarding2.jpg",
    },
  ];

  const requestedListings = [
  {
    id: 1,
    title: "Boys Boarding – Nugegoda",
    status: "Approved",
    image: "/src/assets/images/boarding1.jpg",
  },
];

  return (
    <>

      <div className="bg-gray-100 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Student Dashboard
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-2 rounded font-semibold ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Saved Listings
            </button>

            <button
              onClick={() => setActiveTab("requested")}
              className={`px-6 py-2 rounded font-semibold ${
                activeTab === "requested"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              Requested Listings
            </button>
          </div>

          {/* Content */}
          {activeTab === "saved" && (
            <>
              {savedListings.length === 0 ? (
                <p className="text-gray-500">No saved listings yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savedListings.map((item) => (
                    <BoardingCard key={item.id} listing={item} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "requested" && (
            <>
              {requestedListings.length === 0 ? (
                <p className="text-gray-500">No requested listings.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {requestedListings.map((item) => (
                    <div key={item.id} className="relative">
                      <BoardingCard listing={item} />

                      {/* Status Badge */}
                      <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}



export default function AdminDashboard() {
  // TEMP DATA – replace with API later
  const pendingListings = [
    {
      id: 1,
      title: "Boys Boarding Near Campus",
      owner: "Kamal Perera",
      location: "Nugegoda",
      price: 12000,
      status: "Pending",
    },
    {
      id: 2,
      title: "Girls Hostel – Fully Furnished",
      owner: "Nimali Silva",
      location: "Maharagama",
      price: 15000,
      status: "Pending",
    },
  ];

  const handleApprove = (id) => {
    alert(`Listing ${id} approved`);
    // API call will be added later
  };

  const handleReject = (id) => {
    alert(`Listing ${id} rejected`);
    // API call will be added later
  };

  return (
    <>

      <div className="bg-gray-100 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mb-8">
            Review and approve boarding listings submitted by owners.
          </p>

          {/* Listings */}
          <div className="space-y-4">
            {pendingListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Owner: {listing.owner}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {listing.location}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Rs. {listing.price}
                  </p>
                </div>

                {/* Status */}
                <span className="inline-block bg-yellow-100 text-yellow-700 text-sm px-4 py-1 rounded-full">
                  {listing.status}
                </span>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(listing.id)}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(listing.id)}
                    className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {pendingListings.length === 0 && (
            <p className="text-gray-500 text-center mt-12">
              No pending listings at the moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

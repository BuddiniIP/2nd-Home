
import { updateBookingStatus } from "../../services/bookingService";


export default function OwnerDashboard() {
  // TEMP DATA (replace with backend later)
  const stats = [
    { label: "Total Listings", value: 4 },
    { label: "Total Requests", value: 7 },
    { label: "Approved Bookings", value: 3 },
  ];

  const bookingRequests = [
    {
      id: 1,
      studentName: "Saman Perera",
      listingTitle: "Boys Boarding – Nugegoda",
      contact: "0771234567",
      status: "Pending",
    },
    {
      id: 2,
      studentName: "Nimali Silva",
      listingTitle: "Girls Hostel – Maharagama",
      contact: "0719876543",
      status: "Pending",
    },
  ];

 const handleApprove = async (id) => {
  await updateBookingStatus(id, "Approved");
  alert("Booking approved!");
};

  const handleReject = async (id) => {
  await updateBookingStatus(id, "Rejected");
  alert("Booking rejected!");
};

  return (
    <>

      <div className="bg-gray-100 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Owner Dashboard
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow"
              >
                <p className="text-gray-500 text-sm">{item.label}</p>
                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Booking Requests
            </h2>

            {bookingRequests.length === 0 ? (
              <p className="text-gray-500">
                No booking requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {bookingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    {/* Info */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {req.studentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Listing: {req.listingTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        Contact: {req.contact}
                      </p>
                    </div>

                    {/* Status */}
                    <span className="bg-yellow-100 text-yellow-700 text-sm px-4 py-1 rounded-full">
                      {req.status}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

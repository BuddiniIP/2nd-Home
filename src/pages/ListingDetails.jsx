import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../services/listingService";
import { requestBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

export default function ListingDetails() {
  const { id } = useParams();
  const listing = getListingById(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Listing not found</p>
      </div>
    );
  }

  const handleRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      alert('Only students can request boarding.');
      return;
    }

    await requestBooking({
      listingId: id,
      studentId: '201',
      studentName: 'Demo Student',
      ownerId: listing.owner.id,
    });
    alert("Booking request sent to owner!");
  };

  return (
    <>

      <div className="bg-gray-100 min-h-screen pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <img
              src={listing.images[0]}
              alt="main"
              className="md:col-span-2 h-[350px] w-full object-cover rounded-lg"
            />
            <div className="grid grid-rows-2 gap-4">
              {listing.images.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="sub"
                  className="h-[165px] w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {listing.title}
              </h1>
              <p className="text-gray-500 mt-1">{listing.location}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{listing.rating}</span>
              </div>

              <hr className="my-6" />

              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{listing.description}</p>

              <hr className="my-6" />

              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.amenities.map((item, index) => (
                  <div key={index}>✅ {item}</div>
                ))}
              </div>

              <hr className="my-6" />

              <h2 className="text-lg font-semibold mb-4">House Rules</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {listing.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <p className="text-2xl font-bold text-blue-600">
                LKR {listing.price}
                <span className="text-sm text-gray-500"> / month</span>
              </p>

              <div className="flex items-center gap-4 mt-6">
                <img
                  src={listing.owner.avatar}
                  alt="owner"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <p className="font-semibold">{listing.owner.name}</p>
                  <p className="text-sm text-gray-500">Boarding Owner</p>
                </div>
              </div>

              <button
                onClick={handleRequest}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
              >
                Request Boarding
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

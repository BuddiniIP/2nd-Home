import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    gender: "",
    description: "",
    facilities: [],
    rules: [],
  });

  const facilitiesList = [
    "WiFi",
    "Parking",
    "Laundry",
    "CCTV",
    "Water",
    "Electricity",
  ];

  const rulesList = [
    "No Smoking",
    "No Alcohol",
    "No Pets",
    "Visitors Allowed",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckbox = (type, value) => {
    setFormData((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];

      return { ...prev, [type]: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Listing Submitted:", formData);
    alert("Listing submitted for approval!");
    navigate("/owner");
  };

  return (
    <>

      <div className="bg-gray-100 min-h-screen pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-8">

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Boarding Listing
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label className="block font-medium mb-1">
                  Boarding Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block font-medium mb-1">
                  Monthly Price (LKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-medium mb-1">
                  Suitable For
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              {/* Facilities */}
              <div>
                <label className="block font-medium mb-2">
                  Facilities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilitiesList.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckbox("facilities", item)
                        }
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="block font-medium mb-2">
                  House Rules
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rulesList.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckbox("rules", item)
                        }
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700"
                >
                  Submit Listing
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/owner")}
                  className="border px-6 py-3 rounded font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import BoardingCard from "../components/BoardingCard";
import Loader from "../components/Loader";
import FilterBar from "../components/FilterBar";
import { getAllListings } from "../services/listingService";


export default function Listing() {
const [listings, setListings] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({ location: "", type: "", price: "" });

const handleFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

const filteredListings = listings.filter((item) => {
  if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
  if (filters.type && filters.type !== "" && item.gender !== filters.type) return false;
  if (filters.price) {
    if (filters.price === "low" && item.price >= 10000) return false;
    if (filters.price === "mid" && (item.price < 10000 || item.price > 15000)) return false;
    if (filters.price === "high" && item.price <= 15000) return false;
  }
  return true;
});


useEffect(() => {
const fetchListings = async () => {
const data = await getAllListings();
setListings(data);
setLoading(false);
};
fetchListings();
}, []);


if (loading) return <Loader />;


return (
<div className="max-w-7xl mx-auto px-4 py-8">
{/* Header */}
<h1 className="text-2xl font-bold text-gray-800 mb-6">
Available Boardings
</h1>


{/* Filters */}
<FilterBar onFilter={handleFilter} />


{/* Listings Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredListings.map((item) => (
<BoardingCard key={item.id} listing={item} />
))}
</div>
</div>
);
}
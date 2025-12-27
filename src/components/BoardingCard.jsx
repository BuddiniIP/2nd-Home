import { useNavigate } from "react-router-dom";


export default function BoardingCard({ listing }) {
const navigate = useNavigate();


return (
<div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
{/* Image */}
<img
src={listing.images?.[0] || listing.image || "/src/assets/images/boarding1.jpg"}
alt={listing.title}
className="h-48 w-full object-cover"
/>


{/* Content */}
<div className="p-4">
<h3 className="text-lg font-semibold text-gray-800">
{listing.title}
</h3>


<p className="text-sm text-gray-500 mt-1">
{listing.location}
</p>


<div className="flex justify-between items-center mt-4">
<span className="text-blue-600 font-bold">
LKR {listing.price}/month
</span>


<button
onClick={() => navigate(`/listing/${listing.id}`)}
className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
View
</button>
</div>
</div>
</div>
);
}
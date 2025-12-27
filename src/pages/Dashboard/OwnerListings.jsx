export default function OwnerListings() {
  const listings = [
    {
      id: 1,
      title: "Girls Boarding – Maharagama",
      price: 14000,
      status: "Active",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Listings</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Title</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.title}</td>
              <td className="text-center">
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {item.status}
                </span>
              </td>
              <td className="text-center">Rs. {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StudentProfile() {
  const student = {
    name: "Nimal Fernando",
    university: "University of Sri Jayewardenepura",
    email: "nimal@gmail.com",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>University:</strong> {student.university}</p>
        <p><strong>Email:</strong> {student.email}</p>
      </div>

      <button className="mt-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Edit Profile
      </button>
    </div>
  );
}

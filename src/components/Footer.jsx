export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-white font-bold mb-2">BoardingFinder</h3>
          <p>Connecting students with verified boarding facilities.</p>
        </div>
        <div>
          <h4 className="text-white mb-2">Students</h4>
          <p>Search Boarding</p>
        </div>
        <div>
          <h4 className="text-white mb-2">Owners</h4>
          <p>List Property</p>
        </div>
        <div>
          <h4 className="text-white mb-2">Support</h4>
          <p>Contact | FAQ</p>
        </div>
      </div>

      <p className="text-center mt-8 text-sm text-gray-400">
        © 2025 BoardingFinder
      </p>
    </footer>
  );
}

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

import colombo from "../assets/images/university-of-colombo.jpg";
import pera from "../assets/images/uniofpera.jpg";
import mora from "../assets/images/uniofmora.jpg";
import kelaniya from "../assets/images/uniofkelaniya.jpg";
import sjp from "../assets/images/uniofjapura.jpg";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Find Your Perfect Boarding Near University
        </h1>
        <p className="max-w-2xl mx-auto text-gray-200">
          Discover verified, safe and affordable boarding facilities near your university.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button className="bg-blue-600 px-6 py-3 rounded text-white hover:bg-blue-700">
            Search Boardings
          </button>
          <button className="bg-orange-500 px-6 py-3 rounded text-white hover:bg-orange-600">
            List Your Property
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Why Choose BoardingFinder?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Feature title="Verified Boarding" />
            <Feature title="Near Universities" />
            <Feature title="Student Focused" />
          </div>
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section id="universities" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Popular Universities
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <UniversityCard img={colombo} name="University of Colombo" />
            <UniversityCard img={pera} name="University of Peradeniya" />
            <UniversityCard img={mora} name="University of Moratuwa" />
            <UniversityCard img={kelaniya} name="University of Kelaniya" />
            <UniversityCard img={sjp} name="University of Sri Jayewardenepura" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Boarding?
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-white text-blue-600 px-6 py-3 rounded">
            Register as Student
          </button>
          <button className="bg-white text-orange-500 px-6 py-3 rounded">
            Register as Owner
          </button>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}

function Feature({ title }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">
        Designed for university students with safety and comfort in mind.
      </p>
    </div>
  );
}

function UniversityCard({ img, name }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <button className="mt-3 text-blue-600 font-medium">
          View Boarding Options →
        </button>
      </div>
    </div>
  );
}

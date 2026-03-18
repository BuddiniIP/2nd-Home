import { Link } from "react-router-dom";
import colomboImg from "../assets/images/university-of-colombo.jpg";
import peraImg from "../assets/images/uniofpera.jpg";
import moraImg from "../assets/images/uniofmora.jpg";
import kelaniyaImg from "../assets/images/uniofkelaniya.jpg";
import sjpImg from "../assets/images/uniofjapura.jpg";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[linear-gradient(rgba(44,62,80,0.8),rgba(44,62,80,0.8)),url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center text-white text-center pt-[180px] pb-[100px] sm:pt-[150px] sm:pb-[80px]">
        <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
          <h1 className="text-[3rem] sm:text-[2rem] md:text-[2.5rem] font-bold mb-[20px] leading-tight">
            Find Your Perfect Boarding Near University
          </h1>
          <p className="text-[1.2rem] max-w-[700px] mx-auto mb-[30px] opacity-90">
            Discover verified Boarding facilities around your university. Safe, comfortable, and affordable accommodation for students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-[20px] mt-[30px]">
            <Link to="/search" className="inline-block px-6 py-3 rounded bg-primary text-white font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300 w-[200px] sm:w-auto">
              Search Boardings
            </Link>
            <Link to="/owner-registration" className="inline-block px-6 py-3 rounded bg-secondary text-white font-semibold hover:bg-[#ff6b4a] hover:-translate-y-[2px] transition-all duration-300 w-[200px] sm:w-auto">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-light py-[80px]">
        <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
          <div className="text-center mb-[50px]">
            <h2 className="text-[2.5rem] sm:text-[2rem] text-dark font-bold mb-[15px]">Why Choose 2nd Home?</h2>
            <p className="text-gray text-[1.1rem] max-w-[700px] mx-auto">
              Safe, verified, and convenient boarding solutions for university students
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {/* Feature 1 */}
            <div className="bg-white rounded-[8px] p-[30px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[10px] transition-transform duration-300">
              <div className="text-[3rem] text-primary mb-[20px]">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="text-[1.5rem] mb-[15px] text-dark font-semibold">Verified Boarding</h3>
              <p className="text-gray">All boarding facilities are physically verified by our professional checkers</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-[8px] p-[30px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[10px] transition-transform duration-300">
              <div className="text-[3rem] text-primary mb-[20px]">
                <i className="fas fa-university"></i>
              </div>
              <h3 className="text-[1.5rem] mb-[15px] text-dark font-semibold">Near Universities</h3>
              <p className="text-gray">Find boarding facilities close to your university and faculty</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-[8px] p-[30px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[10px] transition-transform duration-300">
              <div className="text-[3rem] text-primary mb-[20px]">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3 className="text-[1.5rem] mb-[15px] text-dark font-semibold">Student Focused</h3>
              <p className="text-gray">Designed specifically for university students' needs and budget</p>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-[80px]">
        <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
          <div className="text-center mb-[50px]">
            <h2 className="text-[2.5rem] sm:text-[2rem] text-dark font-bold mb-[15px]">Popular Universities</h2>
            <p className="text-gray text-[1.1rem] max-w-[700px] mx-auto">
              Find boarding near these top universities
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {[
              { name: "University of Colombo", image: colomboImg },
              { name: "University of Peradeniya", image: peraImg },
              { name: "University of Moratuwa", image: moraImg },
              { name: "University of Kelaniya", image: kelaniyaImg },
              { name: "University of Sri Jayewardenepura", image: sjpImg },
            ].map((uni, idx) => (
              <div key={idx} className="bg-white rounded-[8px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[5px] transition-transform duration-300 flex flex-col">
                <div className="h-[180px] bg-cover bg-center" style={{ backgroundImage: `url('${uni.image}')` }}></div>
                <div className="p-[20px] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[1.3rem] mb-[10px] text-dark font-semibold">{uni.name}</h3>
                    <p className="text-gray mb-[15px]">Find verified boarding facilities near this university</p>
                  </div>
                  <Link to={`/search?university=${uni.name.replace(/\s+/g, '-')}`} className="inline-block px-4 py-2 rounded text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold bg-transparent text-center">
                    View Boarding Options &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white text-center py-[100px]">
        <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
          <h2 className="text-[2.5rem] sm:text-[2rem] font-bold mb-[20px]">Ready to Find Your Boarding?</h2>
          <p className="text-[1.2rem] max-w-[700px] mx-auto mb-[40px] opacity-90">
            Join thousands of students who found their perfect accommodation
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-[20px]">
            <Link to="/student-registration" className="inline-block px-6 py-3 rounded bg-primary text-white font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300 w-[200px] sm:w-auto">
              Register as Student
            </Link>
            <Link to="/owner-registration" className="inline-block px-6 py-3 rounded bg-secondary text-white font-semibold hover:bg-[#ff6b4a] hover:-translate-y-[2px] transition-all duration-300 w-[200px] sm:w-auto">
              Register as Owner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

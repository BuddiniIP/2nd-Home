import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans">
      {/* Page Header */}
      <div className="bg-[linear-gradient(rgba(44,62,80,0.8),rgba(44,62,80,0.8)),url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center text-white py-[80px] md:py-[100px] text-center">
        <div className="container mx-auto px-[20px]">
          <h1 className="text-[2.5rem] md:text-[3.2rem] font-bold font-poppins mb-[15px]">About 2nd Home</h1>
          <p className="text-[1.1rem] md:text-[1.3rem] opacity-90 max-w-[800px] mx-auto">Connecting university students with safe, verified, and comfortable boarding facilities since 2005.</p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-[60px] md:py-[80px]">
        <div className="container mx-auto px-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[60px] items-center">
            <div className="rounded-[10px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] h-[300px] md:h-[450px]">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students studying together" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#1a5fb4] font-poppins mb-[20px]">Our Story</h2>
              <p className="text-[#666] text-[1.1rem] mb-[15px] leading-relaxed">
                2nd Home began in 2005 with a simple mission: to make the process of finding student accommodation as seamless and secure as possible. As former university students ourselves, we understood the anxiety and challenges of moving to a new city and finding a safe place to live.
              </p>
              <p className="text-[#666] text-[1.1rem] mb-[15px] leading-relaxed">
                Before our platform, students relied on word-of-mouth or unverified classified ads, often leading to substandard living conditions or scams. We set out to change this by creating a centralized, verified platform where students can browse properties with confidence.
              </p>
              <p className="text-[#666] text-[1.1rem] leading-relaxed">
                Today, we operate across all major university cities in Sri Lanka, having helped over 50,000 students find their perfect "second home." We pride ourselves on our rigorous verification process and our commitment to student welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a5fb4] text-white py-[60px]">
        <div className="container mx-auto px-[20px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[30px] text-center">
            <div>
              <div className="text-[2.5rem] md:text-[3rem] font-bold text-[#ff9800] mb-[10px]">18+</div>
              <p className="text-[1.1rem] opacity-90">Years of Experience</p>
            </div>
            <div>
              <div className="text-[2.5rem] md:text-[3rem] font-bold text-[#ff9800] mb-[10px]">50K+</div>
              <p className="text-[1.1rem] opacity-90">Students Helped</p>
            </div>
            <div>
              <div className="text-[2.5rem] md:text-[3rem] font-bold text-[#ff9800] mb-[10px]">5,000+</div>
              <p className="text-[1.1rem] opacity-90">Verified Properties</p>
            </div>
            <div>
              <div className="text-[2.5rem] md:text-[3rem] font-bold text-[#ff9800] mb-[10px]">100%</div>
              <p className="text-[1.1rem] opacity-90">Verified Listings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-[60px] md:py-[80px] bg-[#f0f7ff]">
        <div className="container mx-auto px-[20px]">
          <div className="text-center mb-[50px]">
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#1a5fb4] font-poppins mb-[15px]">Our Core Values</h2>
            <p className="text-[#666] max-w-[700px] mx-auto text-[1.1rem]">The principles that guide everything we do at 2nd Home</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
            <div className="bg-white p-[40px] rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px]">
              <div className="w-[80px] h-[80px] mx-auto bg-[#e8f2ff] rounded-full flex items-center justify-center text-[#1a5fb4] text-[2.5rem] mb-[20px]">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="text-[1.5rem] font-semibold text-[#333] mb-[15px]">Safety First</h3>
              <p className="text-[#666]">We meticulously verify every property and owner on our platform. Your safety and security are our absolute highest priorities.</p>
            </div>
            
            <div className="bg-white p-[40px] rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px]">
              <div className="w-[80px] h-[80px] mx-auto bg-[#fff0d4] rounded-full flex items-center justify-center text-[#ff9800] text-[2.5rem] mb-[20px]">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="text-[1.5rem] font-semibold text-[#333] mb-[15px]">Transparency</h3>
              <p className="text-[#666]">We believe in clear, honest communication. What you see is what you get—no hidden fees, no deceptive photos, just the truth.</p>
            </div>
            
            <div className="bg-white p-[40px] rounded-[10px] shadow-[0_5px_20px_rgba(0,0,0,0.05)] text-center transition-transform hover:-translate-y-[10px]">
              <div className="w-[80px] h-[80px] mx-auto bg-[#e8f2ff] rounded-full flex items-center justify-center text-[#1a5fb4] text-[2.5rem] mb-[20px]">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="text-[1.5rem] font-semibold text-[#333] mb-[15px]">Student Well-being</h3>
              <p className="text-[#666]">A good living environment is crucial for academic success. We curate spaces that foster learning, comfort, and community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[80px] text-center">
        <div className="container mx-auto px-[20px]">
          <div className="bg-[linear-gradient(135deg,#1a5fb4_0%,#2d87e0_100%)] text-white rounded-[15px] p-[40px_20px] md:p-[60px_40px] max-w-[900px] mx-auto shadow-[0_15px_40px_rgba(26,95,180,0.2)]">
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold font-poppins mb-[20px]">Join Our Community</h2>
            <p className="text-[1.1rem] md:text-[1.2rem] opacity-90 mb-[40px] max-w-[700px] mx-auto">Experience the easiest, safest way to find student accommodation. Start your search today.</p>
            <div className="flex flex-col md:flex-row justify-center gap-[20px]">
              <Link to="/search" className="bg-[#ff9800] text-white px-[24px] py-[12px] rounded-[6px] font-semibold hover:bg-[#e68900] transition-colors w-full md:w-auto">Start Searching</Link>
              <Link to="/contact-us" className="bg-white text-[#1a5fb4] px-[24px] py-[12px] rounded-[6px] font-semibold hover:bg-gray-100 transition-colors w-full md:w-auto">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

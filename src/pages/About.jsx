import akashPhoto from '../assets/founder.jpg';
import shivamphoto from '../assets/shivam.jpeg';
import Ananyaphoto from '../assets/ananya.jpg';
import priyaphoto from '../assets/priya.jpg';
import Rahulphoto from '../assets/rahul.jpg';
import harshitPhoto from '../assets/Harshit.jpeg';


function About() {
  const teamMembers = [
  {
    id: 1,
    name: 'Akash Pandey',
    role: 'Founder & CEO',
    image: akashPhoto,
  },
  {
  id: 6,
  name: 'Harshit Pandey',
  role: 'Co-Founder',
  image: harshitPhoto,
},
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Head of Supply Chain',
    image: priyaphoto,
  },
  {
    id: 3,
    name: 'Rahul Verma',
    role: 'Community Manager',
    image: Rahulphoto,
  },
  {
  id: 5,
  name: 'Shivam Maurya',
  role: 'Investor',
  image: shivamphoto,
},
  {
    id: 4,
    name: 'Ananya Gupta',
    role: 'Quality Assurance',
    image: Ananyaphoto,
  },
];

  const values = [
    {
      title: 'Sustainability',
      description: 'We partner with eco-friendly farms and use minimal packaging to protect our planet.',
      icon: '🌱',
    },
    {
      title: 'Quality',
      description: 'Every product is carefully selected and tested to ensure superior freshness and nutrition.',
      icon: '✅',
    },
    {
      title: 'Transparency',
      description: 'We believe in honest sourcing and clear communication with our customers.',
      icon: '👁️',
    },
    {
      title: 'Community',
      description: 'We support local farmers and give back to communities that grow our produce.',
      icon: '🤝',
    },
  ];

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand to-brand-dark py-16 shadow-lg sm:py-20 lg:py-24">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">About Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            Empowering Indian farmers and delivering 100% organic products across India.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Organic Agent was founded with a vision to bring fresh, chemical-free, and organically grown products directly from Indian farms to households across the country. We work closely with trusted farmers who follow sustainable and eco-friendly farming practices.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              Starting with a small network of organic farmers, we have expanded our reach across multiple states in India. Our goal is to support local agriculture while ensuring customers receive healthy and nutritious food at affordable prices.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">By The Numbers</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">25+</p>
<p className="text-sm font-medium text-black">Partner Farms</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">5K+</p>
                <p className="text-sm font-medium text-black">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">100%</p>
                <p className="text-sm font-medium text-black">Organic Certified</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1488459716781-6818a6aa9d7d?auto=format&fit=crop&w=600&q=80"
            alt="Organic farming"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm text-slate-900">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Our Values</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What We Stand For</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {values.map((value, index) => (
            <div key={index} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-4xl">{value.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
              <p className="text-sm text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Our Team</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Meet Our Leadership</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
  {teamMembers.map((member) => (
            <div key={member.id} className="text-center rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition">
              <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="mt-2 text-sm text-green-700 font-semibold">
  {member.role}
</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CUSTOMER REVIEWS SECTION HERE */}
<div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
  <div>
    <p className="text-sm uppercase tracking-[0.35em] text-brand">
      Testimonials
    </p>
    <h2 className="mt-2 text-3xl font-bold text-slate-900">
      What Our Customers Say
    </h2>
  </div>

  <div className="grid gap-6 md:grid-cols-3">
    <div className="rounded-3xl bg-slate-50 p-6">
      <p>"The vegetables are always fresh and delivered on time."</p>
      <h4 className="mt-4 font-semibold">
        Priya Sharma, Delhi ⭐⭐⭐⭐⭐
      </h4>
    </div>

    <div className="rounded-3xl bg-slate-50 p-6">
      <p>"Best organic fruits I've ordered online. Highly recommended."</p>
      <h4 className="mt-4 font-semibold">
        Rahul Verma, Mumbai ⭐⭐⭐⭐⭐
      </h4>
    </div>

    <div className="rounded-3xl bg-slate-50 p-6">
      <p>"Excellent quality and great customer support."</p>
      <h4 className="mt-4 font-semibold">
        Ananya Patel, Ahmedabad ⭐⭐⭐⭐⭐
      </h4>
    </div>
  </div>
</div>

      <div className="rounded-[2rem] bg-gradient-to-r from-brand/10 to-brand-dark/10 border border-brand/20 p-8 sm:p-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-8">
            To revolutionize the way people access organic, fresh produce by connecting conscious consumers with sustainable farmers. We believe that every purchase is a vote for the kind of world we want to create—one where health, sustainability, and community thrive together.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;

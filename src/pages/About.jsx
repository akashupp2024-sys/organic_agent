function About() {
  const teamMembers = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Rajesh Patel',
      role: 'Head of Supply Chain',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Anjali Gupta',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'Quality Assurance',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
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
            Bringing fresh, organic goodness from farms to your table since 2020.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
            <p className="mt-4 text-slate-600 leading-7">
              OrganicStore was born from a simple mission: to make organic, fresh produce accessible to everyone. Founded in 2020 by a group of passionate farmers and entrepreneurs, we saw an opportunity to bridge the gap between sustainable agriculture and conscious consumers.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              Starting with just 5 local farms, we've grown to partner with over 50 certified organic producers across the region. Our commitment to quality, sustainability, and fair trade practices has made us a trusted name in the organic market.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">By The Numbers</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand">50+</p>
                <p className="text-sm text-slate-600">Partner Farms</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand">10K+</p>
                <p className="text-sm text-slate-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand">100%</p>
                <p className="text-sm text-slate-600">Organic Certified</p>
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

      <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Our Values</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What We Stand For</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition">
              <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="mt-2 text-sm text-brand font-medium uppercase tracking-[0.24em]">{member.role}</p>
              </div>
            </div>
          ))}
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

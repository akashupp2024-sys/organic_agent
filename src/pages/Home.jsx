import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { items } from '../data/sampleData';
import { products } from '../data/products';
import { testimonials } from '../data/testimonials';

const categories = [
  { key: 'Vegetables', icon: '🥬' },
  { key: 'Fruits', icon: '🍓' },
  { key: 'Dairy', icon: '🧀' },
  { key: 'Bakery', icon: '🥐' },
  { key: 'Beverages', icon: '🍵' },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  const counts = categories.reduce((map, category) => {
    map[category.key] = products.filter((product) => product.category === category.key).length;
    return map;
  }, {});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribeSuccess(true);
      setEmail('');
      setTimeout(() => setSubscribeSuccess(false), 4000);
    }
  };

  return (
    <section className="space-y-10">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-cover bg-center text-white shadow-2xl"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <span className="inline-flex rounded-full bg-brand/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg">
            Fresh from nature
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fresh & Organic Products for Healthy Living
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Discover nourishing goods sourced directly from eco-friendly farms. Clean ingredients, sustainable packaging, and a better choice for your daily wellness.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark">
              Shop Now
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Explore categories</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Shop by category</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            View all products
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.key}
              to={`/shop?category=${encodeURIComponent(category.key)}`}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:border-brand hover:bg-brand/5"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand/10 text-3xl transition group-hover:bg-brand group-hover:text-white">
                {category.icon}
              </div>
              <p className="mt-5 text-lg font-semibold text-slate-900">{category.key}</p>
              <p className="mt-2 text-sm text-slate-500">{counts[category.key] || 0} items</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Why choose us</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Benefits you can trust</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand/10 text-3xl">
              🌿
            </div>
            <h3 className="text-lg font-semibold text-slate-900">100% Organic</h3>
            <p className="text-sm text-slate-600">All our products are certified organic, grown without synthetic chemicals or pesticides.</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand/10 text-3xl">
              🚚
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Free Delivery</h3>
            <p className="text-sm text-slate-600">Get free shipping on all orders above ₹499. Fast and reliable delivery to your doorstep.</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand/10 text-3xl">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Secure Payment</h3>
            <p className="text-sm text-slate-600">Your transactions are encrypted and protected. Shop with confidence and peace of mind.</p>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand/10 text-3xl">
              ↩️
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Easy Returns</h3>
            <p className="text-sm text-slate-600">Hassle-free returns within 30 days. Not satisfied? We'll make it right.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Customer reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What our customers say</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <div className="flex items-center gap-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-16 w-16 rounded-full object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
                        <div className="mt-2 flex gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg
                              key={index}
                              viewBox="0 0 24 24"
                              fill={index < testimonial.rating ? 'currentColor' : 'none'}
                              stroke={index >= testimonial.rating ? 'currentColor' : 'none'}
                              strokeWidth="2"
                              className="h-4 w-4"
                            >
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 text-slate-600 leading-7">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
              <path d="M15 19L8 12M8 12L15 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
              <path d="M9 19L16 12M16 12L9 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition ${index === currentSlide ? 'w-8 bg-brand' : 'w-3 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-3 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand to-brand-dark p-8 shadow-lg sm:p-12 lg:p-16">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Get Fresh Deals in Your Inbox</h2>
          <p className="mt-4 text-lg text-white/90">Subscribe to our newsletter and receive exclusive offers, fresh tips, and organic goodness delivered weekly.</p>

          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-full bg-white/20 px-6 py-4 text-sm font-medium text-white placeholder-white/60 outline-none transition focus:bg-white/30 focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand transition hover:bg-slate-100"
            >
              Subscribe
            </button>
          </form>

          {subscribeSuccess && (
            <div className="mt-6 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white">
              ✓ Thanks for subscribing! Check your email for exclusive offers.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;

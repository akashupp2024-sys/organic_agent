import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 4000);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand to-brand-dark py-16 shadow-lg sm:py-20 lg:py-24">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Get in Touch</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full rounded-3xl border px-5 py-3 text-sm outline-none transition ${
                  formErrors.name
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                }`}
              />
              {formErrors.name && <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full rounded-3xl border px-5 py-3 text-sm outline-none transition ${
                  formErrors.email
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                }`}
              />
              {formErrors.email && <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`w-full rounded-3xl border px-5 py-3 text-sm outline-none transition ${
                  formErrors.subject
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                }`}
              />
              {formErrors.subject && <p className="mt-2 text-sm text-red-600">{formErrors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us your thoughts..."
                rows={5}
                className={`w-full rounded-3xl border px-5 py-3 text-sm outline-none transition resize-none ${
                  formErrors.message
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                }`}
              />
              {formErrors.message && <p className="mt-2 text-sm text-red-600">{formErrors.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Send Message
            </button>

            {formSubmitted && (
              <div className="rounded-full bg-emerald-100 px-6 py-3 text-sm font-semibold text-emerald-700 text-center">
                ✓ Thank you! We'll be in touch soon.
              </div>
            )}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] overflow-hidden bg-slate-200 shadow-sm h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.6234567890!2d77.123456!3d28.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjQiTiA3N8KwMDcnMjQuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OrganicStore Location"
            />
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand mb-2">Contact Info</h3>
              <h2 className="text-2xl font-bold text-slate-900">Reach out to us</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-slate-900">Address</p>
                  <p className="mt-1 text-slate-600">123 Green Street, Eco City, EC 12345, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-semibold text-slate-900">Phone</p>
                  <p className="mt-1 text-slate-600">+91 9999 999 999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="mt-1 text-slate-600">hello@organicstore.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="font-semibold text-slate-900">Working Hours</p>
                  <p className="mt-1 text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-slate-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-slate-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

import { Link } from 'react-router-dom';

function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages'];

  const socialLinks = [
    {
      icon: 'f',
      label: 'Facebook',
      href: '#',
    },
    {
      icon: 'i',
      label: 'Instagram',
      href: '#',
    },
    {
      icon: 't',
      label: 'Twitter',
      href: '#',
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C12 2 16 6 12 12C8 18 4 20 4 20C4 20 2 14 6 10C8 8 12 2 12 2Z" fill="currentColor" />
                  <path d="M12 2C12 2 8 6 12 12C16 18 20 20 20 20C20 20 22 14 18 10C16 8 12 2 12 2Z" fill="currentColor" opacity="0.75" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">OrganicStore</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Natural goods</p>
              </div>
            </Link>
            <p className="text-sm text-slate-600">Fresh, organic products delivered to your doorstep. Supporting sustainable farming and healthy living.</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-brand hover:text-white"
                  aria-label={social.label}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    {social.icon === 'f' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                    {social.icon === 'i' && <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.267-1.459.645-2.126 1.308-.663.667-1.041 1.347-1.308 2.126-.267.788-.468 1.658-.528 2.936C.015 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.267.79.645 1.46 1.308 2.127.667.663 1.347 1.041 2.126 1.308.788.267 1.658.468 2.936.528C8.333 23.985 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.79-.267 1.46-.645 2.127-1.308.663-.667 1.041-1.347 1.308-2.126.267-.788.468-1.658.528-2.936.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.267-.79-.645-1.46-1.308-2.127-.667-.663-1.347-1.041-2.126-1.308-.788-.267-1.658-.468-2.936-.528C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.561.217.96.477 1.382.896.419.42.679.821.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.561-.477.96-.896 1.382-.42.419-.821.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.561-.217-.96-.477-1.382-.896-.419-.42-.679-.821-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.561.477-.96.896-1.382.42-.419.821-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z" />}
                    {social.icon === 't' && <path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.856.12 5 5 0 00.487-1.2 10 10 0 01-2.957 1.142 5 5 0 00-8.477 4.57c-4.064-.2-7.674-2.16-10.177-5.14a5 5 0 001.551 6.684 5 5 0 01-2.265-.616v.06a5 5 0 004.006 4.907 5 5 0 01-2.26.085 5 5 0 004.666 3.472 10 10 0 01-6.177 2.13c-.39 0-.779-.023-1.17-.067a14.047 14.047 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-600 transition hover:text-brand hover:font-semibold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link to={`/shop?category=${encodeURIComponent(category)}`} className="text-sm text-slate-600 transition hover:text-brand hover:font-semibold">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">📞</span>
                <div>
                  <p className="font-medium text-slate-900">Phone</p>
                  <a href="tel:+919999999999" className="transition hover:text-brand">
                    +91 9999 999 999
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">✉️</span>
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <a href="mailto:hello@organicstore.com" className="transition hover:text-brand">
                    hello@organicstore.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-brand">📍</span>
                <div>
                  <p className="font-medium text-slate-900">Address</p>
                  <p>123 Green Street, Eco City, EC 12345</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              &copy; 2024 OrganicStore. All rights reserved. Celebrating organic living.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="transition hover:text-brand">
                Privacy Policy
              </a>
              <a href="#" className="transition hover:text-brand">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="rounded-3xl bg-white p-12 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;

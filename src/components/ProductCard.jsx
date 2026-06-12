import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

function ProductCard({ product }) {
  const productId = product._id || product.id;
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const originalPrice = product.originalPrice ?? product.price;
  const { addToCart } = useCartContext();

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-slate-100">
        <Link to={`/product/${productId}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        {product.discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg">
            {product.discount}% off
          </span>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link to={`/product/${productId}`} className="text-lg font-semibold text-slate-900 transition hover:text-brand">
              {product.name}
            </Link>
            <p className="mt-1 text-sm uppercase tracking-[0.24em] text-brand-dark">{product.category}</p>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: fullStars }).map((_, index) => (
            <svg key={`star-full-${index}`} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          ))}
          {halfStar && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27V2Z" />
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2V17.27Z" fill="currentColor" opacity="0.25" />
            </svg>
          )}
          {Array.from({ length: emptyStars }).map((_, index) => (
            <svg key={`star-empty-${index}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-300">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          ))}
          <span className="ml-2 text-sm font-medium text-slate-600">{rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
          {originalPrice > product.price && (
            <p className="text-sm text-slate-500 line-through">₹{originalPrice.toFixed(2)}</p>
          )}
        </div>

        <p className="text-sm leading-6 text-slate-600">{product.description}</p>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!product.inStock}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;

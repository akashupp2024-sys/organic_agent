import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import productAPI from '../api/productAPI';

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    originalPrice: product.originalPrice ?? product.price,
    rating: product.rating ?? 0,
    discount: product.discount ?? 0,
  };
}

function getErrorMessage(error, fallback) {
  return error?.error || error?.message || fallback;
}

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage('');
    setQuantity(1);

    productAPI
      .getById(id)
      .then(async (data) => {
        if (!isMounted) {
          return;
        }

        const loadedProduct = normalizeProduct(data.product);
        setProduct(loadedProduct);

        try {
          const relatedData = await productAPI.getAll({
            category: loadedProduct.category,
            limit: 5,
          });

          if (isMounted) {
            setRelatedProducts(
              (relatedData.products || [])
                .map(normalizeProduct)
                .filter((item) => item.id !== loadedProduct.id)
                .slice(0, 4)
            );
          }
        } catch {
          if (isMounted) {
            setRelatedProducts([]);
          }
        }
      })
      .catch((error) => {
        if (isMounted) {
          setProduct(null);
          setRelatedProducts([]);
          setErrorMessage(getErrorMessage(error, 'Unable to load product details.'));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, retryKey]);

  if (isLoading) {
    return (
      <section className="space-y-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-12 w-3/4 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="h-[32rem] animate-pulse rounded-[2rem] bg-slate-200" />
          </div>
          <div className="space-y-5 rounded-3xl bg-white p-8 shadow-sm">
            <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-10 w-44 animate-pulse rounded-full bg-slate-200" />
            <div className="h-28 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Product could not be loaded</h1>
        <p className="mt-4 text-slate-600">{errorMessage}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetryKey((current) => current + 1)}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Retry
          </button>
          <Link to="/shop" className="rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Product not found</h1>
        <p className="mt-4 text-slate-600">The product you are looking for does not exist.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
          Back to Shop
        </Link>
      </section>
    );
  }

  const tags = ['Organic', 'Fresh', 'Eco-friendly', product.category];

  const galleryImages = [
    product.image,
    product.image,
    product.image,
  ];

  return (
    <section className="space-y-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Product details</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">{product.name}</h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] bg-slate-100">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {galleryImages.map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-3xl bg-slate-100">
                    <img src={src} alt={`${product.name} ${index + 1}`} className="h-24 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-500">
                    <span className="text-lg font-semibold">{product.rating.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">/ 5</span>
                  </div>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-brand-dark">{product.category}</p>
                </div>
                <div className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">{product.discount}% off</div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
                <p className="text-sm text-slate-500 line-through">${product.originalPrice.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  −
                </button>
                <span className="min-w-[3rem] rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((qty) => qty + 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart({ ...product, qty: quantity })}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Add to Cart
              </button>

              <div className="rounded-3xl bg-slate-50 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tags</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Product description</h2>
              <p className="mt-3 text-slate-600 leading-7">{product.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Nutritional info</h2>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li className="rounded-3xl bg-white px-4 py-3 shadow-sm">High in vitamins and minerals</li>
                <li className="rounded-3xl bg-white px-4 py-3 shadow-sm">Zero artificial preservatives</li>
                <li className="rounded-3xl bg-white px-4 py-3 shadow-sm">Packed with fresh nutrients</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Related products</h2>
            <p className="mt-2 text-sm text-slate-500">You may also like these items from the same category.</p>
          </div>
          <div className="space-y-4">
            {relatedProducts.map((productItem) => (
              <Link
                key={productItem.id}
                to={`/product/${productItem.id}`}
                className="flex items-center gap-4 rounded-3xl border border-slate-200 p-4 transition hover:border-brand hover:bg-brand/5"
              >
                <img src={productItem.image} alt={productItem.name} className="h-20 w-20 rounded-3xl object-cover" />
                <div>
                  <p className="font-semibold text-slate-900">{productItem.name}</p>
                  <p className="text-sm text-slate-500">${productItem.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ProductDetail;

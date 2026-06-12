import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productAPI from '../api/productAPI';

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages'];
const sortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];
const limitOptions = [6, 9, 12, 18];

function getParam(searchParams, key, fallback) {
  return searchParams.get(key) || fallback;
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    originalPrice: product.originalPrice ?? product.price,
    rating: product.rating ?? 0,
    discount: product.discount ?? 0,
  };
}

function ShopSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <div className="h-72 animate-pulse bg-slate-200" />
          <div className="space-y-4 p-6">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
            <div className="h-8 w-1/3 animate-pulse rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const category = getParam(searchParams, 'category', '');
  const search = getParam(searchParams, 'search', '');
  const sort = getParam(searchParams, 'sort', 'newest');
  const page = Number(getParam(searchParams, 'page', '1'));
  const limit = Number(getParam(searchParams, 'limit', '9'));

  const query = useMemo(
    () => ({
      category,
      search,
      sort,
      page: Number.isNaN(page) || page < 1 ? 1 : page,
      limit: Number.isNaN(limit) || limit < 1 ? 9 : limit,
    }),
    [category, search, sort, page, limit]
  );

  const updateQuery = useCallback(
    (updates) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
        nextParams.set('page', '1');
      }

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage('');

    const params = {
      category: query.category || undefined,
      search: query.search.trim() || undefined,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    };

    productAPI
      .getAll(params)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        const totalCount = Number(data.total || 0);

        setProducts((data.products || []).map(normalizeProduct));
        setTotal(totalCount);
        setPages(Math.max(1, Math.ceil(totalCount / query.limit)));
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error.error || error.message || 'Unable to load products.');
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
  }, [query, retryKey]);

  const pageNumbers = useMemo(() => {
    const currentPage = query.page;
    const first = Math.max(1, currentPage - 2);
    const last = Math.min(pages, currentPage + 2);

    return Array.from({ length: last - first + 1 }, (_, index) => first + index);
  }, [pages, query.page]);

  const handleRetry = () => {
    setRetryKey((current) => current + 1);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Shop</h1>
        <p className="mt-3 text-slate-600">
          Browse fresh, organic products handpicked for your natural lifestyle.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">Filters</p>
              <p className="text-sm text-slate-500">Refine your search by category.</p>
            </div>
            <button
              type="button"
              onClick={() => setSearchParams({ page: '1', limit: String(query.limit) })}
              className="text-sm font-semibold text-brand transition hover:text-brand-dark"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Category</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => updateQuery({ category: '' })}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  query.category === ''
                    ? 'bg-brand text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                All categories
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateQuery({ category: item })}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    query.category === item
                      ? 'bg-brand text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700">Search</label>
                <input
                  type="search"
                  value={query.search}
                  onChange={(event) => updateQuery({ search: event.target.value })}
                  placeholder="Search products..."
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:flex lg:items-end">
                <div className="text-sm text-slate-500 sm:col-span-3 lg:min-w-[180px]">
                  <span className="font-semibold text-slate-900">
                    Showing {products.length} of {total} products
                  </span>
                </div>
                <label className="block min-w-[180px] text-sm font-semibold text-slate-700">
                  Sort by
                  <select
                    value={query.sort}
                    onChange={(event) => updateQuery({ sort: event.target.value })}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block min-w-[140px] text-sm font-semibold text-slate-700">
                  Per page
                  <select
                    value={query.limit}
                    onChange={(event) => updateQuery({ limit: event.target.value })}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {limitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {isLoading && <ShopSkeleton />}

          {!isLoading && errorMessage && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-red-700">Products could not be loaded</h2>
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && products.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">No products found</h2>
              <p className="mt-2 text-sm text-slate-600">Try a different search or category.</p>
            </div>
          )}

          {!isLoading && !errorMessage && products.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white p-4 shadow-sm">
                <button
                  type="button"
                  disabled={query.page <= 1}
                  onClick={() => updateQuery({ page: query.page - 1 })}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updateQuery({ page: pageNumber })}
                    className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                      query.page === pageNumber
                        ? 'bg-brand text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={query.page >= pages}
                  onClick={() => updateQuery({ page: query.page + 1 })}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Shop;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderAPI from '../api/orderAPI';

function formatDate(date) {
  if (!date) {
    return 'Date unavailable';
  }

  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getItemsSummary(items = []) {
  if (items.length === 0) {
    return 'No items';
  }

  const [firstItem, ...restItems] = items;
  const firstSummary = `${firstItem.name} x ${firstItem.quantity}`;

  if (restItems.length === 0) {
    return firstSummary;
  }

  return `${firstSummary} + ${restItems.length} more`;
}

function StatusBadge({ tone, children }) {
  const classes = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-sky-200 bg-sky-50 text-sky-700',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes[tone]}`}>
      {children}
    </span>
  );
}

function DeliveryBadge({ order }) {
  const status = order.isDelivered ? 'Delivered' : order.status || 'Pending';
  const tone = status === 'Delivered' ? 'green' : status === 'Shipped' ? 'blue' : 'amber';

  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getMyOrders()
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((error) => {
        setErrorMessage(error.error || error.message || 'Unable to load orders.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-3 text-slate-600">Review your recent OrganicStore purchases.</p>
      </div>

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
          Loading orders...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && orders.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-600">Your completed checkouts will appear here.</p>
        </div>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/my-orders/${order._id}`}
            className="block rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <article className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">Order #{order._id}</h2>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  ${Number(order.totalPrice || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-600">{getItemsSummary(order.orderItems)}</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={order.isPaid ? 'green' : 'amber'}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </StatusBadge>
                  <DeliveryBadge order={order} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Orders;

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import orderAPI from '../api/orderAPI';

function formatDate(date) {
  if (!date) {
    return 'Not available';
  }

  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusBadge({ tone, children }) {
  const classes = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-sky-200 bg-sky-50 text-sky-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes[tone]}`}>
      {children}
    </span>
  );
}

function getDeliveryTone(status) {
  if (status === 'Delivered') {
    return 'green';
  }

  if (status === 'Shipped') {
    return 'blue';
  }

  return 'amber';
}

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getById(id)
      .then((data) => {
        setOrder(data.order);
      })
      .catch((error) => {
        setErrorMessage(error.error || error.message || 'Unable to load order.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <section className="rounded-3xl bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
        Loading order...
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-6">
        <Link to="/my-orders" className="text-sm font-semibold text-brand hover:text-brand-dark">
          Back to My Orders
        </Link>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const address = order.shippingAddress || {};
  const deliveryStatus = order.isDelivered ? 'Delivered' : order.status || 'Pending';

  return (
    <section className="space-y-6">
      <Link to="/my-orders" className="text-sm font-semibold text-brand hover:text-brand-dark">
        Back to My Orders
      </Link>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order #{order._id}</h1>
            <p className="mt-3 text-sm text-slate-600">Placed {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={order.isPaid ? 'green' : 'amber'}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </StatusBadge>
            <StatusBadge tone={getDeliveryTone(deliveryStatus)}>{deliveryStatus}</StatusBadge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Items</h2>
          <div className="mt-5 divide-y divide-slate-200">
            {(order.orderItems || []).map((item) => (
              <div key={item.productId || item._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Qty {item.quantity} x ${Number(item.price || 0).toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-slate-900">
                  ${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Shipping Address</h2>
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{address.name}</p>
              <p>{address.phone}</p>
              <p>{address.street}</p>
              <p>
                {[address.city, address.state, address.pincode].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between gap-4">
                <span>Method</span>
                <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="font-semibold text-slate-900">{order.isPaid ? 'Paid' : 'Unpaid'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Paid At</span>
                <span className="font-semibold text-slate-900">{formatDate(order.paidAt)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Items</span>
                <span className="font-semibold text-slate-900">${Number(order.itemsPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Delivery</span>
                <span className="font-semibold text-slate-900">${Number(order.deliveryCharge || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">${Number(order.totalPrice || 0).toFixed(2)}</span>
              </div>
              {order.paymentResult?.razorpayPaymentId && (
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs uppercase text-slate-400">Payment ID</p>
                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {order.paymentResult.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;

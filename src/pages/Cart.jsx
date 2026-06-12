import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCartContext();
  const deliveryCharge = useMemo(() => (cartItems.length > 0 ? 5.0 : 0), [cartItems.length]);
  const totalAmount = useMemo(() => cartTotal + deliveryCharge, [cartTotal, deliveryCharge]);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="mt-3 text-slate-600">
          Review your selected items, adjust quantities, and complete your order.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center shadow-sm">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H4V4H6V6Z" fill="currentColor" />
              <path d="M20 7H9V5H20V7Z" fill="currentColor" />
              <path d="M7 9H21L20 18H8L7 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor" />
              <path d="M18 22C18.5523 22 19 21.5523 19 21C19 20.4477 18.5523 20 18 20C17.4477 20 17 20.4477 17 21C17 21.5523 17.4477 22 18 22Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="mt-4 text-slate-600">Add fresh organic products to your cart to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-2 text-sm uppercase tracking-[0.24em] text-brand-dark">{item.category}</p>
                      <p className="mt-3 text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4 text-right">
                    <p className="text-sm text-slate-500">Item subtotal</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
              <p className="mt-2 text-sm text-slate-600">Confirm your purchase before checkout.</p>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;

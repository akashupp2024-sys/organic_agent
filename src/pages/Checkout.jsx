import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import orderAPI from '../api/orderAPI';
import paymentAPI from '../api/paymentAPI';

function getErrorMessage(error, fallback) {
  return error?.error || error?.message || fallback;
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCartContext();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
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

  const deliveryCharge = cartItems.length > 0 ? 5.0 : 0;
  const totalAmount = cartTotal + deliveryCharge;

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order in backend
  const createBackendOrder = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrorMessage('Please login to place an order');
        return null;
      }

      const orderData = {
        orderItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase(),
      };

      const data = await orderAPI.create(orderData);
      return data.order;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to create order'));
      return null;
    }
  };

  // Create Razorpay order
  const createRazorpayOrder = async (backendOrder) => {
    try {
      const data = await paymentAPI.createOrder({
        orderId: backendOrder._id,
        amount: backendOrder.totalPrice,
      });
      return data;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to create payment order'));
      return null;
    }
  };

  // Verify payment
  const verifyPayment = async (backendOrderId, razorpayData) => {
    try {
      const data = await paymentAPI.verifyPayment({
        orderId: backendOrderId,
        razorpayOrderId: razorpayData.razorpay_order_id,
        razorpayPaymentId: razorpayData.razorpay_payment_id,
        razorpaySignature: razorpayData.razorpay_signature,
      });
      return data.order;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Payment verification failed'));
      return null;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (backendOrder, razorpayOrderData) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setErrorMessage('Failed to load Razorpay. Please try again.');
      return;
    }

    const options = {
      key: razorpayOrderData.keyId,
      amount: backendOrder.totalPrice * 100, // Amount in paise
      currency: 'INR',
      name: 'OrganicBazar',
      description: 'Order Payment',
      order_id: razorpayOrderData.razorpayOrder.id,
      prefill: {
        name: formData.name,
        email: localStorage.getItem('userEmail') || '',
        contact: formData.phone,
      },
      theme: {
        color: '#10b981',
      },
      handler: async (response) => {
        // Payment successful
        const verifiedOrder = await verifyPayment(backendOrder._id, response);
        if (verifiedOrder) {
          setSuccessMessage(`Order #${verifiedOrder._id} placed successfully!`);
          setOrderId(verifiedOrder._id);
          clearCart();
          setOrderPlaced(true);
          setTimeout(() => {
            navigate(`/my-orders/${verifiedOrder._id}`);
          }, 2000);
        }
      },
      modal: {
        ondismiss: () => {
          setErrorMessage('Payment cancelled. Your order is saved. You can complete payment later.');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setErrorMessage(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        // Create order in backend
        const backendOrder = await createBackendOrder();
        if (!backendOrder) {
          setIsLoading(false);
          return;
        }

        if (paymentMethod === 'cod') {
          // For COD, just show success
          setSuccessMessage(`Order #${backendOrder._id} placed successfully!`);
          setOrderId(backendOrder._id);
          clearCart();
          setOrderPlaced(true);
          setTimeout(() => {
            navigate(`/my-orders/${backendOrder._id}`);
          }, 2000);
        } else {
          // For online payment, create Razorpay order and open checkout
          const razorpayOrderData = await createRazorpayOrder(backendOrder);
          if (razorpayOrderData) {
            await handleRazorpayPayment(backendOrder, razorpayOrderData);
          }
        }
      } catch (error) {
        setErrorMessage(error.message || 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add some products before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  if (orderPlaced) {
    return (
      <section className="rounded-3xl bg-white p-12 shadow-sm text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>
        <p className="mt-3 text-slate-600">
          Your order ID: <span className="font-semibold">{orderId}</span>
        </p>
        <p className="mt-2 text-sm text-slate-500">You'll receive a confirmation email shortly.</p>
        <p className="mt-3 text-sm text-slate-500">Redirecting to order details...</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {errorMessage && (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-sm text-emerald-600">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-3 text-slate-600">Complete your purchase and get your fresh organic products delivered.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Delivery Address</h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                      formErrors.name
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                        : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                    }`}
                  />
                  {formErrors.name && <p className="mt-2 text-xs text-red-600">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9999999999"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                      formErrors.phone
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                        : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                    }`}
                  />
                  {formErrors.phone && <p className="mt-2 text-xs text-red-600">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-slate-900 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Green Street, Apartment 4B"
                  rows={3}
                  className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition resize-none ${
                    formErrors.address
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                  }`}
                />
                {formErrors.address && <p className="mt-2 text-xs text-red-600">{formErrors.address}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-semibold text-slate-900 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110001"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                      formErrors.pincode
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                        : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                    }`}
                  />
                  {formErrors.pincode && <p className="mt-2 text-xs text-red-600">{formErrors.pincode}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-900 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                      formErrors.city
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                        : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                    }`}
                  />
                  {formErrors.city && <p className="mt-2 text-xs text-red-600">{formErrors.city}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-slate-900 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Delhi"
                  className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
                    formErrors.state
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-slate-200 bg-slate-50 focus:border-brand focus:ring-2 focus:ring-brand/20'
                  }`}
                />
                {formErrors.state && <p className="mt-2 text-xs text-red-600">{formErrors.state}</p>}
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 cursor-pointer transition hover:border-brand hover:bg-brand/5">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-slate-900">Cash on Delivery</p>
                  <p className="text-sm text-slate-600">Pay when you receive your order</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 cursor-pointer transition hover:border-brand hover:bg-brand/5">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-slate-900">UPI</p>
                  <p className="text-sm text-slate-600">Google Pay, PhonePe, or any UPI app</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 cursor-pointer transition hover:border-brand hover:bg-brand/5">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                  <p className="text-sm text-slate-600">Visa, Mastercard, or American Express</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Order Summary</h2>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 last:pb-0 last:border-0">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Delivery Charge</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className={`w-full rounded-full px-6 py-4 text-sm font-semibold text-white transition ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;

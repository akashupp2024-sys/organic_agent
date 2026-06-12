import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import adminAPI from '../api/adminAPI';
import orderAPI from '../api/orderAPI';
import productAPI from '../api/productAPI';

const adminLinks = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
];

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const productCategories = ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages'];
const emptyProductForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: 'Vegetables',
  image: '',
  inStock: true,
};

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(date) {
  if (!date) {
    return 'Unavailable';
  }

  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getErrorMessage(error, fallback) {
  return error?.error || error?.message || fallback;
}

function AdminDashboard() {
  const location = useLocation();
  const section = location.pathname.split('/')[2] || 'overview';
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([adminAPI.getOrders(), adminAPI.getProducts(), adminAPI.getUsers()])
      .then(([ordersData, productsData, usersData]) => {
        if (!isMounted) {
          return;
        }

        setOrders(ordersData.orders || []);
        setProducts(productsData.products || []);
        setUsers(usersData.users || []);
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error, 'Unable to load admin dashboard data.'));
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
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0),
    [orders]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const handleDeleteProduct = async (productId) => {
    setActionMessage('');

    try {
      await productAPI.delete(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      setActionMessage('Product deleted successfully.');
    } catch (error) {
      setActionMessage(getErrorMessage(error, 'Unable to delete product.'));
    }
  };

  const openAddProductForm = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setActionMessage('');
    setIsProductFormOpen(true);
  };

  const openEditProductForm = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      discount: product.discount ?? '',
      category: product.category || 'Vegetables',
      image: product.image || '',
      inStock: product.inStock !== false,
    });
    setActionMessage('');
    setIsProductFormOpen(true);
  };

  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setIsUploadingImage(false);
  };

  const handleProductFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionMessage('');
    setIsUploadingImage(true);

    try {
      const data = await productAPI.uploadImage(file);
      setProductForm((current) => ({ ...current, image: data.url || data.fileUrl }));
    } catch (error) {
      setActionMessage(getErrorMessage(error, 'Unable to upload image.'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const buildProductPayload = () => ({
    name: productForm.name,
    description: productForm.description,
    price: Number(productForm.price),
    originalPrice: productForm.originalPrice === '' ? null : Number(productForm.originalPrice),
    discount: productForm.discount === '' ? 0 : Number(productForm.discount),
    category: productForm.category,
    image: productForm.image,
    inStock: productForm.inStock,
  });

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');

    if (!productForm.image) {
      setActionMessage('Please upload a product image before saving.');
      return;
    }

    setIsSavingProduct(true);

    try {
      const payload = buildProductPayload();
      const data = editingProduct
        ? await productAPI.update(editingProduct._id, payload)
        : await productAPI.create(payload);

      setProducts((current) => {
        if (editingProduct) {
          return current.map((product) => (product._id === editingProduct._id ? data.product : product));
        }

        return [data.product, ...current];
      });
      setActionMessage(editingProduct ? 'Product updated successfully.' : 'Product created successfully.');
      closeProductForm();
    } catch (error) {
      setActionMessage(getErrorMessage(error, 'Unable to save product.'));
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setActionMessage('');

    try {
      const data = await orderAPI.updateStatus(orderId, {
        status,
        isDelivered: status === 'Delivered',
      });
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.order : order))
      );
      setActionMessage('Order status updated.');
    } catch (error) {
      setActionMessage(getErrorMessage(error, 'Unable to update order status.'));
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-3xl bg-white p-4 shadow-sm">
        <h1 className="px-3 py-2 text-xl font-bold text-slate-900">Admin</h1>
        <nav className="mt-3 space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white'
                  : 'block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 space-y-6">
        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {actionMessage && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {actionMessage}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
            Loading admin dashboard...
          </div>
        ) : (
          <>
            {section === 'overview' && (
              <Overview orders={orders} products={products} recentOrders={recentOrders} totalRevenue={totalRevenue} />
            )}
            {section === 'products' && (
              <ProductsTable
                products={products}
                onAddProduct={openAddProductForm}
                onEditProduct={openEditProductForm}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
            {section === 'orders' && (
              <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
            )}
            {section === 'users' && <UsersTable users={users} />}
          </>
        )}

        {isProductFormOpen && (
          <ProductForm
            productForm={productForm}
            editingProduct={editingProduct}
            isSavingProduct={isSavingProduct}
            isUploadingImage={isUploadingImage}
            onChange={handleProductFieldChange}
            onImageChange={handleProductImageChange}
            onSubmit={handleProductSubmit}
            onCancel={closeProductForm}
          />
        )}
      </div>
    </section>
  );
}

function Overview({ orders, products, recentOrders, totalRevenue }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Orders" value={orders.length} />
        <StatCard label="Total Revenue" value={formatMoney(totalRevenue)} />
        <StatCard label="Total Products" value={products.length} />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-3 py-4 font-semibold text-slate-900">#{order._id}</td>
                  <td className="px-3 py-4 text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="px-3 py-4 text-slate-600">{order.user?.name || 'Customer'}</td>
                  <td className="px-3 py-4 text-slate-900">{formatMoney(order.totalPrice)}</td>
                  <td className="px-3 py-4 text-slate-600">{order.status || 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProductsTable({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Products</h2>
        <button
          type="button"
          onClick={onAddProduct}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Add New Product
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                    <span className="font-semibold text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-600">{product.category}</td>
                <td className="px-3 py-4 text-slate-900">{formatMoney(product.price)}</td>
                <td className="px-3 py-4 text-slate-600">{product.inStock ? 'In stock' : 'Out of stock'}</td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product._id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  productForm,
  editingProduct,
  isSavingProduct,
  isUploadingImage,
  onChange,
  onImageChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-5 lg:grid-cols-[1fr_240px]">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-900">
            Name
            <input
              name="name"
              value={productForm.name}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Category
            <select
              name="category"
              value={productForm.category}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Original Price
            <input
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              value={productForm.originalPrice}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Discount %
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={productForm.discount}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex items-center gap-3 self-end rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
            <input
              name="inStock"
              type="checkbox"
              checked={productForm.inStock}
              onChange={onChange}
              className="h-4 w-4"
            />
            In stock
          </label>

          <label className="block text-sm font-semibold text-slate-900 sm:col-span-2">
            Description
            <textarea
              name="description"
              value={productForm.description}
              onChange={onChange}
              required
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900">
            Product Image
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>

          {isUploadingImage && (
            <p className="text-sm font-semibold text-slate-600">Uploading image...</p>
          )}

          {productForm.image ? (
            <img
              src={productForm.image}
              alt="Product preview"
              className="aspect-square w-full rounded-3xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm font-semibold text-slate-400">
              Image preview
            </div>
          )}

          <button
            type="submit"
            disabled={isSavingProduct || isUploadingImage}
            className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

function OrdersTable({ orders, onStatusChange }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-3">Order ID</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-3 py-4 font-semibold text-slate-900">#{order._id}</td>
                <td className="px-3 py-4 text-slate-600">{order.user?.name || 'Customer'}</td>
                <td className="px-3 py-4 text-slate-600">{formatDate(order.createdAt)}</td>
                <td className="px-3 py-4 text-slate-900">{formatMoney(order.totalPrice)}</td>
                <td className="px-3 py-4">
                  <select
                    value={order.status || 'Pending'}
                    onChange={(event) => onStatusChange(order._id, event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTable({ users }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Users</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-3 py-4 font-semibold text-slate-900">{user.name}</td>
                <td className="px-3 py-4 text-slate-600">{user.email}</td>
                <td className="px-3 py-4 text-slate-600">{user.role}</td>
                <td className="px-3 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;

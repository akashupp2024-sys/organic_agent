import { useState } from "react";

function SellProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    pickupAddress: "",
    manufacturer: "",
    countryOfOrigin: "",
    warranty: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Product submitted for approval!");
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Sell Your Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
          rows="4"
        />

        <input
          type="text"
          name="pickupAddress"
          placeholder="Pickup Address"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer Name"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="text"
          name="countryOfOrigin"
          placeholder="Country Of Origin"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <input
          type="text"
          name="warranty"
          placeholder="Warranty"
          onChange={handleChange}
          className="w-full rounded-xl border p-3 text-black"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-green-700 p-3 font-semibold text-white hover:bg-green-800"
        >
          Submit Product
        </button>

      </form>
    </div>
  );
}

export default SellProduct;
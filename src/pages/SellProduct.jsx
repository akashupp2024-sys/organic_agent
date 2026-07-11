import { useState } from "react";

function SellProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    stock: "",
    pickupAddress: "",
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

    alert("Product Submitted Successfully!");
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-black">
        Sell Your Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full rounded-lg border p-3 text-black"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full rounded-lg border p-3 text-black"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full rounded-lg border p-3 text-black"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          onChange={handleChange}
          className="w-full rounded-lg border p-3 text-black"
        />

        <textarea
          name="pickupAddress"
          placeholder="Pickup Address"
          onChange={handleChange}
          className="w-full rounded-lg border p-3 text-black"
          rows="4"
        />

        <input
  type="file"
  className="w-full rounded-lg border p-3 text-black"
/>

<input
  type="text"
  name="brand"
  placeholder="Brand Name"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
/>

<textarea
  name="description"
  placeholder="Product Description"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
  rows="4"
/>

<input
  type="text"
  name="manufacturer"
  placeholder="Manufacturer Name"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
/>

<input
  type="text"
  name="country"
  placeholder="Country Of Origin"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
/>

<input
  type="text"
  name="gst"
  placeholder="GST Number"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
/>

<input
  type="text"
  name="warranty"
  placeholder="Warranty Information"
  onChange={handleChange}
  className="w-full rounded-lg border p-3 text-black"
/>

        <button
          type="submit"
          className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Submit Product
        </button>

      </form>
    </div>
  );
}

export default SellProduct;
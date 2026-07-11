import { useState } from "react";

function SellProduct() {
  const [productName, setProductName] = useState("");

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold text-black mb-6">
        Sell Your Product
      </h1>

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 text-black"
      />

      <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg">
        Submit
      </button>
    </div>
  );
}

export default SellProduct;
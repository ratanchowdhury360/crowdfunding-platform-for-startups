import React from "react";

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-background text-white p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Invest in This Project</h2>

      <form className="space-y-4">
        <input type="number" placeholder="Amount (USD)" className="input input-bordered w-full" />
        <select className="select select-bordered w-full">
          <option disabled selected>Select Payment Method</option>
          <option>Bkash</option>
          <option>Nagad</option>
          <option>Visa</option>
          <option>PayPal</option>
        </select>
        <button className="bg-accent text-black font-semibold px-6 py-2 rounded hover:opacity-90 w-full">Confirm Payment</button>
      </form>
    </div>
  );
};

export default PaymentPage;

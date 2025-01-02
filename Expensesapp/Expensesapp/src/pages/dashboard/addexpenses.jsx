import React, { useState, useEffect } from "react";

export function AddExpenses() {
  // State variables for form fields
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    time: "",
    paymentMethod: "",
    location: "",
    note: "",
  });

  // Set initial date and time
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setFormData((prevData) => ({
      ...prevData,
      date: currentDate,
      time: currentTime,
    }));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data saved:", result);
        alert("Expense added successfully!");
      } else {
        console.error("Failed to save data");
        alert("Failed to add expense. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <>
      <div className="mt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Amount
              </label>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Amount"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Choose a category
                </option>
                <option value="rent">Rent/Mortgage</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Home Maintenance</option>
                <option value="fuel">Fuel</option>
                <option value="car_payments">Car Payments</option>
                <option value="repairs">Repairs/Maintenance</option>
                <option value="public_transit">Public Transit</option>
                <option value="groceries">Groceries</option>
                <option value="dining_out">Dining Out</option>
                <option value="snacks">Snacks & Coffee</option>
                <option value="insurance">Health Insurance</option>
                <option value="medications">Medications</option>
                <option value="fitness">Fitness/Gym</option>
                <option value="movies">Movies/Events</option>
                <option value="hobbies">Hobbies</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="grooming">Grooming/Salons</option>
                <option value="care_products">Personal Care Products</option>
                <option value="tuition">Tuition</option>
                <option value="books">Books & Materials</option>
                <option value="loan_payments">Loan Payments</option>
                <option value="credit_cards">Credit Card Payments</option>
                <option value="emergency_fund">Emergency Fund</option>
                <option value="investments">Investments</option>
                <option value="flights">Flights</option>
                <option value="accommodation">Accommodation</option>
                <option value="travel_meals">Travel Meals</option>
                <option value="gifts">Gifts</option>
                <option value="donations">Donations</option>
                <option value="pet_care">Pet Care</option>
                {/* Add other options here */}
              </select>
            </div>
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Current time
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" disabled>
                  Payment Method
                </option>
                <option value="Paytm">Paytm</option>
                <option value="Cash">Cash</option>
                <option value="PhonePay">Phone Pay</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Location"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Note
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={handleChange}
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default AddExpenses;

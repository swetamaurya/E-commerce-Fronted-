import React from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

const OrderFilter = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by order ID, name or phone"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaSearch />
              </div>
            </div>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <FaFilter className="mr-1" />
            <span>Filter:</span>
          </div>
          <select
            defaultValue="all"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          >
            <option value="all">All Orders</option>
            <option value="Order Received">Order Received</option>
            <option value="Processing">Processing</option>
            <option value="Payment Confirmed">Payment Confirmed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaDollarSign, FaChartLine, FaEye, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/adminApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard statistics
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getOrders(),
        adminApi.getUsers()
      ]);

      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
      
      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalUsers: usersRes.data.length,
        totalRevenue,
        recentOrders: ordersRes.data.slice(0, 5),
        topProducts: productsRes.data.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FaBoxOpen,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-600',
      path: '/admin/products',
      description: 'Manage your product inventory'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      hoverColor: 'hover:bg-green-600',
      path: '/admin/orders',
      description: 'View and manage orders'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-600',
      path: '/admin/users',
      description: 'Manage user accounts'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-600',
      path: '/admin/orders',
      description: 'View revenue details'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome to the admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              onClick={() => navigate(stat.path)}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-100 p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl ${stat.color} group-hover:${stat.hoverColor} transition-colors duration-200`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <FaArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{stat.title}</p>
                <p className={`text-lg sm:text-xl md:text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Recent Orders */}
        <div 
          onClick={() => navigate('/admin/orders')}
          className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Recent Orders</h3>
            <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          </div>
          <div className="p-3 sm:p-4">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-2">
                {stats.recentOrders.map((order) => (
                  <div 
                    key={order._id} 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      navigate(`/admin/orders/${order._id}`);
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:text-right sm:space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        ₹{order.totalAmount}
                      </p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div 
          onClick={() => navigate('/admin/products')}
          className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Top Products</h3>
            <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          </div>
          <div className="p-3 sm:p-4">
            {stats.topProducts.length > 0 ? (
              <div className="space-y-2">
                {stats.topProducts.map((product, index) => (
                  <div 
                    key={product._id} 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      navigate(`/admin/products/${product._id}`);
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:text-right sm:space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        ₹{product.price}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No products available</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

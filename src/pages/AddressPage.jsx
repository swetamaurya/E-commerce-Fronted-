import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addressApi } from '../services/api';

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    addressType: 'Home'
  });

  // Check if user came from cart (has cart flow context)
  const isFromCart = location.state?.fromCart || false;

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
      toast.error('Please login to continue');
      navigate('/');
      return;
    }

    // Load saved addresses only once
    if (!addressesLoaded) {
      loadSavedAddresses();
    }
  }, [navigate, addressesLoaded]);

  const loadSavedAddresses = async () => {
    try {
      setAddressesLoaded(true);
      const response = await addressApi.getAddresses();
      const addresses = response.data || [];
      setSavedAddresses(addresses);
      
      // Find and set default address
      const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
      if (defaultAddr) {
        setDefaultAddress(defaultAddr);
        // Auto-fill form with default address
        setFormData({
          fullName: defaultAddr.fullName,
          addressLine1: defaultAddr.addressLine1,
          addressLine2: defaultAddr.addressLine2 || '',
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          phone: defaultAddr.phone,
          addressType: defaultAddr.addressType || 'Home'
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddressesLoaded(false); // Reset flag on error
      // Don't show error toast as this is not critical
    }
  };

  const refreshAddresses = async () => {
    try {
      const response = await addressApi.getAddresses();
      const addresses = response.data || [];
      setSavedAddresses(addresses);
      
      // Find and set default address
      const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
      if (defaultAddr) {
        setDefaultAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error refreshing addresses:', error);
    }
  };

  const useSavedAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      addressType: address.addressType || 'Home'
    });
    setShowSavedAddresses(false);
    setShowNewAddressForm(false);
    toast.success('Address loaded successfully!');
  };

  const editAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      addressType: address.addressType || 'Home'
    });
    setEditingAddress(address);
    setShowNewAddressForm(true);
    setShowSavedAddresses(false);
  };

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      setDeletingAddress(addressToDelete);
      await addressApi.deleteAddress(addressToDelete);
      
      // Update local state
      const updatedAddresses = savedAddresses.filter(addr => addr._id !== addressToDelete);
      setSavedAddresses(updatedAddresses);
      
      // Update default address if it was deleted
      if (defaultAddress && defaultAddress._id === addressToDelete) {
        const newDefault = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0];
        setDefaultAddress(newDefault);
      }
      
      toast.success('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    } finally {
      setDeletingAddress(null);
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  };

  const setAsDefault = async (addressId) => {
    try {
      setLoading(true);
      await addressApi.setDefaultAddress(addressId);
      
      // Update local state
      const updatedAddresses = savedAddresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
      setSavedAddresses(updatedAddresses);
      
      // Update default address
      const newDefault = updatedAddresses.find(addr => addr.isDefault);
      setDefaultAddress(newDefault);
      
      toast.success('Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      addressType: 'Home'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent multiple submissions
    
    // Validate form
    if (!formData.fullName || !formData.addressLine1 || !formData.city || 
        !formData.state || !formData.pincode || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      if (editingAddress) {
        // Update existing address
        const addressData = {
          ...formData,
          isDefault: editingAddress.isDefault
        };
        
        await addressApi.updateAddress(editingAddress._id, addressData);
        
        // Update local state
        const updatedAddresses = savedAddresses.map(addr => 
          addr._id === editingAddress._id ? { ...addressData, _id: editingAddress._id } : addr
        );
        setSavedAddresses(updatedAddresses);
        
        // Update default address if it was the one being edited
        if (editingAddress.isDefault) {
          setDefaultAddress({ ...addressData, _id: editingAddress._id });
        }
        
        setEditingAddress(null);
        setShowNewAddressForm(false);
        toast.success('Address updated successfully!');
        
        // Refresh addresses to show updated data
        await refreshAddresses();
      } else {
        // Check if this is an existing address (same as default address)
        const isExistingAddress = defaultAddress && 
          formData.fullName === defaultAddress.fullName &&
          formData.addressLine1 === defaultAddress.addressLine1 &&
          formData.city === defaultAddress.city &&
          formData.state === defaultAddress.state &&
          formData.pincode === defaultAddress.pincode &&
          formData.phone === defaultAddress.phone;

        if (!isExistingAddress) {
          // Save new address to database
          const addressData = {
            ...formData,
            isDefault: savedAddresses.length === 0 // Set as default if it's the first address
          };
          
          const response = await addressApi.createAddress(addressData);
          
          // Update local state
          setSavedAddresses([...savedAddresses, response.data]);
          
          // Set as default if it's the first address
          if (savedAddresses.length === 0) {
            setDefaultAddress(response.data);
          }
          
          toast.success('New address saved successfully!');
          
          // Refresh addresses to show updated data
          await refreshAddresses();
        } else {
          toast.success('Using saved address!');
        }
      }
      
      // Save to localStorage for immediate use
    localStorage.setItem('shippingAddress', JSON.stringify(formData));
    
      // Navigate based on context
      if (isFromCart) {
    navigate('/payment');
      } else {
        // For address management, ensure form closes and shows address list
        setShowNewAddressForm(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50">
        {/* Custom Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Address</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this address? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deletingAddress}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingAddress ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back button - different for cart vs navbar */}
        <div className="mb-3">
          <button
            onClick={() => {
              if (isFromCart) {
                // If from cart, go back to cart
                navigate('/cart');
              } else {
                // If from navbar, handle address management flow
                if (editingAddress || showNewAddressForm) {
                  setEditingAddress(null);
                  setShowNewAddressForm(false);
                } else {
                  navigate('/');
                }
              }
            }}
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">SHIPPING ADDRESS</h1>
        
        {/* Current Address Section */}
        {defaultAddress && !showNewAddressForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="p-3 sm:p-4">
              {!isFromCart && (
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      clearForm();
                      setShowNewAddressForm(true);
                    }}
                    className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              )}
              
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-sm sm:text-base">{defaultAddress.fullName}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                      {defaultAddress.addressType}
                    </span>
                  </div>
                  
                  {/* Action buttons for default address */}
                  <div className="flex gap-2">
                    {isFromCart && (
                      <button
                        type="button"
                        onClick={() => useSavedAddress(defaultAddress)}
                        className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Use This Address
                      </button>
                    )}
                    {!isFromCart && (
                      <>
                        <button
                          type="button"
                          onClick={() => editAddress(defaultAddress)}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title="Edit Address"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(defaultAddress._id)}
                          disabled={deletingAddress === defaultAddress._id}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Address"
                        >
                          {deletingAddress === defaultAddress._id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {defaultAddress.addressLine1}
                    {defaultAddress.addressLine2 && `, ${defaultAddress.addressLine2}`}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">Phone: {defaultAddress.phone}</p>
                </div>
              </div>
              
              {savedAddresses.length > 1 && (
                <div className="mt-3 space-y-2">
                  {/* <h3 className="font-medium text-gray-700 text-sm sm:text-base">Other Addresses</h3> */}
                  {savedAddresses.filter(addr => addr._id !== defaultAddress._id).map((address) => (
                    <div key={address._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-sm sm:text-base">{address.fullName}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                            {address.addressType}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {isFromCart && (
                            <button
                              type="button"
                              onClick={() => useSavedAddress(address)}
                              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors"
                            >
                              Use This Address
                            </button>
                          )}
                          {!isFromCart && (
                            <>
                              <button
                                type="button"
                                onClick={() => editAddress(address)}
                                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                title="Edit Address"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(address._id)}
                                disabled={deletingAddress === address._id}
                                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Address"
                              >
                                {deletingAddress === address._id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">Phone: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Address Form - Show when no saved address or when adding new address */}
        {(!defaultAddress || showNewAddressForm) && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="mb-4">
                <h2 className="text-lg font-medium">
                  {editingAddress ? 'Edit Address' : (defaultAddress ? 'Add New Address' : 'Enter Shipping Address')}
                </h2>
              </div>
              
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                  <select
                    id="addressType"
                    name="addressType"
                    value={formData.addressType}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select> 
                </div>
              </div>
              
                {isFromCart && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="w-full sm:w-auto text-teal-600 py-3 px-4 sm:px-6 rounded-md font-medium hover:text-teal-700 transition-colors border border-teal-600 hover:bg-teal-50 text-sm sm:text-base"
                    >
                      ← Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-teal-600 text-white py-3 px-4 sm:px-6 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  </div>
                )}
                
                {!isFromCart && (
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-teal-600 text-white py-2.5 px-4 sm:px-6 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      disabled={loading}
                    >
                      {loading ? (editingAddress ? 'Updating...' : 'Saving...') : (editingAddress ? 'Update Address' : 'Save Address')}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        
        {/* Use Current Address Button - Show when there's a saved address and coming from cart */}
        {defaultAddress && !showNewAddressForm && isFromCart && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full sm:w-auto text-teal-600 py-2.5 px-4 sm:px-6 rounded-md font-medium hover:text-teal-700 transition-colors border border-teal-600 hover:bg-teal-50 text-sm sm:text-base"
                >
                  ← Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-teal-600 text-white py-2.5 px-4 sm:px-6 rounded-md font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
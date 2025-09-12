import { useEffect } from "react";

export default function ShippingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Shipping Information
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable delivery to your doorstep
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="space-y-8">
          {/* Shipping Options */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard Shipping</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Delivery Time:</strong> 5-7 business days</p>
                  <p><strong>Cost:</strong> ₹99</p>
                  <p><strong>Tracking:</strong> Yes</p>
                  <p><strong>Insurance:</strong> Included</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Express Shipping</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Delivery Time:</strong> 2-3 business days</p>
                  <p><strong>Cost:</strong> ₹199</p>
                  <p><strong>Tracking:</strong> Yes</p>
                  <p><strong>Insurance:</strong> Included</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Major Cities</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Delhi NCR</li>
                  <li>• Mumbai</li>
                  <li>• Bangalore</li>
                  <li>• Chennai</li>
                  <li>• Kolkata</li>
                  <li>• Hyderabad</li>
                  <li>• Pune</li>
                  <li>• Ahmedabad</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Areas</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Tier 2 & 3 cities</li>
                  <li>• Rural areas</li>
                  <li>• Remote locations</li>
                  <li>• Union Territories</li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">*Delivery times may vary for remote areas</p>
              </div>
            </div>
          </div>

          {/* Order Processing */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Processing</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-semibold text-sm">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Confirmation</h3>
                  <p className="text-gray-600">You'll receive an email confirmation with your order details and estimated delivery date.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-semibold text-sm">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Processing</h3>
                  <p className="text-gray-600">We prepare your order for shipment within 1-2 business days.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-semibold text-sm">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
                  <p className="text-gray-600">Your order is shipped and you'll receive tracking information via email and SMS.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-semibold text-sm">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delivery</h3>
                  <p className="text-gray-600">Your order is delivered to your specified address.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Your Order */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Your Order</h2>
            <div className="space-y-4 text-gray-600">
              <p>Once your order is shipped, you can track it using:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tracking number provided in your shipping confirmation email</li>
                <li>Our website's order tracking feature</li>
                <li>Carrier's website or mobile app</li>
                <li>Contacting our customer service team</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800"><strong>Tip:</strong> Save your tracking number for easy reference. You can also sign up for SMS updates for real-time delivery notifications.</p>
              </div>
            </div>
          </div>

          {/* Delivery Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Requirements</h2>
            <div className="space-y-4 text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900">Address Requirements</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide a complete and accurate delivery address</li>
                <li>Include apartment/unit number if applicable</li>
                <li>Provide clear directions for hard-to-find locations</li>
                <li>Ensure someone is available to receive the delivery</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Delivery Attempts</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will attempt delivery up to 3 times</li>
                <li>If no one is available, we'll leave a delivery notice</li>
                <li>You can reschedule delivery by contacting us</li>
                <li>Unclaimed packages will be returned after 7 days</li>
              </ul>
            </div>
          </div>

          {/* Shipping Restrictions */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Restrictions</h2>
            <div className="space-y-4 text-gray-600">
              <p>We currently ship to all locations within India. However, there may be restrictions for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remote or inaccessible areas</li>
                <li>Areas with security restrictions</li>
                <li>International shipping (not currently available)</li>
                <li>PO Box addresses (signature required)</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800"><strong>Note:</strong> If your area has delivery restrictions, we'll contact you to discuss alternative arrangements.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Help?</h2>
            <div className="space-y-4 text-gray-600">
              <p>If you have any questions about shipping or need assistance with your order, please contact us:</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2">
                  <p><strong>Email:</strong> royalthread2025@gmail.com</p>
                  <p><strong>Phone:</strong> +91 8887565329</p>
                  <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                  <p><strong>Address:</strong> Chhoti Bashi, Near Shastri Setu, Mirzapur, Uttar Pradesh - 231001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

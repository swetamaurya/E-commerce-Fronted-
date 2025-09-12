import { useEffect } from "react";

export default function ReturnPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Return Policy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We want you to be completely satisfied with your purchase
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Eligibility</h2>
              <div className="space-y-4 text-gray-600">
                <p>We offer returns and exchanges for most items within 7 days of delivery. To be eligible for a return, your item must be:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>In its original condition</li>
                  <li>Unused and unwashed</li>
                  <li>With original tags and packaging</li>
                  <li>In the same condition as when you received it</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800"><strong>Note:</strong> Custom or personalized items, as well as items marked as "Final Sale," are not eligible for returns.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Initiate a Return</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">Step 1: Contact Us</h3>
                <p>To initiate a return, please contact us within 7 days of delivery:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email: royalthread2025@gmail.com</li>
                  <li>Phone: +91 8887565329</li>
                  <li>Include your order number and reason for return</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Step 2: Return Authorization</h3>
                <p>We will provide you with a Return Authorization Number (RAN) and return instructions. Please include this RAN with your return package.</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Step 3: Package and Ship</h3>
                <p>Package the item securely in its original packaging and ship it to our return address. We recommend using a trackable shipping method.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Shipping</h2>
              <div className="space-y-4 text-gray-600">
                <p>Return shipping costs are the responsibility of the customer, except in cases where:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The item was defective or damaged upon arrival</li>
                  <li>We sent the wrong item</li>
                  <li>The item doesn't match the description on our website</li>
                </ul>
                <p>In these cases, we will provide a prepaid return shipping label.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Returns</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">Inspection Process</h3>
                <p>Once we receive your return, we will inspect the item to ensure it meets our return criteria. This process typically takes 2-3 business days.</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Refund Processing</h3>
                <p>If your return is approved, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method used for the purchase.</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Exchange Processing</h3>
                <p>For exchanges, we will ship the replacement item once we receive and approve your return. If the replacement item is out of stock, we will issue a full refund.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Timeline</h2>
              <div className="space-y-4 text-gray-600">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Return received and approved</span>
                      <span className="font-semibold">2-3 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Refund processed</span>
                      <span className="font-semibold">5-7 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Refund appears in your account</span>
                      <span className="font-semibold">3-10 business days</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">*Timeline may vary depending on your bank or payment provider</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Items Not Eligible for Return</h2>
              <div className="space-y-4 text-gray-600">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Custom or personalized items</li>
                  <li>Items marked as "Final Sale"</li>
                  <li>Items that have been used, washed, or damaged</li>
                  <li>Items without original tags or packaging</li>
                  <li>Items returned after 7 days of delivery</li>
                  <li>Items that have been altered or modified</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Defective Items</h2>
              <div className="space-y-4 text-gray-600">
                <p>If you receive a damaged or defective item, please contact us immediately. We will arrange for a replacement or full refund at no cost to you.</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800"><strong>Important:</strong> Please report damaged or defective items within 48 hours of delivery for the fastest resolution.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Address</h2>
              <div className="space-y-4 text-gray-600">
                <p>Please send returns to:</p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Royal Thread</strong></p>
                    <p>Chhoti Bashi, Near Shastri Setu</p>
                    <p>Mirzapur, Uttar Pradesh - 231001</p>
                    <p>India</p>
                    <p className="text-sm text-gray-500 mt-2">Please include your Return Authorization Number (RAN) with your return package.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns</h2>
              <div className="space-y-4 text-gray-600">
                <p>If you have any questions about our return policy or need assistance with a return, please don't hesitate to contact us:</p>
                <div className="bg-teal-50 rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> royalthread2025@gmail.com</p>
                    <p><strong>Phone:</strong> +91 8887565329</p>
                    <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

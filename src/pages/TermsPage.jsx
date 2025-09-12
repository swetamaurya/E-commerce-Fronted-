import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>By accessing and using Royal Thread's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <div className="space-y-4 text-gray-600">
                <p>Permission is granted to temporarily download one copy of the materials on Royal Thread's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Product Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. All products are subject to availability.</p>
                <p>Colors and patterns may vary slightly from the images shown due to monitor settings and lighting conditions. We recommend viewing products in person when possible.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">Order Processing</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order at our discretion</li>
                  <li>Order confirmation will be sent via email</li>
                  <li>Processing time may vary depending on product availability</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Payment</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payment is required at the time of order placement</li>
                  <li>We accept UPI, PhonePe, GPay, Paytm, VISA, and Mastercard</li>
                  <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                  <li>We reserve the right to change prices at any time</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
              <div className="space-y-4 text-gray-600">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Shipping charges are calculated based on delivery location and order weight</li>
                  <li>Delivery times are estimates and may vary due to factors beyond our control</li>
                  <li>Risk of loss and title for products purchased pass to you upon delivery</li>
                  <li>We are not responsible for delays caused by shipping carriers</li>
                  <li>Please ensure someone is available to receive the delivery</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Exchanges</h2>
              <div className="space-y-4 text-gray-600">
                <p>We want you to be completely satisfied with your purchase. Please refer to our detailed Return Policy for information about returns, exchanges, and refunds.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Returns must be initiated within 7 days of delivery</li>
                  <li>Products must be in original condition with tags attached</li>
                  <li>Custom or personalized items may not be eligible for return</li>
                  <li>Return shipping costs are the responsibility of the customer</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
                <p>The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the website are protected under applicable copyrights, trademarks, and other proprietary rights.</p>
                <p>You may not use our trademarks, logos, or other proprietary information without our express written consent.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600">
                <p>In no event shall Royal Thread, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy Policy</h2>
              <div className="space-y-4 text-gray-600">
                <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <div className="space-y-4 text-gray-600">
                <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh, India.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the service after any such changes constitutes your acceptance of the new terms.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>If you have any questions about these Terms & Conditions, please contact us:</p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> royalthread2025@gmail.com</p>
                    <p><strong>Phone:</strong> +91 8887565329</p>
                    <p><strong>Address:</strong> Chhoti Bashi, Near Shastri Setu, Mirzapur, Uttar Pradesh - 231001</p>
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

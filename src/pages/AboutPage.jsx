import { useEffect } from "react";
// comment
export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            About Royal Thread
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Crafting premium handmade rugs and mats for your home
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Our Story */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Welcome to Royal Thread, a MSE (Micro and Small Enterprise) based out of India. 
                We are passionate about delivering high-quality handmade rugs and mats to our customers.
              </p>
              <p>
                Our journey began with a simple vision: to bring the beauty of traditional Indian 
                craftsmanship to modern homes. Each piece in our collection is carefully handcrafted 
                by skilled artisans who have inherited their craft through generations.
              </p>
              <p>
                We believe that every home deserves to be adorned with beautiful, functional, and 
                sustainable products that tell a story of craftsmanship and quality.
              </p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                To provide our customers with premium quality handmade rugs and mats that combine 
                traditional craftsmanship with modern design sensibilities.
              </p>
              <p>
                We are committed to supporting local artisans and preserving traditional weaving 
                techniques while ensuring fair wages and sustainable practices.
              </p>
              <p>
                Our goal is to make every customer's home more beautiful, comfortable, and 
                environmentally conscious through our carefully curated collection.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                We ensure every product meets our high standards of quality and durability.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Craftsmanship</h3>
              <p className="text-gray-600 text-sm">
                Each piece is handcrafted by skilled artisans using traditional techniques.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We use eco-friendly materials and support sustainable practices.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-16 sm:mt-20 text-center bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions about our products or want to learn more about our craftsmanship? 
            We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+918887565329"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
            <a
              href="mailto:royalthread2025@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

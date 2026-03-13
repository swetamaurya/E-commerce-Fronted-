import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const categories = [
  { label: "AREA RUGS", path: "/area-rugs" },
  { label: "BEDSIDE RUNNERS", path: "/bedside-runners" },
  { label: "MATS COLLECTION", path: "/mats-collection" },
  // { label: "BATH MATS", path: "/bath-mats" },
  // { label: "COTTON YOGA MATS", path: "/cotton-yoga-mats" },
];

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Return Policy", path: "/return" },
  { label: "Shipping Info", path: "/shipping" },
];

export default function Footer() {
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-50 text-gray-900 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <Logo size="large" className="justify-start" showText={true} />
            </div>
            <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm">
              Welcome to Royal Thread, a MSE based out of India. We aim to deliver
              high-quality handmade rugs and mats to our customers.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61580161687857"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-sm transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-gray-600">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.78 8.44-4.93 8.44-9.93Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/royalthread2025?igsh=ZmE5ZmU3eGZpeHVh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-sm transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-gray-600">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7.001ZM18 6.2a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2.001Z" />
                </svg>
              </a>
              <a
                href="https://wa.me/918887565329"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:shadow-sm transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-gray-600">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>

            {/* Marketplace Links */}
            {/* <div className="mt-4 sm:mt-6"> */}
            {/* <h5 className="text-sm font-semibold text-gray-900 mb-2">Find us on</h5> */}
            {/* <div className="flex flex-wrap items-center gap-2.5">
                {/* Meesho */}
            {/* <a
                  href="https://www.meesho.com/royalthread2025?_ms=3.0.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Meesho"
                  aria-label="Meesho"
                  className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="#FF0066"/>
                    <path d="M7.5 15V9.5a1.5 1.5 0 0 1 3 0V15h-1.5V9.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75V15H7.5Zm6 0V9.5a1.5 1.5 0 0 1 3 0V15H15V9.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75V15H13.5Z" fill="white"/>
                  </svg>
                </a> */}
            {/* Flipkart */}
            {/* <a
                  href="https://www.flipkart.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Flipkart"
                  aria-label="Flipkart"
                  className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2874F0"/>
                    <path d="M9 7h6l-1 3h-4l-1 3h4l-1 3H8.5c-.8 0-1.3-.9-.9-1.6L9 7Z" fill="#FFD700"/>
                  </svg>
                </a> */}
            {/* Amazon */}
            {/* <a
                  href="https://www.amazon.in/s?me=A1WMXLHVWC8UK1"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Amazon"
                  aria-label="Amazon"
                  className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path d="M6 7.5C6 6.1 7.3 5 9 5c1.4 0 2.4.6 2.9 1.6l-1.5.9C10.2 7 9.7 6.6 9 6.6c-.8 0-1.4.5-1.4 1 0 .6.5.9 1.3 1.1l.8.2c1.8.5 2.7 1.3 2.7 2.8 0 1.9-1.6 3-3.7 3-1.9 0-3.3-.8-3.9-2.1l1.6-.8c.3.8 1.1 1.3 2.3 1.3 1 0 1.7-.5 1.7-1.2 0-.6-.4-1-.9-1.1l-1.1-.3C6.9 10 6 9.2 6 7.9V7.5Z" fill="#000"/>
                    <path d="M4 18c4 1.8 8.1 1.8 12 0" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </a> */}
            {/* Shopsy */}
            {/* <a
                  href="https://www.shopsy.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Shopsy"
                  aria-label="Shopsy"
                  className="inline-flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path d="M6 7h12l-1.2 10.2A2 2 0 0 1 14.8 19H9.2a2 2 0 0 1-2-1.8L6 7Z" fill="#6C5CE7"/>
                    <path d="M9 7c.3-1.7 1.1-3 2.5-3S13.2 5.3 13.5 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </a> */}
            {/* </div> */}
            {/* </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title mb-3 sm:mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => {
                      // Scroll to top before navigation
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-title mb-3 sm:mb-4 text-gray-900">Categories</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {categories.map((category) => (
                <li key={category.label}>
                  <NavLink
                    to={category.path}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => {
                      // Scroll to top before navigation
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    {category.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-title mb-3 sm:mb-4 text-gray-900">Contact Us</h4>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-sm">+91 8887565329</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-sm break-all">royalthread2025@gmail.com</p>
                </div>
              </div>
              <a
                href="https://share.google/2ZFrSQFo2BzAn2dlc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>

                <div>
                  <p className="font-medium text-sm">Address</p>
                  <p className="text-sm">
                    Chhoti Bashi, Pakka Pul,<br />Mirzapur, Uttar Pradesh – 231001
                  </p>
                </div>
              </a>

              {/* Map Preview */}
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gray-100">
                  <iframe
                    title="Royal Thread Location"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Chhoti%20Bashi%2C%20Pakka%20Pul%2C%20Mirzapur%2C%20Uttar%20Pradesh%20231001&output=embed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Payment Methods */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center text-gray-900">We Accept</h4>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5">
              {/* UPI */}
              <a href="https://www.npci.org.in/what-we-do/upi/product-overview" target="_blank" rel="noopener noreferrer" aria-label="UPI" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><rect fill="#fff" width="36" height="36" rx="18" /><text x="18" y="24" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">UPI</text></svg>
              </a>
              {/* PhonePe */}
              <a href="https://www.phonepe.com/" target="_blank" rel="noopener noreferrer" aria-label="PhonePe" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><circle cx="18" cy="18" r="16" fill="#5b2dab" /><text x="18" y="24" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">P</text></svg>
              </a>
              {/* Google Pay */}
              <a href="https://pay.google.com/" target="_blank" rel="noopener noreferrer" aria-label="Google Pay" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><rect fill="#fff" width="36" height="36" rx="18" /><text x="18" y="24" textAnchor="middle" fontSize="14" fill="#1a73e8" fontWeight="bold">GPay</text></svg>
              </a>
              {/* Paytm */}
              <a href="https://paytm.com/" target="_blank" rel="noopener noreferrer" aria-label="Paytm" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><rect fill="#00baf2" width="36" height="36" rx="18" /><text x="18" y="24" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Paytm</text></svg>
              </a>
              {/* Visa */}
              <a href="https://www.visa.co.in/" target="_blank" rel="noopener noreferrer" aria-label="Visa" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><rect fill="#1a1f71" width="36" height="36" rx="8" /><text x="18" y="24" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">Visa</text></svg>
              </a>
              {/* Mastercard */}
              <a href="https://www.mastercard.co.in/" target="_blank" rel="noopener noreferrer" aria-label="Mastercard" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition">
                <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="w-8 h-8"><circle cx="14" cy="18" r="8" fill="#eb001b" /><circle cx="22" cy="18" r="8" fill="#f79e1b" /><text x="18" y="30" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">Mastercard</text></svg>
              </a>
            </div>
          </div>
          {/* Copyright */}
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              © {new Date().getFullYear()} Royal Thread. All rights reserved.
            </p>
            <p>
              Created by{" "}
              <a
                href="https://wa.me/918756043373"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
              >
                Sweta Maurya
              </a>
            </p>
          </div>
        </div>
      </div>


    </footer>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1.5 rounded-md bg-white text-black text-sm font-semibold">
      {children}
    </span>
  );
}

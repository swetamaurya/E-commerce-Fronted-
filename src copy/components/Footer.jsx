import { Link, NavLink } from "react-router-dom";

const categories = [
  { label: "COTTON YOGA MATS", path: "/cotton-yoga-mats" },
  { label: "BEDSIDE RUNNERS", path: "/bedside-runners" },
  { label: "MATS COLLECTION", path: "/mats-collection" },
  { label: "BATH MATS", path: "/bath-mats" },
  { label: "AREA RUGS", path: "/area-rugs" },
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
    <footer className="bg-[#0b0b0b] text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src="/logo-white.png" 
                alt="Royal Thread" 
                className="h-12 w-auto" 
                onError={(e) => {
                  e.currentTarget.outerHTML = 
                    '<div class="text-2xl font-bold tracking-wide">Royal Thread</div>';
                }}
              />
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              Welcome to Royal Thread, a MSE based out of India. We aim to deliver 
              high-quality handmade rugs and mats to our customers.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                className="hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.78 8.44-4.93 8.44-9.93Z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7.001ZM18 6.2a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2.001Z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/918887565329" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp" 
                className="hover:opacity-80 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.label}>
                  <NavLink 
                    to={category.path} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {category.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+91 9260915202</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <div>
                  <p className="font-medium">Email</p>
                  <p>royalthread2025@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm">Chhoti Bashi, Near Shastri Setu,<br/>Mirzapur, Uttar Pradesh – 231001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-center">We Accept</h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                UPI
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                PhonePe
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                GPay
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                Paytm
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                VISA
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold text-sm">
                Mastercard
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-white/70 text-sm">
            <p className="mb-2">
              © 2024 Royal Thread. All rights reserved.
            </p>
            <p>
              Created by{" "}
              <a
                href="https://wa.me/918756043373"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
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

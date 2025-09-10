import { Link, NavLink } from "react-router-dom";

const cats = [
  { label: "DOOR MATS", path: "/mats-collection" },
  { label: "KITCHEN MATS", path: "/mats-collection" },
  { label: "TABLE MATS", path: "/mats-collection" },
  { label: "BATH MATS", path: "/bath-mats" },
  { label: "MATS COLLECTION", path: "/mats-collection" },
  { label: "BEDSIDE RUNNERS", path: "/bedside-runners" },
  { label: "COTTON YOGA MATS", path: "/cotton-yoga-mats" },
  { label: "AREA RUGS", path: "/area-rugs" },
];

export default function Footer() {
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0b0b0b] text-white">
      {/* --- Top dark block --- */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-14 grid md:grid-cols-2 gap-10 border-b border-white/10">
        {/* Left: brand + about */}
        <div>
          <div className="mb-6">
            {/* apna logo public/logo-white.png mein daal sakte ho */}
            <img src="/logo-white.png" alt="Royal Thread" className="h-10 w-auto" onError={(e)=>{
              e.currentTarget.outerHTML =
                '<div style="font-weight:800;font-size:24px;letter-spacing:.04em">Royal Thread</div>';
            }}/>
          </div>

          <h3 className="text-2xl md:text-[28px] font-semibold mb-3">Royal Thread</h3>
          <p className="text-white/80 leading-relaxed max-w-[560px]">
            Welcome to Royal Thread website, we are a MSE based out of India.
            We aim to deliver high-quality products to our customers.
          </p>

          <div className="flex items-center gap-5 mt-6">
            {/* social icons */}
            <a href="#" aria-label="Facebook" className="hover:opacity-80">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22c4.78-.78 8.44-4.93 8.44-9.93Z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7.001ZM18 6.2a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2.001Z"/></svg>
            </a>
          </div>
        </div>

        {/* Right: contact */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold tracking-wide">CONTACT US</h4>
            <span className="text-white/70 text-lg">^</span>
          </div>

          <ul className="mt-4 space-y-3 text-white/80">
            <li><strong>Call:</strong> +91 - 9260915202</li>
            <li><strong>WhatsApp:</strong> +91 - 8887565329</li>
            <li><strong>Customer Support Time:</strong> 24/7</li>
            <li><strong>Email:</strong> royalthread2025@gmail.com</li>
            <li>
              <strong>Address:</strong> Chhoti Bashi, Near Shastri Setu,
Mirzapur, Uttar Pradesh – 231001
            </li>
          </ul>
        </div>
      </div>

      {/* --- Middle: policy links + most searched --- */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 border-b border-white/10">
        {/* policies row */}
        {/* <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-white font-semibold">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/return" className="hover:underline">Return Policy</Link>
          <Link to="/shipping" className="hover:underline">Shipping Policy</Link>
          <Link to="/terms" className="hover:underline">Terms and condition</Link>
        </div> */}

        {/* divider line */}
        {/* <div className="h-px bg-white/10 my-6"></div> */}

        {/* most searched */}
        <div className="space-y-3">
          <div className="text-white/80 font-semibold">Most searched on store</div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/80">
            {cats.slice(0,6).map((c, i) => (
              <span key={c.label} className="flex items-center">
                <NavLink to={c.path} className="hover:text-white">{c.label}</NavLink>
                {i !== 5 && <span className="mx-3 text-white/30">|</span>}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/80 mt-2">
            <span className="font-semibold">IN THE SPOTLIGHT</span>
            <span className="mx-3 text-white/30">|</span>
            <NavLink to="/area-rugs" className="hover:text-white">AREA RUGS</NavLink>
          </div>
        </div>
      </div>

     {/* --- Bottom: payments + go to top --- */}
<div className="bg-[#121212]">
  <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5">
    {/* payment logos */}
    {/* <div className="flex flex-wrap items-center gap-4 opacity-90">
      <Badge>PhonePe</Badge>
      <Badge>GPay</Badge>
      <Badge>Paytm</Badge>
      <Badge>UPI</Badge>
      <Badge>RuPay</Badge>
      <Badge>Mastercard</Badge>
      <Badge>VISA</Badge>
    </div> */}

    <button
      onClick={goTop}
      className="w-full md:w-auto border border-white/20 rounded-md px-6 py-3 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 transition"
    >
      <span className="text-xl">↑</span>
      <span className="tracking-wide">GO TO TOP</span>
    </button>
  </div>

  {/* ⬇️ yeh NEW block payments wale container ke BAAD hi paste karo */}
  <div className="border-t border-white/10">
    <div className="max-w-[1200px] mx-auto px-6 py-4">
      <p className="text-center text-xs sm:text-sm text-white/70">
        Created By{" "}
        <a
          href="https://wa.me/918756043373"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 font-semibold underline-offset-4 hover:underline focus-visible:underline"
        >
          Sweta Maurya
        </a>
      </p>
    </div>
  </div>
  {/* ⬆️ yahi tak naya block */}
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

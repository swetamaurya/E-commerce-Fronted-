// products.js
const IMG = (n) =>
  `https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnBldCUyMGltZ3xlbnwwfHwwfHx8MA%3D%3D=${n}`;

const DB = {
  "cotton-yoga-mats": [
    { 
      id:"ym-1", 
      title:"Multicolor Handmade Knitted Premium Yoga Mat", 
      price:3699, 
      mrp:11600, 
      off:"68%", 
      badge:"Extra 50% OFF", 
      image:IMG(1),
      type: "Body Art",
      size: "2 X 6 Feet | 8 Mm Thick",
      color: "Multicolor",
      popularity: 95
    },
    { 
      id:"ym-2", 
      title:"Green Handmade Knitted Cotton Yoga Mat",       
      price:3799, 
      mrp:11200, 
      off:"66%", 
      badge:"Extra 50% OFF", 
      image:IMG(2),
      type: "Body Art",
      size: "2 X 6 Feet | 5 Mm Thick",
      color: "Green",
      popularity: 88
    },
    { 
      id:"ym-3", 
      title:"Coffee Handmade Knitted Cotton Yoga Mat",      
      price:3799, 
      mrp:11200, 
      off:"66%", 
      badge:"Extra 50% OFF", 
      image:IMG(3),
      type: "Body Art",
      size: "2 X 6 Feet | 7 Mm Thick",
      color: "Brown",
      popularity: 92
    },
    { 
      id:"ym-4", 
      title:"Grey Premium Handmade Knitted Cotton Mat",     
      price:3799, 
      mrp:11200, 
      off:"66%", 
      badge:"Extra 50% OFF", 
      image:IMG(4),
      type: "Body Art",
      size: "2 X 6 Feet | 6 Mm",
      color: "Grey",
      popularity: 85
    },
    { 
      id:"ym-5", 
      title:"Indigo Block Print Yoga Mat",                  
      price:4099, 
      mrp:11999, 
      off:"65%", 
      badge:"Extra 50% OFF", 
      image:IMG(5),
      type: "Body Art",
      size: "2 X 6 Feet | 8 Mm",
      color: "Blue",
      popularity: 90
    },
    { 
      id:"ym-6", 
      title:"Ochre Handloom Cotton Yoga Mat",               
      price:3899, 
      mrp:10999, 
      off:"64%", 
      badge:"Extra 50% OFF", 
      image:IMG(6),
      type: "Body Art",
      size: "2 X 6 Feet | 10 Mm",
      color: "Brown",
      popularity: 87
    },
    { 
      id:"ym-7", 
      title:"Teal Paisley Cotton Yoga Mat",                 
      price:3999, 
      mrp:10999, 
      off:"64%", 
      badge:"Extra 50% OFF", 
      image:IMG(7),
      type: "Body Art",
      size: "8Mm",
      color: "Blue",
      popularity: 93
    },
    { 
      id:"ym-8", 
      title:"Classic Stripe Cotton Yoga Mat",               
      price:3499, 
      mrp: 9999, 
      off:"65%", 
      badge:"Extra 50% OFF", 
      image:IMG(8),
      type: "Body Art",
      size: "2 X 6 Feet | 8 Mm Thick",
      color: "Black & White",
      popularity: 89
    },
    { 
      id:"ym-9", 
      title:"Black Premium Cotton Yoga Mat",               
      price:3299, 
      mrp: 9999, 
      off:"67%", 
      badge:"Extra 50% OFF", 
      image:IMG(1),
      type: "Body Art",
      size: "2 X 6 Feet | 5 Mm Thick",
      color: "Black",
      popularity: 91
    },
    { 
      id:"ym-10", 
      title:"Blue Ocean Cotton Yoga Mat",               
      price:3599, 
      mrp: 10999, 
      off:"67%", 
      badge:"Extra 50% OFF", 
      image:IMG(2),
      type: "Body Art",
      size: "2 X 6 Feet | 6 Mm",
      color: "Blue",
      popularity: 86
    },
    { 
      id:"ym-11", 
      title:"Green Forest Cotton Yoga Mat",               
      price:3699, 
      mrp: 10999, 
      off:"66%", 
      badge:"Extra 50% OFF", 
      image:IMG(3),
      type: "Body Art",
      size: "2 X 6 Feet | 7 Mm Thick",
      color: "Green",
      popularity: 84
    },
    { 
      id:"ym-12", 
      title:"Brown Earth Cotton Yoga Mat",               
      price:3499, 
      mrp: 9999, 
      off:"65%", 
      badge:"Extra 50% OFF", 
      image:IMG(4),
      type: "Body Art",
      size: "2 X 6 Feet | 8 Mm",
      color: "Brown",
      popularity: 82
    }
  ],
  "bedside-runners": [
    { 
      id:"br-1", 
      title:"Handwoven Bedside Runner – Sand",  
      price:2199, 
      mrp:4999, 
      off:"56%", 
      badge:"Extra 50% OFF", 
      image:IMG(9),
      type: "Bedside Runner",
      size: "2 X 6 Feet",
      color: "Brown",
      popularity: 78
    },
    { 
      id:"br-2", 
      title:"Handwoven Bedside Runner – Slate", 
      price:2299, 
      mrp:4999, 
      off:"54%", 
      badge:"Extra 50% OFF", 
      image:IMG(10),
      type: "Bedside Runner",
      size: "2 X 6 Feet",
      color: "Grey",
      popularity: 82
    },
    { 
      id:"br-3", 
      title:"Handwoven Bedside Runner – Moss",  
      price:2199, 
      mrp:4999, 
      off:"56%", 
      badge:"Extra 50% OFF", 
      image:IMG(11),
      type: "Bedside Runner",
      size: "2 X 6 Feet",
      color: "Green",
      popularity: 75
    },
    { 
      id:"br-4", 
      title:"Handwoven Bedside Runner – Rust",  
      price:2299, 
      mrp:4999, 
      off:"54%", 
      badge:"Extra 50% OFF", 
      image:IMG(12),
      type: "Bedside Runner",
      size: "2 X 6 Feet",
      color: "Brown",
      popularity: 79
    },
  ],
  "mats-collection": [
    { 
      id:"mc-1", 
      title:"Doormat – Jute Blend", 
      price:799,  
      mrp:1499, 
      off:"47%", 
      badge:"Extra 50% OFF", 
      image:IMG(13),
      type: "Doormat",
      size: "2 X 3 Feet",
      color: "Brown",
      popularity: 68
    },
    { 
      id:"mc-2", 
      title:"Doormat – Chevron",    
      price:899,  
      mrp:1699, 
      off:"47%", 
      badge:"Extra 50% OFF", 
      image:IMG(14),
      type: "Doormat",
      size: "2 X 3 Feet",
      color: "Black",
      popularity: 72
    },
  ],
  "bath-mats": [
    { 
      id:"bm-1", 
      title:"Cotton Bath Mat – Sky",   
      price:599, 
      mrp:1299, 
      off:"54%", 
      badge:"Extra 50% OFF", 
      image:IMG(15),
      type: "Bath Mat",
      size: "2 X 3 Feet",
      color: "Blue",
      popularity: 65
    },
    { 
      id:"bm-2", 
      title:"Cotton Bath Mat – Coral", 
      price:649, 
      mrp:1299, 
      off:"50%", 
      badge:"Extra 50% OFF", 
      image:IMG(16),
      type: "Bath Mat",
      size: "2 X 3 Feet",
      color: "Brown",
      popularity: 70
    },
  ],
  "area-rugs": [
    { 
      id:"ar-1", 
      title:"Flatweave Area Rug – Charcoal", 
      price:5499, 
      mrp:9999, 
      off:"45%", 
      badge:"Extra 50% OFF", 
      image:IMG(17),
      type: "Area Rug",
      size: "6 X 9 Feet",
      color: "Black",
      popularity: 88
    },
    { 
      id:"ar-2", 
      title:"Flatweave Area Rug – Ivory",    
      price:5399, 
      mrp:9999, 
      off:"46%", 
      badge:"Extra 50% OFF", 
      image:IMG(18),
      type: "Area Rug",
      size: "6 X 9 Feet",
      color: "Grey",
      popularity: 85
    },
  ],
};

/**
 * abhi local DB se products deta hai,
 * future me API se data lena ho to yahi function edit karo.
 */
export async function listProducts(category) {
  // 🔁 Future (API)
  // const res = await fetch(`/api/products?category=${category}`);
  // return await res.json();

  // current (local DB)
  return DB[category] ?? [];
}

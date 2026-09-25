export const initialCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    description: 'High-performance audio, smart wearables, and next-gen personal computing accessories.',
  },
  {
    name: "Men's Fashion",
    slug: 'mens-fashion',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    description: 'Curated menswear, premium jackets, tees, and everyday luxury essentials.',
  },
  {
    name: "Women's Fashion",
    slug: 'womens-fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    description: 'Contemporary silhouettes, elegant dresses, footwear, and designer collections.',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    description: 'Minimalist home decor, artisan coffee makers, and smart ambient lighting.',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: 'Clean skincare formulas, signature luxury fragrances, and holistic personal care.',
  },
  {
    name: 'Sports',
    slug: 'sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    description: 'Performance training gear, yoga equipment, and athletic apparel.',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Leather backpacks, chronograph timepieces, and everyday travel gear.',
  },
];

export const initialProducts = [
  // 1. Electronics - Headphones
  {
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh-1000xm5-wireless-noise-cancelling-headphones',
    brand: 'Sony',
    category: 'Electronics',
    price: 29999,
    originalPrice: 34999,
    discount: 14,
    stock: 25,
    rating: 4.8,
    numReviews: 142,
    featured: true,
    trending: true,
    colors: ['Silver', 'Midnight Black', 'Smoky Navy'],
    sizes: ['Standard'],
    description: 'Industry-leading noise cancellation optimized by dual processors and eight microphones. Exceptional hi-res sound quality with newly developed 30mm driver unit and crystal clear hands-free calling.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Driver Unit', value: '30mm Carbon Fiber Composite' },
      { key: 'Battery Life', value: 'Up to 30 hours with ANC on' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, Multipoint' },
      { key: 'Weight', value: '250 grams' }
    ]
  },
  // 2. Electronics - Smartwatch
  {
    name: 'Apex Ultra Titanium Smartwatch with AMOLED Display',
    slug: 'apex-ultra-titanium-smartwatch',
    brand: 'NovaTech',
    category: 'Electronics',
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    stock: 18,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    trending: true,
    colors: ['Titanium Grey', 'Obsidian Black', 'Orange Alpine'],
    sizes: ['49mm'],
    description: 'Engineered for extreme performance with aerospace-grade titanium case, sapphire crystal glass, precision dual-frequency GPS, and 100m water resistance.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544117518-30df578096a4?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Display', value: '1.92-inch Always-On Retina AMOLED' },
      { key: 'Battery Life', value: 'Up to 72 hours in low-power mode' },
      { key: 'Water Resistance', value: '10 ATM (100m)' },
      { key: 'Sensors', value: 'ECG, SpO2, Heart Rate, Skin Temp' }
    ]
  },
  // 3. Electronics - Mechanical Keyboard
  {
    name: 'Vortex Pro Wireless Mechanical Keyboard RGB Hot-Swap',
    slug: 'vortex-pro-wireless-mechanical-keyboard',
    brand: 'Keycraft',
    category: 'Electronics',
    price: 8499,
    originalPrice: 10999,
    discount: 23,
    stock: 30,
    rating: 4.9,
    numReviews: 64,
    featured: true,
    trending: false,
    colors: ['Chalk White', 'Carbon Grey'],
    sizes: ['75% Compact', 'Full 100%'],
    description: 'Precision gasket-mounted 75% wireless mechanical keyboard featuring lubricated Gateron Pro switches, south-facing RGB, and CNC aluminum unibody chassis.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Switch Type', value: 'Pre-lubed Gateron Yellow Linear' },
      { key: 'Keycaps', value: 'Double-shot PBT Cherry Profile' },
      { key: 'Battery', value: '4000mAh rechargeable Li-ion' },
      { key: 'Tri-Mode', value: 'Bluetooth 5.1 / 2.4Ghz / USB-C' }
    ]
  },
  // 4. Electronics - Gaming Mouse
  {
    name: 'Aerox Prime Ultralight Wireless Gaming Mouse',
    slug: 'aerox-prime-ultralight-gaming-mouse',
    brand: 'RazerWave',
    category: 'Electronics',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    stock: 45,
    rating: 4.6,
    numReviews: 110,
    featured: false,
    trending: true,
    colors: ['Matte Black', 'Glacier White'],
    sizes: ['Ergonomic Right'],
    description: 'Sub-55g ultra-lightweight design equipped with optical switches rated for 90 million clicks, 26,000 DPI flawless optical sensor, and zero-latency wireless.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Weight', value: '54 grams' },
      { key: 'Sensor', value: '26K DPI Gen 2 Optical' },
      { key: 'Battery', value: '80 continuous gaming hours' }
    ]
  },
  // 5. Electronics - Smartphone
  {
    name: 'Horizon Pro 5G Flagship Smartphone 256GB',
    slug: 'horizon-pro-5g-flagship-smartphone',
    brand: 'NovaTech',
    category: 'Electronics',
    price: 54999,
    originalPrice: 62999,
    discount: 13,
    stock: 12,
    rating: 4.7,
    numReviews: 76,
    featured: true,
    trending: true,
    colors: ['Emerald Frost', 'Space Grey', 'Phantom Gold'],
    sizes: ['256GB', '512GB'],
    description: 'Flagship 5G smartphone powered by 3nm octacore silicon, 120Hz LTPO Quad HD+ curved AMOLED display, and a 108MP quad-camera optical zoom array.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Processor', value: 'Snapdragon 8 Gen 3 Flagship' },
      { key: 'RAM & Storage', value: '12GB LPDDR5X + 256GB UFS 4.0' },
      { key: 'Battery & Charging', value: '5000mAh with 100W SuperCharge' }
    ]
  },
  // 6. Electronics - Bluetooth Speaker
  {
    name: 'Acoustic SoundPulse Waterproof Portable Speaker',
    slug: 'acoustic-soundpulse-waterproof-portable-speaker',
    brand: 'HarmanCraft',
    category: 'Electronics',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    stock: 35,
    rating: 4.5,
    numReviews: 95,
    featured: false,
    trending: true,
    colors: ['Canyon Red', 'Forest Green', 'Stealth Black'],
    sizes: ['Compact 30W'],
    description: 'IP67 dust and waterproof 360-degree room-filling acoustic speaker with dual passive bass radiators and 24 hours of playtime on a single charge.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Output Power', value: '30W RMS Stereo' },
      { key: 'Waterproof Rating', value: 'IP67 Submersible' },
      { key: 'Playtime', value: 'Up to 24 hours' }
    ]
  },

  // 7. Men's Fashion - Oversized Hoodie
  {
    name: 'Heavyweight French Terry Oversized Hoodie',
    slug: 'heavyweight-french-terry-oversized-hoodie',
    brand: 'UrbanCraft',
    category: "Men's Fashion",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 40,
    rating: 4.6,
    numReviews: 83,
    featured: true,
    trending: true,
    colors: ['Washed Olive', 'Vintage Charcoal', 'Muted Cream'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Crafted from 480 GSM dense organic cotton French terry. Features drop shoulders, boxy drape, kangaroo pocket, and double-layered seamless hood.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Material', value: '100% Organic Combed Cotton 480 GSM' },
      { key: 'Fit', value: 'Relaxed Drop Shoulder Boxy Fit' },
      { key: 'Care', value: 'Machine wash cold, lay flat to dry' }
    ]
  },
  // 8. Men's Fashion - Bomber Jacket
  {
    name: 'Suede Minimalist Flight Bomber Jacket',
    slug: 'suede-minimalist-flight-bomber-jacket',
    brand: 'Atelier Mode',
    category: "Men's Fashion",
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    stock: 20,
    rating: 4.8,
    numReviews: 41,
    featured: false,
    trending: true,
    colors: ['Camel Tan', 'Espresso Brown', 'Slate Blue'],
    sizes: ['M', 'L', 'XL'],
    description: 'Sophisticated modern flight jacket tailored with velvety vegan faux suede, two-way YKK matte metallic zipper, and ribbed elastic cuffs.',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Shell', value: 'Premium Microsuede' },
      { key: 'Lining', value: '100% Breathable Satin Cupro' },
      { key: 'Hardware', value: 'Gunmetal YKK Zippers' }
    ]
  },
  // 9. Men's Fashion - Tailored Chinos
  {
    name: 'Modern Stretch Tailored Slim Chino Trousers',
    slug: 'modern-stretch-tailored-slim-chino-trousers',
    brand: 'Atelier Mode',
    category: "Men's Fashion",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    stock: 35,
    rating: 4.4,
    numReviews: 52,
    featured: false,
    trending: false,
    colors: ['Khaki Beige', 'Navy Blue', 'Olive Green'],
    sizes: ['30', '32', '34', '36'],
    description: 'Versatile everyday chinos woven with 98% mercerized cotton and 2% elastane for unrestricted movement and sharp crease retention.',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Composition', value: '98% Cotton, 2% Spandex' },
      { key: 'Fit', value: 'Tailored Slim Tapered' }
    ]
  },

  // 10. Women's Fashion - Silk Midi Dress
  {
    name: 'Aura Mulberry Silk Slip Wrap Midi Dress',
    slug: 'aura-mulberry-silk-slip-wrap-midi-dress',
    brand: 'Silk & Bloom',
    category: "Women's Fashion",
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    stock: 15,
    rating: 4.9,
    numReviews: 38,
    featured: true,
    trending: true,
    colors: ['Champagne Gold', 'Ruby Wine', 'Emerald Green'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Cut on the bias from pure 22 Momme mulberry silk, this midi dress creates an effortlessly fluid drape with delicate adjustable criss-cross straps.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Fabric', value: '100% Grade 6A Mulberry Silk 22 Momme' },
      { key: 'Length', value: 'Midi (Calf length)' }
    ]
  },
  // 11. Women's Fashion - Oversized Blazer
  {
    name: 'Structured Wool-Blend Double Breasted Blazer',
    slug: 'structured-wool-blend-double-breasted-blazer',
    brand: 'Silk & Bloom',
    category: "Women's Fashion",
    price: 4299,
    originalPrice: 5999,
    discount: 28,
    stock: 22,
    rating: 4.7,
    numReviews: 49,
    featured: false,
    trending: true,
    colors: ['Oatmeal Melange', 'Classic Houndstooth', 'Midnight Black'],
    sizes: ['S', 'M', 'L'],
    description: 'Modern relaxed silhouette with peak lapels, tortoiseshell buttons, and padded shoulders designed for effortless desk-to-dinner styling.',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Material', value: '60% Wool, 35% Polyester, 5% Elastane' },
      { key: 'Closure', value: 'Double Breasted Button Fastening' }
    ]
  },
  // 12. Women's Fashion - Cashmere Knit Sweater
  {
    name: 'Nordic Cashmere Blend Relaxed Knit Sweater',
    slug: 'nordic-cashmere-blend-relaxed-knit-sweater',
    brand: 'Silk & Bloom',
    category: "Women's Fashion",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    stock: 19,
    rating: 4.6,
    numReviews: 67,
    featured: false,
    trending: false,
    colors: ['Cream Ivory', 'Soft Sage', 'Blush Rose'],
    sizes: ['S', 'M', 'L'],
    description: 'Buttery-soft ribbed knit sweater combining pure Mongolian cashmere with fine merino wool for cozy thermal insulation and zero itchiness.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Yarn', value: '70% Merino Wool, 30% Mongolian Cashmere' },
      { key: 'Neckline', value: 'Mock Turtleneck' }
    ]
  },

  // 13. Home & Living - Coffee Maker
  {
    name: 'Artisan Pour-Over Drip Coffee Maker with Thermal Carafe',
    slug: 'artisan-pour-over-drip-coffee-maker',
    brand: 'BaristaCraft',
    category: 'Home & Living',
    price: 6499,
    originalPrice: 8999,
    discount: 28,
    stock: 14,
    rating: 4.9,
    numReviews: 92,
    featured: true,
    trending: true,
    colors: ['Matte Black', 'Brushed Copper'],
    sizes: ['1.25L (10 Cups)'],
    description: 'SCA certified gold-cup standard precision brewer with copper heating element, showerhead water saturation, and vacuum insulated stainless steel carafe.',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Brew Temp', value: '92°C - 96°C Optimal Extraction' },
      { key: 'Capacity', value: '1.25 Liters' },
      { key: 'Auto-Shutoff', value: '40 Minutes Safety Timer' }
    ]
  },
  // 14. Home & Living - Desk Lamp
  {
    name: 'Lumina Touch Sensor Architectural LED Desk Lamp',
    slug: 'lumina-touch-sensor-architectural-led-desk-lamp',
    brand: 'Lumina',
    category: 'Home & Living',
    price: 2999,
    originalPrice: 4299,
    discount: 30,
    stock: 28,
    rating: 4.5,
    numReviews: 61,
    featured: false,
    trending: true,
    colors: ['Anodized Space Silver', 'Piano Black'],
    sizes: ['Adjustable Dual-Arm'],
    description: 'Glare-free flickerless desk lamp featuring 5 color temperature presets, stepless sliding dimmer, 10W wireless smartphone charger pad, and dual pivot arm.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Brightness', value: '1000 Lumens (CRI > 95)' },
      { key: 'Wireless Charging', value: 'Qi 10W Fast Pad' },
      { key: 'Power Consumption', value: '14W Maximum' }
    ]
  },
  // 15. Home & Living - Ultrasonic Aroma Diffuser
  {
    name: 'Zenith Ceramic Ultrasonic Essential Oil Diffuser',
    slug: 'zenith-ceramic-ultrasonic-essential-oil-diffuser',
    brand: 'Lumina',
    category: 'Home & Living',
    price: 2199,
    originalPrice: 3199,
    discount: 31,
    stock: 32,
    rating: 4.7,
    numReviews: 53,
    featured: false,
    trending: false,
    colors: ['Terracotta Stone', 'Matte White', 'Charcoal Grey'],
    sizes: ['300ml'],
    description: 'Handcrafted stoneware ceramic cover with whisper-quiet ultrasonic atomization and warm ambient breathing LED glow for deep relaxation.',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Tank Volume', value: '300 ml (Covers 350 sq ft)' },
      { key: 'Run Time', value: '8 hours continuous / 16 hours intermittent' }
    ]
  },
  // 16. Home & Living - Ergonomic Desk Chair Pillow
  {
    name: 'PostureCare Memory Foam Ergonomic Lumbar Support Cushion',
    slug: 'posturecare-memory-foam-ergonomic-lumbar-support',
    brand: 'ErgoComfort',
    category: 'Home & Living',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    stock: 50,
    rating: 4.6,
    numReviews: 120,
    featured: false,
    trending: false,
    colors: ['Cooling Gel Mesh Black', 'Heather Grey'],
    sizes: ['Universal Ergonomic'],
    description: 'High-density orthopedic memory foam with cooling gel layer contoured to relieve lower back pressure during long remote work sessions.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Core', value: '100% Pure Therapeutic Memory Foam' },
      { key: 'Cover', value: 'Washable Breathable 3D Air Mesh' }
    ]
  },

  // 17. Beauty - Perfume
  {
    name: 'Noir Velvet Eau De Parfum Luxury Fragrance 100ml',
    slug: 'noir-velvet-eau-de-parfum-100ml',
    brand: 'Maison Nova',
    category: 'Beauty',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    stock: 16,
    rating: 4.8,
    numReviews: 87,
    featured: true,
    trending: true,
    colors: ['Smoked Glass Bottle'],
    sizes: ['50ml', '100ml'],
    description: 'An intoxicating oriental woody unisex fragrance opening with pink pepper and bergamot, leading to smoky oud, damascus rose, and amber bourbon.',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Concentration', value: 'Eau de Parfum (20% Oil)' },
      { key: 'Longevity', value: '10-12 hours' },
      { key: 'Scent Family', value: 'Woody Oriental Amber' }
    ]
  },
  // 18. Beauty - Skincare Set
  {
    name: 'Radiance Botanical Hydration Skincare 4-Piece Ritual Kit',
    slug: 'radiance-botanical-hydration-skincare-ritual-kit',
    brand: 'Botanique Pure',
    category: 'Beauty',
    price: 3299,
    originalPrice: 4799,
    discount: 31,
    stock: 24,
    rating: 4.9,
    numReviews: 104,
    featured: false,
    trending: true,
    colors: ['Rose Gold Packaging'],
    sizes: ['4-Item Kit'],
    description: 'Comprehensive day and night clean regimen: Gentle Foaming Cleanser, Niacinamide Balancing Toner, 2% Hyaluronic Acid Serum, and Ceramide Cloud Cream.',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Skin Type', value: 'All skin types, sensitive skin safe' },
      { key: 'Formulation', value: 'Vegan, Paraben-Free, Cruelty-Free' }
    ]
  },
  // 19. Beauty - Jade Face Roller & Gua Sha
  {
    name: 'Pure Himalayan Xiuyan Jade Roller and Sculpting Gua Sha Set',
    slug: 'pure-himalayan-jade-roller-gua-sha-set',
    brand: 'Botanique Pure',
    category: 'Beauty',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    stock: 45,
    rating: 4.6,
    numReviews: 78,
    featured: false,
    trending: false,
    colors: ['Deep Jade Green', 'Rose Quartz'],
    sizes: ['Complete Set'],
    description: '100% authentic natural healing stone tool designed to encourage lymphatic drainage, soothe morning puffiness, and boost serum absorption.',
    images: [
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-0091d3d63b27?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Material', value: 'Natural Himalayan Mineral Stone' },
      { key: 'Frame', value: 'Welded noiseless zinc alloy gold frame' }
    ]
  },

  // 20. Sports - Running Shoes
  {
    name: 'Velocity Carbon-Plate Pro Marathon Running Shoes',
    slug: 'velocity-carbon-plate-pro-marathon-running-shoes',
    brand: 'Stratus Sports',
    category: 'Sports',
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    stock: 20,
    rating: 4.8,
    numReviews: 135,
    featured: true,
    trending: true,
    colors: ['Volt Neon', 'Sonic White', 'Stealth Carbon'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    description: 'Designed for personal records. Full-length spoon-shaped carbon fiber plate nestled within ultra-resilient nitrogen-infused supercritical foam midsole.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Midsole Drop', value: '8mm' },
      { key: 'Weight', value: '198g (Size UK 8)' },
      { key: 'Surface', value: 'Road / Track / Competition' }
    ]
  },
  // 21. Sports - Yoga Mat
  {
    name: 'ProGrip High-Density Eco-Friendly Natural Rubber Yoga Mat',
    slug: 'progrip-high-density-natural-rubber-yoga-mat',
    brand: 'Stratus Sports',
    category: 'Sports',
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    stock: 30,
    rating: 4.7,
    numReviews: 69,
    featured: false,
    trending: true,
    colors: ['Midnight Teal', 'Plum Purple', 'Slate Charcoal'],
    sizes: ['6mm Thick / 72x26 inch'],
    description: '6mm premium cushioning with laser-etched body alignment lines. Non-slip polyurethane top coat delivers unbeatable grip even during heavy sweat sessions.',
    images: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Thickness', value: '6mm Heavy-Duty Joint Support' },
      { key: 'Material', value: 'Tree Rubber Base + Wet-Grip PU' }
    ]
  },
  // 22. Sports - Sports Water Bottle
  {
    name: 'HydroShield Vacuum Insulated Stainless Steel Sports Bottle 1L',
    slug: 'hydroshield-vacuum-insulated-sports-bottle-1l',
    brand: 'Stratus Sports',
    category: 'Sports',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    stock: 60,
    rating: 4.6,
    numReviews: 154,
    featured: false,
    trending: false,
    colors: ['Cobalt Matte', 'Military Green', 'Arctic White'],
    sizes: ['1000ml (34oz)'],
    description: 'Triple-walled 18/8 food-grade stainless steel keeps water ice cold for 24 hours or steaming hot for 12 hours. Includes leakproof sports straw lid.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '1000ml (1 Liter)' },
      { key: 'Insulation', value: '24h Cold / 12h Hot TempLock' }
    ]
  },
  // 23. Sports - Adjustable Dumbbells
  {
    name: 'QuickLock Adjustable Cast Iron Dumbbell Set 24kg',
    slug: 'quicklock-adjustable-dumbbell-set-24kg',
    brand: 'IronForge',
    category: 'Sports',
    price: 9999,
    originalPrice: 13999,
    discount: 29,
    stock: 10,
    rating: 4.9,
    numReviews: 45,
    featured: true,
    trending: false,
    colors: ['Industrial Black & Red'],
    sizes: ['Single (2.5kg - 24kg)'],
    description: 'Replaces 15 pairs of dumbbells with a single turn of the dial. High-durability laser cut steel plates coated with quiet thermoplastic casing.',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Weight Increment', value: '2.5kg to 24kg in 15 increments' },
      { key: 'Mechanism', value: 'Gear-lock dual twist dial' }
    ]
  },

  // 24. Accessories - Laptop Backpack
  {
    name: 'Vanguard Water-Resistant Commuter Laptop Backpack 25L',
    slug: 'vanguard-water-resistant-commuter-laptop-backpack',
    brand: 'NomadGear',
    category: 'Accessories',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    stock: 35,
    rating: 4.7,
    numReviews: 112,
    featured: true,
    trending: true,
    colors: ['Charcoal Black', 'Heather Stone', 'Navy Heather'],
    sizes: ['25L (Fits 16-inch laptops)'],
    description: 'Weatherproof 900D ballistic nylon exterior, magnetic Fidlock buckle, hidden RFID passport pocket, and suspended velvet laptop compartment.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '25 Liters expandable' },
      { key: 'Laptop Compartment', value: 'Dedicated padded up to 16.2 inch' },
      { key: 'Waterproof', value: 'DWR Coated 900D Cordura' }
    ]
  },
  // 25. Accessories - Chronograph Watch
  {
    name: 'Heritage Chronograph Sapphire Leather Watch',
    slug: 'heritage-chronograph-sapphire-leather-watch',
    brand: 'Kronos',
    category: 'Accessories',
    price: 11999,
    originalPrice: 16999,
    discount: 29,
    stock: 12,
    rating: 4.8,
    numReviews: 56,
    featured: true,
    trending: false,
    colors: ['Silver Sunburst / Brown Leather', 'Obsidian Black / Black Leather'],
    sizes: ['41mm Dial'],
    description: 'Japanese meca-quartz movement combining quartz reliability with mechanical sweeping chronograph hand, framed inside scratchproof domed sapphire crystal.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Movement', value: 'Seiko VK64 Meca-Quartz Chrono' },
      { key: 'Glass', value: 'Double Domed AR Sapphire' },
      { key: 'Strap', value: 'Top-Grain Italian Horween Leather' }
    ]
  },
  // 26. Accessories - Polarized Sunglasses
  {
    name: 'Aviator Titanium Polarized UV400 Sunglasses',
    slug: 'aviator-titanium-polarized-uv400-sunglasses',
    brand: 'Solara',
    category: 'Accessories',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 25,
    rating: 4.5,
    numReviews: 73,
    featured: false,
    trending: true,
    colors: ['Gold / Forest Green Lens', 'Gunmetal / Smoke Grey Lens'],
    sizes: ['58mm Classic'],
    description: 'Featherlight beta-titanium frame weighing just 18g with 7-layer glare-eliminating polarized TAC lenses and hydrophobic anti-scratch coating.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Protection', value: '100% UV400 UVA/UVB Block' },
      { key: 'Frame Material', value: 'Beta-Titanium Elastic Memory Alloy' }
    ]
  },
  // 27. Accessories - Minimalist Cardholder Wallet
  {
    name: 'Aero Slim RFID-Blocking Carbon Fiber Wallet',
    slug: 'aero-slim-rfid-blocking-carbon-fiber-wallet',
    brand: 'NomadGear',
    category: 'Accessories',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    stock: 55,
    rating: 4.6,
    numReviews: 124,
    featured: false,
    trending: false,
    colors: ['Matte Forged Carbon', 'Gunmetal Aluminium'],
    sizes: ['Slim Cardholder (Up to 12 cards)'],
    description: 'Front-pocket friendly minimalist cardholder with integrated spring cash strap and military-grade dual-plate RFID wireless theft protection.',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '1 to 12 credit cards + 8 folded cash bills' },
      { key: 'Shielding', value: 'Certified RFID / NFC 13.56 MHz block' }
    ]
  },

  // 28. Fashion - Classic Canvas Sneakers
  {
    name: 'Retro 80s Low-Top Vulcanized Canvas Sneakers',
    slug: 'retro-80s-low-top-vulcanized-canvas-sneakers',
    brand: 'UrbanCraft',
    category: 'Fashion',
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    stock: 40,
    rating: 4.5,
    numReviews: 88,
    featured: false,
    trending: true,
    colors: ['Off-White Ecru', 'Vintage Navy', 'Classic Black'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    description: 'Timeless low-profile silhouette with 14oz dense duck canvas, cushioned Ortholite memory insole, and textured natural gum rubber waffle outsole.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Upper', value: '100% Breathable 14oz Heavy Cotton Canvas' },
      { key: 'Sole', value: 'Vulcanized Natural Gum Rubber' }
    ]
  },
  // 29. Fashion - Cashmere Wool Scarf
  {
    name: 'Highland Plaid 100% Pure Cashmere Fringed Scarf',
    slug: 'highland-plaid-pure-cashmere-fringed-scarf',
    brand: 'Atelier Mode',
    category: 'Fashion',
    price: 2899,
    originalPrice: 3999,
    discount: 28,
    stock: 25,
    rating: 4.8,
    numReviews: 36,
    featured: false,
    trending: false,
    colors: ['Camel Stewart Tartan', 'Charcoal Ombre'],
    sizes: ['200cm x 35cm'],
    description: 'Hand-brushed cashmere woven in traditional Scottish mills with teasel finishing for maximum luster, exceptional heat trapping, and delicate fringed hems.',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Dimensions', value: '200cm x 35cm (including fringe)' },
      { key: 'Fiber', value: 'Grade A Grade Underfleece Cashmere' }
    ]
  },
  // 30. Electronics - Wireless ANC Earbuds
  {
    name: 'NovaPods Pro True Wireless Earbuds with Spatial Audio',
    slug: 'novapods-pro-true-wireless-earbuds',
    brand: 'NovaTech',
    category: 'Electronics',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    stock: 35,
    rating: 4.7,
    numReviews: 160,
    featured: true,
    trending: true,
    colors: ['Gloss White', 'Matte Space Black'],
    sizes: ['S / M / L silicone tips included'],
    description: 'Adaptive active noise cancellation with transparency mode, personalized dynamic head tracking spatial audio, wireless charging case, and IPX5 sweat resistance.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Playtime', value: '8 hours earbuds / 32 hours with case' },
      { key: 'Wireless Charging', value: 'Qi wireless + USB-C fast charge' },
      { key: 'Codecs', value: 'LDAC, AAC, SBC' }
    ]
  },
  // 31. Home & Living - Minimalist Ceramic Table Vase
  {
    name: 'Nordic Arch Textured Matte Ceramic Floral Vase',
    slug: 'nordic-arch-textured-matte-ceramic-vase',
    brand: 'Lumina',
    category: 'Home & Living',
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    stock: 22,
    rating: 4.6,
    numReviews: 44,
    featured: false,
    trending: false,
    colors: ['Sandstone Beige', 'Dusty Terracotta'],
    sizes: ['Height 24cm'],
    description: 'Sculptural architectural vessel hand-thrown in high-fire earthenware clay with a soothing tactile coarse matte finish, ideal for pampas grass and dry floristry.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Material', value: 'High-fire ceramic stoneware' },
      { key: 'Finish', value: 'Matte unglazed mineral slip' }
    ]
  },
  // 32. Beauty - Botanical Hair Growth Serum
  {
    name: 'Trichology Peptide Densifying Hair Growth Serum 60ml',
    slug: 'trichology-peptide-densifying-hair-growth-serum',
    brand: 'Botanique Pure',
    category: 'Beauty',
    price: 1899,
    originalPrice: 2599,
    discount: 27,
    stock: 40,
    rating: 4.7,
    numReviews: 89,
    featured: false,
    trending: true,
    colors: ['Amber Dropper Bottle'],
    sizes: ['60ml (2 fl oz)'],
    description: 'Clinically tested water-based lightweight leave-in scalp treatment powered by Redensyl, Procapil, Rosemary extract, and copper tripeptide-1 to stimulate follicle density.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Active Actives', value: '3% Redensyl + 2% Procapil + Copper Peptides' },
      { key: 'Application', value: 'Nightly scalp pipette drops' }
    ]
  }
];

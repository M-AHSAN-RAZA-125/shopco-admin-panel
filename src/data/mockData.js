export const initialProducts = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Canceling Headphones',
    sku: 'TECH-WNC-01',
    category: 'Electronics',
    price: 249.99,
    stock: 45,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.'
  },
  {
    id: 'prod-2',
    name: 'Minimalist Mechanical Keyboard',
    sku: 'TECH-MK-02',
    category: 'Electronics',
    price: 129.50,
    stock: 18,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
    description: 'Hot-swappable mechanical keyboard with RGB backlighting and PBT keycaps.'
  },
  {
    id: 'prod-3',
    name: 'Ultra-Slim Smartwatch Pro',
    sku: 'TECH-SWP-03',
    category: 'Accessories',
    price: 199.00,
    stock: 6,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
    description: 'Water-resistant smartwatch with AMOLED display, heart rate and SpO2 sensors.'
  },
  {
    id: 'prod-4',
    name: 'Leather Everyday Backpack',
    sku: 'FASH-LEB-04',
    category: 'Fashion',
    price: 89.95,
    stock: 24,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&auto=format&fit=crop&q=80',
    description: 'Water-resistant full-grain leather backpack with dedicated 15-inch laptop sleeve.'
  },
  {
    id: 'prod-5',
    name: 'Ergonomic Mesh Desk Chair',
    sku: 'HOME-EMC-05',
    category: 'Home & Living',
    price: 319.00,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=150&auto=format&fit=crop&q=80',
    description: 'High-back ergonomic mesh office chair with 3D armrests and lumbar support.'
  },
  {
    id: 'prod-6',
    name: 'Titanium Polarized Sunglasses',
    sku: 'ACC-TPS-06',
    category: 'Accessories',
    price: 145.00,
    stock: 32,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&auto=format&fit=crop&q=80',
    description: 'Lightweight titanium frame sunglasses with UV400 polarized crystal lenses.'
  },
  {
    id: 'prod-7',
    name: 'Breathable Running Shoes',
    sku: 'SPRT-BRS-07',
    category: 'Sports',
    price: 110.00,
    stock: 4,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
    description: 'Engineered mesh running shoes with responsive foam cushioning for road racing.'
  },
  {
    id: 'prod-8',
    name: 'Ceramic Pour-Over Coffee Dripper',
    sku: 'HOME-CCD-08',
    category: 'Home & Living',
    price: 42.00,
    stock: 58,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
    description: 'Handcrafted ceramic coffee dripper for artisanal single-origin brew extraction.'
  }
];

export const initialOrders = [
  {
    id: 'ORD-9421',
    customerName: 'Sophia Montgomery',
    customerEmail: 'sophia.montgomery@example.com',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
    date: '2025-05-12',
    items: [
      { productId: 'prod-1', productName: 'Wireless Noise-Canceling Headphones', price: 249.99, quantity: 1 },
      { productId: 'prod-3', productName: 'Ultra-Slim Smartwatch Pro', price: 199.00, quantity: 1 }
    ],
    subtotal: 448.99,
    tax: 35.92,
    shippingFee: 0,
    totalAmount: 484.91,
    paymentMethod: 'Credit Card',
    status: 'Delivered'
  },
  {
    id: 'ORD-9420',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    shippingAddress: '120 Market Street, Suite 400, San Francisco, CA 94105',
    date: '2025-05-12',
    items: [
      { productId: 'prod-2', productName: 'Minimalist Mechanical Keyboard', price: 129.50, quantity: 2 }
    ],
    subtotal: 259.00,
    tax: 20.72,
    shippingFee: 0,
    totalAmount: 279.72,
    paymentMethod: 'PayPal',
    status: 'Shipped'
  },
  {
    id: 'ORD-9419',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.org',
    shippingAddress: '488 Broadway, New York, NY 10013',
    date: '2025-05-11',
    items: [
      { productId: 'prod-4', productName: 'Leather Everyday Backpack', price: 89.95, quantity: 1 },
      { productId: 'prod-6', productName: 'Titanium Polarized Sunglasses', price: 145.00, quantity: 1 }
    ],
    subtotal: 234.95,
    tax: 18.80,
    shippingFee: 0,
    totalAmount: 253.75,
    paymentMethod: 'Credit Card',
    status: 'Pending'
  },
  {
    id: 'ORD-9418',
    customerName: 'Liam Chen',
    customerEmail: 'liam.chen@nexusstudio.ca',
    shippingAddress: '88 Harbour Street, Toronto, ON M5J 1V3',
    date: '2025-05-10',
    items: [
      { productId: 'prod-7', productName: 'Breathable Running Shoes', price: 110.00, quantity: 1 }
    ],
    subtotal: 110.00,
    tax: 8.80,
    shippingFee: 15.00,
    totalAmount: 133.80,
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered'
  },
  {
    id: 'ORD-9417',
    customerName: 'Isabella Davis',
    customerEmail: 'isabella.d@cloudservices.com',
    shippingAddress: '2300 West End Ave, Nashville, TN 37203',
    date: '2025-05-09',
    items: [
      { productId: 'prod-8', productName: 'Ceramic Pour-Over Coffee Dripper', price: 42.00, quantity: 2 }
    ],
    subtotal: 84.00,
    tax: 6.72,
    shippingFee: 15.00,
    totalAmount: 105.72,
    paymentMethod: 'Credit Card',
    status: 'Cancelled'
  },
  {
    id: 'ORD-9416',
    customerName: 'Julian Hayes',
    customerEmail: 'julian.hayes@apexlogistics.com',
    shippingAddress: '1500 Louisiana St, Houston, TX 77002',
    date: '2025-05-08',
    items: [
      { productId: 'prod-1', productName: 'Wireless Noise-Canceling Headphones', price: 249.99, quantity: 1 }
    ],
    subtotal: 249.99,
    tax: 20.00,
    shippingFee: 0,
    totalAmount: 269.99,
    paymentMethod: 'PayPal',
    status: 'Delivered'
  }
];

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@admin.com',
    role: 'Admin',
    joinedDate: '2023-01-15',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@store.com',
    role: 'Standard User',
    joinedDate: '2023-04-20',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Sophia Montgomery',
    email: 'sophia.montgomery@example.com',
    role: 'Standard User',
    joinedDate: '2023-08-11',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'm.vance@techcorp.io',
    role: 'Standard User',
    joinedDate: '2023-09-03',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@designlab.org',
    role: 'Standard User',
    joinedDate: '2023-11-28',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-6',
    name: 'David Kim',
    email: 'david.kim@retailer.net',
    role: 'Admin',
    joinedDate: '2024-02-14',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-7',
    name: 'Rachel Green',
    email: 'rachel.g@fashionhq.com',
    role: 'Standard User',
    joinedDate: '2024-03-01',
    status: 'Suspended',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  }
];

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 42300, orders: 185 },
  { month: 'Feb', revenue: 48900, orders: 210 },
  { month: 'Mar', revenue: 53200, orders: 234 },
  { month: 'Apr', revenue: 59800, orders: 260 },
  { month: 'May', revenue: 67400, orders: 295 },
  { month: 'Jun', revenue: 72100, orders: 312 },
  { month: 'Jul', revenue: 69800, orders: 288 },
  { month: 'Aug', revenue: 78500, orders: 340 },
  { month: 'Sep', revenue: 84200, orders: 365 },
  { month: 'Oct', revenue: 91600, orders: 395 },
  { month: 'Nov', revenue: 108400, orders: 470 },
  { month: 'Dec', revenue: 124800, orders: 540 }
];

export const categoryBreakdownData = [
  { name: 'Electronics', value: 45, color: '#3b82f6' },
  { name: 'Accessories', value: 20, color: '#10b981' },
  { name: 'Fashion', value: 15, color: '#8b5cf6' },
  { name: 'Home & Living', value: 12, color: '#f59e0b' },
  { name: 'Sports', value: 8, color: '#ec4899' }
];

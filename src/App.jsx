
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import AdminPage from './AdminPage'
import AdminLogin from './AdminLogin'
import OrderTracking from './OrderTracking'

const fallbackProducts = [
  { id: 1, name: 'MCB 1P 20A', category: 'Electrical', subcategory: 'MCB & Breakers', price: 450, oldPrice: 520, icon: '⚡', rating: 4.8, stock: 20 },
  { id: 2, name: 'Universal Socket 16A', category: 'Electrical', subcategory: 'Switch & Socket', price: 280, oldPrice: 350, icon: '🔌', rating: 4.7, stock: 20 },
  { id: 3, name: 'Magnetic Contactor 18A', category: 'Electrical', subcategory: 'Industrial Control', price: 1250, oldPrice: 1450, icon: '⚙️', rating: 4.9, stock: 15 },
  { id: 4, name: 'Digital Multimeter', category: 'Electrical', subcategory: 'Tools', price: 950, oldPrice: 1150, icon: '🛠️', rating: 4.6, stock: 15 },

  { id: 5, name: 'Arduino UNO R3', category: 'Robotics', subcategory: 'Microcontrollers', price: 850, oldPrice: 1000, icon: '🤖', rating: 4.9, stock: 20 },
  { id: 6, name: 'ESP32 Development Board', category: 'Robotics', subcategory: 'Microcontrollers', price: 780, oldPrice: 900, icon: '🧠', rating: 4.9, stock: 20 },
  { id: 7, name: 'SG90 Servo Motor', category: 'Robotics', subcategory: 'Motors', price: 180, oldPrice: 220, icon: '⚙️', rating: 4.7, stock: 30 },
  { id: 8, name: 'L298N Motor Driver', category: 'Robotics', subcategory: 'Motor Drivers', price: 280, oldPrice: 350, icon: '🔧', rating: 4.8, stock: 20 },

  { id: 9, name: 'HC-SR04 Ultrasonic Sensor', category: 'Sensors', subcategory: 'Distance Sensor', price: 180, oldPrice: 230, icon: '📡', rating: 4.8, stock: 30 },
  { id: 10, name: 'PIR Motion Sensor', category: 'Sensors', subcategory: 'Motion Sensor', price: 150, oldPrice: 190, icon: '👁️', rating: 4.6, stock: 30 },
  { id: 11, name: 'DHT22 Temperature Sensor', category: 'Sensors', subcategory: 'Temperature & Humidity', price: 420, oldPrice: 500, icon: '🌡️', rating: 4.8, stock: 20 },
  { id: 12, name: 'IR Obstacle Sensor', category: 'Sensors', subcategory: 'IR Sensor', price: 120, oldPrice: 160, icon: '📶', rating: 4.7, stock: 30 },

  { id: 13, name: '5V Relay Module', category: 'Electronics', subcategory: 'Relay Modules', price: 120, oldPrice: 150, icon: '🔋', rating: 4.7, stock: 30 },
  { id: 14, name: '0.96 inch OLED Display', category: 'Electronics', subcategory: 'Display', price: 320, oldPrice: 400, icon: '🖥️', rating: 4.8, stock: 20 },
  { id: 15, name: 'RFID RC522 Module', category: 'Electronics', subcategory: 'RFID', price: 220, oldPrice: 280, icon: '💳', rating: 4.7, stock: 20 },
  { id: 16, name: 'Buck Converter LM2596', category: 'Electronics', subcategory: 'Power Module', price: 110, oldPrice: 140, icon: '🔋', rating: 4.6, stock: 30 },

  { id: 17, name: 'Industrial Proximity Sensor', category: 'Automation', subcategory: 'Proximity Sensor', price: 650, oldPrice: 750, icon: '📡', rating: 4.8, stock: 15 },
  { id: 18, name: 'PLC Controller', category: 'Automation', subcategory: 'PLC', price: 4800, oldPrice: 5500, icon: '🏭', rating: 4.9, stock: 10 },
  { id: 19, name: 'VFD Motor Drive', category: 'Automation', subcategory: 'VFD', price: 6800, oldPrice: 7500, icon: '⚙️', rating: 4.8, stock: 8 },
  { id: 20, name: 'Digital PID Controller', category: 'Automation', subcategory: 'Controller', price: 1850, oldPrice: 2200, icon: '🎛️', rating: 4.7, stock: 12 },
]

const categories = [
  { name: 'Electrical', icon: '⚡', description: 'MCB, Switch, Socket & Tools' },
  { name: 'Electronics', icon: '🔌', description: 'Modules & Components' },
  { name: 'Robotics', icon: '🤖', description: 'Robotics Parts & Motors' },
  { name: 'Microcontrollers', icon: '🧠', description: 'Arduino, ESP32 & More' },
  { name: 'Sensors', icon: '📡', description: 'Sensors & Detection' },
  { name: 'Automation', icon: '🏭', description: 'PLC, VFD & Control' },
]

const districts = [
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Barishal',
  'Bhola',
  'Bogura',
  'Brahmanbaria',
  'Chandpur',
  'Chattogram',
  'Chuadanga',
  'Cox’s Bazar',
  'Cumilla',
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokathi',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachhari',
  'Khulna',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
  'Thakurgaon',
]

const getDeliveryCharge = (district) => {
  if (!district) return 0
  return district === 'Dhaka' ? 80 : 120
}

const formatPrice = (price) =>
  Number(price || 0).toLocaleString('en-BD')

function ProductImage({ product }) {
  const imageUrl =
    product.image_url ||
    product.image ||
    product.imageUrl ||
    product.photo_url

  const [failed, setFailed] = useState(false)

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={product.name}
        onError={() => setFailed(true)}
        className="w-full h-full object-contain p-3 sm:p-5 group-hover:scale-110 transition duration-500"
      />
    )
  }

  return (
    <span className="text-6xl sm:text-8xl group-hover:scale-125 transition duration-500">
      {product.icon || '📦'}
    </span>
  )
}
function AdminRoute() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      setSession(data.session || null)
      setChecking(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setChecking(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse">
            ⚡
          </div>

          <p className="font-bold text-slate-500 mt-4">
            Checking Admin Access...
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <AdminLogin
        onLogin={(user) => {
          setSession({
            user,
          })
        }}
      />
    )
  }

  return <AdminPage />
}
function ShopApp() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
const [sortBy, setSortBy] = useState('popular')
const [stockOnly, setStockOnly] = useState(false)
  const [products, setProducts] = useState(fallbackProducts)
  
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    district: '',
    address: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [paymentNumber, setPaymentNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoadingProducts(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (!error && data && data.length > 0) {
      const mapped = data.map((item) => ({
        ...item,
        oldPrice: item.old_price ?? item.oldPrice ?? item.price,
        price: Number(item.price || 0),
        stock: Number(item.stock ?? 0),
        rating: Number(item.rating || 4.8),
      }))

      setProducts(mapped)
    }

    setLoadingProducts(false)
  }

  const addToCart = (product) => {
    if (Number(product.stock || 0) <= 0) return

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        if (existing.quantity >= Number(product.stock || 0)) {
          return current
        }

        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ]
    })

    setCartOpen(true)
  }

  const increaseQuantity = (productId) => {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== productId) return item

        if (item.quantity >= Number(item.stock || 0)) {
          return item
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        }
      })
    )
  }

  const decreaseQuantity = (productId) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter((item) => item.id !== productId)
    )
  }

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase().trim()

    return products.filter((product) => {
      const matchesSearch =
        !text ||
        product.name?.toLowerCase().includes(text) ||
        product.category?.toLowerCase().includes(text) ||
        product.subcategory?.toLowerCase().includes(text)

      const matchesCategory =
        category === 'All' ||
        product.category === category ||
        product.subcategory === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  )

  const deliveryCharge = getDeliveryCharge(customer.district)

  const cartTotal = cartSubtotal + deliveryCharge

  const openCheckout = () => {
    setCartOpen(false)
    setOrderError('')
    setCheckoutOpen(true)
  }

  const handleCustomerChange = (field, value) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)

    if (method === 'Cash on Delivery') {
      setPaymentNumber('')
      setTransactionId('')
    }
  }

  const generateOrderNumber = () => {
    const random = Math.floor(
      100000 + Math.random() * 900000
    )

    return `ZAT-${random}`
  }

  const placeOrder = async (e) => {
    e.preventDefault()

    setOrderError('')

    if (cart.length === 0) {
      setOrderError('Your cart is empty.')
      return
    }

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.district ||
      !customer.address.trim()
    ) {
      setOrderError('Please complete all customer information.')
      return
    }

    if (
      paymentMethod !== 'Cash on Delivery' &&
      (!paymentNumber.trim() || !transactionId.trim())
    ) {
      setOrderError(
        'Please enter Payment Number and Transaction ID.'
      )
      return
    }

    setPlacingOrder(true)

    const orderNumber = generateOrderNumber()

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }))

    const { data, error } = await supabase.rpc(
      'create_order_and_reduce_stock',
      {
        p_order_number: orderNumber,
        p_customer_name: customer.name.trim(),
        p_phone: customer.phone.trim(),
        p_district: customer.district,
        p_address: customer.address.trim(),
        p_payment_method: paymentMethod,
        p_payment_number:
          paymentMethod === 'Cash on Delivery'
            ? null
            : paymentNumber.trim(),
        p_transaction_id:
          paymentMethod === 'Cash on Delivery'
            ? null
            : transactionId.trim(),
        p_subtotal: cartSubtotal,
        p_delivery_charge: deliveryCharge,
        p_total: cartTotal,
        p_items: items,
      }
    )

    setPlacingOrder(false)

    if (error) {
      console.error(error)
      setOrderError(
        error.message ||
          'Order could not be placed. Please try again.'
      )
      return
    }

    setOrderSuccess({
      orderNumber,
      total: cartTotal,
      paymentMethod,
    })

    setCart([])
    setCheckoutOpen(false)

    setCustomer({
      name: '',
      phone: '',
      district: '',
      address: '',
    })

    setPaymentMethod('Cash on Delivery')
    setPaymentNumber('')
    setTransactionId('')

    await loadProducts()
  }

  if (adminOpen) {
    return (
      <div>
        <button
          onClick={() => setAdminOpen(false)}
          className="fixed top-4 left-4 z-[200] bg-white shadow-lg px-4 py-2 rounded-xl font-bold"
        >
          ← Back to Store
        </button>

        <AdminPage />
      </div>
    )
  }

  if (trackingOpen) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <button
            onClick={() => setTrackingOpen(false)}
            className="bg-white border border-slate-200 px-5 py-3 rounded-xl font-bold hover:border-blue-500"
          >
            ← Back to Store
          </button>
        </div>

        <OrderTracking />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex items-center justify-between gap-5">

            <button
              onClick={() => {
                setCategory('All')
                setSearch('')
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-200">
                ZA
              </div>

              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-black">
                  ZA<span className="text-blue-600"> TechMart</span>
                </h1>

                <p className="hidden sm:block text-[9px] font-bold tracking-[0.2em] text-slate-400">
                  TECH • ELECTRICAL • ROBOTICS
                </p>
              </div>
            </button>

            {/* SEARCH */}
            <div className="hidden md:block flex-1 max-w-xl relative">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Arduino, ESP32, Sensor, MCB..."
                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔎
              </span>

            </div>

            {/* NAV */}
            <nav className="hidden lg:flex gap-5 text-sm font-bold text-slate-600">

              <button
                onClick={() => setCategory('All')}
                className="hover:text-blue-600"
              >
                Home
              </button>

              <button
                onClick={() => setCategory('Electrical')}
                className="hover:text-blue-600"
              >
                Electrical
              </button>

              <button
                onClick={() => setCategory('Robotics')}
                className="hover:text-blue-600"
              >
                Robotics
              </button>

              <button
                onClick={() => setCategory('Sensors')}
                className="hover:text-blue-600"
              >
                Sensors
              </button>

              <button
                onClick={() => setTrackingOpen(true)}
                className="hover:text-blue-600"
              >
                Track Order
              </button>

            </nav>

            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200"
            >
              🛒

              <span className="hidden sm:inline ml-2">
                Cart
              </span>

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              )}
            </button>

          </div>

          {/* MOBILE SEARCH */}
          <div className="md:hidden relative mt-4">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              🔎
            </span>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -right-32 -top-32" />
        <div className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -left-32 bottom-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 border border-blue-400/20 bg-blue-500/10 rounded-full px-4 py-2">

                <span className="w-2 h-2 rounded-full bg-blue-400" />

                <span className="text-sm font-bold text-blue-300">
                  BANGLADESH'S TECH STORE
                </span>

              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mt-6">
                Build.
                <span className="block text-blue-400">
                  Create.
                </span>
                Innovate.
              </h2>

              <p className="mt-6 text-lg text-slate-300 max-w-xl leading-8">
                Electrical products, electronics components,
                robotics parts, sensors, microcontrollers and
                industrial automation solutions.
              </p>

              <div className="flex flex-wrap gap-4 mt-9">

                <button
                  onClick={() => {
                    setCategory('All')

                    document
                      .getElementById('products')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      })
                  }}
                  className="bg-blue-600 hover:bg-blue-500 px-7 py-4 rounded-xl font-black transition shadow-xl shadow-blue-900/40"
                >
                  Explore Products →
                </button>

                <button
                  onClick={() => {
                    setCategory('Robotics')

                    document
                      .getElementById('products')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      })
                  }}
                  className="border border-slate-700 hover:border-slate-500 px-7 py-4 rounded-xl font-bold transition"
                >
                  🤖 Robotics
                </button>

              </div>

              <div className="flex flex-wrap gap-7 mt-10 text-sm text-slate-400">
                <span>✓ Quality Products</span>
                <span>✓ Competitive Price</span>
                <span>✓ Expert Support</span>
              </div>

            </div>

            {/* HERO VISUAL */}
            <div className="relative flex justify-center">

              <div className="relative w-[330px] h-[330px] sm:w-[430px] sm:h-[430px]">

                <div className="absolute inset-5 rounded-full border border-blue-500/20 bg-blue-500/5" />

                <div className="absolute inset-14 rounded-full border border-cyan-500/20 bg-cyan-500/5" />

                <div className="absolute inset-24 rounded-full border border-blue-500/20" />

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center rotate-3">

                  <div className="text-5xl font-black text-blue-600">
                    ZA
                  </div>

                  <div className="text-slate-900 font-black text-sm">
                    TECHMART
                  </div>

                </div>

                <div className="absolute top-4 left-2 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl -rotate-6">
                  <div className="text-3xl">🤖</div>
                  <p className="font-bold text-xs mt-1">
                    ROBOTICS
                  </p>
                </div>

                <div className="absolute top-8 right-2 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl rotate-6">
                  <div className="text-3xl">🧠</div>
                  <p className="font-bold text-xs mt-1">
                    ESP32
                  </p>
                </div>

                <div className="absolute bottom-7 left-3 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl rotate-6">
                  <div className="text-3xl">📡</div>
                  <p className="font-bold text-xs mt-1">
                    SENSORS
                  </p>
                </div>

                <div className="absolute bottom-3 right-4 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl -rotate-6">
                  <div className="text-3xl">⚡</div>
                  <p className="font-bold text-xs mt-1">
                    ELECTRICAL
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="text-center mb-10">

          <p className="text-blue-600 font-black text-sm tracking-widest">
            SHOP BY CATEGORY
          </p>

          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            Everything You Need
          </h2>

          <p className="text-slate-500 mt-3">
            From electrical accessories to advanced robotics
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {categories.map((item) => (

            <button
              key={item.name}
              onClick={() => {
                setCategory(item.name)

                document
                  .getElementById('products')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }}
              className={`group bg-white border rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                category === item.name
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : 'border-slate-200'
              }`}
            >

              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-3xl transition">
                {item.icon}
              </div>

              <h3 className="font-black text-sm mt-4">
                {item.name}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                {item.description}
              </p>

            </button>

          ))}

        </div>

      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="bg-white border-y border-slate-200 py-16"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
  <div>
    <p className="text-blue-600 font-black text-sm tracking-widest">
      PRODUCTS
    </p>

    <h2 className="text-3xl sm:text-4xl font-black mt-2">
      {category === 'All'
        ? 'Popular Products'
        : category}
    </h2>

    <p className="text-sm text-slate-400 mt-2">
      {filteredProducts.length} product
      {filteredProducts.length !== 1 ? 's' : ''} found
    </p>
  </div>

  <button
    onClick={() => {
      setCategory('All')
      setSearch('')
      setStockOnly(false)
      setSortBy('popular')
    }}
    className="text-blue-600 font-bold hover:text-blue-700"
  >
    Reset Filters →
  </button>
</div>

          {loadingProducts ? (

            <div className="text-center py-20">
              <div className="text-5xl animate-pulse">
                ⚡
              </div>

              <p className="font-bold text-slate-500 mt-4">
                Loading products...
              </p>
            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="text-center py-20">

              <div className="text-6xl">
                🔎
              </div>

              <h3 className="text-xl font-black mt-4">
                No products found
              </h3>

              <p className="text-slate-500 mt-2">
                Try searching another product.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

              {filteredProducts.map((product) => {

                const stock = Number(product.stock || 0)

                const discount =
                  product.oldPrice > product.price
                    ? Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100
                      )
                    : 0

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                  >

                    <div className="relative h-40 sm:h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">

                      <ProductImage product={product} />

                      {discount > 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
                          -{discount}%
                        </span>
                      )}

                      <button
                        onClick={() =>
                          toggleWishlist(product.id)
                        }
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-lg hover:scale-110 transition"
                      >
                        {wishlist.includes(product.id)
                          ? '❤️'
                          : '♡'}
                      </button>

                    </div>

                    <div className="p-3 sm:p-5">

                      <p className="text-xs text-blue-600 font-bold">
                        {product.subcategory}
                      </p>

                      <h3 className="font-black text-sm sm:text-lg mt-2 leading-5 sm:leading-6 min-h-10 sm:min-h-12">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 mt-3 text-sm">

                        <span className="text-yellow-500">
                          ★
                        </span>

                        <span className="font-bold">
                          {product.rating}
                        </span>

                        <span className="text-slate-400">
                          / 5
                        </span>

                      </div>

                      <div className="flex items-end gap-2 mt-4">

                        <span className="text-lg sm:text-2xl font-black">
                          ৳{formatPrice(product.price)}
                        </span>

                        {product.oldPrice >
                          product.price && (
                          <span className="text-sm text-slate-400 line-through mb-1">
                            ৳{formatPrice(
                              product.oldPrice
                            )}
                          </span>
                        )}

                      </div>

                      <div className="mt-3 text-xs font-bold">

                        {stock <= 0 ? (
                          <span className="text-red-500">
                            Out of Stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="text-orange-500">
                            Only {stock} left
                          </span>
                        ) : (
                          <span className="text-green-600">
                            In Stock
                          </span>
                        )}

                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={stock <= 0}
                        className="w-full mt-4 sm:mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-base transition"
                      >
                        {stock <= 0
                          ? 'Out of Stock'
                          : '🛒 Add to Cart'}
                      </button>

                    </div>

                  </div>
                )
              })}

            </div>

          )}

        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-xl transition">
            <div className="text-4xl mb-5">⚡</div>

            <h3 className="font-black text-xl">
              Electrical Solutions
            </h3>

            <p className="text-slate-500 mt-2 leading-6">
              MCB, switches, sockets, contactors, tools and
              industrial electrical products.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-xl transition">
            <div className="text-4xl mb-5">🤖</div>

            <h3 className="font-black text-xl">
              Robotics & IoT
            </h3>

            <p className="text-slate-500 mt-2 leading-6">
              Arduino, ESP32, sensors, motors, drivers and
              robotics components.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-xl transition">
            <div className="text-4xl mb-5">🏭</div>

            <h3 className="font-black text-xl">
              Industrial Automation
            </h3>

            <p className="text-slate-500 mt-2 leading-6">
              PLC, VFD, PID, proximity sensors and automation
              control products.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-16">

        <div className="max-w-7xl mx-auto rounded-3xl bg-blue-600 text-white overflow-hidden">

          <div className="px-7 sm:px-14 py-14 text-center">

            <p className="text-blue-200 font-black tracking-widest text-sm">
              NEED A PRODUCT?
            </p>

            <h2 className="text-3xl sm:text-4xl font-black mt-3">
              Can't Find What You're Looking For?
            </h2>

            <p className="text-blue-100 max-w-2xl mx-auto mt-4">
              Contact ZA TechMart and tell us what product,
              component or automation equipment you need.
            </p>

            <button
              onClick={() => {
                document
                  .getElementById('products')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }}
              className="mt-7 bg-white text-blue-700 px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition"
            >
              Explore Products →
            </button>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                  ZA
                </div>

                <span className="text-xl font-black text-white">
                  ZA<span className="text-blue-400">
                    {' '}TechMart
                  </span>
                </span>

              </div>

              <p className="mt-4 text-sm leading-6">
                Electrical, electronics, robotics and automation
                products for students, engineers, makers and
                professionals.
              </p>

            </div>

            <div>

              <h3 className="text-white font-black mb-4">
                Products
              </h3>

              <div className="space-y-2 text-sm">
                <p>Electrical</p>
                <p>Electronics</p>
                <p>Robotics</p>
                <p>Sensors</p>
              </div>

            </div>

            <div>

              <h3 className="text-white font-black mb-4">
                Technology
              </h3>

              <div className="space-y-2 text-sm">
                <p>Arduino</p>
                <p>ESP32</p>
                <p>Microcontrollers</p>
                <p>Industrial Automation</p>
              </div>

            </div>

            <div> <h3 className="text-white font-black mb-4"> Contact </h3> <div className="space-y-3 text-sm"> <a href="tel:01871104992" className="block hover:text-white transition" > 📞 01871104992 </a> <a href="https://wa.me/8801871104992" target="_blank" rel="noreferrer" className="block hover:text-white transition" > 💬 WhatsApp </a> <a href="mailto:Zafor2031@gmail.com" className="block hover:text-white transition" > ✉️ Zafor2031@gmail.com </a> <p> 🕐 Open 24 Hours </p> </div> </div>

          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 text-sm text-center">
            © 2026 ZA TechMart. All rights reserved.
          </div>

        </div>

      </footer>

      {/* CART DRAWER */}
      {cartOpen && (

        <div className="fixed inset-0 z-[100]">

          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col">

            <div className="flex items-center justify-between p-5 border-b">

              <div>
                <h2 className="text-xl font-black">
                  Your Cart
                </h2>

                <p className="text-sm text-slate-500">
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}{' '}
                  item(s)
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-5">

              {cart.length === 0 ? (

                <div className="text-center py-20">

                  <div className="text-6xl">
                    🛒
                  </div>

                  <h3 className="font-black text-lg mt-4">
                    Your cart is empty
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Add some products to get started.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="border rounded-2xl p-4"
                    >

                      <div className="flex gap-4">

                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                          <ProductImage product={item} />
                        </div>

                        <div className="flex-1">

                          <h3 className="font-bold">
                            {item.name}
                          </h3>

                          <p className="text-blue-600 font-black mt-1">
                            ৳{formatPrice(item.price)}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-red-500 font-bold"
                        >
                          ✕
                        </button>

                      </div>

                      <div className="flex items-center justify-between mt-4">

                        <span className="text-sm text-slate-500">
                          Quantity
                        </span>

                        <div className="flex items-center gap-3">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="w-8 h-8 rounded-lg bg-slate-100 font-black"
                          >
                            −
                          </button>

                          <span className="font-black">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="w-8 h-8 rounded-lg bg-slate-100 font-black"
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {cart.length > 0 && (

              <div className="border-t p-5">

                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    ৳{formatPrice(cartSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span>Delivery</span>

                  <span className="font-bold">
                    {customer.district
                      ? `৳${formatPrice(
                          deliveryCharge
                        )}`
                      : 'Select district'}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-black mb-4">
                  <span>Total</span>

                  <span className="text-blue-600">
                    ৳{formatPrice(cartTotal)}
                  </span>
                </div>

                <button
                  onClick={openCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black transition"
                >
                  Proceed to Checkout →
                </button>

              </div>

            )}

          </div>

        </div>

      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (

        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm overflow-y-auto">

          <div className="min-h-full flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

              <div className="flex items-center justify-between p-6 border-b">

                <div>
                  <h2 className="text-2xl font-black">
                    Checkout
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Complete your order information
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={placeOrder}
                className="p-6 space-y-6"
              >

                {/* CUSTOMER INFORMATION */}
                <div>

                  <h3 className="font-black text-lg mb-4">
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Full Name
                      </label>

                      <input
                        value={customer.name}
                        onChange={(e) =>
                          handleCustomerChange(
                            'name',
                            e.target.value
                          )
                        }
                        placeholder="Your full name"
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) =>
                          handleCustomerChange(
                            'phone',
                            e.target.value
                          )
                        }
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">
                        District
                      </label>

                      <select
                        value={customer.district}
                        onChange={(e) =>
                          handleCustomerChange(
                            'district',
                            e.target.value
                          )
                        }
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                      >
                        <option value="">
                          Select District
                        </option>

                        {districts.map((district) => (
                          <option
                            key={district}
                            value={district}
                          >
                            {district}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-slate-400 mt-2">
                        Dhaka: ৳80 • Outside Dhaka: ৳120
                      </p>
                    </div>

                    <div className="sm:col-span-2">

                      <label className="block text-sm font-bold mb-2">
                        Delivery Address
                      </label>

                      <textarea
                        value={customer.address}
                        onChange={(e) =>
                          handleCustomerChange(
                            'address',
                            e.target.value
                          )
                        }
                        placeholder="House/Road/Village/Area"
                        required
                        rows="3"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
                      />

                    </div>

                  </div>

                </div>

                {/* PAYMENT */}
                <div>

                  <h3 className="font-black text-lg mb-4">
                    Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentMethodChange(
                          'Cash on Delivery'
                        )
                      }
                      className={`border-2 rounded-2xl p-4 text-left transition ${
                        paymentMethod ===
                        'Cash on Delivery'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl">
                        💵
                      </div>

                      <p className="font-black mt-2">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Pay when delivered
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentMethodChange(
                          'bKash'
                        )
                      }
                      className={`border-2 rounded-2xl p-4 text-left transition ${
                        paymentMethod === 'bKash'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl">
                        🟣
                      </div>

                      <p className="font-black mt-2">
                        bKash
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Mobile payment
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePaymentMethodChange(
                          'Nagad'
                        )
                      }
                      className={`border-2 rounded-2xl p-4 text-left transition ${
                        paymentMethod === 'Nagad'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl">
                        🟠
                      </div>

                      <p className="font-black mt-2">
                        Nagad
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Mobile payment
                      </p>
                    </button>

                  </div>

                  {paymentMethod !==
                    'Cash on Delivery' && (

                    <div className="mt-4 bg-slate-50 rounded-2xl p-5">

                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">

                        <p className="font-black text-blue-700">
                          {paymentMethod} Payment
                        </p>

                        <p className="text-sm text-slate-600 mt-1">
                          Send the payment to the
                          merchant number and enter
                          your payment information below.
                        </p>

                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">

                        <div>
                          <label className="block text-sm font-bold mb-2">
                            Payment Number
                          </label>

                          <input
                            type="tel"
                            value={paymentNumber}
                            onChange={(e) =>
                              setPaymentNumber(
                                e.target.value
                              )
                            }
                            placeholder="01XXXXXXXXX"
                            required
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2">
                            Transaction ID
                          </label>

                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) =>
                              setTransactionId(
                                e.target.value
                              )
                            }
                            placeholder="Enter TrxID"
                            required
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                      </div>

                    </div>

                  )}

                </div>

                {/* ORDER SUMMARY */}
                <div className="border border-slate-200 rounded-2xl p-5">

                  <h3 className="font-black text-lg mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Items
                      </span>

                      <span className="font-bold">
                        {cart.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-bold">
                        ৳{formatPrice(cartSubtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Delivery
                      </span>

                      <span className="font-bold">
                        {customer.district
                          ? `৳${formatPrice(
                              deliveryCharge
                            )}`
                          : 'Select district'}
                      </span>
                    </div>

                    <div className="border-t pt-3 mt-3 flex justify-between text-xl font-black">

                      <span>Total</span>

                      <span className="text-blue-600">
                        ৳{formatPrice(cartTotal)}
                      </span>

                    </div>

                  </div>

                </div>

                {orderError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-black text-lg transition"
                >
                  {placingOrder
                    ? 'Placing Order...'
                    : `Place Order • ৳${formatPrice(
                        cartTotal
                      )}`}
                </button>

              </form>

            </div>

          </div>

        </div>

      )}

      {/* ORDER SUCCESS */}
      {orderSuccess && (

        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl">
              ✓
            </div>

            <h2 className="text-3xl font-black mt-5">
              Order Confirmed!
            </h2>

            <p className="text-slate-500 mt-2">
              Thank you for shopping with ZA TechMart.
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 mt-6 text-left">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Order Number
                </span>

                <span className="font-black">
                  {orderSuccess.orderNumber}
                </span>
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-slate-500">
                  Payment
                </span>

                <span className="font-bold">
                  {orderSuccess.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-slate-500">
                  Total
                </span>

                <span className="font-black text-blue-600">
                  ৳{formatPrice(orderSuccess.total)}
                </span>
              </div>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => {
                  setOrderSuccess(null)
                  setTrackingOpen(true)
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black"
              >
                Track Order
              </button>

              <button
                onClick={() => setOrderSuccess(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl font-black"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

function App() {
  const path =
    window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/admin') {
    return <AdminRoute />
  }

  return <ShopApp />
}

export default App


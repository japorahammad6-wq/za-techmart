import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import AdminPage from './AdminPage'
import AdminLogin from './AdminLogin'
import OrderTracking from './OrderTracking'

const fallbackProducts = [
  { id: 1, name: 'MCB 1P 20A Circuit Breaker', category: 'Electrical', subcategory: 'MCB & Breakers', price: 450, oldPrice: 520, icon: '⚡', rating: 4.8, stock: 20, description: 'High performance miniature circuit breaker for home & industrial power protection.' },
  { id: 2, name: 'Universal Switch & Socket 16A', category: 'Electrical', subcategory: 'Switch & Socket', price: 280, oldPrice: 350, icon: '🔌', rating: 4.7, stock: 20, description: 'Durable fire-retardant universal socket box with indicator LED.' },
  { id: 3, name: 'Magnetic Contactor 18A 220V', category: 'Electrical', subcategory: 'Industrial Control', price: 1250, oldPrice: 1450, icon: '⚙️', rating: 4.9, stock: 15, description: 'AC contactor for motor control and heavy industrial machinery switching.' },
  { id: 4, name: 'Digital Multimeter AC/DC Tester', category: 'Electrical', subcategory: 'Tools', price: 950, oldPrice: 1150, icon: '🛠️', rating: 4.6, stock: 15, description: 'Precision digital multimeter with backlight LCD, voltage, current and resistance tester.' },

  { id: 5, name: 'Arduino UNO R3 Development Board', category: 'Robotics', subcategory: 'Microcontrollers', price: 850, oldPrice: 1000, icon: '🤖', rating: 4.9, stock: 20, description: 'ATmega328P based microcontroller board ideal for robotics and IoT projects.' },
  { id: 6, name: 'ESP32 Wi-Fi & Bluetooth Board', category: 'Robotics', subcategory: 'Microcontrollers', price: 780, oldPrice: 900, icon: '🧠', rating: 4.9, stock: 20, description: 'Dual-core 2.4GHz Wi-Fi + Bluetooth wireless dev board for smart home automation.' },
  { id: 7, name: 'SG90 Micro Servo Motor 9g', category: 'Robotics', subcategory: 'Motors', price: 180, oldPrice: 220, icon: '⚙️', rating: 4.7, stock: 30, description: 'High torque mini servo motor for robotic arms and RC projects.' },
  { id: 8, name: 'L298N Dual H-Bridge Motor Driver', category: 'Robotics', subcategory: 'Motor Drivers', price: 280, oldPrice: 350, icon: '🔧', rating: 4.8, stock: 20, description: 'High power motor driver module for controlling DC and Stepper motors.' },

  { id: 9, name: 'HC-SR04 Ultrasonic Distance Sensor', category: 'Sensors', subcategory: 'Distance Sensor', price: 180, oldPrice: 230, icon: '📡', rating: 4.8, stock: 30, description: 'Precise non-contact distance measuring sensor range 2cm to 400cm.' },
  { id: 10, name: 'PIR Motion Sensor Module', category: 'Sensors', subcategory: 'Motion Sensor', price: 150, oldPrice: 190, icon: '👁️', rating: 4.6, stock: 30, description: 'Pyroelectric infrared motion detector module for security systems.' },
  { id: 11, name: 'DHT22 High Precision Temp & Humidity', category: 'Sensors', subcategory: 'Temperature & Humidity', price: 420, oldPrice: 500, icon: '🌡️', rating: 4.8, stock: 20, description: 'Digital calibrated temperature & humidity sensor module.' },
  { id: 12, name: 'IR Obstacle Avoidance Sensor', category: 'Sensors', subcategory: 'IR Sensor', price: 120, oldPrice: 160, icon: '📶', rating: 4.7, stock: 30, description: 'Infrared reflective proximity sensor for smart robot cars.' },

  { id: 13, name: '5V Relay Module 1-Channel Optocoupler', category: 'Electronics', subcategory: 'Relay Modules', price: 120, oldPrice: 150, icon: '🔋', rating: 4.7, stock: 30, description: 'Isolated relay board for AC 250V / DC 30V load switching.' },
  { id: 14, name: '0.96 inch I2C OLED Display White', category: 'Electronics', subcategory: 'Display', price: 320, oldPrice: 400, icon: '🖥️', rating: 4.8, stock: 20, description: '128x64 graphic OLED display module with I2C interface.' },
  { id: 15, name: 'RFID RC522 Reader Module + Card', category: 'Electronics', subcategory: 'RFID', price: 220, oldPrice: 280, icon: '💳', rating: 4.7, stock: 20, description: '13.56MHz SPI RFID card reader kit with key tag.' },
  { id: 16, name: 'Buck Converter LM2596 Step-Down Module', category: 'Electronics', subcategory: 'Power Module', price: 110, oldPrice: 140, icon: '🔋', rating: 4.6, stock: 30, description: 'DC-DC adjustable step-down power supply module 3A.' },

  { id: 17, name: 'Industrial Proximity Sensor Switch', category: 'Automation', subcategory: 'Proximity Sensor', price: 650, oldPrice: 750, icon: '📡', rating: 4.8, stock: 15, description: 'Inductive proximity sensor switch for metallic target detection.' },
  { id: 18, name: 'Programmable Logic Controller (PLC)', category: 'Automation', subcategory: 'PLC', price: 4800, oldPrice: 5500, icon: '🏭', rating: 4.9, stock: 10, description: 'Compact industrial PLC controller with digital I/O expansion.' },
  { id: 19, name: 'VFD Frequency Inverter 1.5KW 220V', category: 'Automation', subcategory: 'VFD', price: 6800, oldPrice: 7500, icon: '⚙️', rating: 4.8, stock: 8, description: 'Variable frequency drive for 3-phase AC motor speed control.' },
  { id: 20, name: 'Digital PID Temperature Controller', category: 'Automation', subcategory: 'Controller', price: 1850, oldPrice: 2200, icon: '🎛️', rating: 4.7, stock: 12, description: 'Dual digital display PID temperature controller with SSR output.' },
]

const defaultHeroSlides = [
  {
    id: 1,
    tag: '⚡ SPECIAL OFFER',
    title: 'Robotics & IoT Innovation Hub',
    subtitle: 'Original Arduino, ESP32, Servo Motors & Sensors with fast nationwide delivery.',
    bg: 'from-slate-950 via-blue-950 to-indigo-950',
    categoryJump: 'Robotics',
    badgeText: '🤖 UP TO 20% DISCOUNT',
    image: '',
  },
  {
    id: 2,
    tag: '🔌 HEAVY DUTY ELECTRICAL',
    title: 'Industrial Electrical & Breakers',
    subtitle: 'Authentic MCBs, Switch Sockets, Magnetic Contactors & Testing Equipment.',
    bg: 'from-[#0B132B] via-slate-900 to-[#1C2541]',
    categoryJump: 'Electrical',
    badgeText: '⚡ 100% GENUINE WARRANTY',
    image: '',
  },
  {
    id: 3,
    tag: '🏭 FACTORY AUTOMATION',
    title: 'PLC, VFD Drives & Controllers',
    subtitle: 'Advanced industrial automation solutions for factories, machinery, and smart control.',
    bg: 'from-[#0A192F] via-[#112240] to-slate-900',
    categoryJump: 'Automation',
    badgeText: '🏭 TECH SUPPORT INCLUDED',
    image: '',
  },
]

const initialReviews = {
  1: [
    { id: 101, author: 'Rafiqul Islam', rating: 5, date: '2026-09-12', text: 'Original MCB breaker! Works perfectly in my distribution box, fast delivery to Chittagong.' },
    { id: 102, author: 'Mahmud Hasan', rating: 5, date: '2026-09-08', text: 'Build quality is top notch. Highly recommended store!' }
  ],
  5: [
    { id: 103, author: 'Sabbir Ahmed', rating: 5, date: '2026-09-15', text: 'Original ATmega328P chip Arduino UNO R3. Connected to IDE without any driver issue.' },
  ],
  6: [
    { id: 104, author: 'Tanvir Hossain', rating: 5, date: '2026-09-14', text: 'ESP32 Wi-Fi antenna signal is very strong. Great seller!' }
  ]
}

const defaultTickerText = '🚀 Free Delivery on orders over ৳5,000! • ⚡ Authentic Arduino, ESP32 & Industrial Electrical Supplies • 📞 Customer Support: 01871104992 • 💵 Cash on Delivery Available 64 Districts'

const defaultSiteIcons = {
  logo: '⚡',
  allCategory: '✨',
  electricalCategory: '⚡',
  electronicsCategory: '🔌',
  roboticsCategory: '🤖',
  microcontrollersCategory: '🧠',
  sensorsCategory: '📡',
  automationCategory: '🏭',
  cart: '🛒',
  wishlist: '❤️',
  trackOrder: '📦',
  phone: '📞',
  whatsapp: '💬',
}

const defaultSiteTexts = {
  storeNamePrefix: 'ZA',
  storeNameSuffix: 'TechMart',
  storeTagline: 'ELECTRICAL • ROBOTICS • IOT',
  phone: '01871104992',
  whatsappLabel: 'WhatsApp 24/7',
  email: 'Zafor2031@gmail.com',
  categoriesTitle: 'Browse Categories',
  categoriesSubtitle: 'Special Categories',
  footerAbout: 'Leading electrical, electronics, robotics, and automation parts supplier in Bangladesh. Quality components for makers, students, and engineers.',
  footerCopyright: '© 2026 ZA TechMart Bangladesh. All rights reserved.',
}

const districts = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria',
  'Chandpur', 'Chattogram', 'Chuadanga', 'Cox’s Bazar', 'Cumilla', 'Dhaka', 'Dinajpur',
  'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur',
  'Jashore', 'Jhalokathi', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna', 'Kishoreganj',
  'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj',
  'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj',
  'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh',
  'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira',
  'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon',
]

const getDeliveryCharge = (district) => {
  if (!district) return 0
  return district === 'Dhaka' ? 80 : 120
}

const formatPrice = (price) =>
  Number(price || 0).toLocaleString('en-BD')

export const isImageUrl = (val) => {
  if (typeof val !== 'string') return false
  const str = val.trim()
  if (!str) return false
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:image/') ||
    str.startsWith('data:application/') ||
    str.startsWith('/') ||
    str.startsWith('blob:') ||
    str.includes(';base64,')
  )
}

export function RenderIcon({ icon, fallback = '⚡', className = 'w-5 h-5' }) {
  const iconStr = String(icon || fallback).trim()
  if (isImageUrl(iconStr)) {
    return <img src={iconStr} alt="" className={`${className} object-contain inline-block shrink-0`} />
  }
  return <span className="inline-block shrink-0">{iconStr}</span>
}

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
    <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition duration-500 select-none p-3">
      <RenderIcon
        icon={product.icon}
        fallback="📦"
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
    </div>
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse text-blue-500">⚡</div>
          <p className="font-bold text-slate-400 mt-4 text-sm tracking-wider">
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
          setSession({ user })
        }}
      />
    )
  }

  return <AdminPage />
}

function ShopApp() {
  // STORE & FILTERS STATE
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [stockOnly, setStockOnly] = useState(false)
  const [maxPriceFilter, setMaxPriceFilter] = useState(10000)
  const [products, setProducts] = useState(fallbackProducts)
  const [loadingProducts, setLoadingProducts] = useState(true)

  // DYNAMIC SITE ICONS, TEXTS, TICKER & HERO SLIDES
  const [siteIcons, setSiteIcons] = useState(() => {
    try {
      const saved = localStorage.getItem('site_custom_icons')
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.keys(parsed).forEach((key) => {
          if (typeof parsed[key] === 'string' && parsed[key].includes('Image Uploaded')) {
            parsed[key] = defaultSiteIcons[key] || '⚡'
          }
        })
        return { ...defaultSiteIcons, ...parsed }
      }
      return defaultSiteIcons
    } catch {
      return defaultSiteIcons
    }
  })

  const [siteTexts, setSiteTexts] = useState(() => {
    try {
      const saved = localStorage.getItem('site_custom_texts')
      return saved ? { ...defaultSiteTexts, ...JSON.parse(saved) } : defaultSiteTexts
    } catch {
      return defaultSiteTexts
    }
  })

  const categories = useMemo(() => [
    { name: 'All', icon: siteIcons.allCategory || '✨', description: 'All Catalog' },
    { name: 'Electrical', icon: siteIcons.electricalCategory || '⚡', description: 'MCB, Switch, Socket & Tools' },
    { name: 'Electronics', icon: siteIcons.electronicsCategory || '🔌', description: 'Modules & Components' },
    { name: 'Robotics', icon: siteIcons.roboticsCategory || '🤖', description: 'Robotics Parts & Motors' },
    { name: 'Microcontrollers', icon: siteIcons.microcontrollersCategory || '🧠', description: 'Arduino, ESP32 & More' },
    { name: 'Sensors', icon: siteIcons.sensorsCategory || '📡', description: 'Sensors & Detection' },
    { name: 'Automation', icon: siteIcons.automationCategory || '🏭', description: 'PLC, VFD & Control' },
  ], [siteIcons])

  const [tickerText, setTickerText] = useState(() => {
    return localStorage.getItem('site_ticker_text') || defaultTickerText
  })

  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('site_hero_slides')
      return saved ? JSON.parse(saved) : defaultHeroSlides
    } catch {
      return defaultHeroSlides
    }
  })

  // LISTEN TO ADMIN DYNAMIC UPDATES
  useEffect(() => {
    const handleSettingsUpdate = () => {
      const updatedTicker = localStorage.getItem('site_ticker_text')
      if (updatedTicker) setTickerText(updatedTicker)

      try {
        const updatedSlides = localStorage.getItem('site_hero_slides')
        if (updatedSlides) setHeroSlides(JSON.parse(updatedSlides))
      } catch (e) {
        console.error(e)
      }

      try {
        const updatedIcons = localStorage.getItem('site_custom_icons')
        if (updatedIcons) {
          const parsed = JSON.parse(updatedIcons)
          Object.keys(parsed).forEach((key) => {
            if (typeof parsed[key] === 'string' && parsed[key].includes('Image Uploaded')) {
              parsed[key] = defaultSiteIcons[key] || '⚡'
            }
          })
          setSiteIcons({ ...defaultSiteIcons, ...parsed })
        }
      } catch (e) {
        console.error(e)
      }

      try {
        const updatedTexts = localStorage.getItem('site_custom_texts')
        if (updatedTexts) setSiteTexts({ ...defaultSiteTexts, ...JSON.parse(updatedTexts) })
      } catch (e) {
        console.error(e)
      }
    }

    window.addEventListener('storage', handleSettingsUpdate)
    window.addEventListener('site-settings-updated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('storage', handleSettingsUpdate)
      window.removeEventListener('site-settings-updated', handleSettingsUpdate)
    }
  }, [])

  // HERO SLIDER CAROUSEL STATE
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides])

  // REVIEWS & WISHLIST STATE
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('product_reviews')
      return saved ? JSON.parse(saved) : initialReviews
    } catch {
      return initialReviews
    }
  })

  const [modalTab, setModalTab] = useState('overview')
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '' })

  const handleAddReview = (productId) => {
    if (!newReview.author.trim() || !newReview.text.trim()) return
    const reviewItem = {
      id: Date.now(),
      author: newReview.author.trim(),
      rating: Number(newReview.rating),
      date: new Date().toISOString().split('T')[0],
      text: newReview.text.trim(),
    }

    const updated = {
      ...reviews,
      [productId]: [reviewItem, ...(reviews[productId] || [])],
    }

    setReviews(updated)
    localStorage.setItem('product_reviews', JSON.stringify(updated))
    setNewReview({ author: '', rating: 5, text: '' })
  }

  // CART & DRAWER STATE
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [zoomImage, setZoomImage] = useState(null)

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [whatsappMsg, setWhatsappMsg] = useState('Hello ZA TechMart! I want to inquire about a product.')

  const [copiedNumber, setCopiedNumber] = useState(false)

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

  const getProductImages = (product) => {
    if (!product) return []
    const images = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : []

    const mainImage =
      product.image_url ||
      product.image ||
      product.imageUrl ||
      product.photo_url

    if (mainImage && !images.includes(mainImage)) {
      return [mainImage, ...images]
    }

    return images
  }

  useEffect(() => {
    if (!selectedProduct) {
      setSelectedImage(null)
      setModalTab('overview')
      return
    }

    const images = getProductImages(selectedProduct)
    setSelectedImage(images[0] || null)
  }, [selectedProduct])

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
      // 1. Extract cloud site config row if present
      const configItem = data.find(
        (item) => item.category === '__SITE_CONFIG__' || item.id === 999999 || item.name === 'SITE_CONFIG_GLOBAL_SETTINGS'
      )

      if (configItem && configItem.description) {
        try {
          const parsedConfig = JSON.parse(configItem.description)
          if (parsedConfig.siteIcons) {
            Object.keys(parsedConfig.siteIcons).forEach((key) => {
              if (
                typeof parsedConfig.siteIcons[key] === 'string' &&
                parsedConfig.siteIcons[key].includes('Image Uploaded')
              ) {
                parsedConfig.siteIcons[key] = defaultSiteIcons[key] || '⚡'
              }
            })
            setSiteIcons((prev) => ({ ...defaultSiteIcons, ...parsedConfig.siteIcons }))
            localStorage.setItem('site_custom_icons', JSON.stringify(parsedConfig.siteIcons))
          }
          if (parsedConfig.siteTexts) {
            setSiteTexts((prev) => ({ ...defaultSiteTexts, ...parsedConfig.siteTexts }))
            localStorage.setItem('site_custom_texts', JSON.stringify(parsedConfig.siteTexts))
          }
          if (parsedConfig.tickerText) {
            setTickerText(parsedConfig.tickerText)
            localStorage.setItem('site_ticker_text', parsedConfig.tickerText)
          }
          if (parsedConfig.heroSlides) {
            setHeroSlides(parsedConfig.heroSlides)
            localStorage.setItem('site_hero_slides', JSON.stringify(parsedConfig.heroSlides))
          }
        } catch (e) {
          console.error('Cloud config parse error:', e)
        }
      }

      // 2. Filter out config row from customer storefront catalog
      const actualProducts = data.filter(
        (item) => item.category !== '__SITE_CONFIG__' && item.id !== 999999 && item.name !== 'SITE_CONFIG_GLOBAL_SETTINGS'
      )

      const mapped = actualProducts.map((item) => ({
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
      return [...current, { ...product, quantity: 1 }]
    })

    setCartOpen(true)
  }

  const increaseQuantity = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (!existing) {
        const product = products.find((item) => item.id === productId)
        if (!product) return prev
        return [...prev, { ...product, quantity: 2 }]
      }
      return prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                Number(item.stock) || 999
              ),
            }
          : item
      )
    })
  }

  const decreaseQuantity = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (!existing) return prev
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.id !== productId)
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    })
  }

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId))
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

    let result = products.filter((product) => {
      const matchesSearch =
        !text ||
        product.name?.toLowerCase().includes(text) ||
        product.category?.toLowerCase().includes(text) ||
        product.subcategory?.toLowerCase().includes(text)

      const matchesCategory =
        category === 'All' ||
        product.category === category ||
        product.subcategory === category

      const matchesStock = !stockOnly || Number(product.stock || 0) > 0
      const matchesPrice = Number(product.price || 0) <= maxPriceFilter

      return matchesSearch && matchesCategory && matchesStock && matchesPrice
    })

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [products, search, category, stockOnly, maxPriceFilter, sortBy])

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
    const random = Math.floor(100000 + Math.random() * 900000)
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
      setOrderError('Please enter Payment Number and Transaction ID.')
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
        error.message || 'Order could not be placed. Please try again.'
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
    setCustomer({ name: '', phone: '', district: '', address: '' })
    setPaymentMethod('Cash on Delivery')
    setPaymentNumber('')
    setTransactionId('')
    await loadProducts()
  }

  if (adminOpen) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <button
          onClick={() => setAdminOpen(false)}
          className="fixed top-4 left-4 z-[200] bg-white text-slate-900 shadow-xl px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-slate-100 transition"
        >
          ← Back to Store
        </button>
        <AdminPage />
      </div>
    )
  }

  if (trackingOpen) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <button
            onClick={() => setTrackingOpen(false)}
            className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
          >
            ← Back to Store
          </button>
          <span className="font-black text-xl text-slate-900">
            ZA <span className="text-blue-600">TechMart</span>
          </span>
        </div>
        <OrderTracking />
      </div>
    )
  }

  const totalCartCount = cart.reduce((tot, i) => tot + i.quantity, 0)
  const activeSlide = (heroSlides && heroSlides[currentSlide]) || defaultHeroSlides[0]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">

      {/* TOP ANNOUNCEMENT TICKER BAR */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs py-2 px-4 font-bold overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="bg-white text-blue-800 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
              ANNOUNCEMENT
            </span>
            <div className="overflow-hidden flex-1 relative flex items-center w-full">
              <marquee scrollamount="6" className="text-slate-100 font-semibold text-xs sm:text-sm">
                {tickerText}
              </marquee>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] shrink-0 font-semibold text-slate-200">
            <span className="flex items-center gap-1.5"><RenderIcon icon={siteIcons.phone} fallback="📞" className="w-3.5 h-3.5" /> {siteTexts.phone || '01871104992'}</span>
            <span className="flex items-center gap-1.5"><RenderIcon icon={siteIcons.whatsapp} fallback="💬" className="w-3.5 h-3.5" /> {siteTexts.whatsappLabel || 'WhatsApp 24/7'}</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="glass-header sticky top-0 z-40 border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* BRAND LOGO */}
            <button
              onClick={() => {
                setCategory('All')
                setSearch('')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-3 shrink-0 group text-left"
            >
              <div className="h-10 sm:h-12 w-auto flex items-center justify-center group-hover:scale-105 transition shrink-0">
                <RenderIcon icon={siteIcons.logo} fallback="⚡" className="h-full w-auto max-h-full object-contain" />
              </div>

              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  {siteTexts.storeNamePrefix || 'ZA'} <span className="text-blue-600">{siteTexts.storeNameSuffix || 'TechMart'}</span>
                </h1>
                <p className="hidden sm:block text-[9px] font-bold tracking-[0.2em] text-slate-400">
                  {siteTexts.storeTagline || 'ELECTRICAL • ROBOTICS • IOT'}
                </p>
              </div>
            </button>

            {/* DESKTOP SEARCH */}
            <div className="hidden md:block flex-1 max-w-xl relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Arduino, ESP32, Sensors, MCB, Relay..."
                className="w-full bg-slate-100/90 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-2xl py-2.5 pl-11 pr-10 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                <RenderIcon icon={siteIcons.search} fallback="🔍" className="w-4 h-4" />
              </span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center hover:bg-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
              <button
                onClick={() => {
                  setCategory('All')
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`hover:text-blue-600 transition ${category === 'All' ? 'text-blue-600 font-extrabold' : ''}`}
              >
                Products
              </button>

              <button
                onClick={() => setTrackingOpen(true)}
                className="hover:text-blue-600 transition flex items-center gap-1.5"
              >
                <RenderIcon icon={siteIcons.trackOrder} fallback="📦" className="w-4 h-4" /> Track Order
              </button>
            </nav>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist button */}
              <button
                onClick={() => {
                  setCategory('All')
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-500 transition bg-white flex items-center justify-center"
                title="Wishlist"
              >
                <RenderIcon icon={siteIcons.wishlist} fallback="❤️" className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <RenderIcon icon={siteIcons.cart} fallback="🛒" className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {totalCartCount > 0 && (
                  <span className="bg-white text-blue-700 text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="md:hidden relative mt-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Arduino, Sensors, Electrical..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-9 outline-none text-slate-900 text-sm focus:bg-white focus:border-blue-500"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              🔍
            </span>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAV */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          />
          <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white text-slate-900 shadow-2xl p-6 flex flex-col justify-between animate-slide-up">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-auto flex items-center justify-center shrink-0">
                    <RenderIcon icon={siteIcons.logo} fallback="⚡" className="h-full w-auto max-h-full object-contain" />
                  </div>
                  <span className="font-black text-lg">
                    {siteTexts.storeNamePrefix || 'ZA'} <span className="text-blue-600">{siteTexts.storeNameSuffix || 'TechMart'}</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-2 font-bold text-slate-700">
                <p className="text-xs uppercase font-black tracking-widest text-slate-400 mb-3 px-3">
                  Categories
                </p>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setCategory(cat.name)
                      setMobileMenuOpen(false)
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition ${
                      category === cat.name
                        ? 'bg-blue-50 text-blue-600 font-black'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <RenderIcon icon={cat.icon} fallback="✨" className="w-5 h-5 shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                ))}

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setTrackingOpen(true)
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    <RenderIcon icon={siteIcons.trackOrder} fallback="📦" className="w-5 h-5 shrink-0" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
              <RenderIcon icon={siteIcons.phone} fallback="📞" className="w-4 h-4" />
              <span>{siteTexts.phone || '01871104992'} • Open 24 Hours</span>
            </div>
          </div>
        </div>
      )}

      {/* HERO CAROUSEL / FULL-WIDTH SLEEK BANNER SLIDER */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
          <div className="relative w-full h-44 sm:h-64 md:h-72 lg:h-[310px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            
            {/* BANNER IMAGE / GRAPHIC SHOWCASE (No text overlay) */}
            {activeSlide.image ? (
              <img
                src={activeSlide.image}
                alt={activeSlide.title || 'Hero Banner'}
                className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-102"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-r ${activeSlide.bg || 'from-slate-950 via-blue-950 to-indigo-950'} flex flex-col justify-center items-center text-center p-6 border border-white/10`}>
                <span className="text-3xl sm:text-5xl mb-2 animate-bounce">⚡</span>
                <h3 className="text-lg sm:text-2xl font-black text-white max-w-xl line-clamp-2">
                  {activeSlide.title}
                </h3>
              </div>
            )}

            {/* OVERLAID SHOP NOW / CATEGORY ACTION BUTTON */}
            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20">
              <button
                onClick={() => {
                  setCategory(activeSlide.categoryJump || 'All')
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-2xl shadow-blue-600/50 hover:scale-105 flex items-center gap-2 border border-white/20 backdrop-blur-md"
              >
                <span>{activeSlide.btnText || 'Shop Now →'}</span>
              </button>
            </div>

            {/* PREVIOUS SLIDE ARROW BUTTON */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev <= 0 ? heroSlides.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-blue-600 text-white flex items-center justify-center font-black text-lg sm:text-xl border border-white/20 transition shadow-lg z-20 backdrop-blur-xs"
              aria-label="Previous slide"
            >
              ‹
            </button>

            {/* NEXT SLIDE ARROW BUTTON */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-blue-600 text-white flex items-center justify-center font-black text-lg sm:text-xl border border-white/20 transition shadow-lg z-20 backdrop-blur-xs"
              aria-label="Next slide"
            >
              ›
            </button>

            {/* SLIDER DOTS INDICATORS */}
            <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 flex gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xs">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {siteTexts.categoriesTitle || 'Browse Categories'}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {categories.length - 1} {siteTexts.categoriesSubtitle || 'Special Categories'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 touch-scroll">
          {categories.map((cat) => {
            const isActive = category === cat.name
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-black scale-102'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <RenderIcon icon={cat.icon} fallback="✨" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* FILTER & ADVANCED PRICE CONTROL BAR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {category === 'All' ? 'Popular Products' : category}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> item(s)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Price Filter Slider */}
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
              <span className="text-slate-500">Max Price:</span>
              <span className="font-black text-blue-600">৳{formatPrice(maxPriceFilter)}</span>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-24 sm:w-32 accent-blue-600 cursor-pointer ml-1"
              />
            </div>

            {/* Stock only filter */}
            <button
              onClick={() => setStockOnly(!stockOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                stockOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-extrabold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {stockOnly ? '✓ In Stock Only' : 'Show Out of Stock'}
            </button>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="popular">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {(category !== 'All' || search || stockOnly || sortBy !== 'popular' || maxPriceFilter < 10000) && (
              <button
                onClick={() => {
                  setCategory('All')
                  setSearch('')
                  setStockOnly(false)
                  setMaxPriceFilter(10000)
                  setSortBy('popular')
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loadingProducts ? (
          <div className="text-center py-24">
            <div className="text-6xl animate-pulse">⚡</div>
            <p className="font-bold text-slate-500 mt-4 text-sm">
              Loading Catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-black text-slate-900 mt-4">
              No products found
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Try adjusting your search or max price filter.
            </p>
            <button
              onClick={() => {
                setCategory('All')
                setSearch('')
                setMaxPriceFilter(10000)
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {filteredProducts.map((product) => {
              const stock = Number(product.stock || 0)
              const discount =
                product.oldPrice > product.price
                  ? Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) * 100
                    )
                  : 0

              const isWishlisted = wishlist.includes(product.id)

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* IMAGE CONTAINER */}
                    <div className="relative h-36 sm:h-48 bg-gradient-to-br from-slate-50 to-slate-100/80 flex items-center justify-center overflow-hidden p-3">
                      <ProductImage product={product} />

                      {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          -{discount}%
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-sm hover:scale-110 transition"
                      >
                        {isWishlisted ? '❤️' : '♡'}
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 sm:p-4">
                      <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                        {product.subcategory || product.category}
                      </p>

                      <h3 className="font-black text-xs sm:text-sm text-slate-900 mt-1 line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-snug">
                        {product.name}
                      </h3>

                      {/* RATING & REVIEWS COUNT */}
                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="font-bold text-slate-800">{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">
                          ({(reviews[product.id] || []).length + 3} reviews)
                        </span>
                      </div>

                      {/* PRICE */}
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-base sm:text-xl font-black text-slate-900">
                          ৳{formatPrice(product.price)}
                        </span>
                        {product.oldPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>

                      {/* STOCK BADGE */}
                      <div className="mt-2 text-[11px] font-extrabold">
                        {stock <= 0 ? (
                          <span className="text-red-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Out of Stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="text-amber-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Only {stock} left
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <div className="p-3 sm:p-4 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      disabled={stock <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition shadow-xs"
                    >
                      {stock <= 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-auto flex items-center justify-center shrink-0">
                  <RenderIcon icon={siteIcons.logo} fallback="⚡" className="h-full w-auto max-h-full object-contain" />
                </div>
                <span className="text-xl font-black text-white">
                  {siteTexts.storeNamePrefix || 'ZA'} <span className="text-blue-400">{siteTexts.storeNameSuffix || 'TechMart'}</span>
                </span>
              </div>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400">
                {siteTexts.footerAbout || 'Leading electrical, electronics, robotics, and automation parts supplier in Bangladesh. Quality components for makers, students, and engineers.'}
              </p>
            </div>

            <div>
              <h3 className="text-white font-black text-sm mb-4 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="hover:text-white transition cursor-pointer">Electrical & Breakers</p>
                <p className="hover:text-white transition cursor-pointer">Robotics & Motors</p>
                <p className="hover:text-white transition cursor-pointer">Sensors & Detection</p>
                <p className="hover:text-white transition cursor-pointer">PLC & Automation</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-black text-sm mb-4 uppercase tracking-wider">
                Quick Links
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button onClick={() => setTrackingOpen(true)} className="flex items-center gap-2 hover:text-white transition">
                  <RenderIcon icon={siteIcons.trackOrder} fallback="📦" className="w-4 h-4" />
                  <span>Order Tracking</span>
                </button>
                <p className="hover:text-white transition">🚚 Delivery Rates (Dhaka ৳80 / Outside ৳120)</p>
                {/* Discrete Admin Link in Footer for Site Admin */}
                <button onClick={() => setAdminOpen(true)} className="block hover:text-slate-500 text-slate-700 text-xs transition pt-2">
                  ⚙️ Staff Login
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-white font-black text-sm mb-4 uppercase tracking-wider">
                Contact Us
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <a href={`tel:${siteTexts.phone}`} className="flex items-center gap-2 hover:text-white transition font-bold text-slate-200">
                  <RenderIcon icon={siteIcons.phone} fallback="📞" className="w-4 h-4" />
                  <span>{siteTexts.phone || '01871104992'}</span>
                </a>
                <a href={`https://wa.me/880${(siteTexts.phone || '01871104992').replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition text-emerald-400 font-bold">
                  <RenderIcon icon={siteIcons.whatsapp} fallback="💬" className="w-4 h-4" />
                  <span>{siteTexts.whatsappLabel || 'WhatsApp Direct'}</span>
                </a>
                <a href={`mailto:${siteTexts.email}`} className="flex items-center gap-2 hover:text-white transition">
                  ✉️ {siteTexts.email || 'Zafor2031@gmail.com'}
                </a>
                <p className="text-slate-500">🕐 Customer Support: 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-12 pt-6 text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{siteTexts.footerCopyright || '© 2026 ZA TechMart Bangladesh. All rights reserved.'}</span>
            <span>Made for Engineers & Innovators</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        {whatsappOpen ? (
          <div className="w-80 sm:w-96 rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-slate-200 bg-white text-slate-900">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-2 text-white shrink-0">
                  <RenderIcon icon={siteIcons.whatsapp} fallback="💬" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm">ZA TechMart Support</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Online 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500">
                Hi! Leave us a message about any electrical, robotics, or sensor product query.
              </p>
              <textarea
                value={whatsappMsg}
                onChange={(e) => setWhatsappMsg(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-500"
              />

              <a
                href={`https://wa.me/8801871104992?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <RenderIcon icon={siteIcons.whatsapp} fallback="💬" className="w-4 h-4" />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setWhatsappOpen(true)}
            className="group bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            title="Chat on WhatsApp"
          >
            <RenderIcon icon={siteIcons.whatsapp} fallback="💬" className="w-6 h-6" />
            <span className="hidden group-hover:inline ml-2 text-xs font-black pr-2">Chat with Support</span>
          </button>
        )}
      </div>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          />
          <div className="absolute right-0 top-0 bottom-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">Your Cart</h2>
                <p className="text-xs text-slate-500">
                  {totalCartCount} item(s) selected
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl">🛒</div>
                  <h3 className="font-black text-slate-900 text-base mt-4">
                    Your cart is empty
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Explore products and add items to your cart.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50 flex gap-3 items-center"
                  >
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      <ProductImage product={item} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-blue-600 font-black text-sm mt-0.5">
                        ৳{formatPrice(item.price)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="font-black text-xs text-slate-900 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 font-bold p-2"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-5 bg-white space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">৳{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-slate-900">
                    {customer.district ? `৳${formatPrice(deliveryCharge)}` : 'Calculated at checkout'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-blue-600">৳{formatPrice(cartTotal)}</span>
                </div>

                <button
                  onClick={openCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-sm transition shadow-lg shadow-blue-500/25"
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
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Checkout</h2>
                <p className="text-xs text-slate-500">Complete your delivery address and payment details</p>
              </div>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={placeOrder} className="p-5 sm:p-7 space-y-6">
              {/* CUSTOMER INFORMATION */}
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider mb-3">
                  1. Shipping Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      value={customer.name}
                      onChange={(e) => handleCustomerChange('name', e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District *
                    </label>
                    <select
                      value={customer.district}
                      onChange={(e) => handleCustomerChange('district', e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d} {d === 'Dhaka' ? '(৳80 Delivery)' : '(৳120 Delivery)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Delivery Address *
                    </label>
                    <textarea
                      value={customer.address}
                      onChange={(e) => handleCustomerChange('address', e.target.value)}
                      placeholder="House No, Road, Thana, Area"
                      required
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider mb-3">
                  2. Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('Cash on Delivery')}
                    className={`border-2 rounded-2xl p-3.5 text-left transition ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-blue-600 bg-blue-50/60 font-black'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl">💵</div>
                    <p className="text-xs font-bold mt-1 text-slate-900">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Pay when product arrives</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('bKash')}
                    className={`border-2 rounded-2xl p-3.5 text-left transition ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-600 bg-pink-50/60 font-black'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl">🟣</div>
                    <p className="text-xs font-bold mt-1 text-slate-900">bKash Personal</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Send Money / Merchant</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('Nagad')}
                    className={`border-2 rounded-2xl p-3.5 text-left transition ${
                      paymentMethod === 'Nagad'
                        ? 'border-amber-600 bg-amber-50/60 font-black'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl">🟠</div>
                    <p className="text-xs font-bold mt-1 text-slate-900">Nagad Personal</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Send Money</p>
                  </button>
                </div>

                {paymentMethod !== 'Cash on Delivery' && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-black text-slate-900">
                          {paymentMethod} Personal Number:
                        </p>
                        <p className="text-base font-black text-blue-600">01871104992</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('01871104992')
                          setCopiedNumber(true)
                          setTimeout(() => setCopiedNumber(false), 2000)
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        {copiedNumber ? '✓ Copied!' : 'Copy Number'}
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sender Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={paymentNumber}
                          onChange={(e) => setPaymentNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Transaction TrxID *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 9M87AB34"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ORDER SUMMARY */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalCartCount} items)</span>
                  <span className="font-bold text-slate-900">৳{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({customer.district || 'District not selected'})</span>
                  <span className="font-bold text-slate-900">৳{formatPrice(deliveryCharge)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Amount</span>
                  <span className="text-blue-600">৳{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {orderError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold">
                  ⚠️ {orderError}
                </div>
              )}

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:bg-blue-300 text-white py-3.5 rounded-2xl font-black text-sm transition shadow-lg shadow-blue-500/25"
              >
                {placingOrder ? 'Processing Order...' : `Confirm Order • ৳${formatPrice(cartTotal)}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[150] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black">
              ✓
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-4">Order Placed!</h2>
            <p className="text-xs text-slate-500 mt-1">Thank you for ordering from ZA TechMart.</p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number</span>
                <span className="font-black text-slate-900">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment</span>
                <span className="font-bold text-slate-900">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black">
                <span>Total Amount</span>
                <span className="text-blue-600">৳{formatPrice(orderSuccess.total)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setOrderSuccess(null)
                  setTrackingOpen(true)
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs"
              >
                Track Order
              </button>
              <button
                onClick={() => setOrderSuccess(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT QUICK VIEW MODAL WITH REVIEWS TAB */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-5"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl custom-scrollbar animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
              {/* TABS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalTab('overview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    modalTab === 'overview'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setModalTab('reviews')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    modalTab === 'reviews'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Customer Reviews ({(reviews[selectedProduct.id] || []).length})
                </button>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {modalTab === 'overview' ? (
              <div className="grid md:grid-cols-2 gap-6 p-5 sm:p-7">
                {/* LEFT: IMAGE & GALLERY */}
                <div>
                  <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl h-64 sm:h-80 flex items-center justify-center overflow-hidden p-4">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={selectedProduct.name}
                        onClick={() => setZoomImage(selectedImage)}
                        className="w-full h-full object-contain cursor-zoom-in hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <ProductImage product={selectedProduct} />
                    )}
                  </div>

                  {getProductImages(selectedProduct).length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                      {getProductImages(selectedProduct).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-16 rounded-xl border-2 bg-white overflow-hidden shrink-0 transition ${
                            selectedImage === img ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain p-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: DETAILS */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        {selectedProduct.category}
                      </span>
                      {selectedProduct.subcategory && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                          {selectedProduct.subcategory}
                        </span>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                      {selectedProduct.name}
                    </h1>

                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-amber-500 font-bold">★ {selectedProduct.rating || 4.8}</span>
                      <span className="text-slate-400">• Genuine Guarantee</span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">
                        ৳{formatPrice(selectedProduct.price)}
                      </span>
                      {selectedProduct.oldPrice > selectedProduct.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ৳{formatPrice(selectedProduct.oldPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs">
                      {Number(selectedProduct.stock) > 0 ? (
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          In Stock ({selectedProduct.stock} units available)
                        </span>
                      ) : (
                        <span className="text-red-500 font-extrabold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Currently Out of Stock
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                      {selectedProduct.description ||
                        'High-quality guaranteed electrical/electronic component for engineering projects and industrial applications.'}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button
                      disabled={Number(selectedProduct.stock) <= 0}
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                      className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black text-xs sm:text-sm transition shadow-md shadow-blue-500/20"
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      disabled={Number(selectedProduct.stock) <= 0}
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                        setCartOpen(false)
                        setCheckoutOpen(true)
                      }}
                      className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white font-black text-xs sm:text-sm transition shadow-md shadow-amber-500/20"
                    >
                      ⚡ Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: REVIEWS */
              <div className="p-5 sm:p-7 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Customer Reviews</h3>
                  <p className="text-xs text-slate-500">Read what other buyers say about {selectedProduct.name}</p>
                </div>

                {/* REVIEW SUBMIT FORM */}
                <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Write a Review</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500"
                    />

                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500"
                    >
                      <option value="5">★★★★★ (5 - Excellent)</option>
                      <option value="4">★★★★☆ (4 - Good)</option>
                      <option value="3">★★★☆☆ (3 - Average)</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Write your experience with this product..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    rows={2}
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-3 text-xs outline-none resize-none focus:border-blue-500"
                  />

                  <button
                    onClick={() => handleAddReview(selectedProduct.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition"
                  >
                    Submit Review
                  </button>
                </div>

                {/* REVIEWS LIST */}
                <div className="space-y-3">
                  {(reviews[selectedProduct.id] || []).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No customer reviews yet. Be the first to review!</p>
                  ) : (
                    (reviews[selectedProduct.id] || []).map((rev) => (
                      <div
                        key={rev.id}
                        className="border border-slate-200 bg-white rounded-2xl p-4 text-xs space-y-1.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900">{rev.author}</span>
                          <span className="text-amber-500 font-bold">
                            {'★'.repeat(rev.rating)}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{rev.text}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">{rev.date} • Verified Buyer</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL IMAGE ZOOM MODAL */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white font-bold text-xl hover:bg-white/40"
          >
            ✕
          </button>
          <img
            src={zoomImage}
            alt="Zoomed product view"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/admin') {
    return <AdminRoute />
  }

  return <ShopApp />
}

export default App


import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'

import BulkProductImport from './BulkProductImport'

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

const PAYMENT_STATUSES = [
  'Pending',
  'Verified',
  'Rejected',
]

const CATEGORY_OPTIONS = [
  'Electrical',
  'Electronics',
  'Robotics',
  'Sensors',
  'Automation',
]

const SUBCATEGORIES = {
  Electrical: [
    'MCB & Breakers',
    'Switch & Socket',
    'Industrial Control',
    'Tools',
    'Contactors',
    'Electrical Accessories',
  ],

  Electronics: [
    'Relay Modules',
    'Display',
    'RFID',
    'Power Module',
    'Electronic Components',
  ],

  Robotics: [
    'Microcontrollers',
    'Motors',
    'Motor Drivers',
    'Robotics Kits',
    'Development Boards',
  ],

  Sensors: [
    'Distance Sensor',
    'Motion Sensor',
    'Temperature & Humidity',
    'IR Sensor',
    'Proximity Sensor',
    'Other Sensors',
  ],

  Automation: [
    'Proximity Sensor',
    'PLC',
    'VFD',
    'Controller',
    'HMI',
    'Industrial Automation',
  ],
}

// Product name অনুযায়ী automatic category/subcategory
const PRODUCT_CATEGORY_RULES = [
  {
    keywords: ['arduino', 'esp32', 'microcontroller', 'development board'],
    category: 'Robotics',
    subcategory: 'Microcontrollers',
  },

  {
    keywords: ['servo motor', 'dc motor', 'stepper motor'],
    category: 'Robotics',
    subcategory: 'Motors',
  },

  {
    keywords: ['motor driver', 'l298', 'l293'],
    category: 'Robotics',
    subcategory: 'Motor Drivers',
  },

  {
    keywords: ['mcb', 'mccb', 'breaker', 'circuit breaker'],
    category: 'Electrical',
    subcategory: 'MCB & Breakers',
  },

  {
    keywords: ['socket', 'switch'],
    category: 'Electrical',
    subcategory: 'Switch & Socket',
  },

  {
    keywords: ['contactor', 'magnetic contactor'],
    category: 'Electrical',
    subcategory: 'Contactors',
  },

  {
    keywords: ['multimeter', 'tester', 'clamp meter'],
    category: 'Electrical',
    subcategory: 'Tools',
  },

  {
    keywords: ['relay module', '5v relay', 'relay'],
    category: 'Electronics',
    subcategory: 'Relay Modules',
  },

  {
    keywords: ['oled', 'lcd', 'display'],
    category: 'Electronics',
    subcategory: 'Display',
  },

  {
    keywords: ['rfid', 'rc522'],
    category: 'Electronics',
    subcategory: 'RFID',
  },

  {
    keywords: ['buck converter', 'lm2596', 'boost converter'],
    category: 'Electronics',
    subcategory: 'Power Module',
  },

  {
    keywords: ['ultrasonic', 'hc-sr04'],
    category: 'Sensors',
    subcategory: 'Distance Sensor',
  },

  {
    keywords: ['pir', 'motion sensor'],
    category: 'Sensors',
    subcategory: 'Motion Sensor',
  },

  {
    keywords: ['dht11', 'dht22', 'temperature', 'humidity'],
    category: 'Sensors',
    subcategory: 'Temperature & Humidity',
  },

  {
    keywords: ['ir sensor', 'infrared', 'obstacle sensor'],
    category: 'Sensors',
    subcategory: 'IR Sensor',
  },

  {
    keywords: ['proximity sensor'],
    category: 'Automation',
    subcategory: 'Proximity Sensor',
  },

  {
    keywords: ['plc'],
    category: 'Automation',
    subcategory: 'PLC',
  },

  {
    keywords: ['vfd', 'motor drive'],
    category: 'Automation',
    subcategory: 'VFD',
  },

  {
    keywords: ['pid controller', 'pid'],
    category: 'Automation',
    subcategory: 'Controller',
  },

  {
    keywords: ['hmi'],
    category: 'Automation',
    subcategory: 'HMI',
  },
]

function AdminPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const [activeTab, setActiveTab] = useState('dashboard')

  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [orderModal, setOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState([])

  const [searchProduct, setSearchProduct] = useState('')
  const [searchOrder, setSearchOrder] = useState('')

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    old_price: '',
    stock: '',
    image: '',
    images: [],
    description: '',
  })

  // --------------------------------
  // CHECK AUTH
  // --------------------------------

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = '/admin'
      return
    }

    setUser(session.user)

    await Promise.all([
      loadProducts(),
      loadOrders(),
    ])

    setLoading(false)
  }

  // --------------------------------
  // LOAD PRODUCTS
  // --------------------------------

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Product loading error:', error)
      return
    }

    setProducts(data || [])
  }

  // --------------------------------
  // LOAD ORDERS
  // --------------------------------

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Order loading error:', error)
      return
    }

    setOrders(data || [])
  }

  // --------------------------------
  // LOGOUT
  // --------------------------------

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin'
  }

  // --------------------------------
  // FIND AUTOMATIC CATEGORY
  // --------------------------------

  const detectProductCategory = (name) => {
    const text = String(name || '').toLowerCase().trim()

    if (!text) {
      return null
    }

    for (const rule of PRODUCT_CATEGORY_RULES) {
      const matched = rule.keywords.some((keyword) =>
        text.includes(keyword.toLowerCase())
      )

      if (matched) {
        return rule
      }
    }

    return null
  }

  // --------------------------------
  // PRODUCT FORM
  // --------------------------------

  const openAddProduct = () => {
    setEditingProduct(null)

    setForm({
      name: '',
      category: '',
      subcategory: '',
      price: '',
      old_price: '',
      stock: '',
      image: '',
      images: [],
      description: '',
    })

    setProductModal(true)
  }

  const openEditProduct = (product) => {
    setEditingProduct(product)

    const normalizedCategory =
      CATEGORY_OPTIONS.find(
        (item) =>
          item.toLowerCase() ===
          String(product.category || '').toLowerCase()
      ) || product.category || ''

    setForm({
      name: product.name || '',
      category: normalizedCategory,
      subcategory: product.subcategory || '',
      price: product.price ?? '',
      old_price: product.old_price ?? '',
      stock: product.stock ?? 0,
      image: product.image || '',
images: (() => {
  const existingImages = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : []

  const mainImage = product.image || ''

  if (mainImage && !existingImages.includes(mainImage)) {
    return [mainImage, ...existingImages]
  }

  return existingImages
})(),
description: product.description || '',
    })

    setProductModal(true)
  }

  const closeProductModal = () => {
    if (saving || uploading) return

    setProductModal(false)
    setEditingProduct(null)
  }

  // --------------------------------
  // NAME CHANGE
  // --------------------------------

  const handleProductNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
    }))

    const detected = detectProductCategory(value)

    if (detected && !editingProduct) {
      setForm((prev) => ({
        ...prev,
        name: value,
        category: detected.category,
        subcategory: detected.subcategory,
      }))
    }
  }

  // --------------------------------
  // CATEGORY CHANGE
  // --------------------------------

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      subcategory: '',
    }))
  }

  // --------------------------------
  // IMAGE UPLOAD
  // --------------------------------

  const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files || [])

  if (files.length === 0) return

  try {
    setUploading(true)

    const uploadedUrls = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()

      const fileName = `products/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error(uploadError)
        continue
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    if (uploadedUrls.length > 0) {
      setForm((prev) => {
        const existingImages = Array.isArray(prev.images)
          ? prev.images
          : []

        const baseImages =
          prev.image && !existingImages.includes(prev.image)
            ? [prev.image, ...existingImages]
            : existingImages

        return {
          ...prev,
          image: prev.image || uploadedUrls[0],
          images: [...baseImages, ...uploadedUrls],
        }
      })
    }

    event.target.value = ''
  } catch (error) {
    console.error(error)
    alert('Image upload failed')
  } finally {
    setUploading(false)
  }
}
  // --------------------------------
  // SAVE PRODUCT
  // --------------------------------

  const saveProduct = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      alert('Product name দিন')
      return
    }

    if (!form.category.trim()) {
      alert('Category নির্বাচন করুন')
      return
    }

    if (form.price === '') {
      alert('Price দিন')
      return
    }

    try {
      setSaving(true)

      const productData = {
        name: form.name.trim(),
        category: form.category.trim(),
        subcategory: form.subcategory
          ? form.subcategory.trim()
          : null,
        price: Number(form.price),
        old_price:
          form.old_price === ''
            ? null
            : Number(form.old_price),
        stock:
          form.stock === ''
            ? 0
            : Number(form.stock),
        image: form.image || null,
        images: Array.isArray(form.images)
  ? form.images
  : [],
        description: form.description.trim() || null,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) {
          console.error(error)
          alert(error.message)
          return
        }

        alert('Product updated successfully')
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) {
          console.error(error)
          alert(error.message)
          return
        }

        alert('Product added successfully')
      }

      setProductModal(false)
      setEditingProduct(null)

      await loadProducts()
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------
  // DELETE PRODUCT
  // --------------------------------

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `"${product.name}" delete করতে চান?`
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    await loadProducts()

    alert('Product deleted successfully')
  }

  // --------------------------------
  // PRODUCT SEARCH
  // --------------------------------

  const filteredProducts = useMemo(() => {
    const search = searchProduct.toLowerCase().trim()

    if (!search) return products

    return products.filter((product) =>
      `${product.name || ''}
       ${product.category || ''}
       ${product.subcategory || ''}
       ${product.description || ''}`
        .toLowerCase()
        .includes(search)
    )
  }, [products, searchProduct])

  // --------------------------------
  // ORDER SEARCH
  // --------------------------------

  const filteredOrders = useMemo(() => {
    const search = searchOrder.toLowerCase().trim()

    if (!search) return orders

    return orders.filter((order) =>
      `${order.order_number || ''}
       ${order.customer_name || ''}
       ${order.phone || ''}
       ${order.status || ''}
       ${order.payment_method || ''}
       ${order.payment_status || ''}
       ${order.transaction_id || ''}`
        .toLowerCase()
        .includes(search)
    )
  }, [orders, searchOrder])

  // --------------------------------
  // ORDER DETAILS
  // --------------------------------

  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    setSelectedOrderItems([])
    setOrderModal(true)

    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .order('id', { ascending: true })

    if (error) {
      console.error('Order items error:', error)
      return
    }

    setSelectedOrderItems(data || [])
  }

  // --------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
      })
      .eq('id', orderId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    )

    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
          }
        : prev
    )
  }

  // --------------------------------
  // UPDATE PAYMENT STATUS
  // --------------------------------

  const updatePaymentStatus = async (
    orderId,
    newPaymentStatus
  ) => {
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: newPaymentStatus,
      })
      .eq('id', orderId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              payment_status: newPaymentStatus,
            }
          : order
      )
    )

    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            payment_status: newPaymentStatus,
          }
        : prev
    )
  }

  // --------------------------------
  // DASHBOARD CALCULATIONS
  // --------------------------------

  const totalProducts = products.length

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status || '').toLowerCase() ===
      'pending'
  ).length

  const deliveredOrders = orders.filter(
    (order) =>
      String(order.status || '').toLowerCase() ===
      'delivered'
  ).length

  const pendingPayments = orders.filter(
    (order) =>
      String(order.payment_status || '').toLowerCase() ===
      'pending'
  ).length

  const verifiedPayments = orders.filter(
    (order) =>
      String(order.payment_status || '').toLowerCase() ===
      'verified'
  ).length

  const totalSales = orders
    .filter(
      (order) =>
        String(order.status || '').toLowerCase() !==
        'cancelled'
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    )

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 5
  ).length

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length

  // --------------------------------
  // ORDER STATUS STYLE
  // --------------------------------

  const getStatusStyle = (status) => {
    switch (String(status || '').toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'

      case 'confirmed':
        return 'bg-blue-100 text-blue-700'

      case 'processing':
        return 'bg-purple-100 text-purple-700'

      case 'shipped':
        return 'bg-indigo-100 text-indigo-700'

      case 'delivered':
        return 'bg-green-100 text-green-700'

      case 'cancelled':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  // --------------------------------
  // PAYMENT STATUS STYLE
  // --------------------------------

  const getPaymentStatusStyle = (status) => {
    switch (String(status || '').toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-700'

      case 'rejected':
        return 'bg-red-100 text-red-700'

      case 'pending':
        return 'bg-yellow-100 text-yellow-700'

      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  // --------------------------------
  // PAYMENT METHOD ICON
  // --------------------------------

  const getPaymentIcon = (method) => {
    switch (String(method || '').toLowerCase()) {
      case 'bkash':
        return '📱'

      case 'nagad':
        return '💳'

      case 'cash on delivery':
        return '💵'

      default:
        return '💰'
    }
  }

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚡</div>

          <p className="text-slate-600 font-semibold">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    )
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              ⚡ ZA TechMart
            </h1>

            <p className="text-slate-400 text-xs">
              Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:block text-right">

              <p className="text-sm font-semibold">
                Admin
              </p>

              <p className="text-xs text-slate-400">
                {user?.email}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* NAVIGATION */}

        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📦 Products
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🛒 Orders
          </button>

        </div>


        {/* ================= DASHBOARD ================= */}

        {activeTab === 'dashboard' && (
          <div>

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-slate-900">
                Dashboard
              </h2>

              <p className="text-slate-500">
                ZA TechMart overview
              </p>

            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

              <StatCard
                title="Products"
                value={totalProducts}
                icon="📦"
              />

              <StatCard
                title="Orders"
                value={totalOrders}
                icon="🛒"
              />

              <StatCard
                title="Pending"
                value={pendingOrders}
                icon="⏳"
              />

              <StatCard
                title="Delivered"
                value={deliveredOrders}
                icon="✅"
              />

              <StatCard
                title="Low Stock"
                value={lowStockProducts}
                icon="⚠️"
              />

              <StatCard
                title="Out Stock"
                value={outOfStockProducts}
                icon="🚫"
              />

            </div>


            {/* PAYMENT SUMMARY */}

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div className="bg-white rounded-2xl shadow-sm p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Pending Payments
                    </p>

                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {pendingPayments}
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-3xl">
                    ⏳
                  </div>

                </div>

              </div>


              <div className="bg-white rounded-2xl shadow-sm p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      Verified Payments
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {verifiedPayments}
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
                    ✅
                  </div>

                </div>

              </div>

            </div>


            {/* SALES */}

            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">

              <p className="text-sm text-slate-500">
                Total Sales
              </p>

              <p className="text-4xl font-bold text-green-600 mt-2">
                ৳ {totalSales.toLocaleString()}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Cancelled orders বাদ দিয়ে
              </p>

            </div>


            {/* RECENT ORDERS */}

            <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="p-5 border-b">

                <h3 className="text-lg font-bold">
                  Recent Orders
                </h3>

              </div>

              {orders.length === 0 ? (

                <div className="p-10 text-center text-slate-400">
                  এখনো কোনো order নেই
                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[850px]">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="text-left p-4 text-sm">
                          Order
                        </th>

                        <th className="text-left p-4 text-sm">
                          Customer
                        </th>

                        <th className="text-left p-4 text-sm">
                          Total
                        </th>

                        <th className="text-left p-4 text-sm">
                          Payment
                        </th>

                        <th className="text-left p-4 text-sm">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {orders.slice(0, 5).map((order) => (

                        <tr
                          key={order.id}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="p-4 font-semibold">
                            #{order.order_number}
                          </td>

                          <td className="p-4">
                            {order.customer_name}
                          </td>

                          <td className="p-4 font-semibold">
                            ৳ {Number(
                              order.total || 0
                            ).toLocaleString()}
                          </td>

                          <td className="p-4">

                            <div className="flex flex-col gap-1">

                              <span className="text-sm font-semibold">
                                {getPaymentIcon(
                                  order.payment_method
                                )}{' '}
                                {order.payment_method}
                              </span>

                              <span
                                className={`w-fit px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusStyle(
                                  order.payment_status
                                )}`}
                              >
                                {order.payment_status ||
                                  'Pending'}
                              </span>

                            </div>

                          </td>

                          <td className="p-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>
        )}


        {/* ================= PRODUCTS ================= */}

        {activeTab === 'products' && (
          <div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Product Management
                </h2>

                <p className="text-slate-500">
                  Add, edit, delete and manage stock
                </p>

              </div>

              <button
                onClick={openAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold"
              >
                + Add Product
              </button>

            </div>
<BulkProductImport
  onImported={loadProducts}
/>

            {/* SEARCH */}

            <div className="bg-white rounded-2xl shadow-sm p-4 mb-5">

              <input
                type="text"
                value={searchProduct}
                onChange={(e) =>
                  setSearchProduct(e.target.value)
                }
                placeholder="Search product, category or description..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* PRODUCT TABLE */}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left p-4">
                        Product
                      </th>

                      <th className="text-left p-4">
                        Category
                      </th>

                      <th className="text-left p-4">
                        Subcategory
                      </th>

                      <th className="text-left p-4">
                        Price
                      </th>

                      <th className="text-left p-4">
                        Stock
                      </th>

                      <th className="text-left p-4">
                        Status
                      </th>

                      <th className="text-left p-4">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.map((product) => {

                      const stock = Number(
                        product.stock || 0
                      )

                      return (
                        <tr
                          key={product.id}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-14 h-14 rounded-xl object-cover border"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                                  {product.icon || '⚡'}
                                </div>
                              )}

                              <div>

                                <p className="font-bold text-slate-900">
                                  {product.name}
                                </p>

                                {product.description && (
                                  <p className="text-xs text-slate-400 max-w-[260px] truncate">
                                    {product.description}
                                  </p>
                                )}

                                <p className="text-xs text-slate-400">
                                  ID: {product.id}
                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                              {product.category}
                            </span>
                          </td>


                          <td className="p-4 text-sm text-slate-600">
                            {product.subcategory || '—'}
                          </td>


                          <td className="p-4">

                            <p className="font-bold">
                              ৳ {Number(
                                product.price || 0
                              ).toLocaleString()}
                            </p>

                            {product.old_price && (
                              <p className="text-xs text-slate-400 line-through">
                                ৳ {Number(
                                  product.old_price
                                ).toLocaleString()}
                              </p>
                            )}

                          </td>


                          <td className="p-4">

                            <span className="font-bold">
                              {stock}
                            </span>

                          </td>


                          <td className="p-4">

                            {stock <= 0 ? (

                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                Out of Stock
                              </span>

                            ) : stock <= 5 ? (

                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                Low Stock
                              </span>

                            ) : (

                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                In Stock
                              </span>

                            )}

                          </td>


                          <td className="p-4">

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  openEditProduct(product)
                                }
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg font-semibold"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  deleteProduct(product)
                                }
                                className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg font-semibold"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>


              {filteredProducts.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                  কোনো product পাওয়া যায়নি
                </div>
              )}

            </div>

          </div>
        )}


        {/* ================= ORDERS ================= */}

        {activeTab === 'orders' && (
          <div>

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Order Management
              </h2>

              <p className="text-slate-500">
                Customer orders manage করুন
              </p>

            </div>


            <div className="bg-white rounded-2xl shadow-sm p-4 mb-5">

              <input
                type="text"
                value={searchOrder}
                onChange={(e) =>
                  setSearchOrder(e.target.value)
                }
                placeholder="Search Order ID, customer, phone, payment or status..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1200px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left p-4">
                        Order
                      </th>

                      <th className="text-left p-4">
                        Customer
                      </th>

                      <th className="text-left p-4">
                        Phone
                      </th>

                      <th className="text-left p-4">
                        Total
                      </th>

                      <th className="text-left p-4">
                        Payment
                      </th>

                      <th className="text-left p-4">
                        Order Status
                      </th>

                      <th className="text-left p-4">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="border-t hover:bg-slate-50"
                      >

                        <td className="p-4">

                          <p className="font-bold">
                            #{order.order_number}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID: {order.id}
                          </p>

                        </td>


                        <td className="p-4">

                          <p className="font-semibold">
                            {order.customer_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.district}
                          </p>

                        </td>


                        <td className="p-4">
                          {order.phone}
                        </td>


                        <td className="p-4">

                          <p className="font-bold">
                            ৳ {Number(
                              order.total || 0
                            ).toLocaleString()}
                          </p>

                        </td>


                        <td className="p-4">

                          <div className="space-y-2">

                            <p className="font-semibold text-sm">
                              {getPaymentIcon(
                                order.payment_method
                              )}{' '}
                              {order.payment_method ||
                                'N/A'}
                            </p>

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusStyle(
                                order.payment_status
                              )}`}
                            >
                              {order.payment_status ||
                                'Pending'}
                            </span>

                          </div>

                        </td>


                        <td className="p-4">

                          <select
                            value={
                              order.status ||
                              'Pending'
                            }
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value
                              )
                            }
                            className={`px-3 py-2 rounded-lg border-0 font-bold text-sm outline-none ${getStatusStyle(
                              order.status
                            )}`}
                          >

                            {ORDER_STATUSES.map(
                              (status) => (

                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>

                              )
                            )}

                          </select>

                        </td>


                        <td className="p-4">

                          <button
                            onClick={() =>
                              openOrderDetails(order)
                            }
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            View Details
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {filteredOrders.length === 0 && (
                <div className="p-12 text-center">

                  <div className="text-5xl mb-4">
                    🛒
                  </div>

                  <p className="text-slate-500">
                    কোনো order পাওয়া যায়নি
                  </p>

                </div>
              )}

            </div>

          </div>
        )}

      </main>


      {/* ================= PRODUCT MODAL ================= */}

      {productModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add Product'}
                </h2>

                <p className="text-sm text-slate-400">
                  Product information
                </p>

              </div>

              <button
                onClick={closeProductModal}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>


            <form
              onSubmit={saveProduct}
              className="p-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    handleProductNameChange(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Arduino UNO R3"
                  required
                />

                {!editingProduct && (
                  <p className="text-xs text-blue-500 mt-2">
                    💡 Product name লিখলে category automatic detect করার চেষ্টা করবে
                  </p>
                )}

              </div>


              {/* CATEGORY + SUBCATEGORY */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      handleCategoryChange(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    {CATEGORY_OPTIONS.map(
                      (category) => (

                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>

                      )
                    )}

                  </select>

                </div>


                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Subcategory
                  </label>

                  <select
                    value={form.subcategory}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        subcategory:
                          e.target.value,
                      })
                    }
                    disabled={!form.category}
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                  >

                    <option value="">
                      Select Subcategory
                    </option>

                    {(
                      SUBCATEGORIES[
                        form.category
                      ] || []
                    ).map((subcategory) => (

                      <option
                        key={subcategory}
                        value={subcategory}
                      >
                        {subcategory}
                      </option>

                    ))}

                  </select>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Product Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder="Write product description..."
                />

                <p className="text-xs text-slate-400 mt-2">
                  Product-এর features, specification এবং ব্যবহার সম্পর্কে লিখুন।
                </p>

              </div>


              {/* PRICE */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                    required
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Old Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.old_price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        old_price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="650"
                  />

                </div>

              </div>


              {/* STOCK */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />

                <div className="mt-2">

                  {Number(form.stock || 0) <= 0 ? (

                    <span className="text-sm text-red-600 font-semibold">
                      🚫 Out of Stock
                    </span>

                  ) : Number(form.stock) <= 5 ? (

                    <span className="text-sm text-yellow-600 font-semibold">
                      ⚠️ Low Stock
                    </span>

                  ) : (

                    <span className="text-sm text-green-600 font-semibold">
                      ✅ In Stock
                    </span>

                  )}

                </div>

              </div>


              {/* IMAGE */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Product Image
                </label>

                <input
  type="file"
  accept="image/*"
  multiple
  onChange={handleImageUpload}
  className="w-full px-4 py-3 border rounded-xl"
/>

                {uploading && (
                  <p className="text-sm text-blue-600 mt-2">
                    Uploading image...
                  </p>
                )}

                {form.images.length > 0 && (
  <div className="mt-4">

    <p className="text-sm font-semibold mb-3">
      Product Images ({form.images.length})
    </p>

    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

      {form.images.map((img, index) => (

        <div
          key={img}
          className="relative group border rounded-xl overflow-hidden bg-white"
        >

          <img
  src={img}
  alt={`Preview ${index + 1}`}
  onClick={() => {
    setForm((prev) => ({
      ...prev,
      image: img,
      images: [
        img,
        ...prev.images.filter((image) => image !== img),
      ],
    }))
  }}
  className="w-full h-28 object-contain p-2 cursor-pointer"
/>

          {index === 0 && (
  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
    ✓ Main Image
  </span>
)}

          <button
            type="button"
            onClick={() => {
              setForm((prev) => {

                const nextImages = prev.images.filter(
                  (_, imageIndex) => imageIndex !== index
                )

                return {
                  ...prev,
                  images: nextImages,
                  image:
                    nextImages.length > 0
                      ? nextImages[0]
                      : '',
                }
              })
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white font-bold opacity-0 group-hover:opacity-100 transition"
          >
            ×
          </button>

        </div>

      ))}

    </div>

  </div>
)}
              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeProductModal}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold"
                >
                  {saving
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Add Product'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ================= ORDER DETAILS MODAL ================= */}

      {orderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Order #{selectedOrder.order_number}
                </h2>

                <p className="text-sm text-slate-400">
                  Order ID: {selectedOrder.id}
                </p>

              </div>

              <button
                onClick={() => setOrderModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>


            <div className="p-6 space-y-6">

              {/* CUSTOMER */}

              <div>

                <h3 className="font-bold text-lg mb-3">
                  👤 Customer Information
                </h3>

                <div className="bg-slate-50 rounded-xl p-4 grid md:grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-400">
                      Name
                    </p>

                    <p className="font-semibold">
                      {selectedOrder.customer_name}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-400">
                      Phone
                    </p>

                    <p className="font-semibold">
                      {selectedOrder.phone}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-400">
                      District
                    </p>

                    <p className="font-semibold">
                      {selectedOrder.district}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-400">
                      Payment Method
                    </p>

                    <p className="font-semibold">
                      {getPaymentIcon(
                        selectedOrder.payment_method
                      )}{' '}
                      {selectedOrder.payment_method ||
                        'N/A'}
                    </p>

                  </div>


                  <div className="md:col-span-2">

                    <p className="text-xs text-slate-400">
                      Delivery Address
                    </p>

                    <p className="font-semibold">
                      {selectedOrder.address}
                    </p>

                  </div>

                </div>

              </div>


              {/* PAYMENT */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-bold text-lg">
                    💳 Payment Information
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusStyle(
                      selectedOrder.payment_status
                    )}`}
                  >
                    {selectedOrder.payment_status ||
                      'Pending'}
                  </span>

                </div>


                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-slate-500">
                      Payment Method
                    </span>

                    <span className="font-bold">
                      {getPaymentIcon(
                        selectedOrder.payment_method
                      )}{' '}
                      {selectedOrder.payment_method ||
                        'N/A'}
                    </span>

                  </div>


                  {selectedOrder.payment_method !==
                    'Cash on Delivery' && (

                    <>
                      <div className="flex items-center justify-between gap-4">

                        <span className="text-sm text-slate-500">
                          Payment Number
                        </span>

                        <span className="font-bold">
                          {selectedOrder.payment_number ||
                            'N/A'}
                        </span>

                      </div>


                      <div className="flex items-center justify-between gap-4">

                        <span className="text-sm text-slate-500">
                          Transaction ID
                        </span>

                        <span className="font-bold break-all text-right">
                          {selectedOrder.transaction_id ||
                            'N/A'}
                        </span>

                      </div>
                    </>
                  )}


                  <div className="border-t border-blue-200 pt-4">

                    <label className="block text-sm font-semibold mb-2">
                      Payment Status
                    </label>

                    <select
                      value={
                        selectedOrder.payment_status ||
                        'Pending'
                      }
                      onChange={(e) =>
                        updatePaymentStatus(
                          selectedOrder.id,
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 rounded-xl border-0 outline-none font-bold ${getPaymentStatusStyle(
                        selectedOrder.payment_status
                      )}`}
                    >

                      {PAYMENT_STATUSES.map(
                        (status) => (

                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>


              {/* ORDER STATUS */}

              <div>

                <h3 className="font-bold text-lg mb-3">
                  📌 Order Status
                </h3>

                <select
                  value={
                    selectedOrder.status ||
                    'Pending'
                  }
                  onChange={(e) =>
                    updateOrderStatus(
                      selectedOrder.id,
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3 rounded-xl font-bold border-0 outline-none ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >

                  {ORDER_STATUSES.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* PRODUCTS */}

              <div>

                <h3 className="font-bold text-lg mb-3">
                  🛒 Ordered Products
                </h3>

                {selectedOrderItems.length === 0 ? (

                  <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-400">
                    Loading products...
                  </div>

                ) : (

                  <div className="border rounded-xl overflow-hidden">

                    {selectedOrderItems.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4"
                        >

                          <div>

                            <p className="font-bold">
                              {item.product_name}
                            </p>

                            <p className="text-sm text-slate-400">
                              ৳ {Number(
                                item.price || 0
                              ).toLocaleString()} ×{' '}
                              {item.quantity}
                            </p>

                          </div>


                          <p className="font-bold">

                            ৳ {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* TOTAL */}

              <div className="bg-slate-900 text-white rounded-2xl p-5">

                <div className="flex justify-between py-2">

                  <span className="text-slate-300">
                    Subtotal
                  </span>

                  <span>
                    ৳ {Number(
                      selectedOrder.subtotal || 0
                    ).toLocaleString()}
                  </span>

                </div>


                <div className="flex justify-between py-2">

                  <span className="text-slate-300">
                    Delivery
                  </span>

                  <span>
                    ৳ {Number(
                      selectedOrder.delivery_charge || 0
                    ).toLocaleString()}
                  </span>

                </div>


                <div className="border-t border-slate-700 mt-3 pt-4 flex justify-between">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-400">
                    ৳ {Number(
                      selectedOrder.total || 0
                    ).toLocaleString()}
                  </span>

                </div>

              </div>


              <button
                onClick={() => setOrderModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 py-3 rounded-xl font-bold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}


// =====================================
// STAT CARD
// =====================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <div className="text-3xl mb-3">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  )
}

export default AdminPage


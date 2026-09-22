import { useState } from 'react'
import { supabase } from './lib/supabase'

const statuses = [
  {
    name: 'Pending',
    icon: '🕐',
    description: 'Order received',
  },
  {
    name: 'Confirmed',
    icon: '✓',
    description: 'Order confirmed',
  },
  {
    name: 'Processing',
    icon: '⚙️',
    description: 'Preparing your order',
  },
  {
    name: 'Shipped',
    icon: '🚚',
    description: 'Order is on the way',
  },
  {
    name: 'Delivered',
    icon: '📦',
    description: 'Order delivered',
  },
]

function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackOrder = async (e) => {
    e.preventDefault()

    if (!orderNumber.trim() || !phone.trim()) {
      setError('Order ID এবং Phone Number দিন')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    const { data, error } = await supabase.rpc('track_order', {
      p_order_number: orderNumber.trim(),
      p_phone: phone.trim(),
    })

    setLoading(false)

    if (error) {
      console.error(error)
      setError('Order tracking করা যাচ্ছে না। আবার চেষ্টা করুন।')
      return
    }

    if (!data?.success) {
      setError('এই Order ID এবং Phone Number দিয়ে কোনো order পাওয়া যায়নি।')
      return
    }

    setOrder(data.order)
  }

  const getStatusIndex = (status) => {
    return statuses.findIndex(
      (item) => item.name.toLowerCase() === status?.toLowerCase()
    )
  }

  const currentStatus = getStatusIndex(order?.status)

  return (
    <section
      id="track-order"
      className="bg-[#0B0F17] text-slate-100 py-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">

          <p className="text-amber-400 font-black text-sm tracking-widest uppercase">
            ORDER TRACKING
          </p>

          <h2 className="text-3xl sm:text-4xl font-black mt-2 gold-gradient-text">
            Track Your Order Status
          </h2>

          <p className="text-slate-400 mt-3 text-sm">
            Enter your Order ID and phone number to check live order status.
          </p>

        </div>

        {/* SEARCH FORM */}
        <div className="max-w-2xl mx-auto bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-gold">

          <form
            onSubmit={trackOrder}
            className="grid sm:grid-cols-2 gap-4"
          >

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Order ID
              </label>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Example: ZAT-123456"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-slate-100 focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-slate-100 focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient-btn disabled:opacity-50 py-4 rounded-xl font-black text-sm shadow-gold"
              >
                {loading ? 'Tracking...' : '🔎 Track Order'}
              </button>

            </div>

          </form>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

        </div>

        {/* ORDER RESULT */}
        {order && (
          <div className="mt-10">

            {/* ORDER HEADER */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <p className="text-sm text-slate-400">
                    Order ID
                  </p>

                  <h3 className="text-2xl font-black text-amber-400">
                    {order.order_number}
                  </h3>
                </div>

                <div className="sm:text-right">

                  <p className="text-sm text-slate-400">
                    Current Status
                  </p>

                  <span className="inline-block mt-1 gold-gradient-bg text-slate-950 px-4 py-2 rounded-full font-black text-sm shadow-gold">
                    {order.status}
                  </span>

                </div>

              </div>

              {/* STATUS TRACKER */}
              {order.status === 'Cancelled' ? (

                <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">

                  <div className="text-4xl">❌</div>

                  <h3 className="font-black text-xl text-red-400 mt-3">
                    Order Cancelled
                  </h3>

                  <p className="text-red-300 mt-1 text-sm">
                    This order has been cancelled.
                  </p>

                </div>

              ) : (

                <div className="mt-10">

                  <div className="grid grid-cols-5 gap-2">

                    {statuses.map((status, index) => {

                      const completed = index <= currentStatus
                      const active = index === currentStatus

                      return (
                        <div
                          key={status.name}
                          className="relative text-center"
                        >

                          <div
                            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-lg font-black transition ${
                              completed
                                ? 'gold-gradient-bg text-slate-950 shadow-gold'
                                : 'bg-slate-950 border border-slate-800 text-slate-600'
                            } ${
                              active
                                ? 'ring-4 ring-amber-500/30'
                                : ''
                            }`}
                          >
                            {status.icon}
                          </div>

                          <p
                            className={`text-xs sm:text-sm font-bold mt-3 ${
                              completed
                                ? 'text-amber-400'
                                : 'text-slate-600'
                            }`}
                          >
                            {status.name}
                          </p>

                          <p className="hidden sm:block text-[11px] text-slate-500 mt-1">
                            {status.description}
                          </p>

                        </div>
                      )
                    })}

                  </div>

                  <div className="mt-6 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">

                    <div
                      className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                      style={{
                        width:
                          currentStatus <= 0
                            ? '0%'
                            : `${(currentStatus / (statuses.length - 1)) * 100}%`,
                      }}
                    />

                  </div>

                </div>

              )}

            </div>

            {/* CUSTOMER + ORDER DETAILS */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">

              {/* CUSTOMER */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

                <h3 className="font-black text-xl mb-5 text-amber-400">
                  Customer Information
                </h3>

                <div className="space-y-4 text-sm">

                  <div>
                    <p className="text-slate-500">Name</p>
                    <p className="font-bold text-slate-100">{order.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Phone</p>
                    <p className="font-bold text-slate-100">{order.phone}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">District & Address</p>
                    <p className="font-bold text-slate-100">{order.district} — {order.address}</p>
                  </div>

                </div>

              </div>

              {/* ORDER SUMMARY */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

                <h3 className="font-black text-xl mb-5 text-amber-400">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between text-slate-400">
                    <span>Payment Method</span>
                    <span className="font-bold text-slate-100">{order.payment_method}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-100">৳{order.subtotal?.toLocaleString('en-BD')}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-slate-100">৳{order.delivery_charge?.toLocaleString('en-BD')}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-amber-400 border-t border-slate-800 pt-3">
                    <span>Total Paid</span>
                    <span>৳{order.total?.toLocaleString('en-BD')}</span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}

export default OrderTracking
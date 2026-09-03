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
      className="bg-slate-50 border-y border-slate-200 py-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">

          <p className="text-blue-600 font-black text-sm tracking-widest">
            ORDER TRACKING
          </p>

          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            Track Your Order
          </h2>

          <p className="text-slate-500 mt-3">
            Enter your Order ID and phone number to check your order status.
          </p>

        </div>

        {/* SEARCH FORM */}
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">

          <form
            onSubmit={trackOrder}
            className="grid sm:grid-cols-2 gap-4"
          >

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Order ID
              </label>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Example: ZAT-123456"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-black transition"
              >
                {loading ? 'Tracking...' : '🔎 Track Order'}
              </button>

            </div>

          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

        </div>

        {/* ORDER RESULT */}
        {order && (
          <div className="mt-10">

            {/* ORDER HEADER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Order ID
                  </p>

                  <h3 className="text-2xl font-black text-blue-600">
                    {order.order_number}
                  </h3>
                </div>

                <div className="sm:text-right">

                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <span className="inline-block mt-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-black text-sm">
                    {order.status}
                  </span>

                </div>

              </div>

              {/* STATUS TRACKER */}
              {order.status === 'Cancelled' ? (

                <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

                  <div className="text-4xl">
                    ❌
                  </div>

                  <h3 className="font-black text-xl text-red-600 mt-3">
                    Order Cancelled
                  </h3>

                  <p className="text-red-500 mt-1">
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
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-400'
                            } ${
                              active
                                ? 'ring-4 ring-blue-100'
                                : ''
                            }`}
                          >
                            {status.icon}
                          </div>

                          <p
                            className={`text-xs sm:text-sm font-bold mt-3 ${
                              completed
                                ? 'text-blue-600'
                                : 'text-slate-400'
                            }`}
                          >
                            {status.name}
                          </p>

                          <p className="hidden sm:block text-[11px] text-slate-400 mt-1">
                            {status.description}
                          </p>

                        </div>
                      )
                    })}

                  </div>

                  <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-700"
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
              <div className="bg-white border border-slate-200 rounded-3xl p-6">

                <h3 className="font-black text-xl mb-5">
                  Customer Information
                </h3>

                <div className="space-y-4 text-sm">

                  <div>
                    <p className="text-slate-400">
                      Name
                    </p>

                    <p className="font-bold mt-1">
                      {order.customer_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Phone
                    </p>

                    <p className="font-bold mt-1">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      District
                    </p>

                    <p className="font-bold mt-1">
                      {order.district}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Address
                    </p>

                    <p className="font-bold mt-1">
                      {order.address}
                    </p>
                  </div>

                </div>

              </div>

              {/* PAYMENT */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6">

                <h3 className="font-black text-xl mb-5">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">

                  {order.items?.map((item, index) => (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex justify-between gap-4"
                    >

                      <span className="text-slate-600">
                        {item.product_name} × {item.quantity}
                      </span>

                      <span className="font-bold whitespace-nowrap">
                        ৳{item.price * item.quantity}
                      </span>

                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4 space-y-3">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-bold">
                        ৳{order.subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Delivery
                      </span>

                      <span className="font-bold">
                        ৳{order.delivery_charge}
                      </span>
                    </div>

                    <div className="flex justify-between text-lg">

                      <span className="font-black">
                        Total
                      </span>

                      <span className="font-black text-blue-600">
                        ৳{order.total}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="mt-5 bg-slate-50 rounded-xl p-4">

                  <p className="text-xs text-slate-400">
                    Payment Method
                  </p>

                  <p className="font-black mt-1">
                    {order.payment_method}
                  </p>

                </div>

              </div>

            </div>

            {/* TRACK ANOTHER */}
            <div className="text-center mt-8">

              <button
                onClick={() => {
                  setOrder(null)
                  setOrderNumber('')
                  setPhone('')
                  setError('')
                }}
                className="text-blue-600 font-bold hover:text-blue-700"
              >
                ← Track Another Order
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}

export default OrderTracking
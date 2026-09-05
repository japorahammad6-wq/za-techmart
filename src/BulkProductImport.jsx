
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from './lib/supabase'

function BulkProductImport({ onImported }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')

  const downloadTemplate = () => {
    const templateData = [
      {
        name: 'Arduino UNO R3',
        category: 'Robotics',
        subcategory: 'Microcontrollers',
        price: 850,
        old_price: 1000,
        stock: 20,
        image: 'https://example.com/arduino-uno.jpg',
        description: 'Arduino UNO R3 development board',
      },
      {
        name: 'HC-SR04 Ultrasonic Sensor',
        category: 'Sensors',
        subcategory: 'Distance Sensor',
        price: 180,
        old_price: 220,
        stock: 50,
        image: 'https://example.com/hc-sr04.jpg',
        description: 'Ultrasonic distance measurement sensor',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Products'
    )

    XLSX.writeFile(
      workbook,
      'ZA-TechMart-Product-Template.xlsx'
    )
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)

        const workbook = XLSX.read(data, {
          type: 'array',
        })

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: '',
          }
        )

        setRows(jsonData)
      } catch (error) {
        console.error(error)
        alert('Excel file পড়তে সমস্যা হয়েছে')
      }
    }

    reader.readAsArrayBuffer(file)

    event.target.value = ''
  }

  const importProducts = async () => {
    if (rows.length === 0) {
      alert('আগে Excel file নির্বাচন করুন')
      return
    }

    try {
      setLoading(true)

      const products = rows
        .map((row) => ({
          name: String(row.name || '').trim(),

          category: String(row.category || '').trim(),

          subcategory:
            String(row.subcategory || '').trim() || null,

          price: Number(row.price || 0),

          old_price:
            row.old_price === ''
              ? null
              : Number(row.old_price || 0),

          stock: Number(row.stock || 0),

          image:
            String(row.image || '').trim() || null,

          images: row.image
            ? [String(row.image).trim()]
            : [],

          description:
            String(row.description || '').trim() || null,
        }))
        .filter(
          (product) =>
            product.name &&
            product.category &&
            product.price >= 0
        )

      if (products.length === 0) {
        alert('Valid product পাওয়া যায়নি')
        return
      }

      const { error } = await supabase
        .from('products')
        .insert(products)

      if (error) {
        console.error(error)
        alert(error.message)
        return
      }

      alert(
        `${products.length} টি product successfully imported`
      )

      setRows([])
      setFileName('')

      if (onImported) {
        onImported()
      }
    } catch (error) {
      console.error(error)
      alert('Bulk import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            📥 Bulk Product Import
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Excel file দিয়ে একসাথে অনেক product যোগ করুন
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={downloadTemplate}
            className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold"
          >
            📥 Download Template
          </button>

          <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold text-center">
            📄 Choose Excel

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

        </div>

      </div>

      {fileName && (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl">

          <p className="text-sm font-semibold">
            📄 {fileName}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {rows.length} টি row পাওয়া গেছে
          </p>

        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-5">

          <div className="overflow-x-auto border rounded-xl">

            <table className="w-full min-w-[900px]">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left p-3 text-sm">
                    Name
                  </th>

                  <th className="text-left p-3 text-sm">
                    Category
                  </th>

                  <th className="text-left p-3 text-sm">
                    Subcategory
                  </th>

                  <th className="text-left p-3 text-sm">
                    Price
                  </th>

                  <th className="text-left p-3 text-sm">
                    Stock
                  </th>

                  <th className="text-left p-3 text-sm">
                    Image
                  </th>

                </tr>

              </thead>

              <tbody>

                {rows.slice(0, 10).map((row, index) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="p-3 font-semibold">
                      {row.name}
                    </td>

                    <td className="p-3">
                      {row.category}
                    </td>

                    <td className="p-3">
                      {row.subcategory || '—'}
                    </td>

                    <td className="p-3">
                      ৳ {row.price}
                    </td>

                    <td className="p-3">
                      {row.stock || 0}
                    </td>

                    <td className="p-3 max-w-[200px] truncate">
                      {row.image || '—'}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {rows.length > 10 && (
            <p className="text-xs text-slate-400 mt-2">
              প্রথম ১০টি row preview দেখানো হচ্ছে।
              মোট {rows.length} টি product import হবে।
            </p>
          )}

          <div className="flex gap-3 mt-4">

            <button
              type="button"
              onClick={() => {
                setRows([])
                setFileName('')
              }}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={importProducts}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold"
            >
              {loading
                ? 'Importing...'
                : `🚀 Import ${rows.length} Products`}
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default BulkProductImport


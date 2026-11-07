import { useEffect, useState } from 'react'
import { getInvestments } from '../api/index.js'

function formatUsd(n) {
  return `USD ${Number(n).toLocaleString('es-AR')}`
}

export default function InvestmentsPage() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    getInvestments(status ? { status } : {})
      .then((res) => setItems(res.data))
      .catch(console.error)
  }, [status])

  return (
    <div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-6 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px]"
      >
        <option value="">Todos los estados</option>
        <option value="active">Activas</option>
        <option value="pending_payment">Pendiente de pago</option>
        <option value="completed">Completadas</option>
        <option value="failed">Fallidas</option>
      </select>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
            <tr>
              <th className="px-5 py-3">Referencia</th>
              <th className="px-5 py-3">Inversor</th>
              <th className="px-5 py-3">Proyecto</th>
              <th className="px-5 py-3">Monto</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {items.map((inv) => (
              <tr key={inv.id}>
                <td className="px-5 py-4 font-mono text-[12px]">{inv.operationRef}</td>
                <td className="px-5 py-4">
                  <p className="font-medium">{inv.userName}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{inv.userEmail}</p>
                </td>
                <td className="px-5 py-4">{inv.opportunityTitle}</td>
                <td className="px-5 py-4 font-medium">{formatUsd(inv.investedUsd)}</td>
                <td className="px-5 py-4 text-[#6B7280]">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

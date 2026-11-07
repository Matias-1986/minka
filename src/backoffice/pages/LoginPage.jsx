import { useState } from 'react'

const SHOW_DEMO_HINT = import.meta.env.DEV

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6B7280] uppercase mb-2">
          MINKA
        </p>
        <h1 className="text-[28px] font-bold text-[#111827] mb-2">Backoffice</h1>
        <p className="text-[14px] text-[#6B7280] mb-8">
          Ingresá con tu cuenta de administrador o viewer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[15px] focus:outline-none focus:border-[#111827]"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-[15px] focus:outline-none focus:border-[#111827]"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-[14px] text-[#DC2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#111827] text-white text-[15px] font-semibold hover:bg-[#1F2937] disabled:opacity-50"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        {SHOW_DEMO_HINT && (
          <div className="mt-8 p-4 rounded-xl bg-[#F9FAFB] text-[12px] text-[#6B7280] leading-relaxed">
            <p className="font-semibold text-[#374151] mb-1">Credenciales de seed (solo desarrollo)</p>
            <p>Ver <code className="text-[11px]">server/README.md</code> tras ejecutar el seed.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function LoginPage({ onLogin, onBrowseWithoutAccount }) {
  const [email, setEmail] = useState('juan.martin@gmail.com')
  const [password, setPassword] = useState('password123')
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
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen px-6 pt-16 pb-10 flex flex-col">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#999] uppercase mb-2">
          MINKA
        </p>
        <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-2 leading-tight">
          Iniciá sesión
        </h1>
        <p className="text-[15px] text-[#888] mb-10 leading-relaxed">
          Ingresá con tu cuenta para ver tu cartera, invertir y gestionar tu perfil.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label className="text-[13px] font-medium text-[#666] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#666] mb-1.5 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#E8E8E8] text-[15px] focus:outline-none focus:border-[#1A1A1A]"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-[14px] text-[#DC2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold disabled:opacity-50"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        {onBrowseWithoutAccount && (
          <button
            type="button"
            onClick={onBrowseWithoutAccount}
            className="mt-6 text-[14px] font-medium text-[#666] text-center"
          >
            Ver oportunidades sin iniciar sesión
          </button>
        )}

        <div className="mt-8 p-4 rounded-2xl bg-[#FAFAFA] text-[12px] text-[#888] leading-relaxed">
          <p className="font-semibold text-[#1A1A1A] mb-1">Demo</p>
          <p>juan.martin@gmail.com / password123</p>
        </div>
      </div>
    </div>
  )
}

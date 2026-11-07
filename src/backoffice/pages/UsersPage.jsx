import { useEffect, useState } from 'react'
import { createUser, getUsers, updateUser } from '../api/index.js'
import { can, isAdmin } from '../permissions.js'
import { useAuth } from '../context/AuthContext.jsx'

const ROLE_BADGE = {
  admin: 'bg-[#DBEAFE] text-[#1D4ED8]',
  viewer: 'bg-[#E0E7FF] text-[#4338CA]',
  investor: 'bg-[#D1FAE5] text-[#065F46]',
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const canWrite = can(currentUser, 'users:write')
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: ['viewer'],
  })

  const load = () => {
    const params = { scope: 'backoffice' }
    if (query) params.q = query
    getUsers(params)
      .then((res) => setUsers(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    load()
  }, [query])

  const toggleActive = async (u) => {
    if (!canWrite) return
    await updateUser(u.id, { isActive: !u.isActive })
    load()
  }

  const changeRole = async (u, role) => {
    if (!canWrite || !isAdmin(currentUser)) return
    await updateUser(u.id, { roles: [role] })
    load()
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await createUser(form)
    setShowForm(false)
    setForm({ email: '', password: '', firstName: '', lastName: '', roles: ['viewer'] })
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o email…"
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[14px]"
        />
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl bg-[#111827] text-white text-[14px] font-semibold"
          >
            + Usuario backoffice
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6 grid grid-cols-2 gap-4">
          {['email', 'password', 'firstName', 'lastName'].map((key) => (
            <input
              key={key}
              type={key === 'password' ? 'password' : 'text'}
              placeholder={key}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              required
              className="px-4 py-3 rounded-xl border border-[#E5E7EB]"
            />
          ))}
          <select
            value={form.roles[0]}
            onChange={(e) => setForm((f) => ({ ...f, roles: [e.target.value] }))}
            className="px-4 py-3 rounded-xl border border-[#E5E7EB]"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="col-span-2 py-3 rounded-xl bg-[#111827] text-white font-semibold">
            Crear usuario
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[#6B7280] text-[12px] uppercase">
            <tr>
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Roles</th>
              <th className="px-5 py-3">KYC</th>
              <th className="px-5 py-3">Estado</th>
              {canWrite && <th className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold">{u.firstName} {u.lastName}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{u.email}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <span key={r} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_BADGE[r] || 'bg-[#F3F4F6]'}`}>
                        {r}
                      </span>
                    ))}
                  </div>
                  {canWrite && isAdmin(currentUser) && u.roles.some((r) => ['admin', 'viewer'].includes(r)) && (
                    <select
                      className="mt-2 text-[12px] border border-[#E5E7EB] rounded-lg px-2 py-1"
                      value={u.roles.find((r) => ['admin', 'viewer'].includes(r)) || 'viewer'}
                      onChange={(e) => changeRole(u, e.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="viewer">viewer</option>
                    </select>
                  )}
                </td>
                <td className="px-5 py-4 text-[#6B7280]">{u.kycStatus}</td>
                <td className="px-5 py-4">
                  <span className={u.isActive ? 'text-[#059669]' : 'text-[#DC2626]'}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {canWrite && (
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleActive(u)}
                      className="text-[13px] text-[#2563EB] hover:underline"
                    >
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

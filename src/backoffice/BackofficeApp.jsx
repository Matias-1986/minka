import { useState } from 'react'
import BackofficeLayout from './components/BackofficeLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import InvestmentsPage from './pages/InvestmentsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OpportunitiesPage from './pages/OpportunitiesPage.jsx'
import OpportunityEditPage from './pages/OpportunityEditPage.jsx'
import InvestorDetailPage from './pages/InvestorDetailPage.jsx'
import InvestorsPage from './pages/InvestorsPage.jsx'
import ManagerEditPage from './pages/ManagerEditPage.jsx'
import ManagersPage from './pages/ManagersPage.jsx'
import MastersPage from './pages/MastersPage.jsx'
import UsersPage from './pages/UsersPage.jsx'

export default function BackofficeApp() {
  const { user, loading, login } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [editId, setEditId] = useState(null)
  const [investorId, setInvestorId] = useState(null)
  const [managerId, setManagerId] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] text-[#6B7280]">
        Cargando…
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={login} />
  }

  const showOpportunityForm = page === 'opportunity-form'
  const showInvestorDetail = page === 'investor-detail'
  const showManagerForm = page === 'manager-form'

  return (
    <BackofficeLayout
      page={
        showOpportunityForm
          ? 'opportunities'
          : showInvestorDetail
            ? 'investors'
            : showManagerForm
              ? 'managers'
              : page
      }
      onNavigate={(p) => {
        setEditId(null)
        setInvestorId(null)
        setManagerId(null)
        setPage(p)
      }}
    >
      {page === 'dashboard' && <DashboardPage />}
      {page === 'opportunities' && !showOpportunityForm && (
        <OpportunitiesPage
          onEdit={(id) => {
            setEditId(id)
            setPage('opportunity-form')
          }}
          onCreate={() => {
            setEditId(null)
            setPage('opportunity-form')
          }}
        />
      )}
      {showOpportunityForm && (
        <OpportunityEditPage
          id={editId}
          onBack={() => {
            setEditId(null)
            setPage('opportunities')
          }}
        />
      )}
      {page === 'investors' && !showInvestorDetail && (
        <InvestorsPage
          onSelect={(id) => {
            setInvestorId(id)
            setPage('investor-detail')
          }}
        />
      )}
      {showInvestorDetail && (
        <InvestorDetailPage
          id={investorId}
          onBack={() => {
            setInvestorId(null)
            setPage('investors')
          }}
        />
      )}
      {page === 'investments' && <InvestmentsPage />}
      {page === 'managers' && !showManagerForm && (
        <ManagersPage
          onSelect={(id) => {
            setManagerId(id)
            setPage('manager-form')
          }}
          onCreate={() => {
            setManagerId(null)
            setPage('manager-form')
          }}
        />
      )}
      {showManagerForm && (
        <ManagerEditPage
          id={managerId}
          onBack={() => {
            setManagerId(null)
            setPage('managers')
          }}
        />
      )}
      {page === 'masters' && <MastersPage />}
      {page === 'users' && <UsersPage />}
    </BackofficeLayout>
  )
}

import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import ShiftForm from '../components/ShiftForm'
import ShiftList from '../components/ShiftList'
import GraficoChamados from '../components/GraficoChamados'

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Passagem de Turno</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ShiftForm user={user} />
        </div>
        <div>
          <GraficoChamados />
          <ShiftList />
        </div>
      </div>
    </div>
  )
}

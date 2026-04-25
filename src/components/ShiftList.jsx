import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Comentarios from './Comentarios'

export default function ShiftList() {
  const [passagens, setPassagens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPassagens = async () => {
      const { data, error } = await supabase
        .from('shift_handovers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      if (!error) setPassagens(data)
      setLoading(false)
    }
    fetchPassagens()
  }, [])

  if (loading) return <p className="text-gray-500">Carregando histórico...</p>

  return (
    <div className="mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Últimas Passagens</h2>
      {passagens.length === 0 && <p className="text-gray-500">Nenhuma passagem registrada.</p>}
      <div className="space-y-4">
        {passagens.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{p.data_shift} – {p.hora_inicio} às {p.hora_fim || '?'}</span>
              <span>Entregue por: {p.entregue_por}</span>
            </div>
            <p className="mt-1"><strong>Resumo:</strong> {p.resumo_geral || '-'}</p>
            {p.forcas_tarefas?.length > 0 && <p><strong>Forças:</strong> {p.forcas_tarefas.join(', ')}</p>}
            {p.chamados_criticos?.length > 0 && <p><strong>Chamados:</strong> {p.chamados_criticos.join(', ')}</p>}
            <Comentarios passagemId={p.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

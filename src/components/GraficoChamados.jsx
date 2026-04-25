import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function GraficoChamados() {
  const [dados, setDados] = useState([])

  useEffect(() => {
    const fetchDados = async () => {
      // Exemplo: contar chamados críticos por data
      const { data } = await supabase
        .from('shift_handovers')
        .select('data_shift, chamados_criticos')
        .order('data_shift', { ascending: false })
        .limit(30)
      if (data) {
        const contagem = {}
        data.forEach((item) => {
          const data = item.data_shift
          contagem[data] = (contagem[data] || 0) + (item.chamados_criticos?.length || 0)
        })
        const arr = Object.entries(contagem).map(([nome, chamados]) => ({ nome, chamados }))
        setDados(arr)
      }
    }
    fetchDados()
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Chamados Críticos por Dia</h2>
      {dados.length === 0 ? (
        <p className="text-gray-500">Sem dados para exibir.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="chamados" fill="#3b82f6" name="Chamados" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

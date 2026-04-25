import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Comentarios({ passagemId }) {
  const [comentarios, setComentarios] = useState([])
  const [novo, setNovo] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchComentarios = async () => {
      const { data } = await supabase
        .from('comentarios')
        .select('*')
        .eq('passagem_id', passagemId)
        .order('created_at', { ascending: true })
      if (data) setComentarios(data)
    }
    fetchComentarios()
  }, [passagemId])

  const enviarComentario = async () => {
    if (!novo.trim()) return
    const { error } = await supabase.from('comentarios').insert({
      passagem_id: passagemId,
      autor_id: user.id,
      conteudo: novo,
    })
    if (!error) {
      setComentarios([...comentarios, { id: Date.now(), autor_id: user.id, conteudo: novo, created_at: new Date() }])
      setNovo('')
    }
  }

  return (
    <div className="mt-3">
      <h4 className="font-medium text-sm">Comentários</h4>
      <div className="ml-2 border-l-2 pl-3 space-y-1">
        {comentarios.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="text-gray-500">{c.autor_id === user.id ? 'Você' : 'Colega'}:</span> {c.conteudo}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 border text-sm p-1 rounded"
        />
        <button onClick={enviarComentario} className="text-blue-600 text-sm">Enviar</button>
      </div>
    </div>
  )
}

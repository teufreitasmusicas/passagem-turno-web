import { useState } from 'react'
import { supabase } from '../lib/supabase'
import AnexoUpload from './AnexoUpload'

export default function ShiftForm({ user }) {
  const [form, setForm] = useState({
    data_shift: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fim: '',
    resumo_geral: '',
    forcas_tarefas: '',
    chamados_criticos: '',
    crise: '',
    monitoramento_eventos: '',
    monitoramento_ferramentas: '',
    rondas: '',
    mudancas: '',
    pontos_atencao: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)
  const [passagemId, setPassagemId] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    // Validação mínima
    if (!form.hora_inicio) {
      setErro('Hora de início é obrigatória.')
      return
    }
    const dados = {
      entregue_por: user.id,
      recebido_por: user.id, // Temporário; ideal seria selecionar o próximo técnico
      data_shift: form.data_shift,
      hora_inicio: form.hora_inicio,
      hora_fim: form.hora_fim || null,
      resumo_geral: form.resumo_geral,
      forcas_tarefas: form.forcas_tarefas ? form.forcas_tarefas.split('\n').filter(Boolean) : [],
      chamados_criticos: form.chamados_criticos ? form.chamados_criticos.split('\n').filter(Boolean) : [],
      crise: form.crise,
      monitoramento_eventos: form.monitoramento_eventos,
      monitoramento_ferramentas: form.monitoramento_ferramentas,
      rondas: form.rondas,
      mudancas: form.mudancas,
      pontos_atencao: form.pontos_atencao,
    }

    const { data, error } = await supabase.from('shift_handovers').insert(dados).select()
    if (error) {
      setErro('Erro ao salvar: ' + error.message)
    } else {
      setEnviado(true)
      setPassagemId(data[0].id)
      // Resetar formulário (opcional)
    }
  }

  if (enviado) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <p className="text-green-600 font-semibold">Passagem salva com sucesso!</p>
        {passagemId && <AnexoUpload passagemId={passagemId} />}
        <button onClick={() => setEnviado(false)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Nova passagem</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Nova Passagem</h2>
      {erro && <p className="text-red-500">{erro}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Data</label>
          <input type="date" name="data_shift" value={form.data_shift} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora Início</label>
          <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora Fim</label>
          <input type="time" name="hora_fim" value={form.hora_fim} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Resumo Geral</label>
        <textarea name="resumo_geral" rows="3" value={form.resumo_geral} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Forças Tarefas (uma por linha)</label>
        <textarea name="forcas_tarefas" rows="3" value={form.forcas_tarefas} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Chamados Críticos (um por linha)</label>
        <textarea name="chamados_criticos" rows="3" value={form.chamados_criticos} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Crise / Ocorrência</label>
        <textarea name="crise" rows="2" value={form.crise} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Monitoramento – Eventos</label>
        <textarea name="monitoramento_eventos" rows="2" value={form.monitoramento_eventos} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Monitoramento – Ferramentas</label>
        <input type="text" name="monitoramento_ferramentas" value={form.monitoramento_ferramentas} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Rondas (horário)</label>
        <input type="text" name="rondas" value={form.rondas} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Mudanças</label>
        <textarea name="mudancas" rows="2" value={form.mudancas} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Pontos de Atenção</label>
        <textarea name="pontos_atencao" rows="2" value={form.pontos_atencao} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salvar Passagem</button>
    </form>
  )
}

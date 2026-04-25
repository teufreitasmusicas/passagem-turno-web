import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AnexoUpload({ passagemId }) {
  const [uploading, setUploading] = useState(false)
  const [arquivos, setArquivos] = useState([])

  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const nome = `${passagemId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('anexos').upload(nome, file)
      if (error) {
        alert(`Erro ao enviar ${file.name}: ${error.message}`)
      } else {
        setArquivos(prev => [...prev, file.name])
      }
    }
    setUploading(false)
  }

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Anexos</h3>
      <input type="file" multiple onChange={handleUpload} disabled={uploading} />
      {uploading && <span className="ml-2 text-sm text-gray-500">Enviando...</span>}
      {arquivos.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600">
          {arquivos.map((nome, i) => <li key={i}>✅ {nome}</li>)}
        </ul>
      )}
    </div>
  )
}

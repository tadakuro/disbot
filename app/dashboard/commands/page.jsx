'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, ChevronRight } from 'lucide-react'

const DEFAULT_CODE = `// Available: interaction, client
// interaction.reply(), interaction.guild, interaction.user, etc.

module.exports = async (interaction) => {
  // Use editReply — deferReply is called automatically before your code runs
  await interaction.editReply({ content: 'Hello!' })
}`

export default function CommandsPage() {
  const [commands, setCommands] = useState([])
  const [selected, setSelected] = useState(null)
  const [code, setCode] = useState('')
  const [commandName, setCommandName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function fetchCommands() {
    const res = await fetch('/api/bot/commands')
    const data = await res.json()
    setCommands(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchCommands() }, [])

  function selectCommand(cmd) {
    setSelected(cmd)
    setCode(cmd.code || DEFAULT_CODE)
    setCommandName(cmd.name || '')
    setDescription(cmd.description || '')
    setSaved(false)
  }

  function newCommand() {
    setSelected(null)
    setCode(DEFAULT_CODE)
    setCommandName('')
    setDescription('')
    setSaved(false)
  }

  async function handleSave() {
    if (!commandName.trim()) return
    setSaving(true)
    setSaved(false)

    const payload = {
      name: commandName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim() || `Custom command: ${commandName}`,
      code,
    }

    if (selected?._id) {
      await fetch('/api/bot/commands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, ...payload }),
      })
      setCommands((prev) => prev.map((c) => (c._id === selected._id ? { ...c, ...payload } : c)))
      setSelected((prev) => ({ ...prev, ...payload }))
    } else {
      const res = await fetch('/api/bot/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      const newCmd = { _id: data.id, ...payload }
      setCommands((prev) => [...prev, newCmd])
      setSelected(newCmd)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDelete() {
    if (!selected?._id) return
    setDeleting(true)
    await fetch('/api/bot/commands', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id }),
    })
    setCommands((prev) => prev.filter((c) => c._id !== selected._id))
    setSelected(null)
    setCode(DEFAULT_CODE)
    setCommandName('')
    setDescription('')
    setDeleting(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-8">
      <div className="w-60 bg-[#16161c] border-r border-[#2e2e3a] flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2e2e3a]">
          <p className="text-xs font-medium text-[#e8e8f0]">Commands</p>
          <button
            onClick={newCommand}
            className="w-6 h-6 rounded-md bg-[#5865f220] text-[#5865f2] hover:bg-[#5865f240] flex items-center justify-center transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-4 h-4 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : commands.length === 0 ? (
            <p className="text-xs text-[#6b6b80] text-center py-6 px-2">No commands yet. Click + to create one.</p>
          ) : (
            commands.map((cmd) => (
              <button
                key={cmd._id}
                onClick={() => selectCommand(cmd)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selected?._id === cmd._id
                    ? 'bg-[#5865f2] text-white'
                    : 'text-[#9999b0] hover:text-[#e8e8f0] hover:bg-[#1e1e26]'
                }`}
              >
                <span className="text-xs font-mono flex-1 truncate">/{cmd.name}</span>
                <ChevronRight size={12} className="flex-shrink-0 opacity-50" />
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0e0e12]">
        {selected !== null || commandName !== '' ? (
          <>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#2e2e3a] bg-[#16161c]">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[#6b6b80] text-sm font-mono">/</span>
                <input
                  type="text"
                  placeholder="command-name"
                  value={commandName}
                  onChange={(e) => setCommandName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="bg-transparent text-sm font-mono text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none w-40"
                />
                <span className="text-[#2e2e3a]">|</span>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-transparent text-sm text-[#9999b0] placeholder-[#6b6b80] focus:outline-none flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                {saved && <span className="text-xs text-[#3ba55d]">Saved!</span>}
                {selected?._id && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 rounded-lg text-[#6b6b80] hover:text-[#ed4245] hover:bg-[#ed424520] transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !commandName.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white text-xs font-medium transition-colors"
                >
                  <Save size={12} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full bg-transparent text-[#e8e8f0] font-mono text-sm p-5 focus:outline-none resize-none leading-relaxed"
                style={{ tabSize: 2 }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    const start = e.target.selectionStart
                    const end = e.target.selectionEnd
                    const newCode = code.substring(0, start) + '  ' + code.substring(end)
                    setCode(newCode)
                    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2 }, 0)
                  }
                }}
              />
            </div>
            <div className="px-5 py-2 border-t border-[#2e2e3a] bg-[#16161c]">
              <p className="text-xs text-[#6b6b80]">After saving, restart the bot from the dashboard to register the new command.</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[#6b6b80]">Select a command or create a new one</p>
            <button
              onClick={newCommand}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium transition-colors"
            >
              <Plus size={14} />
              New Command
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

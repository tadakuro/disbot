'use client'

import { useEffect, useState } from 'react'

export default function ModulePanel({ title, description, apiPath, children, onDataLoad }) {
  const [enabled, setEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => {
    fetch(`/api/bot/${apiPath}`)
      .then((r) => r.json())
      .then((d) => {
        setEnabled(d.enabled || false)
        setData(d)
        if (onDataLoad) onDataLoad(d, setData)
      })
      .finally(() => setLoading(false))
  }, [apiPath, onDataLoad])

  async function handleSave(extra = {}) {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/bot/${apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, enabled, ...extra }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#e8e8f0]">{title}</h1>
          <p className="text-sm text-[#9999b0] mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#5865f2]' : 'bg-[#2e2e3a]'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-sm text-[#9999b0]">{enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      <div className="space-y-4">
        {typeof children === 'function' ? children({ data, setData, enabled }) : children}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-medium text-sm transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="text-sm text-[#3ba55d]">Saved!</span>}
      </div>
    </div>
  )
}

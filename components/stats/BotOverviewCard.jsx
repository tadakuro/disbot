'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { RotateCw, Square, Power } from 'lucide-react'

export default function BotOverviewCard({ bot }) {
  const [status, setStatus] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const avatarUrl = bot?.avatar
    ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`
    : null

  async function fetchStatus() {
    try {
      const res = await fetch('/api/bot/control')
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ online: false })
    }
  }

  async function handleAction(action) {
    setActionLoading(action)
    try {
      await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      setTimeout(fetchStatus, 3000)
    } catch {}
    finally { setActionLoading(null) }
  }

  useEffect(() => { fetchStatus() }, [])

  const isOnline = status?.online
  const statusLabel = status === null ? 'Checking...' : isOnline ? 'Online' : 'Offline'

  return (
    <div className="bg-bg-2 border border-border rounded-xl p-5 shadow-card col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Bot Status</p>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          status === null ? 'bg-bg-3 text-text-muted' :
          isOnline ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === null ? 'bg-text-muted' : isOnline ? 'bg-success animate-pulse-dot' : 'bg-danger'}`} />
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0 shadow-glow-sm">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Bot avatar" width={56} height={56} className="rounded-2xl" />
          ) : (
            <span className="text-white font-bold text-2xl">{bot?.username?.[0]?.toUpperCase() || 'B'}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-text text-base">{bot?.username || 'Unknown Bot'}</p>
          <p className="text-xs text-text-muted mt-0.5 font-mono">ID: {bot?.id || '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { action: 'restart', label: 'Restart', icon: RotateCw, color: 'accent' },
          { action: 'stop', label: 'Stop', icon: Square, color: 'danger' },
          { action: 'start', label: 'Start', icon: Power, color: 'success' },
        ].map(({ action, label, icon: Icon, color }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={actionLoading !== null}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
              color === 'success' ? 'bg-success/10 text-success hover:bg-success/20 border border-success/20' :
              color === 'danger' ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20' :
              'bg-accent-muted text-accent hover:bg-accent/20 border border-accent/20'
            }`}
          >
            <Icon size={12} className={actionLoading === action ? 'animate-spin' : ''} />
            {actionLoading === action ? '...' : label}
          </button>
        ))}
      </div>
    </div>
  )
}

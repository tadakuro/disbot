'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

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
      setStatus({ online: false, status: 'UNKNOWN' })
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
  const statusLabel = status === null
    ? 'Checking...'
    : isOnline ? 'Online' : 'Offline'
  const statusColor = status === null
    ? 'bg-[#6b6b80]'
    : isOnline ? 'bg-[#3ba55d]' : 'bg-[#ed4245]'

  return (
    <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
      <p className="text-xs text-[#6b6b80] uppercase tracking-widest mb-4 font-medium">Bot</p>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Bot avatar" width={48} height={48} className="rounded-full" />
          ) : (
            <span className="text-white font-bold text-lg">
              {bot?.username?.[0]?.toUpperCase() || 'B'}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-[#e8e8f0]">{bot?.username || 'Unknown'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="text-xs text-[#9999b0]">{statusLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleAction('start')}
          disabled={actionLoading !== null}
          className="flex-1 py-2 rounded-lg bg-[#3ba55d20] text-[#3ba55d] hover:bg-[#3ba55d40] disabled:opacity-50 text-xs font-medium transition-colors"
        >
          {actionLoading === 'start' ? '...' : 'Start'}
        </button>
        <button
          onClick={() => handleAction('restart')}
          disabled={actionLoading !== null}
          className="flex-1 py-2 rounded-lg bg-[#5865f220] text-[#5865f2] hover:bg-[#5865f240] disabled:opacity-50 text-xs font-medium transition-colors"
        >
          {actionLoading === 'restart' ? '...' : 'Restart'}
        </button>
        <button
          onClick={() => handleAction('stop')}
          disabled={actionLoading !== null}
          className="flex-1 py-2 rounded-lg bg-[#ed424520] text-[#ed4245] hover:bg-[#ed424540] disabled:opacity-50 text-xs font-medium transition-colors"
        >
          {actionLoading === 'stop' ? '...' : 'Stop'}
        </button>
      </div>
    </div>
  )
}

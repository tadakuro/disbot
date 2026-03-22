'use client'

import { useEffect, useState } from 'react'

function formatUptime(since) {
  if (!since) return '—'
  const diff = Date.now() - new Date(since).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 24) {
    const d = Math.floor(h / 24)
    return `${d}d ${h % 24}h`
  }
  return `${h}h ${m}m`
}

export default function UptimeCard({ uptimeSince }) {
  const [uptime, setUptime] = useState(formatUptime(uptimeSince))

  useEffect(() => {
    if (!uptimeSince) return
    const interval = setInterval(() => {
      setUptime(formatUptime(uptimeSince))
    }, 60000)
    return () => clearInterval(interval)
  }, [uptimeSince])

  return (
    <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
      <p className="text-xs text-[#6b6b80] uppercase tracking-widest mb-4 font-medium">Uptime</p>
      <p className="text-2xl font-bold text-[#e8e8f0] font-mono">{uptime}</p>
      <p className="text-xs text-[#9999b0] mt-0.5">Bot process uptime</p>
    </div>
  )
}

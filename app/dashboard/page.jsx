'use client'

import { useEffect, useState } from 'react'
import BotOverviewCard from '@/components/stats/BotOverviewCard'
import ServerStatsCard from '@/components/stats/ServerStatsCard'
import CommandStatsCard from '@/components/stats/CommandStatsCard'
import ModActivityCard from '@/components/stats/ModActivityCard'
import GiveawayStatusCard from '@/components/stats/GiveawayStatusCard'
import UptimeCard from '@/components/stats/UptimeCard'
import BotConnectForm from '@/components/ui/BotConnectForm'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchStats() {
    try {
      const res = await fetch('/api/bot/stats')
      const data = await res.json()
      setStats(data)
    } catch {
      setStats({ connected: false })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats?.connected) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8f0] mb-2">Dashboard</h1>
        <p className="text-sm text-[#9999b0] mb-8">Connect your bot to get started</p>
        <BotConnectForm onConnected={fetchStats} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#e8e8f0]">Dashboard</h1>
        <p className="text-sm text-[#9999b0] mt-1">Overview of your bot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <BotOverviewCard bot={stats.bot} />
        <ServerStatsCard guilds={stats.guilds} totalMembers={stats.totalMembers} />
        <UptimeCard uptimeSince={stats.uptimeSince} />
        <CommandStatsCard count={stats.commandCount} />
        <ModActivityCard modCount={stats.modCount} automodCount={stats.automodCount} />
        <GiveawayStatusCard active={stats.activeGiveaways} />
      </div>

      <div className="mt-8 p-4 bg-[#16161c] border border-[#2e2e3a] rounded-xl">
        <p className="text-xs text-[#6b6b80]">Bot token is securely stored. <button onClick={fetchStats} className="text-[#5865f2] hover:underline">Refresh stats</button></p>
      </div>
    </div>
  )
}

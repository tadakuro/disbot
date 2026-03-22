'use client'

import { useEffect, useState } from 'react'

function CreateGiveawayForm({ onCreated }) {
  const [form, setForm] = useState({ prize: '', channelId: '', duration: 60, winners: 1 })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/bot/giveaways', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, endsAt: new Date(Date.now() + form.duration * 60000) }),
    })
    setForm({ prize: '', channelId: '', duration: 60, winners: 1 })
    setLoading(false)
    if (onCreated) onCreated()
  }

  return (
    <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-medium text-[#e8e8f0]">Create Giveaway</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Prize"
          value={form.prize}
          onChange={(e) => setForm({ ...form, prize: e.target.value })}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
        />
        <input
          type="text"
          placeholder="Channel ID"
          value={form.channelId}
          onChange={(e) => setForm({ ...form, channelId: e.target.value })}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#6b6b80] mb-1 block">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6b6b80] mb-1 block">Winners</label>
            <input
              type="number"
              min={1}
              value={form.winners}
              onChange={(e) => setForm({ ...form, winners: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-medium text-sm transition-colors"
        >
          {loading ? 'Creating...' : 'Create Giveaway'}
        </button>
      </form>
    </div>
  )
}

export default function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchGiveaways() {
    const res = await fetch('/api/bot/giveaways')
    const data = await res.json()
    setGiveaways(data)
    setLoading(false)
  }

  async function handleAction(id, action) {
    await fetch('/api/bot/giveaways', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    fetchGiveaways()
  }

  useEffect(() => { fetchGiveaways() }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#e8e8f0]">Giveaways</h1>
        <p className="text-sm text-[#9999b0] mt-1">Create and manage giveaways in your server.</p>
      </div>

      <div className="space-y-4">
        <CreateGiveawayForm onCreated={fetchGiveaways} />

        <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
          <h2 className="text-sm font-medium text-[#e8e8f0] mb-4">All Giveaways</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : giveaways.length === 0 ? (
            <p className="text-sm text-[#6b6b80] text-center py-8">No giveaways yet.</p>
          ) : (
            <div className="space-y-3">
              {giveaways.map((g) => (
                <div key={g._id} className="flex items-center justify-between p-4 bg-[#0e0e12] rounded-xl border border-[#2e2e3a]">
                  <div>
                    <p className="text-sm font-medium text-[#e8e8f0]">{g.prize}</p>
                    <p className="text-xs text-[#6b6b80] mt-0.5">
                      {g.winners} winner(s) · Channel {g.channelId} · {g.active ? 'Active' : 'Ended'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {g.active && (
                      <button
                        onClick={() => handleAction(g._id, 'end')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#ed424520] text-[#ed4245] hover:bg-[#ed424540] transition-colors"
                      >
                        End
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(g._id, 'reroll')}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#5865f220] text-[#5865f2] hover:bg-[#5865f240] transition-colors"
                    >
                      Reroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

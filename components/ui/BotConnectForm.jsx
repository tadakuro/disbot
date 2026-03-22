'use client'

import { useState } from 'react'

export default function BotConnectForm({ onConnected }) {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConnect(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bot/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to connect bot')
      } else {
        setToken('')
        if (onConnected) onConnected()
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-[#e8e8f0] mb-1">Connect Your Bot</h2>
        <p className="text-sm text-[#9999b0] mb-5">
          Paste your Discord bot token below. It will be stored securely in your database.
        </p>

        <form onSubmit={handleConnect} className="space-y-4">
          <input
            type="password"
            placeholder="Bot token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] transition-colors text-sm font-mono"
          />

          {error && (
            <p className="text-sm text-[#ed4245]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
          >
            {loading ? 'Connecting...' : 'Connect Bot'}
          </button>
        </form>

        <p className="text-xs text-[#6b6b80] mt-4">
          You can find your bot token in the{' '}
          <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-[#5865f2] hover:underline">
            Discord Developer Portal
          </a>
        </p>
      </div>
    </div>
  )
}

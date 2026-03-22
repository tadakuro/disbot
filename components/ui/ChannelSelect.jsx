'use client'

import { useEffect, useState } from 'react'
import { Hash, Loader2 } from 'lucide-react'

let cachedChannels = null
let cacheTime = 0
const CACHE_TTL = 60000 // 1 minute

export default function ChannelSelect({ value, onChange, placeholder = 'Select a channel', className = '' }) {
  const [channels, setChannels] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Use cache if fresh
    if (cachedChannels && Date.now() - cacheTime < CACHE_TTL) {
      setChannels(cachedChannels.channels)
      setCategories(cachedChannels.categories)
      setLoading(false)
      return
    }

    fetch('/api/bot/channels')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          cachedChannels = data
          cacheTime = Date.now()
          setChannels(data.channels || [])
          setCategories(data.categories || [])
        }
      })
      .catch(() => setError('Failed to load channels'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-1 border border-border text-text-muted text-sm ${className}`}>
        <Loader2 size={13} className="animate-spin" />
        Loading channels...
      </div>
    )
  }

  if (error) {
    return (
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Channel ID (connect bot to use picker)"
        className={`w-full px-3 py-2 rounded-lg bg-bg-1 border border-border text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-sm transition-all ${className}`}
      />
    )
  }

  // Group channels by category
  const grouped = {}
  const uncategorized = []

  channels.forEach(ch => {
    if (ch.parentId) {
      if (!grouped[ch.parentId]) grouped[ch.parentId] = []
      grouped[ch.parentId].push(ch)
    } else {
      uncategorized.push(ch)
    }
  })

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Hash size={13} className="text-text-muted" />
      </div>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-8 pr-3 py-2 rounded-lg bg-bg-1 border border-border text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 text-sm transition-all appearance-none"
      >
        <option value="">{placeholder}</option>

        {uncategorized.map(ch => (
          <option key={ch.id} value={ch.id}>#{ch.name}</option>
        ))}

        {categories.map(cat => (
          grouped[cat.id]?.length ? (
            <optgroup key={cat.id} label={cat.name.toUpperCase()}>
              {grouped[cat.id].map(ch => (
                <option key={ch.id} value={ch.id}>#{ch.name}</option>
              ))}
            </optgroup>
          ) : null
        ))}
      </select>
    </div>
  )
}

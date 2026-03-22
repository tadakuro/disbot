'use client'

import { useState } from 'react'
import ModulePanel from '@/components/modules/ModulePanel'

function EmbedsBuilder({ data, setData }) {
  const embed = data.draft || {}

  function update(field, value) {
    setData({ ...data, draft: { ...embed, [field]: value } })
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-[#e8e8f0]">Embed Builder</h2>

        <div>
          <label className="text-xs text-[#6b6b80] mb-1 block">Title</label>
          <input
            type="text"
            placeholder="Embed title"
            value={embed.title || ''}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-[#6b6b80] mb-1 block">Description</label>
          <textarea
            placeholder="Embed description"
            value={embed.description || ''}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#6b6b80] mb-1 block">Color (hex)</label>
            <input
              type="text"
              placeholder="#5865f2"
              value={embed.color || ''}
              onChange={(e) => update('color', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6b6b80] mb-1 block">Footer Text</label>
            <input
              type="text"
              placeholder="Footer"
              value={embed.footer || ''}
              onChange={(e) => update('footer', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#6b6b80] mb-1 block">Send to Channel ID</label>
          <input
            type="text"
            placeholder="Channel ID"
            value={embed.channelId || ''}
            onChange={(e) => update('channelId', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
          />
        </div>
      </div>

      {(embed.title || embed.description) && (
        <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
          <h2 className="text-xs text-[#6b6b80] uppercase tracking-widest mb-3 font-medium">Preview</h2>
          <div
            className="border-l-4 rounded-r-lg p-4 bg-[#1e1e26]"
            style={{ borderColor: embed.color || '#5865f2' }}
          >
            {embed.title && <p className="font-semibold text-[#e8e8f0] text-sm mb-1">{embed.title}</p>}
            {embed.description && <p className="text-sm text-[#9999b0] whitespace-pre-wrap">{embed.description}</p>}
            {embed.footer && <p className="text-xs text-[#6b6b80] mt-3">{embed.footer}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EmbedsPage() {
  return (
    <ModulePanel
      title="Embeds"
      description="Build and send rich embed messages to any channel."
      apiPath="embeds"
    >
      {({ data, setData }) => <EmbedsBuilder data={data} setData={setData} />}
    </ModulePanel>
  )
}

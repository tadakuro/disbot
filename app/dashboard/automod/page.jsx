'use client'

import ModulePanel from '@/components/modules/ModulePanel'

export default function AutoModPage() {
  return (
    <ModulePanel
      title="Auto Mod"
      description="Automatically detect and handle spam, bad words, links, and mass mentions."
      apiPath="automod"
    >
      {({ data, setData }) => (
        <div className="space-y-4">
          {[
            { key: 'filterSpam', label: 'Anti-Spam', desc: 'Detect and delete repeated messages' },
            { key: 'filterLinks', label: 'Block Links', desc: 'Delete messages containing URLs' },
            { key: 'filterInvites', label: 'Block Invites', desc: 'Delete Discord invite links' },
            { key: 'filterMentions', label: 'Mass Mention Filter', desc: 'Delete messages with excessive mentions' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#e8e8f0]">{label}</p>
                <p className="text-xs text-[#6b6b80] mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setData({ ...data, [key]: !data[key] })}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${data[key] ? 'bg-[#5865f2]' : 'bg-[#2e2e3a]'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${data[key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Banned Words</h2>
            <textarea
              placeholder="word1, word2, word3"
              value={data.bannedWords || ''}
              onChange={(e) => setData({ ...data, bannedWords: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors resize-none"
            />
            <p className="text-xs text-[#6b6b80]">Comma-separated list of words to filter.</p>
          </div>

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Action on Trigger</h2>
            <select
              value={data.action || 'delete'}
              onChange={(e) => setData({ ...data, action: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            >
              <option value="delete">Delete message</option>
              <option value="warn">Delete + warn user</option>
              <option value="timeout">Delete + timeout user</option>
            </select>
          </div>
        </div>
      )}
    </ModulePanel>
  )
}

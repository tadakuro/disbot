import ModulePanel from '@/components/modules/ModulePanel'

const LOG_EVENTS = [
  { key: 'messageDelete', label: 'Message Deleted' },
  { key: 'messageEdit', label: 'Message Edited' },
  { key: 'memberJoin', label: 'Member Joined' },
  { key: 'memberLeave', label: 'Member Left' },
  { key: 'memberBan', label: 'Member Banned' },
  { key: 'memberUnban', label: 'Member Unbanned' },
  { key: 'voiceJoin', label: 'Voice Channel Join' },
  { key: 'voiceLeave', label: 'Voice Channel Leave' },
  { key: 'roleCreate', label: 'Role Created' },
  { key: 'roleDelete', label: 'Role Deleted' },
]

export default function LoggingPage() {
  return (
    <ModulePanel
      title="Logging"
      description="Log server events to a designated channel."
      apiPath="logging"
    >
      {({ data, setData }) => (
        <div className="space-y-4">
          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Log Channel</h2>
            <input
              type="text"
              placeholder="Channel ID"
              value={data.logChannel || ''}
              onChange={(e) => setData({ ...data, logChannel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
          </div>

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Events to Log</h2>
            <div className="grid grid-cols-2 gap-2">
              {LOG_EVENTS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={data[key] || false}
                    onChange={(e) => setData({ ...data, [key]: e.target.checked })}
                    className="w-4 h-4 accent-[#5865f2]"
                  />
                  <span className="text-sm text-[#9999b0]">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModulePanel>
  )
}

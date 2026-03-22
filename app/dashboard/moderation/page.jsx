import ModulePanel from '@/components/modules/ModulePanel'

export default function ModerationPage() {
  return (
    <ModulePanel
      title="Moderation"
      description="Configure ban, kick, warn, timeout and purge settings."
      apiPath="moderation"
    >
      {({ data, setData }) => (
        <div className="space-y-4">
          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Mod Log Channel</h2>
            <input
              type="text"
              placeholder="Channel ID"
              value={data.modLogChannel || ''}
              onChange={(e) => setData({ ...data, modLogChannel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
            <p className="text-xs text-[#6b6b80]">All moderation actions will be logged to this channel.</p>
          </div>

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-[#e8e8f0]">DM on Action</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.dmOnAction || false}
                onChange={(e) => setData({ ...data, dmOnAction: e.target.checked })}
                className="w-4 h-4 accent-[#5865f2]"
              />
              <span className="text-sm text-[#9999b0]">Send a DM to the user when a mod action is taken</span>
            </label>
          </div>

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Max Warns Before Ban</h2>
            <input
              type="number"
              min={1}
              max={20}
              placeholder="e.g. 3"
              value={data.maxWarns || ''}
              onChange={(e) => setData({ ...data, maxWarns: parseInt(e.target.value) || '' })}
              className="w-32 px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
            <p className="text-xs text-[#6b6b80]">Auto-ban a user after this many warnings. Leave empty to disable.</p>
          </div>
        </div>
      )}
    </ModulePanel>
  )
}

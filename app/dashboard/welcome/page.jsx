import ModulePanel from '@/components/modules/ModulePanel'

export default function WelcomePage() {
  return (
    <ModulePanel
      title="Welcome & Goodbye"
      description="Send messages when members join or leave your server."
      apiPath="welcome"
    >
      {({ data, setData }) => (
        <div className="space-y-4">
          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Welcome Message</h2>
            <input
              type="text"
              placeholder="Channel ID"
              value={data.welcomeChannel || ''}
              onChange={(e) => setData({ ...data, welcomeChannel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
            <textarea
              placeholder="Welcome message. Use {user} for mention, {server} for server name."
              value={data.welcomeMessage || ''}
              onChange={(e) => setData({ ...data, welcomeMessage: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors resize-none"
            />
          </div>

          <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-[#e8e8f0]">Goodbye Message</h2>
            <input
              type="text"
              placeholder="Channel ID"
              value={data.goodbyeChannel || ''}
              onChange={(e) => setData({ ...data, goodbyeChannel: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
            <textarea
              placeholder="Goodbye message. Use {user} for username, {server} for server name."
              value={data.goodbyeMessage || ''}
              onChange={(e) => setData({ ...data, goodbyeMessage: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </ModulePanel>
  )
}

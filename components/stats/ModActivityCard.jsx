export default function ModActivityCard({ modCount, automodCount }) {
  return (
    <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
      <p className="text-xs text-[#6b6b80] uppercase tracking-widest mb-4 font-medium">Moderation</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-[#e8e8f0]">{modCount ?? 0}</p>
          <p className="text-xs text-[#9999b0] mt-0.5">Mod actions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#e8e8f0]">{automodCount ?? 0}</p>
          <p className="text-xs text-[#9999b0] mt-0.5">Automod triggers</p>
        </div>
      </div>
    </div>
  )
}

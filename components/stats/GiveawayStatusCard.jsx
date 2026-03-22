export default function GiveawayStatusCard({ active }) {
  return (
    <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
      <p className="text-xs text-[#6b6b80] uppercase tracking-widest mb-4 font-medium">Giveaways</p>
      <p className="text-2xl font-bold text-[#e8e8f0]">{active ?? 0}</p>
      <p className="text-xs text-[#9999b0] mt-0.5">Active giveaways</p>
    </div>
  )
}

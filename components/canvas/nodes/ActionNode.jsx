import { Handle, Position } from 'reactflow'

export default function ActionNode({ data }) {
  return (
    <div className="bg-[#16161c] border-2 border-[#5865f2] rounded-xl p-4 min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#5865f2]" />
        <span className="text-xs font-medium text-[#5865f2] uppercase tracking-wider">Action</span>
      </div>
      <p className="text-sm text-[#e8e8f0] font-medium">{data.label}</p>
      {data.message && (
        <p className="text-xs text-[#9999b0] mt-1 truncate max-w-[160px]">{data.message}</p>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

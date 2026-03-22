import { Handle, Position } from 'reactflow'

export default function TriggerNode({ data }) {
  return (
    <div className="bg-[#16161c] border-2 border-[#3ba55d] rounded-xl p-4 min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#3ba55d]" />
        <span className="text-xs font-medium text-[#3ba55d] uppercase tracking-wider">Trigger</span>
      </div>
      <p className="text-sm text-[#e8e8f0] font-medium">{data.label}</p>
      {data.command && (
        <p className="text-xs text-[#9999b0] mt-1 font-mono">{data.command}</p>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

import { Handle, Position } from 'reactflow'

export default function ConditionNode({ data }) {
  return (
    <div className="bg-[#16161c] border-2 border-[#faa61a] rounded-xl p-4 min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#faa61a]" />
        <span className="text-xs font-medium text-[#faa61a] uppercase tracking-wider">Condition</span>
      </div>
      <p className="text-sm text-[#e8e8f0] font-medium">{data.label}</p>
      {data.role && (
        <p className="text-xs text-[#9999b0] mt-1">{data.role}</p>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="true" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '65%' }} />
    </div>
  )
}

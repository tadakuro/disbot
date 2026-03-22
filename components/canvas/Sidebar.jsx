'use client'

export default function CanvasSidebar({ onAdd }) {
  const nodes = [
    {
      type: 'trigger',
      label: 'Command Trigger',
      desc: 'Fires when a command is typed',
      color: '#3ba55d',
      dot: 'bg-[#3ba55d]',
      bg: 'bg-[#3ba55d20]',
      border: 'border-[#3ba55d40]',
      text: 'text-[#3ba55d]',
      defaults: { label: 'Command Trigger', command: '/newcmd' },
    },
    {
      type: 'action',
      label: 'Send Message',
      desc: 'Sends a message to the channel',
      color: '#5865f2',
      dot: 'bg-[#5865f2]',
      bg: 'bg-[#5865f220]',
      border: 'border-[#5865f240]',
      text: 'text-[#5865f2]',
      defaults: { label: 'Send Message', message: 'Hello!' },
    },
    {
      type: 'action',
      label: 'Add Role',
      desc: 'Assigns a role to the user',
      color: '#5865f2',
      dot: 'bg-[#5865f2]',
      bg: 'bg-[#5865f220]',
      border: 'border-[#5865f240]',
      text: 'text-[#5865f2]',
      defaults: { label: 'Add Role', roleId: '' },
    },
    {
      type: 'action',
      label: 'Remove Role',
      desc: 'Removes a role from the user',
      color: '#5865f2',
      dot: 'bg-[#5865f2]',
      bg: 'bg-[#5865f220]',
      border: 'border-[#5865f240]',
      text: 'text-[#5865f2]',
      defaults: { label: 'Remove Role', roleId: '' },
    },
    {
      type: 'action',
      label: 'Delete Message',
      desc: 'Deletes the triggering message',
      color: '#5865f2',
      dot: 'bg-[#5865f2]',
      bg: 'bg-[#5865f220]',
      border: 'border-[#5865f240]',
      text: 'text-[#5865f2]',
      defaults: { label: 'Delete Message' },
    },
    {
      type: 'condition',
      label: 'Check Role',
      desc: 'Branches based on user role',
      color: '#faa61a',
      dot: 'bg-[#faa61a]',
      bg: 'bg-[#faa61a20]',
      border: 'border-[#faa61a40]',
      text: 'text-[#faa61a]',
      defaults: { label: 'Check Role', role: '' },
    },
    {
      type: 'condition',
      label: 'Check Permission',
      desc: 'Branches based on permission',
      color: '#faa61a',
      dot: 'bg-[#faa61a]',
      bg: 'bg-[#faa61a20]',
      border: 'border-[#faa61a40]',
      text: 'text-[#faa61a]',
      defaults: { label: 'Check Permission', permission: '' },
    },
  ]

  return (
    <div className="w-56 h-full bg-[#0e0e12] border-r border-[#2e2e3a] flex flex-col overflow-y-auto flex-shrink-0">
      <div className="p-3 border-b border-[#2e2e3a]">
        <p className="text-xs text-[#6b6b80] uppercase tracking-widest font-medium">Nodes</p>
      </div>
      <div className="p-2 space-y-1.5">
        {nodes.map((node, i) => (
          <button
            key={i}
            onClick={() => onAdd(node.type, node.defaults)}
            className={`w-full text-left p-3 rounded-xl border ${node.bg} ${node.border} hover:brightness-110 transition-all`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${node.dot}`} />
              <span className={`text-xs font-medium ${node.text}`}>{node.label}</span>
            </div>
            <p className="text-xs text-[#6b6b80] leading-tight pl-3.5">{node.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

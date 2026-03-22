'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TriggerNode from './nodes/TriggerNode'
import ActionNode from './nodes/ActionNode'
import ConditionNode from './nodes/ConditionNode'
import CanvasSidebar from './Sidebar'

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
}

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: { label: 'Command Trigger', command: '/hello' },
  },
]

const initialEdges = []

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  )

  function addNode(type, defaults) {
    const id = `${Date.now()}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position: { x: 250 + Math.random() * 150, y: 100 + Math.random() * 200 },
        data: defaults,
      },
    ])
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/bot/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex h-full">
      <CanvasSidebar onAdd={addNode} />
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-b border-[#2e2e3a] bg-[#16161c]">
          {saved && <span className="text-xs text-[#3ba55d]">Saved!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-4 py-1.5 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#2e2e3a" gap={20} />
            <Controls />
            <MiniMap
              nodeColor={(n) =>
                n.type === 'trigger' ? '#3ba55d' : n.type === 'action' ? '#5865f2' : '#faa61a'
              }
              style={{ background: '#16161c', border: '1px solid #2e2e3a' }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

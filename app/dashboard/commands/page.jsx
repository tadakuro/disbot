'use client'

import dynamic from 'next/dynamic'

const FlowCanvas = dynamic(() => import('@/components/canvas/FlowCanvas'), { ssr: false })

export default function CommandsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e8e8f0]">Commands</h1>
        <p className="text-sm text-[#9999b0] mt-1">Build custom commands visually using the node canvas.</p>
      </div>
      <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl overflow-hidden" style={{ height: '70vh' }}>
        <FlowCanvas />
      </div>
    </div>
  )
}

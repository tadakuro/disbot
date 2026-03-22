'use client'

import { useState } from 'react'
import ModulePanel from '@/components/modules/ModulePanel'

function ReactionRolesList({ data, setData }) {
  const rules = data.rules || []

  function addRule() {
    setData({ ...data, rules: [...rules, { emoji: '', roleId: '', messageId: '' }] })
  }

  function updateRule(i, field, value) {
    const updated = rules.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
    setData({ ...data, rules: updated })
  }

  function removeRule(i) {
    setData({ ...data, rules: rules.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-4">
      {rules.map((rule, i) => (
        <div key={i} className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#e8e8f0]">Rule #{i + 1}</p>
            <button onClick={() => removeRule(i)} className="text-xs text-[#ed4245] hover:underline">Remove</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#6b6b80] mb-1 block">Emoji</label>
              <input
                type="text"
                placeholder="🎉"
                value={rule.emoji}
                onChange={(e) => updateRule(i, 'emoji', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6b80] mb-1 block">Role ID</label>
              <input
                type="text"
                placeholder="Role ID"
                value={rule.roleId}
                onChange={(e) => updateRule(i, 'roleId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6b80] mb-1 block">Message ID</label>
              <input
                type="text"
                placeholder="Message ID"
                value={rule.messageId}
                onChange={(e) => updateRule(i, 'messageId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addRule}
        className="w-full py-3 rounded-xl border border-dashed border-[#2e2e3a] text-[#9999b0] hover:border-[#5865f2] hover:text-[#5865f2] text-sm transition-colors"
      >
        + Add Rule
      </button>
    </div>
  )
}

export default function ReactionRolesPage() {
  return (
    <ModulePanel
      title="Reaction Roles"
      description="Assign roles to members when they react to a specific message."
      apiPath="reaction-roles"
    >
      {({ data, setData }) => <ReactionRolesList data={data} setData={setData} />}
    </ModulePanel>
  )
}

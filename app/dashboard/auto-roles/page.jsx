'use client'

import ModulePanel from '@/components/modules/ModulePanel'

function AutoRolesList({ data, setData }) {
  const roles = data.roles || []

  function addRole() {
    setData({ ...data, roles: [...roles, { roleId: '', type: 'all' }] })
  }

  function updateRole(i, field, value) {
    const updated = roles.map((r, idx) => idx === i ? { ...r, [field]: value } : r)
    setData({ ...data, roles: updated })
  }

  function removeRole(i) {
    setData({ ...data, roles: roles.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-medium text-[#e8e8f0]">Auto-assigned Roles on Join</h2>
        <p className="text-xs text-[#6b6b80]">These roles will be given to members automatically when they join.</p>
      </div>

      {roles.map((role, i) => (
        <div key={i} className="bg-[#16161c] border border-[#2e2e3a] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Role ID"
              value={role.roleId}
              onChange={(e) => updateRole(i, 'roleId', e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] placeholder-[#6b6b80] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            />
            <select
              value={role.type}
              onChange={(e) => updateRole(i, 'type', e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#0e0e12] border border-[#2e2e3a] text-[#e8e8f0] focus:outline-none focus:border-[#5865f2] text-sm transition-colors"
            >
              <option value="all">All members</option>
              <option value="bots">Bots only</option>
              <option value="humans">Humans only</option>
            </select>
            <button onClick={() => removeRole(i)} className="text-xs text-[#ed4245] hover:underline px-2">Remove</button>
          </div>
        </div>
      ))}

      <button
        onClick={addRole}
        className="w-full py-3 rounded-xl border border-dashed border-[#2e2e3a] text-[#9999b0] hover:border-[#5865f2] hover:text-[#5865f2] text-sm transition-colors"
      >
        + Add Role
      </button>
    </div>
  )
}

export default function AutoRolesPage() {
  return (
    <ModulePanel
      title="Auto Roles"
      description="Automatically assign roles when a member joins the server."
      apiPath="auto-roles"
    >
      {({ data, setData }) => <AutoRolesList data={data} setData={setData} />}
    </ModulePanel>
  )
}

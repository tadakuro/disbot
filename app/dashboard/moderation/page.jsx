'use client'

import ModulePanel from '@/components/modules/ModulePanel'
import { Card, CardHeader, Field, Input, Toggle, NumberInput } from '@/components/ui/Card'
import { Shield } from 'lucide-react'

export default function ModerationPage() {
  return (
    <ModulePanel
      title="Moderation"
      description="Manage bans, kicks, warnings, timeouts and purge. Configure automated escalation and mod logging."
      icon={Shield}
      apiPath="moderation"
    >
      {({ data, setData }) => (
        <>
          <Card>
            <CardHeader title="Mod Log Channel" description="All moderation actions will be posted here." />
            <Field label="Channel ID" hint="Right-click a channel in Discord → Copy Channel ID">
              <Input
                placeholder="e.g. 123456789012345678"
                value={data.modLogChannel || ''}
                onChange={(e) => setData({ ...data, modLogChannel: e.target.value })}
              />
            </Field>
          </Card>

          <Card>
            <CardHeader title="DM Notifications" description="Notify users when a mod action is taken against them." />
            <Toggle
              checked={data.dmOnAction || false}
              onChange={(v) => setData({ ...data, dmOnAction: v })}
              label="Send DM on Action"
              description="User receives a DM explaining the action and reason"
            />
          </Card>

          <Card>
            <CardHeader title="Auto-Ban Threshold" description="Automatically ban a user after they reach a warning limit." />
            <Field label="Max Warnings Before Auto-Ban" hint="Leave empty to disable auto-ban on warns">
              <NumberInput
                placeholder="e.g. 3"
                min={1}
                max={20}
                value={data.maxWarns || ''}
                onChange={(e) => setData({ ...data, maxWarns: parseInt(e.target.value) || '' })}
                className="w-32"
              />
            </Field>
          </Card>

          <Card>
            <CardHeader title="Mute Role" description="Role to assign when a user is muted via the bot." />
            <Field label="Mute Role ID" hint="Create a role with no send message permission and paste its ID">
              <Input
                placeholder="e.g. 123456789012345678"
                value={data.muteRoleId || ''}
                onChange={(e) => setData({ ...data, muteRoleId: e.target.value })}
              />
            </Field>
          </Card>

          <Card>
            <CardHeader title="Exempt Roles" description="Users with these roles cannot be moderated by the bot." />
            <Field label="Exempt Role IDs" hint="Comma-separated role IDs">
              <Input
                placeholder="e.g. 111111111, 222222222"
                value={data.exemptRoles || ''}
                onChange={(e) => setData({ ...data, exemptRoles: e.target.value })}
              />
            </Field>
          </Card>
        </>
      )}
    </ModulePanel>
  )
}

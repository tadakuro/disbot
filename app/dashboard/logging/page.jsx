'use client'

import ModulePanel from '@/components/modules/ModulePanel'
import { Card, CardHeader, Field, Input, Toggle } from '@/components/ui/Card'
import { ScrollText } from 'lucide-react'

const LOG_GROUPS = [
  {
    title: 'Messages',
    events: [
      { key: 'messageDelete', label: 'Message Deleted' },
      { key: 'messageEdit', label: 'Message Edited' },
      { key: 'messageBulkDelete', label: 'Bulk Message Delete' },
    ],
  },
  {
    title: 'Members',
    events: [
      { key: 'memberJoin', label: 'Member Joined' },
      { key: 'memberLeave', label: 'Member Left' },
      { key: 'memberBan', label: 'Member Banned' },
      { key: 'memberUnban', label: 'Member Unbanned' },
      { key: 'memberNickChange', label: 'Nickname Changed' },
      { key: 'memberRoleChange', label: 'Roles Updated' },
    ],
  },
  {
    title: 'Voice',
    events: [
      { key: 'voiceJoin', label: 'Voice Channel Join' },
      { key: 'voiceLeave', label: 'Voice Channel Leave' },
      { key: 'voiceMove', label: 'Voice Channel Move' },
    ],
  },
  {
    title: 'Server',
    events: [
      { key: 'roleCreate', label: 'Role Created' },
      { key: 'roleDelete', label: 'Role Deleted' },
      { key: 'roleUpdate', label: 'Role Updated' },
      { key: 'channelCreate', label: 'Channel Created' },
      { key: 'channelDelete', label: 'Channel Deleted' },
    ],
  },
]

export default function LoggingPage() {
  return (
    <ModulePanel
      title="Logging"
      description="Track and log server events to designated channels."
      icon={ScrollText}
      apiPath="logging"
    >
      {({ data, setData }) => (
        <>
          <Card>
            <CardHeader title="Default Log Channel" description="All enabled events log here unless overridden below." />
            <Field label="Channel ID">
              <Input
                placeholder="e.g. 123456789012345678"
                value={data.logChannel || ''}
                onChange={(e) => setData({ ...data, logChannel: e.target.value })}
              />
            </Field>
          </Card>

          {LOG_GROUPS.map((group) => (
            <Card key={group.title}>
              <CardHeader title={`${group.title} Events`} />
              <div className="space-y-2 mb-4">
                {group.events.map(({ key, label }) => (
                  <Toggle
                    key={key}
                    checked={data[key] || false}
                    onChange={(v) => setData({ ...data, [key]: v })}
                    label={label}
                  />
                ))}
              </div>
              <Field label={`${group.title} Log Channel Override`} hint="Leave empty to use default log channel">
                <Input
                  placeholder="Channel ID"
                  value={data[`${group.title.toLowerCase()}LogChannel`] || ''}
                  onChange={(e) => setData({ ...data, [`${group.title.toLowerCase()}LogChannel`]: e.target.value })}
                />
              </Field>
            </Card>
          ))}
        </>
      )}
    </ModulePanel>
  )
}

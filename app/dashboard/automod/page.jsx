'use client'

import ModulePanel from '@/components/modules/ModulePanel'
import { Card, CardHeader, Field, Input, Toggle, Select, Textarea } from '@/components/ui/Card'
import { Bot } from 'lucide-react'

export default function AutoModPage() {
  return (
    <ModulePanel
      title="Auto Mod"
      description="Automatically detect and act on spam, bad words, invite links, mass mentions, and more."
      icon={Bot}
      apiPath="automod"
    >
      {({ data, setData }) => (
        <>
          <Card>
            <CardHeader title="Detection Rules" description="Toggle which types of content to detect and act on." />
            <div className="space-y-2">
              {[
                { key: 'filterSpam', label: 'Anti-Spam', desc: 'Flag users sending 5+ messages within 5 seconds' },
                { key: 'filterLinks', label: 'Block Links', desc: 'Remove messages containing HTTP/HTTPS URLs' },
                { key: 'filterInvites', label: 'Block Invites', desc: 'Remove Discord server invite links' },
                { key: 'filterMentions', label: 'Mass Mentions', desc: 'Remove messages with 5 or more user mentions' },
                { key: 'filterCaps', label: 'Excessive Caps', desc: 'Flag messages with more than 70% uppercase characters' },
                { key: 'filterEmoji', label: 'Emoji Spam', desc: 'Flag messages with excessive emoji usage' },
              ].map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  checked={data[key] || false}
                  onChange={(v) => setData({ ...data, [key]: v })}
                  label={label}
                  description={desc}
                />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Banned Words" description="Messages containing these words will be acted on." />
            <Field label="Word List" hint="Comma-separated. Partial matches are included (e.g. 'bad' matches 'badword').">
              <Textarea
                placeholder="word1, word2, word3"
                value={data.bannedWords || ''}
                onChange={(e) => setData({ ...data, bannedWords: e.target.value })}
                rows={3}
              />
            </Field>
          </Card>

          <Card>
            <CardHeader title="Action on Trigger" description="What the bot does when a rule is violated." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Action">
                <Select
                  value={data.action || 'delete'}
                  onChange={(e) => setData({ ...data, action: e.target.value })}
                  className="w-full"
                >
                  <option value="delete">Delete message only</option>
                  <option value="warn">Delete + warn user</option>
                  <option value="timeout">Delete + timeout (5 min)</option>
                  <option value="kick">Delete + kick user</option>
                </Select>
              </Field>
              <Field label="Log Channel ID" hint="Leave empty to use mod log channel">
                <Input
                  placeholder="Channel ID"
                  value={data.logChannel || ''}
                  onChange={(e) => setData({ ...data, logChannel: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Exemptions" description="Roles and channels that bypass automod." />
            <div className="space-y-3">
              <Field label="Exempt Role IDs" hint="Comma-separated">
                <Input
                  placeholder="e.g. 111111111, 222222222"
                  value={data.exemptRoles || ''}
                  onChange={(e) => setData({ ...data, exemptRoles: e.target.value })}
                />
              </Field>
              <Field label="Exempt Channel IDs" hint="Comma-separated">
                <Input
                  placeholder="e.g. 333333333, 444444444"
                  value={data.exemptChannels || ''}
                  onChange={(e) => setData({ ...data, exemptChannels: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        </>
      )}
    </ModulePanel>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Shield,
  Bot,
  MessageSquare,
  Star,
  ScrollText,
  UserPlus,
  Terminal,
  Layers,
  Gift,
  LogOut,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Moderation', href: '/dashboard/moderation', icon: Shield },
  { label: 'Auto Mod', href: '/dashboard/automod', icon: Bot },
  { label: 'Welcome', href: '/dashboard/welcome', icon: MessageSquare },
  { label: 'Reaction Roles', href: '/dashboard/reaction-roles', icon: Star },
  { label: 'Logging', href: '/dashboard/logging', icon: ScrollText },
  { label: 'Auto Roles', href: '/dashboard/auto-roles', icon: UserPlus },
  { label: 'Commands', href: '/dashboard/commands', icon: Terminal },
  { label: 'Embeds', href: '/dashboard/embeds', icon: Layers },
  { label: 'Giveaways', href: '/dashboard/giveaways', icon: Gift },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#16161c] border-r border-[#2e2e3a] flex flex-col">
      <div className="p-5 border-b border-[#2e2e3a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5865f2] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.015.043.031.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>
          <span className="font-semibold text-[#e8e8f0] text-sm">BotForge</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#5865f2] text-white'
                  : 'text-[#9999b0] hover:text-[#e8e8f0] hover:bg-[#1e1e26]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#2e2e3a]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9999b0] hover:text-[#ed4245] hover:bg-[#ed424510] transition-colors w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

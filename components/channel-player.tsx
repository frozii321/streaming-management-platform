'use client'

import { useEffect, useState } from 'react'
import { Radio, ExternalLink } from 'lucide-react'

type Channel = { name: string; hlsUrl: string }
export function ChannelPlayer() {
  const [channel, setChannel] = useState<Channel | null>(null)
  useEffect(() => { fetch('/api/channel').then((r) => r.json()).then(setChannel) }, [])
  return <section className="player-shell">
    <div className="player-frame">
      {channel?.hlsUrl ? <video className="h-full w-full object-contain" controls autoPlay playsInline src={channel.hlsUrl} /> : <div className="waiting"><Radio size={42} strokeWidth={1.4} /><span>Эфир пока не запущен</span><small>Настройте HLS-адрес в админ-панели после подключения OBS</small></div>}
    </div>
    <div className="player-caption"><div><span className="live-dot" /> LIVE <strong>{channel?.name ?? 'Главный канал'}</strong></div><a href="/admin">Админ-панель <ExternalLink size={14} /></a></div>
  </section>
}

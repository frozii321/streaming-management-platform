'use client'

import { useEffect, useRef, useState } from 'react'
import { Radio } from 'lucide-react'

type Channel = { name: string; hlsUrl: string }
export function ChannelPlayer() {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [online, setOnline] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => { fetch('/api/channel').then((r) => r.json()).then(setChannel) }, [])
  useEffect(() => {
    const video = videoRef.current
    if (!video || !channel?.hlsUrl) return
    const markOnline = () => setOnline(true)
    const markOffline = () => setOnline(false)
    video.addEventListener('playing', markOnline); video.addEventListener('canplay', markOnline); video.addEventListener('error', markOffline); video.addEventListener('stalled', markOffline)
    return () => { video.removeEventListener('playing', markOnline); video.removeEventListener('canplay', markOnline); video.removeEventListener('error', markOffline); video.removeEventListener('stalled', markOffline) }
  }, [channel?.hlsUrl])
  return <section className="player-shell">
    <div className="player-frame">
      {channel?.hlsUrl ? <video ref={videoRef} className="h-full w-full object-contain" controls autoPlay playsInline src={channel.hlsUrl} /> : <div className="waiting"><Radio size={42} strokeWidth={1.4} /><span>Эфир пока не запущен</span><small>Сигнал появится автоматически после запуска OBS</small></div>}
    </div>
    <div className="player-caption"><div><span className={`live-dot ${online ? '' : 'offline-dot'}`} /> {online ? 'LIVE' : 'ОЖИДАНИЕ'} <strong>{channel?.name ?? 'Главный канал'}</strong></div><span className="tracking-status">{online ? 'Сигнал отслеживается' : 'Проверяем сигнал'}</span></div>
  </section>
}

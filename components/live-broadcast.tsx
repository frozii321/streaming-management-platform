'use client'

import { useEffect, useState } from 'react'
import { Copy, Radio, RefreshCw, Server } from 'lucide-react'

type Channel = { name: string; rtmpServer: string; streamKey: string; hlsUrl: string }

export function LiveBroadcast() {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [password, setPassword] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [message, setMessage] = useState('')
  const [online, setOnline] = useState(false)
  const load = async () => { const response = await fetch('/api/admin/channel'); if (response.ok) { setChannel(await response.json()); setAuthorized(true) } }
  useEffect(() => { load() }, [])
  const login = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch('/api/admin/channel', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'login', password }) }); if (response.ok) { await load() } else setMessage('Неверный пароль') }
  const copy = (value: string) => navigator.clipboard.writeText(value).then(() => setMessage('Скопировано'))
  if (!authorized) return <form className="login-card" onSubmit={login}><div className="icon-box"><Radio /></div><h1>Студия вещания</h1><p>Введите пароль, чтобы получить данные для OBS.</p><label>Пароль<input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="primary-button">Открыть студию</button>{message && <div className="error-message">{message}</div>}</form>
  if (!channel) return null
  return <section className="live-page"><div className="hero-copy"><span className="eyebrow">LIVE / OBS</span><h1>Студия вещания.</h1><p>Подключите OBS к вашему каналу и следите за сигналом в реальном времени.</p></div><div className="admin-grid"><div className="obs-card"><div className="card-heading"><div><span className="eyebrow">ПОДКЛЮЧЕНИЕ</span><h2>Данные OBS</h2></div><Server /></div><div className="credential"><span>Сервер</span><strong>{channel.rtmpServer}</strong><button onClick={() => copy(channel.rtmpServer)} aria-label="Копировать сервер"><Copy size={16}/></button></div><div className="credential"><span>Ключ</span><strong>{channel.streamKey}</strong><button onClick={() => copy(channel.streamKey)} aria-label="Копировать ключ"><Copy size={16}/></button></div><div className="tip"><b>Настройка OBS</b><span>Откройте Настройки → Трансляция, выберите пользовательский сервис, вставьте сервер и ключ, затем нажмите «Начать трансляцию».</span></div></div><div className="settings-card"><div className="card-heading"><div><span className="eyebrow">МОНИТОРИНГ</span><h2>{online ? 'Эфир активен' : 'Ожидание сигнала'}</h2></div><span className={`live-dot ${online ? '' : 'offline-dot'}`} /></div><div className="live-monitor"><video className="live-video" controls autoPlay muted playsInline src={channel.hlsUrl || undefined} onPlaying={() => setOnline(true)} onCanPlay={() => setOnline(true)} onError={() => setOnline(false)} onStalled={() => setOnline(false)} />{!channel.hlsUrl && <div className="waiting"><Radio size={34} strokeWidth={1.4}/><span>HLS-поток ещё не настроен</span></div>}</div><p className="muted">Статус обновляется автоматически по состоянию видеосигнала.</p><button className="secondary-button" onClick={() => load()}><RefreshCw size={16}/>Обновить статус</button>{message && <div className="success-message">{message}</div>}</div></div></section>
}

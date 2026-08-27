'use client'

import { useEffect, useState } from 'react'
import { Copy, KeyRound, LogIn, Save, RefreshCw, Server, Tv } from 'lucide-react'

type Channel = { name: string; rtmpServer: string; streamKey: string; hlsUrl: string }
export function AdminPanel() {
  const [password, setPassword] = useState(''); const [channel, setChannel] = useState<Channel | null>(null); const [logged, setLogged] = useState(false); const [message, setMessage] = useState('')
  const request = async (body: object) => { const r = await fetch('/api/admin/channel', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); return data }
  const load = async () => { const r = await fetch('/api/admin/channel'); if (r.ok) { setChannel(await r.json()); setLogged(true) } }
  useEffect(() => { load() }, [])
  const login = async (e: React.FormEvent) => { e.preventDefault(); try { await request({action:'login', password}); await load() } catch (e) { setMessage((e as Error).message) } }
  const save = async () => { if (!channel) return; try { setChannel(await request({action:'save', ...channel})); setMessage('Настройки сохранены') } catch(e) { setMessage((e as Error).message) } }
  const rotate = async () => { try { setChannel(await request({action:'rotate'})); setMessage('Ключ обновлён') } catch(e) { setMessage((e as Error).message) } }
  const copy = (value: string) => navigator.clipboard.writeText(value).then(() => setMessage('Скопировано'))
  if (!logged) return <form className="login-card" onSubmit={login}><div className="icon-box"><KeyRound /></div><h1>Вход в студию</h1><p>Управляйте настройками вашего ТВ-канала</p><label>Пароль<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Введите пароль" /></label><button className="primary-button" type="submit"><LogIn size={17}/>Войти</button>{message && <div className="error-message">{message}</div>}</form>
  if (!channel) return null
  return <div className="admin-grid"><div className="settings-card"><div className="card-heading"><div><span className="eyebrow">КОНФИГУРАЦИЯ</span><h1>Настройки канала</h1></div><Tv /></div><label>Название канала<input value={channel.name} onChange={e=>setChannel({...channel,name:e.target.value})}/></label><label>HLS URL <span className="hint">адрес видеопотока</span><input value={channel.hlsUrl} onChange={e=>setChannel({...channel,hlsUrl:e.target.value})} placeholder="https://ваш-сервер/live/stream.m3u8" /></label><label>RTMP сервер<input value={channel.rtmpServer} onChange={e=>setChannel({...channel,rtmpServer:e.target.value})}/></label><button className="primary-button" onClick={save}><Save size={17}/>Сохранить изменения</button>{message && <div className="success-message">{message}</div>}</div><div className="obs-card"><div className="card-heading"><div><span className="eyebrow">OBS STUDIO</span><h2>Данные для вещания</h2></div><Server /></div><p className="muted">Вставьте эти данные в OBS → Настройки → Трансляция.</p><div className="credential"><span>Сервер</span><strong>{channel.rtmpServer}</strong><button onClick={()=>copy(channel.rtmpServer)} aria-label="Копировать сервер"><Copy size={16}/></button></div><div className="credential"><span>Ключ потока</span><strong>{channel.streamKey}</strong><button onClick={()=>copy(channel.streamKey)} aria-label="Копировать ключ"><Copy size={16}/></button></div><button className="secondary-button" onClick={rotate}><RefreshCw size={16}/>Сгенерировать новый ключ</button><div className="tip"><b>Как начать эфир</b><span>Добавьте источник видео в OBS и нажмите «Начать трансляцию». Плеер на главной странице подключится к HLS-потоку.</span></div></div></div>
}

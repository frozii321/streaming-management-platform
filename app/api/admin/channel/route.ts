import { NextRequest, NextResponse } from 'next/server'
import { adminChannel, ensureChannel, updateChannel, rotateStreamKey } from '@/lib/db'

const COOKIE = 'tv_admin'
const PASSWORD = '123qweqweadmin'
function authorized(request: NextRequest) { return request.cookies.get(COOKIE)?.value === '1' }

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  return NextResponse.json(adminChannel(await ensureChannel()))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (body.action === 'login') {
    if (body.password !== PASSWORD) return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE, '1', { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 8, path: '/' })
    return response
  }
  if (!authorized(request)) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  if (body.action === 'rotate') return NextResponse.json(adminChannel(await rotateStreamKey()))
  if (body.action === 'save') {
    if (!body.name?.trim() || !body.rtmpServer?.trim()) return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    return NextResponse.json(adminChannel(await updateChannel(body.name.trim(), body.rtmpServer.trim(), body.hlsUrl?.trim() || '')))
  }
  return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 })
}

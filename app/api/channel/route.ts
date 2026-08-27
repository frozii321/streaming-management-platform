import { NextResponse } from 'next/server'
import { ensureChannel, publicChannel } from '@/lib/db'

export async function GET() {
  const channel = await ensureChannel()
  return NextResponse.json(publicChannel(channel))
}

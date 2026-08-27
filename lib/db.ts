import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'
import { Pool } from 'pg'
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'

export const channelSettings = pgTable('channel_settings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  streamKey: text('stream_key').notNull(),
  rtmpServer: text('rtmp_server').notNull(),
  hlsUrl: text('hls_url').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
})

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool)
export type ChannelSettings = typeof channelSettings.$inferSelect

export async function getChannel() {
  const rows = await db.select().from(channelSettings).limit(1)
  return rows[0] ?? null
}

export async function ensureChannel() {
  const existing = await getChannel()
  if (existing) return existing
  const [created] = await db.insert(channelSettings).values({
    id: 1,
    name: 'Главный канал',
    streamKey: crypto.randomUUID().replaceAll('-', ''),
    rtmpServer: 'rtmp://your-server.example/live',
    hlsUrl: '',
    updatedAt: new Date(),
  }).returning()
  return created
}

export async function updateChannel(name: string, rtmpServer: string, hlsUrl: string) {
  const [updated] = await db.update(channelSettings).set({ name, rtmpServer, hlsUrl, updatedAt: new Date() }).where(eq(channelSettings.id, 1)).returning()
  return updated
}

export async function rotateStreamKey() {
  const [updated] = await db.update(channelSettings).set({ streamKey: crypto.randomUUID().replaceAll('-', ''), updatedAt: new Date() }).where(eq(channelSettings.id, 1)).returning()
  return updated
}

export function publicChannel(channel: ChannelSettings) {
  return { name: channel.name, rtmpServer: channel.rtmpServer, hlsUrl: channel.hlsUrl, updatedAt: channel.updatedAt }
}
export function adminChannel(channel: ChannelSettings) {
  return { ...publicChannel(channel), streamKey: channel.streamKey }
}

// Drizzle's typed table helper is not available on all versions.
// Keep updates constrained to the singleton row.

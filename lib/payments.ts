import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_PATH, 'payments.json')

type PaymentRecord = {
  reference: string
  status: 'pending' | 'success' | 'failed'
  amount: number
  email: string
  metadata?: any
  qr?: string
  createdAt: string
}

async function ensureFile() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]))
}

export async function listPayments(): Promise<PaymentRecord[]> {
  await ensureFile()
  const raw = await fs.promises.readFile(FILE, 'utf8')
  return JSON.parse(raw || '[]')
}

export async function upsertPayment(record: PaymentRecord) {
  const items = await listPayments()
  const idx = items.findIndex((r) => r.reference === record.reference)
  if (idx >= 0) items[idx] = { ...items[idx], ...record }
  else items.push(record)
  await fs.promises.writeFile(FILE, JSON.stringify(items, null, 2))
  return record
}

export async function findPayment(reference: string) {
  const items = await listPayments()
  return items.find((r) => r.reference === reference)
}

export type { PaymentRecord }

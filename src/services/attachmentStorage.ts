import { openDB } from 'idb'

const DB_NAME = 'web-trip-map-planner'
const DB_VERSION = 1
const ATTACHMENT_STORE = 'attachments'

type AttachmentRecord = {
  key: string
  blob: Blob
  name: string
  type: string
  createdAt: string
}

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ATTACHMENT_STORE)) {
        db.createObjectStore(ATTACHMENT_STORE, { keyPath: 'key' })
      }
    },
  })
}

export async function saveAttachmentBlob(
  key: string,
  file: File,
): Promise<void> {
  const db = await getDb()
  await db.put(ATTACHMENT_STORE, {
    key,
    blob: file,
    name: file.name,
    type: file.type,
    createdAt: new Date().toISOString(),
  } satisfies AttachmentRecord)
}

export async function loadAttachmentBlob(key: string): Promise<Blob | null> {
  const db = await getDb()
  const record = (await db.get(ATTACHMENT_STORE, key)) as
    | AttachmentRecord
    | undefined

  return record?.blob ?? null
}

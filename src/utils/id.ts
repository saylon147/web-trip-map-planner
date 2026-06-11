export function createId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID()}`
}

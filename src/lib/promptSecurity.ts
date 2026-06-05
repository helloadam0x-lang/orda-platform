const INJECTION_PATTERNS = [
  /ignore (previous|all|above) instructions?/i,
  /system prompt/i,
  /you are now/i,
  /act as (a )?different/i,
  /forget (your|the) (previous|original|system)/i,
  /disregard (your|the|all)/i,
  /\[SYSTEM\]/i,
  /<<SYS>>/i,
  /\[INST\]/i,
  /<\|.*\|>/i,
  /new conversation starts/i,
  /pretend (you are|to be)/i,
  /jailbreak/i,
  /DAN mode/i,
  /bypass (your|all) (safety|filter|restriction)/i,
  /override (your|all) (instruction|system)/i,
]

const SENSITIVE_DATA_PATTERNS = [
  /what is (your|the) (api|gemini|supabase|secret) key/i,
  /show me (your|the) (api|system) (key|prompt|instruction)/i,
  /what are your (secret|hidden|internal) instructions/i,
  /reveal (your|the) (prompt|instruction|training)/i,
  /repeat (your|the) (system|initial|original) (prompt|instruction)/i,
]

export interface InjectionResult {
  isInjection: boolean
  isSensitiveDataRequest: boolean
  severity: 'low' | 'medium' | 'high'
  pattern?: string
}

export function detectPromptInjection(message: string): InjectionResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return { isInjection: true, isSensitiveDataRequest: false, severity: 'high', pattern: pattern.source }
    }
  }
  for (const pattern of SENSITIVE_DATA_PATTERNS) {
    if (pattern.test(message)) {
      return { isInjection: false, isSensitiveDataRequest: true, severity: 'medium', pattern: pattern.source }
    }
  }
  return { isInjection: false, isSensitiveDataRequest: false, severity: 'low' }
}

export function sanitizeForAI(message: string): string {
  return message
    .replace(/<\|.*?\|>/g, '')
    .replace(/\[SYSTEM\]/gi, '')
    .replace(/<<SYS>>/gi, '')
    .replace(/\[INST\]/gi, '')
    .trim()
    .slice(0, 2000)
}

export const SAFE_REFUSAL =
  "I'm sorry, I can only help with orders and product questions. How can I help you today?"

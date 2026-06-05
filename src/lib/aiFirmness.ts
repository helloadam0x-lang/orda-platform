export const AI_FIRMNESS_LEVELS = [
  {
    id: 'soft',
    label: 'Soft',
    description: 'Flexible, always tries to accommodate',
    example: 'Of course! I can adjust that for you. No problem at all.',
    icon: '🌸',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Helpful but maintains business policies',
    example: 'I understand your concern. Let me see what I can do within our policy.',
    icon: '⚖️',
  },
  {
    id: 'firm',
    label: 'Firm',
    description: 'Clear policies, limited exceptions',
    example: 'Our policy is clear on this. I can offer X as an alternative.',
    icon: '🏛️',
  },
  {
    id: 'strict',
    label: 'Strict',
    description: 'Rules are rules, no exceptions',
    example: 'I cannot make exceptions to our policy. Please refer to our terms.',
    icon: '🔒',
  },
] as const

export type FirmnessLevel = typeof AI_FIRMNESS_LEVELS[number]['id']

export function getFirmnessInstructions(level: FirmnessLevel): string {
  const instructions: Record<FirmnessLevel, string> = {
    soft: 'Be very flexible and accommodating. Try to find solutions for every customer request. Avoid saying no directly.',
    balanced: 'Be helpful and professional. Follow business policies but show empathy. Offer alternatives when you cannot fulfill a request.',
    firm: 'Maintain business policies clearly. Be polite but do not bend rules. Always provide a reason and an alternative.',
    strict: 'Enforce all policies without exception. Be respectful but clear that rules cannot be changed. Redirect customers to proper channels.',
  }
  return instructions[level]
}

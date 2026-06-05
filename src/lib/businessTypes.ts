export const BUSINESS_TYPES = [
  { id: 'boutique', label: 'Boutique', icon: '👗' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  { id: 'hardware', label: 'Hardware', icon: '🔧' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'fast_food', label: 'Fast Food', icon: '🍟' },
  { id: 'bakery', label: 'Bakery', icon: '🥐' },
  { id: 'catering', label: 'Catering', icon: '🍱' },
  { id: 'salon', label: 'Salon', icon: '💇' },
  { id: 'spa', label: 'Spa', icon: '🧖' },
  { id: 'gym', label: 'Gym', icon: '🏋️' },
  { id: 'clinic', label: 'Clinic', icon: '🏥' },
  { id: 'dental', label: 'Dental', icon: '🦷' },
  { id: 'vet', label: 'Vet', icon: '🐾' },
  { id: 'law_firm', label: 'Law Firm', icon: '⚖️' },
  { id: 'accounting', label: 'Accounting', icon: '📊' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏡' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔩' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'car_wash', label: 'Car Wash', icon: '🚗' },
  { id: 'car_rental', label: 'Car Rental', icon: '🚘' },
  { id: 'courier', label: 'Courier', icon: '📦' },
  { id: 'tutoring', label: 'Tutoring', icon: '📚' },
  { id: 'school', label: 'School', icon: '🏫' },
  { id: 'hotel', label: 'Hotel', icon: '🏨' },
  { id: 'farm', label: 'Farm', icon: '🌾' },
  { id: 'digital_agency', label: 'Digital Agency', icon: '💻' },
] as const

export type BusinessTypeId = typeof BUSINESS_TYPES[number]['id']

export function getBusinessTypeLabel(id: string): string {
  return BUSINESS_TYPES.find(b => b.id === id)?.label ?? id
}

export function getBusinessSystemPrompt(type: string): string {
  const prompts: Record<string, string> = {
    restaurant: 'You help customers with menu inquiries, table reservations, and food orders. You know the menu well and can suggest dishes.',
    boutique: 'You help customers find clothing, check sizes and availability, and process orders. You are stylish and knowledgeable about fashion.',
    pharmacy: 'You help customers with medication queries, availability, and orders. Always recommend consulting a doctor for medical advice.',
    grocery: 'You help customers with product availability, prices, and grocery orders. You know the store inventory.',
    salon: 'You help customers book appointments, inquire about services, and get pricing. You are friendly and beauty-focused.',
    gym: 'You help customers with membership plans, class schedules, and fitness queries. You are energetic and motivating.',
    clinic: 'You help patients book appointments and answer general queries. Always advise calling for emergencies.',
    hotel: 'You help guests with room bookings, amenities, and local recommendations. You are hospitable and professional.',
    bakery: 'You help customers with baked goods, custom orders, and daily specials. You are warm and inviting.',
    default: 'You are a helpful AI assistant for this business. You help customers with product inquiries, orders, and general questions.',
  }
  return prompts[type] ?? prompts.default
}

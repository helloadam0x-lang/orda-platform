import { z } from 'zod'

export const orderStatusSchema = z.enum([
  'pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled',
])

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  paymentStatus: z.enum(['unpaid', 'paid']).optional(),
  sendWhatsApp: z.boolean().optional().default(true),
  notes: z.string().max(500).optional(),
  cancellationReason: z.string().max(200).optional(),
})

export const storeOrderSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  items: z.array(z.object({
    productId: z.string().uuid(),
    name: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
    variants: z.record(z.string(), z.string()).optional(),
  })).min(1),
  total: z.number().min(0),
  address: z.string().max(300).optional(),
  zone: z.string().max(100).optional(),
})

export const storeChatSchema = z.object({
  slug: z.string().min(1),
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).max(20).optional().default([]),
  selectedProduct: z.object({ name: z.string(), price: z.number() }).optional(),
})

export const broadcastSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  audience: z.enum(['all', 'vip', 'ordered']),
})

export const pushSendSchema = z.object({
  businessId: z.string().uuid(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(200),
  tag: z.string().optional(),
  url: z.string().optional(),
})

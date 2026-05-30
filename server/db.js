const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function getBusinessByPhone(phone) {
  const { data, error } = await supabase.rpc('get_business_by_phone', { p_phone: phone })
  if (error) throw error
  return data?.[0] || null
}

async function setWhatsAppConnected(businessId, connected, phone = null) {
  const { error } = await supabase.rpc('set_whatsapp_connected', {
    p_business_id: businessId, p_connected: connected, p_phone: phone,
  })
  if (error) throw error
}

async function upsertContact(businessId, phone, name) {
  const { data, error } = await supabase.rpc('upsert_whatsapp_contact', {
    p_business_id: businessId, p_phone: phone, p_name: name,
  })
  if (error) throw error
  return data
}

async function upsertConversation(businessId, contactId, lastMessage) {
  const { data, error } = await supabase.rpc('upsert_whatsapp_conversation', {
    p_business_id: businessId, p_contact_id: contactId, p_last_message: lastMessage,
  })
  if (error) throw error
  return data
}

async function saveMessage(conversationId, businessId, content, role, isAi) {
  const { data, error } = await supabase.rpc('save_whatsapp_message', {
    p_conversation_id: conversationId, p_business_id: businessId,
    p_content: content, p_role: role, p_is_ai: isAi,
  })
  if (error) throw error
  return data
}

async function getHistory(conversationId) {
  const { data, error } = await supabase.rpc('get_conversation_history', {
    p_conversation_id: conversationId, p_limit: 16,
  })
  if (error) throw error
  return data || []
}

async function updateConversationAfterReply(conversationId, aiReply) {
  const { error } = await supabase.rpc('update_conversation_after_reply', {
    p_conversation_id: conversationId, p_ai_reply: aiReply,
  })
  if (error) throw error
}

async function createNotification(businessId, contactName, message, conversationId) {
  const { error } = await supabase.rpc('create_message_notification', {
    p_business_id: businessId, p_contact_name: contactName,
    p_message: message, p_conversation_id: conversationId,
  })
  if (error) throw error
}

async function getConnectedBusinesses() {
  const { data, error } = await supabase.rpc('get_connected_businesses')
  if (error) throw error
  return data || []
}

async function getBusinessById(id) {
  const { data, error } = await supabase.rpc('get_business_by_id', { p_id: id })
  if (error) throw error
  return data?.[0] || null
}

async function getBusinessNotifySettings(id) {
  const { data, error } = await supabase.rpc('get_business_notify_settings', { p_id: id })
  if (error) throw error
  return data?.[0] || null
}

async function getBusinessesForSummary() {
  const { data, error } = await supabase.rpc('get_businesses_for_summary')
  if (error) throw error
  return data || []
}

async function getBusinessDailyStats(businessId, from, to) {
  const { data, error } = await supabase.rpc('get_business_daily_stats', {
    p_business_id: businessId, p_from: from, p_to: to,
  })
  if (error) throw error
  return data?.[0] || null
}

module.exports = {
  getBusinessByPhone, setWhatsAppConnected, upsertContact,
  upsertConversation, saveMessage, getHistory,
  updateConversationAfterReply, createNotification,
  getConnectedBusinesses, getBusinessById,
  getBusinessNotifySettings, getBusinessesForSummary, getBusinessDailyStats,
}

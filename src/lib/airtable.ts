export async function trackNewCustomer(data: {
  businessName: string
  ownerName?: string
  email?: string
  country: string
  city: string
  businessType: string
  referralCode?: string
}) {
  const apiKey = process.env.AIRTABLE_API_KEY
  if (!apiKey) return

  await fetch('https://api.airtable.com/v0/appdEjb7TgMOSElCn/tblnmD9tcfPIm5Xav', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [{
        fields: {
          'Business Name': data.businessName,
          'Owner Name': data.ownerName ?? '',
          'Email': data.email ?? '',
          'Country': data.country,
          'City': data.city,
          'Business Type': data.businessType,
          'Plan': 'Trial',
          'Status': 'New',
          'Referral Code': data.referralCode ?? '',
          'Signup Date': new Date().toISOString().split('T')[0],
        }
      }]
    })
  }).catch(() => {})
}

import type { Card } from './types'

/**
 * Generates a Google Wallet Generic Pass save URL for a business card.
 *
 * Required environment variables:
 *   GOOGLE_WALLET_ISSUER_ID   — your Wallet issuer ID (numeric string)
 *   GOOGLE_WALLET_CLASS_ID    — the Generic Pass class suffix you created
 *   GOOGLE_WALLET_KEY_JSON    — stringified service account JSON with Wallet API access
 */
export async function generateWalletPassUrl(card: Card): Promise<string> {
  const issuerId  = process.env.GOOGLE_WALLET_ISSUER_ID
  const classSuffix = process.env.GOOGLE_WALLET_CLASS_ID ?? 'business_card'
  const keyJson   = process.env.GOOGLE_WALLET_KEY_JSON

  if (!issuerId || !keyJson) {
    throw new Error('Google Wallet env vars not configured')
  }

  const serviceAccount = JSON.parse(keyJson) as {
    client_email: string
    private_key: string
  }

  const objectId = `${issuerId}.${classSuffix}-${card.slug}`

  const textModules: Array<{ header: string; body: string; id: string }> = []
  if (card.job_title) textModules.push({ header: 'Title',   body: card.job_title, id: 'title' })
  if (card.company)   textModules.push({ header: 'Company', body: card.company,   id: 'company' })
  if (card.email)     textModules.push({ header: 'Email',   body: card.email,     id: 'email' })
  if (card.phone)     textModules.push({ header: 'Phone',   body: card.phone,     id: 'phone' })
  if (card.website)   textModules.push({ header: 'Website', body: card.website,   id: 'website' })

  const genericObject = {
    id: objectId,
    classId: `${issuerId}.${classSuffix}`,
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    hexBackgroundColor: card.brand_color,
    cardTitle: {
      defaultValue: { language: 'en-US', value: card.company ?? 'Business Card' },
    },
    subheader: {
      defaultValue: { language: 'en-US', value: card.job_title ?? card.company ?? 'Contact' },
    },
    header: {
      defaultValue: { language: 'en-US', value: card.name },
    },
    textModulesData: textModules,
    ...(card.photo_url ? {
      heroImage: {
        sourceUri: { uri: card.photo_url },
        contentDescription: { defaultValue: { language: 'en-US', value: card.name } },
      },
    } : {}),
  }

  const claims = {
    iss: serviceAccount.client_email,
    aud: 'google',
    origins: [] as string[],
    typ: 'savetowallet',
    payload: { genericObjects: [genericObject] },
    iat: Math.floor(Date.now() / 1000),
  }

  // Sign using google-auth-library's JWT signer
  const { GoogleAuth } = await import('google-auth-library')
  const auth = new GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  })
  const client = await auth.getClient()

  // Use jsonwebtoken to sign the claims with the private key
  const jwt = await import('jsonwebtoken')
  const token = jwt.default.sign(claims, serviceAccount.private_key, { algorithm: 'RS256' })

  return `https://pay.google.com/gp/v/save/${token}`
}

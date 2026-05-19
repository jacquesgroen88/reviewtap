// Proper SVG brand icons — inline, no external deps, no trademark issues
// Each icon uses simplified but recognisable brand shapes.
import React from 'react'

type IconProps = { size?: number; className?: string }

export function InstagramIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor"/>
    </svg>
  )
}

export function FacebookIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="11" fill="currentColor"/>
      <path
        d="M13.5 8.5H15V6H13.5C11.567 6 10 7.567 10 9.5V11H8V13.5H10V21H12.5V13.5H15L15.5 11H12.5V9.5C12.5 8.948 12.948 8.5 13.5 8.5Z"
        fill="white"
      />
    </svg>
  )
}

export function LinkedInIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="currentColor"/>
      <path d="M6 10h2.5v8H6v-8zm1.25-4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="white"/>
      <path d="M11 10h2.4v1.1h.03c.33-.63 1.15-1.3 2.37-1.3 2.54 0 3.2 1.67 3.2 3.84V18H16.5v-3.8c0-.9-.02-2.07-1.26-2.07-1.27 0-1.46 1-1.46 1.99V18H11V10z" fill="white"/>
    </svg>
  )
}

export function YouTubeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M22.5 6.8s-.3-1.9-1.1-2.8c-1.1-1.1-2.3-1.1-2.8-1.2C15.9 2.7 12 2.7 12 2.7s-3.9 0-6.6.1c-.5.1-1.7.1-2.8 1.2C1.8 4.9 1.5 6.8 1.5 6.8S1.2 9 1.2 11.2v2c0 2.2.3 4.4.3 4.4s.3 1.9 1.1 2.8c1.1 1.1 2.5 1.1 3.1 1.1C7.8 21.6 12 21.6 12 21.6s3.9 0 6.6-.1c.5-.1 1.7-.1 2.8-1.2.8-.9 1.1-2.8 1.1-2.8s.3-2.2.3-4.4v-2C22.8 9 22.5 6.8 22.5 6.8zM9.8 15.1V9l6 3.1-6 3z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TikTokIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M19.6 3.3c-1-.5-1.8-1.3-2.2-2.3h-3v13.4a2.1 2.1 0 01-2.1 2 2.1 2.1 0 01-2.1-2 2.1 2.1 0 012.1-2.1c.2 0 .5 0 .7.1V9.2a5.3 5.3 0 00-.7-.1C9 9.1 6.3 11.8 6.3 15s2.7 5.9 6 5.9 6-2.7 6-5.9V8.1c1 .6 2.2 1 3.4 1V6a5.2 5.2 0 01-2.1-.7z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TwitterXIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PinterestIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.9 6.4 9.37-.09-.74-.17-1.87 0-2.67.17-.74 1.1-4.68 1.1-4.68s-.28-.57-.28-1.4c0-1.31.77-2.3 1.72-2.3.81 0 1.2.61 1.2 1.34 0 .82-.52 2.04-.79 3.18-.23.95.47 1.72 1.4 1.72 1.68 0 2.97-1.77 2.97-4.32 0-2.26-1.62-3.84-3.94-3.84-2.68 0-4.26 2.01-4.26 4.09 0 .81.31 1.68.7 2.15.08.1.09.18.07.28l-.26 1.05c-.04.16-.14.2-.32.12-1.18-.55-1.92-2.27-1.92-3.65 0-2.97 2.16-5.7 6.23-5.7 3.27 0 5.82 2.33 5.82 5.45 0 3.25-2.05 5.87-4.9 5.87-.96 0-1.86-.5-2.17-1.09l-.59 2.2c-.21.82-.78 1.85-1.17 2.48.88.27 1.81.42 2.77.42 5.52 0 10-4.48 10-10S17.52 2 12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export function WhatsAppIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M17.47 14.38c-.28-.14-1.66-.82-1.92-.91-.26-.1-.44-.14-.63.14-.19.28-.72.91-.88 1.1-.16.19-.32.21-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.46.1-.18.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.54-.46-.47-.63-.48-.16 0-.35-.01-.54-.01-.19 0-.49.07-.74.35-.26.28-1 1-.97 2.43.02 1.43 1.05 2.82 1.2 3.01.14.19 2.06 3.15 5 4.41 2.94 1.26 2.94.84 3.47.79.53-.05 1.66-.68 1.9-1.33.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33zm-5.47 7.44h-.01c-1.75 0-3.46-.47-4.96-1.36l-.36-.21-3.7.97 1-3.6-.23-.37A9.86 9.86 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"
        fill="currentColor"
      />
    </svg>
  )
}

// Map from platform key to icon component
export const BRAND_ICON_MAP: Record<string, (props: IconProps) => React.ReactElement> = {
  instagram: InstagramIcon,
  facebook:  FacebookIcon,
  linkedin:  LinkedInIcon,
  youtube:   YouTubeIcon,
  tiktok:    TikTokIcon,
  twitter:   TwitterXIcon,
  x:         TwitterXIcon,
  pinterest: PinterestIcon,
  whatsapp:  WhatsAppIcon,
}

// Brand colours per platform (used in SocialRow)
export const BRAND_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook:  '#1877F2',
  linkedin:  '#0A66C2',
  youtube:   '#FF0000',
  tiktok:    '#010101',
  twitter:   '#000000',
  x:         '#000000',
  pinterest: '#E60023',
  whatsapp:  '#25D366',
}

import IntakeForm from '@/components/intake/IntakeForm'

export const metadata = {
  title: 'Create Your Digital Business Card | ReviewTap',
  description: 'Set up your personalised NFC digital business card in minutes.',
}

export default async function NewCardPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const sp = await searchParams
  return <IntakeForm orderRef={sp.ref} />
}

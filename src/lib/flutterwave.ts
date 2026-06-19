import Flutterwave from 'flutterwave-node-v3'

export const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
)

export async function initiatePayment({
  amount,
  currency = 'XOF',
  email,
  phone,
  name,
  tenantId,
  redirectUrl,
}: {
  amount: number
  currency?: string
  email: string
  phone: string
  name: string
  tenantId: string
  redirectUrl: string
}) {
  const payload = {
    tx_ref: `lofa-${tenantId}-${Date.now()}`,
    amount,
    currency,
    redirect_url: redirectUrl,
    customer: {
      email,
      phone_number: phone,
      name,
    },
    customizations: {
      title: 'Lofa - Paiement de loyer',
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
    subaccounts: process.env.FLUTTERWAVE_SUBACCOUNT_ID
      ? [
          {
            id: process.env.FLUTTERWAVE_SUBACCOUNT_ID,
            transaction_split_ratio: 5,
          },
        ]
      : [],
  }

  const response = await flw.Charge.card(payload)
  return response
}

export async function verifyPayment(transactionId: string) {
  const response = await flw.Transaction.verify({ id: transactionId })
  return response
}
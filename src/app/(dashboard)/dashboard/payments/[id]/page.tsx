export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Détail du paiement
      </h1>
      <p className="text-gray-500">Paiement #{id}</p>
      <p className="text-sm text-gray-400 mt-4">Page en construction.</p>
    </div>
  )
}
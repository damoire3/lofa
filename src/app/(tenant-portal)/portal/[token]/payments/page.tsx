export default async function TenantPaymentsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Mes paiements
      </h1>
      <p className="text-sm text-gray-400">Page en construction.</p>
    </div>
  )
}
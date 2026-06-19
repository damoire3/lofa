type StatsCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'green' | 'blue' | 'purple' | 'red'
}

const colorMap = {
  green: 'bg-green-50 border-green-200',
  blue: 'bg-blue-50 border-blue-200',
  purple: 'bg-purple-50 border-purple-200',
  red: 'bg-red-50 border-red-200',
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="w-full flex-grow gap-2 transition-all">
        <div className="bg-white border-2 border-gray-100 hover:border-gray-300 rounded-2xl p-5 flex items-center gap-3 transition-all">
          <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-1 ${colorMap[color]}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
      </div>
    </div>
  )
}
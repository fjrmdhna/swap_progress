import dynamic from 'next/dynamic'

export function CardBarChart() {
  const ChartWithNoSSR = dynamic(() => import('./Chart'), {
    ssr: false,
    loading: () => (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Site Progress by Month</h3>
        <div className="h-[400px] flex items-center justify-center bg-gray-100">
          Loading chart...
        </div>
      </div>
    )
  })

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Site Progress by Month</h3>
      <ChartWithNoSSR />
    </div>
  )
} 
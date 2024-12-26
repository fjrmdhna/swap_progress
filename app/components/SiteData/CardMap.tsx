import dynamic from 'next/dynamic'

// Komponen utama yang akan di-render di server
export function CardMap() {
  // Gunakan dynamic import untuk Map component
  const MapWithNoSSR = dynamic(() => import('@/app/components/SiteData/Map'), {
    ssr: false, // Disable SSR
    loading: () => (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-lg font-medium mb-4">Site Locations</h3>
        <div className="h-[400px] w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          Loading map...
        </div>
      </div>
    )
  })

  return <MapWithNoSSR />
} 
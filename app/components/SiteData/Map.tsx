"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useMemo, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Map as LeafletMap, LatLngExpression } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Konfigurasi custom icon
const customIcon = new L.Icon({
  iconUrl: '/images/leaflet/marker-icon.png',
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Konfigurasi create cluster custom icon
const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(33, 33, true)
  })
}

export default function Map() {
  const { filteredData } = useSiteData()
  const mapRef = useRef<LeafletMap | null>(null)
  
  // Tambahkan key untuk MarkerClusterGroup
  const clusterKey = useMemo(() => Date.now(), [filteredData])

  const markers = useMemo(() => {
    const result = filteredData
      .filter(site => {
        return (
          site.scope_of_work?.toLowerCase() === 'existing' && 
          site.latitude && 
          site.longitude
        )
      })
      .map(site => ({
        id: site.system_key,
        position: [Number(site.latitude), Number(site.longitude)] as [number, number],
        name: site.site_name,
        cluster: site.mc_cluster,
        siteId: site.site_id
      }))
      .filter(marker => 
        !isNaN(marker.position[0]) && 
        !isNaN(marker.position[1]) &&
        marker.position[0] !== 0 &&
        marker.position[1] !== 0
      )

    return result
  }, [filteredData])

  const center = useMemo(() => {
    if (markers.length === 0) return [-2.548926, 118.014863] as LatLngExpression
    
    const totalLat = markers.reduce((sum, marker) => sum + marker.position[0], 0)
    const totalLng = markers.reduce((sum, marker) => sum + marker.position[1], 0)
    
    return [
      totalLat / markers.length,
      totalLng / markers.length
    ] as LatLngExpression
  }, [markers])

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position))
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers])

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-medium mb-4">Site Locations</h3>
      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={5}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            key={clusterKey}
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{marker.name}</p>
                    <p className="text-gray-600">ID: {marker.siteId}</p>
                    <p className="text-gray-600">Cluster: {marker.cluster}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  )
} 
"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix marker icon paths
const icon = L.icon({
  iconUrl: '/images/leaflet/marker-icon.png',
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

// Custom cluster icon
const createClusterCustomIcon = function(cluster: any) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true)
  })
}

export default function Map() {
  const { filteredData } = useSiteData()
  const [map, setMap] = useState<L.Map | null>(null)

  const existingSites = useMemo(() => 
    filteredData.filter(site => 
      site.scope_of_work?.toLowerCase() === 'existing' &&
      site.latitude && 
      site.longitude
    )
  , [filteredData])

  // Update map view when filtered data changes
  useEffect(() => {
    if (map && existingSites.length > 0) {
      const bounds = new L.LatLngBounds(
        existingSites.map(site => [
          Number(site.latitude) || 0,
          Number(site.longitude) || 0
        ])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, existingSites])

  return (
    <MapContainer
      center={[-2.5489, 118.0149]}
      zoom={5}
      className="h-[600px] w-full rounded-xl"
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {useMemo(() => (
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {existingSites.map(site => (
            <Marker
              key={site.system_key}
              position={[
                Number(site.latitude) || 0,
                Number(site.longitude) || 0
              ]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{site.site_name}</h3>
                  <p>Site ID: {site.site_id}</p>
                  <p>MC Cluster: {site.mc_cluster}</p>
                  <p>Province: {site.province}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      ), [existingSites])}
    </MapContainer>
  )
} 
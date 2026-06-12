'use client'

import { useEffect, useRef } from 'react'
import { Stop } from '@/lib/types'

interface Props {
  stops: Stop[]
  className?: string
}

export function RouteMap({ stops, className }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || stops.length === 0) return
    if (mapRef.current) return

    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as string),
    ]).then(([{ default: L }]) => {
      if (!mapContainerRef.current || mapRef.current) return

      const center = stops[Math.floor(stops.length / 2)]
      const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], 14)
      mapRef.current = map

      // OpenStreetMap tiles — 100% free, no key needed
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Route polyline
      const coords = stops.map(s => [s.lat, s.lng] as [number, number])
      L.polyline(coords, { color: '#a855f7', weight: 3, dashArray: '8 4' }).addTo(map)

      // Numbered markers
      stops.forEach((stop, idx) => {
        const icon = L.divIcon({
          html: `<div style="
            width:32px;height:32px;
            background:linear-gradient(135deg,#a855f7,#f97316);
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:700;font-size:13px;
            border:2px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            cursor:pointer;
          ">${idx + 1}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        L.marker([stop.lat, stop.lng], { icon })
          .bindPopup(`<strong>${stop.name}</strong><br/><small>${stop.address}</small>`)
          .addTo(map)
      })

      // Fit all markers in view
      map.fitBounds(L.latLngBounds(coords), { padding: [48, 48] })
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [stops])

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '380px' }}
    />
  )
}

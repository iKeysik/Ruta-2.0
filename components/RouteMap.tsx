'use client'

import { useEffect, useRef } from 'react'
import { Stop } from '@/lib/types'

interface Props {
  stops: Stop[]
  className?: string
}

export function RouteMap({ stops, className }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || stops.length === 0) return
    if (mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    Promise.all([
      import('mapbox-gl'),
      import('mapbox-gl/dist/mapbox-gl.css' as string),
    ]).then(([{ default: mapboxgl }]) => {
      mapboxgl.accessToken = token

      const center = stops[Math.floor(stops.length / 2)]
      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [center.lng, center.lat],
        zoom: 13,
      })
      mapRef.current = map

      map.on('load', () => {
        // Add route line
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: stops.map(s => [s.lng, s.lat]),
            },
          },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#a855f7',
            'line-width': 3,
            'line-dasharray': [2, 1],
          },
        })

        // Add markers
        stops.forEach((stop, idx) => {
          const el = document.createElement('div')
          el.style.cssText = `
            width: 32px; height: 32px;
            background: linear-gradient(135deg, #a855f7, #f97316);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 13px;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            cursor: pointer;
          `
          el.textContent = String(idx + 1)

          new mapboxgl.Marker({ element: el })
            .setLngLat([stop.lng, stop.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
                `<strong>${stop.name}</strong><br/><small>${stop.address}</small>`
              )
            )
            .addTo(map)
        })

        // Fit bounds
        const bounds = stops.reduce(
          (b, s) => b.extend([s.lng, s.lat]),
          new mapboxgl.LngLatBounds([stops[0].lng, stops[0].lat], [stops[0].lng, stops[0].lat])
        )
        map.fitBounds(bounds, { padding: 60 })
      })
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [stops])

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          minHeight: '300px',
        }}
      >
        🗺️ Карта недоступна (нет NEXT_PUBLIC_MAPBOX_TOKEN)
      </div>
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '380px' }}
    />
  )
}

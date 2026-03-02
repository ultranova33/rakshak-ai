"use client"
import * as React from "react"
import dynamic from "next/dynamic"
import { useAppStore } from "@/lib/store"

// Dynamically import map components. Leaflet won't work with SSR since it requires the window object.
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
)
const Circle = dynamic(
    () => import("react-leaflet").then((mod) => mod.Circle),
    { ssr: false }
)
const MapHook = dynamic(
    () => import("./map-hook"),
    { ssr: false }
)

export function MapOverlay() {
    const { currentLocation } = useAppStore();
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="h-full w-full bg-card flex items-center justify-center opacity-50 border border-border">
                <span className="font-mono text-muted-foreground animate-pulse">Initializing Geospatial Arrays...</span>
            </div>
        )
    }

    const isStateSelected = currentLocation.state !== "India Core";

    return (
        <div className="h-full w-full relative z-0 border border-border rounded-sm overflow-hidden shadow-sm">
            <MapContainer
                center={[20.5937, 78.9629]} // India center coordinates
                zoom={5}
                className="h-full w-full bg-[#02020a]" // Match the dark theme backing
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                // A dark-themed map layer perfectly matching the "gloomy tactical" aesthetic.
                />

                {isStateSelected && (
                    <Circle
                        center={[currentLocation.lat, currentLocation.lng]}
                        radius={150000} // ~150km radius to highlight states generally
                        pathOptions={{
                            color: '#c70000',
                            fillColor: '#c70000',
                            fillOpacity: 0.3,
                            weight: 2,
                            dashArray: "10 5"
                        }}
                    />
                )}

                <MapHook location={currentLocation} />
            </MapContainer>

            {/* Tactical UI Map borders overlay to give it a techy feel */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/20 z-[999]" />
            <div className="absolute top-2 left-2 z-[999] pointer-events-none">
                <div className="bg-background/80 px-2 py-1 text-[10px] font-mono border border-border text-muted-foreground uppercase tracking-widest backdrop-blur-sm">
                    CARTO DARK_MATTER LAYER
                </div>
            </div>
        </div>
    )
}

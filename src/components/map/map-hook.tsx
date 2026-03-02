"use client"
import * as React from "react"
import { useMap } from "react-leaflet"
import { LocationData } from "@/lib/geocoding"

export default function MapHook({ location }: { location: LocationData }) {
    const map = useMap();

    React.useEffect(() => {
        if (map && location) {
            map.flyTo([location.lat, location.lng], location.zoom, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [map, location]);

    return null;
}

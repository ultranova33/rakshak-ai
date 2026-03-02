"use client"
import * as React from "react"
import { getCoordinates, LocationData, indianStates } from "@/lib/geocoding"

interface AppState {
    currentLocation: LocationData;
    activeDisaster: string;
    activeSidebarTab: string;
    setCurrentLocation: (query: string) => void;
    setActiveDisaster: (type: string) => void;
    setActiveSidebarTab: (tab: string) => void;
}

const AppContext = React.createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [currentLocation, setLocationState] = React.useState<LocationData>(indianStates["india"])
    const [activeDisaster, setActiveDisaster] = React.useState<string>("None")
    const [activeSidebarTab, setActiveSidebarTab] = React.useState<string>("intel")

    const setCurrentLocation = React.useCallback((query: string) => {
        if (!query) {
            setLocationState(indianStates["india"])
            return
        }
        const coords = getCoordinates(query)
        setLocationState(coords)
    }, [])

    return (
        <AppContext.Provider value={{ currentLocation, setCurrentLocation, activeDisaster, setActiveDisaster, activeSidebarTab, setActiveSidebarTab }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppStore() {
    const context = React.useContext(AppContext)
    if (context === undefined) {
        throw new Error("useAppStore must be used within an AppProvider")
    }
    return context
}

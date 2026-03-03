"use client"
import * as React from "react"
import { StatCard } from "./stat-card"
import { Activity, Wind, Waves, Thermometer } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"

// Basic function to generate contextual mock data per state and disaster type
const generateMockData = (stateName: string, disasterType: string) => {
    let hash = 0;
    for (let i = 0; i < stateName.length; i++) {
        hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    const type = disasterType.toLowerCase();

    // Contextual Boosts
    const isHeatwave = type.includes("heat");
    const isCyclone = type.includes("cyclone") || type.includes("wind");
    const isFlood = type.includes("flood") || type.includes("tsunami");
    const isQuake = type.includes("earthquake") || type.includes("seismic");

    return {
        seismic: isQuake ? ((seed % 40) / 10 + 4.5).toFixed(1) + " M" : ((seed % 10) / 10 + 0.5).toFixed(1) + " M",
        seismicTrend: seed % 2 === 0 ? "up" as const : "down" as const,

        wind: isCyclone ? (110 + (seed % 90)) + " km/h" : (5 + (seed % 25)) + " km/h",
        windLevel: isCyclone ? "critical" as const : (seed % 50 > 40 ? "warning" as const : "normal" as const),

        water: isFlood ? "Danger + " + ((seed % 50) / 10 + 1.5).toFixed(1) + "m" : "Normal (-" + ((seed % 20) / 10).toFixed(1) + "m)",
        waterLevel: isFlood ? "critical" as const : "normal" as const,

        temp: isHeatwave ? (42 + (seed % 8)).toFixed(1) + "°C" : (24 + (seed % 10)).toFixed(1) + "°C",
        tempLevel: isHeatwave ? "critical" as const : "normal" as const,
    }
}

export function SensorFeeds() {
    const { currentLocation, activeDisaster } = useAppStore();

    // React state to hold the animated values
    const [data, setData] = React.useState(generateMockData("india", "None"));

    React.useEffect(() => {
        setData(generateMockData(currentLocation.state, activeDisaster));
    }, [currentLocation.state, activeDisaster]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
                <Activity className="h-5 w-5 animate-pulse" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-[#F8FAFC]">Live Sensor Array</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div key={`s-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <StatCard
                        title="Seismic Activity"
                        value={data.seismic}
                        description={`${currentLocation.state.toUpperCase()} FAULT`}
                        trend={data.seismicTrend}
                        trendValue="+0.1M"
                        alertLevel="warning"
                        icon={<Activity className="h-4 w-4" />}
                    />
                </motion.div>
                <motion.div key={`w-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <StatCard
                        title="Cyclonic Wind Speed"
                        value={data.wind}
                        description={`${currentLocation.state.toUpperCase()} SECTOR`}
                        trend={data.windLevel === 'critical' ? 'up' : 'neutral'}
                        trendValue={data.windLevel === 'critical' ? '+15 km/h' : '0 km/h'}
                        alertLevel={data.windLevel}
                        icon={<Wind className={`h-4 w-4 ${data.windLevel === 'critical' ? 'text-primary animate-pulse' : ''}`} />}
                    />
                </motion.div>
                <motion.div key={`wa-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard
                        title="Fluvial Water Level"
                        value={data.water}
                        description={`${currentLocation.state.toUpperCase()} BASIN`}
                        trend={data.waterLevel === 'critical' ? "up" : "neutral"}
                        trendValue={data.waterLevel === 'critical' ? "+0.5m" : "-0.1m"}
                        alertLevel={data.waterLevel}
                        icon={<Waves className="h-4 w-4" />}
                    />
                </motion.div>
                <motion.div key={`t-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <StatCard
                        title="Core Temp Anomaly"
                        value={data.temp}
                        description={`${currentLocation.state.toUpperCase()} REGION`}
                        trend={data.tempLevel === 'critical' ? "up" : "neutral"}
                        trendValue={data.tempLevel === 'critical' ? "+2.4°C" : "+0.2°C"}
                        alertLevel={data.tempLevel}
                        icon={<Thermometer className={`h-4 w-4 ${data.tempLevel === 'critical' ? 'text-primary animate-pulse' : ''}`} />}
                    />
                </motion.div>
            </div>
        </div>
    )
}

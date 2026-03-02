"use client"
import * as React from "react"
import { StatCard } from "./stat-card"
import { Activity, Wind, Waves, Thermometer } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"

// Basic hash function to generate consistent mock data per state
const generateMockData = (stateName: string) => {
    let hash = 0;
    for (let i = 0; i < stateName.length; i++) {
        hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // If state includes certain keywords, boost specific stats to look authentic
    const ln = stateName.toLowerCase();
    const isCoastal = ln.includes("tamil") || ln.includes("odisha") || ln.includes("gujarat") || ln.includes("bengal") || ln.includes("kerala");
    const isNorth = ln.includes("himachal") || ln.includes("uttarakhand") || ln.includes("jammu") || ln.includes("sikkim");
    const isHot = ln.includes("rajasthan") || ln.includes("gujarat") || ln.includes("delhi");

    return {
        seismic: ((seed % 50) / 10 + 1.2).toFixed(1) + " M",
        seismicTrend: seed % 2 === 0 ? "up" as const : "down" as const,
        wind: isCoastal ? (80 + (seed % 60)) + " km/h" : (15 + (seed % 40)) + " km/h",
        windLevel: isCoastal && (seed % 60 > 40) ? "critical" as const : "warning" as const,
        water: isCoastal ? "Danger + " + ((seed % 30) / 10).toFixed(1) + "m" : "Normal",
        waterLevel: isCoastal ? "warning" as const : "normal" as const,
        temp: isHot ? (40 + (seed % 10)).toFixed(1) + "°C" : isNorth ? (5 + (seed % 15)).toFixed(1) + "°C" : (25 + (seed % 15)).toFixed(1) + "°C",
        tempLevel: isHot ? "critical" as const : "normal" as const,
    }
}

export function SensorFeeds() {
    const { currentLocation } = useAppStore();

    // React state to hold the animated values
    const [data, setData] = React.useState(generateMockData("india"));

    React.useEffect(() => {
        setData(generateMockData(currentLocation.state));
    }, [currentLocation.state]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
                <Activity className="h-5 w-5 animate-pulse" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-[#F8FAFC]">Live Sensor Array</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        trend="up"
                        trendValue="+5 km/h"
                        alertLevel={data.windLevel}
                        icon={<Wind className={`h-4 w-4 ${data.windLevel === 'critical' ? 'text-primary animate-pulse' : ''}`} />}
                    />
                </motion.div>
                <motion.div key={`wa-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard
                        title="Fluvial Water Level"
                        value={data.water}
                        description={`${currentLocation.state.toUpperCase()} BASIN`}
                        trend={data.waterLevel === 'warning' ? "up" : "down"}
                        trendValue="-0.1m"
                        alertLevel={data.waterLevel}
                        icon={<Waves className="h-4 w-4" />}
                    />
                </motion.div>
                <motion.div key={`t-${currentLocation.state}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <StatCard
                        title="Core Temp Anomaly"
                        value={data.temp}
                        description={`${currentLocation.state.toUpperCase()} REGION`}
                        trend="up"
                        trendValue="+1.2°C"
                        alertLevel={data.tempLevel}
                        icon={<Thermometer className={`h-4 w-4 ${data.tempLevel === 'critical' ? 'text-primary animate-pulse' : ''}`} />}
                    />
                </motion.div>
            </div>
        </div>
    )
}

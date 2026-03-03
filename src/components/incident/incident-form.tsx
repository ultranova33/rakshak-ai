"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldAlert } from "lucide-react"
import { analyzeIncident, type RecommendationResponse } from "@/lib/recommendation-engine"
import { useAppStore } from "@/lib/store"

export const nativeIndianDisasters = [
    "Flood",
    "Cyclone",
    "Earthquake",
    "Heatwave",
    "Landslide",
    "Tsunami",
    "Drought",
    "Forest Fire"
];

export function IncidentForm({ onAnalysisComplete }: { onAnalysisComplete: (result: RecommendationResponse | null) => void }) {
    const { setCurrentLocation, setActiveDisaster } = useAppStore()
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsAnalyzing(true)
        onAnalysisComplete(null)

        const formData = new FormData(e.currentTarget)
        const venue = formData.get("venue") as string
        const type = formData.get("type") as string
        const pop = parseInt(formData.get("pop") as string) || 0

        // Set Global Context for Map FlyTo and active disaster state
        setCurrentLocation(venue)
        setActiveDisaster(type)

        // Simulate mechanical calculation delay
        setTimeout(() => {
            const output = analyzeIncident({ venue, disasterType: type, populationAffected: pop })
            onAnalysisComplete(output)
            setIsAnalyzing(false)
        }, 1200)
    }

    return (
        <div className="flex flex-col gap-6 w-full text-foreground">
            {/* Assessment Form */}
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#F8FAFC] border-b border-border pb-2 flex justify-between items-center">
                Incident Analysis Engine
                <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Venue / Indian State</label>
                    <Input name="venue" required placeholder="e.g. Tamil Nadu, Odisha, Kerala" />
                </div>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Disaster Type</label>
                        <select
                            name="type"
                            required
                            defaultValue=""
                            className="flex h-10 w-full rounded-sm border border-border bg-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors duration-200 text-foreground"
                        >
                            <option value="" disabled>Select Incident Type</option>
                            {nativeIndianDisasters.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32 shrink-0">
                        <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Est. Population</label>
                        <Input name="pop" type="number" required placeholder="e.g. 150k" className="h-10" />
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="default"
                    disabled={isAnalyzing}
                    className="w-full h-11"
                >
                    {isAnalyzing ? (
                        <span className="flex items-center gap-2 animate-pulse font-mono tracking-widest">
                            CALCULATING THREAT MATRIX...
                        </span>
                    ) : (
                        <span className="font-mono tracking-widest">RUN PREDICTIVE ANALYSIS</span>
                    )}
                </Button>
            </form>
        </div>
    )
}

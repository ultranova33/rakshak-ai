"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Clock, ShieldCheck, AlertTriangle } from "lucide-react"
import { RecommendationResponse } from "@/lib/recommendation-engine"
import { cn } from "@/lib/utils"

interface ForecastConditionsProps {
    analysis: RecommendationResponse | null;
}

export function ForecastConditions({ analysis }: ForecastConditionsProps) {
    if (!analysis) {
        return (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-card/30 p-8 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/30 mb-4" />
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Awaiting Analysis for Forecast Data
                </p>
            </div>
        );
    }

    const { forecast } = analysis;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full gap-4"
        >
            <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#F8FAFC]">Forecast Conditions</h2>
                <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1",
                    forecast.trend === "worsening" ? "bg-primary/20 text-primary shadow-[0_0_8px_rgba(199,0,0,0.3)]" :
                        forecast.trend === "improving" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                )}>
                    {forecast.trend === "worsening" && <TrendingUp className="h-3 w-3" />}
                    {forecast.trend === "improving" && <TrendingDown className="h-3 w-3" />}
                    {forecast.trend === "stable" && <Minus className="h-3 w-3" />}
                    {forecast.trend}
                </div>
            </div>

            <Card className="bg-card border-border/50 flex-1 flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Next Horizon: {forecast.eta}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6">
                    <div className="bg-background/40 p-4 border-l-2 border-primary rounded-r-sm">
                        <p className="text-sm text-foreground leading-relaxed italic font-serif">
                            "{forecast.message}"
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Tactical Projections
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-card border border-border/50 rounded-sm">
                                <span className="text-[9px] text-muted-foreground uppercase block mb-1 font-mono">Persistence</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">High</span>
                            </div>
                            <div className="p-3 bg-card border border-border/50 rounded-sm">
                                <span className="text-[9px] text-muted-foreground uppercase block mb-1 font-mono">Confidence</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">88%</span>
                            </div>
                        </div>

                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-sm flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Status: Monitoring</span>
                                <span className="text-[9px] text-muted-foreground font-mono">Satellite telemetry synced via GSAT-29</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

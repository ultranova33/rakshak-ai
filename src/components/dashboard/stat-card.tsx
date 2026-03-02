import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    alertLevel?: "normal" | "warning" | "critical"
    icon?: React.ReactNode
}

export function StatCard({
    title,
    value,
    description,
    trend,
    trendValue,
    alertLevel = "normal",
    icon
}: StatCardProps) {
    const alertStyles = {
        normal: "border-border text-foreground",
        warning: "border-orange-500/50 bg-orange-950/20",
        critical: "border-primary shadow-[0_0_15px_rgba(199,0,0,0.5)] bg-[#c70000]/10",
    }

    return (
        <Card className={cn(
            "transition-all duration-300 relative overflow-hidden",
            alertStyles[alertLevel]
        )}>
            {alertLevel === "critical" && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary animate-pulse" />
            )}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
                {(description || trendValue) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        {trend === "up" && <span className="text-[#c70000]">↑</span>}
                        {trend === "down" && <span className="text-green-500">↓</span>}
                        {trend === "neutral" && <span className="text-slate-500">-</span>}
                        {trendValue && <span>{trendValue}</span>}
                        {description && <span className="text-slate-500">({description})</span>}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

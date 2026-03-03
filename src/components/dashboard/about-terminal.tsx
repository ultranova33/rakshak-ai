"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { ShieldAlert, Target, Zap, Waves, ShieldCheck } from "lucide-react"

export function AboutTerminal() {
    return (
        <div className="relative flex flex-col gap-8 py-4 animate-in fade-in duration-700 min-h-[600px]">
            {/* Background Infographic */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
                <img
                    src="/tactical_earth_infographic.png"
                    alt="Tactical Earth Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10">
                <div className="mb-10">
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                        Terminal Manifest<span className="text-primary">: About Us</span>
                    </h2>
                    <p className="text-sm font-mono text-primary mt-2 uppercase tracking-[0.3em]">System Identity & Operational Doctrine</p>
                </div>

                {/* Mission Manifest Layer */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 bg-card border border-border/50 rounded-sm hover:border-primary/50 transition-colors group">
                        <Target className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Mission Critical</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            To eradicate human response latency in disaster scenarios. Rakshak.AI provides <span className="text-white italic">Zero-Bias</span> tactical strategies when seconds define survival.
                        </p>
                    </div>

                    <div className="p-6 bg-card border border-border/50 rounded-sm hover:border-primary/50 transition-colors group">
                        <Zap className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Hyper Precision</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Leveraging real-time fluvial, cyclonic, and seismic sensors to predict the <span className="text-white italic">Next Warning</span> before it becomes a tragedy.
                        </p>
                    </div>

                    <div className="p-6 bg-card border border-border/50 rounded-sm hover:border-primary/50 transition-colors group">
                        <ShieldCheck className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Unified Defense</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Bridging the gap between Ministry protocols and field deployment via an automated <span className="text-white italic">National Action Directory</span>.
                        </p>
                    </div>
                </div>

                {/* Terminal Usage Guide */}
                <div className="bg-secondary/10 border border-primary/20 p-8 rounded-sm">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 tracking-[0.2em] uppercase">
                        <ShieldAlert className="h-6 w-6" /> System Operations Guide
                    </h3>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center font-mono text-primary font-bold text-sm">01</span>
                            <div>
                                <h4 className="text-white font-bold uppercase text-sm mb-1">Initialize Intel</h4>
                                <p className="text-xs text-muted-foreground">Select current venue and disaster type in the 'Live Intel' panel to fetch synchronized sensor telemetry.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center font-mono text-primary font-bold text-sm">02</span>
                            <div>
                                <h4 className="text-white font-bold uppercase text-sm mb-1">Execute Analysis</h4>
                                <p className="text-xs text-muted-foreground">Run the Predictive Analysis engine to generate historical matching strategies and threat severity indexing.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center font-mono text-primary font-bold text-sm">03</span>
                            <div>
                                <h4 className="text-white font-bold uppercase text-sm mb-1">Deploy Protocols</h4>
                                <p className="text-xs text-muted-foreground">Access the Action Directory to obtain verified contact data for NDRF, SDMA, and specialized emergency battalions.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Tag */}
                <div className="flex items-center justify-center py-8 opacity-30">
                    <div className="h-px w-12 bg-border" />
                    <span className="px-4 font-mono text-[10px] tracking-[0.5em] text-muted-foreground uppercase">Rakshak AI Strategic Response Terminal v4.0.5</span>
                    <div className="h-px w-12 bg-border" />
                </div>
            </div>
        </div>
    )
}

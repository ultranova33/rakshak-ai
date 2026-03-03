"use client"
import * as React from "react"
import { CommandLayout } from "@/components/layout/command-layout"
import { SensorFeeds } from "@/components/dashboard/sensor-feeds"
import { MapOverlay } from "@/components/map/map-overlay"
import { IncidentForm } from "@/components/incident/incident-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecommendationResponse } from "@/lib/recommendation-engine"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { getIncidentHistoryForState } from "@/lib/state-history-db"
import { AlertCircle, FileText, PhoneCall, History, Globe, Database, ShieldAlert } from "lucide-react"

import { ForecastConditions } from "@/components/dashboard/forecast-conditions"
import { AboutTerminal } from "@/components/dashboard/about-terminal"

export default function Home() {
  const { activeSidebarTab, currentLocation, activeDisaster } = useAppStore();
  const [analysisResult, setAnalysisResult] = React.useState<RecommendationResponse | null>(null)
  const [activeTab, setActiveTab] = React.useState("intel")

  const handleAnalysisComplete = (result: RecommendationResponse | null) => {
    setAnalysisResult(result)
    if (result) {
      setActiveTab("action") // Auto-switch to Action tab when analysis finishes
    }
  }

  return (
    <CommandLayout>
      {/* Top Section: Sensor Feeds (Hidden on About Us page) */}
      {activeSidebarTab !== "about" && (
        <section className="w-full">
          <SensorFeeds />
        </section>
      )}

      {/* Main View controlled by Sidebar */}
      {activeSidebarTab === "intel" ? (
        <section className="flex flex-col xl:flex-row flex-1 gap-6 w-full min-h-[500px]">
          {/* Left Column: Map Overlay (Now 1/3 width) */}
          <div className="w-full xl:flex-1 h-[300px] sm:h-[400px] xl:h-auto rounded-sm overflow-hidden border border-border bg-card relative min-w-[300px]">
            <MapOverlay />
          </div>

          {/* Center Column: Split View Panel (Now 1/3 width) */}
          <div className="w-full xl:flex-1 rounded-sm border border-border bg-card overflow-hidden flex flex-col min-w-[300px] min-h-[500px]">
            <Tabs defaultValue="intel" value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-card border-b border-border/50 rounded-none h-12 shadow-sm">
                <TabsTrigger value="intel" className="rounded-none uppercase tracking-widest text-[10px] sm:text-xs">Live Intel</TabsTrigger>
                <TabsTrigger value="action" className="rounded-none uppercase tracking-widest text-[10px] sm:text-xs">Action Directory</TabsTrigger>
              </TabsList>

              <div className="p-4 flex-1 overflow-y-auto">
                <TabsContent value="intel" className="mt-0 h-full">
                  <IncidentForm onAnalysisComplete={handleAnalysisComplete} />

                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-6 border-t border-border/50 pt-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-muted-foreground">THREAT SEVERITY INDEX:</span>
                        <span className={`text-xl font-bold font-mono ${analysisResult.severity >= 8 ? "text-primary animate-pulse" : "text-orange-500"}`}>
                          {analysisResult.severity} / 10
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        SYSTEM NOTE: Awaiting deploy commands. Switch to ACTION DIRECTORY to execute response protocols.
                      </div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="action" className="mt-0 h-full">
                  <AnimatePresence mode="wait">
                    {!analysisResult ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="opacity-50 text-sm font-mono text-muted-foreground animate-pulse flex flex-col items-center justify-center h-48 border border-dashed border-border"
                      >
                        [AWAITING INCIDENT DATA FROM INTEL]
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4"
                      >
                        <Card className="bg-secondary/20 border-border/50">
                          <CardContent className="p-4 flex flex-col gap-3">
                            <div className="flex items-start gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-white">Recommended Strategy</h4>
                                {analysisResult.historicalMatch ? (
                                  <p className="text-xs text-primary font-mono mb-2">→ HIGH CONFIDENCE MATCH: {analysisResult.historyTitle}</p>
                                ) : (
                                  <p className="text-xs text-orange-400 font-mono mb-2">→ NO EXACT LOCAL HISTORY FOUND. USING STANDARD PROTOCOL.</p>
                                )}
                                <ul className="text-sm text-foreground space-y-2 mt-2 list-disc pl-4">
                                  {analysisResult.strategies.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {analysisResult.warnings.length > 0 && (
                          <div className="px-4 py-3 bg-primary/10 border border-primary/30 rounded-sm">
                            <h4 className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-2">
                              <AlertCircle className="h-4 w-4" /> Tactical Warnings
                            </h4>
                            <ul className="text-sm text-primary/90 space-y-1 list-disc pl-4">
                              {analysisResult.warnings.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-1">
                            Action Directory Updates
                          </span>
                          {analysisResult.ctaContacts.map((cta, i) => (
                            <Button key={i} variant="destructive" className="w-full justify-between px-4 h-12 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-gradient-to-r from-[#c70000]/0 via-[#c70000]/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                              <span className="flex flex-col items-start leading-none relative z-10">
                                <span className="font-bold tracking-widest text-xs uppercase">{cta.name}</span>
                                <span className="text-[10px] text-white/70 font-mono mt-1">{cta.instructions}</span>
                              </span>
                              <span className="flex items-center gap-2 relative z-10">
                                <PhoneCall className="h-4 w-4" />
                                <span className="font-mono">{cta.contact}</span>
                              </span>
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Column: Forecast Conditions (New 1/3 width) */}
          <div className="w-full xl:flex-1 rounded-sm border border-border bg-card p-4 overflow-hidden flex flex-col min-w-[300px]">
            <ForecastConditions analysis={analysisResult} />
          </div>
        </section>
      ) : activeSidebarTab === "history" ? (
        <section className="flex flex-col flex-1 border border-border bg-card rounded-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#F8FAFC] flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Global Incident Database
            </h2>
            <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-sm border border-border">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                QUERYING: {currentLocation.state === "India Core" ? "NATIONAL SUMMARY" : currentLocation.state.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="p-4 text-foreground flex-1 overflow-y-auto bg-background/50">
            {(() => {
              const records = getIncidentHistoryForState(currentLocation.state, activeDisaster);
              if (records.length === 0) {
                return (
                  <div className="w-full h-full flex items-center justify-center opacity-50 flex-col gap-2">
                    <Database className="h-8 w-8 text-muted-foreground" />
                    <span className="font-mono text-muted-foreground uppercase">No historical records parsed for this zone.</span>
                  </div>
                );
              }

              return (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {records.map(record => (
                    <Card key={record.id} className="bg-card border-border/50 hover:border-primary/50 transition-colors">
                      <CardContent className="p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">{record.year} • {record.type}</span>
                            <h3 className="text-base font-bold text-white mt-1 leading-tight">{record.type} Incident</h3>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Severity</span>
                            <span className={`text-lg font-mono font-bold ${record.severity >= 9 ? 'text-primary' : 'text-orange-500'}`}>{record.severity}/10</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.description}
                        </div>
                        <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-xs font-mono">
                          <span className="text-muted-foreground">AFFECTED REGIONS:</span>
                          <span className="text-white bg-white/10 px-2 py-0.5 rounded-sm">{record.affected}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            })()}
          </div>
        </section>
      ) : activeSidebarTab === "contacts" ? (
        <section className="flex flex-col flex-1 border border-border bg-card rounded-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#F8FAFC] flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              National Action Directory
            </h2>
            <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-sm border border-border">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                VERIFIED EMERGENCY CONTACTS
              </span>
            </div>
          </div>
          <div className="p-6 text-foreground flex-1 overflow-y-auto bg-background/50">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[
                { state: "National (Pan-India)", org: "Emergency Response", act: "All Emergencies", num: "112" },
                { state: "National (Pan-India)", org: "NDMA Control Room", act: "Disaster Auth", num: "011-1078" },
                { state: "Tamil Nadu", org: "State Emergency", act: "SEOC Relief", num: "1070" },
                { state: "Tamil Nadu", org: "NDRF 4th Battalion", act: "Arakkonam Base", num: "044-2775" },
                { state: "Odisha", org: "ODRAF HQ", act: "State Control", num: "1070" },
                { state: "Odisha", org: "NDRF 3rd Battalion", act: "Mundali Base", num: "0671-2879" },
                { state: "Kerala", org: "KSDMA Control", act: "Dist. Collectors", num: "1077" },
                { state: "Delhi", org: "DDMA Control", act: "Urban Rescue", num: "1077" },
                { state: "Delhi", org: "NDRF 8th Battalion", act: "CBRN Units", num: "0120-2766" },
                { state: "Gujarat", org: "GSDMA Emergency", act: "Gandhinagar HQ", num: "1070" },
                { state: "Maharashtra", org: "Disaster Control", act: "BMC Protocols", num: "1070" },
                { state: "Maharashtra", org: "NDRF 5th Battalion", act: "Pune Base", num: "02114-2451" },
              ].map((contact, idx) => (
                <Card key={idx} className="bg-card border-border/50 flex flex-col overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-0 flex flex-col h-full relative z-10">
                    <div className="p-4 border-b border-border/50">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{contact.state}</span>
                      <h3 className="text-white font-bold tracking-wider leading-tight mt-1 truncate" title={contact.org}>{contact.org}</h3>
                      <span className="text-xs text-primary font-mono">{contact.act}</span>
                    </div>
                    <div className="p-4 bg-black/20 mt-auto flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold tracking-widest text-[#F8FAFC]">{contact.num}</span>
                      <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col flex-1 border border-border bg-card rounded-sm overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#F8FAFC] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Terminal Manifest: About Rakshak.AI
            </h2>
            <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-sm border border-border">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                SYSTEM OPERATIONAL STATUS: NOMINAL
              </span>
            </div>
          </div>
          <div className="p-6 text-foreground flex-1 overflow-y-auto bg-background/50">
            <AboutTerminal />
          </div>
        </section>
      )}
    </CommandLayout >
  )
}

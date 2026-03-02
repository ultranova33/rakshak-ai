"use client"
import * as React from "react"
import { ShieldAlert, Activity, Database, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export function CommandLayout({ children }: { children: React.ReactNode }) {
    const { currentLocation, activeSidebarTab, setActiveSidebarTab } = useAppStore()
    const [timeStr, setTimeStr] = React.useState<string>("");

    React.useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'short', day: '2-digit' };
            const datePart = now.toLocaleDateString('en-IN', dateOptions).toUpperCase();
            const timePart = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
            setTimeStr(`${datePart}   —   ${timePart} IST`);
        };

        const interval = setInterval(updateClock, 1000);
        updateClock();
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
            {/* Top Header Panel */}
            <header className="grid grid-cols-3 items-center border-b border-border/50 bg-card px-6 shrink-0 shadow-md h-20">
                {/* Left Side: Ministry Identifiers */}
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] leading-tight">Ministry of Home Affairs</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] leading-tight text-primary">Disaster Management Division</span>
                    </div>
                </div>

                {/* Center Side: Rakshak AI Title */}
                <div className="flex justify-center flex-col items-center">
                    <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#F8FAFC] flex items-center gap-2">
                        RAKSHAK <span className="text-primary">AI</span>
                    </h1>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                        Strategic Response Terminal
                    </div>
                </div>

                {/* Right Side: System Stats and Clock */}
                <div className="flex items-center gap-6 justify-self-end">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c70000] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c70000]"></span>
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground hidden xl:inline">System Active</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground border-l border-border/50 pl-6 flex flex-col text-right min-w-[300px]">
                        <span className="text-[#F8FAFC] tracking-widest">{timeStr || "LOADING CLOCK..."}</span>
                        <span className="text-primary tracking-widest">LAT: {currentLocation.lat.toFixed(4)} / LNG: {currentLocation.lng.toFixed(4)} / {currentLocation.state.toUpperCase()}</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Tactical Sidebar */}
                <aside className="w-16 sm:w-60 border-r border-border/50 bg-card flex flex-col pt-2 shrink-0 transition-all duration-300">
                    <nav className="flex-1 flex flex-col px-2">
                        {[
                            { id: "intel", icon: Activity, label: "Live Intel" },
                            { id: "history", icon: Database, label: "Incident History" },
                            { id: "contacts", icon: Phone, label: "Action Directory" },
                        ].map((item, idx) => {
                            const active = activeSidebarTab === item.id;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSidebarTab(item.id)}
                                    className={cn(
                                        "flex items-center gap-4 w-full h-12 rounded-sm px-4 mb-1 text-[10px] font-bold transition-all duration-200 focus-visible:outline-none border-l-2 uppercase tracking-widest whitespace-nowrap",
                                        active
                                            ? "bg-primary/10 text-primary border-primary shadow-[inset_4px_0_10px_rgba(199,0,0,0.1)]"
                                            : "text-muted-foreground border-transparent hover:bg-muted/30 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Interface Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background relative scroll-smooth flex flex-col gap-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

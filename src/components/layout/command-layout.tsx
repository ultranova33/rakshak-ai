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
        <div className="flex min-h-screen sm:h-screen w-full flex-col bg-background text-foreground overflow-x-hidden">
            {/* Top Header Panel */}
            <header className="grid grid-cols-2 sm:grid-cols-3 items-center border-b border-border/50 bg-card px-4 sm:px-6 shrink-0 shadow-md h-16 sm:h-20 sticky top-0 z-50">
                {/* Left Side: Ministry Identifiers */}
                <div className="flex items-center">
                    <div className="flex flex-col border-l-2 border-primary pl-3 sm:pl-4">
                        <span className="text-[10px] sm:text-xs font-mono text-white uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-tight">Ministry of Home Affairs</span>
                        <span className="text-[10px] sm:text-xs font-mono text-primary uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-tight mt-0.5 whitespace-nowrap">Disaster Management</span>
                    </div>
                </div>

                {/* Center Side: Rakshak AI Title (Hidden on small mobile if needed, or scaled) */}
                <div className="hidden sm:flex justify-center flex-col items-center">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-[0.1em] text-[#F8FAFC] flex items-center">
                        Rakshak<span className="text-primary">.AI</span>
                    </h1>
                    <div className="text-[8px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] sm:tracking-[0.5em] mt-1 opacity-80">
                        Strategic Response Terminal
                    </div>
                </div>

                {/* Right Side: System Stats and Clock */}
                <div className="flex items-center gap-2 sm:gap-6 justify-self-end">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c70000] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-[#c70000]"></span>
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] text-muted-foreground">Active</span>
                    </div>
                    <div className="hidden md:flex text-[10px] font-mono text-muted-foreground border-l border-border/50 pl-6 flex-col text-right min-w-[200px] xl:min-w-[300px]">
                        <span className="text-[#F8FAFC] tracking-widest truncate">{timeStr || "LOADING..."}</span>
                        <span className="text-primary tracking-widest truncate text-[9px]">LAT: {currentLocation.lat.toFixed(2)} / LNG: {currentLocation.lng.toFixed(2)}</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden pb-16 sm:pb-0">
                {/* Tactical Sidebar (Hidden on mobile) */}
                <aside className="hidden sm:flex w-16 sm:w-60 border-r border-border/50 bg-card flex-col pt-2 shrink-0 transition-all duration-300">
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
                                        "flex items-center gap-5 w-full h-16 rounded-sm px-5 mb-2 text-xs font-bold transition-all duration-200 focus-visible:outline-none border-l-4 uppercase tracking-widest whitespace-nowrap",
                                        active
                                            ? "bg-primary/10 text-primary border-primary shadow-[inset_6px_0_15px_rgba(199,0,0,0.15)]"
                                            : "text-muted-foreground border-transparent hover:bg-muted/30 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-7 w-7 shrink-0" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Interface Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background relative scroll-smooth flex flex-col gap-6 w-full">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/50 flex items-center justify-around px-4 z-50">
                {[
                    { id: "intel", icon: Activity, label: "Intel" },
                    { id: "history", icon: Database, label: "History" },
                    { id: "contacts", icon: Phone, label: "Directory" },
                ].map((item, idx) => {
                    const active = activeSidebarTab === item.id;
                    return (
                        <button
                            key={idx}
                            onClick={() => setActiveSidebarTab(item.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                                active ? "text-primary scale-110" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                            {active && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

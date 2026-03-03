export interface HistoricalIncident {
    id: string;
    year: number;
    type: string;
    severity: number;
    affected: string;
    description: string;
}

// Simulated database parsed from internet history
const historyDB: Record<string, HistoricalIncident[]> = {
    "tamil nadu": [
        { id: "tn-1", year: 2015, type: "Flood", severity: 9, affected: "1.8M+", description: "Devastating floods in Chennai, Kanchipuram, and Tiruvallur due to heavy Northeast monsoon." },
        { id: "tn-2", year: 2004, type: "Tsunami", severity: 10, affected: "8000+ (Casualties)", description: "Indian Ocean Tsunami caused massive destruction along the eastern Coromandel coast." },
        { id: "tn-3", year: 2018, type: "Cyclone", severity: 8, affected: "3.5M", description: "Cyclone Gaja made landfall near Vedaranyam, severely impacting agricultural districts." },
        { id: "tn-4", year: 2019, type: "Heatwave", severity: 7, affected: "State-wide", description: "Record temperatures in Vellore and Chennai causing significant health emergencies." },
    ],
    "odisha": [
        { id: "od-1", year: 1999, type: "Cyclone", severity: 10, affected: "15M+", description: "The most intense recorded tropical cyclone in the North Indian Ocean." },
        { id: "od-2", year: 2019, type: "Cyclone", severity: 9, affected: "1.2M Evacuated", description: "Extremely severe cyclonic storm striking Puri. Notable for massive successful pre-evacuation." },
        { id: "od-3", year: 2020, type: "Flood", severity: 7, affected: "800K", description: "Mahanadi river basin flooding following heavy monsoon discharge." },
        { id: "od-4", year: 2022, type: "Heatwave", severity: 6, affected: "Interior Districts", description: "Severe heatwave conditions in Sambalpur and Titlagarh." },
    ],
    "kerala": [
        { id: "kl-1", year: 2018, type: "Flood", severity: 10, affected: "5.4M+", description: "Unusually high rainfall during the monsoon season caused the worst flooding in Kerala in nearly a century." },
        { id: "kl-2", year: 2019, type: "Landslide", severity: 9, affected: "2.5M", description: "Severe landslides in Wayanad and Malappuram districts triggered by heavy monsoon rains." },
        { id: "kl-3", year: 2021, type: "Flood", severity: 8, affected: "1M+", description: "Flash floods and landslides across central Kerala districts." },
    ],
    "gujarat": [
        { id: "gj-1", year: 2001, type: "Earthquake", severity: 10, affected: "13K+ (Casualties)", description: "Bhuj earthquake (7.7 Mw) caused massive destruction in Kutch district." },
        { id: "gj-2", year: 2017, type: "Flood", severity: 8, affected: "1.2M", description: "Heavy rains caused fatal flooding, heavily impacting Banaskantha." },
        { id: "gj-3", year: 1998, type: "Cyclone", severity: 9, affected: "2M+", description: "Severe Cyclonic Storm slammed the Kandla port resulting in tremendous damage." },
        { id: "gj-4", year: 2023, type: "Cyclone", severity: 8, affected: "Kutch/Saurashtra", description: "Cyclone Biparjoy landfall in Kutch district with extensive infrastructure damage." },
    ],
    "maharashtra": [
        { id: "mh-1", year: 2005, type: "Flood", severity: 9, affected: "20M", description: "July 26 floods in Mumbai receiving 944mm rainfall in 24 hours paralyzing the city." },
        { id: "mh-2", year: 1993, type: "Earthquake", severity: 8, affected: "10K+ (Casualties)", description: "Latur earthquake (6.2 Mw) severely affected Latur and Osmanabad districts." },
        { id: "mh-3", year: 2021, type: "Landslide", severity: 7, affected: "300K", description: "Heavy rains triggered deadly landslides in Raigad and Ratnagiri districts." },
        { id: "mh-4", year: 2022, type: "Heatwave", severity: 6, affected: "Vidarbha", description: "Intense heatwave in Vidarbha region with record temperatures." },
    ],
    "delhi": [
        { id: "dl-1", year: 2023, type: "Flood", severity: 7, affected: "100K+", description: "Yamuna river crossed danger mark significantly leading to lowest areas facing severe waterlogging." },
        { id: "dl-2", year: 2019, type: "Heatwave", severity: 9, affected: "City-wide", description: "Severe heatwave conditions with temperatures crossing 48°C affecting daily operations." },
        { id: "dl-3", year: 2024, type: "Heatwave", severity: 10, affected: "City-wide", description: "Record-breaking heatwave with temperatures reaching 49.9°C in Mungeshpur." },
        { id: "dl-4", year: 2021, type: "Drought/Smog", severity: 8, affected: "City-wide", description: "Severe air quality index (AQI) plunge during winter crop burning seasons leading to health emergency." },
    ],
};

export function getIncidentHistoryForState(stateQuery: string, disasterType?: string): HistoricalIncident[] {
    let records: HistoricalIncident[] = [];
    const normalizedState = stateQuery.toLowerCase();
    const normalizedType = disasterType?.toLowerCase() || "";

    // 1. Find state records
    for (const [state, stateRecords] of Object.entries(historyDB)) {
        if (normalizedState.includes(state)) {
            records = [...stateRecords];
            break;
        }
    }

    // 2. If no state records, use national summaries
    if (records.length === 0) {
        records = [
            historyDB["odisha"][0],
            historyDB["gujarat"][0],
            historyDB["kerala"][0],
            historyDB["maharashtra"][0]
        ];
    }

    // 3. Filter by Disaster Type if provided
    if (normalizedType && normalizedType !== "none") {
        const filtered = records.filter(r =>
            normalizedType.includes(r.type.toLowerCase()) ||
            r.type.toLowerCase().includes(normalizedType) ||
            (normalizedType === "heatwave" && r.type.toLowerCase().includes("heat")) ||
            (normalizedType === "flood" && r.type.toLowerCase().includes("rain"))
        );

        // If we have filtered matches, return them. Otherwise return state records to show location history even if type differs.
        if (filtered.length > 0) return filtered;
    }

    return records;
}

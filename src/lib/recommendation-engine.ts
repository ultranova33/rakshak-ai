export interface IncidentData {
    disasterType: string;
    venue: string;
    populationAffected: number;
}

export interface RecommendationResponse {
    severity: number;
    historicalMatch: boolean;
    historyTitle?: string;
    strategies: string[];
    warnings: string[];
    forecast: {
        trend: "worsening" | "improving" | "stable";
        message: string;
        eta: string;
    };
    ctaContacts: { name: string; contact: string; instructions: string }[];
}

// Hardcoded historical data for India
const historicalData = [
    {
        venueKeywords: ["chennai", "tamil nadu", "tn"],
        disasterKeywords: ["flood", "floods", "rain", "cyclone"],
        title: "Chennai Floods 2015",
        strategies: [
            "Immediate deployment of NDRF continuous boats to low lying areas like Velachery.",
            "Co-opt local fishermen with motorized boats for rapid extraction.",
            "Airdrop food packets strictly in localized safe zones, avoid widespread dropping over water."
        ],
        warnings: [
            "DO NOT overload primary hospital power backups without immediate diesel reinforcements."
        ]
    },
    {
        venueKeywords: ["odisha", "puri", "bhubaneswar"],
        disasterKeywords: ["cyclone", "fani", "wind"],
        title: "Odisha Cyclone Fani 2019",
        strategies: [
            "Mass evacuation of coastal regions 48hrs prior if possible.",
            "Activate ODRF (Odisha Disaster Rapid Force) immediately.",
            "Pre-position satellite phones; cellular networks will collapse."
        ],
        warnings: [
            "DO NOT rely on local VHF radio towers - high winds strip antennas."
        ]
    }
];

// Fallback generic protocols
const genericProtocols: Record<string, { strategies: string[], warnings: string[] }> = {
    flood: {
        strategies: ["Evacuate to higher ground.", "Deploy SDRF water rescue teams.", "Shut off main power grids in affected zones."],
        warnings: ["Risk of electrocution if power grids remain active.", "Waterborne disease outbreak highly probable within 48 hrs."]
    },
    earthquake: {
        strategies: ["Deploy NDRF search and rescue (SAR) with canine units.", "Establish open-air triage centers.", "Mobilize heavy earth-moving equipment from nearby districts."],
        warnings: ["Beware of aftershocks compromising weakened structures.", "Gas leaks are a primary secondary hazard."]
    },
    fire: {
        strategies: ["Deploy multi-district fire tenders.", "Air force deployment for bambi bucket operations if forest fire.", "Immediate medical camps for smoke inhalation."],
        warnings: ["Wind direction changes can rapidly trap rescue units."]
    }
};

export function analyzeIncident(data: IncidentData): RecommendationResponse {
    // 1. Calculate Severity (1-10)
    // Simple heuristic: Base 3 + points for large population
    let severity = 3;
    if (data.populationAffected > 1000) severity += 2;
    if (data.populationAffected > 10000) severity += 4;
    if (data.populationAffected > 100000) severity += 6;
    if (severity > 10) severity = 10;

    const venueLower = data.venue.toLowerCase();
    const disasterLower = data.disasterType.toLowerCase();

    // 2. Keyword Match against History
    let matchedHistory = null;
    for (const hist of historicalData) {
        const venueMatch = hist.venueKeywords.some(kw => venueLower.includes(kw));
        const disasterMatch = hist.disasterKeywords.some(kw => disasterLower.includes(kw));
        if (venueMatch && disasterMatch) {
            matchedHistory = hist;
            break;
        }
    }

    // 4. Fallback Logic (if no historical match)
    let genericData = {
        strategies: ["Activate general SDRF protocols.", "Establish local incident command center.", "Alert nearest medical facilities."],
        warnings: ["Monitor situation continuously due to unknown parameters."]
    };

    if (!matchedHistory) {
        let matchedGenericType = "default";
        if (disasterLower.includes("flood") || disasterLower.includes("rain")) matchedGenericType = "flood";
        else if (disasterLower.includes("quake") || disasterLower.includes("seismic")) matchedGenericType = "earthquake";
        else if (disasterLower.includes("fire")) matchedGenericType = "fire";

        if (genericProtocols[matchedGenericType]) {
            genericData = genericProtocols[matchedGenericType];
        }
    }

    // 5. Generate Forecast
    const forecast = generateForecast(disasterLower, severity);

    return {
        severity,
        historicalMatch: !!matchedHistory,
        historyTitle: matchedHistory?.title,
        strategies: matchedHistory?.strategies || genericData.strategies,
        warnings: matchedHistory?.warnings || genericData.warnings,
        forecast,
        ctaContacts: getCTAs(venueLower, disasterLower)
    };
}

function generateForecast(type: string, severity: number) {
    if (type.includes("heat")) {
        return {
            trend: severity > 7 ? "worsening" as const : "stable" as const,
            message: severity > 7 ? "Atmospheric thermal inversion expected to trap heat for 48hrs." : "Nocturnal cooling expected to provide minor relief.",
            eta: "48-72 Hours"
        };
    }
    if (type.includes("cyclone") || type.includes("wind")) {
        return {
            trend: "worsening" as const,
            message: "Landfall predicted within 12hrs. Pressure drop indicates intensification.",
            eta: "12 Hours"
        };
    }
    if (type.includes("flood") || type.includes("rain")) {
        return {
            trend: "stable" as const,
            message: "Upstream discharge slowing down. Water levels expected to plateau.",
            eta: "24 Hours"
        };
    }
    return {
        trend: "stable" as const,
        message: "Monitoring post-incident stabilization. No immediate secondary threats detected.",
        eta: "Ongoing"
    };
}

// Authentic Indian Emergency Contact Generator
function getCTAs(venue: string, type: string) {
    const ctas = [
        { name: "National Emergency Response", contact: "112", instructions: "Pan-India single emergency number" },
        { name: "NDMA Control Room", contact: "011-1078", instructions: "National Disaster Management Authority Helpdesk" }
    ];

    if (venue.includes("tamil")) {
        ctas.push({ name: "State Emergency Operation Centre (TN)", contact: "1070", instructions: "Coordinate state-level relief." });
        ctas.push({ name: "NDRF 4th Battalion (Arakkonam)", contact: "044-27752765", instructions: "Request immediate battalion deployment." });
    } else if (venue.includes("odisha")) {
        ctas.push({ name: "ODRAF HQ / State Control Room", contact: "1070 / 0674-2534177", instructions: "Activate coastal evacuation teams." });
        ctas.push({ name: "NDRF 3rd Battalion (Mundali)", contact: "0671-2879711", instructions: "Deploy inflatable assault boats." });
    } else if (venue.includes("kerala")) {
        ctas.push({ name: "KSDMA State Control Room", contact: "1077", instructions: "Coordinate with district collectors." });
        ctas.push({ name: "NDRF 4th Battalion Detachment", contact: "0484-2342345", instructions: "Request maritime rescue units." });
    } else if (venue.includes("delhi")) {
        ctas.push({ name: "DDMA Control Room", contact: "1077", instructions: "Activate urban search and rescue." });
        ctas.push({ name: "NDRF 8th Battalion (Ghaziabad)", contact: "0120-2766013", instructions: "Request CBRN (Chemical, Biological, Radiological, Nuclear) teams." });
    } else if (venue.includes("gujarat")) {
        ctas.push({ name: "GSDMA Emergency", contact: "1070", instructions: "Coordinate with Gandhinagar HQ." });
        ctas.push({ name: "NDRF 6th Battalion (Vadodara)", contact: "0265-2423142", instructions: "Deploy seismic structural collapse units." });
    } else if (venue.includes("maharashtra") || venue.includes("mumbai")) {
        ctas.push({ name: "State Disaster Control Room", contact: "1070 / 022-22027990", instructions: "Activate BMC emergency protocols." });
        ctas.push({ name: "NDRF 5th Battalion (Pune)", contact: "02114-245101", instructions: "Deploy heavy urban rescue machinery." });
    } else {
        // Generic State fallback
        ctas.push({ name: "State/District Control Room", contact: "1070 / 1077", instructions: "Local district magistrate coordination." });
    }

    // Generic additions based on type
    if (type.includes("fire")) {
        ctas.push({ name: "State Fire & Rescue", contact: "101", instructions: "Request multi-district tender support." });
    } else if (type.includes("medical") || type.includes("heat") || type.includes("virus")) {
        ctas.push({ name: "Health Emergency", contact: "104", instructions: "Coordinate ambulance and triage." });
    }

    return ctas.slice(0, 4); // Keep UI clean with max 4 CTAs
}

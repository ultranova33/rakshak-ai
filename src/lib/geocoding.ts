export interface LocationData {
    state: string;
    lat: number;
    lng: number;
    zoom: number;
}

// Geographic centers of Indian states for the map to FlyTo
export const indianStates: Record<string, LocationData> = {
    "andhra pradesh": { state: "Andhra Pradesh", lat: 15.9129, lng: 79.7400, zoom: 6 },
    "arunachal pradesh": { state: "Arunachal Pradesh", lat: 28.2180, lng: 94.7278, zoom: 7 },
    "assam": { state: "Assam", lat: 26.2006, lng: 92.9376, zoom: 7 },
    "bihar": { state: "Bihar", lat: 25.0961, lng: 85.3131, zoom: 7 },
    "chhattisgarh": { state: "Chhattisgarh", lat: 21.2787, lng: 81.8661, zoom: 6 },
    "goa": { state: "Goa", lat: 15.2993, lng: 74.1240, zoom: 9 },
    "gujarat": { state: "Gujarat", lat: 22.2587, lng: 71.1924, zoom: 6 },
    "haryana": { state: "Haryana", lat: 29.0588, lng: 76.0856, zoom: 7 },
    "himachal pradesh": { state: "Himachal Pradesh", lat: 31.1048, lng: 77.1665, zoom: 7 },
    "jharkhand": { state: "Jharkhand", lat: 23.6102, lng: 85.2799, zoom: 7 },
    "karnataka": { state: "Karnataka", lat: 15.3173, lng: 75.7139, zoom: 6 },
    "kerala": { state: "Kerala", lat: 10.8505, lng: 76.2711, zoom: 7 },
    "madhya pradesh": { state: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, zoom: 6 },
    "maharashtra": { state: "Maharashtra", lat: 19.7515, lng: 75.7139, zoom: 6 },
    "manipur": { state: "Manipur", lat: 24.6637, lng: 93.9063, zoom: 8 },
    "meghalaya": { state: "Meghalaya", lat: 25.4670, lng: 91.3662, zoom: 8 },
    "mizoram": { state: "Mizoram", lat: 23.1645, lng: 92.9376, zoom: 8 },
    "nagaland": { state: "Nagaland", lat: 26.1584, lng: 94.5624, zoom: 8 },
    "odisha": { state: "Odisha", lat: 20.9517, lng: 85.0985, zoom: 7 },
    "punjab": { state: "Punjab", lat: 31.1471, lng: 75.3412, zoom: 7 },
    "rajasthan": { state: "Rajasthan", lat: 27.0238, lng: 74.2179, zoom: 6 },
    "sikkim": { state: "Sikkim", lat: 27.5330, lng: 88.5122, zoom: 9 },
    "tamil nadu": { state: "Tamil Nadu", lat: 11.1271, lng: 78.6569, zoom: 6 },
    "telangana": { state: "Telangana", lat: 18.1124, lng: 79.0193, zoom: 6 },
    "tripura": { state: "Tripura", lat: 23.9408, lng: 91.9882, zoom: 8 },
    "uttar pradesh": { state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, zoom: 6 },
    "uttarakhand": { state: "Uttarakhand", lat: 30.0668, lng: 79.0193, zoom: 7 },
    "west bengal": { state: "West Bengal", lat: 22.9868, lng: 87.8550, zoom: 7 },
    "delhi": { state: "Delhi", lat: 28.7041, lng: 77.1025, zoom: 10 },
    // Default India core
    "india": { state: "India Core", lat: 20.5937, lng: 78.9629, zoom: 5 }
};

export function getCoordinates(query: string): LocationData {
    const normalized = query.toLowerCase().trim();

    // Try exact match first
    if (indianStates[normalized]) {
        return indianStates[normalized];
    }

    // Try partial match
    for (const [key, data] of Object.entries(indianStates)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return data;
        }
    }

    // Fallback to center of India
    return indianStates["india"];
}

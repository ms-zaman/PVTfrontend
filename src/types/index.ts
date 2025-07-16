export interface Location {
  lat: number;
  lng: number;
  address: string;
  division: string;
  district: string;
}

export interface Casualties {
  injured: number;
  dead: number;
}

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface ViolenceEvent {
  id: string;
  title: string;
  summary: string;
  location: Location;
  casualties: Casualties;
  politicalParty: string;
  opposingParty: string;
  date: string; // ISO 8601 format
  severity: SeverityLevel;
  imageUrl: string;
  source: string;
  verified: boolean;
}

export interface EventsMetadata {
  totalEvents: number;
  lastUpdated: string;
  divisions: string[];
  politicalParties: string[];
  severityLevels: Record<SeverityLevel, string>;
}

export interface EventsData {
  events: ViolenceEvent[];
  metadata: EventsMetadata;
}

export interface FilterOptions {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  politicalParties: string[];
  divisions: string[];
  districts: string[];
  severityLevels: SeverityLevel[];
  verifiedOnly: boolean;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Bangladesh administrative divisions
export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong', 
  'Sylhet',
  'Rajshahi',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Khulna'
] as const;

// Bangladesh map bounds
export const BANGLADESH_BOUNDS: MapBounds = {
  north: 26.6382,
  south: 20.7404,
  east: 92.6727,
  west: 88.0844
};

// Default map center (approximately center of Bangladesh)
export const BANGLADESH_CENTER: [number, number] = [23.6850, 90.3563];

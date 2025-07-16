'use client';

import dynamic from 'next/dynamic';
import { ViolenceEvent } from '@/types';
import { Loader2 } from 'lucide-react';

interface MapViewProps {
  events: ViolenceEvent[];
  selectedEvent?: ViolenceEvent | null;
  onEventSelect?: (event: ViolenceEvent | null) => void;
  className?: string;
  loading?: boolean;
}

// Dynamically import MapView to prevent SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>
  ),
});

export default function DynamicMapView(props: MapViewProps) {
  return <MapView {...props} />;
}

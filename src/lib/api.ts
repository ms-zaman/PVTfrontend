import { EventsData, ViolenceEvent, FilterOptions } from '@/types';

// Configuration for API endpoints
const API_CONFIG = {
  // For development, use mock data from public folder
  // In production, this would be your backend API URL
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || '/api'
    : '',
  endpoints: {
    events: '/events.json',
    // Future endpoints for real backend
    // events: '/api/events',
    // eventById: '/api/events/:id',
    // divisions: '/api/divisions',
    // statistics: '/api/statistics'
  }
};

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Fetch all violence events
   * In the future, this will connect to a real backend API
   */
  async getEvents(): Promise<EventsData> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.events}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data: EventsData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to load violence events data');
    }
  }

  /**
   * Get a single event by ID
   * Currently filters from all events, but will be a separate API call in the future
   */
  async getEventById(id: string): Promise<ViolenceEvent | null> {
    try {
      const data = await this.getEvents();
      const event = data.events.find(event => event.id === id);
      return event || null;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      return null;
    }
  }

  /**
   * Filter events based on criteria
   * Currently done client-side, but will be server-side in the future
   */
  async getFilteredEvents(filters: Partial<FilterOptions>): Promise<ViolenceEvent[]> {
    try {
      const data = await this.getEvents();
      let filteredEvents = data.events;

      // Apply date range filter
      if (filters.dateRange?.start || filters.dateRange?.end) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          const start = filters.dateRange?.start;
          const end = filters.dateRange?.end;
          
          if (start && eventDate < start) return false;
          if (end && eventDate > end) return false;
          return true;
        });
      }

      // Apply political party filter
      if (filters.politicalParties && filters.politicalParties.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filters.politicalParties!.includes(event.politicalParty) ||
          filters.politicalParties!.includes(event.opposingParty)
        );
      }

      // Apply division filter
      if (filters.divisions && filters.divisions.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filters.divisions!.includes(event.location.division)
        );
      }

      // Apply district filter
      if (filters.districts && filters.districts.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filters.districts!.includes(event.location.district)
        );
      }

      // Apply severity filter
      if (filters.severityLevels && filters.severityLevels.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          filters.severityLevels!.includes(event.severity)
        );
      }

      // Apply verified only filter
      if (filters.verifiedOnly) {
        filteredEvents = filteredEvents.filter(event => event.verified);
      }

      return filteredEvents;
    } catch (error) {
      console.error('Error filtering events:', error);
      throw new Error('Failed to filter events');
    }
  }

  /**
   * Get events within a geographic bounding box
   * Useful for map viewport optimization
   */
  async getEventsInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<ViolenceEvent[]> {
    try {
      const data = await this.getEvents();
      return data.events.filter(event => {
        const { lat, lng } = event.location;
        return lat <= bounds.north && 
               lat >= bounds.south && 
               lng <= bounds.east && 
               lng >= bounds.west;
      });
    } catch (error) {
      console.error('Error fetching events in bounds:', error);
      return [];
    }
  }

  /**
   * Get statistics for dashboard/summary views
   * Will be a separate API endpoint in the future
   */
  async getStatistics() {
    try {
      const data = await this.getEvents();
      const events = data.events;

      const stats = {
        totalEvents: events.length,
        totalInjured: events.reduce((sum, event) => sum + event.casualties.injured, 0),
        totalDeaths: events.reduce((sum, event) => sum + event.casualties.dead, 0),
        byDivision: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>,
        byParty: {} as Record<string, number>,
        recentEvents: events
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
      };

      // Calculate division statistics
      events.forEach(event => {
        stats.byDivision[event.location.division] = 
          (stats.byDivision[event.location.division] || 0) + 1;
      });

      // Calculate severity statistics
      events.forEach(event => {
        stats.bySeverity[event.severity] = 
          (stats.bySeverity[event.severity] || 0) + 1;
      });

      // Calculate party statistics
      events.forEach(event => {
        stats.byParty[event.politicalParty] = 
          (stats.byParty[event.politicalParty] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to load statistics');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;

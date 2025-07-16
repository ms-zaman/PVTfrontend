# API Integration Guide

This document provides detailed instructions for connecting the frontend to a real backend API.

## Current Architecture

The frontend is designed with a modular API layer that currently uses mock data but can be easily switched to a real backend.

### API Service Layer

The main API service is located in `src/lib/api.ts` and provides:

```typescript
class ApiService {
  async getEvents(): Promise<EventsData>
  async getEventById(id: string): Promise<ViolenceEvent | null>
  async getFilteredEvents(filters: Partial<FilterOptions>): Promise<ViolenceEvent[]>
  async getEventsInBounds(bounds: MapBounds): Promise<ViolenceEvent[]>
  async getStatistics(): Promise<Statistics>
}
```

## Backend Requirements

### Required Endpoints

#### 1. GET /api/events
**Purpose**: Fetch all events with optional filtering

**Query Parameters**:
```typescript
{
  startDate?: string;        // ISO 8601 date
  endDate?: string;          // ISO 8601 date
  politicalParties?: string[]; // Array of party names
  divisions?: string[];      // Array of division names
  districts?: string[];      // Array of district names
  severityLevels?: string[]; // ['low', 'medium', 'high']
  verifiedOnly?: boolean;    // Filter verified events only
  bounds?: {                 // Geographic bounds
    north: number;
    south: number;
    east: number;
    west: number;
  };
  limit?: number;           // Pagination limit
  offset?: number;          // Pagination offset
}
```

**Response Format**:
```json
{
  "events": [
    {
      "id": "evt_001",
      "title": "Event title",
      "summary": "Event description",
      "location": {
        "lat": 23.7465,
        "lng": 90.3765,
        "address": "Dhanmondi, Dhaka",
        "division": "Dhaka",
        "district": "Dhaka"
      },
      "casualties": {
        "injured": 12,
        "dead": 0
      },
      "politicalParty": "Awami League",
      "opposingParty": "Bangladesh Nationalist Party",
      "date": "2024-01-15T14:30:00Z",
      "severity": "medium",
      "imageUrl": "https://example.com/image.jpg",
      "source": "Daily Star",
      "verified": true
    }
  ],
  "metadata": {
    "totalEvents": 150,
    "lastUpdated": "2024-01-01T00:00:00Z",
    "divisions": ["Dhaka", "Chittagong", "Sylhet", ...],
    "politicalParties": ["Awami League", "BNP", ...],
    "severityLevels": {
      "low": "Minor injuries, property damage",
      "medium": "Multiple injuries, significant disruption", 
      "high": "Deaths, major violence, widespread impact"
    }
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150,
    "hasMore": true
  }
}
```

#### 2. GET /api/events/:id
**Purpose**: Fetch single event details

**Response Format**:
```json
{
  "event": {
    // ViolenceEvent object
  }
}
```

#### 3. GET /api/statistics
**Purpose**: Fetch dashboard statistics

**Response Format**:
```json
{
  "totalEvents": 150,
  "totalInjured": 500,
  "totalDeaths": 25,
  "byDivision": {
    "Dhaka": 45,
    "Chittagong": 30,
    // ...
  },
  "bySeverity": {
    "high": 15,
    "medium": 85,
    "low": 50
  },
  "byParty": {
    "Awami League": 40,
    "BNP": 35,
    // ...
  },
  "recentEvents": [
    // Array of 5 most recent events
  ],
  "timeRange": {
    "earliest": "2024-01-01T00:00:00Z",
    "latest": "2024-12-31T23:59:59Z"
  }
}
```

#### 4. GET /api/divisions
**Purpose**: Fetch available administrative divisions

**Response Format**:
```json
{
  "divisions": [
    {
      "name": "Dhaka",
      "districts": ["Dhaka", "Gazipur", "Narayanganj", ...]
    },
    // ...
  ]
}
```

## Frontend Configuration

### 1. Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: API authentication
NEXT_PUBLIC_API_KEY=your-api-key

# Optional: Enable/disable features
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 2. Update API Configuration

Modify `src/lib/api.ts`:

```typescript
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  endpoints: {
    events: '/api/events',
    eventById: '/api/events',
    statistics: '/api/statistics',
    divisions: '/api/divisions'
  }
};
```

### 3. Add Authentication (if required)

```typescript
class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_CONFIG.apiKey) {
      headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
    }
    
    return headers;
  }

  async getEvents(): Promise<EventsData> {
    const response = await fetch(`${this.baseURL}/api/events`, {
      headers: this.getHeaders(),
    });
    // ...
  }
}
```

## Error Handling

### Frontend Error Handling

The API service includes comprehensive error handling:

```typescript
async getEvents(): Promise<EventsData> {
  try {
    const response = await fetch(`${this.baseURL}/api/events`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to cached data or show error message
    throw new Error('Failed to load events. Please try again later.');
  }
}
```

### Expected Backend Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format",
    "details": {
      "field": "startDate",
      "value": "invalid-date"
    }
  }
}
```

## Performance Considerations

### 1. Pagination
Implement pagination for large datasets:

```typescript
// Frontend request
const events = await apiService.getEvents({
  limit: 50,
  offset: page * 50
});
```

### 2. Caching
Consider implementing caching strategies:

```typescript
// Simple in-memory cache
const cache = new Map();

async getEvents(): Promise<EventsData> {
  const cacheKey = 'events';
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const data = await this.fetchEvents();
  cache.set(cacheKey, data);
  
  return data;
}
```

### 3. Real-time Updates
For real-time updates, consider WebSocket integration:

```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('ws://localhost:8000/ws/events');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Update local state with new event data
};
```

## Testing the Integration

### 1. Mock Backend Setup
Create a simple Express.js server for testing:

```javascript
// test-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/events', (req, res) => {
  // Return mock data matching the expected format
  res.json(require('./mock-events.json'));
});

app.listen(8000, () => {
  console.log('Test server running on port 8000');
});
```

### 2. Integration Testing
Test the integration step by step:

1. Start your backend server
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`
3. Restart the frontend development server
4. Verify data loads correctly in the browser
5. Test filtering and other API calls

## Deployment Considerations

### Production Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_API_KEY=your-production-api-key
```

### CORS Configuration
Ensure your backend allows requests from your frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is properly configured
2. **404 Errors**: Verify API endpoint URLs match backend routes
3. **Authentication Errors**: Check API key configuration
4. **Data Format Errors**: Ensure backend response matches expected TypeScript interfaces

### Debug Mode
Enable debug logging:

```typescript
// Add to api.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('API Request:', url, options);
  console.log('API Response:', data);
}
```

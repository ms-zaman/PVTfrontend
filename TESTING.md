# Testing Guide

This document outlines testing procedures for the Bangladesh Political Violence Map application.

## Manual Testing Checklist

### 🗺️ Map Functionality
- [ ] Map loads correctly and displays Bangladesh
- [ ] Map is centered on Bangladesh coordinates
- [ ] Zoom controls work properly
- [ ] Map bounds are restricted to Bangladesh region
- [ ] Map tiles load without errors

### 📍 Event Markers
- [ ] All event markers appear on the map
- [ ] Markers are color-coded by severity (red=high, orange=medium, yellow=low)
- [ ] Recent events show pulse animation
- [ ] Marker hover effects work (scale animation)
- [ ] Clicking markers opens popups
- [ ] Selected markers appear larger

### 💬 Event Popups
- [ ] Popups display complete event information
- [ ] Event images load correctly
- [ ] Casualty information is accurate
- [ ] Date formatting is correct
- [ ] Verification status is shown
- [ ] Source information is displayed
- [ ] Popup close button works

### 🔍 Filtering System
- [ ] Sidebar opens/closes correctly
- [ ] Date range filter works
- [ ] Political party filter works
- [ ] Division filter works
- [ ] Severity level filter works
- [ ] Verified only filter works
- [ ] Apply filters button updates map
- [ ] Reset filters button clears all filters
- [ ] Filter count badge shows active filters

### 📱 Responsive Design
- [ ] Application works on mobile devices (< 768px)
- [ ] Sidebar collapses on mobile
- [ ] Mobile overlay works correctly
- [ ] Touch interactions work on map
- [ ] Popups are properly sized on mobile
- [ ] Header layout adapts to screen size

### 🌙 Dark Mode
- [ ] Dark mode toggle works
- [ ] All components switch to dark theme
- [ ] Map popups respect dark mode
- [ ] Sidebar styling updates correctly
- [ ] Dark mode preference is saved
- [ ] System preference detection works

### ⚡ Performance
- [ ] Initial page load is under 3 seconds
- [ ] Map renders smoothly with all events
- [ ] Filtering operations are responsive
- [ ] No memory leaks during navigation
- [ ] Smooth animations without lag

### ♿ Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader announcements work
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] Alt text is provided for images

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

## Performance Testing

### Load Testing
```bash
# Test with different numbers of events
# Verify performance with 10, 50, 100, 500+ events
```

### Network Testing
- [ ] Test with slow 3G connection
- [ ] Test with offline mode
- [ ] Verify graceful error handling

## API Testing

### Mock Data Validation
- [ ] All mock events have required fields
- [ ] Coordinates are within Bangladesh bounds
- [ ] Date formats are valid ISO 8601
- [ ] Image URLs are accessible
- [ ] Political party names are consistent

### Error Scenarios
- [ ] Network failure handling
- [ ] Invalid API responses
- [ ] Empty data sets
- [ ] Malformed JSON

## Component Testing

### MapView Component
```typescript
// Test cases to implement
describe('MapView', () => {
  it('renders map container');
  it('displays event markers');
  it('handles marker clicks');
  it('respects map bounds');
  it('shows loading state');
});
```

### FiltersSidebar Component
```typescript
describe('FiltersSidebar', () => {
  it('renders all filter sections');
  it('handles filter changes');
  it('applies filters correctly');
  it('resets filters');
  it('shows active filter count');
});
```

### EventPopup Component
```typescript
describe('EventPopup', () => {
  it('displays event information');
  it('formats dates correctly');
  it('shows casualty information');
  it('handles missing images');
  it('displays verification status');
});
```

## Integration Testing

### Data Flow Testing
- [ ] Context state updates correctly
- [ ] API service methods work
- [ ] Filter changes update map
- [ ] Event selection works
- [ ] Dark mode state persists

### User Journey Testing
1. **Basic Usage**
   - User loads the page
   - Map displays with events
   - User clicks on an event
   - Popup shows event details

2. **Filtering Workflow**
   - User opens filters sidebar
   - Selects date range
   - Chooses political parties
   - Applies filters
   - Map updates with filtered events

3. **Mobile Experience**
   - User visits on mobile device
   - Sidebar is collapsed
   - User taps menu to open filters
   - Touch interactions work on map
   - Popups are readable

## Automated Testing Setup

### Install Testing Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Test Setup
```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Leaflet
global.L = {
  map: jest.fn(),
  tileLayer: jest.fn(),
  marker: jest.fn(),
  popup: jest.fn(),
};
```

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

### Monitoring Tools
- Lighthouse CI
- Web Vitals
- Bundle Analyzer

## Security Testing

### Client-Side Security
- [ ] No sensitive data in localStorage
- [ ] XSS protection in place
- [ ] HTTPS enforcement
- [ ] Content Security Policy headers

### Data Validation
- [ ] Input sanitization
- [ ] Type checking
- [ ] Boundary validation

## Deployment Testing

### Pre-deployment Checklist
- [ ] Build process completes successfully
- [ ] No console errors in production build
- [ ] Environment variables are set correctly
- [ ] Static assets load properly
- [ ] Service worker (if applicable) works

### Post-deployment Verification
- [ ] Application loads in production
- [ ] API endpoints are accessible
- [ ] CDN assets load correctly
- [ ] Error tracking is working

## Bug Reporting Template

```markdown
## Bug Report

**Environment:**
- Browser: 
- Device: 
- Screen size: 
- Operating System: 

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**

**Actual Behavior:**

**Screenshots:**

**Console Errors:**

**Additional Context:**
```

## Test Data

### Sample Events for Testing
The application includes 10 sample events covering:
- Different severity levels
- Various political parties
- All major divisions of Bangladesh
- Different time periods
- Mix of verified/unverified events

### Edge Cases to Test
- Events with no casualties
- Events with missing images
- Events with long descriptions
- Events at map boundaries
- Events with special characters in names

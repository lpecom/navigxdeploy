# Navig - Technical Documentation

## System Architecture

### Frontend Architecture
- Framework: React 18.3+ with TypeScript
- State Management: React Context + TanStack Query v5
- Routing: React Router v6 with protected routes
- UI Components: Shadcn/UI (Radix-based) + Tailwind CSS
- Animations: Framer Motion
- Form Handling: React Hook Form + Zod validation

### Backend Architecture
- Platform: Supabase
- Database: PostgreSQL with RLS policies
- Authentication: Supabase Auth with JWT
- File Storage: Supabase Storage with bucket policies
- Real-time: Supabase Realtime subscriptions
- Functions: Edge Functions (Deno runtime)

### Integration Points
1. Payment Processing:
   - Stripe API for credit cards
   - PIX API for instant payments
   - Boleto API for bank slips

2. External Services:
   - Uber Fleet API
   - FIPE API for vehicle pricing
   - Google Maps API
   - Document OCR APIs

## Core Data Models

### Vehicle Management
```typescript
interface Vehicle {
  id: string;
  model_id: string;
  status: VehicleStatus;
  plate: string;
  current_km: number;
  maintenance_history: MaintenanceRecord[];
  documents: VehicleDocument[];
}

type VehicleStatus = 
  | 'available' 
  | 'rented'
  | 'maintenance'
  | 'deactivated';
```

### Reservation System
```typescript
interface Reservation {
  id: string;
  customer_id: string;
  vehicle_id: string;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  pickup_date: Date;
  return_date: Date;
  amount: number;
}

type ReservationStatus = 
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'completed';
```

## Key Features Implementation

### Guest Checkout Flow
1. Session token generation
2. Temporary data storage
3. Lead capture system
4. Conversion tracking

### KYC Verification
1. Document upload to secure bucket
2. OCR processing
3. Manual verification queue
4. Status tracking system

### Real-time Features
1. Vehicle availability updates
2. Reservation status changes
3. Payment confirmations
4. Maintenance alerts

## Development Setup

### Required Environment Variables
```bash
VITE_SUPABASE_URL=<url>
VITE_SUPABASE_ANON_KEY=<key>
VITE_STRIPE_PUBLISHABLE_KEY=<key>
VITE_UBER_CLIENT_ID=<id>
VITE_UBER_REDIRECT_URL=<url>
```

### Database Initialization
1. Run migrations in `/supabase/migrations`
2. Apply RLS policies
3. Configure bucket policies
4. Initialize required tables

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment
```bash
npm run build
npm run preview
```

## Testing Strategy
- Unit Tests: Jest + React Testing Library
- E2E Tests: Playwright
- API Tests: Supertest
- Coverage threshold: 80%

## Performance Optimization
1. Code splitting by route
2. Image optimization pipeline
3. Caching strategy:
   - React Query stale time
   - Service Worker
   - PostgreSQL query optimization

## Security Measures
1. RLS policies per table
2. JWT validation
3. CORS configuration
4. API rate limiting
5. Input sanitization
6. XSS prevention

## Error Handling
1. Global error boundary
2. API error interceptors
3. Form validation errors
4. Network error recovery
5. Offline support

## Monitoring
1. Error tracking
2. Performance metrics
3. User analytics
4. Server health checks

## Documentation
- API documentation: `/docs/api`
- Component storybook: `/docs/ui`
- Database schema: `/docs/db`
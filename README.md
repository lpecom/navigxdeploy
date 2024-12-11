# Navig - Vehicle Rental Management System

A modern, full-stack web application for managing vehicle rentals, built with React, TypeScript, and Supabase.

## 🚀 Features

### For Drivers
- Guest checkout for vehicle reservations
- Seamless KYC verification process
- Real-time vehicle availability checking
- Multiple payment methods (Credit Card, PIX, Boleto)
- Driver dashboard with rental history
- Uber integration for ride-sharing
- Vehicle maintenance tracking
- Digital contract signing

### For Administrators
- Complete fleet management
- Customer relationship management
- Reservation approval workflow
- Vehicle maintenance scheduling
- Real-time analytics and reporting
- Risk analysis for rentals
- Multi-branch support
- Automated notifications

## 🛠 Tech Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS for styling
  - Shadcn/UI component library
  - Framer Motion for animations
  - React Query for data fetching
  - React Router for navigation

- **Backend:**
  - Supabase for backend services
  - PostgreSQL database
  - Row Level Security (RLS)
  - Edge Functions
  - Real-time subscriptions
  - File storage for documents

- **Payments:**
  - Stripe integration
  - PIX payments
  - Boleto support

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── checkout/      # Checkout flow components
│   ├── vehicles/      # Vehicle management
│   ├── dashboard/     # Admin dashboard
│   └── ui/            # Shadcn UI components
├── pages/             # Main route pages
├── contexts/          # React contexts
├── hooks/             # Custom React hooks
├── types/             # TypeScript definitions
├── utils/             # Helper functions
└── integrations/      # Third-party integrations
```

## 🚗 Vehicle Management

- Complete vehicle lifecycle tracking
- Maintenance scheduling
- Real-time availability updates
- Integration with FIPE table
- Vehicle profitability analysis
- Fine management
- Fleet optimization

## 👥 Customer Management

- Lead tracking
- KYC verification
- Document management
- Rental history
- Payment tracking
- Communication history
- Risk assessment

## 💳 Payment Processing

- Multiple payment methods
- Automated invoice generation
- Payment status tracking
- Refund processing
- Payment receipt generation
- Installment support

## 📊 Analytics & Reporting

- Fleet utilization metrics
- Revenue analytics
- Customer insights
- Maintenance costs
- Vehicle profitability
- Custom report generation
- Export capabilities

## 🔒 Security Features

- Role-based access control
- Secure document storage
- Payment data encryption
- Activity logging
- Session management
- Two-factor authentication support

## 🌐 API Integration

- Uber API integration
- FIPE table integration
- Payment gateway APIs
- Google Maps integration
- Document verification APIs

## 💻 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_UBER_CLIENT_ID=your_uber_client_id
VITE_UBER_REDIRECT_URL=your_uber_redirect_url
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/navig.git
cd navig
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Database Setup

The project uses Supabase as the backend. The database schema includes tables for:
- Vehicles and fleet management
- Customer and driver information
- Reservations and bookings
- Payments and transactions
- Maintenance records
- Analytics data

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🔄 Continuous Integration

- Automated testing
- Code quality checks
- Build verification
- Deployment automation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📞 Support

For support, email support@navig.com or join our Slack channel.

## 🙏 Acknowledgments

- Shadcn UI for the component library
- Supabase team for the backend infrastructure
- All contributors who have helped shape this project
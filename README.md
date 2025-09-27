# EventFlow - Professional Event Management Platform

A comprehensive serverless event management platform built with Next.js 14+ and Supabase, featuring real-time capabilities, ticketing system, and analytics dashboard.

## 🎉 Project Status: COMPLETE ✅

This is a production-ready event management platform with all core features implemented and tested. The application successfully builds and runs with a complete database schema and authentication system.

## 🚀 Features

### Core Functionality
- **User Authentication**: Email/password and OAuth (GitHub, Google)
- **Event Management**: Create, edit, and manage events with detailed information
- **Ticketing System**: Multi-tier pricing, QR code generation, and order management
- **Session Management**: Agenda creation with speakers and time slots
- **Real-time Features**: Live chat, Q&A, and notifications
- **File Storage**: Upload and manage event resources and presentations
- **Analytics Dashboard**: Comprehensive event analytics and reporting
- **Digital Signage**: Real-time event displays with announcements

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 compliant with screen reader support
- **Performance**: Optimized with Next.js 14+ App Router and Turbopack
- **Security**: Row Level Security (RLS) policies and secure authentication
- **Real-time**: Supabase Realtime for live updates
- **Testing**: Comprehensive test suite with Jest and React Testing Library

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library
- **Analytics**: Recharts, Web Vitals
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd event-management-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the migration files in your Supabase SQL editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

### 5. Storage Setup

1. Go to Supabase Storage
2. Create a bucket named `event-files`
3. Set it as a public bucket
4. Configure RLS policies for file access

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
event-management-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── events/            # Event management pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── events/            # Event-related components
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # UI components (Shadcn/ui)
│   └── lib/                   # Utilities and configurations
│       ├── supabase/          # Supabase client configurations
│       └── types/             # TypeScript type definitions
├── supabase/
│   └── migrations/            # Database migration files
├── __tests__/                 # Test files
└── public/                    # Static assets
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- `em_profiles` - User profiles
- `em_events` - Event information
- `em_ticket_tiers` - Ticket pricing tiers
- `em_orders` - Order records
- `em_tickets` - Individual tickets
- `em_sessions` - Event sessions/agenda
- `em_speakers` - Speaker information
- `em_messages` - Chat messages
- `em_qa_questions` - Q&A questions
- `em_files` - File storage metadata
- `em_announcements` - Digital signage announcements

All tables include Row Level Security (RLS) policies for data protection.

## 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Protection**: Encrypted data transmission
- **File Security**: Secure file upload with type validation
- **API Security**: Rate limiting and input validation

## 🎨 UI Components

The application uses Shadcn/ui components for consistent design:

- Forms with validation
- Data tables with sorting/filtering
- Modal dialogs
- Navigation components
- Charts and analytics displays

## 🔄 Real-time Features

Powered by Supabase Realtime:

- Live chat in events
- Real-time Q&A updates
- Live announcements
- Attendance tracking
- Notification system

## 📈 Analytics & Monitoring

- **Performance**: Web Vitals monitoring
- **User Analytics**: Event attendance and engagement
- **Error Tracking**: Comprehensive error logging
- **Health Checks**: API endpoint monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the [documentation](./docs/)
2. Review [common issues](./TROUBLESHOOTING.md)
3. Open an issue on GitHub

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Vercel](https://vercel.com/) - Deployment platform

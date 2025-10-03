# 🚀 Dashboard Quick Reference Guide

## 📍 Production URLs

### Main Dashboard
**URL:** https://wecon-masawaaat.vercel.app/dashboard  
**Access:** Requires login with attendee or speaker role  
**Redirects:** Admin users automatically redirect to `/admin`

### Test Accounts
```
Attendee Account:
- Email: alizeh995@gmail.com
- Role: attendee
- Dashboard: /dashboard

Admin Account:
- Email: admin@wecon.events
- Role: admin
- Dashboard: /admin (auto-redirect)
```

---

## 🎨 Component Library

### Modern KPI Cards
```typescript
import { ModernKPICard, ModernStatGrid } from '@/components/dashboard/modern'

// Single KPI Card
<ModernKPICard
  title="Total Events"
  value={25}
  icon={<Calendar className="h-5 w-5" />}
  trend={{ value: '+12%', direction: 'up' }}
  gradient="from-blue-500 to-cyan-500"
  iconBg="bg-blue-500/10"
/>

// Grid of KPI Cards
<ModernStatGrid
  stats={[
    { title: 'Events', value: 25, icon: <Calendar />, ... },
    { title: 'Tickets', value: 150, icon: <Ticket />, ... }
  ]}
/>
```

### Modern Event Cards
```typescript
import { ModernEventCard, ModernEventGrid } from '@/components/dashboard/modern'

// Single Event Card
<ModernEventCard
  event={eventData}
  variant="default" // or "compact" or "featured"
  showActions={true}
/>

// Grid of Event Cards
<ModernEventGrid
  events={eventsArray}
  variant="default"
  showActions={true}
  emptyMessage="No events found"
/>
```

### Modern Activity Feed
```typescript
import { ModernActivityFeed } from '@/components/dashboard/modern'

<ModernActivityFeed
  activities={activitiesArray}
  title="Recent Activity"
  maxItems={10}
  showTimestamp={true}
/>
```

### Modern Welcome Section
```typescript
import { ModernWelcomeSection } from '@/components/dashboard/modern'

<ModernWelcomeSection
  userName="John Doe"
  userEmail="john@example.com"
  userAvatar="/avatar.jpg"
  description="Welcome message"
  actions={[
    { label: 'Browse Events', href: '/events', icon: <Plus /> }
  ]}
/>
```

### Quick Actions
```typescript
import { ModernQuickActions } from '@/components/dashboard/modern'

<ModernQuickActions
  actions={[
    {
      label: 'Browse Events',
      description: 'Discover new events',
      href: '/events',
      icon: <Plus className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10'
    }
  ]}
  columns={4}
/>
```

---

## 🎯 Customization Guide

### Changing Colors
```typescript
// Gradient options
gradient="from-blue-500 to-cyan-500"      // Blue
gradient="from-emerald-500 to-green-500"  // Green
gradient="from-purple-500 to-pink-500"    // Purple
gradient="from-amber-500 to-orange-500"   // Orange

// Icon background colors
iconBg="bg-blue-500/10"    // Blue tint
iconBg="bg-emerald-500/10" // Green tint
iconBg="bg-purple-500/10"  // Purple tint
iconBg="bg-amber-500/10"   // Amber tint
```

### Adjusting Layout
```typescript
// Grid columns
className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"

// Spacing
className="space-y-8"  // Vertical spacing
className="gap-6"      // Grid gap
```

### Adding New KPI Metrics
```typescript
const newStat = {
  title: 'New Metric',
  value: 100,
  icon: <YourIcon className="h-5 w-5" />,
  trend: {
    value: '+15%',
    direction: 'up' as const
  },
  gradient: 'from-blue-500 to-cyan-500',
  iconBg: 'bg-blue-500/10'
}
```

---

## 🔧 Common Tasks

### Adding a New Dashboard Section
1. Create component in `src/components/dashboard/modern/`
2. Export from `src/components/dashboard/modern/index.tsx`
3. Import in `modern-attendee-dashboard.tsx`
4. Add to dashboard layout

### Modifying Data Sources
```typescript
// In modern-attendee-dashboard.tsx
const { data } = await supabase
  .from("your_table")
  .select("columns")
  .eq("filter", value)
```

### Adding Loading States
```typescript
{loading ? (
  <div className="animate-pulse">
    <div className="h-32 bg-slate-200 rounded-xl" />
  </div>
) : (
  <YourComponent />
)}
```

### Adding Empty States
```typescript
import { ModernEmptyState } from '@/components/dashboard/modern'

<ModernEmptyState
  icon={<Calendar className="h-12 w-12" />}
  title="No events found"
  description="Browse our catalog to find events"
  action={{
    label: 'Browse Events',
    href: '/events',
    icon: <Plus className="h-4 w-4 mr-2" />
  }}
/>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default: < 768px (1 column)

/* Tablet */
md: 768px (2 columns)

/* Desktop */
lg: 1024px (3-4 columns)

/* Large Desktop */
xl: 1280px (4+ columns)
```

### Example Usage
```typescript
className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 4 columns
```

---

## 🎨 Design Tokens

### Spacing Scale
```
gap-4  = 1rem   (16px)
gap-6  = 1.5rem (24px)
gap-8  = 2rem   (32px)
p-6    = 1.5rem (24px)
p-8    = 2rem   (32px)
```

### Border Radius
```
rounded-lg  = 0.5rem  (8px)
rounded-xl  = 0.75rem (12px)
rounded-2xl = 1rem    (16px)
```

### Shadows
```
shadow-lg  = Large shadow
shadow-xl  = Extra large shadow
shadow-2xl = 2x extra large shadow
```

### Transitions
```
transition-all duration-300
hover:-translate-y-1
hover:shadow-xl
```

---

## 🐛 Troubleshooting

### Dashboard Not Loading
1. Check authentication: `useAuth()` hook
2. Verify role in database: `em_profiles` table
3. Check console for errors
4. Verify Supabase connection

### Data Not Displaying
1. Check Supabase queries in browser console
2. Verify table permissions (RLS policies)
3. Check data format matches TypeScript interfaces
4. Verify environment variables

### Styling Issues
1. Clear browser cache
2. Check Tailwind CSS classes
3. Verify component imports
4. Check for CSS conflicts

### Build Errors
```bash
# Clear cache and rebuild
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Check linting
npm run lint
```

---

## 📚 File Locations

### Components
```
src/components/dashboard/modern/
├── index.tsx                      # Exports
├── modern-kpi-card.tsx           # KPI cards
├── modern-event-card.tsx         # Event cards
├── modern-activity-feed.tsx      # Activity feed
└── modern-welcome-section.tsx    # Welcome & quick actions
```

### Pages
```
src/app/dashboard/
└── page.tsx                      # Main dashboard page
```

### Documentation
```
event-management-platform/
├── DASHBOARD_REDESIGN_SUMMARY.md
├── BEFORE_AFTER_COMPARISON.md
└── DASHBOARD_QUICK_REFERENCE.md (this file)
```

---

## 🔗 Useful Links

- **Production Dashboard:** https://wecon-masawaaat.vercel.app/dashboard
- **Vercel Dashboard:** https://vercel.com/muzammil309s-projects/wecon-masawaaat
- **Supabase Dashboard:** https://supabase.com/dashboard/project/umywdcihtqfullbostxo
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev

---

## 💡 Best Practices

### Performance
✅ Use loading states for better UX  
✅ Implement skeleton loaders  
✅ Lazy load heavy components  
✅ Optimize images and assets  

### Accessibility
✅ Use semantic HTML  
✅ Provide alt text for images  
✅ Ensure keyboard navigation  
✅ Maintain color contrast  

### Code Quality
✅ Use TypeScript for type safety  
✅ Follow component composition  
✅ Keep components small and focused  
✅ Write descriptive prop names  

### User Experience
✅ Provide clear feedback  
✅ Show loading states  
✅ Handle empty states gracefully  
✅ Use consistent spacing and styling  

---

## 🎉 Quick Start

### View the Dashboard
1. Go to https://wecon-masawaaat.vercel.app
2. Log in with your credentials
3. You'll be redirected to the dashboard

### Make Changes
1. Edit files in `src/components/dashboard/modern/`
2. Run `npm run dev` to test locally
3. Run `npm run build` to verify
4. Deploy with `vercel --prod`

### Get Help
- Check documentation files
- Review component source code
- Check browser console for errors
- Verify Supabase data

---

**Last Updated:** 2025-10-03  
**Version:** 1.0.0  
**Status:** ✅ Production Ready


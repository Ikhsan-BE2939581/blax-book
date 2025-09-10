# Football Book - Sports Website

A modern, responsive sports website built with Next.js, TypeScript, and Tailwind CSS following atomic design principles.

## 🏗️ Architecture

This project follows **Atomic Design** methodology for better component organization and reusability:

### Component Structure

```
components/
├── atoms/           # Basic building blocks
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   ├── LoadingSpinner/
│   └── NavigationButton/
├── molecules/       # Simple groups of atoms
│   ├── FormField/
│   ├── SearchBar/
│   ├── HeroActions/
│   └── LoadingScreen/
├── organisms/       # Complex UI components
│   ├── Header/
│   ├── Footer/
│   ├── NewsCard/
│   ├── NewsSection/
│   ├── LineupCard/
│   └── MatchCarousel/
├── templates/       # Page-level layouts
│   └── PageLayout/
└── ui/             # Shadcn/ui components
```

## 🚀 Features

### Navigation & Routing
- **Hero Actions**: Line Up and Schedule buttons in hero section
- **News Detail Pages**: Individual article pages with full content
- **Match Schedule Page**: Comprehensive schedule management
- **Responsive Navigation**: Mobile-friendly navigation system

### User Experience
- **Loading Screens**: Smooth transitions between pages
- **Enhanced Hero**: Improved background transparency for better image visibility
- **Search & Filters**: Advanced filtering for schedules and news
- **Responsive Design**: Optimized for all device sizes

### Pages
- `/` - Homepage with hero, stats, matches, and news
- `/lineup` - Player lineups for upcoming matches
- `/news` - News listing with search and filters
- `/news/[id]` - Individual news article pages
- `/schedule` - Match schedules with booking functionality
- `/user-profile` - User profile and statistics
- `/admin` - Admin dashboard
- `/a/login` - Admin login

## 🛠️ Technical Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Database**: Prisma (configured for PostgreSQL)

## 📱 Component Examples

### Atoms
```tsx
// LoadingSpinner
<LoadingSpinner size="lg" />

// NavigationButton
<NavigationButton 
  icon={Calendar} 
  label="View Schedule" 
  onClick={handleClick} 
/>
```

### Molecules
```tsx
// LoadingScreen
<LoadingScreen message="Loading schedules..." />

// HeroActions
<HeroActions />
```

### Organisms
```tsx
// NewsCard
<NewsCard
  id="1"
  title="Tournament News"
  excerpt="Latest tournament updates..."
  category="Tournament"
  publishedAt="2025-01-10"
/>
```

## 🎨 Design System

### Colors
- **Primary**: Sky/Blue gradient (`from-sky-400 to-blue-500`)
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Green for success states, Red for errors

### Typography
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable text with proper contrast
- **Interactive**: Hover states and transitions

### Spacing
- **Consistent**: 8px grid system
- **Responsive**: Adaptive spacing for different screen sizes

## 🔧 Development

### Getting Started
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
npm start
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting (recommended)

## 📊 Performance

- **Component Reusability**: Atomic design reduces bundle size
- **Lazy Loading**: Images and components load on demand
- **Optimized Images**: Next.js image optimization
- **Tree Shaking**: Unused code elimination

## 🔒 Security

- **Input Validation**: All forms include validation
- **XSS Protection**: Sanitized HTML content
- **CSRF Protection**: Built-in Next.js security

## 📈 Future Enhancements

- [ ] Real-time match updates
- [ ] Push notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Follow atomic design principles
2. Use TypeScript for all new components
3. Include proper error handling
4. Write responsive CSS
5. Test on multiple devices

## 📄 License

This project is licensed under the MIT License.
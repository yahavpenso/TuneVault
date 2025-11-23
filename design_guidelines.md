# Music Download Platform - Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from Y2mate and modern converter platforms like Convertio and OnlineVideoConverter, combined with the clean aesthetics of productivity tools. The design prioritizes conversion workflow efficiency while maintaining visual appeal through strategic use of color and spacing.

## Color System
- **Primary:** #FF6B6B (coral red) - CTAs, download buttons, active states
- **Secondary:** #4ECDC4 (teal) - progress indicators, success states, accents
- **Background:** #F7F9FC (light blue-grey) - main background
- **Surface:** #FFFFFF - cards, input fields, elevated components
- **Text Primary:** #2C3E50 (dark slate)
- **Text Secondary:** #6B7A8F
- **Accent:** #FFE66D (warm yellow) - highlights, badges
- **Success:** #51CF66 - completion states, checkmarks
- **Error:** #F56565 - validation errors

## Typography
**Fonts:** Poppins (headings, buttons) + Inter (body, labels)

**Hierarchy:**
- Hero/H1: Poppins 48px/56px, weight 700 (mobile: 32px/40px)
- H2/Section Titles: Poppins 32px/40px, weight 600 (mobile: 24px/32px)
- H3/Card Titles: Poppins 20px/28px, weight 600
- Body: Inter 16px/24px, weight 400
- Labels: Inter 14px/20px, weight 500
- Buttons: Poppins 16px/24px, weight 600
- Small Text: Inter 12px/16px, weight 400

## Layout System
**Spacing Units:** Tailwind scale - primarily 4, 6, 8, 12, 16, 24 (p-4, p-6, p-8, etc.)

**Structure:**
- Max container width: max-w-6xl centered
- Card padding: p-8 desktop, p-6 mobile
- Section spacing: py-16 desktop, py-12 mobile
- Component gaps: gap-6 for card grids, gap-4 for form elements

## Core Components

**Hero Section:**
- Clean gradient background (F7F9FC to E8F4F8)
- Centered headline: "Download Music in Seconds"
- Subheading explaining supported platforms
- Primary converter card immediately below (no scrolling needed)
- No hero image - focus on the conversion tool

**Main Converter Card:**
- Prominent white card with shadow-lg, rounded-2xl
- Large URL input field (h-14) with placeholder "Paste YouTube, SoundCloud, or Spotify URL..."
- Inline paste button with icon
- Format selector (MP3, WAV, FLAC) as pill buttons below input
- Quality dropdown (128kbps, 320kbps, Lossless)
- Large coral red "Download" button (h-12, full width on mobile)
- All elements within single cohesive card

**Format Selection:**
- Three pill-style buttons in a row
- Active state: coral red background with white text
- Inactive: light grey background with dark text
- Icons for each format (musical note variations)

**Progress Indicator:**
- Replaces converter card during processing
- Teal progress bar with percentage
- Status text updates ("Fetching...", "Converting...", "Ready!")
- Spinning icon animation
- Estimated time remaining

**Download Results:**
- Success card with green accent border
- Track thumbnail (if available), title, artist
- File size and format badge
- Primary "Download File" button (coral red)
- Secondary "Convert Another" link

**Search Feature Section:**
- Secondary card below main converter
- Search input with magnifying glass icon
- "Search by title or artist" placeholder
- Grid of recent/popular searches as clickable tags
- Results display as cards with thumbnail, title, platform badge

**Supported Platforms Badge Row:**
- Small logos/icons: YouTube, SoundCloud, Spotify, Apple Music
- Grey background pills with platform names
- Below hero section, centered
- "and more..." text at end

**Features Grid:**
- Three-column grid (1-col mobile, 2-col tablet, 3-col desktop)
- Icon + title + description format
- Icons: teal circular backgrounds
- Features: "Multiple Formats", "Fast Conversion", "High Quality", "No Registration", "Batch Downloads", "Mobile Friendly"

**Footer:**
- Two-column layout: Links + Info
- Platform links, help documentation, FAQ
- Copyright and platform badges
- Minimal padding (py-8)

## Interactions & States

**Buttons:**
- Primary (coral red): Solid fill, white text, shadow-md, scale-105 on hover
- Secondary (teal outline): Border-2, teal text, teal background on hover
- Disabled: Grey background, reduced opacity
- All buttons: rounded-lg, smooth transitions

**Form Inputs:**
- Border-2 with grey default, teal on focus
- Height h-12 for text inputs
- Error state: red border with shake animation
- Success validation: green checkmark icon

**Cards:**
- Default: shadow-md, rounded-2xl
- Hover: shadow-xl, slight lift (transform)
- White background on light grey base

## Animations
Use sparingly:
- Progress bar: smooth width transition
- Button hover: transform scale (1.05)
- Card entrance: fade-in + slide-up (stagger for grids)
- Error shake: horizontal vibration for invalid input
- Success checkmark: scale pop-in

## Images
**No hero image** - The converter tool IS the hero. Focus immediately on functionality.

**Platform Icons:** Use official brand icons for supported platforms (Font Awesome or custom SVG set)

**Feature Icons:** Simple line icons from Heroicons for feature grid

**Track Thumbnails:** Dynamic thumbnails pulled from source platforms displayed in results

## Responsive Breakpoints
- Mobile (<768px): Single column, full-width cards, stacked elements
- Tablet (768-1024px): Two-column grids where appropriate
- Desktop (>1024px): Full three-column layouts, max-w-6xl container

## Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation for format selection
- Focus indicators with teal outline (ring-2 ring-teal-400)
- High contrast maintained (WCAG AA minimum)
- Error messages announced to screen readers
- Progress updates with aria-live regions
# Design Guidelines: Barcode-Based Inventory System

## Design Approach

**System Selected:** Material Design principles adapted for data-heavy productivity applications, drawing inspiration from Linear's clarity and Notion's efficient information architecture.

**Rationale:** This inventory management system prioritizes scan speed, data readability, and workflow efficiency over visual storytelling. Users need instant visual feedback, clear status indicators, and zero friction in the scanning process.

## Typography System

**Font Family:** Inter (primary), JetBrains Mono (barcodes/codes)
- **Headings:** 
  - Page titles: text-2xl font-semibold (24px)
  - Section headers: text-lg font-semibold (18px)
  - Card titles: text-base font-medium (16px)
- **Body Text:**
  - Primary: text-sm (14px) - default for most interface text
  - Secondary/metadata: text-xs (12px)
  - Barcode display: font-mono text-sm
- **Data Tables:**
  - Headers: text-xs font-semibold uppercase tracking-wide
  - Cell content: text-sm
  - Status badges: text-xs font-medium

## Layout System

**Spacing Units:** Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm

**Application Structure:**
- Fixed top navigation bar (h-16)
- Sidebar navigation (w-64) with collapsible option
- Main content area with max-w-7xl container, px-6 py-8
- Consistent section spacing: mb-8 between major sections, mb-4 between related elements

**Grid System:**
- Dashboard stats: grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4
- Item cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Data tables: full-width responsive tables with horizontal scroll on mobile

## Core Components

### 1. Scan Interface (Primary Screen)
- **Barcode Input Field:**
  - Extra-large text input (text-4xl) for immediate visual feedback
  - Full-width, centered layout with h-20
  - Auto-focus on page load and after each scan
  - Real-time display of entered barcode as user scans
- **Scan Feedback Zone:**
  - Large status display (min-h-32) showing last action
  - Animated success/registration prompts
  - Clear visual hierarchy for item name, action performed, timestamp

### 2. Item Registration Modal
- **Layout:** Center-screen overlay (max-w-2xl)
- **Form Structure:**
  - Single column layout with consistent spacing (space-y-6)
  - Barcode display at top (read-only, font-mono)
  - Input fields: Item name (required), Category (dropdown), Description (textarea)
  - Status toggle prominently displayed
  - Action buttons: full-width on mobile, inline on desktop (gap-3)

### 3. Inventory Dashboard
- **Stats Cards (Top Section):**
  - Four-column grid on desktop, stacked on mobile
  - Each card: p-6, rounded-lg with shadow
  - Large number display (text-3xl font-bold)
  - Label below (text-sm)
  - Icon on right side (w-12 h-12)
- **Quick Filters:**
  - Horizontal button group (gap-2)
  - Pill-shaped buttons with rounded-full
  - Active state clearly distinguished
- **Data Table:**
  - Striped rows for readability
  - Fixed header on scroll
  - Column structure: Barcode (w-32), Name (flex-1), Category (w-40), Status (w-32), Actions (w-24)
  - Row height: h-14 for touch-friendly interaction
  - Hover states on rows

### 4. Search & Filtering
- **Search Bar:**
  - Prominent placement (w-full max-w-md)
  - Icon prefix (left-side search icon)
  - Clear button when input has value
  - Instant filtering as user types
- **Filter Dropdowns:**
  - Minimal, inline style
  - Category and status filters side-by-side (gap-3)

### 5. Scan History Log
- **Timeline Layout:**
  - Left border timeline indicator
  - Each entry: py-4 pl-6 structure
  - Timestamp, item name, action, barcode in vertical stack
  - Grouped by date with date headers (text-xs font-semibold uppercase)
- **Pagination:**
  - Bottom-aligned, centered
  - Show 20-50 entries per page
  - Simple prev/next with page numbers

### 6. Navigation
- **Top Bar:**
  - Logo/title on left (h-16 flex items-center px-6)
  - Primary actions on right (export, settings)
  - Search bar in center (hidden on mobile, shown in expanded menu)
- **Sidebar:**
  - Icon + text navigation items (h-10 each)
  - Active state: full-width background treatment
  - Collapse to icons-only on medium screens
  - Links: Dashboard, Scan, Inventory, History, Import/Export

### 7. Forms & Inputs
- **Text Inputs:**
  - Height: h-11
  - Padding: px-4
  - Rounded: rounded-md
  - Border width: border (1px)
  - Focus: ring treatment (ring-2)
- **Buttons:**
  - Primary: h-11 px-6 rounded-md font-medium
  - Secondary: same dimensions, different visual treatment
  - Icon buttons: w-10 h-10 rounded-md
- **Dropdowns:**
  - Match input height (h-11)
  - Chevron icon on right

### 8. Status Indicators
- **Badge Design:**
  - Inline-flex items-center
  - px-2.5 py-0.5 rounded-full
  - text-xs font-medium
  - Different visual treatments for checked-in vs checked-out
- **Icon Usage:**
  - Heroicons (CDN) throughout
  - 20px (w-5 h-5) for inline icons
  - 24px (w-6 h-6) for buttons and prominent features

### 9. Data Display
- **Cards:**
  - Standard padding: p-6
  - Border radius: rounded-lg
  - Shadow: shadow-sm with hover:shadow-md
  - Header section with mb-4 separator
- **Tables:**
  - Dense information display
  - Alternating row backgrounds
  - Right-aligned numerical data
  - Left-aligned text data
  - Sortable column headers with icon indicators

### 10. CSV Import/Export Section
- **Two-Column Layout (Desktop):**
  - Import panel on left, Export panel on right
  - Each panel: p-8 rounded-lg with border
- **File Upload Zone:**
  - Dashed border drag-and-drop area (min-h-48)
  - Centered icon and text
  - File selection button below
- **Export Options:**
  - Radio button list or card selection
  - Download button prominent and full-width

## Responsive Behavior

**Breakpoints:**
- Mobile: base (< 768px) - Single column, stacked navigation
- Tablet: md (768px+) - Two columns where appropriate, visible sidebar
- Desktop: lg (1024px+) - Full multi-column layouts, expanded sidebar
- Wide: xl (1280px+) - Max content width with centered container

**Mobile Optimizations:**
- Bottom navigation bar for primary actions
- Collapsible filters into modal
- Horizontal scroll for tables
- Scan button fixed to bottom of screen (floating action button style)

## Animation Guidelines

**Use Sparingly:**
- Scan success/failure feedback: scale and fade animations (200ms)
- Modal open/close: fade + scale (150ms)
- Dropdown menus: slide + fade (100ms)
- Status badge updates: subtle pulse (300ms)
- No scroll-triggered animations
- No decorative animations

## Accessibility

- All interactive elements meet 44px minimum touch target
- Form labels always visible, not placeholder-based
- Keyboard navigation throughout (focus states with ring treatment)
- ARIA labels for icon-only buttons
- High contrast ratios for all text (will be enforced by color system)
- Screen reader announcements for scan results
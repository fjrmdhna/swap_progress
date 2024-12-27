# File-File yang Bertanggung Jawab untuk UI

## 1. Styling Global
- `app/globals.css`
  - Konfigurasi Tailwind base
  - Custom CSS variables untuk tema
  - Styling untuk komponen Leaflet
  - Custom class untuk cluster marker

## 2. Layout & Container
- `app/page.tsx`
  - Layout utama dashboard
  - Spacing dan padding container
  - Grid/flex layout untuk cards

## 3. Komponen UI
- `app/components/UI/`
  - `Button.tsx` - Styling tombol
  - `Card.tsx` - Container cards
  - `SearchBar.tsx` - Input pencarian
  - `Upload.tsx` - Area upload file

## 4. Komponen Visualisasi
- `app/components/SiteData/`
  - `CardFilter.tsx` - Filter UI dan dropdown
  - `CardBarChart.tsx` - Styling chart bar
  - `CardMap.tsx` - Container peta
  - `Map.tsx` - Styling marker dan popup
  - `CardMatrix.tsx` - Styling tabel matrix
  - `SiteTable.tsx` - Styling tabel data
  - `Chart.tsx` - Styling komponen chart

## 5. Konfigurasi Tema
- `tailwind.config.ts`
  - Konfigurasi warna
  - Font settings
  - Breakpoints
  - Custom utilities

## Prioritas Perbaikan UI

### 1. Konsistensi Visual
- Standardisasi padding dan margin
- Konsistensi ukuran font
- Unified color scheme
- Spacing yang konsisten antar komponen

### 2. Responsivitas
- Mobile-first approach
- Breakpoints yang tepat
- Flexible layouts

### 3. Interaktivitas
- Hover states
- Loading states
- Transisi dan animasi
- Feedback visual

### 4. Aksesibilitas
- Kontras warna yang baik
- Focus states
- Screen reader compatibility

### 5. Polish
- Shadow dan elevation
- Border radius
- Typography scaling
- Micro-interactions 
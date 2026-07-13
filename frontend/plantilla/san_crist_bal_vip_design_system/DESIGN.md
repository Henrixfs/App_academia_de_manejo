---
name: San Cristóbal VIP Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  safety-blue: '#1E3A8A'
  caution-amber: '#D97706'
  road-gray: '#475569'
  success-green: '#10B981'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system for the **Academia de Manejo San Cristóbal VIP** is built on the pillars of **Safety, Pedagogical Patience, and Excellence**. It targets aspiring drivers in Ayacucho who seek a premium, reliable, and technologically advanced learning environment.

The visual style follows a **Corporate / Modern** aesthetic with a heavy emphasis on clarity and trust. To reflect the efficiency of the RAG (Retrieval-Augmented Generation) system integrated into their operations, the UI utilizes generous whitespace, precise alignment, and a structured hierarchy. The tone is authoritative yet approachable, ensuring students feel guided and secure throughout their digital and physical journey.

Key visual characteristics include:
- **Professionalism:** High-quality imagery and structured data presentation.
- **Safety:** Clear signposting, high-contrast alerts, and instructional clarity.
- **Modernity:** Subtle depth and refined transitions that suggest a tech-forward institution.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, symbolizing authority and stability. This is contrasted with **Caution Amber (#F59E0B)**, a color directly inherited from road safety signage, used sparingly for calls to action and critical highlights.

- **Primary (Deep Navy):** Used for headers, primary buttons, and heavy branding elements. It conveys the seriousness of road safety.
- **Secondary (Caution Amber):** Used for high-impact accents, price highlights, and pedagogical "tips."
- **Tertiary (Action Blue):** A lighter blue used for secondary interactions, links, and informational icons.
- **Neutral (Slate/White):** A clean, off-white background ensures readability and a "clean slate" feel for new learners.

Named colors like **Success Green** are reserved for "First Attempt Approval" badges and status indicators within the training modules.

## Typography

This design system uses a dual-sans-serif approach to maximize both character and legibility.

- **Manrope** is used for headlines. Its geometric yet warm construction feels modern and professional, aligning with the "VIP" aspect of the brand.
- **Inter** is used for all body text and UI labels. It is highly legible at small sizes, making it perfect for complex information like pricing tables and traffic rule descriptions.

**Scaling Rules:**
On mobile devices, large display headers should scale down to `headline-lg-mobile` to maintain readability without overwhelming the viewport. Paragraph spacing should be maintained at a minimum of 1.5x the font size to ensure a comfortable reading experience for students reviewing study materials.

## Layout & Spacing

The layout employs a **Fixed Grid** model for desktop to maintain an institutional and organized feel, transitioning to a fluid model for mobile devices.

- **Desktop:** 12-column grid with a max-width of 1280px. Gutters are fixed at 24px.
- **Mobile:** Single column with 16px side margins.
- **Rhythm:** A 4px baseline grid governs all vertical rhythm. Use `md` (24px) for most component spacing and `lg` (48px) for section padding to ensure the "clean and spacious" aesthetic.

**Layout Reflow:** 
Information-heavy sections, such as the "Tipos de Falta" table, should transition to card-based layouts on mobile to prevent horizontal scrolling and ensure the safety-critical information is easily digestible.

## Elevation & Depth

To achieve a modern, tech-focused look, the system uses **Tonal Layers** combined with **Ambient Shadows**.

1.  **Base Layer:** The neutral background (#F8FAFC).
2.  **Surface Layer:** Cards and containers use pure white (#FFFFFF) with a very soft, diffused shadow (15% opacity Deep Navy, 20px blur, 4px offset).
3.  **Active Layer:** Elements currently being interacted with (like an active input field or a hovered service card) use a subtle **Tertiary Blue** glow or a slight scale increase (1.02x).

Avoid heavy black shadows. Instead, use "tinted" shadows that incorporate the primary navy color to keep the UI looking clean and integrated rather than "dirty."

## Shapes

The shape language is **Rounded (Level 2)**. This specific radius (0.5rem / 8px for standard components) is chosen to balance the "serious" nature of driving with the "pedagogical patience" of the instructors.

- **Buttons & Inputs:** 8px (0.5rem) corner radius.
- **Service Cards:** 16px (1rem) corner radius to create a distinct, friendly container.
- **Feature Icons:** Contained within "Squircle" shapes or circles to soften the technical layout.

## Components

### Buttons
- **Primary:** Deep Navy background, White text. High-contrast, bold weight. Used for "Enroll Now" or "Book Simulation."
- **Secondary:** White background, Deep Navy border (2px). Used for "View Gallery" or "Learn More."
- **Action:** Caution Amber background. Reserved specifically for urgent conversion points (e.g., WhatsApp contact).

### Service Cards
Cards should feature a 1px Slate border and a soft ambient shadow. They include a top-aligned icon (Safety Blue), a `headline-md` title, and a clear price tag in `label-md` using the Caution Amber color.

### Pricing Tables
Tables must be high-contrast with a Deep Navy header row. Alternate rows should use a 50% opacity Neutral tint for legibility. "Falta Eliminatoria" rows in evaluation tables should be highlighted with a subtle red-tinted background.

### Forms
Input fields use a 1px Road Gray border that transitions to Safety Blue on focus. Labels must be positioned above the field in `label-md`.

### Status Badges
Small, pill-shaped chips for "Level: Basic," "Level: Pre-exam," or "Approved." These use low-saturation versions of the brand colors with dark text to ensure accessibility.
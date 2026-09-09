[DESIGN.md](https://github.com/user-attachments/files/31984952/DESIGN.md)
[DESIGN.md](https://github.com/user-attachments/files/31981281/DESIGN.md)
---
name: Obsidian Flux
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#d4c0d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#9d8ba0'
  outline-variant: '#504254'
  surface-tint: '#ebb2ff'
  primary: '#ebb2ff'
  on-primary: '#520072'
  primary-container: '#bc13fe'
  on-primary-container: '#ffffff'
  inverse-primary: '#9800d0'
  secondary: '#e6feff'
  on-secondary: '#003739'
  secondary-container: '#00f4fe'
  on-secondary-container: '#006c71'
  tertiary: '#c8c6c7'
  on-tertiary: '#303031'
  tertiary-container: '#777677'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f8d8ff'
  primary-fixed-dim: '#ebb2ff'
  on-primary-fixed: '#320047'
  on-primary-fixed-variant: '#74009f'
  secondary-fixed: '#63f7ff'
  secondary-fixed-dim: '#00dce5'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#e5e2e3'
  tertiary-fixed-dim: '#c8c6c7'
  on-tertiary-fixed: '#1b1b1c'
  on-tertiary-fixed-variant: '#474647'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to evoke a sense of immense computational power and cinematic sophistication. It targets creative professionals and AI enthusiasts who require a tool that feels as innovative as the technology powering it. 

The aesthetic is rooted in **Glassmorphism** and **Futuristic Minimalism**. By utilizing deep, obsidian-layered surfaces and vibrant, neon-gas accents, the UI mimics a high-end command center. Visual hierarchy is established through "glowing" states and varying levels of translucency rather than traditional heavy shadows. The interface should feel like a premium lens into the AI's creative process—transparent, fluid, and lightning-fast.

## Colors

The palette is anchored in a "Dark Mode Only" philosophy to maintain the high-tech cinematic feel. 

- **Base Surfaces:** Use `background_obsidian` for the deepest layout layers. `surface_charcoal` is reserved for elevated cards and navigation bars.
- **Accents:** `primary_color_hex` (Electric Purple) is the primary action color, used for high-importance triggers and active states. `secondary_color_hex` (Neon Cyan) serves as a secondary accent for data visualization, progress bars, and "AI processing" indicators.
- **Functional Gradients:** Use linear gradients moving from Purple to Cyan to represent active AI generation or "processing" states.

## Typography

This design system utilizes a dual-font strategy to balance technical grit with high readability. 

- **Space Grotesk** is used for headlines, display numbers, and labels. Its geometric, slightly "tech" apertures reinforce the futuristic theme. Use uppercase for labels to create a functional, dashboard-like aesthetic.
- **Inter** is used for all body copy, descriptions, and input text. Its neutral, systematic nature ensures that even complex AI prompt descriptions remain highly legible against dark backgrounds.

## Layout & Spacing

The layout follows a 4px rhythmic baseline to ensure mathematical precision. On mobile, we utilize a fluid grid with 20px side margins to give the content "breathing room" against the edges of the device. 

Vertical spacing is generous to prevent the UI from feeling cluttered during the video editing process. Content groups should be separated by `stack-lg` (32px), while internal element spacing (like an icon next to a label) should adhere to `stack-sm` (8px).

## Elevation & Depth

Depth is achieved through **Backdrop Blurs** and **Inner Glows** rather than drop shadows. 

1. **Surface Tier 1 (Base):** Solid `#050505`.
2. **Surface Tier 2 (Cards):** Translucent charcoal (`rgba(26, 26, 27, 0.8)`) with a 20px backdrop blur.
3. **Surface Tier 3 (Modals/Popovers):** Higher translucency with a 1px solid border at 10% white to simulate light hitting the edge of the glass.

For active elements, apply a "Bloom" effect: a subtle 10px outer glow using the primary purple or cyan color at 20% opacity.

## Shapes

The shape language is "Rounded-Sophisticated." We avoid sharp corners to maintain a modern, friendly-tech feel, but avoid full-pill shapes for structural elements to keep the "professional tool" vibe. 

- **Standard Cards/Buttons:** 0.5rem (8px) radius.
- **Large Containers:** 1rem (16px) radius.
- **Input Fields:** 0.5rem (8px) radius.
- **Icons:** Thin-line (1.5pt stroke) with slightly rounded terminals to match the font geometry.

## Components

- **Buttons:** Primary buttons use a solid Electric Purple fill with white text. Secondary buttons use the Glassmorphism style: a 1px Cyan border, blurred background, and Cyan text.
- **Input Fields (Prompts):** Dark, recessed backgrounds with a subtle 1px border that "ignites" (glows) Cyan when focused. Use Inter for input text.
- **AI Progress Bars:** A thin, 4px track with a Neon Cyan gradient fill that has a horizontal pulse animation.
- **Glass Cards:** Used for video previews and tool settings. They must feature a subtle inner stroke (Top/Left: white @ 10%, Bottom/Right: black @ 20%) to create a 3D glass pane effect.
- **Thin-Line Icons:** All icons should be custom-drawn with a 1.5px stroke weight. Avoid filled icons unless indicating a toggled-on state.
- **Video Tiles:** Feature a 2px radius "glow-border" when selected to indicate active processing or playback.

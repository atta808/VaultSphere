// Primary
export const PRIMARY = '#0F172A';
export const SECONDARY = '#1E293B';
export const ACCENT = '#D4AF37';

// Status
export const SUCCESS = '#10B981';
export const DANGER = '#EF4444';
export const WARNING = '#F59E0B';

// Backgrounds
export const BACKGROUND_LIGHT = '#F8FAFC';
export const BACKGROUND_DARK = '#020617';

// Surfaces
export const SURFACE_LIGHT = '#FFFFFF';
export const SURFACE_DARK = '#1E293B'; // Using secondary for dark surface

// Borders
export const BORDER_LIGHT = '#E5E7EB';
export const BORDER_DARK = '#334155'; // A slightly lighter tone than background dark

// Text
export const TEXT_PRIMARY_LIGHT = '#111827';
export const TEXT_SECONDARY_LIGHT = '#6B7280';
export const TEXT_PRIMARY_DARK = '#F8FAFC'; // Inverting for dark mode
export const TEXT_SECONDARY_DARK = '#94A3B8'; // Inverting for dark mode

export const colors = {
  primary: PRIMARY,
  secondary: SECONDARY,
  accent: ACCENT,
  success: SUCCESS,
  danger: DANGER,
  warning: WARNING,
  light: {
    background: BACKGROUND_LIGHT,
    surface: SURFACE_LIGHT,
    border: BORDER_LIGHT,
    textPrimary: TEXT_PRIMARY_LIGHT,
    textSecondary: TEXT_SECONDARY_LIGHT,
  },
  dark: {
    background: BACKGROUND_DARK,
    surface: SURFACE_DARK,
    border: BORDER_DARK,
    textPrimary: TEXT_PRIMARY_DARK,
    textSecondary: TEXT_SECONDARY_DARK,
  }
};

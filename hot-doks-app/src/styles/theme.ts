import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#1B1B1B',           // Main text color
    secondary: '#767676',         // Secondary text color
    background: '#FFFFFF',        // Main background
    white: '#FFFFFF',
    accent: '#000000',           // Primary accent color
    error: '#D41313',            // Error/Sale color
    success: '#4A9B45',          // Success color
    border: '#E5E5E5',           // Border color
    backgroundGrey: '#F8F8F8',   // Secondary background
    hover: '#F5F5F5',            // Hover state background
  },
  typography: {
    fontFamily: {
      primary: '"Proxima Nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: '"Proxima Nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      small: '0.875rem',  // 14px
      medium: '1rem',     // 16px
      large: '1.125rem',  // 18px
      xlarge: '1.5rem',   // 24px
      xxlarge: '2rem',    // 32px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  layout: {
    headerHeight: '64px',
    footerHeight: '48px',
    sidebarCollapsedWidth: '75px',
    sidebarExpandedWidth: '240px',
  },
  zIndex: {
    header: 1000,
    sidebar: 900,
    footer: 1000,
    modal: 1100,
    tooltip: 1200,
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  media: {
    xs: '(max-width: 320px)',
    sm: '(max-width: 576px)',
    md: '(max-width: 768px)',
    lg: '(max-width: 992px)',
    xl: '(max-width: 1200px)',
  },
};

export default theme;

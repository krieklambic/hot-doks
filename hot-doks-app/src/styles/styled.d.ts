import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      white: string;
      accent: string;
      error: string;
      success: string;
      border: string;
      backgroundGrey: string;
      hover: string;
    };
    typography: {
      fontFamily: {
        primary: string;
        secondary: string;
      };
      fontSize: {
        xs: string;
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
      };
      fontWeight: {
        light: number;
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    transitions: {
      default: string;
      fast: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
    };
    layout: {
      headerHeight: string;
      footerHeight: string;
      sidebarCollapsedWidth: string;
      sidebarExpandedWidth: string;
    };
    zIndex: {
      header: number;
      sidebar: number;
      footer: number;
      modal: number;
      tooltip: number;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
  }
}

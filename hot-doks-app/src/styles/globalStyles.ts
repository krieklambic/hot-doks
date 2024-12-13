import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Import Proxima Nova font */
  @font-face {
    font-family: 'Proxima Nova';
    src: url('/fonts/ProximaNova-Light.woff2') format('woff2'),
         url('/fonts/ProximaNova-Light.woff') format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Proxima Nova';
    src: url('/fonts/ProximaNova-Regular.woff2') format('woff2'),
         url('/fonts/ProximaNova-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Proxima Nova';
    src: url('/fonts/ProximaNova-Medium.woff2') format('woff2'),
         url('/fonts/ProximaNova-Medium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Proxima Nova';
    src: url('/fonts/ProximaNova-Semibold.woff2') format('woff2'),
         url('/fonts/ProximaNova-Semibold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Proxima Nova';
    src: url('/fonts/ProximaNova-Bold.woff2') format('woff2'),
         url('/fonts/ProximaNova-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  /* Reset CSS */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: inherit;
  }

  ul, ol {
    list-style: none;
  }

  /* Shared Table Styles */
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: ${({ theme }) => theme.colors.background};
  }

  th {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    text-align: center;
    color: ${({ theme }) => theme.colors.secondary};
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: 13px;
    white-space: nowrap;
    background-color: ${({ theme }) => theme.colors.white};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  }

  tr {
    &:hover {
      background: ${({ theme }) => theme.colors.hover};
    }
  }

  td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  .action-header-cell {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }

  .action-cell {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }

  .condiment-cell {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
  }

  .comment-header-cell {
    width: 200px;
    min-width: 200px;
  }

  .comment-cell {
    width: 200px;
    min-width: 200px;
    text-align: left;
  }
`;

// Shared Table Components
export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

export const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: 13px;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

export const TableRow = styled.tr<{ $index?: number; $isVege?: boolean }>`
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
  background-color: ${props => props.$isVege ? '#E8F5E9' : 'transparent'};
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Specialized Table Cells
export const ActionHeaderCell = styled(TableHeaderCell)`
  width: 60px;
  min-width: 60px;
  max-width: 60px;
`;

export const ActionCell = styled(TableCell)`
  width: 60px;
  min-width: 60px;
  max-width: 60px;
`;

export const CondimentCell = styled(TableCell)`
  width: 120px;
  min-width: 120px;
  max-width: 120px;
`;

export const CondimentHeaderCell = styled(TableHeaderCell)`
  width: 120px;
  min-width: 120px;
  max-width: 120px;
`;

export const CommentHeaderCell = styled(TableHeaderCell)`
  width: 200px;
  min-width: 200px;
`;

export const CommentCell = styled(TableCell)`
  width: 200px;
  min-width: 200px;
  text-align: left;
`;

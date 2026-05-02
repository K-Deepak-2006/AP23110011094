/**
 * Campus Notifications — Material UI Theme
 * -----------------------------------------
 * Elegant, human-made light theme emphasizing readability,
 * clean typography, soft glassmorphism, and natural shadows.
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:  '#4F46E5',   // Indigo-600
      light: '#818CF8',
      dark:  '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main:  '#F59E0B',   // Amber-500
      light: '#FCD34D',
      dark:  '#B45309',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',  // Slate-50 — very soft, warm off-white
      paper:   '#FFFFFF',  // Pure white for crisp cards
    },
    success: {
      main: '#10B981',   // Emerald
    },
    warning: {
      main: '#F59E0B',   // Amber
    },
    info: {
      main: '#38BDF8',   // Sky
    },
    error: {
      main: '#EF4444',   // Red
    },
    text: {
      primary:   '#0F172A', // Slate-900
      secondary: '#475569', // Slate-600
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px', color: '#0F172A' },
    h5: { fontWeight: 600, color: '#0F172A' },
    h6: { fontWeight: 600, color: '#0F172A' },
    subtitle1: { fontWeight: 600, color: '#1E293B' },
    body2: { lineHeight: 1.6, color: '#334155' },
    button: { fontWeight: 600, letterSpacing: '0.2px' },
  },
  shape: {
    borderRadius: 14, // Slightly rounder, softer feel
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(15, 23, 42, 0.04)',
          boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 4px 16px -4px rgba(15, 23, 42, 0.02)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          '&:hover': {
            borderColor: 'rgba(79, 70, 229, 0.15)',
            boxShadow: '0 8px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -4px rgba(79, 70, 229, 0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: '0.3px', borderRadius: 8 },
        filled: {
          // Soften chip colors slightly for light mode
          opacity: 0.9,
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none', 
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { 
          backgroundImage: 'none', 
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(15, 23, 42, 0.06)'
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { 
          backgroundImage: 'none', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', // for Safari
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          color: '#0F172A', // dark text on light glass
        },
      },
    },
  },
});

export default theme;

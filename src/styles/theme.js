// src/styles/theme.js
export const theme = {
  colors: {
    primary: '#6C63FF',    // Vibrant purple
    secondary: '#FF6584',  // Energetic pink
    accent: '#42A5F5',     // Bright blue
    success: '#4CAF50',    // Green
    warning: '#FF9800',    // Orange
    background: '#F8FAFC', // Light gray background
    surface: '#FFFFFF',    // White surfaces
    text: {
      primary: '#2D3748',  // Dark gray
      secondary: '#718096', // Medium gray
      light: '#FFFFFF',    // White text
    },
    gradient: {
      start: '#6C63FF',
      end: '#FF6584',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 14 },
  }
};
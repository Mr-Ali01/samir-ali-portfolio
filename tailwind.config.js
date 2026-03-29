/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--theme-accent-primary)',
          secondary: 'var(--theme-accent-secondary)',
          glow: 'var(--theme-glow)',
          textPrimary: 'var(--theme-text-primary)',
          textSecondary: 'var(--theme-text-secondary)',
          bgStart: 'var(--theme-bg-start)',
          bgMid: 'var(--theme-bg-mid)',
          bgEnd: 'var(--theme-bg-end)',
        },
        dash: {
          accent: 'var(--dash-accent)',
          secondary: 'var(--dash-secondary)',
          bg: 'var(--dash-bg-start)',
          sidebar: 'var(--dash-sidebar)',
          border: 'var(--dash-border)',
          text: 'var(--dash-text)',
          muted: 'var(--dash-muted)',
          accentGlow: 'rgba(56, 189, 248, 0.3)',
          blueGlow: 'rgba(139, 92, 246, 0.3)',
        }
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

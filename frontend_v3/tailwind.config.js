/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ═══ ULTIMATE TEAM COLOR PALETTE ═══
        // Backgrounds & textes pilotés par variables CSS (thème clair/sombre — voir index.css)
        'ut-bg': 'rgb(var(--ut-bg) / <alpha-value>)',
        'ut-surface': 'rgb(var(--ut-surface) / <alpha-value>)',
        'ut-surface-light': 'rgb(var(--ut-surface-light) / <alpha-value>)',
        'ut-border': 'rgb(var(--ut-border) / <alpha-value>)',
        'ut-border-bright': 'rgb(var(--ut-border-bright) / <alpha-value>)',
        
        // Accents Néon - Style Ultimate Team (fixes, lisibles sur les deux thèmes)
        'ut-cyan': '#00D4FF',
        'ut-cyan-dim': '#0891B2',
        'ut-gold': '#FFD700',
        'ut-gold-dim': '#DAA520',
        'ut-green': '#00FF88',
        'ut-green-dim': '#059669',
        'ut-red': '#FF3366',
        'ut-red-dim': '#DC2626',
        'ut-purple': '#A855F7',
        'ut-purple-dim': '#7C3AED',
        'ut-orange': '#FB923C',
        
        // Textes — pilotés par variables CSS
        'ut-text-primary': 'rgb(var(--ut-text-primary) / <alpha-value>)',
        'ut-text-secondary': 'rgb(var(--ut-text-secondary) / <alpha-value>)',
        'ut-text-muted': 'rgb(var(--ut-text-muted) / <alpha-value>)',
        
        // Cartes UT - Raretés
        'ut-legendary-bg': 'linear-gradient(135deg, #1a0e0e 0%, #2d1810 50%, #1a0e0e 100%)',
        'ut-gold-bg': 'linear-gradient(135deg, #1a1700 0%, #2d2600 50%, #1a1700 100%)',
        'ut-silver-bg': 'linear-gradient(135deg, #0f1317 0%, #1a2025 50%, #0f1317 100%)',
        'ut-bronze-bg': 'linear-gradient(135deg, #171410 0%, #252015 50%, #171410 100%)',
        
        // Legacy support (backward compatibility) — mêmes variables
        background: 'rgb(var(--ut-bg) / <alpha-value>)',
        surface: 'rgb(var(--ut-surface) / <alpha-value>)',
        borderCustom: 'rgb(var(--ut-border) / <alpha-value>)',
        accentBlue: '#00D4FF',
        accentGreen: '#00FF88',
        accentRed: '#FF3366',
        accentGold: '#FFD700',
        textMuted: 'rgb(var(--ut-text-secondary) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Rajdhani', 'Inter', 'sans-serif'], // Police gaming/style sportif
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        // ═══ ANIMATIONS ULTIMATE TEAM ═══
        
        // Entrée depuis le bas (pitch entry)
        pitchEntry: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        
        // Glow pulsant de stade
        stadiumGlow: {
          '0%, 100%': { 
            opacity: '0.4', 
            transform: 'scale(1)',
            filter: 'blur(80px)'
          },
          '50%': { 
            opacity: '0.7', 
            transform: 'scale(1.05)',
            filter: 'blur(100px)'
          },
        },
        
        // Pulse pour LIVE
        livePulse: {
          '0%': { 
            boxShadow: '0 0 0 0 rgba(255, 51, 102, 0.7)',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 0 0 rgba(255, 51, 102, 0.7)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 15px rgba(255, 51, 102, 0)',
            transform: 'scale(1.02)'
          },
        },
        
        // Float doux (cartes UT)
        utFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        
        // Shine effect sur les cartes
        utShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        
        // Rotation lente pour les bordures
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        // Scale in pour les modales/cards
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Slide from right
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Glow pulse pour les éléments spéciaux
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)'
          },
        },
        
        // Border glow animation
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0, 212, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 212, 255, 0.8)' },
        },
        
        // Wave animation (pour le hand emoji)
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-20deg)' },
        },
        
        // Bounce in pour les boutons
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Progress fill animation
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        
        // Shimmer loading effect
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'pitch-entry': 'pitchEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'stadium-glow': 'stadiumGlow 6s ease-in-out infinite',
        'live-pulse': 'livePulse 2s ease-in-out infinite',
        'ut-float': 'utFloat 4s ease-in-out infinite',
        'ut-shine': 'utShine 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 8s linear infinite',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'progress-fill': 'progressFill 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      // Box shadows personnalisées pour les cartes UT
      boxShadow: {
        'ut-card': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'ut-card-hover': '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 212, 255, 0.15)',
        'ut-gold': '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.05)',
        'ut-cyan': '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.05)',
        'ut-red': '0 0 30px rgba(255, 51, 102, 0.3), inset 0 0 20px rgba(255, 51, 102, 0.05)',
        'ut-green': '0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.05)',
        'ut-purple': '0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.05)',
        'glow-sm': '0 0 15px rgba(0, 212, 255, 0.2)',
        'glow-md': '0 0 30px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 50px rgba(0, 212, 255, 0.4)',
      },
      
      // Backdrop blur values
      backdropBlur: {
        xs: '2px',
      },
      
      // Gradient text utility
      backgroundImage: {
        'ut-gradient-cyan': 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        'ut-gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'ut-gradient-green': 'linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)',
        'ut-gradient-red': 'linear-gradient(135deg, #FF3366 0%, #CC2952 100%)',
        'ut-gradient-purple': 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
        'ut-gradient-hero': 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%)',
        'ut-card-shine': 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.08) 55%, transparent 60%)',
        'ut-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

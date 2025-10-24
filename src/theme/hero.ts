import { heroui } from "@heroui/react";

const theme = {
  defaultTheme: "light" as const,
  defaultExtendTheme: "light" as const,
  layout: {
    fontSize: {
      tiny: "0.75rem",
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
    },
    lineHeight: {
      tiny: "1rem",
      small: "1.25rem",
      medium: "1.5rem",
      large: "1.75rem",
    },
    radius: {
      small: "8px",
      medium: "12px",
      large: "16px",
    },
    borderWidth: {
      small: "1px",
      medium: "2px",
      large: "3px",
    },
    disabledOpacity: "0.5",
    dividerWeight: "1px",
    boxShadow: {
      small: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
      medium: "0 4px 16px 0 rgb(0 0 0 / 0.12)",
      large: "0 8px 32px 0 rgb(0 0 0 / 0.16)",
    },
  },
  themes: {
    light: {
      layout: {},
      colors: {
        background: "#FFFFFF",
        foreground: "#1A1A2E",
        divider: {
          DEFAULT: "#E5E7EB",
          foreground: "#6B7280",
        },
        overlay: "#000000",
        focus: "#FF8C00",
        content1: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        content2: {
          DEFAULT: "#F8F9FA",
          foreground: "#1A1A2E",
        },
        content3: {
          DEFAULT: "#F1F3F5",
          foreground: "#1A1A2E",
        },
        content4: {
          DEFAULT: "#E9ECEF",
          foreground: "#1A1A2E",
        },
        default: {
          DEFAULT: "#F8F9FA",
          foreground: "#1A1A2E",
        },
        primary: {
          DEFAULT: "#FF8C00",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A1A2E",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
    },
    dark: {
      layout: {},
      colors: {
        background: "#0F0F1E",
        foreground: "#FFFFFF",
        divider: {
          DEFAULT: "#2D2D44",
          foreground: "#9CA3AF",
        },
        overlay: "#000000",
        focus: "#FFA726",
        content1: {
          DEFAULT: "#1A1A2E",
          foreground: "#FFFFFF",
        },
        content2: {
          DEFAULT: "#2D2D44",
          foreground: "#FFFFFF",
        },
        content3: {
          DEFAULT: "#3A3A5A",
          foreground: "#FFFFFF",
        },
        content4: {
          DEFAULT: "#474770",
          foreground: "#FFFFFF",
        },
        default: {
          DEFAULT: "#2D2D44",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#FF8C00",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFA726",
          foreground: "#1A1A2E",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#1A1A2E",
        },
        danger: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
    },
  },
};

export default heroui(theme);
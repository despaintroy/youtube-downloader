import {Montserrat} from "next/font/google"
import {extendTheme} from "@mui/joy/styles"

declare module "@mui/joy/Link" {
  interface LinkPropsColorOverrides {
    blue: true
  }
}

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap"
})

const theme = extendTheme({
  typography: {
    h1: {
      fontFamily: montserrat.style.fontFamily,
      fontSize: "2rem",
      lineHeight: 1.1
    },
    h2: {fontFamily: montserrat.style.fontFamily},
    h3: {fontFamily: montserrat.style.fontFamily},
    h4: {fontFamily: montserrat.style.fontFamily}
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#ffffff",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#000000",

          solidColor: "var(--joy-palette-primary-50)",
          solidBg: "var(--joy-palette-primary-900)",
          solidHoverBg: "var(--joy-palette-primary-700)",
          solidActiveBg: "var(--joy-palette-primary-800)",
          solidDisabledBg: "var(--joy-palette-primary-200)",
          solidDisabledColor: "var(--joy-palette-primary-400)",

          plainColor: "var(--joy-palette-primary-900)"
          // plainHoverBg: "#f00",
          // plainActiveBg: "#f00",
          // plainDisabledColor: "#f00",

          // outlinedColor: "#f00",
          // outlinedBorder: "#f00",
          // outlinedHoverBg: "#f00",
          // outlinedHoverBorder: "#f00",
          // outlinedActiveBg: "#f00",
          // outlinedDisabledColor: "#f00",
          // outlinedDisabledBorder: "#f00",

          // softColor: "#f00",
          // softBg: "#f00",
          // softHoverBg: "#f00",
          // softActiveBg: "#f00",
          // softDisabledColor: "#f00",
          // softDisabledBg: "#f00"
        },
        warning: {
          solidColor: "#000",
          solidBg: "#ffc107",
          solidBorder: "#ffc107",
          solidHoverBg: "#ffca2c",
          solidHoverBorder: "#ffc720",
          solidActiveBg: "#ffcd39",
          solidActiveBorder: "#ffc720",
          solidDisabledBg: "#ffc107",
          solidDisabledBorder: "#ffc107"
        }
      }
    }
  },
  components: {
    JoyLink: {
      styleOverrides: {
        root: ({ownerState, theme}) => {
          const isBlue = ownerState.color === "blue"

          return {
            color: isBlue ? "#017698" : theme.palette.primary["900"],
            fontWeight: 500,

            "&:hover": {
              textDecoration: isBlue ? "underlined" : "none",
              color: isBlue ? "#005760" : theme.palette.primary["500"]
            }
          }
        }
      }
    }
  }
})

export default theme

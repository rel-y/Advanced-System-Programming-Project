const Theme = {
  colors: {
    // --- Core ---
    "bg": "#ffffff",
    "bg-dark": "#121212",

    "surface": "#ffffff",
    "surface-dark": "#1e1e1e",

    "surface-2": "#f8f9fa",
    "surface-2-dark": "#232323",

    "text": "#202124",
    "text-dark": "#e8eaed",

    "text-muted": "#5f6368",
    "text-muted-dark": "#9aa0a6",

    "border": "#dadce0",
    "border-dark": "#3c4043",

    // --- Brand/Action (Drive-ish blue) ---
    "primary": "#1a73e8",
    "primary-dark": "#8ab4f8",

    "primaryBorder": "#1a6bd6",
    "primaryBorder-dark": "#97bbf5",

    "primary-weak": "#e8f0fe",
    "primary-weak-dark": "#1a3a66",

    "on-primary": "#ffffff",
    "on-primary-dark": "#0b1220",

    // --- States ---
    "hover": "#f1f3f4",
    "hover-dark": "#2a2a2a",

    "active": "#e8f0fe",
    "active-dark": "#263b55",

    "focus-ring": "rgba(26, 115, 232, 0.35)",
    "focus-ring-dark": "rgba(138, 180, 248, 0.45)",

    "danger": "#d93025",
    "danger-dark": "#f28b82",

    "success": "#188038",
    "success-dark": "#81c995",

    "warning": "#f29900",
    "warning-dark": "#fdd663",

    // --- File badges/tags (optional) ---
    "tag-blue": "#1a73e8",
    "tag-blue-dark": "#8ab4f8",

    "tag-green": "#188038",
    "tag-green-dark": "#81c995",

    "tag-yellow": "#f29900",
    "tag-yellow-dark": "#fdd663",

    "tag-red": "#d93025",
    "tag-red-dark": "#f28b82",
  },

  radii: {
    "xs": 6,
    "sm": 10,
    "md": 14,
    "lg": 18,
    "pill": 999,
  },

  spacing: {
    "2xs": 4,
    "xs": 8,
    "sm": 12,
    "md": 16,
    "lg": 20,
    "xl": 24,
    "2xl": 32,
  },

  font: {
    "family": 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    "size-xs": 12,
    "size-sm": 14,
    "size-md": 16,
    "size-lg": 18,
    "size-xl": 20,

    "weight-regular": 400,
    "weight-medium": 500,
    "weight-semibold": 600,
    "weight-bold": 700,

    "line-sm": 1.25,
    "line-md": 1.4,
    "line-lg": 1.6,
  },

  shadows: {
    "sm": "0 1px 2px rgba(60,64,67,0.12), 0 1px 3px rgba(60,64,67,0.08)",
    "sm-dark": "0 1px 2px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.35)",

    "md": "0 2px 6px rgba(60,64,67,0.16), 0 2px 8px rgba(60,64,67,0.10)",
    "md-dark": "0 2px 6px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.40)",
  },

  layout: {
    "sidebar-width": 280,
    "topbar-height": 64,
    "content-max-width": 1200,
  },
};

/**
 *explample 
 *import { useColorScheme } from "react-native";
 *const systemScheme = useColorScheme(); 
 *you should do 
 *const style = getTheme(useColorScheme === "dark"? "dark": "light");
 *how it works:
 * const style = getTheme("light");
 * now if you do style.colors.bg it will give you the light version and if you do 
 * const style = getTheme("dark"); than
 * style.colors.bg will give you the dark version without needing to do the -dark 
 */
export function getTheme(mode = "light") {
  const isDark = mode === "dark";

  const pick = (obj) => {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k.endsWith("-dark")) continue;
      if (isDark && Object.prototype.hasOwnProperty.call(obj, `${k}-dark`)) {
        out[k] = obj[`${k}-dark`];
      } else {
        out[k] = v;
      }
    }
    return out;
  };

  return {
    mode,
    colors: pick(Theme.colors),
    radii: { ...Theme.radii },
    spacing: { ...Theme.spacing },
    font: { ...Theme.font },
    shadows: pick(Theme.shadows),
    layout: { ...Theme.layout },
    // expose raw too if you ever need to read the -dark tokens directly
    raw: Theme,
  };
}

export default Theme;

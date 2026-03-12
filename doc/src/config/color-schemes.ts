export interface ColorScheme {
  background: string;
  foreground: string;
  cursor: string;
  selectionBg: string;
  selectionFg: string;
  palette: [
    string, string, string, string, string, string, string, string,
    string, string, string, string, string, string, string, string,
  ];
  shikiTheme: NonNullable<import("astro").ShikiConfig["theme"]>;
  /** Optional semantic overrides — when omitted, defaults are used:
   *  surface=palette[0], muted=palette[8], accent=palette[6], accentHover=palette[14]
   *  codeBg=foreground, codeFg=background, success=palette[2], danger=palette[1],
   *  warning=palette[3], info=palette[4] */
  semantic?: {
    surface?: string;
    muted?: string;
    accent?: string;
    accentHover?: string;
    codeBg?: string;
    codeFg?: string;
    success?: string;
    danger?: string;
    warning?: string;
    info?: string;
  };
}

export const colorSchemes: Record<string, ColorScheme> = {
  "ZCSS Dark": {
    background: "#1a1614",
    foreground: "#c4b5a0",
    cursor: "oklch(55.5% 0.163 48.998)",
    selectionBg: "#3d3229",
    selectionFg: "#e8ddd0",
    palette: [
      "#1e1a17", "#da6871", "#93bb77", "#dfbb77",
      "#5caae9", "#c074d6", "oklch(55.5% 0.163 48.998)", "#b0a393",
      "#6b6058", "#da6871", "#93bb77", "#dfbb77",
      "#5caae9", "#c074d6", "oklch(65% 0.18 48.998)", "#c4b5a0",
    ],
    shikiTheme: "dracula",
    semantic: {
      accent: "oklch(55.5% 0.163 48.998)",
      accentHover: "oklch(65% 0.18 48.998)",
      muted: "#6b6058",
      surface: "#231f1c",
    },
  },
  "ZCSS Light": {
    background: "#faf6f1",
    foreground: "#3d3229",
    cursor: "oklch(55.5% 0.163 48.998)",
    selectionBg: "#3d3229",
    selectionFg: "#faf6f1",
    palette: [
      "#302923", "#bd4b53", "#266538", "#7a5218",
      "#3277c8", "#977acc", "oklch(55.5% 0.163 48.998)", "#7d7368",
      "#8a7f73", "#9c2d3f", "#327e48", "#654516",
      "#5b99dc", "#b89ee7", "oklch(50% 0.15 48.998)", "#9ba196",
    ],
    shikiTheme: "github-light",
    semantic: {
      accent: "oklch(55.5% 0.163 48.998)",
      accentHover: "oklch(50% 0.15 48.998)",
      surface: "#f0ebe4",
    },
  },
};

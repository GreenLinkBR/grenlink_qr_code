export type DotType = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
export type CornerSquareType = "square" | "extra-rounded" | "dot";
export type FrameFont = "sans" | "serif" | "mono";

export interface QRDesign {
  frame: number; // 0 = none, 1..7
  frameText: string;
  frameFont: FrameFont;
  frameColor: string;
  dotType: DotType;
  cornerType: CornerSquareType;
  fgColor: string;
  bgColor: string;
  logoDataUrl?: string;
  logoSize: number; // 0.1..0.3
}

export const DEFAULT_DESIGN: QRDesign = {
  frame: 0,
  frameText: "SCAN ME",
  frameFont: "sans",
  frameColor: "#000000",
  dotType: "rounded",
  cornerType: "extra-rounded",
  fgColor: "#1A6B3C",
  bgColor: "#FFFFFF",
  logoDataUrl: undefined,
  logoSize: 0.2,
};

export const FRAME_FONT_CSS: Record<FrameFont, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, monospace",
};

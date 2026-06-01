export type DotType = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
export type CornerSquareType = "square" | "extra-rounded" | "dot";

export interface QRDesign {
  frame: number; // 0 = none, 1..8
  dotType: DotType;
  cornerType: CornerSquareType;
  fgColor: string;
  bgColor: string;
  logoDataUrl?: string;
  logoSize: number; // 0.1..0.3
}

export const DEFAULT_DESIGN: QRDesign = {
  frame: 0,
  dotType: "rounded",
  cornerType: "extra-rounded",
  fgColor: "#1A6B3C",
  bgColor: "#FFFFFF",
  logoDataUrl: undefined,
  logoSize: 0.2,
};

import type { ReactNode } from "react";
import { QrCode } from "lucide-react";
import { FRAME_FONT_CSS, type QRDesign } from "@/lib/qr/design";

interface Props {
  design: Pick<QRDesign, "frame" | "frameText" | "frameFont" | "frameColor">;
  children: ReactNode;
  /** Scale factor for export sizing (1 = preview, ~3.6 for 1024px export) */
  scale?: number;
}

/**
 * Renders the QR (children) wrapped by the selected frame style.
 * Children should be a square element (the QR canvas/svg) that fills its parent.
 */
export function QRFrame({ design, children, scale = 1 }: Props) {
  const { frame, frameText, frameColor } = design;
  const font = FRAME_FONT_CSS[design.frameFont];
  const text = (frameText || "SCAN ME").toUpperCase();
  const s = (n: number) => `${n * scale}px`;

  // 0 — none
  if (frame === 0) {
    return <div className="w-full h-full grid place-items-center">{children}</div>;
  }

  const qrBox = (extra?: string) => (
    <div className={"bg-white grid place-items-center " + (extra ?? "")}>
      <div className="w-full h-full">{children}</div>
    </div>
  );

  // 1 — bottom label bar
  if (frame === 1) {
    return (
      <div className="inline-flex flex-col items-stretch" style={{ fontFamily: font }}>
        <div style={{ padding: s(6) }}>{children}</div>
        <div
          className="text-center font-bold text-white"
          style={{ background: frameColor, padding: `${s(8)} ${s(12)}`, fontSize: s(18), letterSpacing: s(1) }}
        >
          {text}
        </div>
      </div>
    );
  }

  // 2 — thin border + bottom label (inside border)
  if (frame === 2) {
    return (
      <div
        className="inline-flex flex-col items-stretch bg-white"
        style={{ border: `${s(3)} solid ${frameColor}`, borderRadius: s(6), fontFamily: font, padding: s(6) }}
      >
        <div>{children}</div>
        <div
          className="text-center font-bold text-white"
          style={{ background: frameColor, padding: `${s(6)} ${s(10)}`, fontSize: s(16), marginTop: s(6), borderRadius: s(2) }}
        >
          {text}
        </div>
      </div>
    );
  }

  // 3 — simple thin border
  if (frame === 3) {
    return (
      <div
        className="inline-block bg-white"
        style={{ border: `${s(4)} solid ${frameColor}`, borderRadius: s(4), padding: s(8), fontFamily: font }}
      >
        {children}
      </div>
    );
  }

  // 4 — rounded thick border (ornate)
  if (frame === 4) {
    return (
      <div
        className="inline-block bg-white"
        style={{
          border: `${s(6)} double ${frameColor}`,
          borderRadius: "50%",
          padding: s(20),
          fontFamily: font,
        }}
      >
        <div style={{ width: s(220), height: s(220) }}>{children}</div>
      </div>
    );
  }

  // 5 — phone shape (rounded with notch top + bottom bar label)
  if (frame === 5) {
    return (
      <div
        className="inline-flex flex-col items-stretch bg-white relative"
        style={{
          background: frameColor,
          borderRadius: s(28),
          padding: `${s(22)} ${s(10)} 0`,
          fontFamily: font,
        }}
      >
        {/* notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: s(8),
            width: s(40),
            height: s(4),
            background: "#fff",
            borderRadius: s(4),
            opacity: 0.6,
          }}
        />
        <div className="bg-white" style={{ padding: s(8), borderRadius: s(6) }}>
          {children}
        </div>
        <div
          className="text-center font-bold text-white"
          style={{ padding: `${s(10)} ${s(8)} ${s(14)}`, fontSize: s(18), letterSpacing: s(1) }}
        >
          {text}
        </div>
      </div>
    );
  }

  // 6 — phone-style with bottom rounded label tab (qr icon + text)
  if (frame === 6) {
    return (
      <div className="inline-flex flex-col items-stretch" style={{ fontFamily: font }}>
        <div
          className="bg-white"
          style={{ border: `${s(4)} solid ${frameColor}`, borderRadius: s(8), padding: s(8) }}
        >
          {children}
        </div>
        <div
          className="self-center inline-flex items-center text-white font-bold"
          style={{
            background: frameColor,
            borderRadius: s(999),
            padding: `${s(8)} ${s(18)} ${s(8)} ${s(8)}`,
            marginTop: s(-14),
            fontSize: s(18),
            gap: s(8),
          }}
        >
          <span
            className="grid place-items-center bg-white"
            style={{ width: s(28), height: s(28), borderRadius: "50%", color: frameColor }}
          >
            <QrCode style={{ width: s(18), height: s(18) }} />
          </span>
          {text}
        </div>
      </div>
    );
  }

  // 7 — clipboard / tab style (border with small top tab)
  return (
    <div className="inline-flex flex-col items-center" style={{ fontFamily: font }}>
      <div
        style={{
          background: frameColor,
          color: "#fff",
          padding: `${s(4)} ${s(16)}`,
          borderRadius: `${s(6)} ${s(6)} 0 0`,
          fontSize: s(12),
          fontWeight: 700,
        }}
      >
        {text}
      </div>
      <div
        className="bg-white"
        style={{
          border: `${s(3)} solid ${frameColor}`,
          borderRadius: s(6),
          padding: s(8),
        }}
      >
        {children}
      </div>
    </div>
  );
}

import { ReactNode } from "react";
import { Camera } from "lucide-react";

interface Props {
  frame: number;
  color: string;
  bg: string;
  children: ReactNode;
}

/**
 * Molduras externas (laterais) do QR Code.
 * O conteúdo do QR (children) permanece intacto — apenas o entorno muda.
 */
export function QRFrame({ frame, color, bg, children }: Props) {
  const inner = (
    <div className="relative grid place-items-center" style={{ background: bg }}>
      {children}
    </div>
  );

  switch (frame) {
    case 0:
      return <div className="grid place-items-center">{children}</div>;

    case 1: // borda fina quadrada
      return (
        <div
          className="p-3"
          style={{ border: `2px solid ${color}`, background: bg }}
        >
          {inner}
        </div>
      );

    case 2: // borda arredondada
      return (
        <div
          className="p-3 rounded-2xl"
          style={{ border: `3px solid ${color}`, background: bg }}
        >
          {inner}
        </div>
      );

    case 3: // borda grossa colorida
      return (
        <div
          className="p-4 rounded-3xl"
          style={{ border: `6px solid ${color}`, background: bg }}
        >
          {inner}
        </div>
      );

    case 4: // dupla borda
      return (
        <div
          className="p-2 rounded-2xl"
          style={{ border: `2px solid ${color}`, background: bg }}
        >
          <div
            className="p-2 rounded-xl"
            style={{ border: `2px solid ${color}`, background: bg }}
          >
            {inner}
          </div>
        </div>
      );

    case 5: // rótulo "SCAN ME" embaixo
      return (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `3px solid ${color}`, background: bg }}
        >
          <div className="p-3">{inner}</div>
          <div
            className="py-2 text-center text-sm font-bold tracking-widest"
            style={{ background: color, color: bg }}
          >
            SCAN ME
          </div>
        </div>
      );

    case 6: // rótulo "APONTE A CÂMERA" no topo
      return (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `3px solid ${color}`, background: bg }}
        >
          <div
            className="py-2 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
            style={{ background: color, color: bg }}
          >
            <Camera className="w-3.5 h-3.5" />
            APONTE A CÂMERA
          </div>
          <div className="p-3">{inner}</div>
        </div>
      );

    case 7: // cantos de foco (estilo câmera)
      return (
        <div className="relative p-4" style={{ background: bg }}>
          <CornerBrackets color={color} />
          {inner}
        </div>
      );

    case 8: // moldura redonda
      return (
        <div
          className="p-5 rounded-full"
          style={{ border: `4px solid ${color}`, background: bg }}
        >
          {inner}
        </div>
      );

    default:
      return <div className="grid place-items-center">{children}</div>;
  }
}

function CornerBrackets({ color }: { color: string }) {
  const c = { borderColor: color };
  return (
    <>
      <span className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 rounded-tl-lg" style={c} />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 rounded-tr-lg" style={c} />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 rounded-bl-lg" style={c} />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 rounded-br-lg" style={c} />
    </>
  );
}

export const FRAME_COUNT = 9;

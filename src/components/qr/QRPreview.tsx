import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Download, Save, QrCode } from "lucide-react";
import type { QRDesign } from "@/lib/qr/design";
import { QRFrame } from "@/components/qr/QRFrame";

interface Props {
  value: string;
  design: QRDesign;
  onDownload: () => void;
  onSave?: () => void;
  saving?: boolean;
  canSave?: boolean;
  qrRef: React.MutableRefObject<QRCodeStyling | null>;
  framedRef?: React.RefObject<HTMLDivElement | null>;
}

export function QRPreview({ value, design, onDownload, onSave, saving, canSave, qrRef, framedRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const qrSize = design.frame === 4 ? 220 : 240;

  const options = useMemo(() => ({
    width: qrSize,
    height: qrSize,
    type: "svg" as const,
    data: debounced || " ",
    margin: 4,
    dotsOptions: { color: design.fgColor, type: design.dotType },
    cornersSquareOptions: { color: design.fgColor, type: design.cornerType },
    cornersDotOptions: { color: design.fgColor },
    backgroundOptions: { color: design.bgColor },
    image: design.logoDataUrl,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: design.logoSize,
      margin: 4,
      crossOrigin: "anonymous" as const,
    },
  }), [debounced, design, qrSize]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
    } else {
      qrRef.current.update(options);
    }
    // Always (re)attach: when the frame changes the container div is
    // re-parented, so the previously appended SVG is no longer in the tree.
    if (containerRef.current.childElementCount === 0) {
      qrRef.current.append(containerRef.current);
    }
  }, [options, qrRef, design.frame]);

  const hasData = debounced.trim().length > 0;

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 lg:sticky lg:top-20">
      <div className="flex items-center gap-2 mb-5">
        <span className="grid place-items-center w-7 h-7 rounded-md bg-foreground text-background text-sm font-bold">3</span>
        <h3 className="text-base font-semibold">Baixar QR Code</h3>
      </div>

      <div className="w-full max-w-xs mx-auto rounded-xl bg-muted/30 grid place-items-center mb-4 overflow-hidden p-4 min-h-[300px]">
        {hasData ? (
          <div ref={framedRef} className="grid place-items-center">
            <QRFrame design={design}>
              <div
                ref={containerRef}
                className="grid place-items-center [&>svg]:block"
                style={{ width: qrSize, height: qrSize }}
              />
            </QRFrame>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
            <QrCode className="w-10 h-10 opacity-40" />
            Preencha os campos para gerar o QR
          </div>
        )}
      </div>

      <Button onClick={onDownload} disabled={!hasData} className="w-full" size="lg">
        <Download className="w-4 h-4 mr-2" />
        Baixar QR Code
      </Button>

      {onSave && (
        <Button
          onClick={onSave}
          disabled={!hasData || !canSave || saving}
          variant="outline"
          className="w-full mt-2"
          title={!canSave ? "Faça login para salvar seus QR Codes" : undefined}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar QR Code"}
        </Button>
      )}
    </div>
  );
}

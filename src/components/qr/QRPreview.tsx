import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Download, Save, QrCode } from "lucide-react";
import type { QRDesign } from "@/lib/qr/design";

interface Props {
  value: string;
  design: QRDesign;
  onDownload: () => void;
  onSave?: () => void;
  saving?: boolean;
  canSave?: boolean;
  qrRef: React.MutableRefObject<QRCodeStyling | null>;
}

export function QRPreview({ value, design, onDownload, onSave, saving, canSave, qrRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const options = useMemo(() => ({
    width: 280,
    height: 280,
    type: "svg" as const,
    data: debounced || " ",
    margin: 8,
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
  }), [debounced, design]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      containerRef.current.innerHTML = "";
      qrRef.current.append(containerRef.current);
    } else {
      qrRef.current.update(options);
    }
  }, [options, qrRef]);

  const hasData = debounced.trim().length > 0;

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 lg:sticky lg:top-20">
      <div className="flex items-center gap-2 mb-5">
        <span className="grid place-items-center w-7 h-7 rounded-md bg-foreground text-background text-sm font-bold">3</span>
        <h3 className="text-base font-semibold">Baixar QR Code</h3>
      </div>

      <div className="aspect-square w-full max-w-xs mx-auto rounded-xl bg-muted/50 grid place-items-center mb-4 overflow-hidden">
        {hasData ? (
          <div ref={containerRef} className="w-full h-full grid place-items-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[280px] [&>svg]:max-h-[280px]" />
        ) : (
          <div className="text-center text-muted-foreground p-6">
            <QrCode className="w-16 h-16 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Preencha o conteúdo para gerar</p>
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

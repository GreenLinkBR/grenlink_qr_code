import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import type { DotType, CornerSquareType, QRDesign, FrameFont } from "@/lib/qr/design";
import { cn } from "@/lib/utils";
import { QRFrame } from "@/components/qr/QRFrame";

interface Props {
  design: QRDesign;
  onChange: (d: QRDesign) => void;
}

const DOT_OPTIONS: { id: DotType; label: string }[] = [
  { id: "square", label: "Quadrado" },
  { id: "rounded", label: "Arredondado" },
  { id: "dots", label: "Pontos" },
  { id: "classy", label: "Clássico" },
];
const CORNER_OPTIONS: { id: CornerSquareType; label: string }[] = [
  { id: "square", label: "Quadrado" },
  { id: "extra-rounded", label: "Arredondado" },
  { id: "dot", label: "Círculo" },
];
const FONT_OPTIONS: { id: FrameFont; label: string }[] = [
  { id: "sans", label: "Sans-Serif" },
  { id: "serif", label: "Serifa" },
  { id: "mono", label: "Mono" },
];

// Mini fake QR for frame previews
function MiniQR() {
  return (
    <div
      className="bg-foreground/90"
      style={{
        width: 36,
        height: 36,
        backgroundImage:
          "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "6px 6px",
        backgroundPosition: "0 0, 3px 3px",
        color: "#fff",
      }}
    />
  );
}

export function DesignCustomizer({ design, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (patch: Partial<QRDesign>) => onChange({ ...design, ...patch });

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo deve ter no máximo 2MB");
      return;
    }
    if (!/^image\/(png|svg\+xml)$/.test(file.type)) {
      toast.error("Use PNG ou SVG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="grid place-items-center w-7 h-7 rounded-md bg-foreground text-background text-sm font-bold">2</span>
        <h3 className="text-base font-semibold">Design do QR Code</h3>
      </div>

      <Tabs defaultValue="frame">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="frame">Moldura</TabsTrigger>
          <TabsTrigger value="shape">Estilo</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="frame" className="mt-4 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => update({ frame: i })}
                className={cn(
                  "aspect-square rounded-xl border-2 grid place-items-center p-2 bg-muted/40 hover:bg-muted transition-colors overflow-hidden",
                  design.frame === i ? "border-primary ring-2 ring-primary/20" : "border-border"
                )}
                title={`Moldura ${i}`}
              >
                {i === 0 ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <div className="scale-[0.55] origin-center pointer-events-none">
                    <QRFrame design={{ ...design, frame: i }}>
                      <MiniQR />
                    </QRFrame>
                  </div>
                )}
              </button>
            ))}
          </div>

          {design.frame !== 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1.5 block">Texto da moldura</Label>
                  <Input
                    value={design.frameText}
                    onChange={(e) => update({ frameText: e.target.value.slice(0, 20) })}
                    placeholder="SCAN ME"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Fonte</Label>
                  <select
                    value={design.frameFont}
                    onChange={(e) => update({ frameFont: e.target.value as FrameFont })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Cor da moldura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={design.frameColor}
                    onChange={(e) => update({ frameColor: e.target.value })}
                    className="flex-1 font-mono"
                  />
                  <input
                    type="color"
                    value={design.frameColor}
                    onChange={(e) => update({ frameColor: e.target.value })}
                    className="w-14 h-10 rounded cursor-pointer border border-border"
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="shape" className="mt-4 space-y-5">
          <div>
            <Label className="text-sm mb-2 block">Módulo</Label>
            <div className="grid grid-cols-4 gap-2">
              {DOT_OPTIONS.map((o) => (
                <button
                  key={o.id} type="button"
                  onClick={() => update({ dotType: o.id })}
                  className={cn(
                    "py-2.5 px-2 rounded-lg text-xs font-medium border transition-colors",
                    design.dotType === o.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                  )}
                >{o.label}</button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm mb-2 block">Olhos</Label>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_OPTIONS.map((o) => (
                <button
                  key={o.id} type="button"
                  onClick={() => update({ cornerType: o.id })}
                  className={cn(
                    "py-2.5 px-2 rounded-lg text-xs font-medium border transition-colors",
                    design.cornerType === o.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
                  )}
                >{o.label}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Cor primária</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.fgColor} onChange={(e) => update({ fgColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer border border-border" />
                <span className="text-xs text-muted-foreground font-mono">{design.fgColor}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Cor de fundo</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={design.bgColor} onChange={(e) => update({ bgColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer border border-border" />
                <span className="text-xs text-muted-foreground font-mono">{design.bgColor}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logo" className="mt-4 space-y-4">
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
          {design.logoDataUrl ? (
            <div className="flex items-center gap-3">
              <img src={design.logoDataUrl} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-muted p-2" />
              <Button variant="outline" size="sm" onClick={() => update({ logoDataUrl: undefined })}>
                <X className="w-4 h-4 mr-1.5" /> Remover
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => fileRef.current?.click()} className="w-full">
              <Upload className="w-4 h-4 mr-2" /> Enviar logo (PNG/SVG, máx 2MB)
            </Button>
          )}
          <div>
            <Label className="text-sm mb-2 block">Tamanho do logo: {Math.round(design.logoSize * 100)}%</Label>
            <Slider min={10} max={30} step={1} value={[design.logoSize * 100]} onValueChange={([v]) => update({ logoSize: v / 100 })} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

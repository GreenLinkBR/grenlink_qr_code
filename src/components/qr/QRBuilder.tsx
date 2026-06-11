import { useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { QRTypeSelector } from "@/components/qr/QRTypeSelector";
import { DynamicForm } from "@/components/qr/DynamicForm";
import { DesignCustomizer } from "@/components/qr/DesignCustomizer";
import { QRPreview } from "@/components/qr/QRPreview";
import { DEFAULT_DESIGN, type QRDesign } from "@/lib/qr/design";
import { encodeQRContent, type QRType } from "@/lib/qr/types";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function QRBuilder() {
  const [type, setType] = useState<QRType>("link");
  const [data, setData] = useState<Record<string, string>>({});
  const [design, setDesign] = useState<QRDesign>(DEFAULT_DESIGN);
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const framedRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const value = encodeQRContent(type, data);

  const handleDownload = async () => {
    if (design.frame === 0) {
      const hi = new QRCodeStyling({
        width: 1024,
        height: 1024,
        type: "canvas",
        data: value,
        margin: 20,
        dotsOptions: { color: design.fgColor, type: design.dotType },
        cornersSquareOptions: { color: design.fgColor, type: design.cornerType },
        cornersDotOptions: { color: design.fgColor },
        backgroundOptions: { color: design.bgColor },
        image: design.logoDataUrl,
        imageOptions: { hideBackgroundDots: true, imageSize: design.logoSize, margin: 8, crossOrigin: "anonymous" },
      });
      await hi.download({ name: `greenlink-qr-${Date.now()}`, extension: "png" });
      return;
    }
    if (!framedRef.current) return;
    try {
      const dataUrl = await toPng(framedRef.current, {
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `greenlink-qr-${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível exportar a imagem.");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("qr_codes").insert({
      user_id: user.id,
      qr_type: type,
      content_data: data,
      design_config: design,
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
      console.error(error);
    } else {
      toast.success("QR Code salvo com sucesso!");
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
      <div className="lg:col-span-3 space-y-4 lg:space-y-6">
        <QRTypeSelector value={type} onChange={(t) => { setType(t); setData({}); }} />
        <DynamicForm type={type} data={data} onChange={setData} />
        <DesignCustomizer design={design} onChange={setDesign} />
      </div>
      <div className="lg:col-span-2">
        <QRPreview
          value={value}
          design={design}
          onDownload={handleDownload}
          onSave={handleSave}
          saving={saving}
          canSave={!!user}
          qrRef={qrRef}
          framedRef={framedRef}
        />
      </div>
    </div>
  );
}

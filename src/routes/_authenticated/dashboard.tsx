import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getTypeMeta, encodeQRContent, type QRType } from "@/lib/qr/types";
import { DEFAULT_DESIGN, type QRDesign } from "@/lib/qr/design";
import { Download, Trash2, Plus, QrCode } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Meus QR Codes — GreenLink" }] }),
  component: Dashboard,
});

interface QRRow {
  id: string;
  title: string | null;
  qr_type: string;
  content_data: Record<string, string>;
  design_config: QRDesign | null;
  created_at: string;
}

function Dashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState<QRRow[] | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Erro ao carregar"); return; }
    setRows((data as QRRow[]) ?? []);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este QR Code?")) return;
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("QR Code excluído"); setRows((r) => r?.filter((x) => x.id !== id) ?? null); }
  };

  const stats = {
    total: rows?.length ?? 0,
    thisMonth: rows?.filter((r) => new Date(r.created_at).getMonth() === new Date().getMonth()).length ?? 0,
    last: rows?.[0]?.created_at,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Meus QR Codes</h1>
        <Button asChild><Link to="/"><Plus className="w-4 h-4 mr-1.5" />Criar Novo QR</Link></Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total" value={String(stats.total)} />
        <StatCard label="Este mês" value={String(stats.thisMonth)} />
        <StatCard label="Último criado" value={stats.last ? new Date(stats.last).toLocaleDateString("pt-BR") : "—"} />
      </div>

      {rows === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0,1,2].map((i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-2xl">
          <QrCode className="w-16 h-16 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground mb-4">Você ainda não criou nenhum QR Code.</p>
          <Button asChild><Link to="/">Criar meu primeiro QR</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row) => <QRCard key={row.id} row={row} onDelete={() => handleDelete(row.id)} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function QRCard({ row, onDelete }: { row: QRRow; onDelete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const meta = getTypeMeta(row.qr_type);
  const design = row.design_config ?? DEFAULT_DESIGN;
  const value = encodeQRContent(row.qr_type as QRType, row.content_data ?? {});

  useEffect(() => {
    if (!ref.current || !value) return;
    const qr = new QRCodeStyling({
      width: 200, height: 200, type: "svg", data: value, margin: 4,
      dotsOptions: { color: design.fgColor, type: design.dotType },
      cornersSquareOptions: { color: design.fgColor, type: design.cornerType },
      backgroundOptions: { color: design.bgColor },
      image: design.logoDataUrl,
      imageOptions: { hideBackgroundDots: true, imageSize: design.logoSize, margin: 4 },
    });
    ref.current.innerHTML = "";
    qr.append(ref.current);
  }, [value, design]);

  const download = async () => {
    const qr = new QRCodeStyling({
      width: 1024, height: 1024, type: "canvas", data: value, margin: 20,
      dotsOptions: { color: design.fgColor, type: design.dotType },
      cornersSquareOptions: { color: design.fgColor, type: design.cornerType },
      backgroundOptions: { color: design.bgColor },
      image: design.logoDataUrl,
      imageOptions: { hideBackgroundDots: true, imageSize: design.logoSize, margin: 8 },
    });
    await qr.download({ name: `greenlink-${row.title ?? row.qr_type}-${Date.now()}`, extension: "png" });
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col">
      <div className="aspect-square bg-muted/40 rounded-xl grid place-items-center mb-3 overflow-hidden">
        <div ref={ref} className="[&>svg]:max-w-full [&>svg]:max-h-full" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
        <span className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString("pt-BR")}</span>
      </div>
      <p className="font-medium text-sm mb-3 truncate">{row.title ?? `${meta.label} — ${new Date(row.created_at).toLocaleDateString("pt-BR")}`}</p>
      <div className="flex gap-2 mt-auto">
        <Button size="sm" variant="outline" className="flex-1" onClick={download}><Download className="w-4 h-4" /></Button>
        <Button size="sm" variant="outline" onClick={onDelete}><Trash2 className="w-4 h-4 text-destructive" /></Button>
      </div>
    </div>
  );
}

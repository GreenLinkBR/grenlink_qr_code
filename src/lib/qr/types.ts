import {
  Link as LinkIcon, FileText, Mail, Phone, MessageSquare, Contact,
  MessageCircle, Wifi, FileDown, Smartphone, Image as ImageIcon,
  Video, Share2, CalendarDays, Barcode, Banknote,
} from "lucide-react";
import { buildPixPayload } from "./pix";

export type QRType =
  | "link" | "texto" | "email" | "ligacao" | "sms" | "vcard" | "whatsapp"
  | "wifi" | "pdf" | "app" | "imagens" | "video" | "redes" | "evento" | "barcode" | "pix";

export interface QRTypeMeta {
  id: QRType;
  label: string;
  icon: typeof LinkIcon;
  color: string;
}

export const QR_TYPES: QRTypeMeta[] = [
  { id: "link", label: "Link", icon: LinkIcon, color: "bg-blue-100 text-blue-700" },
  { id: "texto", label: "Texto", icon: FileText, color: "bg-slate-100 text-slate-700" },
  { id: "email", label: "E-mail", icon: Mail, color: "bg-amber-100 text-amber-700" },
  { id: "ligacao", label: "Ligação", icon: Phone, color: "bg-indigo-100 text-indigo-700" },
  { id: "sms", label: "SMS", icon: MessageSquare, color: "bg-purple-100 text-purple-700" },
  { id: "vcard", label: "V-Card", icon: Contact, color: "bg-rose-100 text-rose-700" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "bg-green-100 text-green-700" },
  { id: "wifi", label: "Wi-Fi", icon: Wifi, color: "bg-orange-100 text-orange-700" },
  { id: "pdf", label: "PDF", icon: FileDown, color: "bg-red-100 text-red-700" },
  { id: "app", label: "App", icon: Smartphone, color: "bg-sky-100 text-sky-700" },
  { id: "imagens", label: "Imagens", icon: ImageIcon, color: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "video", label: "Vídeo", icon: Video, color: "bg-pink-100 text-pink-700" },
  { id: "redes", label: "Redes Sociais", icon: Share2, color: "bg-teal-100 text-teal-700" },
  { id: "evento", label: "Evento", icon: CalendarDays, color: "bg-cyan-100 text-cyan-700" },
  { id: "barcode", label: "Código de Barras", icon: Barcode, color: "bg-stone-100 text-stone-700" },
  { id: "pix", label: "Pix", icon: Banknote, color: "bg-emerald-100 text-emerald-700" },
];

export const getTypeMeta = (id: string) =>
  QR_TYPES.find((t) => t.id === id) ?? QR_TYPES[0];

/** Strip control/script-like chars and clamp length */
function sanitize(s: string, max = 2000): string {
  return String(s ?? "")
    .replace(/<\s*\/?\s*script[^>]*>/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, max);
}

function escVCard(s: string) {
  return sanitize(s, 500).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

function escWifi(s: string) {
  return sanitize(s, 200).replace(/([\\;,":])/g, "\\$1");
}

function fmtDateICS(s: string) {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function encodeQRContent(type: QRType, data: Record<string, string>): string {
  switch (type) {
    case "link": {
      const url = sanitize(data.url, 2000).trim();
      if (!url) return "";
      return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }
    case "texto":
      return sanitize(data.text, 500);
    case "email": {
      const to = sanitize(data.email, 200).trim();
      if (!to) return "";
      const params = new URLSearchParams();
      if (data.subject) params.set("subject", sanitize(data.subject, 200));
      if (data.body) params.set("body", sanitize(data.body, 1000));
      const q = params.toString();
      return `mailto:${to}${q ? `?${q}` : ""}`;
    }
    case "ligacao": {
      const phone = sanitize(data.phone, 30).replace(/[^\d+]/g, "");
      return phone ? `tel:${phone}` : "";
    }
    case "sms": {
      const phone = sanitize(data.phone, 30).replace(/[^\d+]/g, "");
      if (!phone) return "";
      const msg = sanitize(data.message, 500);
      return msg ? `SMSTO:${phone}:${msg}` : `sms:${phone}`;
    }
    case "vcard": {
      const lines = [
        "BEGIN:VCARD", "VERSION:3.0",
        `FN:${escVCard(data.name || "")}`,
        data.company ? `ORG:${escVCard(data.company)}` : "",
        data.phone ? `TEL:${escVCard(data.phone)}` : "",
        data.email ? `EMAIL:${escVCard(data.email)}` : "",
        data.website ? `URL:${escVCard(data.website)}` : "",
        data.address ? `ADR:;;${escVCard(data.address)};;;;` : "",
        "END:VCARD",
      ].filter(Boolean);
      return data.name ? lines.join("\n") : "";
    }
    case "whatsapp": {
      const phone = sanitize(data.phone, 30).replace(/[^\d]/g, "");
      if (!phone) return "";
      const msg = data.message ? `?text=${encodeURIComponent(sanitize(data.message, 500))}` : "";
      return `https://wa.me/${phone}${msg}`;
    }
    case "wifi": {
      const ssid = escWifi(data.ssid || "");
      if (!ssid) return "";
      const security = (data.security || "WPA").toUpperCase();
      const pwd = security === "nopass" || security === "OPEN" ? "" : escWifi(data.password || "");
      const sec = security === "OPEN" || security === "NOPASS" ? "nopass" : security;
      return `WIFI:T:${sec};S:${ssid};P:${pwd};;`;
    }
    case "pdf":
    case "imagens":
    case "video": {
      const url = sanitize(data.url, 2000).trim();
      if (!url) return "";
      return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }
    case "app": {
      const ios = sanitize(data.ios, 500).trim();
      const android = sanitize(data.android, 500).trim();
      return ios || android || "";
    }
    case "redes": {
      const items = ["instagram", "twitter", "linkedin", "facebook", "tiktok"]
        .map((k) => data[k] && `${k}: ${sanitize(data[k], 200)}`)
        .filter(Boolean);
      return items.length ? items.join("\n") : "";
    }
    case "evento": {
      const title = sanitize(data.title, 200);
      if (!title) return "";
      const start = fmtDateICS(data.start);
      const end = fmtDateICS(data.end) || start;
      return [
        "BEGIN:VEVENT",
        `SUMMARY:${escVCard(title)}`,
        start ? `DTSTART:${start}` : "",
        end ? `DTEND:${end}` : "",
        data.location ? `LOCATION:${escVCard(data.location)}` : "",
        data.description ? `DESCRIPTION:${escVCard(data.description)}` : "",
        "END:VEVENT",
      ].filter(Boolean).join("\n");
    }
    case "barcode":
      return sanitize(data.text, 200);
    default:
      return "";
  }
}

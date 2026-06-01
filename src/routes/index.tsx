import { createFileRoute } from "@tanstack/react-router";
import { QRBuilder } from "@/components/qr/QRBuilder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GreenLink QR Gerador — Crie QR Codes Grátis Online" },
      { name: "description", content: "Gere QR Codes grátis para links, WhatsApp, Wi-Fi, V-Card e mais. Personalize cores, formatos e logo. Baixe em PNG." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Crie seu QR Code <span className="text-primary">grátis</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Personalize cores, formato e logo. Baixe em alta resolução. Faça login para salvar seus QR Codes.
        </p>
      </div>
      <QRBuilder />
    </div>
  );
}

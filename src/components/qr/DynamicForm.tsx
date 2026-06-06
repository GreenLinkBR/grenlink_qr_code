import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { QRType } from "@/lib/qr/types";

interface Props {
  type: QRType;
  data: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}

function Field({ id, label, children, hint }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function DynamicForm({ type, data, onChange }: Props) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="grid place-items-center w-7 h-7 rounded-md bg-foreground text-background text-sm font-bold">1</span>
        <h3 className="text-base font-semibold">Complete o conteúdo</h3>
      </div>

      <div className="space-y-4">
        {type === "link" && (
          <Field id="url" label="URL do site" hint="Será adicionado https:// se necessário">
            <Input id="url" placeholder="https://" value={data.url ?? ""} onChange={(e) => set("url", e.target.value)} />
          </Field>
        )}

        {type === "texto" && (
          <Field id="text" label="Texto" hint={`${(data.text ?? "").length}/500`}>
            <Textarea id="text" maxLength={500} rows={5} value={data.text ?? ""} onChange={(e) => set("text", e.target.value)} placeholder="Digite seu texto..." />
          </Field>
        )}

        {type === "email" && (
          <>
            <Field id="email" label="E-mail destinatário"><Input id="email" type="email" placeholder="nome@exemplo.com" value={data.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field id="subject" label="Assunto"><Input id="subject" value={data.subject ?? ""} onChange={(e) => set("subject", e.target.value)} /></Field>
            <Field id="body" label="Mensagem"><Textarea id="body" rows={4} value={data.body ?? ""} onChange={(e) => set("body", e.target.value)} /></Field>
          </>
        )}

        {type === "ligacao" && (
          <Field id="phone" label="Telefone" hint="Inclua o código do país (ex: +5511999999999)">
            <Input id="phone" placeholder="+55..." value={data.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        )}

        {type === "sms" && (
          <>
            <Field id="phone" label="Telefone"><Input id="phone" placeholder="+55..." value={data.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field id="message" label="Mensagem"><Textarea id="message" rows={3} value={data.message ?? ""} onChange={(e) => set("message", e.target.value)} /></Field>
          </>
        )}

        {type === "vcard" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="name" label="Nome completo"><Input id="name" value={data.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field id="company" label="Empresa"><Input id="company" value={data.company ?? ""} onChange={(e) => set("company", e.target.value)} /></Field>
            <Field id="phone" label="Telefone"><Input id="phone" value={data.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field id="email" label="E-mail"><Input id="email" type="email" value={data.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field id="website" label="Site"><Input id="website" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)} /></Field>
            <Field id="address" label="Endereço"><Input id="address" value={data.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Field>
          </div>
        )}

        {type === "whatsapp" && (
          <>
            <Field id="phone" label="Telefone (com DDI/DDD)" hint="Ex: +5511999999999"><Input id="phone" placeholder="+55..." value={data.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field id="message" label="Mensagem (opcional)"><Textarea id="message" rows={3} value={data.message ?? ""} onChange={(e) => set("message", e.target.value)} /></Field>
          </>
        )}

        {type === "wifi" && (
          <>
            <Field id="ssid" label="Nome da rede (SSID)"><Input id="ssid" value={data.ssid ?? ""} onChange={(e) => set("ssid", e.target.value)} /></Field>
            <Field id="password" label="Senha"><Input id="password" type="text" value={data.password ?? ""} onChange={(e) => set("password", e.target.value)} /></Field>
            <Field id="security" label="Segurança">
              <Select value={data.security ?? "WPA"} onValueChange={(v) => set("security", v)}>
                <SelectTrigger id="security"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="OPEN">Aberta (sem senha)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        {type === "pdf" && (
          <Field id="url" label="URL do PDF"><Input id="url" placeholder="https://" value={data.url ?? ""} onChange={(e) => set("url", e.target.value)} /></Field>
        )}

        {type === "app" && (
          <>
            <Field id="ios" label="URL App Store (iOS)"><Input id="ios" placeholder="https://apps.apple.com/..." value={data.ios ?? ""} onChange={(e) => set("ios", e.target.value)} /></Field>
            <Field id="android" label="URL Google Play (Android)"><Input id="android" placeholder="https://play.google.com/..." value={data.android ?? ""} onChange={(e) => set("android", e.target.value)} /></Field>
          </>
        )}

        {type === "imagens" && (
          <Field id="url" label="URL da imagem"><Input id="url" placeholder="https://" value={data.url ?? ""} onChange={(e) => set("url", e.target.value)} /></Field>
        )}

        {type === "video" && (
          <Field id="url" label="URL do vídeo"><Input id="url" placeholder="https://" value={data.url ?? ""} onChange={(e) => set("url", e.target.value)} /></Field>
        )}

        {type === "redes" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="instagram" label="Instagram"><Input id="instagram" placeholder="@user" value={data.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} /></Field>
            <Field id="twitter" label="X / Twitter"><Input id="twitter" placeholder="@user" value={data.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} /></Field>
            <Field id="linkedin" label="LinkedIn"><Input id="linkedin" value={data.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} /></Field>
            <Field id="facebook" label="Facebook"><Input id="facebook" value={data.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} /></Field>
            <Field id="tiktok" label="TikTok"><Input id="tiktok" placeholder="@user" value={data.tiktok ?? ""} onChange={(e) => set("tiktok", e.target.value)} /></Field>
          </div>
        )}

        {type === "evento" && (
          <>
            <Field id="title" label="Título"><Input id="title" value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="start" label="Início"><Input id="start" type="datetime-local" value={data.start ?? ""} onChange={(e) => set("start", e.target.value)} /></Field>
              <Field id="end" label="Fim"><Input id="end" type="datetime-local" value={data.end ?? ""} onChange={(e) => set("end", e.target.value)} /></Field>
            </div>
            <Field id="location" label="Local"><Input id="location" value={data.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
            <Field id="description" label="Descrição"><Textarea id="description" rows={3} value={data.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
          </>
        )}

        {type === "barcode" && (
          <Field id="text" label="Texto / código">
            <Input id="text" value={data.text ?? ""} onChange={(e) => set("text", e.target.value)} />
          </Field>
        )}

        {type === "pix" && (
          <>
            <Field id="key" label="Chave Pix" hint="CPF/CNPJ, e-mail, telefone (+55...) ou chave aleatória">
              <Input id="key" maxLength={77} value={data.key ?? ""} onChange={(e) => set("key", e.target.value)} placeholder="ex: nome@exemplo.com" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="name" label="Nome do recebedor" hint="Máx. 25 caracteres, sem acentos">
                <Input id="name" maxLength={25} value={data.name ?? ""} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field id="city" label="Cidade" hint="Máx. 15 caracteres">
                <Input id="city" maxLength={15} value={data.city ?? ""} onChange={(e) => set("city", e.target.value)} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="amount" label="Valor (opcional)" hint="Em reais, ex: 19.90">
                <Input id="amount" inputMode="decimal" placeholder="0,00" value={data.amount ?? ""} onChange={(e) => set("amount", e.target.value)} />
              </Field>
              <Field id="txid" label="Identificador / TXID (opcional)" hint="Apenas letras e números, máx. 25">
                <Input id="txid" maxLength={25} value={data.txid ?? ""} onChange={(e) => set("txid", e.target.value.replace(/[^A-Za-z0-9]/g, ""))} />
              </Field>
            </div>
            <Field id="description" label="Descrição (opcional)" hint="Máx. 50 caracteres">
              <Input id="description" maxLength={50} value={data.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

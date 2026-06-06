// EMV BR Code (Pix) payload builder
// Spec: Manual do BR Code / Pix do Banco Central

export interface PixInput {
  key: string;
  name: string;
  city: string;
  amount?: string;
  txid?: string;
  description?: string;
}

/** Remove diacritics and non-ASCII chars (Pix recomenda ASCII puro) */
function toAscii(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

/** TLV: ID (2) + LENGTH (2, zero-padded) + VALUE */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

/** CRC16-CCITT (poly 0x1021, init 0xFFFF) — padrão Pix */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitizeTxid(t: string): string {
  const clean = (t ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 25);
  return clean || "***";
}

function sanitizeAmount(a?: string): string | undefined {
  if (!a) return undefined;
  const n = Number(String(a).replace(",", "."));
  if (!isFinite(n) || n <= 0) return undefined;
  return n.toFixed(2);
}

export function buildPixPayload(input: PixInput): string {
  const key = (input.key ?? "").trim();
  const name = toAscii(input.name ?? "").slice(0, 25).trim();
  const city = toAscii(input.city ?? "").slice(0, 15).trim();
  if (!key || !name || !city) return "";

  // Merchant Account Information (ID 26)
  const gui = tlv("00", "br.gov.bcb.pix");
  const keyField = tlv("01", key.slice(0, 77));
  const desc = input.description ? toAscii(input.description).slice(0, 50).trim() : "";
  const descField = desc ? tlv("02", desc) : "";
  const merchantAccount = tlv("26", gui + keyField + descField);

  const payloadFormat = tlv("00", "01");
  const merchantCategory = tlv("52", "0000");
  const currency = tlv("53", "986"); // BRL
  const amount = sanitizeAmount(input.amount);
  const amountField = amount ? tlv("54", amount) : "";
  const country = tlv("58", "BR");
  const nameField = tlv("59", name);
  const cityField = tlv("60", city);
  const txid = sanitizeTxid(input.txid ?? "");
  const addData = tlv("62", tlv("05", txid));

  const partial =
    payloadFormat +
    merchantAccount +
    merchantCategory +
    currency +
    amountField +
    country +
    nameField +
    cityField +
    addData +
    "6304"; // CRC field id + length, value calculated over this prefix

  return partial + crc16(partial);
}

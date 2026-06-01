import { QR_TYPES, type QRType } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

interface Props {
  value: QRType;
  onChange: (v: QRType) => void;
}

export function QRTypeSelector({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-3 sm:p-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {QR_TYPES.map((t) => {
          const Icon = t.icon;
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors min-h-11",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

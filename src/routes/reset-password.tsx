import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha — GreenLink" }] }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Senha deve ter pelo menos 6 caracteres");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl font-bold">Nova senha</h1>
        <div className="space-y-1.5">
          <Label htmlFor="np">Senha</Label>
          <Input id="np" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Salvando..." : "Atualizar senha"}</Button>
      </form>
    </div>
  );
}

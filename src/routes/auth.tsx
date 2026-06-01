import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({ tab: z.enum(["login", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Entrar — GreenLink QR Gerador" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error("E-mail ou senha incorretos");
    toast.success("Bem-vindo!");
    navigate({ to: "/dashboard" });
  };

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Senha deve ter pelo menos 6 caracteres");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Verifique seu e-mail para confirmar a conta");
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error("Google OAuth não está habilitado no seu Supabase");
  };

  const forgot = async () => {
    if (!email) return toast.error("Informe seu e-mail acima");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("E-mail de recuperação enviado");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-10">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Acesse sua conta</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Salve e gerencie seus QR Codes</p>

        <Tabs defaultValue={tab ?? "login"}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={login} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="le">E-mail</Label>
                <Input id="le" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lp">Senha</Label>
                <Input id="lp" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="button" onClick={forgot} className="text-xs text-primary hover:underline">Esqueci minha senha</button>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={signup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="se">E-mail</Label>
                <Input id="se" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sp">Senha (mín. 6 caracteres)</Label>
                <Input id="sp" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Criando..." : "Criar Conta"}</Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px bg-border flex-1" /> ou <span className="h-px bg-border flex-1" />
        </div>

        <Button variant="outline" className="w-full" onClick={google}>
          Continuar com Google
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-6">
          <Link to="/" className="hover:underline">← Voltar ao gerador</Link>
        </p>
      </div>
    </div>
  );
}

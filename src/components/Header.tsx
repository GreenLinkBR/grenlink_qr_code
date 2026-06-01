import { Link, useNavigate } from "@tanstack/react-router";
import { QrCode, LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email?.[0]?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface border-b border-border">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <QrCode className="w-5 h-5" />
          </span>
          <span className="font-bold text-lg tracking-tight">
            Green<span className="text-primary">Link</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">
                  <LayoutGrid className="w-4 h-4 mr-1.5" />
                  Meus QR Codes
                </Link>
              </Button>
              <div
                className="w-9 h-9 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold text-sm"
                title={user.email ?? ""}
              >
                {initials}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth" search={{ tab: "login" }}>Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ tab: "signup" }}>Criar Conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

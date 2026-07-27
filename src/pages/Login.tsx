import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Button, Field, Input } from "../components/ui";

export default function Login() {
  const { signIn, resetPassword, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Couldn't send reset email.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-hexgrid">
      <Card className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <img src="/assets/logo.png" alt="" className="w-8 h-8 rounded-md" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          <span className="font-mono font-semibold text-ink">Johnres Admin</span>
        </div>

        {!configured && (
          <p className="text-sm text-ink-muted mb-4">
            Firebase isn't configured yet. Add credentials to <code className="text-cyan-bright">.env</code> — see
            the README.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>

          {error && <p className="text-sm text-red-300">{error}</p>}
          {resetSent && <p className="text-sm text-green-300">Password reset email sent.</p>}

          <Button type="submit" disabled={busy || !configured} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-ink-dim hover:text-cyan-bright block mx-auto"
          >
            Forgot password?
          </button>
        </form>
      </Card>
    </div>
  );
}

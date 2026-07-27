import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();

  if (!configured) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-mono text-lg text-ink mb-2">Firebase isn't configured yet</h1>
          <p className="text-sm text-ink-muted">
            Add your Firebase project credentials to a <code className="text-cyan-bright">.env</code> file (see{" "}
            <code className="text-cyan-bright">.env.example</code>) to enable login.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-ink-muted font-mono text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card, Button } from "../components/ui";

export default function Profile() {
  const { user, resetPassword } = useAuth();
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!user?.email) return;
    await resetPassword(user.email);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <PageHeader title="Profile" />
      <Card className="max-w-md">
        <p className="text-xs text-ink-dim font-mono mb-1">Signed in as</p>
        <p className="text-ink mb-6">{user?.email}</p>
        <Button variant="secondary" onClick={handleReset}>
          {sent ? "Reset email sent!" : "Send password reset email"}
        </Button>
      </Card>
    </div>
  );
}

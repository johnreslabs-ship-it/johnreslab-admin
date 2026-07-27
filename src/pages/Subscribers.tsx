import { useState } from "react";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Input, EmptyState } from "../components/ui";
import type { Subscriber } from "../types/content";

export default function Subscribers() {
  const { items, loading, create, remove } = useCollection<Subscriber>("subscribers");
  const [email, setEmail] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await create({ email: email.trim(), subscribedAt: Date.now() });
    setEmail("");
  }

  function exportCsv() {
    const rows = ["email,subscribedAt", ...items.map((s) => `${s.email},${s.subscribedAt ? new Date(s.subscribedAt).toISOString() : ""}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="Manage your newsletter list."
        action={<Button variant="secondary" onClick={exportCsv} disabled={items.length === 0}>Export CSV</Button>}
      />

      <Card className="mb-6 max-w-md">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input placeholder="Add an email manually…" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <Button type="submit">Add</Button>
        </form>
        <p className="text-xs text-ink-dim mt-3">
          There's no public signup form wired up yet — this list is managed manually for now. A future update can add
          a subscribe form to the public site that writes here directly.
        </p>
      </Card>

      {loading && <p className="text-sm text-ink-muted">Loading…</p>}
      {!loading && items.length === 0 && <EmptyState message="No subscribers yet." />}

      <div className="space-y-2">
        {items.map((s) => (
          <Card key={s.id} className="flex items-center justify-between py-3">
            <span className="text-sm text-ink font-mono">{s.email}</span>
            <Button variant="danger" onClick={() => remove(s.id)}>Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

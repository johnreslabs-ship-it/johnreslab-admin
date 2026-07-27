import { useState } from "react";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Field, Input, EmptyState } from "../components/ui";
import type { Category } from "../types/content";

export default function CategoriesManager() {
  const { items, loading, create, remove } = useCollection<Category>("categories");
  const [name, setName] = useState("");
  const [type, setType] = useState<"blog" | "download">("blog");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await create({ name: name.trim(), type });
    setName("");
  }

  return (
    <div>
      <PageHeader title="Categories" description="Used to organize blog posts and downloads." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Category name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Networking" />
            </Field>
            <Field label="Used for">
              <div className="flex gap-3 text-sm">
                <label className="flex items-center gap-2 text-ink-muted">
                  <input type="radio" checked={type === "blog"} onChange={() => setType("blog")} className="accent-cyan-400" />
                  Blog
                </label>
                <label className="flex items-center gap-2 text-ink-muted">
                  <input type="radio" checked={type === "download"} onChange={() => setType("download")} className="accent-cyan-400" />
                  Downloads
                </label>
              </div>
            </Field>
            <Button type="submit">Add Category</Button>
          </form>
        </Card>

        <div className="space-y-3">
          {loading && <p className="text-sm text-ink-muted">Loading…</p>}
          {!loading && items.length === 0 && <EmptyState message="No categories yet." />}
          {(["blog", "download"] as const).map((t) => (
            <div key={t}>
              <h3 className="text-xs uppercase tracking-widest text-ink-dim mb-2">{t === "blog" ? "Blog categories" : "Download categories"}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {items.filter((c) => c.type === t).map((c) => (
                  <span key={c.id} className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md border border-cyan-400/25 text-cyan-bright bg-cyan-400/5">
                    {c.name}
                    <button onClick={() => remove(c.id)} className="text-ink-dim hover:text-red-300">×</button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

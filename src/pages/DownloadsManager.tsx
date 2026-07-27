import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Field, Input, Textarea, EmptyState } from "../components/ui";
import type { DownloadItem, Category } from "../types/content";

const empty: Omit<DownloadItem, "id"> = { name: "", category: "Cheat Sheets", format: "PDF", description: "", href: "" };

export default function DownloadsManager() {
  const { items, loading, create, update, remove } = useCollection<DownloadItem>("downloads");
  const { items: categories } = useCollection<Category>("categories");
  const [form, setForm] = useState<Omit<DownloadItem, "id">>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function startEdit(d: DownloadItem) {
    setEditingId(d.id);
    setForm({ name: d.name, category: d.category, format: d.format, description: d.description, href: d.href });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const path = `downloads/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, href: url, format: file.name.split(".").pop()?.toUpperCase() ?? f.format }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await update(editingId, form);
    else await create({ ...form, createdAt: Date.now() });
    resetForm();
  }

  const downloadCategories = categories.filter((c) => c.type === "download");

  return (
    <div>
      <PageHeader title="Downloads" description="Cheat sheets, scripts, and templates shown on the public Downloads page." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-navy border border-cyan-400/20 text-ink focus:outline-none focus:border-cyan-400/60"
                >
                  {(downloadCategories.length ? downloadCategories.map((c) => c.name) : ["Cheat Sheets", "Scripts", "Documentation", "Network Diagrams"]).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Format">
                <Input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} />
              </Field>
            </div>
            <Field label="File URL" hint="Upload a file below, or paste an external link (e.g. a GitHub repo) directly.">
              <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
            </Field>
            <Field label="Or upload a file">
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="text-sm text-ink-muted"
              />
              {uploading && <span className="text-xs text-cyan block mt-1">Uploading…</span>}
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Save Changes" : "Add Download"}</Button>
              {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
            </div>
          </form>
        </Card>

        <div className="space-y-3">
          {loading && <p className="text-sm text-ink-muted">Loading…</p>}
          {!loading && items.length === 0 && <EmptyState message="No downloads yet." />}
          {items.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">{d.name}</h3>
                  <p className="text-xs text-ink-dim">{d.category} · {d.format}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" onClick={() => startEdit(d)}>Edit</Button>
                  <Button variant="danger" onClick={() => confirm(`Delete "${d.name}"?`) && remove(d.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

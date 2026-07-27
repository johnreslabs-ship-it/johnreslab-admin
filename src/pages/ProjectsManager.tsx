import { useState } from "react";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Field, Input, Textarea, EmptyState } from "../components/ui";
import type { Project } from "../types/content";

const empty: Omit<Project, "id"> = { name: "", description: "", tech: [], repo: "", demo: "" };

export default function ProjectsManager() {
  const { items, loading, create, update, remove } = useCollection<Project>("projects");
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, tech: p.tech, repo: p.repo, demo: p.demo });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) await update(editingId, form);
    else await create({ ...form, createdAt: Date.now() });
    resetForm();
  }

  return (
    <div>
      <PageHeader title="Projects" description="Portfolio projects shown on the public Projects page." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Technologies" hint="Comma separated">
              <Input
                value={form.tech.join(", ")}
                onChange={(e) => setForm({ ...form, tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <Input value={form.repo} onChange={(e) => setForm({ ...form, repo: e.target.value })} />
              </Field>
              <Field label="Demo URL">
                <Input value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} />
              </Field>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Save Changes" : "Add Project"}</Button>
              {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
            </div>
          </form>
        </Card>

        <div className="space-y-3">
          {loading && <p className="text-sm text-ink-muted">Loading…</p>}
          {!loading && items.length === 0 && <EmptyState message="No projects yet." />}
          {items.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">{p.name}</h3>
                  <p className="text-xs text-ink-muted mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" onClick={() => startEdit(p)}>Edit</Button>
                  <Button variant="danger" onClick={() => confirm(`Delete "${p.name}"?`) && remove(p.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

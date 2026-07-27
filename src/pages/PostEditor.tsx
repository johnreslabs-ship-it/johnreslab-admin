import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { marked } from "marked";
import { db } from "../lib/firebase";
import { useCollection } from "../lib/useCollection";
import { slugify } from "../lib/slug";
import { PageHeader, Card, Button, Field, Input, Textarea } from "../components/ui";
import type { BlogPost, Category } from "../types/content";

const emptyPost: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  category: "How-To",
  tags: [],
  excerpt: "",
  content: "",
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
};

export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const navigate = useNavigate();
  const { create, update } = useCollection<BlogPost>("posts");
  const { items: categories } = useCollection<Category>("categories");

  const [form, setForm] = useState<Omit<BlogPost, "id">>(emptyPost);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"content" | "seo">("content");

  useEffect(() => {
    if (isNew || !db) return;
    getDoc(doc(db, "posts", id!)).then((snap) => {
      if (snap.exists()) {
        setForm(snap.data() as Omit<BlogPost, "id">);
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  async function handleSave(status?: "draft" | "published") {
    setSaving(true);
    const payload = { ...form, status: status ?? form.status, updatedAt: Date.now(), createdAt: form.createdAt ?? Date.now() };
    try {
      if (isNew) {
        await create(payload);
      } else {
        await update(id!, payload);
      }
      navigate("/posts");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink-muted text-sm">Loading…</p>;

  const blogCategories = categories.filter((c) => c.type === "blog");

  return (
    <div>
      <PageHeader
        title={isNew ? "New Post" : "Edit Post"}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" disabled={saving} onClick={() => handleSave("draft")}>
              Save Draft
            </Button>
            <Button disabled={saving} onClick={() => handleSave("published")}>
              {saving ? "Saving…" : "Publish"}
            </Button>
          </div>
        }
      />

      <div className="flex gap-2 mb-6">
        {(["content", "seo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              tab === t ? "border-cyan-400/70 text-cyan-bright bg-cyan-400/5" : "border-cyan-400/15 text-ink-muted"
            }`}
          >
            {t === "content" ? "Content" : "SEO"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <Field label="Title">
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
            </Field>
            <Field label="Slug" hint="Auto-generated from title — edit if you want a custom URL.">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-navy border border-cyan-400/20 text-ink focus:outline-none focus:border-cyan-400/60"
                >
                  {(blogCategories.length ? blogCategories.map((c) => c.name) : ["How-To"]).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags" hint="Comma separated">
                <Input
                  value={form.tags.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))}
                />
              </Field>
            </div>
            <Field label="Excerpt">
              <Textarea rows={3} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
            </Field>
            <Field label="Content (Markdown)">
              <Textarea rows={16} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
            </Field>
          </Card>

          <Card>
            <h3 className="font-semibold text-ink mb-3 text-sm">Live preview</h3>
            <div
              className="prose-invert text-sm text-ink-muted max-h-[40rem] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: marked.parse(form.content || "*Nothing yet…*", { async: false }) as string }}
            />
          </Card>
        </div>
      )}

      {tab === "seo" && (
        <Card className="space-y-4 max-w-xl">
          <Field label="Meta Title" hint="Shown in search results and browser tabs. Falls back to the post title if empty.">
            <Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} />
          </Field>
          <Field label="Meta Description" hint="Falls back to the excerpt if empty.">
            <Textarea rows={3} value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} />
          </Field>
          <Field label="OG Image URL" hint="Upload an image in Media Library first, then paste its URL here.">
            <Input value={form.ogImage} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} />
          </Field>
        </Card>
      )}
    </div>
  );
}

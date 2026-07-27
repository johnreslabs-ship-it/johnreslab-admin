import { useState } from "react";
import { orderBy } from "firebase/firestore";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Field, Input, EmptyState } from "../components/ui";
import type { FeaturedVideo } from "../types/content";

const empty = { videoId: "", title: "", order: 0 };

export default function YouTubeManager() {
  const { items, loading, create, remove } = useCollection<FeaturedVideo>("featuredVideos", [orderBy("order", "asc")]);
  const [form, setForm] = useState(empty);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.videoId.trim()) return;
    await create({ ...form, order: items.length });
    setForm(empty);
  }

  return (
    <div>
      <PageHeader
        title="Featured Videos"
        description="Pin specific videos to show first on the public YouTube page, above the live-fetched uploads."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="YouTube Video ID" hint="The part after v= in the video URL, e.g. dQw4w9WgXcQ">
              <Input value={form.videoId} onChange={(e) => setForm({ ...form, videoId: e.target.value })} />
            </Field>
            <Field label="Title">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Button type="submit">Add Featured Video</Button>
          </form>
        </Card>

        <div className="space-y-3">
          {loading && <p className="text-sm text-ink-muted">Loading…</p>}
          {!loading && items.length === 0 && <EmptyState message="No featured videos pinned yet." />}
          {items.map((v) => (
            <Card key={v.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{v.title || v.videoId}</p>
                <p className="text-xs text-ink-dim">youtube.com/watch?v={v.videoId}</p>
              </div>
              <Button variant="danger" onClick={() => remove(v.id)}>Remove</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

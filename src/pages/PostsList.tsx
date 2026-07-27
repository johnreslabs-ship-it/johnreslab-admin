import { Link } from "react-router-dom";
import { useCollection } from "../lib/useCollection";
import { PageHeader, Card, Button, Badge, EmptyState } from "../components/ui";
import type { BlogPost } from "../types/content";

export default function PostsList() {
  const { items, loading, remove, update } = useCollection<BlogPost>("posts");

  const sorted = [...items].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Create, edit, and publish tutorials."
        action={
          <Link to="/posts/new">
            <Button>New Post</Button>
          </Link>
        }
      />

      {loading && <p className="text-sm text-ink-muted">Loading…</p>}
      {!loading && sorted.length === 0 && <EmptyState message="No posts yet — create your first one." />}

      <div className="space-y-3">
        {sorted.map((post) => (
          <Card key={post.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={post.status === "published" ? "green" : "yellow"}>{post.status}</Badge>
                <span className="text-xs text-ink-dim">{post.category}</span>
              </div>
              <h3 className="font-semibold text-ink truncate">{post.title}</h3>
              <p className="text-xs text-ink-dim truncate">/blog/{post.slug}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                onClick={() => update(post.id, { status: post.status === "published" ? "draft" : "published" })}
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </Button>
              <Link to={`/posts/${post.id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm(`Delete "${post.title}"? This can't be undone.`)) remove(post.id);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

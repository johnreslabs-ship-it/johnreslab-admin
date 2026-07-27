import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCollection } from "../lib/useCollection";
import { Card, PageHeader, EmptyState } from "../components/ui";
import type { BlogPost, Project, DownloadItem, Subscriber } from "../types/content";

export default function Dashboard() {
  const { items: posts } = useCollection<BlogPost>("posts");
  const { items: projects } = useCollection<Project>("projects");
  const { items: downloads } = useCollection<DownloadItem>("downloads");
  const { items: subscribers } = useCollection<Subscriber>("subscribers");

  const [pageViews, setPageViews] = useState<{ path: string; count: number }[] | null>(null);
  const [viewsLoading, setViewsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setViewsLoading(false);
      return;
    }
    getDocs(collection(db, "pageviews"))
      .then((snap) => {
        setPageViews(snap.docs.map((d) => d.data() as { path: string; count: number }));
      })
      .catch(() => setPageViews([]))
      .finally(() => setViewsLoading(false));
  }, []);

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const totalViews = pageViews ? pageViews.reduce((a, b) => a + b.count, 0) : 0;
  const topPages = pageViews ? [...pageViews].sort((a, b) => b.count - a.count).slice(0, 6) : [];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your content and site traffic." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Published Posts" value={published} />
        <StatCard label="Drafts" value={drafts} />
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Downloads" value={downloads.length} />
        <StatCard label="Subscribers" value={subscribers.length} />
        <StatCard label="Total Page Views" value={totalViews} />
      </div>

      <Card>
        <h2 className="font-semibold text-ink mb-4">Most viewed pages</h2>
        {viewsLoading && <p className="text-sm text-ink-muted">Loading…</p>}
        {!viewsLoading && topPages.length === 0 && (
          <EmptyState message="No page views recorded yet — this fills in once the public site's analytics hook is deployed and configured with the same Firebase project." />
        )}
        {!viewsLoading && topPages.length > 0 && (
          <div className="space-y-2">
            {topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between px-3 py-2 rounded-md bg-navy border border-cyan-400/10">
                <span className="font-mono text-sm text-ink-muted">{p.path}</span>
                <span className="font-mono text-sm text-cyan-bright">{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-mono text-cyan-bright">{value}</p>
      <p className="text-xs text-ink-dim mt-1">{label}</p>
    </Card>
  );
}
